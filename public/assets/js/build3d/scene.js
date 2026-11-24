/**
 * Рендерер, сцена и окружение.
 *
 * Фон намеренно прозрачный: подложку рисует CSS секции `.build-section`.
 * Так канвас не тратит кадр на заливку, а тёмный фон блока остаётся ровно
 * таким же, каким он был у SVG-версии.
 */

import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { resolvePixelRatio } from "./quality.js";

export function createSceneContext(canvas, profile) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: profile.antialias,
    powerPreference: "high-performance",
    stencil: false,
  });

  // Экспозиция и яркость окружения здесь НЕ задаются: обе входят в пресеты дня
  // и вечера и ведутся `lighting.js` по доле вечера. Второе значение рядом
  // читалось бы как настройка, хотя его перезаписывает первый же кадр.
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  applyShadowSettings(renderer, profile);

  // Ни фона, ни тумана: канвас прозрачен, подложку рисует CSS секции, а земля
  // растворяется собственной картой прозрачности. Туман залил бы дальний план
  // сплошным цветом и обозначил бы границу канваса прямоугольником.
  const scene = new THREE.Scene();

  const environment = createEnvironment(renderer, scene);

  return {
    THREE,
    renderer,
    scene,
    profile,

    setSize(width, height) {
      // Плотность пикселей пересчитывается здесь же, а не один раз при
      // создании: она зависит и от размера канваса (потолок по числу
      // пикселей), и от монитора — при переносе окна на экран с другим
      // масштабом события resize не будет вовсе.
      renderer.setPixelRatio(resolvePixelRatio(this.profile, width, height));
      renderer.setSize(width, height, false);
    },

    /** Понижение качества на лету: меняются только рендерер-зависимые параметры. */
    applyProfile(nextProfile) {
      this.profile = nextProfile;
      applyShadowSettings(renderer, nextProfile);
      scene.traverse((object) => {
        if (object.isMesh) {
          object.castShadow = object.castShadow && nextProfile.shadows;
          object.receiveShadow = object.receiveShadow && nextProfile.shadows;
        }
      });
    },

    dispose() {
      environment.dispose();
      renderer.dispose();
      const context = renderer.getContext();
      const loseContext = context && context.getExtension("WEBGL_lose_context");
      if (loseContext) loseContext.loseContext();
    },
  };
}

function applyShadowSettings(renderer, profile) {
  renderer.shadowMap.enabled = profile.shadows;
  // Солнце неподвижно, и половину длины блока дом стоит собранным. Карта теней
  // перерисовывается по запросу из цикла отрисовки, когда геометрия реально
  // изменилась, а не каждый кадр.
  renderer.shadowMap.autoUpdate = false;
  // PCFSoftShadowMap объявлен устаревшим в r185; мягкость набирается размером
  // карты и normalBias источника света, а не типом фильтра.
  if (profile.shadows) renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.shadowMap.needsUpdate = true;
}

/**
 * Освещение от окружения строится процедурно из RoomEnvironment — это избавляет
 * от загрузки HDRI-файла на несколько мегабайт и даёт мягкие студийные
 * отражения, ради которых HDRI обычно и подключают.
 */
function createEnvironment(renderer, scene) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  // 0.04 — потолок, который PMREM отрабатывает без обрезки; выше он ругается
  // в консоль и всё равно ограничивает размытие. Узнаваемость служебной
  // «комнаты» в отражениях снята не размытием, а низкой яркостью окружения —
  // и яркость эта приходит из пресета (`DAY.env` 0.40, `EVENING.env` 0.07).
  const target = pmrem.fromScene(room, 0.04);

  scene.environment = target.texture;

  room.dispose();
  pmrem.dispose();

  return {
    dispose() {
      scene.environment = null;
      target.dispose();
    },
  };
}
