/**
 * Этап B — греибокс утверждённого дома «Вертикальный такт».
 *
 * Модель намеренно серая и без единого материала: здесь проверяются только
 * силуэт, пропорции, глубина террасы, положение входа и читаемость камеры.
 * Любой цвет мешал бы — глаз начинает оценивать отделку вместо формы.
 *
 * Геометрия целиком выводится из `house-spec-v2.js`. Ни одного размера в этом
 * файле нет: иначе греибокс и рабочая сцена разъехались бы на первой правке
 * обмеров.
 *
 * Группы названы по этапам сценария строительства, а не по типам деталей.
 * Так сториборд и будущий scroll-таймлайн включают их простым перечислением,
 * не зная ничего про геометрию.
 */

import * as THREE from "three";
import * as S from "./houseSpec.js";

/**
 * Оттенки серого по назначению.
 *
 * Земля намеренно темнее стен. При светлой земле дом на общем плане теряет
 * нижнюю границу и силуэт перестаёт читаться — а ради силуэта греибокс и
 * делается.
 */
const TONE = {
  mass: 0.3,
  band: 0.44,
  roof: 0.19,
  deck: 0.26,
  timber: 0.38,
  recess: 0.1,
  glass: 0.05,
  ground: 0.15,
  /*
   * Гравийная отмостка. Своя строка, а не `deck`: отмостка — гравий, и общего с
   * террасной доской у неё нет ничего, кроме того, что обе лежат на земле.
   * Тоном они почти совпадали (0.26 против 0.28), поэтому ошибка назначения
   * жила незамеченной, пока `deck` не получил цвет дерева и отмостка не стала
   * деревянной дорожкой вокруг дома.
   */
  gravel: 0.28,
  /*
   * Разметка: шнур обноски и колышки. Своя строка, а не `band`/`timber`/`deck`,
   * которыми она размечалась раньше.
   *
   * Разметка — не материал дома, а инструмент стройки, и красить её деревом
   * значит обещать зрителю, что из этого что-то построят. Тон нейтральный и
   * заметно светлее земли: шнур обязан читаться линией на участке, а не
   * теряться в нём. Три разных материала на трёх контурах, к тому же, разводили
   * их по цвету без всякой причины — контуры отличаются назначением, а не
   * материалом.
   */
  layout: 0.52,
  // Каркас композиции — самое тёмное в сцене: графит должен уводить кресло в
  // силуэт, а не спорить с домом. Плетение светлее настила: ближнее кресло
  // стоит именно на нём и обязано от него отделяться.
  steel: 0.16,
  weave: 0.55,
  /*
   * Подушки — самое светлое в композиции, и это назначено, а не выбрано.
   * Порядок яркостей внутри кресла обязан быть жёстким: подушка светлее
   * плетения, плетение светлее настила, каркас темнее всего. Иначе мягкое
   * пропадает в плетении, и вся работа над формой сиденья не видна.
   */
  cushion: 0.68,
  /*
   * Ковёр. Уровень не выбран, а найден перебором по читаемости кромки кресла.
   *
   * Кромка у кресла двойная и требует от пола противоположного: графитовый
   * каркас нуждается в светлом поле, светлое плетение — в тёмном. Показатель,
   * который мирит их, один — доля периметра, где кромка ПРОПАДАЕТ (|Δ| < 5).
   * По ней у обоих кресел один и тот же минимум: у дальнего 37.9 % → 27.4 %, у
   * ближнего 28.6 % → 22.8 %, и дальше оба снова портятся. Контраст графита при
   * этом растёт в 2.7 и 1.8 раза. Светлее — плетение начинает тонуть в ковре,
   * темнее — каркас снова пропадает.
   */
  rug: 0.42,
  /*
   * Столешница. Своё значение, а не общий `timber`, и вот почему числом:
   * конструктивное дерево стоит на 0.38, и на этом уровне столешница читается на
   * ковре с отрывом 0.9 единицы яркости — то есть не читается вовсе. Столик
   * стоит на ковре, значит его фон не настил, а ковёр, и от ковра он обязан
   * отделяться сам. На 0.26 отрыв равен 15.1.
   */
  tabletop: 0.26,
  /*
   * Плед. Между каркасом (0.16) и ковром (0.42), ближе к каркасу: плед — акцент,
   * а не второе светлое поле. Если он окажется светлее подушек, тёплое пятно
   * уедет с сиденья на спинку и фокус кресла сместится.
   */
  /*
   * Рейка панели. Светлее конструктивного дерева (0.38) на две сотых, и это
   * назначено: панель стоит В ГЛУБИНЕ, а рама портала — на переднем плане, и на
   * одном тоне они сливаются в одну деревянную массу. Две сотых хватает, чтобы
   * панель читалась отдельным предметом, и мало, чтобы она стала спорить.
   */
  slat: 0.4,
  /*
   * Подложка панели — темнее всего в кадре наравне с каркасом. Она обязана
   * уводить промежутки между рейками в тень: на светлой подложке рейки
   * перестают быть рейками и превращаются в полосатую доску.
   */
  backing: 0.12,
  /** Вазон — матовый графит, тот же уровень, что у подложки. */
  pot: 0.14,
  /*
   * Злаки. Не кислотный зелёный, а выгоревшая natural-трава: между настилом
   * (0.26) и плетением (0.55), ближе к середине. Ярче — и вазон превращается в
   * клумбу, темнее — силуэт злаков пропадает на графите стены.
   */
  grass: 0.38,
};

/** Порядок групп совпадает с порядком стройки — на нём стоит весь сториборд. */
export const GROUP_ORDER = [
  "layout",
  "piles",
  "grillage",
  "studs",
  "terraceFrame",
  "rafters",
  "envelope",
  "roof",
  "bands",
  "openings",
  "deck",
  "screen",
  "planter",
  "stands",
  "lifestyle",
];

export const GROUP_TITLES = {
  layout: "Разметка пятна застройки",
  piles: "Сваи",
  grillage: "Обвязка, платформа, цоколь",
  studs: "Стойки и перемычки",
  terraceFrame: "Каркас террасы и рама портала",
  rafters: "Стропильная система",
  envelope: "Тёплый контур и фронтон",
  roof: "Кровля и водостоки",
  bands: "Деревянные ленты фасада",
  openings: "Окна, двери, панорама",
  deck: "Настил, ступени, ламели",
  screen: "Реечная панель и бра",
  planter: "Вазон со злаками",
  stands: "Стойки подвеса",
  lifestyle: "Кресла, подвесы, столик",
};

const DEG = Math.PI / 180;
const TAU = Math.PI * 2;
const UP = new THREE.Vector3(0, 1, 0);

export function createGreybox(scene) {
  const materials = {};
  for (const [key, value] of Object.entries(TONE)) {
    materials[key] = new THREE.MeshStandardMaterial({
      color: new THREE.Color(value, value, value),
      roughness: 0.92,
      metalness: 0,
    });
  }
  materials.glass.roughness = 0.25;
  // Спинка кресла — одна незамкнутая поверхность: у открытой спереди дуги видна
  // и внутренняя сторона. Односторонний материал оставил бы вместо неё дыру.
  materials.weave.side = THREE.DoubleSide;
  /*
   * Двусторонний материал по умолчанию пишет в теневую карту обеими сторонами,
   * и оболочка начинает затенять сама себя: по спинке шла косая штриховка,
   * которую легко принять за фактуру плетения. Тень пишут только задние грани —
   * глубина уходит за освещённую поверхность, и штриховка пропадает.
   */
  materials.weave.shadowSide = THREE.BackSide;
  /*
   * Стебель — лента нулевой толщины: с одной стороны камера видит её лицо, с
   * другой изнанку, и односторонний материал оставил бы на изнанке дыру. Тени
   * стебли не пишут вовсе (`castShadow` снят при постройке), поэтому
   * `shadowSide` им не нужен.
   */
  materials.grass.side = THREE.DoubleSide;

  const root = new THREE.Group();
  // Спецификация задана от угла дома, а камере удобнее вращаться вокруг
  // середины объёма — поэтому центрируем всю модель разом.
  root.position.set(-S.TOTAL_X1 / 2, 0, -S.DEPTH / 2);
  scene.add(root);

  const groups = {};
  for (const name of GROUP_ORDER) {
    groups[name] = new THREE.Group();
    groups[name].name = name;
    root.add(groups[name]);
  }

  const BOX = new THREE.BoxGeometry(1, 1, 1);
  /*
   * Одна общая геометрия вращения на всю композицию: во всём доме нет ни одного
   * радиуса, а столик и узел подвеса обязаны быть круглыми. 16 сегментов —
   * потолок читаемости: при 0.62 м и 75 px/м грань занимает 5 px, дробить
   * дальше нечего.
   *
   * Кресло из этих примитивов больше не собирается: с 2026-08-04 в сцене только
   * плетёный кокон, а он строится своей сеткой.
   */
  const CYL = new THREE.CylinderGeometry(0.5, 0.5, 1, 16);

  /*
   * Подушки. Одна геометрия на все четыре: и сиденье, и поясничная — мягкие тела
   * без единой плоскости, а разводит их масштаб, а не форма. Разбиение взято из
   * спецификации; вертикально оно грубое намеренно — крона подушки на рабочей
   * дистанции 11 px, и делить её на десять поясов не на что.
   */
  const CUSHION = new THREE.SphereGeometry(
    0.5,
    S.CHAIR.cushion.sectors,
    S.CHAIR.cushion.rings,
  );

  const owned = [BOX, CYL, CUSHION];

  const attach = (mesh, name) => {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    groups[name].add(mesh);
    return mesh;
  };

  const box = (name, pos, size, material, rot) => {
    const mesh = new THREE.Mesh(BOX, materials[material]);
    mesh.position.set(pos[0], pos[1], pos[2]);
    mesh.scale.set(
      Math.max(size[0], 1e-4),
      Math.max(size[1], 1e-4),
      Math.max(size[2], 1e-4),
    );
    if (rot) mesh.rotation.set(rot[0], rot[1], rot[2]);
    return attach(mesh, name);
  };

  /**
   * Тело в произвольном родителе.
   *
   * `box` кладёт деталь прямо в группу этапа — этого хватает всему дому, потому
   * что дом неподвижен. Композиция на террасе строится вложенной: точка
   * крепления обязана остаться на месте, а качается только то, что висит ниже
   * вертлюга. Плоским списком такую иерархию не выразить.
   */
  const shapes = { box: BOX, cyl: CYL, cushion: CUSHION };
  const solid = (parent, kind, material, pos, size, rot) => {
    const mesh = new THREE.Mesh(shapes[kind], materials[material]);
    mesh.position.set(pos[0], pos[1], pos[2]);
    mesh.scale.set(
      Math.max(size[0], 1e-4),
      Math.max(size[1], 1e-4),
      Math.max(size[2], 1e-4),
    );
    if (rot) mesh.rotation.set(rot[0], rot[1], rot[2]);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };

  /**
   * Тело с собственной геометрией.
   *
   * Геометрия строится ОДИН раз и вешается на оба кресла: они одинаковые, и
   * платить за форму дважды не за что. Владение геометрией берёт на себя
   * `owned`, поэтому `dispose` освобождает её наравне с примитивами.
   */
  const part = (parent, geometry, material, at) => {
    if (!owned.includes(geometry)) owned.push(geometry);
    const mesh = new THREE.Mesh(geometry, materials[material]);
    if (at) mesh.position.set(at[0], at[1], at[2]);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };

  /** Произвольная геометрия — нужна только для фронтона. */
  const shape = (name, geometry, material) => {
    owned.push(geometry);
    return attach(new THREE.Mesh(geometry, materials[material]), name);
  };

  const site = buildSite(materials);
  root.add(site);
  owned.push(site.geometry);

  const swingUnits = [];

  buildLayout(box);
  buildPiles(box);
  buildGrillage(box);
  buildStuds(box);
  buildTerraceFrame(box, shape);
  buildRafters(box);
  buildEnvelope(box, shape);
  buildRoof(box);
  buildBands(box);
  buildOpenings(box);
  buildDeck(box);
  buildScreen(box, shape);
  buildPlanter(solid, shape, groups.planter);
  const suspend = buildLifestyle(
    { solid, part },
    groups.lifestyle,
    groups.stands,
    swingUnits,
  );

  /*
   * Что не отбрасывает тень.
   *
   * Ленты фасада выступают всего на 40 мм. Их собственная тень на стене не
   * читается вовсе, зато на такой глубине она попадает в пределы смещения
   * теневой карты и даёт муар по краям лент — он и ползёт полосами при
   * движении камеры. Стекло по той же причине: оно бы вдобавок зачернило
   * откосы.
   *
   * Ровно этот приём уже применён в рабочей сцене проекта, в partBuilder.js,
   * с той же формулировкой про нащельники. Греибокс воспроизводил проблему
   * заново только потому, что строился с нуля.
   */
  for (const name of ["bands", "layout"]) {
    groups[name].traverse((object) => {
      object.castShadow = false;
    });
  }
  for (const name of GROUP_ORDER) {
    groups[name].traverse((object) => {
      if (object.material === materials.glass) object.castShadow = false;
    });
  }

  prepareAssembly(groups);

  const updateSwing = createSwing(swingUnits, suspend.period);

  return {
    root,
    groups,
    materials,

    /**
     * Отметка ВЕРШИНЫ ДУГИ СТОЙКИ над настилом.
     *
     * Наружу отдаётся потому, что в вершине стоит светильник скрытой подсветки
     * (`COVE` в отделке), а сама отметка нигде не записана числом: она
     * складывается из высоты узла подвеса, снятой с оболочки кокона, и длины
     * цепи. Второй источник этой отметки разошёлся бы с первой же правкой формы
     * капли, и лента уехала бы от стойки.
     */
    standTip: suspend.tipAbove,

    /**
     * Период качания в секундах. Тоже следствие геометрии, а не число из
     * спецификации, — наружу отдаётся ради замеров: фазы для съёмки кадров
     * обязаны раскладываться по настоящему периоду, иначе четыре «равномерные»
     * фазы окажутся четырьмя случайными позами.
     */
    swingPeriod: suspend.period,

    /**
     * Качание кресел. Считается от настенного времени в секундах, а не от
     * прогресса прокрутки: иначе быстрая прокрутка превращает качели в
     * пропеллер, а обратная — гонит их назад. Встраивается в существующий цикл
     * страницы, своего кадра не заводит.
     *
     * Возвращает, сдвинулось ли хоть что-нибудь. Это единственный источник
     * правды о том, движется ли композиция: страница по нему решает, надо ли
     * пересчитывать теневую карту, и не обязана знать ни про reduced motion, ни
     * про скрытую вкладку, ни про состав групп.
     */
    updateSwing(now) {
      return updateSwing(now, groups.lifestyle.visible);
    },

    setVisible(name, visible) {
      if (groups[name]) groups[name].visible = visible;
      if (visible) setGroupProgress(groups[name], 1);
    },

    /** Показывает ровно перечисленные группы и прячет все остальные. */
    showOnly(names) {
      const set = new Set(names);
      for (const name of GROUP_ORDER) {
        groups[name].visible = set.has(name);
        if (set.has(name)) setGroupProgress(groups[name], 1);
      }
    },

    /**
     * Сборка группы: 0 — не построена, 1 — собрана. Элементы опускаются на
     * свои места волной, поэтому кадр посередине читается как монтаж, а не
     * как разобранный дом.
     */
    setGroupProgress(name, progress) {
      const group = groups[name];
      if (group) setGroupProgress(group, progress);
    },

    dispose() {
      for (const geometry of owned) geometry.dispose();
      /*
       * Карты освобождаются отдельно: `Material.dispose` их не трогает, а
       * отделка вешает на материалы процедурные текстуры — фактуру ковра и
       * доску настила. Без этой строки они остаются в видеопамяти после
       * пересборки сцены. Список ключей закрытый: перебирать все свойства
       * материала значило бы наткнуться на общую карту окружения, которая
       * материалу не принадлежит.
       */
      for (const material of Object.values(materials)) {
        for (const key of ["map", "normalMap", "roughnessMap", "alphaMap"]) {
          if (material[key]) material[key].dispose();
        }
        material.dispose();
      }
      scene.remove(root);
    },
  };
}

/* ─────────────────────────  сборка  ─────────────────────────
 *
 * Появление элемента — опускание на своё место. Движение одинаково для всех
 * групп (сваю забивают, стойку ставят, окно монтируют), поэтому стройка
 * читается как один спокойный процесс, а не как набор трюков.
 */

