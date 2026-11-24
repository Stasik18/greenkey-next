/**
 * Синхронизация текста этапа с моделью.
 *
 * Текст берётся из stages.js — того же конфига, по которому собирается дом,
 * поэтому подпись и конструкция на экране не могут разойтись. Разметку блока
 * 3D не создаёт: он пишет в те же элементы, что и исходная SVG-версия.
 */

import { STAGES } from "./stages.js";

const SWAP_CLASS = "is-swapping";
/** Пауза на подмену текста; совпадает с длительностью перехода в CSS. */
const SWAP_MS = 180;

/**
 * @param {object} [опции]
 * @param {(index:number)=>void} [опции.onPick] переход на этап по клику в точку
 */
export function createTextSync({ onPick } = {}) {
  const num = document.getElementById("b-num");
  const title = document.getElementById("b-title");
  const desc = document.getElementById("b-desc");
  const dotsHost = document.getElementById("b-dots");
  const hint = document.querySelector(".build-hint");

  if (!num || !title || !desc) return createNullSync();

  /*
   * Точек столько, сколько этапов, и расставляет их 3D-версия, а не разметка.
   *
   * В разметке их шесть — по числу слоёв SVG-версии, которая работает, пока 3D
   * не отдало первый кадр. Числа этапов у двух версий разные и совпадать не
   * обязаны: SVG-версия показывает шесть слоёв и останется такой, а 3D — десять
   * тактов сценария. Переписывать разметку заранее нельзя ровно поэтому: до
   * передачи владения по тем же точкам идёт SVG-версия, и десять точек на шесть
   * её слоёв читались бы застрявшей полосой.
   */
  const dotsInMarkup = dotsHost ? dotsHost.childElementCount : 0;
  let dots = [];

  /*
   * ПОД 3D ТОЧКА — КНОПКА, А НЕ ИНДИКАТОР.
   *
   * Пока блок шёл сплошной прокруткой, точки только показывали, где читатель.
   * С пошаговым ходом появился вопрос владельца: как пропустить монтаж, если
   * смотреть его не хочется. Точки уже стоят в кадре и уже перечисляют этапы —
   * значит и переход должен жить в них, а не в новом элементе: клик по любой
   * ведёт на её этап, клик по последней показывает готовый дом сразу.
   *
   * Переход МГНОВЕННЫЙ. Человек уже сказал, что смотреть не хочет; показывать
   * ему после этого полуторасекундный пролёт через весь монтаж значило бы
   * отнять ровно то время, которое он попросил не тратить.
   *
   * Заодно у блока впервые появляется клавиатурная навигация — до этого
   * фокусируемых элементов внутри секции было ноль (находка A-3 аудита).
   */
  function adoptDots() {
    if (!dotsHost || dots.length) return;
    dotsHost.textContent = "";
    for (let i = 0; i < STAGES.length; i++) {
      const stage = STAGES[i];
      const dot = document.createElement("button");
      dot.type = "button";
      // Имя кнопки — номер и название этапа: «Этап 03: Обвязка и платформа».
      // Без него скринридер объявил бы десять безымянных кнопок подряд.
      dot.setAttribute(
        "aria-label",
        `Этап ${stage.text.num}: ${stage.text.title}`,
      );
      dot.addEventListener("click", () => onPick && onPick(i));
      dotsHost.appendChild(dot);
    }
    dotsHost.removeAttribute("aria-hidden");
    dotsHost.setAttribute("role", "group");
    dotsHost.setAttribute("aria-label", "Этапы строительства");
    dots = [...dotsHost.children];
  }

  function releaseDots() {
    if (!dotsHost || !dots.length) return;
    dotsHost.textContent = "";
    // Разметка возвращается ровно в то состояние, в каком её оставила
    // SVG-версия: неинтерактивные полоски, скрытые от скринридера.
    dotsHost.setAttribute("aria-hidden", "true");
    dotsHost.removeAttribute("role");
    dotsHost.removeAttribute("aria-label");
    for (let i = 0; i < dotsInMarkup; i++)
      dotsHost.appendChild(document.createElement("i"));
    dots = [];
  }

  /*
   * РЕЗЕРВ ПОД ОПИСАНИЕ СЧИТАЕТСЯ ПО ФАКТИЧЕСКИМ ТЕКСТАМ, А НЕ ЗАДАЁТСЯ В CSS.
   *
   * Резерв нужен затем, чтобы блок не подрастал на длинном этапе и не толкал
   * точки. Пока он стоял медиазапросами, его приходилось пересчитывать при любой
   * правке текста: границы переноса — это свойство самих слов. Замер после
   * последней правки нашёл их на 807, 547, 430, 367 и 306 пикселях ширины
   * экрана; до правки они лежали совсем в других местах. Шесть правил, которые
   * молча устаревают от одной запятой, — ловушка, а не решение.
   *
   * Поэтому высота меряется прямо: самый длинный из десяти текстов при текущей
   * ширине колонки. Считается один раз при появлении блока и на изменении
   * размера, а не на кадре прокрутки.
   */
  let reserveWidth = 0;

  function measureReserve() {
    const width = desc.clientWidth;
    if (!width || width === reserveWidth) return;
    reserveWidth = width;

    const было = desc.textContent;
    desc.style.minHeight = "0";
    let высшее = 0;
    for (const stage of STAGES) {
      desc.textContent = stage.text.desc;
      const h = desc.getBoundingClientRect().height;
      if (h > высшее) высшее = h;
    }
    desc.textContent = было;
    desc.style.minHeight = высшее + "px";
  }

  let resizeTimer = 0;
  const onResize = () => {
    clearTimeout(resizeTimer);
    // Ширина меняется сериями — при повороте экрана и при появлении адресной
    // строки. Мерить на каждом событии значило бы десять перекомпоновок подряд.
    resizeTimer = setTimeout(measureReserve, 160);
  };

  let current = -1;
  let timer = 0;
  let pending = null;

  return {
    setStage(index) {
      if (index === current) return;
      const first = current === -1;
      current = index;

      const stage = STAGES[index];
      if (!stage) return;

      // Точки перенимаются в тот же момент, когда 3D впервые пишет текст: до
      // этого блоком владеет SVG-версия и ведёт их по своим шести слоям.
      if (first) {
        adoptDots();
        measureReserve();
        window.addEventListener("resize", onResize);
      }

      // Подсказка «прокручивайте» своё дело сделала, как только читатель ушёл
      // с первого этапа: дальше она только закрывает собой дом.
      if (hint) hint.classList.toggle("is-done", index > 0);
      /*
       * Зажигаются все пройденные точки — это полоса прогресса, а не выбор.
       * А `aria-current` стоит РОВНО НА ОДНОЙ: скринридеру нужен ответ на
       * вопрос «где я сейчас», и девять «текущих» на него не отвечают.
       */
      dots.forEach((dot, i) => {
        dot.classList.toggle("act", i <= index);
        if (i === index) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });

      if (first) {
        write(stage);
        return;
      }

      // Если подмена уже идёт, текст пишется сразу и таймер не перезапускается:
      // иначе при быстрой протяжке через весь блок подпись держала бы нулевую
      // прозрачность всё время движения и читатель видел бы только точки.
      pending = stage;
      if (timer) {
        write(stage);
        return;
      }

      num.classList.add(SWAP_CLASS);
      title.classList.add(SWAP_CLASS);
      desc.classList.add(SWAP_CLASS);

      timer = setTimeout(() => {
        timer = 0;
        write(pending);
        num.classList.remove(SWAP_CLASS);
        title.classList.remove(SWAP_CLASS);
        desc.classList.remove(SWAP_CLASS);
      }, SWAP_MS);
    },

    dispose() {
      clearTimeout(timer);
      num.classList.remove(SWAP_CLASS);
      title.classList.remove(SWAP_CLASS);
      desc.classList.remove(SWAP_CLASS);
      // Разметка возвращается в исходное состояние: разбор сцены обязан быть
      // обратим целиком, иначе на странице остаются десять точек под версией,
      // у которой шесть слоёв.
      releaseDots();
      if (hint) hint.classList.remove("is-done");
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      // Резерв ставила эта версия — она же его и снимает: у SVG-версии свой,
      // заданный в CSS, и чужое значение поверх него было бы враньём.
      desc.style.minHeight = "";
    },
  };

  function write(stage) {
    num.textContent = stage.text.num;
    title.textContent = stage.text.title;
    desc.textContent = stage.text.desc;
  }
}

function createNullSync() {
  return { setStage() {}, dispose() {} };
}
