/**
 * Общий слой интерфейса публичных страниц.
 *
 * Здесь живёт то, что раньше было переписано на каждой странице заново и
 * поэтому вело себя по-разному: мобильное меню, блокировка прокрутки под
 * открытым слоем, ловушка фокуса и закрытие по Escape.
 *
 * ОДИН СТЕК НА ВСЕ СЛОИ. Галерея умеет открыть три слоя один поверх
 * другого — карточка объекта, окно заявки, лайтбокс, — и каждая страница
 * решала это по-своему: где-то закрытие верхнего слоя возвращало прокрутку
 * фону, под которым ещё открыт другой слой. Стек снимает вопрос: прокрутка
 * возвращается, когда закрыт последний слой, Escape закрывает верхний, а
 * фон под верхним слоем выключается через `inert`.
 *
 * Подключается обычным тегом с `defer`, глобальных имён заводит ровно два:
 * `SiteUI` и совместимые `toggleMenu` / `closeMenu` — их вызывают
 * инлайновые обработчики в разметке страниц.
 */
(function () {
  "use strict";

  var doc = document;
  var stack = [];
  var inerted = [];
  var lockCount = 0;
  var padCompensated = false;

  var FOCUSABLE =
    "a[href],area[href],button:not([disabled])," +
    'input:not([disabled]):not([type="hidden"]),select:not([disabled]),' +
    'textarea:not([disabled]),iframe,[tabindex]:not([tabindex="-1"]),[contenteditable="true"]';

  /* ── Прокрутка фона ─────────────────────────────────────────────── */

  function lockScroll() {
    if (lockCount++ > 0) return;
    // Полоса прокрутки исчезает вместе с прокруткой: без компенсации
    // страница дёргается на её ширину в момент открытия слоя.
    var gap = window.innerWidth - doc.documentElement.clientWidth;
    if (gap > 0) {
      doc.body.style.paddingRight = gap + "px";
      padCompensated = true;
    }
    doc.documentElement.classList.add("ui-locked");
    doc.body.classList.add("ui-locked");
  }

  function unlockScroll() {
    if (lockCount === 0 || --lockCount > 0) return;
    doc.documentElement.classList.remove("ui-locked");
    doc.body.classList.remove("ui-locked");
    if (padCompensated) {
      doc.body.style.paddingRight = "";
      padCompensated = false;
    }
  }

  /* ── Фон под слоем ──────────────────────────────────────────────── */

  function clearInert() {
    for (var i = 0; i < inerted.length; i++) {
      inerted[i].removeAttribute("inert");
      inerted[i].inert = false;
    }
    inerted = [];
  }

  /** Всё, что не входит в верхний слой, выключается целиком: ни фокуса,
   *  ни нажатий, ни объявления скринридером. */
  function applyInert() {
    clearInert();
    if (!stack.length) return;
    var top = stack[stack.length - 1].el;
    var children = doc.body.children;
    for (var i = 0; i < children.length; i++) {
      var el = children[i];
      if (el === top || el.contains(top) || top.contains(el)) continue;
      if (
        el.tagName === "SCRIPT" ||
        el.tagName === "STYLE" ||
        el.tagName === "LINK"
      )
        continue;
      if (el.hasAttribute("inert")) continue; // чужой inert не наш, и снимать его нельзя
      el.setAttribute("inert", "");
      el.inert = true;
      inerted.push(el);
    }
  }

  function focusables(root) {
    var all = root.querySelectorAll(FOCUSABLE);
    var out = [];
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      if (el.closest("[inert]")) continue;
      var r = el.getBoundingClientRect();
      if (r.width || r.height) out.push(el);
    }
    return out;
  }

  /* ── Слои ───────────────────────────────────────────────────────── */

  function isOpen(el) {
    for (var i = 0; i < stack.length; i++) if (stack[i].el === el) return true;
    return false;
  }

  function openLayer(el, opts) {
    opts = opts || {};
    if (!el || isOpen(el)) return;
    var opener =
      opts.opener ||
      (doc.activeElement && doc.activeElement !== doc.body
        ? doc.activeElement
        : null);
    stack.push({ el: el, opener: opener, onClose: opts.onClose || null });
    lockScroll();
    applyInert();

    var target =
      opts.initialFocus ||
      el.querySelector("[data-autofocus]") ||
      focusables(el)[0] ||
      el;
    if (target === el && !el.hasAttribute("tabindex"))
      el.setAttribute("tabindex", "-1");
    try {
      target.focus({ preventScroll: true });
    } catch (e) {
      /* фокус не критичен */
    }
  }

  function closeLayer(el) {
    var index = -1;
    for (var i = 0; i < stack.length; i++)
      if (stack[i].el === el) {
        index = i;
        break;
      }
    if (index < 0) return;
    var layer = stack.splice(index, 1)[0];
    unlockScroll();
    applyInert();
    if (layer.onClose) layer.onClose();
    var back = layer.opener;
    if (back && doc.contains(back) && !back.closest("[inert]")) {
      try {
        back.focus({ preventScroll: true });
      } catch (e) {
        /* фокус не критичен */
      }
    }
  }

  function closeTop() {
    if (stack.length) closeLayer(stack[stack.length - 1].el);
  }

  // Перехват идёт на фазе погружения: обработчики страниц не должны получить
  // Escape раньше и закрыть не тот слой.
  doc.addEventListener(
    "keydown",
    function (e) {
      if (!stack.length) return;
      if (e.key === "Escape" || e.key === "Esc") {
        e.preventDefault();
        closeTop();
        return;
      }
      if (e.key !== "Tab") return;

      var top = stack[stack.length - 1].el;
      var list = focusables(top);
      if (!list.length) {
        e.preventDefault();
        if (top.focus) top.focus();
        return;
      }
      var first = list[0];
      var last = list[list.length - 1];
      var active = doc.activeElement;
      if (!top.contains(active)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    },
    true,
  );

  /* ── Мобильное меню ─────────────────────────────────────────────── */

  var ICON_PHONE =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 ' +
    "19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91" +
    'a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>';
  var ICON_CLOSE =
    '<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" ' +
    'aria-hidden="true"><line x1="1" y1="1" x2="13" y2="13"/><line x1="13" y1="1" x2="1" y2="13"/></svg>';

  var menu = null;
  var burger = null;

  function buildMenu() {
    var nav = doc.getElementById("nav");
    var links = doc.getElementById("nav-links");
    burger = doc.getElementById("burger");
    if (!nav || !links || !burger) return;

    var logo = nav.querySelector(".nav-logo");
    // Берётся именно текстовая ссылка: у компактной кнопки в шапке текста
    // нет вовсе, там только значок.
    var tel =
      nav.querySelector('.nav-cta[href^="tel:"]') ||
      nav.querySelector('a[href^="tel:"]');

    menu = doc.createElement("div");
    menu.className = "mmenu";
    menu.id = "mobile-menu";
    menu.setAttribute("role", "dialog");
    menu.setAttribute("aria-modal", "true");
    menu.setAttribute("aria-label", "Меню сайта");

    var head = doc.createElement("div");
    head.className = "mmenu-head";
    var logoLink = doc.createElement("a");
    logoLink.className = "mmenu-logo";
    logoLink.href = logo ? logo.getAttribute("href") : "index.html";
    logoLink.innerHTML = logo ? logo.innerHTML : "Зелёный <span>ключ</span>";
    var close = doc.createElement("button");
    close.type = "button";
    close.className = "mmenu-close";
    close.setAttribute("aria-label", "Закрыть меню");
    close.innerHTML = ICON_CLOSE;
    close.addEventListener("click", closeMenu);
    head.appendChild(logoLink);
    head.appendChild(close);

    // Пункты берутся из настольного меню, а не пишутся заново: два списка
    // ссылок в разметке рано или поздно разъезжаются.
    var body = doc.createElement("div");
    body.className = "mmenu-body";
    var list = doc.createElement("ul");
    list.className = "mmenu-list";
    var sourceLinks = links.querySelectorAll("a");
    for (var i = 0; i < sourceLinks.length; i++) {
      var src = sourceLinks[i];
      var li = doc.createElement("li");
      var a = doc.createElement("a");
      a.href = src.getAttribute("href");
      a.textContent = src.textContent.trim();
      if (src.classList.contains("active"))
        a.setAttribute("aria-current", "page");
      li.appendChild(a);
      list.appendChild(li);
    }
    body.appendChild(list);

    var foot = doc.createElement("div");
    foot.className = "mmenu-foot";
    if (tel) {
      var telLink = doc.createElement("a");
      telLink.className = "mmenu-tel";
      telLink.href = tel.getAttribute("href");
      telLink.innerHTML =
        ICON_PHONE + "<span>" + tel.textContent.trim() + "</span>";
      foot.appendChild(telLink);
    }
    var note = doc.createElement("span");
    note.className = "mmenu-note";
    note.textContent = "Ежедневно 9:00–18:00 · Москва и область";
    foot.appendChild(note);

    menu.appendChild(head);
    menu.appendChild(body);
    menu.appendChild(foot);
    doc.body.appendChild(menu);

    // Любой переход закрывает меню: и якорь на этой же странице, и ссылка
    // на соседнюю. Иначе после «назад» страница осталась бы под панелью.
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeMenu();
    });

    burger.setAttribute("aria-controls", "mobile-menu");
    burger.setAttribute("aria-expanded", "false");
    if (!burger.getAttribute("aria-label"))
      burger.setAttribute("aria-label", "Меню");
    burger.addEventListener("click", toggleMenu);

    // Экран стал широким — меню больше не нужно: панель скрыта правилом
    // @media, и без этого страница осталась бы с заблокированной прокруткой.
    var wide = window.matchMedia("(min-width:960px)");
    var onWide = function (e) {
      if (e.matches) closeMenu();
    };
    if (wide.addEventListener) wide.addEventListener("change", onWide);
    else if (wide.addListener) wide.addListener(onWide);
  }

  function openMenu() {
    if (!menu || menu.classList.contains("is-open")) return;
    menu.classList.add("is-open");
    burger.setAttribute("aria-expanded", "true");
    // Фокус ведём на крестик, а не на первую ссылку: логотип с обводкой
    // выглядит выбранным пунктом, которым он не является.
    openLayer(menu, {
      opener: burger,
      initialFocus: menu.querySelector(".mmenu-close"),
      onClose: hideMenu,
    });
  }

  function hideMenu() {
    if (!menu) return;
    menu.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  }

  function closeMenu() {
    if (!menu) return;
    if (isOpen(menu)) closeLayer(menu);
    else hideMenu();
  }

  function toggleMenu() {
    if (!menu) return;
    if (menu.classList.contains("is-open")) closeMenu();
    else openMenu();
  }

  /* ── Возможности устройства ─────────────────────────────────────── */

  var finePointer = window.matchMedia(
    "(hover:hover) and (pointer:fine)",
  ).matches;
  var reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  window.SiteUI = {
    openLayer: openLayer,
    closeLayer: closeLayer,
    closeTop: closeTop,
    isLayerOpen: isOpen,
    lockScroll: lockScroll,
    unlockScroll: unlockScroll,
    finePointer: finePointer,
    reducedMotion: reducedMotion,
  };

  // Инлайновые обработчики в разметке зовут эти имена напрямую.
  window.toggleMenu = toggleMenu;
  window.closeMenu = closeMenu;

  /* ── Кнопка звонка уступает подвалу ───────────────────────────────
     Кнопка закреплена в углу окна и накрывает то, что в этот угол попало;
     у подвала это его единственная строка с копирайтом и ссылкой.
     Наблюдатель, а не расчёт по `scroll`: подвал разной высоты на разных
     страницах, а на калькуляторе над ним ещё и нижняя панель итога —
     считать пороги пришлось бы для каждой страницы отдельно.

     `rootMargin` снизу нулевой: кнопка прячется ровно тогда, когда подвал
     появился в окне, и возвращается, как только он ушёл. */
  function watchCallButton() {
    var call = doc.querySelector(".site-call");
    var footer = doc.querySelector("footer");
    if (!call || !footer || typeof IntersectionObserver !== "function") return;

    new IntersectionObserver(
      function (entries) {
        call.classList.toggle("is-hidden", entries[0].isIntersecting);
      },
      { threshold: 0 },
    ).observe(footer);
  }

  function init() {
    buildMenu();
    watchCallButton();
  }

  if (doc.readyState === "loading")
    doc.addEventListener("DOMContentLoaded", init);
  else init();
})();