/** Высота, с которой элемент опускается. Держим небольшой: чем выше подлёт,
 *  тем сильнее промежуточный кадр читается как разобранный дом. */
const RISE = 0.9;
/** Доля прогресса, которую занимает разбег между первым и последним элементом. */
const STAGGER = 0.45;

function prepareAssembly(groups) {
  for (const [name, group] of Object.entries(groups)) {
    let min = Infinity;
    let max = -Infinity;
    for (const child of group.children) {
      // Волна идёт снизу вверх и от ближнего угла к дальнему разом: по одной
      // оси она смотрится механической, по диагонали — как настоящая стройка.
      const key = child.position.x / S.TOTAL_X1 + child.position.y / S.RIDGE_Y;
      child.userData.baseY = child.position.y;
      child.userData.key = key;
      child.userData.rise = allowedRise(child, name);
      if (key < min) min = key;
      if (key > max) max = key;
    }
    const span = Math.max(max - min, 1e-4);
    for (const child of group.children) {
      child.userData.order = (child.userData.key - min) / span;
    }
  }
}

/**
 * Насколько высоко элементу разрешено подниматься над своим местом.
 *
 * Общий подъём в 0.9 м безопасен не для всех: стеклопакеты стоят у самого
 * верха стены, и поднятая панель протыкала скат кровли — спальня на 11 см,
 * гостиная на 6, кухня на 1. Панель вылезала из кровли и на глазах уезжала
 * обратно, что и читалось как мерцание при появлении стёкол.
 *
 * Ограничение считается от плоскости ската, а не от карниза. Карниз — это край
 * свеса, а не потолок помещения: под ним есть высокие элементы, которым тоже
 * нельзя протыкать кровлю, — прежде всего подшивка потолка террасы. Элементы
 * самой кровли (стропила, скаты, конёк, фронтоны) изначально стоят на плоскости
 * ската или выше; им подъём не ограничивается, иначе кровля перестанет
 * собираться вовсе.
 *
 * Для композиции на террасе потолок ещё ниже: там настоящая верхняя граница —
 * не скат, а подшивка, которая идёт на четверть метра ниже него. Ограничение
 * заведено при балке подвеса, когда цепь при появлении протыкала подшивку
 * насквозь; со стойкой самая высокая точка мебели опустилась до 2.34 и в общие
 * 0.9 м укладывается с большим запасом. Проверка оставлена: она стоит копейки, а
 * высота подвеса стала свободной и может вырасти при первой же правке стойки.
 */
function allowedRise(child, group) {
  const top = topOf(child);
  let ceiling = S.roofPlaneAt(child.position.z) - 0.06;
  if (group === "lifestyle" || group === "stands") {
    ceiling = Math.min(ceiling, S.soffitUnderAt(child.position.z));
  }
  if (top > ceiling) return RISE;
  return Math.max(0, Math.min(RISE, ceiling - top));
}

/** Верхняя отметка элемента. Подвесная сборка — не меш, у неё считается габарит. */
function topOf(child) {
  const geometry = child.geometry;
  if (geometry) {
    if (!geometry.boundingBox) geometry.computeBoundingBox();
    return child.position.y + geometry.boundingBox.max.y * child.scale.y;
  }
  child.updateWorldMatrix(true, true);
  // Корень модели смещён только по X и Z, поэтому мировая отметка равна местной.
  return new THREE.Box3().setFromObject(child).max.y;
}

