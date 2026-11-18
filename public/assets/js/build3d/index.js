/**
 * Точка входа блока «Как рождается ваш дом».
 *
 * Модуль ничего не ломает по умолчанию: если WebGL недоступен, устройство
 * слишком слабое или включён режим уменьшенной анимации, он просто ничего не
 * делает и на странице остаётся исходная SVG-версия блока. Владение блоком
 * передаётся 3D только после первого успешного кадра.
 *
 * Тяжёлые библиотеки подтягиваются лениво — за один экран до блока, чтобы
 * не участвовать в первой отрисовке страницы.
 */

import {
  detectQuality,
  createPerformanceWatchdog,
  nextTierDown,
} from "./quality.js";

const SECTION_ID = "build";
const READY_EVENT = "build:3d-ready";
const VENDOR = "assets/vendor/gsap/";
/** За сколько экранов до блока начинается загрузка. */
const PRELOAD_MARGIN = "100% 0px";

bootstrap();

function bootstrap() {
  const section = document.getElementById(SECTION_ID);
  const host = section && section.querySelector(".build-scene");
  if (!host) return;

  const profile = detectQuality();
  if (!profile.enabled) return;

  let started = false;
  const observer = new IntersectionObserver(
    (entries) => {
      if (started || !entries.some((entry) => entry.isIntersecting)) return;
      started = true;
      observer.disconnect();
      // Раскладку блока сбой не затрагивает: она переключается только после
      // готовности сцены, поэтому здесь достаточно сообщить о причине.
      start(section, host, profile).catch(reportFailure);
    },
    { rootMargin: PRELOAD_MARGIN },
  );

  observer.observe(section);
}

async function start(section, host, profile) {
  preloadModules();
  const [gsapLibs, modules] = await Promise.all([loadGsap(), loadModules()]);

  const canvas = document.createElement("canvas");
  canvas.className = "build-canvas";
  canvas.setAttribute("aria-hidden", "true");
  host.appendChild(canvas);

  try {
    await mount({ section, host, canvas, profile, gsapLibs, modules });
  } catch (error) {
    // Сорвавшаяся инициализация не должна оставить на странице мёртвый канвас
    // поверх работающей SVG-версии.
    host.classList.remove("is-3d");
    section.classList.remove("has-3d");
    canvas.remove();
    throw error;
  }
}

