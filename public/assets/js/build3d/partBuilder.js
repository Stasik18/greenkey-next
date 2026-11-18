/**
 * Сборщик группы этапа.
 *
 * Все элементы дома описываются как экземпляры небольшого числа геометрий и
 * складываются в InstancedMesh по паре «геометрия + материал». Каркас из двух
 * сотен стоек стоит при этом один draw call, а не двести, — без этого сцена
 * не удержала бы кадр на мобильных.
 *
 * Появление элемента — это опускание на своё место с затуханием. Движение
 * одинаково для всех этапов (сваю забивают, стойку ставят, окно монтируют),
 * поэтому сборка читается как один спокойный процесс, а не как набор трюков.
 */

/**
 * Насколько высоко над своим местом элемент начинает движение, м. Держим
 * небольшим: чем выше подлёт, тем сильнее промежуточный кадр читается как
 * разобранный дом, а не как монтаж.
 */
const RISE_DISTANCE = 0.85;
/** Доля прогресса группы, которую занимает разбег между первым и последним элементом. */
const STAGGER_SPAN = 0.42;
/** Доля прогресса группы, за которую элементы становятся полностью непрозрачными. */
const FADE_SPAN = 0.26;

/**
 * Материалы, которые не должны отбрасывать тень: стекло почернило бы стены,
 * а нащельники фасада дали бы только муар на собственной плоскости.
 */
const NON_CASTING_MATERIALS = new Set(["glass", "glow", "batten"]);

export class PartBuilder {
  constructor(THREE, materials) {
    this.THREE = THREE;
    this.materials = materials;
    this.specs = [];
    this.geometries = new Map();

    this.geometries.set("box", new THREE.BoxGeometry(1, 1, 1));
  }

  /**
   * Прямоугольный объём. Основной строительный кирпич: сваи, стойки, обвязки,
   * панели стен, плиты кровли — всё это коробки разного масштаба.
   */
  box(spec) {
    return this.part("box", spec);
  }

  /** Регистрирует произвольную геометрию (например, треугольный фронтон). */
  geometry(key, factory) {
    if (!this.geometries.has(key)) this.geometries.set(key, factory());
    return key;
  }

  part(
    geometryKey,
    { pos, size = [1, 1, 1], rot = [0, 0, 0], material, order },
  ) {
    this.specs.push({ geometryKey, pos, size, rot, material, order });
    return this;
  }

  build() {
    const { THREE } = this;
    const group = new THREE.Group();
    const batches = new Map();

    const total = Math.max(this.specs.length - 1, 1);
    this.specs.forEach((spec, index) => {
      const key = `${spec.geometryKey}|${spec.material}`;
      if (!batches.has(key)) {
        batches.set(key, {
          geometryKey: spec.geometryKey,
          material: spec.material,
          items: [],
        });
      }
      batches.get(key).items.push({
        ...spec,
        order: spec.order === undefined ? index / total : spec.order,
      });
    });

    const meshes = [];
    const matrix = new THREE.Matrix4();
    const quaternion = new THREE.Quaternion();
    const euler = new THREE.Euler();
    const position = new THREE.Vector3();
    const scale = new THREE.Vector3();

    for (const batch of batches.values()) {
      const geometry = this.geometries.get(batch.geometryKey);
      const material = this.materials[batch.material];
      const mesh = new THREE.InstancedMesh(
        geometry,
        material,
        batch.items.length,
      );

      mesh.castShadow = !NON_CASTING_MATERIALS.has(batch.material);
      mesh.receiveShadow = true;
      // Экземпляры смещаются по вертикали во время сборки, поэтому границы
      // меша плывут — отсечение по фрустуму отключено, чтобы части дома
      // не исчезали на близких ракурсах камеры.
      mesh.frustumCulled = false;

      batch.items.forEach((item, index) => {
        euler.set(item.rot[0], item.rot[1], item.rot[2]);
        quaternion.setFromEuler(euler);
        position.set(item.pos[0], item.pos[1], item.pos[2]);
        scale.set(item.size[0], item.size[1], item.size[2]);
        matrix.compose(position, quaternion, scale);
        mesh.setMatrixAt(index, matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;

      group.add(mesh);
      meshes.push({
        mesh,
        items: batch.items,
        base: captureMatrices(THREE, mesh, batch.items.length),
      });
    }

    return createBuildGroup(
      THREE,
      group,
      meshes,
      this.materials,
      this.geometries,
    );
  }
}

function captureMatrices(THREE, mesh, count) {
  const matrices = [];
  for (let i = 0; i < count; i++) {
    const matrix = new THREE.Matrix4();
    mesh.getMatrixAt(i, matrix);
    matrices.push(matrix);
  }
  return matrices;
}

function createBuildGroup(THREE, group, meshes, materials, geometries) {
  const matrix = new THREE.Matrix4();
  let lastProgress = -1;
  // Матрицы, записанные в build(), уже соответствуют собранному состоянию,
  // поэтому на старте они «покоятся» на прогрессе 1.
  let restingAtOne = true;

  function setProgress(progress) {
    const p = progress < 0 ? 0 : progress > 1 ? 1 : progress;
    if (p === lastProgress) return;
    lastProgress = p;

    group.visible = p > 0.0005;
    materials.setOpacity(easeOutCubic(clamp01(p / FADE_SPAN)));

    // Скрытую группу пересчитывать незачем, как и уже собранную: её матрицы
    // остаются актуальными до первого промежуточного значения прогресса.
    if (!group.visible) return;
    if (p === 1 && restingAtOne) return;
    restingAtOne = p === 1;

    for (const entry of meshes) {
      const { mesh, items, base } = entry;
      for (let i = 0; i < items.length; i++) {
        const local = clamp01(
          (p - items[i].order * STAGGER_SPAN) / (1 - STAGGER_SPAN),
        );
        matrix.copy(base[i]);
        // elements[13] — вертикальная составляющая переноса в матрице 4×4.
        matrix.elements[13] += (1 - easeOutCubic(local)) * RISE_DISTANCE;
        mesh.setMatrixAt(i, matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    }
  }

  return {
    group,
    setProgress,
    dispose() {
      for (const { mesh } of meshes) {
        mesh.dispose();
        group.remove(mesh);
      }
      for (const geometry of geometries.values()) geometry.dispose();
      geometries.clear();
      materials.dispose();
    },
  };
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

export function clamp01(value) {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}