function setGroupProgress(group, progress) {
  const p = progress < 0 ? 0 : progress > 1 ? 1 : progress;
  group.visible = p > 0.001;
  if (!group.visible) return;

  for (const child of group.children) {
    const local = clamp01((p - child.userData.order * STAGGER) / (1 - STAGGER));
    child.position.y =
      child.userData.baseY + (1 - easeOutCubic(local)) * child.userData.rise;
    child.visible = local > 0.001;
  }
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function clamp01(value) {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

/* ─────────────────────────  участок  ───────────────────────── */

function buildSite(materials) {
  // Площадка заведомо больше дальности тумана: иначе на общем плане в кадр
  // попадает её край и участок читается как лежащий на столе лист.
  const geometry = new THREE.PlaneGeometry(400, 400);
  const mesh = new THREE.Mesh(geometry, materials.ground);
  mesh.rotation.x = -Math.PI / 2;
  mesh.receiveShadow = true;
  mesh.position.set(S.TOTAL_X1 / 2, 0, S.DEPTH / 2);
  return mesh;
}

/* ─────────────────────────  00 · разметка  ─────────────────────────
 *
 * Первый кадр сценария — пустой участок, и без разметки он не сообщает
 * ничего: серая плоскость не даёт ни масштаба, ни того, где встанет дом.
 * Обноска с шнуром задаёт и то и другое ещё до первой сваи.
 */

function buildLayout(box) {
  const T = 0.07; // ширина шнура
  const Y = 0.035; // чуть выше земли, иначе шнур мерцает по глубине

  const outlineAt = (y, x0, x1, z0, z1, material) => {
    box("layout", [(x0 + x1) / 2, y, z0], [x1 - x0, T, T], material);
    box("layout", [(x0 + x1) / 2, y, z1], [x1 - x0, T, T], material);
    box("layout", [x0, y, (z0 + z1) / 2], [T, T, z1 - z0], material);
    box("layout", [x1, y, (z0 + z1) / 2], [T, T, z1 - z0], material);
  };
  const outline = (x0, x1, z0, z1, material) =>
    outlineAt(Y, x0, x1, z0, z1, material);

  outline(0, S.LIVING_X1, 0, S.DEPTH, "layout");
  // Терраса размечается отдельно: она часть общего объёма, но её границу
  // важно видеть с первого кадра.
  // Контур террасы приподнят: на общей границе с контуром дома два шнура
  // лежали бы в одной плоскости.
  outlineAt(Y + 0.006, S.TERRACE.x0 + 0.06, S.TERRACE.x1, 0, S.DEPTH, "layout");
  // Вынос кровли — им задаётся реальное пятно тени на участке.
  outline(
    S.ROOF_X0,
    S.ROOF_X1,
    S.RIDGE_Z - S.ROOF_HALF_RUN,
    S.RIDGE_Z + S.ROOF_HALF_RUN,
    "layout",
  );

  // Обноска: колышки по углам и по осям свай.
  for (const [x, z] of S.pilePositions()) {
    box("layout", [x, 0.12, z], [0.05, 0.24, 0.05], "layout");
  }
}

/* ─────────────────────────  01 · сваи  ───────────────────────── */

function buildPiles(box) {
  for (const [x, z] of S.pilePositions()) {
    box(
      "piles",
      [x, S.PILE_TOP - S.PILE_LENGTH / 2, z],
      [0.28, S.PILE_LENGTH, 0.28],
      "mass",
    );
  }
}

/* ─────────────────────────  02 · обвязка и платформа  ───────────────────────── */

function buildGrillage(box) {
  const y = (S.PILE_TOP + S.GRILLAGE_TOP) / 2;
  const h = S.GRILLAGE_TOP - S.PILE_TOP;

  // Обвязка уходит внутрь за толщину цоколя: вровень её наружная грань
  // совпадала с гранью цоколя полосой в 2.15 м² вдоль всего дома.
  const E = 0.13;
  const ring = (x0, x1, z0, z1) => {
    const w = x1 - x0 - E * 2;
    const d = z1 - z0 - E * 2;
    box("grillage", [(x0 + x1) / 2, y, z0 + E + 0.1], [w, h, 0.2], "timber");
    box("grillage", [(x0 + x1) / 2, y, z1 - E - 0.1], [w, h, 0.2], "timber");
    box("grillage", [x0 + E + 0.1, y, (z0 + z1) / 2], [0.2, h, d], "timber");
    box("grillage", [x1 - E - 0.1, y, (z0 + z1) / 2], [0.2, h, d], "timber");
  };
  ring(0, S.LIVING_X1, 0, S.DEPTH);
  ring(S.TERRACE.x0, S.TERRACE.x1, 0, S.DEPTH);

  // Лаги пола поперёк дома.
  for (const x of S.spread(
    0.5,
    S.LIVING_X1 - 0.5,
    Math.round(S.LIVING_X1 / 0.7),
  )) {
    box("grillage", [x, y, S.DEPTH / 2], [0.08, h, S.DEPTH - 0.4], "timber");
  }

  /*
   * Платформа пола — только под жилым объёмом.
   *
   * Раньше она шла на всю длину, включая террасу, и её верхняя грань лежала
   * на отметке чистого пола 0.55 — ровно там же, где верхняя грань настила
   * террасы. Две смотрящие вверх грани на одной отметке и на одной площади
   * дают мерцание, которое в статике почти незаметно, а при движении камеры
   * ползёт пятнами по всему полу террасы.
   */
  // Плита уходит внутрь дальше толщины цоколя. Четырёх сантиметров было мало:
  // цоколь заходил на плиту, и их верхние грани совпадали на отметке пола
  // полосой в 1.4 м² вдоль всего дома. Теперь плита кончается там, где цоколь
  // начинается, и стена опирается на цоколь.
  const trim = 0.14;
  box(
    "grillage",
    [S.LIVING_X1 / 2, (S.GRILLAGE_TOP + S.FLOOR) / 2, S.DEPTH / 2],
    [S.LIVING_X1 - trim * 2, S.FLOOR - S.GRILLAGE_TOP, S.DEPTH - trim * 2],
    "mass",
  );

  // Черновое основание террасы. Ниже настила и целиком внутри него, поэтому
  // на готовом доме не видно, а на строительных этапах терраса не зияет
  // дырой до земли.
  // Основание уже настила со всех сторон: вровень их боковые грани совпадали
  // и торцевая кромка настила мерцала.
  const sub = 0.04;
  box(
    "grillage",
    [
      (S.TERRACE.x0 + S.TERRACE.x1) / 2,
      (S.GRILLAGE_TOP + 0.48) / 2,
      (S.TERRACE.z0 + S.TERRACE.z1) / 2,
    ],
    [
      S.TERRACE.x1 - S.TERRACE.x0 - sub * 2,
      0.48 - S.GRILLAGE_TOP,
      S.TERRACE.z1 - S.TERRACE.z0 - sub * 2,
    ],
    "mass",
  );
}

/* ─────────────────────────  03 · стойки  ───────────────────────── */

function buildStuds(box) {
  // Нижняя и верхняя обвязки по периметру жилого объёма.
  // Все элементы каркаса строятся толщиной FRAME_T и остаются внутри стены:
  // при полной толщине их грани совпадали с гранями обшивки и давали зигзаг
  // z-fighting по всему дому.
  // Верхняя обвязка на сантиметр ниже верха стены: вровень их горизонтальные
  // грани совпадали бы с гранью подкарнизного пояса. Щель прячется внутри
  // стены и наружу не выходит.
  /*
   * ТОТ ЖЕ ОТСТУП НУЖЕН И ПО ДЛИНЕ, А НЕ ТОЛЬКО ПО ТОЛЩИНЕ.
   *
   * Правка 2026-08-04. Каркас утоплен в стену по глубине — об этом сказано
   * абзацем выше, — но по ДЛИНЕ обвязка шла от угла до угла ровно как обшивка, и
   * их торцы ложились в одну плоскость. Мерцание на кадре, отмеченное владельцем
   * стрелкой у ламелей, приходило именно оттуда. Отступ берётся тот же самый —
   * половина разницы толщин стены и каркаса, — а не назначается вторым числом.
   */
  const inset = (S.WALL_T - S.FRAME_T) / 2;

  for (const y of [
    S.FLOOR + S.PLATE_H / 2,
    S.WALL_TOP - S.PLATE_H / 2 - 0.01,
  ]) {
    box(
      "studs",
      [S.LIVING_X1 / 2, y, S.WALL_T / 2],
      [S.LIVING_X1 - inset * 2, S.PLATE_H, S.FRAME_T],
      "timber",
    );
    box(
      "studs",
      [S.LIVING_X1 / 2, y, S.DEPTH - S.WALL_T / 2],
      [S.LIVING_X1 - inset * 2, S.PLATE_H, S.FRAME_T],
      "timber",
    );
    box(
      "studs",
      [S.WALL_T / 2, y, S.DEPTH / 2],
      [S.FRAME_T, S.PLATE_H, S.DEPTH - inset * 2],
      "timber",
    );
    box(
      "studs",
      [S.LIVING_X1 - S.WALL_T / 2, y, S.DEPTH / 2],
      [S.FRAME_T, S.PLATE_H, S.DEPTH - inset * 2],
      "timber",
    );
  }

  const bottom = S.FLOOR + S.PLATE_H;
  const top = S.WALL_TOP - S.PLATE_H;
  const height = top - bottom;
  const centre = (bottom + top) / 2;

  for (const name of S.FACE_NAMES) {
    const face = S.FACES[name];
    const openings = S.OPENINGS[name] || [];
    const count = Math.max(2, Math.round(face.width / S.STUD_PITCH));
    const gap = face.width / count;

    // Стойки не ставятся в проёмы: иначе сквозь стекло был бы виден рядовой
    // брус поперёк окна. Проём обрамляется своими стойками и перемычкой.
    for (let i = 0; i <= count; i++) {
      const u = gap * i;
      if (openings.some((o) => u > o.u0 - 0.05 && u < o.u1 + 0.05)) continue;
      box(
        "studs",
        face.position(u, centre - S.FLOOR),
        face.size(S.STUD_W, height, S.FRAME_T),
        "timber",
      );
    }

    /*
     * Обрамление проёма отводится от его кромки на GAP.
     *
     * Раньше подоконный брус упирался верхом ровно в отметку подоконника,
     * перемычка низом — в отметку перемычки, боковые стойки — в кромки
     * проёма. Ровно там же кончалась панель стены, и все четыре стороны
     * каждого окна имели пару одноимённых граней в одной плоскости. Через
     * проём эти грани видны, поэтому по подоконникам и перемычкам шло
     * мерцание. Зазор уходит внутрь стены и снаружи не виден.
     */
    const GAP = 0.01;

    for (const o of openings) {
      for (const u of [o.u0 - 0.06 - GAP, o.u1 + 0.06 + GAP]) {
        if (u < 0.05 || u > face.width - 0.05) continue;
        box(
          "studs",
          face.position(u, centre - S.FLOOR),
          face.size(0.12, height, S.FRAME_T),
          "timber",
        );
      }
      // Перемычка над проёмом и подоконный брус под ним.
      const head = o.v1 + GAP;
      const sill = o.v0 - GAP;
      if (top - S.FLOOR - head > 0.12) {
        box(
          "studs",
          face.position((o.u0 + o.u1) / 2, (head + (top - S.FLOOR)) / 2),
          face.size(o.u1 - o.u0 + 0.24, top - S.FLOOR - head, S.FRAME_T),
          "timber",
        );
      }
      if (sill - (bottom - S.FLOOR) > 0.12) {
        box(
          "studs",
          face.position((o.u0 + o.u1) / 2, (bottom - S.FLOOR + sill) / 2),
          face.size(o.u1 - o.u0 + 0.24, sill - (bottom - S.FLOOR), S.FRAME_T),
          "timber",
        );
      }
    }
  }

  // Каркас входной ниши.
  const zBack = S.DEPTH - S.ENTRY.depth;
  for (const x of [S.ENTRY.x0 + S.WALL_T / 2, S.ENTRY.x1 - S.WALL_T / 2]) {
    box(
      "studs",
      [x, centre, zBack + S.ENTRY.depth / 2],
      [S.FRAME_T, height, S.ENTRY.depth - 0.05],
      "timber",
    );
  }
}

/* ─────────────────────────  04 · каркас террасы  ───────────────────────── */

function buildTerraceFrame(box, shape) {
  const t = S.TERRACE;

  // Обвязка террасы и её задняя стена — та же конструкция, что у дома.
  // Верхняя обвязка на сантиметр ниже верха стены: вровень их горизонтальные
  // грани совпадали бы с гранью подкарнизного пояса. Щель прячется внутри
  // стены и наружу не выходит.
  // Тот же отступ по длине, что и у обвязки жилого объёма: торец обвязки не
  // имеет права лечь в одну плоскость с торцом обшивки — см. `buildStuds`.
  const plateInset = (S.WALL_T - S.FRAME_T) / 2;
  for (const y of [
    S.FLOOR + S.PLATE_H / 2,
    S.WALL_TOP - S.PLATE_H / 2 - 0.01,
  ]) {
    box(
      "terraceFrame",
      [(t.x0 + t.x1) / 2, y, S.WALL_T / 2],
      [t.x1 - t.x0 - plateInset * 2, S.PLATE_H, S.FRAME_T],
      "timber",
    );
  }

  for (const post of S.POSTS) {
    box(
      "terraceFrame",
      [post.x, S.FLOOR + (S.WALL_TOP - S.FLOOR) / 2, post.z],
      [0.2, S.WALL_TOP - S.FLOOR, 0.2],
      "timber",
    );
  }

  buildPortalFrame(shape);
}

/**
 * Рама портала повторяет контур фронтона: две стойки по краям проёма и два
 * наклонных ригеля по скатам, сходящиеся на коньке.
 *
 * ЭТО ОДНО ТЕЛО, А НЕ ЧЕТЫРЕ, И ЭТО ЛЕЧЕНИЕ, А НЕ ЭКОНОМИЯ.
 *
 * Раму собирали из четырёх коробок, и у неё было два разных дефекта на одном и
 * том же узле. Первый: члены, поставленные внахлёст, дают две копии одной
 * плоскости на один пиксель, и на движении камеры он мерцает. Второй появился
 * при лечении первого: чтобы члены не перекрывались, стойку подрезали по высоте
 * — но подрезали ГОРИЗОНТАЛЬНО, а низ ригеля идёт под углом ската. Между плоским
 * верхом стойки и наклонным низом ригеля остаётся клин: замер по обоим углам
 * даёт **241 мм** — с одной стороны стойки щель 121 мм, с другой стойка на те же
 * 121 мм входит в ригель. Плюс ригель кончался на ОСИ стойки, оставляя её
 * наружную половину в 275 мм вообще без ничего. Эти три дыры владелец и увидел.
 *
 * Коробками это не чинится: у коробки все грани прямоугольны, а здесь нужен рез
 * по скату. Поэтому рама строится тем, чем она и является, — ПЛОСКИМ КОНТУРОМ,
 * выдавленным на толщину. Внутренних стыков в ней после этого нет ни одного,
 * значит нечему ни расходиться, ни перекрываться, ни мерцать. Заодно четыре тела
 * стали одним: −3 вызова отрисовки и −3 в теневом проходе.
 *
 * Контур выводится из плоскости кровли, а не из чисел. Ось ригеля лежит НА ней,
 * сечение свисает на половину в обе стороны, поэтому по вертикали верхняя грань
 * идёт по `roofPlaneAt(z) + under`, нижняя по `roofPlaneAt(z) − under`, где
 * `under` — половина сечения по вертикали, то есть гипотенуза, а не катет.
 */
function buildPortalFrame(shape) {
  const t = S.TERRACE;
  const th = S.PORTAL.thickness;
  const under = th / 2 / Math.cos(S.ROOF_ANGLE);

  // Центр тела: середина слоя по X, пол по Y, середина пролёта по Z. Контур
  // строится ОТНОСИТЕЛЬНО него, чтобы у меша осталось осмысленное положение —
  // по нему идёт волна сборки группы и проверка подъёма под кровлю.
  const xc = S.PORTAL.x - th / 2;
  const zc = (t.z0 + t.z1) / 2;

  const top = (z) => S.roofPlaneAt(z) + under - S.FLOOR;
  const bottom = (z) => S.roofPlaneAt(z) - under - S.FLOOR;

  /*
   * Контур обходится одной петлёй: вверх по наружной грани дальней стойки, через
   * конёк, вниз по наружной грани ближней, и обратно по внутренней стороне.
   * Снизу рама открыта — она стоит на настиле, а не замыкается в кольцо.
   */
  const outline = new THREE.Shape();
  const go = (z, y, first) =>
    first ? outline.moveTo(z - zc, y) : outline.lineTo(z - zc, y);
  go(t.z0, 0, true);
  go(t.z0, top(t.z0));
  go(S.RIDGE_Z, S.RIDGE_Y + under - S.FLOOR);
  go(t.z1, top(t.z1));
  go(t.z1, 0);
  go(t.z1 - th, 0);
  go(t.z1 - th, bottom(t.z1 - th));
  go(S.RIDGE_Z, S.RIDGE_Y - under - S.FLOOR);
  go(t.z0 + th, bottom(t.z0 + th));
  go(t.z0 + th, 0);
  outline.closePath();

  const geometry = new THREE.ExtrudeGeometry(outline, {
    depth: th,
    bevelEnabled: false,
  });
  /*
   * Форма построена в плоскости (Z, Y), а выдавливание идёт в +Z. Разворот по Y
   * на −90° переводит (x, y, z) в (−z, y, x): координата контура становится
   * глубиной, а толщина уходит в −X. Сдвиг возвращает слой на середину.
   */
  geometry.rotateY(-Math.PI / 2);
  geometry.translate(th / 2, 0, 0);

  const frame = shape("terraceFrame", geometry, "timber");
  frame.position.set(xc, S.FLOOR, zc);
}

/* ─────────────────────────  05 · стропила  ───────────────────────── */

function buildRafters(box) {
  /*
   * Коньковый прогон кончается на ВНУТРЕННЕЙ грани рамы портала, а не на торце
   * дома.
   *
   * Прежде он шёл всю длину и входил в раму: у конька их тела перекрывались, а
   * наружные грани лежали в одной плоскости — мерцание на вечернем кадре.
   * Рама портала на то и рама, что несёт торец сама; прогон в неё упирается, а
   * не проходит насквозь. Тем же приёмом в этом проекте уже вылечена подшивка
   * потолка террасы.
   */
  const ridgeEnd = S.PORTAL.x - S.PORTAL.thickness;
  box(
    "rafters",
    [ridgeEnd / 2, S.RIDGE_Y - 0.14, S.RIDGE_Z],
    [ridgeEnd, 0.28, 0.18],
    "timber",
  );

  // Оси стропил берутся из спецификации: в них же садятся закладные перемычки
  // узла подвеса, и два источника одной отметки разошлись бы на первой правке.
  for (const x of S.rafterPositions()) {
    for (const sign of [1, -1]) {
      const midZ = S.RIDGE_Z + (sign * S.ROOF_HALF_RUN) / 2;
      box(
        "rafters",
        [x, S.rafterAxisAt(midZ), midZ],
        [S.RAFTER_W, S.RAFTER_H, S.ROOF_SLOPE_LENGTH],
        "timber",
        [sign * S.ROOF_ANGLE, 0, 0],
      );
    }
  }
}

/* ─────────────────────────  06 · тёплый контур  ───────────────────────── */

function buildEnvelope(box, shape) {
  for (const name of S.FACE_NAMES) {
    const face = S.FACES[name];
    const openings = [...(S.OPENINGS[name] || [])];

    /*
     * Торцевые стены обрезаются на толщину длинных.
     *
     * Иначе на каждом углу обе стены занимают один и тот же объём, и их
     * наружные грани совпадают на площади 0.7 м². Угол дома — вертикальная
     * линия во весь фасад, поэтому мерцание там особенно заметно.
     * Вырез оформляется псевдопроёмом: `subtractOpenings` сам обрежет края.
     */
    if (name === "left" || name === "right") {
      openings.push({ u0: -1, u1: S.WALL_T, v0: 0, v1: S.WALL_H });
      openings.push({
        u0: face.width - S.WALL_T,
        u1: face.width + 1,
        v0: 0,
        v1: S.WALL_H,
      });
    }

    for (const rect of S.subtractOpenings(face.width, S.WALL_H, openings)) {
      box(
        "envelope",
        face.position(rect.u + rect.w / 2, rect.v + rect.h / 2),
        face.size(rect.w, rect.h),
        "mass",
      );
    }
  }

  // Задняя стена террасы: глухая, продолжает оболочку жилого объёма.
  box(
    "envelope",
    [(S.TERRACE.x0 + S.TERRACE.x1) / 2, S.FLOOR + S.WALL_H / 2, S.WALL_T / 2],
    [S.TERRACE.x1 - S.TERRACE.x0, S.WALL_H, S.WALL_T],
    "mass",
  );

  buildEntryShell(box);

  /*
   * Подкарнизный пояс.
   *
   * Верх стены стоит на отметке карниза 3.55, но карниз — это край СВЕСА, а
   * не линия примыкания к стене: над самой стеной скат идёт уже на 3.99.
   * Между ними оставалась щель в 44 см по всему периметру, сквозь которую
   * чердак просматривался насквозь — особенно из-под кровли террасы.
   *
   * Пояс кладётся двумя ступенями, наружной и внутренней, потому что скат над
   * толщиной стены поднимается ещё на 10 см: одной коробкой стена либо не
   * достаёт до кровли, либо протыкает её и вылезает наружу над свесом.
   */
  const belt = (x0, x1, zOuter, zInner) => {
    const mid = (zOuter + zInner) / 2;
    for (const [za, zb] of [
      [zOuter, mid],
      [mid, zInner],
    ]) {
      const top = S.roofPlaneAt(za);
      box(
        "envelope",
        [(x0 + x1) / 2, (S.WALL_TOP + top) / 2, (za + zb) / 2],
        [x1 - x0, top - S.WALL_TOP, Math.abs(zb - za)],
        "mass",
      );
    }
  };

  // Пояс идёт МЕЖДУ фронтонами, а не по всей длине: на торцах треугольник
  // фронтона уже закрывает это место, и два тела встали бы грань в грань.
  belt(S.WALL_T, S.LIVING_X1 - S.WALL_T, S.DEPTH, S.DEPTH - S.WALL_T);
  belt(S.WALL_T, S.LIVING_X1 - S.WALL_T, 0, S.WALL_T);
  belt(S.TERRACE.x0, S.TERRACE.x1, 0, S.WALL_T);

  /*
   * Фронтоны.
   *
   * Их два, а не один. Раньше строился только дальний, а торец жилого объёма,
   * обращённый в террасу, оставался открытым: над панорамным остеклением
   * зияла дыра во всю ширину дома, и сквозь портал был виден чердак. Проём
   * портала находится на дальнем конце террасы, на отметке 23.4, а вовсе не
   * на стене гостиной — эту стену закрывать обязательно.
   *
   * Фронтон не треугольник, а пятиугольник: над верхом стены скат уже поднялся
   * на высоту подкарнизного пояса, и треугольник оставил бы щель под кровлей.
   */
  const gable = new THREE.Shape();
  const shoulder = S.roofPlaneAt(0) - S.WALL_TOP;
  gable.moveTo(0, 0);
  gable.lineTo(S.DEPTH, 0);
  gable.lineTo(S.DEPTH, shoulder);
  gable.lineTo(S.RIDGE_Z, S.RIDGE_Y - S.WALL_TOP);
  gable.lineTo(0, shoulder);
  gable.closePath();

  for (const x of [0, S.LIVING_X1 - S.WALL_T]) {
    const geometry = new THREE.ExtrudeGeometry(gable, {
      depth: S.WALL_T,
      bevelEnabled: false,
    });
    // Форма построена в плоскости XY, а фронтон стоит поперёк дома. Разворот по
    // Y переводит (x, y, z) в (z, y, −x): ось формы уходит в −Z, поэтому после
    // разворота геометрию надо вернуть на глубину дома, а не сдвигать по X.
    geometry.rotateY(Math.PI / 2);
    geometry.translate(x, S.WALL_TOP, S.DEPTH);
    shape("envelope", geometry, "mass");
  }
}

function buildEntryShell(box) {
  const { x0, x1, depth } = S.ENTRY;
  const zBack = S.DEPTH - depth;

  const local = S.ENTRY_OPENINGS.map((o) => ({
    ...o,
    u0: o.u0 - x0,
    u1: o.u1 - x0,
  }));
  for (const rect of S.subtractOpenings(x1 - x0, S.WALL_H, local)) {
    box(
      "envelope",
      [
        x0 + rect.u + rect.w / 2,
        S.FLOOR + rect.v + rect.h / 2,
        zBack - S.WALL_T / 2,
      ],
      [rect.w, rect.h, S.WALL_T],
      "recess",
    );
  }

  for (const x of [x0 + S.WALL_T / 2, x1 - S.WALL_T / 2]) {
    box(
      "envelope",
      [x, S.FLOOR + S.WALL_H / 2, zBack + depth / 2],
      [S.WALL_T, S.WALL_H, depth],
      "recess",
    );
  }
  // Потолок ниши опущен так, чтобы верхняя обвязка каркаса целиком оказалась
  // внутри него: вровень их нижние грани почти совпадали и мерцали.
  //
  // По ширине он встаёт МЕЖДУ щёками, а не поверх них: иначе верхние и боковые
  // грани потолка и щёк совпадают попарно и дают мерцание в верхних углах ниши.
  box(
    "envelope",
    [(x0 + x1) / 2, S.WALL_TOP - 0.1, zBack + depth / 2],
    [x1 - x0 - S.WALL_T * 2, 0.2, depth],
    "recess",
  );
}

/* ─────────────────────────  07 · кровля  ───────────────────────── */

function buildRoof(box) {
  const width = S.ROOF_X1 - S.ROOF_X0;
  const cx = (S.ROOF_X0 + S.ROOF_X1) / 2;
  const midY = (S.RIDGE_Y + S.WALL_TOP) / 2;

  for (const sign of [1, -1]) {
    const midZ = S.RIDGE_Z + (sign * S.ROOF_HALF_RUN) / 2;
    // Скат смещается по собственной нормали, поэтому низ покрытия ложится
    // ровно на верх стропил, а не режет их. Поворот на +угол опускает дальний
    // по +Z конец коробки, поэтому знак совпадает со знаком стороны ската.
    const ny = Math.cos(S.ROOF_ANGLE) * (S.ROOF_T / 2);
    const nz = sign * Math.sin(S.ROOF_ANGLE) * (S.ROOF_T / 2);
    box(
      "roof",
      [cx, midY + ny, midZ + nz],
      [width, S.ROOF_T, S.ROOF_SLOPE_LENGTH],
      "roof",
      [sign * S.ROOF_ANGLE, 0, 0],
    );

    // Лобовая доска с интегрированным жёлобом.
    box(
      "roof",
      [cx, S.WALL_TOP - 0.14, S.RIDGE_Z + sign * S.ROOF_HALF_RUN],
      [width, 0.34, 0.09],
      "roof",
    );
  }

  /*
   * Конёк выпускается за торец скатов на половину собственной толщины.
   *
   * Прежде его длина совпадала со скатами ДО МИЛЛИМЕТРА, и у фронтона две пары
   * торцов ложились в одну плоскость — мерцание, замеченное владельцем
   * 2026-08-04. Число не выбрано: планка конька и в жизни делает небольшой
   * возврат за барж, и берётся он от её же сечения, а не назначается.
   */
  const capOut = 0.12 / 2;
  box(
    "roof",
    [cx, S.RIDGE_Y + 0.08, S.RIDGE_Z],
    [width + capOut * 2, 0.12, 0.5],
    "roof",
  );

  for (const x of [S.ROOF_X0 + 0.35, S.ROOF_X1 - 0.35]) {
    box(
      "roof",
      [x, (S.WALL_TOP - 0.3) / 2, S.DEPTH + S.OVERHANG_EAVE - 0.15],
      [0.12, S.WALL_TOP - 0.3, 0.12],
      "roof",
    );
  }
}

/* ─────────────────────────  08 · фасадный такт  ───────────────────────── */

function buildBands(box) {
  const z = S.DEPTH + S.BAND_PROUD / 2;

  for (const band of S.BANDS) {
    box(
      "bands",
      [(band.x0 + band.x1) / 2, S.FLOOR + S.WALL_H / 2, z],
      [band.x1 - band.x0, S.WALL_H, S.BAND_PROUD],
      "band",
    );
  }

  // Обрамления: лента охватывает проём сверху и снизу, поэтому окно оказывается
  // врезанным в дерево, а не наклеенным на графит.
  for (const o of S.OPENINGS.front) {
    if (!S.REVEAL_KINDS.has(o.kind)) continue;
    const w = o.u1 - o.u0;
    const cx = (o.u0 + o.u1) / 2;
    box(
      "bands",
      [cx, S.FLOOR + o.v1 + (S.WALL_H - o.v1) / 2, z],
      [w, S.WALL_H - o.v1, S.BAND_PROUD],
      "band",
    );
    box("bands", [cx, S.FLOOR + o.v0 / 2, z], [w, o.v0, S.BAND_PROUD], "band");
  }
}

/* ─────────────────────────  09 · проёмы  ───────────────────────── */

function buildOpenings(box) {
  for (const name of S.FACE_NAMES) {
    const face = S.FACES[name];
    for (const o of S.OPENINGS[name] || []) {
      if (o.kind === "recess") continue;

      box(
        "openings",
        face.position((o.u0 + o.u1) / 2, (o.v0 + o.v1) / 2, -0.02),
        face.size(o.u1 - o.u0, o.v1 - o.v0, 0.05),
        "glass",
      );

      // Импосты. Панорама шириной 5.6 м без членений читается витриной, а не
      // окном жилого дома: три секции возвращают ей бытовой масштаб.
      const sections = o.sections || 1;
      for (let i = 1; i < sections; i++) {
        const u = o.u0 + ((o.u1 - o.u0) * i) / sections;
        box(
          "openings",
          face.position(u, (o.v0 + o.v1) / 2, 0.01),
          face.size(S.MULLION, o.v1 - o.v0, 0.1),
          "timber",
        );
      }
    }
  }

  const zBack = S.DEPTH - S.ENTRY.depth;
  for (const o of S.ENTRY_OPENINGS) {
    box(
      "openings",
      [
        (o.u0 + o.u1) / 2,
        S.FLOOR + (o.v0 + o.v1) / 2,
        zBack - S.WALL_T / 2 - 0.02,
      ],
      [o.u1 - o.u0, o.v1 - o.v0, 0.05],
      o.kind === "door" ? "recess" : "glass",
    );
  }
}

/* ─────────────────────────  10 · настил и завершение  ───────────────────────── */

function buildDeck(box) {
  const t = S.TERRACE;

  // Настил не доходит до наружных граней на толщину цоколя: разбор — в
  // комментарии к `DECK_EDGE` в спецификации, там же, где само число.
  const dx1 = S.TOTAL_X1 - S.DECK_EDGE;
  const dz1 = S.DEPTH - S.DECK_EDGE;
  /*
   * Настил террасы назван, и это не украшение отчётов.
   *
   * Он единственная поверхность группы `deck`, которая на самом деле является
   * полом террасы: остальные тела той же группы — ступени, крыльцо и гравийная
   * отмостка. Отделке нужно уметь дать доску ровно ему одному, а замеру —
   * отделить пол от всего прочего. Найти его по материалу или по габариту
   * значило бы угадывать.
   */
  box(
    "deck",
    [(t.x0 + dx1) / 2, S.FLOOR - 0.06, (t.z0 + dz1) / 2],
    [dx1 - t.x0, 0.12, dz1 - t.z0],
    "deck",
  ).name = "terrace_deck";

  for (const step of S.STEPS) {
    box(
      "deck",
      [(step.x0 + step.x1) / 2, step.top - 0.06, (step.z0 + step.z1) / 2],
      [step.x1 - step.x0, 0.12, step.z1 - step.z0],
      "deck",
    );
  }

  const l = S.LOUVRES;
  for (let x = l.x0; x < l.x1 - 0.01; x += l.pitch) {
    box(
      "deck",
      [x + l.width / 2, (S.FLOOR + l.top) / 2, (l.z0 + l.z1) / 2],
      [l.width, l.top - S.FLOOR, l.z1 - l.z0],
      "timber",
    );
  }

  // Ступень перед входом.
  box(
    "deck",
    [(S.ENTRY.x0 + S.ENTRY.x1) / 2, 0.2, S.DEPTH + 0.3],
    [1.8, 0.14, 0.6],
    "deck",
  );

  buildSoffit(box);
  buildPlinth(box);
}

/**
 * Подшивка потолка террасы.
 *
 * По заданию и по референсу потолок крытой террасы деревянный — сплошной, а
 * не открытые стропила. До сих пор его не было, и над террасой оставалась
 * голая стропильная система: шаг 0.9 м при сечении 80 мм на рабочих ракурсах
 * превращается в частую полоску, которая при движении камеры ползёт рябью.
 * Подшивка убирает и рябь, и расхождение с заданием разом.
 *
 * Появляется на последнем такте: на этапе каркаса стропила показать нужно.
 *
 * ПРОРЕЗЕЙ В ПОДШИВКЕ БОЛЬШЕ НЕТ. Они существовали ровно для того, чтобы сквозь
 * них проходили лопасти балки подвеса; со снятием балки (2026-08-03) резать
 * потолок стало не подо что, и панель каждого ската собирается одной коробкой.
 * Раскрой через `subtractOpenings` при этом остаётся общим со стенами — если
 * сквозь потолок когда-нибудь снова что-то пойдёт, вернуть прорезь можно одним
 * списком проёмов.
 */
function buildSoffit(box) {
  const t = S.TERRACE;
  const x0 = t.x0;
  /*
   * Подшивка кончается на ВНУТРЕННЕЙ грани рамы портала.
   *
   * Раньше она доходила до наружной плоскости x = 23.4, где стоит и наружная
   * грань ригеля рамы: две грани, смотрящие в +X, совпадали полосой 0.1929 м².
   * Плоскость наружная и видна на тактах портала и остекления. Теперь подшивка
   * упирается в раму торцом, а торец к торцу безопасен.
   */
  const x1 = S.PORTAL.x - S.PORTAL.thickness;
  const width = x1 - x0;
  const run = S.ROOF_SLOPE_LENGTH;

  for (const sign of [1, -1]) {
    const midZ = S.RIDGE_Z + (sign * S.ROOF_HALF_RUN) / 2;
    const axis = S.soffitAxisAt(midZ);
    // Локальная ось панели после поворота на φ вокруг X смотрит в
    // (0, −sign·sin φ, cos φ) — по ней и раскладываются участки раскроя.
    const stepY = -sign * Math.sin(S.ROOF_ANGLE);
    const stepZ = Math.cos(S.ROOF_ANGLE);

    for (const rect of S.subtractOpenings(width, run, [])) {
      const along = rect.v + rect.h / 2 - run / 2;
      box(
        "deck",
        [x0 + rect.u + rect.w / 2, axis + along * stepY, midZ + along * stepZ],
        [rect.w, S.SOFFIT_T, rect.h],
        "timber",
        [sign * S.ROOF_ANGLE, 0, 0],
      );
    }
  }
}

/**
 * Закрытие цоколя и отмостка.
 *
 * До этого дом стоял на открытых сваях: между землёй и полом зияла щель, и
 * на финальном кадре объём читался парящим на ножках, а не поставленным на
 * участок. Полоса цоколя — это ещё и главная горизонталь силуэта, на которой
 * держится вытянутая пропорция.
 *
 * Появляется на последнем такте: на строительных этапах свайное поле должно
 * быть видно, это часть рассказа о технологии.
 */
function buildPlinth(box) {
  /*
   * Цоколь строго заподлицо с наружной гранью стены и вплотную к полу.
   *
   * Любой уступ здесь — беда: и утопленный, и выступающий цоколь оставляет
   * горизонтальную полку в сантиметр по всей длине дома. На пологом ракурсе
   * она тоньше пикселя, и её край ползёт при движении камеры. Заподлицо полки
   * нет вовсе: от земли до карниза идёт одна плоскость, цоколь отличается
   * только материалом.
   *
   * Совпадения граней при этом не возникает: верх цоколя приходит на отметку
   * пола, где у стены начинается НИЖНЯЯ грань, — это обычный стык, а не две
   * грани, смотрящие в одну сторону.
   */
  const inset = 0.06;
  const h = S.FLOOR - 0.02;
  const y = 0.02 + h / 2;
  const t = 0.12;

  box(
    "deck",
    [S.TOTAL_X1 / 2, y, S.DEPTH - inset],
    [S.TOTAL_X1 - inset * 2, h, t],
    "mass",
  );
  box(
    "deck",
    [S.TOTAL_X1 / 2, y, inset],
    [S.TOTAL_X1 - inset * 2, h, t],
    "mass",
  );
  box("deck", [inset, y, S.DEPTH / 2], [t, h, S.DEPTH - inset * 2], "mass");
  box(
    "deck",
    [S.TOTAL_X1 - inset, y, S.DEPTH / 2],
    [t, h, S.DEPTH - inset * 2],
    "mass",
  );

  /*
   * Гравийная отмостка по периметру — материал `gravel`, а НЕ `deck`.
   *
   * До 2026-08-04 она строилась террасной доской, и это была ошибка назначения,
   * невидимая ровно до покраски: серые тона доски и гравия почти совпадали
   * (0.26 против 0.28). Как только `deck` получил цвет натурального дерева,
   * гравий вокруг дома превратился в деревянную дорожку — владелец указал на
   * неё первой же правкой.
   */
  const w = 0.9;
  box(
    "deck",
    [S.TOTAL_X1 / 2, 0.02, S.DEPTH + w / 2],
    [S.TOTAL_X1 + w * 2, 0.04, w],
    "gravel",
  );
  box(
    "deck",
    [S.TOTAL_X1 / 2, 0.02, -w / 2],
    [S.TOTAL_X1 + w * 2, 0.04, w],
    "gravel",
  );
  box("deck", [-w / 2, 0.02, S.DEPTH / 2], [w, 0.04, S.DEPTH], "gravel");
  box(
    "deck",
    [S.TOTAL_X1 + w / 2, 0.02, S.DEPTH / 2],
    [w, 0.04, S.DEPTH],
    "gravel",
  );
}
/* ─────────────────────────  11 · композиция на террасе  ─────────────────────────
 *
 * Кресло в сцене одно — плетёный кокон, и форма у него настоящая, а не прокси:
 * замкнутая капля с ограниченным устьем строится собственной сеткой, вогнутое
 * ложе снимается с неё же. Прежние формы — прокси из примитивов вращения и
 * свип-модель из `chair-model.js` — удалены решением владельца 2026-08-04
 * вместе с переключателем `?chair=`. Их числа и признаки приёмки сохранены
 * архивом в `CHAIR` спецификации.
 */

/*
 * Помощники приходят одним объектом, а не россыпью аргументов: к `solid`
 * добавился `part`, вешающий на оба кресла ОДНУ геометрию. Позиционные аргументы
 * на четвёртом помощнике уже начали путаться местами — этим и была вызвана
 * поломка сборки.
 *
 * `part` — то, чем строится сам кокон: через него оболочка и ложе попадают на
 * оба кресла одной геометрией и в `owned`, то есть освобождаются вместе со
 * сценой.
 */
/**
 * Слить список коробок в ОДНУ геометрию.
 *
 * Ради вызовов отрисовки. Шестнадцать реек шестнадцатью телами — это шестнадцать
 * вызовов на предмет, который весь целиком занимает 100 px; узкое место этой
 * сцены — именно вызовы (0.0027 мс на тело), а треугольники против них почти
 * бесплатны. Слитая геометрия даёт один вызов и, в отличие от `InstancedMesh`,
 * сохраняет верный габарит: сборка групп считает верх элемента по его
 * `boundingBox`, а у инстансированного тела он остался бы от одной коробки.
 *
 * Нормали ставятся по граням, поэтому рёбра остаются острыми — рейка обязана
 * иметь ребро, на нём и держится вся её читаемость.
 */
function mergeBoxes(boxes) {
  const FACES = [
    [
      [0, 0, 1],
      [
        [-1, -1, 1],
        [1, -1, 1],
        [1, 1, 1],
        [-1, 1, 1],
      ],
    ],
    [
      [0, 0, -1],
      [
        [1, -1, -1],
        [-1, -1, -1],
        [-1, 1, -1],
        [1, 1, -1],
      ],
    ],
    [
      [1, 0, 0],
      [
        [1, -1, 1],
        [1, -1, -1],
        [1, 1, -1],
        [1, 1, 1],
      ],
    ],
    [
      [-1, 0, 0],
      [
        [-1, -1, -1],
        [-1, -1, 1],
        [-1, 1, 1],
        [-1, 1, -1],
      ],
    ],
    [
      [0, 1, 0],
      [
        [-1, 1, 1],
        [1, 1, 1],
        [1, 1, -1],
        [-1, 1, -1],
      ],
    ],
    [
      [0, -1, 0],
      [
        [-1, -1, -1],
        [1, -1, -1],
        [1, -1, 1],
        [-1, -1, 1],
      ],
    ],
  ];
  const position = [];
  const normal = [];
  const index = [];
  let v = 0;
  for (const { pos, size } of boxes) {
    const hw = size[0] / 2,
      hh = size[1] / 2,
      hd = size[2] / 2;
    for (const [n, corners] of FACES) {
      for (const [sx, sy, sz] of corners) {
        position.push(pos[0] + sx * hw, pos[1] + sy * hh, pos[2] + sz * hd);
        normal.push(n[0], n[1], n[2]);
      }
      index.push(v, v + 1, v + 2, v, v + 2, v + 3);
      v += 4;
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(position, 3),
  );
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normal, 3));
  geometry.setIndex(index);
  return geometry;
}

/**
 * Реечная панель с бра.
 *
 * Четыре тела: основание, графитовая подложка, все рейки одной слитой
 * геометрией и корпус бра. Пятое — светящаяся вставка — заводится отдельным
 * именем, чтобы отделка могла дать ей свой материал, как она это делает фонарю.
 *
 * Панель стоит НА подложке, а не на стене: между рейками обязана быть тень, а не
 * цвет стены. Рейки вынесены вперёд подложки на всю свою глубину, поэтому у
 * панели есть настоящая боковая грань — на азимуте финала она видна, и именно
 * она отличает объём от текстуры, наклеенной на стену.
 */
function buildScreen(box, shape) {
  const s = S.SCREEN;
  const width = s.x1 - s.x0;
  const cx = (s.x0 + s.x1) / 2;
  const wall = S.TERRACE.z0;

  // Основание: чуть глубже подложки, чтобы читалось подрезкой, а не полосой.
  const baseD = 0.05;
  box(
    "screen",
    [cx, S.FLOOR + s.base / 2, wall + baseD / 2],
    [width, s.base, baseD],
    "backing",
  );

  const bodyBottom = S.FLOOR + s.base;
  // Верх берётся у потолка террасы, а не из спецификации: см. `SCREEN.topGap`.
  const bodyH = S.soffitUnderAt(S.TERRACE.z0) - s.topGap - bodyBottom;
  box(
    "screen",
    [cx, bodyBottom + bodyH / 2, wall + s.backing / 2],
    [width, bodyH, s.backing],
    "backing",
  );

  /*
   * Раскладка реек. Число выводится из шага, а не задаётся: правка ширины панели
   * или шага не имеет права оставить половину рейки у края. Остаток делится
   * поровну в оба поля, поэтому панель симметрична при любых числах.
   */
  const pitch = s.slat.width + s.slat.gap;
  const count = Math.max(1, Math.floor((width + s.slat.gap) / pitch));
  const used = count * s.slat.width + (count - 1) * s.slat.gap;
  const margin = (width - used) / 2;
  const slatZ = wall + s.backing + s.slat.depth / 2;

  const slats = [];
  for (let i = 0; i < count; i++) {
    const x = s.x0 + margin + s.slat.width / 2 + i * pitch;
    slats.push({
      pos: [x, bodyBottom + bodyH / 2, slatZ],
      size: [s.slat.width, bodyH, s.slat.depth],
    });
  }
  shape("screen", mergeBoxes(slats), "slat");

  /*
   * Бра. Корпус утоплен между рейками и вынесен вперёд на `proud`: он обязан
   * стоять НА панели, а не висеть перед ней, иначе теряется вся мысль про
   * встроенный светильник.
   *
   * По одному на кресло, и координата X берётся у кресла, а не у панели: ритм
   * стены обязан быть ритмом мебели. Разбор — в `SCREEN.sconce`.
   */
  const sc = s.sconce;
  const face = wall + s.backing + s.slat.depth;
  for (const chair of S.CHAIRS) {
    box(
      "screen",
      [chair.x, S.FLOOR + sc.at, face + sc.proud / 2],
      [sc.width, sc.height, sc.proud],
      "backing",
    );
    // Светящаяся вставка. Своё имя — отделка вешает на неё собственный материал с
    // яркостью НИЖЕ оконной: порядок яркостей в кадре обязан быть жёстким. Имя у
    // обоих одно: отделка красит их обходом по имени, и разводить их незачем.
    const glow = box(
      "screen",
      [chair.x, S.FLOOR + sc.at, face + sc.proud - 0.004],
      [sc.width * 0.55, sc.height * 0.82, 0.006],
      "glass",
    );
    glow.name = "sconce_glow";
    glow.castShadow = false;
  }
}

/**
 * Вазон со злаками.
 *
 * Два тела: сам вазон примитивом вращения (он общий на всю сцену, своей
 * геометрии не заводит) и все стебли ОДНОЙ слитой лентой.
 */
function buildPlanter(solid, shape, parent) {
  const p = S.PLANTER;
  solid(
    parent,
    "cyl",
    "pot",
    [p.x, S.FLOOR + p.height / 2, p.z],
    [p.diameter, p.height, p.diameter],
  );
  const grass = shape("planter", buildGrass(), "grass");
  grass.name = "grass";
  /*
   * Тень злаки не отбрасывают. Лента нулевой толщины, освещённая с двух сторон,
   * затеняет сама себя косой штриховкой — этот дефект в проекте уже разбирался
   * и на плетении кресла, и на пледе. Покупать тут нечего: стебель на рабочей
   * дистанции 1.6 px, его тень заведомо тоньше смещения теневой карты.
   */
  grass.castShadow = false;
}

/**
 * Стебли злаков — одна лента на все пучки.
 *
 * ФОРМА. Стебель — полоса переменной ширины, сходящая к вершине на нет, с
 * наклоном и загибом. Не коробка: на 2 px коробка даёт три плоские грани и
 * гаснет вместе с ними, а лента ловит свет одной стороной и потому читается.
 *
 * СЛУЧАЙНОСТЬ ДЕТЕРМИНИРОВАННАЯ. Свой генератор с постоянным зерном, а не
 * `Math.random`: вся сцена выводится из времени и обязана воспроизводиться кадр
 * в кадр при обратной прокрутке, повторном запуске и сравнении кадров. Со
 * случайными числами каждая загрузка давала бы свой куст, и попиксельное
 * сравнение, на котором стоит вся приёмка этого проекта, перестало бы работать.
 */
function buildGrass() {
  const p = S.PLANTER;
  const b = p.blade;
  const position = [];
  const normal = [];
  const index = [];
  let v = 0;

  let seed = 20260802;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };

  const top = S.FLOOR + p.height;
  const radius = p.diameter / 2;

  for (const [ox, oz, count, height, spread] of p.tufts) {
    for (let i = 0; i < count; i++) {
      // Точка выхода внутри пучка. Корень квадратный — иначе стебли собираются
      // к центру и пучок снова читается фейерверком из одной точки.
      const a = rnd() * TAU;
      const r = spread * Math.sqrt(rnd());
      const bx = p.x + ox + Math.cos(a) * r;
      const bz = p.z + oz + Math.sin(a) * r;
      // Высота, наклон, направление и ширина — у каждого стебля свои.
      const h = height * (0.62 + 0.38 * rnd());
      const dir = rnd() * TAU;
      const lean = b.lean * (0.35 + 0.65 * rnd());
      const half = (b.width * (0.7 + 0.5 * rnd())) / 2;
      // Стебли выходят из грунта, а грунт утоплен в вазон на пару сантиметров.
      const y0 = top - 0.02;

      for (let s = 0; s <= b.segments; s++) {
        const t = s / b.segments;
        // Загиб: линейный наклон плюс квадратичный завал вершины.
        const off = (lean * t + b.curve * lean * t * t) * h;
        const cx = bx + Math.cos(dir) * off;
        const cz = bz + Math.sin(dir) * off;
        const w = half * (1 - t * 0.92);
        // Лента развёрнута ПОПЕРЁК направления наклона: тогда она видна плашмя
        // с той стороны, куда клонится, и не превращается в нить.
        const px = -Math.sin(dir) * w;
        const pz = Math.cos(dir) * w;
        const ny = 0.3;
        const nx = Math.cos(dir),
          nz = Math.sin(dir);
        const len = Math.hypot(nx, ny, nz);
        position.push(cx - px, y0 + h * t, cz - pz);
        normal.push(nx / len, ny / len, nz / len);
        position.push(cx + px, y0 + h * t, cz + pz);
        normal.push(nx / len, ny / len, nz / len);
      }
      for (let s = 0; s < b.segments; s++) {
        const a0 = v + s * 2;
        index.push(a0, a0 + 1, a0 + 2, a0 + 1, a0 + 3, a0 + 2);
      }
      v += (b.segments + 1) * 2;
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(position, 3),
  );
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normal, 3));
  geometry.setIndex(index);
  return geometry;
}