async function mount({ section, host, canvas, profile, gsapLibs, modules }) {
  const {
    scene: sceneModule,
    lighting,
    house: houseModule,
    materials,
    stages,
    camera,
    timeline,
    text,
  } = modules;

  const context = sceneModule.createSceneContext(canvas, profile);
  /*
   * Порядок обязателен: дом → отделка → свет.
   *
   * Отделка правит материалы уже построенного дома и заводит клоны стекла под
   * светящиеся вставки фонаря и бра, а свет эти клоны каждый кадр разжигает.
   * Собственные источники террасы, в свою очередь, живут в корне дома и берут
   * отметку у вершины стойки. Свет, созданный раньше дома, не нашёл бы ни того,
   * ни другого.
   */
  const house = houseModule.createHouse(context);
  materials.applyFinish(house.materials, { house, THREE: context.THREE });
  const lights = lighting.createLighting(context, house);
  const rig = camera.createCameraRig(context.THREE);

  /*
   * Точки этапов ведут в таймлайн, а таймлайн создаётся ПОСЛЕ них — он берёт
   * `textSync` в зависимости. Связь замыкается через переменную: клик приходит
   * много позже монтажа, когда `track` заведомо есть.
   */
  let track = null;
  const textSync = text.createTextSync({
    onPick: (index) => track && track.goTo(index),
  });

  track = timeline.createTimeline({
    gsap: gsapLibs.gsap,
    ScrollTrigger: gsapLibs.ScrollTrigger,
    section,
    house,
    cameraRig: rig,
    textSync,
  });

  const timer = new context.THREE.Timer();
  const watchdog = createPerformanceWatchdog(() => downgrade());

  function resize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    context.setSize(width, height);
    rig.resize(width, height);
  }

  function downgrade() {
    const next = nextTierDown(context.profile.tier);
    if (!next) {
      watchdog.stop();
      return;
    }
    context.applyProfile(next);
    lights.applyProfile(next);
    house.applyProfile(next);
    resize();
    // Текущий уровень видно в разметке: без этого понять, почему на конкретном
    // устройстве пропали тени, можно только отладчиком.
    section.dataset.quality = next.tier;
  }

  function frame() {
    timer.update();
    const delta = timer.getDelta();
    watchdog.sample(delta * 1000);

    const houseChanged = track.apply();
    const mix = stages.lightMix(track.getProgress());
    // Оба вызова обязаны состояться: свет ведёт не только тени, но и свечение
    // окон, а короткое замыкание `||` пропустило бы его на любом кадре, где
    // сдвинулся дом.
    const lightChanged = lights.apply(mix.evening, mix.terrace);
    // Качание кресел живёт по настенным часам, а не по прокрутке: иначе быстрая
    // прокрутка превращает качели в пропеллер, а обратная гонит их назад.
    const swinging = house.updateSwing(performance.now() / 1000);

    // Карта теней перерисовывается только когда изменилось то, от чего она
    // зависит. Солнце неподвижно, а выдержки между этапами занимают 36 % длины
    // блока — без этого полный теневой проход шёл бы каждый кадр впустую.
    if (lights.shadowDue(houseChanged || lightChanged, swinging)) {
      context.renderer.shadowMap.needsUpdate = true;
    }
    context.renderer.render(context.scene, rig.camera);
  }

  // Шейдеры компилируются до того, как блок сменил раскладку: пока это идёт,
  // на странице работает исходная SVG-версия в своём обычном виде.
  await precompile(context, house, rig.camera);

  // Раскладка меняется здесь, разом и только когда сцена заведомо готова.
  // Ставить эти классы заранее нельзя: если бы 3D потом не запустилось, блок
  // схлопнулся бы под читателем — на мобильных это выброс почти на три экрана.
  applyLayout(section, host);

  resize();
  rig.snap(track.getProgress());
  context.renderer.shadowMap.needsUpdate = true;
  frame();

  section.dataset.quality = profile.tier;
  document.dispatchEvent(new CustomEvent(READY_EVENT));
  track.refresh();

  const runtime = attachRuntime({
    section,
    canvas,
    context,
    timer,
    frame,
    resize,
    track,
    rig,
  });

  function releaseAll() {
    runtime.teardown();
    watchdog.stop();
    track.destroy();
    textSync.dispose();
    // Свет разбирается ДО дома: собственные источники террасы живут в его корне,
    // и после `house.dispose()` их не из чего было бы вынимать.
    lights.dispose();
    house.dispose();
    context.dispose();
    canvas.remove();
  }

  window.addEventListener("pagehide", (event) => {
    // Уход страницы в кэш «назад/вперёд» — не закрытие. Разобрав сцену здесь,
    // мы бы вернули читателя по кнопке «назад» к пустому тёмному блоку:
    // канваса уже нет, а SVG-версия давно скрыта.
    if (event.persisted) {
      runtime.pause();
      return;
    }
    releaseAll();
  });

  window.addEventListener("pageshow", (event) => {
    if (event.persisted) runtime.resume();
  });
}

/**
 * Переключение блока на 3D-раскладку с сохранением точки чтения.
 *
 * Секция вырастает разом: на мобильных с высоты по содержимому, на десктопе с
 * 480vh до 730vh. Если читатель в этот момент уже прошёл начало блока, весь
 * контент под ним уедет вниз, поэтому прокрутку надо подвинуть следом.
 *
 * КОМПЕНСИРУЕТСЯ ОСТАТОК, А НЕ ВЕСЬ ПРИРОСТ, И ЭТО НЕ ПРИДИРКА.
 *
 * У браузера есть собственная якорная фиксация (`overflow-anchor`): когда
 * содержимое НАД линией взгляда становится выше, он сам поднимает прокрутку,
 * чтобы читатель остался на том же месте. Прибавляя к этому свою полную дельту,
 * мы платим дважды. Замер на боевой странице, читатель целиком ниже блока:
 * секция выросла на 2250 px, прокрутка сдвинулась на 4501, и контент под
 * читателем прыгнул на 2251 px. Воспроизводится 5 прогонов из 5.
 *
 * Поэтому опорная точка мерится ДО и ПОСЛЕ смены классов, и двигаем ровно на
 * то, на сколько она уехала. Там, где браузер уже всё сделал, остаток равен
 * нулю и мы не делаем ничего; там, где он не вмешался (читатель внутри липкой
 * секции — она сама и служит якорем), остаток равен полной дельте, и поведение
 * остаётся прежним.
 *
 * Опорная точка — НИЗ секции: всё, что читатель видит ниже блока, движется
 * вместе с ним. Читая её после смены классов, мы получаем уже устоявшуюся
 * раскладку вместе с поправкой браузера.
 */