function buildLifestyle(helpers, parent, stands, units) {
  const { solid, part } = helpers;
  /*
   * Обе геометрии строятся ОДИН раз на оба кресла: они одинаковые, и платить за
   * форму дважды не за что.
   */
  const shells = { cocoon: buildCocoonShell(), cradle: buildCocoonCradle() };

  /*
   * ВЫСОТА ПОДВЕСА ВЫВОДИТСЯ ИЗ КРЕСЛА, А НЕ НАОБОРОТ.
   *
   * Пока кресло висело на балке, порядок был обратный: отметка балки диктовала
   * длину цепи. Со стойкой ведущим стало кресло — сначала известно, где у него
   * узел (у кокона это самая высокая точка наклонённой оболочки, снятая с
   * геометрии), и уже от него вершина дуги отстоит на длину цепи. Поэтому
   * высота стойки нигде не записана числом и не может разойтись с формой капли.
   */
  const hangAbove =
    S.CHAIR.cocoon.profile[0][1] +
    (shells.cocoon.knot.y - shells.cocoon.lowest);
  const tipAbove = hangAbove + S.STAND.chain;

  /*
   * Период качания СЧИТАЕТСЯ ЗДЕСЬ, а не берётся из спецификации.
   *
   * Он есть следствие геометрии: T = 2π√(L/g), где L меряется от оси качания
   * (вершина стойки) до центра тяжести подвешенной сборки. Записанное рядом с
   * амплитудами число разошлось бы с формой капли или длиной цепи молча — а
   * заметить такое расхождение на кадре нельзя, кресло просто качается не своим
   * периодом. Заодно все три формы кресла получают свой период даром: у прокси и
   * модели узел подвеса выше, и они честно качаются медленнее.
   */
  const period = TAU * Math.sqrt((tipAbove - S.SWING.bob) / S.SWING.g);

  // Одна геометрия на обе стойки: они одинаковые, а разводит их только доворот.
  const standBody = buildStandBody(tipAbove);
  buildRug(part, parent);
  for (const chair of S.CHAIRS) {
    const axis = S.standAxis(chair);
    const stand = part(stands, standBody, "steel", [chair.x, S.FLOOR, chair.z]);
    stand.name = "stand_" + chair.id;
    stand.rotation.y = axis;
    buildSwing(helpers, parent, chair, axis, tipAbove, units, shells);
  }
  buildTable(solid, parent);
  return { tipAbove, period };
}

/**
 * Тело стойки: гнутая труба и плита основания ОДНОЙ геометрией.
 *
 * ПОЧЕМУ ОДНИМ ТЕЛОМ. Узкое место этой сцены — вызовы отрисовки, а не
 * треугольники. Труба и плита разными мешами стоили бы четырёх вызовов на пару
 * кресел; слитые — двух, и это ровно тот же приём, каким в проекте собраны рейки
 * панели (`mergeBoxes`) и обруч кокона (впаян в оболочку). Слияние сделано на
 * уровне буфера, а не `mergeGeometries`, потому что у трубы и коробки всё равно
 * разные генераторы вершин и промежуточные геометрии пришлось бы заводить и
 * тут же выбрасывать.
 *
 * ФОРМА. Ось — кубическая кривая с листа B2: от плиты вверх и плавно вперёд, к
 * точке ровно над узлом подвеса. Первая контрольная точка стоит на 0.6 высоты
 * (см. `STAND.knee`), поэтому гиб распределён по верхней трети и стойка читается
 * гнутой трубой, а не буквой Г со скруглением.
 *
 * СЕЧЕНИЕ ПЕРЕНОСИТСЯ ПАРАЛЛЕЛЬНО, А НЕ СТРОИТСЯ ЧЕРЕЗ «КАСАТЕЛЬНАЯ × ВЕРТИКАЛЬ».
 * Ось стойки почти вертикальна на всём нижнем участке, а там это произведение
 * вырождается и сечение перекручивается на ровном месте — этот дефект в проекте
 * уже разбирался на дуге кресла. Здесь кривая ПЛОСКАЯ, поэтому достаточно взять
 * постоянную бинормаль (поперёк плоскости дуги) и получать вторую ось сечения
 * как её произведение с касательной: кручения не возникает по построению.
 *
 * НОРМАЛИ ГЛАДКИЕ, в отличие от `mergeBoxes`. Труба круглая, и на 5…6 px
 * гранёная заливка даёт ступеньку блика вдоль всей высоты; у плиты, наоборот,
 * нормали по граням — ребро плиты обязано остаться ребром.
 */
function buildStandBody(tipAbove) {
  const s = S.STAND;
  const position = [];
  const normal = [];
  const index = [];
  let v = 0;

  /*
   * Ось дуги в плоскости «вдоль стойки × высота»: местная z смотрит вперёд, к
   * креслу, начало координат — под осью подвеса на настиле. Ось начинается на
   * самом настиле и проходит плиту насквозь: тогда стык закрыт при любой правке
   * толщины плиты, а нижний торец трубы прятать не нужно — его просто нет.
   */
  const back = -(s.baseBack - s.foot);
  const p0 = [back, 0];
  const p1 = [back, tipAbove * s.knee];
  const p2 = [back + s.lead, tipAbove];
  const p3 = [0, tipAbove];
  const at = (t) => {
    const u = 1 - t;
    const a = u * u * u,
      b = 3 * u * u * t,
      c = 3 * u * t * t,
      d = t * t * t;
    return [
      a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0],
      a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1],
    ];
  };

  const r = s.tube / 2;
  const rings = [];
  for (let i = 0; i <= s.segments; i++) {
    const t = i / s.segments;
    const [z, y] = at(t);
    // Касательная берётся конечной разностью по самой кривой: аналитическая
    // производная в концах вырождается там, где контрольные точки совпадают.
    const e = 1e-4;
    const [z0, y0] = at(Math.max(0, t - e));
    const [z1, y1] = at(Math.min(1, t + e));
    const len = Math.hypot(z1 - z0, y1 - y0) || 1;
    const tz = (z1 - z0) / len,
      ty = (y1 - y0) / len;
    // Дуга лежит в плоскости YZ, поэтому бинормаль постоянна и равна оси X, а
    // вторая ось сечения выходит из неё и касательной без всякого переноса.
    rings.push({ z, y, nz: ty, ny: -tz });
  }

  const cols = s.sides + 1; // шов дублируется: развёртка расходится, нормаль нет
  for (const ring of rings) {
    for (let k = 0; k < cols; k++) {
      const a = ((k % s.sides) / s.sides) * TAU;
      const ca = Math.cos(a),
        sa = Math.sin(a);
      // Точка сечения: ca — вдоль бинормали (ось X), sa — вдоль второй оси.
      const nx = ca;
      const ny = sa * ring.ny;
      const nz = sa * ring.nz;
      position.push(nx * r, ring.y + ny * r, ring.z + nz * r);
      normal.push(nx, ny, nz);
    }
  }
  for (let i = 0; i < s.segments; i++) {
    for (let k = 0; k < s.sides; k++) {
      const a = v + i * cols + k;
      const b = a + cols;
      index.push(a, b, b + 1, a, b + 1, a + 1);
    }
  }
  v += rings.length * cols;

  // Крышка вершины. Нижнего торца нет вовсе: он внутри плиты и закрыт ею.
  {
    const ring = rings[rings.length - 1];
    const base = v;
    for (let k = 0; k < s.sides; k++) {
      const a = (k / s.sides) * TAU;
      const ca = Math.cos(a),
        sa = Math.sin(a);
      position.push(
        ca * r,
        ring.y + sa * ring.ny * r,
        ring.z + sa * ring.nz * r,
      );
      normal.push(0, ring.nz, -ring.ny); // касательная оси, наружу из трубы
    }
    // Обход развёрнут: сечение обходится против часовой стрелки, если смотреть
    // ВДОЛЬ касательной, поэтому прямой веер смотрел бы внутрь трубы.
    for (let k = 1; k < s.sides - 1; k++)
      index.push(base, base + k + 1, base + k);
    v += s.sides;
  }

  // Плита основания. Грани разложены руками, а не через `mergeBoxes`: тому нужен
  // собственный буфер, а здесь тело уже собирается в общий.
  {
    const cz = (s.baseFore - s.baseBack) / 2;
    const hx = s.plan / 2,
      hy = s.thickness / 2,
      hz = (s.baseBack + s.baseFore) / 2;
    const faces = [
      [
        [0, 0, 1],
        [
          [-1, -1, 1],
          [1, -1, 1],
          [1, 1, 1],
          [-1, 1, 1],
        ],
      ],
      [
        [0, 0, -1],
        [
          [1, -1, -1],
          [-1, -1, -1],
          [-1, 1, -1],
          [1, 1, -1],
        ],
      ],
      [
        [1, 0, 0],
        [
          [1, -1, 1],
          [1, -1, -1],
          [1, 1, -1],
          [1, 1, 1],
        ],
      ],
      [
        [-1, 0, 0],
        [
          [-1, -1, -1],
          [-1, -1, 1],
          [-1, 1, 1],
          [-1, 1, -1],
        ],
      ],
      [
        [0, 1, 0],
        [
          [-1, 1, 1],
          [1, 1, 1],
          [1, 1, -1],
          [-1, 1, -1],
        ],
      ],
      [
        [0, -1, 0],
        [
          [-1, -1, -1],
          [1, -1, -1],
          [1, -1, 1],
          [-1, -1, 1],
        ],
      ],
    ];
    for (const [n, corners] of faces) {
      for (const [sx, sy, sz] of corners) {
        position.push(sx * hx, hy + sy * hy, cz + sz * hz);
        normal.push(n[0], n[1], n[2]);
      }
      index.push(v, v + 1, v + 2, v, v + 2, v + 3);
      v += 4;
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(position, 3),
  );
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normal, 3));
  geometry.setIndex(index);
  return geometry;
}

/**
 * Уличный ковёр — один плоский меш со скруглёнными углами.
 *
 * Толщины у него нет намеренно. Ковёр 12 мм на рабочей дистанции даёт по кромке
 * 0.3 px: коробка вместо плоскости стоила бы вчетверо больше треугольников и
 * добавила бы четыре вертикальные грани, из которых ни одна не видна. Кромку
 * рисует не геометрия, а тень и обрыв фактуры.
 *
 * Тень ковёр НЕ отбрасывает: при 12 мм его собственная тень уже теряется в
 * смещении карты, зато на скользящем вечернем солнце (12.4°) она вылезала бы
 * из-под него полосой и читалась бы вторым ковром. Принимать тень он обязан —
 * контакт кресел с полом даёт именно она.
 *
 * Развёртка идёт в МЕТРАХ: `ShapeGeometry` кладёт в UV сами координаты контура,
 * поэтому масштаб фактуры задаётся одним `repeat` в отделке и не зависит ни от
 * габарита ковра, ни от компоновки.
 */
function buildRug(part, parent) {
  const r = S.rugRect();
  const geometry = new THREE.ShapeGeometry(
    roundedRect(r.w, r.d, S.RUG.corner),
    6,
  );
  // Контур строится в плоскости XY, а лежать обязан в плоскости настила.
  geometry.rotateX(-Math.PI / 2);
  const mesh = part(parent, geometry, "rug", [r.cx, r.top, r.cz]);
  mesh.name = "rug";
  mesh.castShadow = false;
  return mesh;
}

/** Прямоугольник со скруглёнными углами, центрированный в начале координат. */
function roundedRect(w, d, radius) {
  const x = w / 2;
  const z = d / 2;
  const r = Math.min(radius, x, z);
  const shape = new THREE.Shape();
  shape.moveTo(-x + r, -z);
  shape.lineTo(x - r, -z);
  shape.quadraticCurveTo(x, -z, x, -z + r);
  shape.lineTo(x, z - r);
  shape.quadraticCurveTo(x, z, x - r, z);
  shape.lineTo(-x + r, z);
  shape.quadraticCurveTo(-x, z, -x, z - r);
  shape.lineTo(-x, -z + r);
  shape.quadraticCurveTo(-x, -z, -x + r, -z);
  return shape;
}