function applyLayout(section, host) {
  const top = section.getBoundingClientRect().top + window.scrollY;
  // Выше начала блока компенсировать нечего: под читателем ничего не уезжает,
  // а блок просто становится длиннее там, куда он ещё не дошёл.
  const passed = window.scrollY > top;
  const before = section.getBoundingClientRect().bottom;

  host.classList.add("is-3d");
  section.classList.add("has-3d");
  // На узком экране SVG-версия успевает объявить блок статическим и показать
  // этапы списком. Забирая блок, 3D возвращает список в скрытое положение —
  // содержание оттуда никуда не девается, оно остаётся для скринридера.
  section.classList.remove("is-static");

  if (!passed) return;
  const drift = section.getBoundingClientRect().bottom - before;
  if (drift !== 0) window.scrollBy(0, drift);
}

/** Сторона кадра прогрева. Заливка при таком размере не стоит ничего. */
const WARM_SIZE = 64;

/**
 * Прогрев ПЕРВОЙ отрисовки.
 *
 * Компиляция программ прогревается отдельно и раньше, но первый настоящий вызов
 * отрисовки всё равно дорог: драйвер доводит состояние конвейера, а буферы
 * геометрии и карты уезжают в видеопамять. Тела появляются по ходу блока, группа
 * за группой, и каждая первая отрисовка — заминка посреди прокрутки.
 *
 * Замер на живой странице, десктоп 1436 × 900, первый проход через выход
 * девятого этапа (доли 0.74…0.83), где разом встают настил, реечная панель,
 * вазон, стойки и кресла: медиана 12.2 мс, а худшие кадры **60.7 / 42.5 /
 * 30.2 мс**. На втором и третьем проходе по тому же месту — 24…30 мс, то есть
 * заминка РАЗОВАЯ и приходится ровно на тот кадр, ради которого блок и собран.
 *
 * ПРОГРЕВАТЬ НАДО В САМ КАНВАС, И ЭТО ГЛАВНОЕ. Замер на стенде
 * `stage-e-hitch.html`, три способа:
 *
 *   ничего не прогрето            худший кадр прохода  41.7 мс
 *   прогрев в буфер 4 × 4         худший кадр прохода  30.6 мс  ← не помогает
 *   прогрев в канвас на 64 × 64   худший кадр прохода  19.0 мс  ← помогает
 *
 * Отрисовка в свой буфер стоила те же 68 мс и всплески не убрала: состояние
 * конвейера привязано к ЦЕЛЕВОМУ буферу кадра, и прогретое на чужом буфере
 * доводится заново на первом кадре в канвас. Поэтому кадр прогрева идёт туда же,
 * куда пойдут все остальные, только на маленьком размере.
 *
 * Вспышки не будет: между этим кадром и настоящим первым кадром браузер не
 * рисует — всё, что идёт после `precompile`, выполняется без единого await.
 */
function warmBuffers(context, house, camera) {
  const { THREE, renderer, scene } = context;
  const size = renderer.getSize(new THREE.Vector2());

  context.setSize(WARM_SIZE, WARM_SIZE);
  house.setAllProgress(1);
  // Теневой проход прогревается вместе с кадром: он рисует те же тела, и его
  // первый проход стоил бы столько же.
  renderer.shadowMap.needsUpdate = true;
  renderer.render(scene, camera);
  house.setAllProgress(0);

  // Размер возвращается на место: `resize` после смены раскладки поставит
  // настоящий, но он отступает, если канвас ещё не получил размера.
  if (size.x > 0 && size.y > 0) context.setSize(size.x, size.y);
}

/**
 * Предварительная компиляция шейдеров.
 *
 * Самая дорогая операция во всей сцене — не геометрия (вся процедурная сборка
 * дома занимает около пяти миллисекунд), а линковка программ: главный поток
 * синхронно ждёт драйвер, и это давало замирание страницы на полторы-две
 * секунды ровно в тот момент, когда читатель дошёл до блока. Остальные
 * программы линковались потом, по одной на каждой границе этапа, то есть
 * прямо во время прокрутки.
 *
 * compileAsync ждёт линковку, не блокируя поток. Пока он идёт, на странице
 * работает SVG-версия блока, поэтому отсрочка готовности читателю не видна.
 *
 * Прогоняются два состояния: собранное и промежуточное. Во время сборки
 * материалы полупрозрачны, а это отдельный вариант программы.
 */
async function precompile(context, house, camera) {
  const { renderer, scene } = context;

  if (typeof renderer.compileAsync === "function") {
    for (const progress of [1, 0.5]) {
      house.setAllProgress(progress);
      await renderer.compileAsync(scene, camera);
    }
    house.setAllProgress(0);
  }

  // Программы готовы, но первая настоящая отрисовка всё равно дорога.
  warmBuffers(context, house, camera);
}

/**
 * Рендер идёт только пока блок на экране. Это главный выигрыш по батарее и по
 * мобильному Safari: в остальное время GPU-цикл не запускается вовсе.
 */