/**
 * Оболочка кокона — замкнутое тело вращения с ОГРАНИЧЕННЫМ УСТЬЕМ спереди.
 *
 * Строится ОДИН раз и вешается на оба кресла: они одинаковые, и платить за форму
 * дважды не за что.
 *
 * ПОЧЕМУ НЕ `LatheGeometry` И НЕ НЕПОЛНЫЙ ОБОРОТ. Неполный оборот режет тело от
 * полюса до полюса: вырез идёт во всю высоту, и его кромка даёт в силуэте прямую
 * вертикаль — ровно ту линию, которую владелец обвёл маркером. Ограниченное
 * устье неполным оборотом не строится вовсе, а выборкой граней из готового тела
 * строится плохо: кромка ложится лесенкой по сетке, и обруч по ней идёт пилой.
 *
 * ЧТО СДЕЛАНО ВМЕСТО ЭТОГО. Сетка остаётся правильным четырёхугольным полем
 * (segments + 1) × рядов, но У КАЖДОГО РЯДА СВОЙ НАЧАЛЬНЫЙ АЗИМУТ: вне устья он
 * равен нулю (ряд — полное кольцо, первый и последний столбцы совпадают в
 * пространстве и расходятся только развёрткой), внутри устья — полууглу выреза
 * на этой отметке. Тогда кромка устья лежит на аналитическом овале ТОЧНО, ни
 * одна грань не удаляется, ни одна дыра не сшивается, а оболочка остаётся
 * замкнутой и снизу, и сверху.
 *
 * Сам овал задан в плоскости «азимут × высота»: полуугол падает от `open` в
 * середине до нуля на концах по закону окружности. Кольца сетки внутри устья
 * ставятся по косинусу (см. `cocoonRows`) — тогда в эту окружность вписывается
 * правильный многоугольник и уклонение кромки от овала одинаково по всей петле.
 *
 * Профиль задан долями полуширины, а глубина отличается от ширины — поэтому круг
 * в плане превращается в эллипс прямо в построении, а не вторым профилем: два
 * профиля разошлись бы на первой же правке габарита.
 *
 * Возвращается не только геометрия: `knot` — самая высокая точка НАКЛОНЁННОЙ
 * оболочки, то есть место, куда приходит цепь, а `lowest` — самая низкая. Оба
 * числа нужны сборке и оба обязаны считаться по самой форме: заданные руками,
 * они разошлись бы с ней на первой правке профиля или наклона.
 */
/**
 * Обвод эллипса с полуосями `a` и `b`.
 *
 * Считается суммой хорд, а не приближением Рамануджана: разница на здешних
 * пропорциях меньше микрона, зато формула не требует доверия к чужому ряду, а по
 * ней выводится ЦЕЛОЕ число прядей плетения — ошибка в нём разошлась бы швом.
 */
function ellipseGirth(a, b, steps = 720) {
  let sum = 0;
  for (let i = 1; i <= steps; i++) {
    const t0 = (TAU * (i - 1)) / steps;
    const t1 = (TAU * i) / steps;
    sum += Math.hypot(
      a * (Math.sin(t1) - Math.sin(t0)),
      b * (Math.cos(t1) - Math.cos(t0)),
    );
  }
  return sum;
}

function buildCocoonShell() {
  const c = S.CHAIR;
  const co = c.cocoon;
  const ax = c.width / 2;
  const az = c.depth / 2;
  const rows = cocoonRows(co);
  const nRows = rows.length;
  const cols = co.segments + 1;
  const at = (i, j) => i * nRows + j;

  const mid = (co.mouth.from + co.mouth.to) / 2;
  const half = (co.mouth.to - co.mouth.from) / 2;
  const openHalf = co.open * DEG;
  const edge = cocoonMouthEdge(co);
  /** Полуугол устья на отметке — кромка устья, снятая с её же нормированной формы. */
  const openAt = (y) => openHalf * edge.width((y - mid) / half);

  /*
   * ВЫСОТА РАЗВЁРТКИ — длина по профилю, одна на весь ряд.
   *
   * Считать её по каждому столбцу отдельно нельзя: эллипс растягивает профиль по
   * X и Z по-разному (0.46 против 0.44), 4.5 % копятся вдоль профиля и к макушке
   * дают перекос больше половины клетки — горизонтальные ряды плетения поехали
   * бы винтом. Средняя по обводу длина держит ряды прямыми ценой ±2 % на высоту
   * клетки, чего не видно. Среднее берётся интегралом по азимуту, а не по
   * столбцам: тогда оно не зависит от разбиения.
   */
  const vAt = [0];
  for (let j = 1; j < nRows; j++) {
    const dr = rows[j][0] - rows[j - 1][0];
    const dy = rows[j][1] - rows[j - 1][1];
    let sum = 0;
    for (let s = 0; s < 64; s++) {
      const phi = (TAU * (s + 0.5)) / 64;
      sum += Math.hypot(
        dr * Math.hypot(ax * Math.sin(phi), az * Math.cos(phi)),
        dy,
      );
    }
    vAt[j] = vAt[j - 1] + sum / 64;
  }

  /*
   * ШИРИНА РАЗВЁРТКИ — АЗИМУТ, А НЕ ДУГА ПОЯСА. Правка 2026-08-04.
   *
   * До неё `u` был накопленной длиной дуги пояса, натянутой на целое число
   * клеток СВОЁ У КАЖДОГО ПОЯСА. Идея была честная — держать клетку физической по
   * всей капле, — но у неё есть следствие, которого не заметили: раз число клеток
   * пояса меняется по высоте (1, 6, 12, 17, 21, 24, 27 снизу вверх), то `u`
   * зависит не только от азимута, но и от РЯДА. А развёртка, в которой `u`
   * зависит от ряда, кладёт меридиан наискось, и квадратная клетка ложится на
   * поверхность параллелограммом. Замер по геометрии, задний азимут: 20 рядов из
   * 28 отклонялись от прямого угла больше чем на 15°, худший — 14.3° вместо 90°.
   * На кадре это читалось косыми штрихами у обоих полюсов.
   *
   * Ключ к лечению в том, что параллель и меридиан на теле вращения ортогональны
   * ВСЕГДА. Значит любая развёртка вида `u = f(азимут)`, `v = g(отметка)` даёт
   * прямоугольную клетку везде, и ромб при ней невозможен по построению. Худший
   * угол стал 85.2°; остаток в 4.8° даёт эллипс в плане (0.46 против 0.44) и
   * неустраним ничем.
   *
   * ЦЕНА, ЧЕСТНО: клетка перестала быть физически одинаковой. Её ширина теперь
   * пропорциональна обводу пояса — 105 мм на экваторе и тем меньше, чем ближе к
   * полюсу. Высота ряда осталась постоянной, потому что `v` по-прежнему
   * метрический. Это ровно то, как вяжут корзину: пряди сходятся ко дну, а ряды
   * прута идут одним шагом. Прежняя запись «клетка остаётся физической на всей
   * капле» была верна только на бумаге: на поверхности она такой не была.
   *
   * ЧИСЛО ПРЯДЕЙ СЧИТАЕТСЯ ПО САМОМУ ШИРОКОМУ ПОЯСУ и обязано быть ЦЕЛЫМ: тогда
   * рисунок сходится сам с собой на шве, и по фронту капли выше и ниже устья нет
   * разрыва. На нынешней капле это 27.
   */
  let widest = 0;
  for (const [r] of rows) if (r > widest) widest = r;
  const girth = ellipseGirth(ax * widest, az * widest);
  const strands = Math.max(1, Math.round(girth / co.weaveCell));
  const kU = (strands * co.weaveCell) / TAU;

  const position = new Float32Array(cols * nRows * 3);
  const normal = new Float32Array(cols * nRows * 3);
  const uv = new Float32Array(cols * nRows * 2);

  for (let j = 0; j < nRows; j++) {
    const [r, y] = rows[j];
    const phi0 = openAt(y);
    const span = TAU - phi0 * 2;

    /*
     * Касательная профиля центральной разностью — по ней считается нормаль.
     * Аналитическая нормаль, а не `computeVertexNormals`: усреднение по граням
     * развело бы нормали на шве полного оборота и провело бы по фронту капли
     * жёсткую складку там, где поверхность гладкая.
     */
    const prev = rows[Math.max(0, j - 1)];
    const next = rows[Math.min(nRows - 1, j + 1)];
    const dr = next[0] - prev[0];
    const dy = next[1] - prev[1];

    for (let i = 0; i < cols; i++) {
      const raw = phi0 + (span * i) / co.segments;
      // Последний столбец замкнутого пояса — тот же азимут, что и первый: точки
      // обязаны совпасть в пространстве и разойтись только развёрткой.
      const phi = raw >= TAU - 1e-9 ? raw - TAU : raw;
      const sin = Math.sin(phi);
      const cos = Math.cos(phi);
      const k = at(i, j);
      position[k * 3] = ax * r * sin;
      position[k * 3 + 1] = y;
      position[k * 3 + 2] = az * r * cos;
      // N = ∂P/∂φ × ∂P/∂t, делённое на r: для профиля, идущего вверх, оно смотрит
      // наружу и на полюсах не вырождается.
      const nx = az * dy * sin;
      const ny = -ax * az * dr;
      const nz = ax * dy * cos;
      const len = Math.hypot(nx, ny, nz) || 1;
      normal[k * 3] = nx / len;
      normal[k * 3 + 1] = ny / len;
      normal[k * 3 + 2] = nz / len;
      uv[k * 2] = kU * raw;
      uv[k * 2 + 1] = vAt[j];
    }
  }

  const index = [];
  for (let i = 0; i < co.segments; i++) {
    for (let j = 0; j + 1 < nRows; j++) {
      const a = at(i, j);
      const b = at(i + 1, j);
      const d = at(i, j + 1);
      const e = at(i + 1, j + 1);
      index.push(a, b, d, b, e, d);
    }
  }

  const shell = new THREE.BufferGeometry();
  shell.setAttribute("position", new THREE.BufferAttribute(position, 3));
  shell.setAttribute("normal", new THREE.BufferAttribute(normal, 3));
  shell.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  shell.setIndex(index);

  /*
   * Где висит кресло и где оно кончается снизу.
   *
   * Наклон капли выражен в сборке поворотом узла, поэтому обе отметки считаются
   * в ПОВЁРНУТОЙ системе: цепь приходит в самую высокую точку наклонённой
   * оболочки, а просвет над настилом меряется от самой низкой. Ищется только по
   * сетке оболочки: обруч кромки выступает за неё на половину своей толщины и
   * подвесом не является.
   */
  const t = -co.tilt * DEG;
  const ct = Math.cos(t);
  const st = Math.sin(t);
  let knot = null;
  let lowest = Infinity;
  for (let k = 0; k < cols * nRows; k++) {
    const y = position[k * 3 + 1] * ct - position[k * 3 + 2] * st;
    const z = position[k * 3 + 1] * st + position[k * 3 + 2] * ct;
    if (y < lowest) lowest = y;
    if (
      !knot ||
      y > knot.y + 1e-9 ||
      (Math.abs(y - knot.y) <= 1e-9 && Math.abs(z) < Math.abs(knot.z))
    )
      knot = { y, z };
  }

  const jFrom = rows.findIndex(([, y]) => y >= co.mouth.from - 1e-6);
  const jTo = rows.findIndex(([, y]) => y >= co.mouth.to - 1e-6);
  // Обруч кромки впаивается в ту же геометрию: он обязан быть одним телом с
  // оболочкой, иначе стоит второго вызова отрисовки на каждое кресло, а узкое
  // место сцены — именно вызовы.
  return {
    geometry: mergeGeometries([
      shell,
      buildCocoonRim(shell, nRows, co.segments, jFrom, jTo),
    ]),
    knot,
    lowest,
  };
}

/**
 * КРОМКА УСТЬЯ В НОРМИРОВАННЫХ КООРДИНАТАХ «полуугол × отметка».
 *
 * Обе величины приведены к единице: полуугол делится на `open`, отметка — на
 * полувысоту устья. В этой плоскости кромка — СУПЕРЭЛЛИПС |t|ⁿ + |v|ⁿ = 1, и вся
 * её форма задана одним числом `mouth.power`. При n = 2 это ровно окружность,
 * то есть прежняя линза; чем n больше, тем прямее бока и тем короче концы.
 *
 * ЗАЧЕМ ПРЯМЫЕ БОКА. На той высоте, где полуугол устья БОЛЬШЕ угла лимба, силуэт
 * кресла рисует не оболочка, а фланг выреза, и его вынос равен
 * R(y)·cos(φ₀(y) − лимб). У линзы множитель проседает к середине устья и обратно —
 * он подтачивает выпуклость капли изнутри и ВЫПРЯМЛЯЕТ обвод. При прямых боках
 * φ₀ почти постоянен, значит почти постоянен и множитель, а постоянный множитель
 * по горизонтали прямизны не создаёт: обвод остаётся подобен обводу целой капли.
 *
 * ПОЧЕМУ СУПЕРЭЛЛИПС, А НЕ «ПРЯМЫЕ БОКА С ПОЛУКРУГЛЫМИ КОНЦАМИ». Стадион даёт ту
 * же прямизну, но на стыке прямой с дугой кривизна прыгает с нуля на конечную, и
 * при доле прямых боков выше половины радиус загиба конца падает ниже толщины
 * самого обруча — прут такого не гнёт, и на кадре угол устья читается срезанным.
 * У суперэллипса кривизна непрерывна на всей петле при любом n.
 *
 * `width(v)` — полуширина в долях `open`; `mark(k, rings)` — отметка k-го кольца
 * сетки в долях полувысоты.
 *
 * КОЛЬЦА СТАВЯТСЯ РАВНЫМИ ДОЛЯМИ ДУГИ КРОМКИ, а не равными долями высоты.
 * Причина не в красоте: сетка вписывает в кромку многоугольник, и равная дуга
 * раскладывает уклонение поровну по всей петле. На окружности это в точности
 * прежнее y = середина − половина × cos(πk/rings). Равные доли высоты при том же
 * числе колец давали бы у концов 49 мм — вдвое больше половины толщины обруча, и
 * обруч там разошёлся бы с кромкой.
 */
function cocoonMouthEdge(co) {
  const n = Math.max(2, co.mouth.power);
  const width = (v) => {
    const a = Math.min(1, Math.abs(v));
    return Math.pow(Math.max(0, 1 - Math.pow(a, n)), 1 / n);
  };

  /*
   * Кромка параметризована так, что при n = 2 она в точности окружность:
   * отметка sin ψ, полуширина cos ψ. Прямо по отметке кривую брать нельзя —
   * на концах овала её производная бесконечна, и таблица дуги там соврала бы.
   */
  const STEPS = 1024;
  const at = (s) => {
    const psi = Math.PI * (s / STEPS - 0.5);
    const sn = Math.sin(psi),
      cs = Math.cos(psi);
    return [
      Math.pow(Math.abs(cs), 2 / n),
      Math.sign(sn) * Math.pow(Math.abs(sn), 2 / n),
    ];
  };
  const arc = new Float64Array(STEPS + 1);
  let prev = at(0);
  for (let s = 1; s <= STEPS; s++) {
    const cur = at(s);
    arc[s] = arc[s - 1] + Math.hypot(cur[0] - prev[0], cur[1] - prev[1]);
    prev = cur;
  }
  const total = arc[STEPS];

  const mark = (k, rings) => {
    const want = (total * k) / rings;
    let lo = 0;
    while (lo < STEPS && arc[lo + 1] < want) lo++;
    const d = arc[lo + 1] - arc[lo];
    const f = d > 1e-12 ? (want - arc[lo]) / d : 0;
    const a = at(lo),
      b = at(lo + 1);
    return a[1] + (b[1] - a[1]) * f;
  };

  return { width, mark };
}

/**
 * Ряды сетки оболочки: точки профиля плюс кольца устья.
 *
 * Отметки колец устья снимает `cocoonMouthEdge` — равными долями дуги кромки;
 * там же объяснено, почему именно дуги.
 *
 * Точки профиля не выбрасываются, а подмешиваются: профиль — ломаная, и снятие
 * его формы на чужих отметках срезало бы углы. Совпавшие отметки схлопываются в
 * одну, и побеждает КОЛЬЦО УСТЬЯ: конец овала обязан лежать ровно на ряду, иначе
 * вырез не сойдётся там в ноль и петля кромки не замкнётся.
 */
function cocoonRows(co) {
  const marks = co.profile.map(([, y]) => ({ y, mouth: false }));
  const mid = (co.mouth.from + co.mouth.to) / 2;
  const half = (co.mouth.to - co.mouth.from) / 2;
  const edge = cocoonMouthEdge(co);
  for (let k = 0; k <= co.mouth.rings; k++) {
    marks.push({ y: mid + half * edge.mark(k, co.mouth.rings), mouth: true });
  }
  marks.sort((a, b) => a.y - b.y || (a.mouth ? -1 : 1));

  const out = [];
  for (const mark of marks) {
    const last = out[out.length - 1];
    // Миллиметр — половина уклонения кромки от овала: ближе двух рядов сетке
    // не нужно, а вырожденные пояса она бы дала.
    if (last && mark.y - last.y < 0.001) {
      if (mark.mouth && !last.mouth) out[out.length - 1] = mark;
      continue;
    }
    out.push(mark);
  }
  return out.map((mark) => [S.cocoonRadiusAt(mark.y), mark.y]);
}

/**
 * Обруч по кромке устья — гнутый прут, на который заведены концы плетения.
 *
 * ЗАЧЕМ. Оболочка построена вращением и имеет нулевую толщину: без обруча её
 * край обрывался бы в ничто, и кокон читался бы выкроенным из бумаги. У
 * плетёного предмета край всегда собран — это и есть та деталь, по которой глаз
 * отличает сплетённое от вырезанного.
 *
 * ПУТЬ ТЕПЕРЬ ЗАМКНУТАЯ ПЕТЛЯ, А НЕ ДВЕ КРОМКИ. Свободный край устья — это
 * первый столбец сетки снизу вверх и последний сверху вниз; на концах овала
 * полуугол выреза равен нулю, оба столбца там сходятся в одну точку, и петля
 * замыкается сама. Совпавшие концы выбрасываются: сдвоенная точка дала бы
 * кривой петлю.
 *
 * Контур не задаётся числами, а СНИМАЕТСЯ С САМОЙ ОБОЛОЧКИ. Тогда обруч не может
 * отстать от формы ни при какой правке профиля, габарита или устья.
 *
 * РАЗВЁРТКА ПОСТОЯННАЯ И РАВНА (0, 0). Материал оболочки режется по `alphaMap`, и
 * обручу просветы не нужны — он сплошной. В начале координат плитки лежит
 * середина перекрестья прядей (см. `cocoonWeaveMaps`), то есть там маска заведомо
 * непрозрачна; постоянная развёртка вдобавок обнуляет производные, и выборка идёт
 * с нулевого мипа при любом ракурсе.
 */
function buildCocoonRim(shell, nRows, segments, jFrom, jTo) {
  const rim = S.CHAIR.cocoon.rim;
  const pos = shell.getAttribute("position");
  const at = (i, j) => i * nRows + j;
  const path = [];
  const push = (index) =>
    path.push(
      new THREE.Vector3(pos.getX(index), pos.getY(index), pos.getZ(index)),
    );

  for (let j = jFrom; j <= jTo; j++) push(at(0, j)); // одна кромка, вверх
  for (let j = jTo - 1; j > jFrom; j--) push(at(segments, j)); // вторая, вниз

  /*
   * Кривая замкнута и сглажена: на концах овала кромка круто разворачивается, и
   * ломаная дала бы там залом. `centripetal` выбран из трёх типов Катмулла —
   * `chordal` на неравных отрезках даёт петлю у концов.
   */
  const curve = new THREE.CatmullRomCurve3(path, true, "centripetal");
  /*
   * Шаг по пути равен толщине обруча. Половина шага стоила бы вдвое больше
   * треугольников, а на 4 px ширины ни один излом от этого не пропадает.
   */
  const steps = Math.round(curve.getLength() / rim.thickness);
  const tube = new THREE.TubeGeometry(
    curve,
    steps,
    rim.thickness / 2,
    rim.sides,
    true,
  );

  const uv = tube.getAttribute("uv");
  for (let i = 0; i < uv.count; i++) uv.setXY(i, 0, 0);
  return tube;
}

/**
 * Отметка, на которой обвод чаши впервые доходит до доли `frac`.
 *
 * Обратная к `cocoonRadiusAt` и нужна ровно затем же: кромка подушки задана
 * отступом ОТ СТЕНКИ, значит её высота есть следствие профиля, а не второе
 * число рядом с ним. Ищется снизу вверх, поэтому попадает в чашу, а не в верх
 * капли, где тот же обвод встречается второй раз.
 */
function cocoonLevelAt(profile, frac) {
  for (let i = 1; i < profile.length; i++) {
    if (profile[i][0] >= frac) {
      const t =
        (frac - profile[i - 1][0]) / (profile[i][0] - profile[i - 1][0]);
      return profile[i - 1][1] + (profile[i][1] - profile[i - 1][1]) * t;
    }
  }
  return profile[profile.length - 1][1];
}

/**
 * Куда по глубине встаёт поясничный валик.
 *
 * ПРОСТОГО «ПРИСЛОНИТЬ К СТЕНКЕ» НЕДОСТАТОЧНО, и это показал замер. Валик —
 * эллипсоид 0.56 × 0.36 × 0.22, а чаша — эллипс 0.92 × 0.88: у них разные
 * пропорции в плане, поэтому валик, поставленный задней точкой ровно на стенку,
 * протыкает её ПЛЕЧАМИ. На азимуте 45° замер давал 10 мм наружу.
 *
 * Поэтому глубина не вычисляется формулой, а подбирается по всей поверхности
 * валика: он отодвигается вперёд ровно настолько, чтобы наибольший вылет ушёл в
 * заданный зазор. Три итерации хватает — вылет от сдвига почти линеен.
 */
function fitBackRoll(co) {
  const ax = S.CHAIR.width / 2;
  const az = S.CHAIR.depth / 2;
  const b = co.back;
  const lean = b.lean * DEG;
  let z = -S.cocoonRadiusAt(b.at) * az + b.thickness / 2;
  for (let step = 0; step < 4; step++) {
    let worst = -Infinity;
    for (let i = 0; i <= 12; i++) {
      // Пояс эллипсоида по высоте, полный оборот по азимуту.
      const t = (Math.PI * i) / 12 - Math.PI / 2;
      const ry = (b.height / 2) * Math.sin(t);
      const k = Math.cos(t);
      for (let j = 0; j <= 24; j++) {
        const a = (TAU * j) / 24;
        const lx = (b.width / 2) * k * Math.cos(a);
        const lz = (b.thickness / 2) * k * Math.sin(a);
        // Наклон валика вокруг локальной X: он же наклоняет и его плечи.
        const y = b.at + ry * Math.cos(lean) - lz * Math.sin(lean);
        const zz = z + ry * Math.sin(lean) + lz * Math.cos(lean);
        worst = Math.max(
          worst,
          (Math.hypot(lx / ax, zz / az) - S.cocoonRadiusAt(y)) *
            ((ax + az) / 2),
        );
      }
    }
    if (worst <= -b.clear) break;
    z += worst + b.clear;
  }
  return z;
}

/**
 * ЛОЖЕ — подушка, у которой изнанка есть сама оболочка.
 *
 * ПОЧЕМУ НЕ ПУФ. Жёсткий эллипсоид ложится на дно, только если дно ПЛОЩЕ его
 * изнанки: радиус изнанки равен a²/полутолщина. У прежнего пуфа 0.82 × 0.28 это
 * 1.20 м, а дно чаши имело 0.39 м — втрое круче. Пуф не просто висел в 275 мм над
 * дном: отпущенный, он заклинивал в воронке на 159 мм и лечь не мог ни при какой
 * отметке. Спор про зазор был неразрешим, пока подушка оставалась куполом.
 *
 * ЗДЕСЬ ЗАЗОР РАВЕН НУЛЮ ПО ПОСТРОЕНИЮ. Низ ложа — те же точки профиля капли,
 * отступившие внутрь на половину толщины ротанговой ленты (оболочка в модели есть
 * СРЕДИННАЯ поверхность прутьев). Подобрать тут нечего: чтобы зазор появился,
 * пришлось бы переписать построение.
 *
 * Верх — дуга окружности через кромку ложа и самое низкое место на оси. Радиус
 * получается из хорды и стрелки, а не задаётся: задать его вторым числом значило
 * бы завести источник, который разойдётся с первым.
 *
 * ОБХОД СЕЧЕНИЯ ИДЁТ ОТ КРОМКИ ВНУТРЬ ПО ВЕРХУ И ОТ ОСИ НАРУЖУ ПО НИЗУ. Порядок
 * не безразличен: `LatheGeometry` строит нормаль как (dy, −dx), и обратный обход
 * вывернул бы верх ложа изнанкой наружу.
 */
function buildCocoonCradle() {
  const c = S.CHAIR;
  const co = c.cocoon;
  const cr = co.cradle;
  const ax = c.width / 2;
  const az = c.depth / 2;

  const bottom = co.profile[0][1];
  const rimY = bottom + cr.rim;
  const rRim = S.cocoonRadiusAt(rimY);
  const seatY = rimY - cr.dip;
  const chord = rRim * ax;
  // Радиус дуги по хорде и стрелке. Вторая часть — та же формула, записанная без
  // приближения: R = (a² + s²) / 2s.
  const R = (chord * chord) / (2 * cr.dip) + cr.dip / 2;
  const centre = seatY + R;
  /*
   * Кромка подушки НЕ ДОХОДИТ ДО СТЕНКИ на `edge`, и это правка по кадру.
   * Доведённая до плетения, подушка встречала стенку под 41° и читалась не
   * мягким телом, а тарелкой с ножевой кромкой — видно на `U1-mouth.png`.
   * Отступив, она получает валик по всему обводу (полукруг во всю местную
   * толщину, 63 мм) и оставляет между собой и плетением тёмную щель 40 мм —
   * 3 px, ровно тот зазор, которым в этом проекте отделяют мягкое от жёсткого.
   * Зазор ПОД подушкой при этом остаётся нулевым: изнанка — та же оболочка.
   */
  const xEdge = chord - cr.edge;
  const pts = [];
  for (let k = 0; k <= cr.rings; k++) {
    const x = xEdge * (1 - k / cr.rings);
    pts.push(
      new THREE.Vector2(x / ax, centre - Math.sqrt(Math.max(0, R * R - x * x))),
    );
  }

  /*
   * Изнанка: точки профиля ниже кромки, сдвинутые внутрь по НОРМАЛИ профиля.
   * Сдвиг считается в меридиане X и в долях возвращается тем же делением, поэтому
   * по Z он выходит на 4 % меньше — 0.3 мм, что ниже любого допуска сцены.
   */
  const edgeFrac = xEdge / ax;
  // Отбор идёт по ОТМЕТКЕ, а не по обводу: тот же обвод есть и в верхней части
  // капли, и по обводу в изнанку подушки попала бы вся её макушка.
  const edgeY = cocoonLevelAt(co.profile, edgeFrac);
  const wall = co.profile
    .filter(([, y]) => y < edgeY - 1e-6)
    .concat([[edgeFrac, edgeY]]);
  const inset = [];
  for (let i = 0; i < wall.length; i++) {
    const a = wall[Math.max(0, i - 1)];
    const b = wall[Math.min(wall.length - 1, i + 1)];
    const dx = (b[0] - a[0]) * ax;
    const dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    // Нормаль профиля наружу — (dy, −dx)/len; внутрь идёт со знаком минус.
    inset.push([
      wall[i][0] - (cr.inset * dy) / len / ax,
      wall[i][1] + (cr.inset * dx) / len,
    ]);
  }
  pts.push(new THREE.Vector2(0, inset[0][1]));
  for (const [r, y] of inset) pts.push(new THREE.Vector2(r, y));

  /*
   * Валик кромки — половина ЭЛЛИПСА на отрезке «низ ↔ верх подушки». По высоте
   * он во всю местную толщину, поэтому кромка мягчеет ровно настолько,
   * насколько подушка там толстая.
   *
   * А ВОТ ВЫЛЕТ РЕШАЕТСЯ ИЗ ЗАЗОРА ДО СТЕНКИ, а не равен полутолщине. Полукруг
   * был первой пробой, и подушка вылезала сквозь плетение на 8 мм: чаша над
   * кромкой ложа расширяется медленнее, чем растёт толщина самой подушки.
   * Вылет ищется двоичным поиском по САМОЙ стенке — тогда он не разойдётся с
   * формой ни при какой её правке, а `gap` остаётся тем, чем и был задуман:
   * шириной тёмной щели между мягким и плетёным.
   */
  const lo = pts[pts.length - 1];
  const hi = pts[0];
  const mx = ((lo.x + hi.x) / 2) * ax;
  const my = (lo.y + hi.y) / 2;
  const half = Math.hypot((hi.x - lo.x) * ax, hi.y - lo.y) / 2;
  const a0 = Math.atan2(lo.y - my, lo.x * ax - mx);
  const a1 = Math.atan2(hi.y - my, hi.x * ax - mx);
  const BEAD = 5;
  const fits = (out) => {
    for (let k = 0; k <= BEAD; k++) {
      const a = a0 + (a1 - a0) * (k / BEAD);
      if (
        mx + out * Math.cos(a) >
        S.cocoonRadiusAt(my + half * Math.sin(a)) * ax - cr.gap
      )
        return false;
    }
    return true;
  };
  let bulge = half;
  if (!fits(bulge)) {
    let loB = 0;
    let hiB = half;
    for (let i = 0; i < 24; i++) {
      const midB = (loB + hiB) / 2;
      if (fits(midB)) loB = midB;
      else hiB = midB;
    }
    bulge = loB;
  }
  for (let k = 1; k < BEAD; k++) {
    // Дуга идёт ОТ низа К верху напрямую, то есть через угол 0 — наружу, к
    // стенке. Обход в другую сторону вывернул бы валик внутрь подушки.
    const a = a0 + (a1 - a0) * (k / BEAD);
    pts.push(
      new THREE.Vector2(
        (mx + bulge * Math.cos(a)) / ax,
        my + half * Math.sin(a),
      ),
    );
  }
  pts.push(new THREE.Vector2(hi.x, hi.y));

  const geometry = new THREE.LatheGeometry(pts, S.CHAIR.cushion.sectors);
  geometry.scale(ax, 1, az);
  return geometry;
}

/**
 * Сшивает несколько геометрий одного набора атрибутов в одну.
 *
 * Своя, а не из `BufferGeometryUtils`: аддон в проект не завезён, а нужен ровно
 * один случай — position, normal, uv и индекс. Тащить ради него ещё один файл в
 * вендор значило бы платить загрузкой за тридцать строк.
 */
function mergeGeometries(parts) {
  const keys = ["position", "normal", "uv"];
  const size = { position: 3, normal: 3, uv: 2 };
  const counts = parts.map((g) => g.getAttribute("position").count);
  const total = counts.reduce((a, b) => a + b, 0);
  const merged = new THREE.BufferGeometry();

  for (const key of keys) {
    const data = new Float32Array(total * size[key]);
    let offset = 0;
    for (const part of parts) {
      const attribute = part.getAttribute(key);
      for (let i = 0; i < attribute.count; i++) {
        data[offset + i * size[key]] = attribute.getX(i);
        data[offset + i * size[key] + 1] = attribute.getY(i);
        if (size[key] === 3)
          data[offset + i * size[key] + 2] = attribute.getZ(i);
      }
      offset += attribute.count * size[key];
    }
    merged.setAttribute(key, new THREE.BufferAttribute(data, size[key]));
  }

  const index = [];
  let base = 0;
  parts.forEach((part, k) => {
    const src = part.getIndex();
    for (let i = 0; i < src.count; i++) index.push(src.getX(i) + base);
    base += counts[k];
    part.dispose();
  });
  merged.setIndex(index);
  return merged;
}

/**
 * Одно кресло с подвесом.
 *
 *   anchor  — неподвижная точка в вершине дуги стойки;
 *   pivot   — вращение вокруг локальной оси X: она же ось качания, а сама
 *             плоскость качания совпадает с плоскостью дуги;
 *   seat    — доворот на вертлюге, он же медленный разворот.
 *
 * Кресло вращается вокруг ВЕРХНЕЙ точки, а не вокруг своего центра: подвес и
 * есть маятник, и при вращении вокруг центра кресло уезжало бы от цепи.
 */