function attachRuntime({
  section,
  canvas,
  context,
  timer,
  frame,
  resize,
  track,
  rig,
}) {
  let running = false;
  // Считаем блок видимым сразу: сцена монтируется, только когда он уже подошёл
  // к экрану. Ждать первого ответа наблюдателя нельзя — до него канвас стоял бы
  // пустым поверх уже скрытой SVG-версии. Наблюдатель поправит значение сам.
  let onScreen = true;
  let suspended = false;

  const setRunning = (next) => {
    if (next === running) return;
    running = next;
    if (next) {
      timer.reset(); // иначе первый кадр после паузы получил бы дельту в секунды
      // Пока блок был вне экрана, прокрутка продолжала двигать прогресс, а
      // сглаженная камера осталась там, где её застали. Без этого при
      // возвращении она полсекунды догоняет кадр на глазах у читателя.
      rig.snap(track.getProgress());
      context.renderer.shadowMap.needsUpdate = true;
      context.renderer.setAnimationLoop(frame);
    } else {
      context.renderer.setAnimationLoop(null);
    }
  };

  const sync = () => setRunning(!suspended && onScreen && !document.hidden);

  const visibility = new IntersectionObserver(
    (entries) => {
      onScreen = entries.some((entry) => entry.isIntersecting);
      sync();
    },
    { rootMargin: "10% 0px" },
  );
  visibility.observe(section);
  sync();

  document.addEventListener("visibilitychange", sync);

  // Размер канваса меняется не только при повороте экрана, но и на каждом
  // появлении адресной строки в мобильном браузере. Пересчёт границ секции
  // стоит дорого, поэтому он откладывается до конца серии изменений.
  let refreshTimer = 0;
  const resizeObserver = new ResizeObserver(() => {
    resize();
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => track.refresh(), 160);
  });
  resizeObserver.observe(canvas);

  const onContextLost = (event) => {
    event.preventDefault();
    setRunning(false);
  };
  canvas.addEventListener("webglcontextlost", onContextLost);

  return {
    pause() {
      suspended = true;
      sync();
    },
    resume() {
      suspended = false;
      resize();
      track.refresh();
      sync();
    },
    teardown() {
      suspended = true;
      setRunning(false);
      clearTimeout(refreshTimer);
      visibility.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", sync);
      canvas.removeEventListener("webglcontextlost", onContextLost);
    },
  };
}

/**
 * Файлы, которые браузер сам обнаруживает слишком поздно.
 *
 * Ядро three объявлено импортом внутри three.module.min.js, а второй ярус
 * собственных модулей — внутри первого. Без подсказки браузер узнаёт о них,
 * только разобрав предыдущий файл, и на мобильной сети это давало около трёх
 * секунд последовательного ожидания на пустом месте.
 */
const PRELOAD = [
  "assets/vendor/three/three.core.min.js",
  "assets/js/build3d/houseSpec.js",
  "assets/js/build3d/lighting.js",
  "assets/js/build3d/materials.js",
  "assets/js/build3d/stages.js",
];

function preloadModules() {
  for (const href of PRELOAD) {
    const link = document.createElement("link");
    link.rel = "modulepreload";
    link.href = href;
    document.head.appendChild(link);
  }
}

function loadModules() {
  return Promise.all([
    import("./scene.js"),
    import("./lighting.js"),
    import("./house.js"),
    import("./materials.js"),
    import("./stages.js"),
    import("./camera.js"),
    import("./timeline.js"),
    import("./textSync.js"),
  ]).then(
    ([scene, lighting, house, materials, stages, camera, timeline, text]) => ({
      scene,
      lighting,
      house,
      materials,
      stages,
      camera,
      timeline,
      text,
    }),
  );
}

/**
 * GSAP поставляется в UMD-сборке: она вдвое легче ESM-исходников в gzip,
 * но подключается тегом и регистрируется в глобальной области.
 */
async function loadGsap() {
  // Оба файла запрашиваются разом: порядок исполнения гарантирован флагом
  // async=false, а последовательное ожидание стоило лишнего круга по сети.
  await Promise.all([
    window.gsap ? null : loadScript(`${VENDOR}gsap.min.js`),
    window.ScrollTrigger ? null : loadScript(`${VENDOR}ScrollTrigger.min.js`),
  ]);
  if (!window.gsap || !window.ScrollTrigger)
    throw new Error("GSAP не загрузился");
  return { gsap: window.gsap, ScrollTrigger: window.ScrollTrigger };
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Не удалось загрузить ${src}`));
    document.head.appendChild(script);
  });
}

/**
 * Отказ не должен ломать страницу: блок остаётся в том виде, в каком работал
 * до появления 3D.
 */
function reportFailure(error) {
  if (window.console) console.warn("[build3d] сцена не запущена:", error);
}