function buildSwing(helpers, parent, chair, axis, tipAbove, units, shells) {
  const { solid } = helpers;
  const c = S.CHAIR;

  /*
   * Ось качания — плоскость собственной стойки, а не общая ось Z.
   *
   * У балки эта плоскость была одна на пару и шла поперёк балки; у стойки она
   * своя и идёт вдоль взгляда кресла. Узел разворачивается в неё целиком, а
   * внутри него качание остаётся простым вращением вокруг локальной X. Доворот
   * кресла по-прежнему задан в мировых координатах и компенсирует этот разворот:
   * сейчас разница равна нулю, но обнулять её здесь нельзя — она вернётся, как
   * только стойку понадобится поставить не строго за спинкой.
   */
  const anchor = new THREE.Group();
  anchor.name = "anchor_" + chair.id;
  anchor.position.set(chair.x, S.FLOOR + tipAbove, chair.z);
  anchor.rotation.y = axis;
  parent.add(anchor);

  const pivot = new THREE.Group();
  pivot.name = "swing_" + chair.id;
  anchor.add(pivot);

  const seat = new THREE.Group();
  seat.name = "chair_" + chair.id;
  seat.rotation.y = chair.yaw * DEG - axis;
  pivot.add(seat);

  // Всё, что висит, считается от оси качания: высота над настилом → координата
  // подвеса. Ни одной абсолютной отметки внутри сборки быть не должно, иначе
  // кресло перестанет следовать за стойкой при правке спецификации.
  const at = (height) => S.FLOOR + height - anchor.position.y;

  /*
   * УЗЛА КРЕПЕЖА ЗДЕСЬ БОЛЬШЕ НЕТ.
   *
   * При балке между её низом и осью качания оставалось 115 мм воздуха, и цепь
   * читалась висящей ни к чему; их заполняли седло, рым и вертлюг — три тела на
   * кресло. У стойки этого разрыва нет по построению: ось качания лежит на оси
   * трубы, и цепь выходит прямо из-под неё. Шесть вызовов отрисовки, которые
   * стоил узел, освободились и ушли на сами стойки.
   */

  /*
   * КАПЛЯ ВИСИТ ОТКИНУТОЙ, И НАКЛОН — ОТДЕЛЬНЫЙ УЗЕЛ ВНУТРИ ДОВОРОТА.
   *
   * Порядок узлов важен и разбирается один раз здесь. Качание — поворот вокруг
   * локальной X `pivot`, то есть поперёк балки; доворот на вертлюге задан в
   * мировых координатах и потому сидит на `seat`. Наклон капли — её собственная
   * посадка на цепи, он идёт СЛЕДОМ за доворотом: тогда кресло откинуто «назад»
   * в своей системе, куда бы оно ни было развёрнуто. Поставь наклон выше
   * доворота — и капля кренилась бы вбок на всех азимутах, кроме одного.
   *
   * Сам наклон не назначен, а посчитан из выреза (см. `CHAIR.cocoon.tilt`), и
   * выражен физически: цепь приходит в САМУЮ ВЫСОКУЮ точку наклонённой оболочки,
   * а это передняя кромка верхнего кольца — 35 мм вперёд от макушки. Ни высота
   * узла, ни отвод капли назад числами не задаются: и то, и другое снято с
   * геометрии, поэтому при любой правке профиля, габарита или наклона кресло
   * останется висеть на цепи, а не рядом с ней.
   */
  const lean = new THREE.Group();
  lean.name = "lean_" + chair.id;
  lean.rotation.x = -c.cocoon.tilt * DEG;
  // Просвет над настилом меряется от самой низкой точки НАКЛОНЁННОЙ капли,
  // иначе наклон незаметно съедал бы его.
  lean.position.set(
    0,
    at(c.cocoon.profile[0][1]) - shells.cocoon.lowest,
    -shells.cocoon.knot.z,
  );
  seat.add(lean);
  // Цепь приходит в узел самой оболочки, а не в отметку, записанную числом.
  const chainTo = lean.position.y + shells.cocoon.knot.y;

  // Цепь — гладкий стержень. «Цепность» не передаётся: рисунок звена с шагом
  // 30 мм — это 2.5 px, ровно тот масштаб, который в проекте уже развалился
  // рябью на стропилах.
  // У кокона подвес идёт в ОДНУ точку — прямо в кромку верхнего кольца, как на
  // референсах; ярма и перекладины у него нет вовсе, поэтому и цепь короче.
  solid(
    pivot,
    "box",
    "steel",
    [0, chainTo / 2, 0],
    [c.chain, -chainTo, c.chain],
  ).castShadow = false;

  /*
   * Кокон — ОДНО тело на всё кресло. Ни обода, ни ног, ни перекладины: форму
   * держит сама капля, и в этом вся разница с прежними формами. Геометрия
   * общая для пары кресел, поэтому вторая обходится бесплатно.
   */
  const co = c.cocoon;
  /*
   * Внутри наклонённого узла все отметки идут В СИСТЕМЕ ОБОЛОЧКИ — теми же
   * числами, что в профиле. Пересчёт через `at` здесь был бы вторым наклоном:
   * `at` переводит высоту НАД НАСТИЛОМ, а капля уже повёрнута.
   */
  helpers.part(lean, shells.cocoon.geometry, "weave");

  /*
   * Ложе во всю чашу: его самое низкое место и есть высота посадки. Тени нет —
   * оно целиком внутри оболочки, а свет, дающий креслу контакт с полом, стоит
   * строго над ним, значит подушка не может отбросить ни одного пикселя,
   * которого не отбрасывает сама чаша.
   */
  helpers.part(lean, shells.cradle, "cushion").castShadow = false;

  /*
   * Поясничный валик прислонён к задней стенке чаши. Его место по глубине
   * выводится из САМОГО профиля, а не задаётся числом: иначе при любой правке
   * формы валик отстанет от спинки или влезет в неё.
   */
  solid(
    lean,
    "cushion",
    "cushion",
    [0, co.back.at, fitBackRoll(co)],
    [co.back.width, co.back.height, co.back.thickness],
    [co.back.lean * DEG, 0, 0],
  ).castShadow = false;

  units.push({ pivot, seat, yaw: seat.rotation.y, swing: chair.swing });
}

function buildTable(solid, parent) {
  const t = S.TABLE;
  /*
   * Столик стоит на ковре, а не на настиле.
   *
   * Отметка опоры не задана числом, а спрошена у пола: под столиком лежит ковёр,
   * и подошва садится на него. Если бы она осталась на настиле, ковёр прошёл бы
   * сквозь неё, а верх подошвы и верх ковра совпали бы в одной плоскости — то
   * самое совпадение одноимённых граней, ради ухода от которого ковёр и поднят.
   */
  const foot = S.groundAt(t.x, t.z);
  const top = foot + t.height;
  const stemTop = top - t.thickness;
  const stemBottom = foot + t.baseT;

  solid(
    parent,
    "cyl",
    "tabletop",
    [t.x, top - t.thickness / 2, t.z],
    [t.top, t.thickness, t.top],
  ).name = "table_top";
  solid(
    parent,
    "cyl",
    "steel",
    [t.x, (stemBottom + stemTop) / 2, t.z],
    [t.stem, stemTop - stemBottom, t.stem],
  );
  solid(
    parent,
    "cyl",
    "steel",
    [t.x, foot + t.baseT / 2, t.z],
    [t.base, t.baseT, t.base],
  );

  /*
   * Фонарь смещён по диагонали — к ближнему креслу и к камере. Вечером ближнее
   * кресло на две трети лежит на тёмном настиле и само по себе пропадает;
   * дальнее идёт контражуром по светящейся панораме и в свете не нуждается.
   *
   * В прокси свечение взято у окон как есть. На этапе материалов ему нужен
   * собственный, заметно более слабый источник: выше четвёрки все каналы
   * выбиваются разом и тёплый свет пропадает.
   */
  const l = t.lantern;
  const dx = t.x + l.offset * Math.SQRT1_2;
  const dz = t.z + l.offset * Math.SQRT1_2;
  solid(
    parent,
    "cyl",
    "steel",
    [dx, top + l.base / 2, dz],
    [l.diameter, l.base, l.diameter],
  ).castShadow = false;
  // Рассеиватель назван: в греибоксе он светится наравне с окнами, а отделке
  // нужен собственный, заметно более слабый материал — и найти его она должна
  // по имени, а не по совпадению материала и формы.
  solid(
    parent,
    "cyl",
    "glass",
    [dx, top + l.base + l.glowHeight / 2, dz],
    [l.glow, l.glowHeight, l.glow],
  ).name = "lantern_glow";
}

/* ─────────────────────────  качание  ─────────────────────────
 *
 * Качели, стоящие намертво, отменяют смысл композиции. Но и раскачивать их «на
 * глаз» нельзя: неверный период читается как игрушечность.
 *
 * Угол — чистая функция настенного времени и момента появления группы. Ничего
 * не интегрируется и не накапливается, поэтому обратная прокрутка, рывок
 * ползунком и перепрыгивание по времени ничего не ломают: кресла просто
 * оказываются в той фазе, которая соответствует текущей секунде.
 */

function createSwing(units, period) {
  const reduced =
    typeof matchMedia === "function"
      ? matchMedia("(prefers-reduced-motion: reduce)")
      : null;
  let settleFrom = null;

  /**
   * Возвращает признак «положение изменилось». Сравнение идёт с тем, что уже
   * стоит в объекте, поэтому лишнего состояния заводить не нужно, а покой
   * распознаётся точно: при reduced motion углы приходят к своим значениям один
   * раз и дальше не меняются.
   */
  const put = (unit, x, y) => {
    let moved = false;
    if (unit.pivot.rotation.x !== x) {
      unit.pivot.rotation.x = x;
      moved = true;
    }
    if (unit.seat.rotation.y !== y) {
      unit.seat.rotation.y = y;
      moved = true;
    }
    return moved;
  };

  return function update(now, alive) {
    // Группа не построена — состояние сбрасывается. Иначе кресло, к которому
    // вернулись обратной прокруткой, продолжило бы затухать в невидимости и
    // появилось бы уже успокоенным.
    if (!alive) {
      settleFrom = null;
      return false;
    }

    if (reduced && reduced.matches) {
      let moved = false;
      for (const unit of units) moved = put(unit, 0, unit.yaw) || moved;
      settleFrom = null;
      return moved;
    }

    // Скрытая вкладка кадров не просит, но и считать в ней нечего.
    if (typeof document !== "undefined" && document.hidden) return false;

    if (settleFrom === null) settleFrom = now;
    /*
     * Время отсчитывается от появления группы, а не от абсолютных часов.
     * Иначе фазовый сдвиг между креслами в момент появления оказывается каким
     * угодно — он зависит от того, в какую секунду человек досюда долистал, — и
     * задать его нельзя. Часы при этом остаются настенными: прогресс прокрутки
     * в расчёт не входит вовсе.
     */
    const since = now - settleFrom;
    // Гаснет разгон, а не качание: множитель приходит к единице, а не к нулю.
    const envelope =
      1 + S.SWING.boost * Math.exp((-S.SWING.decay * since) / S.SWING.settle);

    let moved = false;
    for (const unit of units) {
      const s = unit.swing;
      /*
       * Период общий, разводят пару амплитуда и постоянный сдвиг фазы. При
       * разных периодах сдвиг плыл бы, и кресла периодически проходили бы ноль
       * вместе — ровно та механическая картинка, ради ухода от которой сдвиг и
       * задавался.
       *
       * Проверяемый инвариант пары: **оба угла никогда не равны нулю
       * одновременно**. Замер шагом 2 мс на окне 80 с даёт 0 таких моментов.
       * Прежняя формулировка «|угол A| ≠ |угол B| всегда, кроме нулей»
       * невыполнима в принципе: при равных периодах и сдвиге, не равном 0 или
       * половине периода, отношение синусов пробегает всю положительную
       * полуось, поэтому любое отношение амплитуд достигается — замер даёт
       * четыре совпадения по модулю за период.
       */
      const swing =
        s.amplitude *
        DEG *
        envelope *
        Math.sin((TAU * (since + s.phase)) / period);
      // Разворот на вертлюге — не второе качание, а его послезвучие: периоды
      // некратны ни качанию, ни друг другу, поэтому пара никогда не повторяет
      // один и тот же кадр за весь проход.
      const drift =
        unit.yaw +
        S.SWING.driftAngle *
          DEG *
          Math.sin((TAU * (since + s.phase)) / s.driftPeriod);
      moved = put(unit, swing, drift) || moved;
    }
    return moved;
  };
}

/* ─────────────────────────  камера  ───────────────────────── */

/**
 * Положение камеры для состояния маршрута. Сферические координаты вокруг
 * точки интереса — в таком виде ракурс и крупность настраиваются независимо,
 * а интерполяция между состояниями идёт по дуге и не проносит камеру сквозь
 * дом, как это делает линейная интерполяция позиций.
 */
export function placeCamera(camera, state) {
  const az = state.azimuth * DEG;
  const el = state.elevation * DEG;
  const r = state.distance;
  const target = new THREE.Vector3(
    state.target[0],
    state.target[1],
    state.target[2],
  );

  camera.position.set(
    target.x + r * Math.cos(el) * Math.sin(az),
    target.y + r * Math.sin(el),
    target.z + r * Math.cos(el) * Math.cos(az),
  );
  camera.lookAt(target);
  return target;
}

/** Плавная интерполяция между двумя состояниями маршрута. */
export function mixStates(a, b, t) {
  const e = t * t * (3 - 2 * t);
  const mix = (x, y) => x + (y - x) * e;
  return {
    azimuth: mix(a.azimuth, b.azimuth),
    elevation: mix(a.elevation, b.elevation),
    distance: mix(a.distance, b.distance),
    target: [
      mix(a.target[0], b.target[0]),
      mix(a.target[1], b.target[1]),
      mix(a.target[2], b.target[2]),
    ],
  };
}

/* ─────────────────────────  переходник к рабочей сцене  ─────────────────────────
 *
 * Геометрия перенесена из `concepts/greybox.js` БЕЗ ПРАВОК — она утверждена и
 * проверена аудитом совпадающих граней, и переписывать её при переносе значило бы
 * ставить под сомнение всю приёмку этапов A–D. Отличается только адрес обмеров:
 * `./houseSpec.js` вместо `./house-spec-v2.js`.
 *
 * Рабочая сцена ждёт другой интерфейс, чем страницы концепта, и он маленький:
 * `setGroupProgress`, `setAllProgress`, `applyProfile`, `dispose`. Поэтому здесь
 * не новый дом, а переходник поверх `createGreybox`.
 *
 * ЧТО ПЕРЕХОДНИК ДЕЛАЕТ СВЕРХ ПРОСТОЙ ПЕРЕАДРЕСАЦИИ:
 *
 * - `applyProfile` снимает и возвращает отбрасывание тени по уровню качества.
 *   На LOW тени выключены целиком, и держать `castShadow` там незачем: это 58 %
 *   вызовов отрисовки (замер 2026-08-04, 855 против 358);
 * - качание кресел ведёт сама сцена через `updateSwing`, и наружу оно отдаётся
 *   как есть: состояние блока выводится из прокрутки, а качание живёт по
 *   настенным часам — так же, как в превью концепта.
 */

/**
 * @param {object} context `{ THREE, scene, profile }` — как у прежнего дома.
 */
export function createHouse({ scene, profile }) {
  const house = createGreybox(scene);

  /*
   * Решение о тени принимает ГЕОМЕТРИЯ, а уровень качества только гасит его.
   *
   * Запоминается оно один раз, при сборке, и дальше уровень качества умножается
   * на запомненное. Обход, который просто ставил `castShadow = on`, возвращал бы
   * тень ровно тем восьми местам, где сборка сняла её намеренно: лентам фасада
   * (муар на 40 мм выноса), стеклу (зачернённые откосы), стеблям злаков, цепи
   * подвеса, ложу кокона, рассеивателям фонаря и бра. Замер этого стоил 1944
   * различающихся пикселя против кадра концепта.
   */
  house.root.traverse((object) => {
    if (object.isMesh) object.userData.castsShadow = object.castShadow;
  });

  const setShadows = (on) => {
    house.root.traverse((object) => {
      if (object.isMesh) object.castShadow = on && object.userData.castsShadow;
    });
  };
  if (profile) setShadows(profile.shadows !== false);

  return {
    root: house.root,
    materials: house.materials,
    updateSwing: house.updateSwing,

    /**
     * Отметка вершины дуги стойки над настилом. Наружу отдаётся потому, что в
     * ней стоит светильник скрытой подсветки (`COVE` в `lighting.js`), а сама
     * отметка нигде не записана числом: она складывается из высоты узла подвеса,
     * снятой с оболочки кокона, и длины цепи. Второй источник этой отметки
     * разошёлся бы с первой же правкой формы капли, и лента уехала бы от стойки.
     */
    standTip: house.standTip,

    setGroupProgress(name, progress) {
      house.setGroupProgress(name, progress);
    },

    setAllProgress(progress) {
      for (const name of GROUP_ORDER) house.setGroupProgress(name, progress);
    },

    applyProfile(next) {
      setShadows(next.shadows !== false);
    },

    dispose() {
      house.dispose();
      scene.remove(house.root);
    },
  };
}
