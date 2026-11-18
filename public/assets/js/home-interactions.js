/* ФОНОВОЕ ВИДЕО ПЕРВОГО ЭКРАНА
   Адрес подставляется здесь, а не в разметке: пока он стоял в <source>,
   телефон выкачивал все 4,24 МБ — `display:none` отменяет показ, а не
   загрузку.

   НА ТЕЛЕФОНЕ ИГРАЕТ ОТДЕЛЬНЫЙ ФАЙЛ (решение владельца 2026-08-06:
   «нету видео на фоне, что у нас обычно на веб-версии»). Тот же ролик
   в 640 × 360 без звуковой дорожки весит 327 КБ против 4342 — на 92 %
   меньше. Разницы не видно: кадр всё равно идёт под размытием 6 px и
   яркостью 0.62, то есть мелкие детали исходника не доживают до экрана.
   Звук выброшен потому, что видео и так `muted` — 140 кбит/с ради
   дорожки, которую никто не услышит.

   Видео не грузится вовсе при уменьшенной анимации и при включённой
   экономии трафика: там первый экран держит неподвижный кадр из CSS. */
(function () {
  const v = document.querySelector(".hero-bg-video");
  if (!v) return;
  const wide = window.matchMedia("(min-width:769px)");
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
  const rate = parseFloat(v.dataset.speed) || 1;
  const apply = () => {
    v.playbackRate = rate;
  };
  let loaded = false;
  // Экономия трафика и медленное соединение — та же причина не тянуть
  // фоновый ролик, что и просьба убрать движение.
  function thrifty() {
    const c = navigator.connection;
    if (!c) return false;
    return !!c.saveData || /(^|-)2g$/.test(c.effectiveType || "");
  }
  function maybeLoad() {
    if (loaded || calm.matches || thrifty()) return;
    // Источник выбирается один раз, при загрузке: подмена на лету
    // означала бы перезапуск ролика с начала прямо под читателем.
    const src = wide.matches
      ? v.dataset.src
      : v.dataset.srcMobile || v.dataset.src;
    if (!src) return;
    loaded = true;
    // Постер нужен только там, где идёт тяжёлый файл: на телефоне за
    // подложку отвечает кадр из CSS, и второй такой же был бы лишним.
    if (wide.matches && v.dataset.poster) v.poster = v.dataset.poster;
    v.src = src;
    v.load();
    const started = v.play();
    if (started && started.catch) started.catch(() => {});
  }
  v.addEventListener("loadeddata", apply);
  v.addEventListener("play", apply);
  maybeLoad();
})();

/* PARTICLES */
function initParticles(c, opts) {
  opts = opts || {};
  const ctx = c.getContext("2d");
  const count = opts.count || 70,
    linkDist = opts.linkDist || 110,
    linkAlpha = opts.linkAlpha != null ? opts.linkAlpha : 0.1;
  let W,
    H,
    pts = [];
  function resize() {
    W = c.width = c.offsetWidth;
    H = c.height = c.offsetHeight;
  }
  resize();
  window.addEventListener("resize", resize);
  for (let i = 0; i < count; i++)
    pts.push({
      x: Math.random() * (W || 1920),
      y: Math.random() * (H || 1080),
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 0.5,
      a: Math.random() * 0.5 + 0.1,
      c:
        Math.random() > 0.7
          ? "#22C55E"
          : Math.random() > 0.5
            ? "#FF6B2B"
            : "#fff",
    });
  function draw() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x % W, p.y % H, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.c;
      ctx.globalAlpha = p.a;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    for (let i = 0; i < pts.length; i++)
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x,
          dy = pts[i].y - pts[j].y,
          d = Math.sqrt(dx * dx + dy * dy);
        if (d < linkDist) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = "#22C55E";
          ctx.globalAlpha = (1 - d / linkDist) * linkAlpha;
          ctx.lineWidth = 0.5;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    if (visible) requestAnimationFrame(draw);
    else running = false;
  }
  /* Канвас частиц живёт на первом экране, но цикл крутился всю страницу:
     в подвале он разгонялся до 160 кадров в секунду, а на блоке строительства
     дома отнимал у главного потока примерно столько же, сколько вся 3D-сцена,
     рисуя при этом за четыре тысячи пикселей выше экрана. */
  let visible = true,
    running = false;
  function pump() {
    if (visible && !running) {
      running = true;
      requestAnimationFrame(draw);
    }
  }
  if ("IntersectionObserver" in window) {
    visible = false;
    new IntersectionObserver((es) => {
      visible = es.some((e) => e.isIntersecting);
      pump();
    }).observe(c);
  }
  pump();
}
(function () {
  const c1 = document.getElementById("particles-canvas");
  if (!c1) return;
  // При уменьшенной анимации канвас не заводится вовсе: это движение ради
  // движения, а цикл кадров стоит дороже, чем выглядит.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  // Связи считаются попарно, то есть по n². Сотня точек — это 4950 пар на
  // кадр, и на телефоне они ложатся на площадь втрое меньше настольной.
  const count = innerWidth <= 480 ? 36 : innerWidth <= 900 ? 60 : 100;
  initParticles(c1, { count: count });
})();

/* TYPEWRITER */
(function () {
  const el = document.getElementById("typewriter");
  const phrases = [
    "Каркасные дома под ключ",
    "Ремонт и отделка",
    "Дизайн-проекты",
    "Строим мечты в реальность",
  ];
  let pi = 0,
    ci = 0,
    del = false;
  function type() {
    const ph = phrases[pi];
    if (!del) {
      el.textContent = ph.slice(0, ++ci);
      if (ci === ph.length) {
        del = true;
        setTimeout(type, 2000);
        return;
      }
    } else {
      el.textContent = ph.slice(0, --ci);
      if (ci === 0) {
        del = false;
        pi = (pi + 1) % phrases.length;
      }
    }
    setTimeout(type, del ? 45 : 75);
  }
  setTimeout(type, 1600);
})();

/* NAV */
/* Обработчик менял класс шапки и тут же читал scrollHeight — браузер был
   обязан пересчитать раскладку синхронно, и делал это на каждом событии
   прокрутки. Теперь чтение вынесено в кадр, а высота документа кэшируется. */
(function () {
  const nav = document.getElementById("nav"),
    bar = document.getElementById("progress");
  if (!nav || !bar) return;
  const h = document.documentElement;
  let range = Math.max(h.scrollHeight - h.clientHeight, 1),
    ticking = false;
  const measure = () => {
    range = Math.max(h.scrollHeight - h.clientHeight, 1);
  };
  function upd() {
    ticking = false;
    nav.classList.toggle("scrolled", window.scrollY > 60);
    bar.style.width = (window.scrollY / range) * 100 + "%";
  }
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(upd);
      }
    },
    { passive: true },
  );
  window.addEventListener("resize", () => {
    measure();
    upd();
  });
  window.addEventListener("load", measure);
  measure();
  upd();
})();
/* Мобильное меню целиком живёт в /assets/js/site-ui.js: панель лежит вне
   шапки (иначе `backdrop-filter` шапки делает её своим контейнером
   позиционирования и «полноэкранная» панель получает высоту шапки),
   а прокрутка, фокус и Escape идут через общий стек слоёв. */

/* REVEAL */
const revEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.1 },
);
revEls.forEach((el) => io.observe(el));

/* COUNTERS */
function animCounter(el) {
  const target = +el.dataset.target,
    suf = el.dataset.suffix || "";
  let cur = 0;
  const step = Math.ceil(target / 60);
  const t = setInterval(() => {
    cur = Math.min(cur + step, target);
    el.textContent = cur.toLocaleString("ru") + suf;
    if (cur >= target) clearInterval(t);
  }, 24);
}
const cio = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.querySelectorAll(".counter").forEach(animCounter);
        cio.unobserve(e.target);
      }
    });
  },
  { threshold: 0.3 },
);
cio.observe(document.getElementById("numbers-grid"));

/* PROCESS LINE */
const pio = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("animated");
        pio.unobserve(e.target);
      }
    });
  },
  { threshold: 0.3 },
);
pio.observe(document.getElementById("process-steps"));

/* НАКЛОН КАРТОЧЕК И МАГНИТНЫЕ КНОПКИ
   Оба эффекта существуют только для мыши. На сенсорном экране события
   мыши всё равно приходят — синтезированные из касания, — и карточка
   оставалась перекошенной после нажатия, а кнопка уезжала из-под пальца.
   Поэтому обработчики не навешиваются вовсе там, где нет точного
   указателя: это заодно снимает лишнюю работу с прокрутки. */
if (window.matchMedia("(hover:hover) and (pointer:fine)").matches) {
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5,
        y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(1000px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateZ(4px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
  document.querySelectorAll(".magnetic").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.22,
        y = (e.clientY - r.top - r.height / 2) * 0.22;
      btn.style.transform = `translate(${x}px,${y}px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });
}

/* МОДАЛЬНЫЕ ОКНА управляются React-компонентом HomeDialogs.
   Legacy calculator markup calls these global bridges; the bridge emits events,
   while React owns visibility, focus, Escape and scroll locking. */
window.openModal = function (id) {
  window.dispatchEvent(new CustomEvent("home:open-modal", { detail: id }));
};
window.closeModal = function (id) {
  window.dispatchEvent(new CustomEvent("home:close-modal", { detail: id }));
};

/* Отправка форм живёт в /assets/js/lead-form.js. */

/* PRICE FORMAT
   Пробел перед знаком рубля — неразрывный (U+00A0), и разряды тоже
   разделяет неразрывный: так «1 280 000 ₽» не рвётся переносом ни в
   одном месте. Проверено на узкой колонке 320 px. */
function fmt(v) {
  return v.toLocaleString("ru") + " ₽";
}
/* Таймер перебора цифр хранится НА САМОМ ЭЛЕМЕНТЕ, а не в общей
   переменной. Пока он был общим, три калькулятора страницы делили один
   таймер: движение ползунка в одном обрывало перебор в другом на
   случайном промежуточном числе, и на экране оставалась цена, которой
   нет ни в одном прайсе. */
function slotAnim(el, target) {
  let s = 10,
    c = 0;
  clearInterval(el._slotTimer);
  el._slotTimer = setInterval(() => {
    c++;
    el.textContent =
      c < s
        ? fmt(Math.round(target * (0.5 + Math.random() * 0.6)))
        : fmt(target);
    if (c >= s) clearInterval(el._slotTimer);
  }, 40);
}

/* CALCULATOR 1 — Каркасные дома */
const calc1Variants = {
  a: {
    rate: 60000,
    includes:
      "Сваи ЖБ · Каркас 200 мм · Кровля · Окна 70 мм · Дверь · Фасад имитация бруса · Закладные · ОСБ",
  },
  b: {
    rate: 100000,
    includes:
      "Всё из пакета А + вода, канализация, электричество, бойлер, котёл, радиаторы, септик, скважина",
  },
  c: { rate: null },
};
let c1variant = "a",
  c1area = 150;

function renderCalc1() {
  const box = document.getElementById("calc1-body");
  const v = calc1Variants[c1variant];
  if (c1variant === "c") {
    box.innerHTML = `<div class="calc-indiv">
      <h4>Благоустройство территории</h4>
      <p>Забор, ворота, калитка, въездная группа, стоянка авто, дорожки, озеленение, дренаж участка.<br><br>Стоимость рассчитывается индивидуально после выезда на объект и согласования пожеланий.</p>
      <button class="calc-cta ripple" onclick="openModal('modal-measure')">Получить расчёт</button>
    </div>`;
    return;
  }
  box.innerHTML = `<div class="calc-body">
    <div class="calc-left">
      <label for="area1-slider">Площадь дома <em id="area1-display">${c1area} м²</em></label>
      <input type="range" id="area1-slider" min="20" max="1000" value="${c1area}" step="5" aria-valuetext="${c1area} м²">
      <div class="calc-range-labels"><span>20 м²</span><span>500 м²</span><span>1000 м²</span></div>
      <div class="calc-includes"><strong>В стоимость входит:</strong>${v.includes}</div>
    </div>
    <div class="calc-right">
      <div class="calc-price-label">Примерная стоимость</div>
      <div class="calc-price" id="calc1-price">${fmt(c1area * v.rate)}</div>
      <div class="calc-note">Точная смета — после бесплатного замера</div>
      <button class="calc-cta ripple" onclick="openModal('modal-measure')">Получить смету</button>
    </div>
  </div>`;
  document
    .getElementById("area1-slider")
    .addEventListener("input", function () {
      c1area = +this.value;
      document.getElementById("area1-display").textContent = c1area + " м²";
      // Голосом ползунок читается как голое число: без aria-valuetext
      // скринридер объявлял «150», не сообщая, что это квадратные метры.
      this.setAttribute("aria-valuetext", c1area + " м²");
      slotAnim(document.getElementById("calc1-price"), c1area * v.rate);
    });
}
renderCalc1();

/* Активная вкладка помечена не только цветом и тенью: aria-pressed
   сообщает состояние голосом, галочка — глазу (правило .calc-tab.active). */
function markTabs(group, active) {
  group.forEach((t) =>
    t.setAttribute("aria-pressed", t === active ? "true" : "false"),
  );
}
const calc1Tabs = [...document.querySelectorAll('[data-calc="1"]')];
markTabs(
  calc1Tabs,
  calc1Tabs.find((t) => t.classList.contains("active")),
);
calc1Tabs.forEach((tab) => {
  tab.addEventListener("click", function () {
    calc1Tabs.forEach((t) => t.classList.remove("active"));
    this.classList.add("active");
    markTabs(calc1Tabs, this);
    c1variant = this.dataset.variant;
    renderCalc1();
  });
});

/* CALCULATOR 2 — Ремонт */
let c2rate = 16000;
const s2 = document.getElementById("area2-slider"),
  p2 = document.getElementById("calc2-price");
s2.addEventListener("input", function () {
  document.getElementById("area2-display").textContent = this.value + " м²";
  this.setAttribute("aria-valuetext", this.value + " м²");
  slotAnim(p2, +this.value * c2rate);
});
const calc2Tabs = [...document.querySelectorAll('[data-calc="2"]')];
markTabs(
  calc2Tabs,
  calc2Tabs.find((t) => t.classList.contains("active")),
);
calc2Tabs.forEach((tab) => {
  tab.addEventListener("click", function () {
    calc2Tabs.forEach((t) => t.classList.remove("active"));
    this.classList.add("active");
    markTabs(calc2Tabs, this);
    c2rate = +this.dataset.rate;
    slotAnim(p2, +s2.value * c2rate);
  });
});

/* CALCULATOR 3 — Дизайн */
const s3 = document.getElementById("area3-slider"),
  p3 = document.getElementById("calc3-price");
s3.addEventListener("input", function () {
  document.getElementById("area3-display").textContent = this.value + " м²";
  this.setAttribute("aria-valuetext", this.value + " м²");
  slotAnim(p3, +this.value * 3500);
});

/* CONTACTS FORM TABS */
const formTabs = [...document.querySelectorAll(".form-tab")];
markTabs(
  formTabs,
  formTabs.find((t) => t.classList.contains("active")),
);
formTabs.forEach((tab) => {
  tab.addEventListener("click", function () {
    formTabs.forEach((t) => t.classList.remove("active"));
    this.classList.add("active");
    markTabs(formTabs, this);
    const isMeasure = this.dataset.form === "measure";
    document.getElementById("cf-addr-group").style.display = isMeasure
      ? "flex"
      : "none";
    const btn = document.getElementById("cf-submit");
    const label = isMeasure ? "Записаться на замер" : "Жду звонка";
    btn.textContent = label;
    /* lead-form.js возвращает подпись кнопки после отправки из этого же
       атрибута — иначе после смены вкладки она вернулась бы к прежней. */
    btn.dataset.leadLabel = label;
  });
});

/* PRELOADER */
window.addEventListener("load", () => {
  setTimeout(
    () => document.getElementById("preloader").classList.add("done"),
    700,
  );
});
setTimeout(() => {
  const p = document.getElementById("preloader");
  if (p && !p.classList.contains("done")) p.classList.add("done");
}, 2500);

/* BUILD ON SCROLL */
(function () {
  const bs = document.getElementById("build");
  if (!bs) return;
  const svg = document.getElementById("bhouse");
  if (!svg) return;
  const NS = "http://www.w3.org/2000/svg";
  const U = 4.6,
    D = 2.3,
    Hh = 3.1,
    OX = 500,
    OY = 300;
  const P = (x, y, z) => [OX + (x - y) * U, OY + (x + y) * D - z * Hh];
  const AT = (t, o) => {
    const e = document.createElementNS(NS, t);
    for (const k in o) e.setAttribute(k, o[k]);
    return e;
  };
  const poly = (pts, fill, stroke, sw, op) =>
    AT("polygon", {
      points: pts
        .map((p) => {
          const s = P(p[0], p[1], p[2]);
          return s[0].toFixed(1) + "," + s[1].toFixed(1);
        })
        .join(" "),
      fill: fill || "none",
      stroke: stroke || "none",
      "stroke-width": sw || 0,
      "stroke-linejoin": "round",
      "fill-opacity": op == null ? 1 : op,
    });
  const seg = (a, b, stroke, sw, op) => {
    const p = P(a[0], a[1], a[2]),
      q = P(b[0], b[1], b[2]);
    return AT("line", {
      x1: p[0].toFixed(1),
      y1: p[1].toFixed(1),
      x2: q[0].toFixed(1),
      y2: q[1].toFixed(1),
      stroke: stroke,
      "stroke-width": sw,
      "stroke-linecap": "round",
      "stroke-opacity": op == null ? 1 : op,
    });
  };
  const GG = () => {
    const g = AT("g", { class: "blayer" });
    svg.appendChild(g);
    return g;
  };
  const eb = (t) => {
    const c1 = 1.70158,
      c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  };
  const stoneT = "#4a4a4a",
    stoneL = "#343434",
    stoneR = "#3e3e3e",
    stoneLn = "#5a5a5a";
  const woodL = "#b07d40",
    woodR = "#996833",
    woodT = "#c9a063",
    batt = "rgba(0,0,0,.22)";
  const dark = "#2b2b2b",
    frm = "#e0a95f",
    frmD = "#b98443";
  const roofT = "#d6d6d6",
    roofS = "#a6a6a6",
    roofSide = "#8f8f8f",
    edge = "rgba(255,255,255,.85)";
  const glass = "#1d2028",
    mull = "rgba(255,255,255,.5)",
    glow = "#ffcf4d";
  const X0 = 0,
    X1 = 64,
    Y0 = 0,
    Y1 = 46,
    ZB = 7,
    ZT = 70,
    GX = 38,
    GY = 18,
    GZ = 64;
  const g1 = GG();
  g1.appendChild(
    poly(
      [
        [X0, Y0, ZB],
        [X1, Y0, ZB],
        [X1, Y1, ZB],
        [X0, Y1, ZB],
      ],
      stoneT,
      edge,
      1,
    ),
  );
  g1.appendChild(
    poly(
      [
        [X0, Y1, ZB],
        [X1, Y1, ZB],
        [X1, Y1, 0],
        [X0, Y1, 0],
      ],
      stoneL,
      edge,
      1,
    ),
  );
  g1.appendChild(
    poly(
      [
        [X1, Y0, ZB],
        [X1, Y1, ZB],
        [X1, Y1, 0],
        [X1, Y0, 0],
      ],
      stoneR,
      edge,
      1,
    ),
  );
  for (let z = 2; z < ZB; z += 2.5) {
    g1.appendChild(seg([X0, Y1, z], [X1, Y1, z], stoneLn, 1, 0.6));
    g1.appendChild(seg([X1, Y0, z], [X1, Y1, z], stoneLn, 1, 0.6));
  }
  var dX0 = 6,
    dX1 = 34,
    dY1 = 66,
    dZ = 6;
  g1.appendChild(
    poly(
      [
        [dX0, Y1, dZ],
        [dX1, Y1, dZ],
        [dX1, dY1, dZ],
        [dX0, dY1, dZ],
      ],
      woodT,
      edge,
      1,
    ),
  );
  g1.appendChild(
    poly(
      [
        [dX0, dY1, dZ],
        [dX1, dY1, dZ],
        [dX1, dY1, 0],
        [dX0, dY1, 0],
      ],
      woodL,
      edge,
      1,
    ),
  );
  g1.appendChild(
    poly(
      [
        [dX0, Y1, dZ],
        [dX0, dY1, dZ],
        [dX0, dY1, 0],
        [dX0, Y1, 0],
      ],
      woodR,
      edge,
      1,
    ),
  );
  for (let x = dX0 + 3; x < dX1; x += 3)
    g1.appendChild(seg([x, Y1, dZ], [x, dY1, dZ], batt, 1.4, 0.8));
  for (let s = 0; s < 2; s++) {
    var sy = dY1 + s * 4,
      sz = dZ - 2 - s * 2;
    g1.appendChild(
      poly(
        [
          [10, sy, sz],
          [24, sy, sz],
          [24, sy + 4, sz],
          [10, sy + 4, sz],
        ],
        woodT,
        edge,
        0.8,
      ),
    );
    g1.appendChild(
      poly(
        [
          [10, sy + 4, sz],
          [24, sy + 4, sz],
          [24, sy + 4, sz - 2],
          [10, sy + 4, sz - 2],
        ],
        woodL,
        edge,
        0.8,
      ),
    );
  }
  const g2 = GG();
  [
    [X0, Y0],
    [X1, Y0],
    [X1, Y1],
    [X0, Y1],
    [GX, Y1],
    [X1, GY],
    [32, Y0],
    [X0, 24],
  ].forEach((p) =>
    g2.appendChild(seg([p[0], p[1], ZB], [p[0], p[1], ZT], frm, 3.4)),
  );
  [38, ZT].forEach((z) => {
    g2.appendChild(seg([X0, Y1, z], [X1, Y1, z], frmD, 3));
    g2.appendChild(seg([X1, Y0, z], [X1, Y1, z], frmD, 3));
    g2.appendChild(seg([X0, Y0, z], [X0, Y1, z], frmD, 2.4, 0.6));
    g2.appendChild(seg([X0, Y0, z], [X1, Y0, z], frmD, 2.4, 0.6));
  });
  for (let x = X0; x <= X1; x += 8)
    g2.appendChild(seg([x, Y0, ZT + 8], [x, Y1, ZT - 4], frm, 2.6, 0.9));
  const g3 = GG();
  g3.appendChild(
    poly(
      [
        [X0, Y1, ZB],
        [GX, Y1, ZB],
        [GX, Y1, ZT],
        [X0, Y1, ZT],
      ],
      woodL,
      edge,
      1,
    ),
  );
  g3.appendChild(
    poly(
      [
        [X0, Y1, ZB],
        [12, Y1, ZB],
        [12, Y1, ZT],
        [X0, Y1, ZT],
      ],
      dark,
      edge,
      1,
    ),
  );
  g3.appendChild(
    poly(
      [
        [X1, Y0, ZB],
        [X1, GY, ZB],
        [X1, GY, ZT],
        [X1, Y0, ZT],
      ],
      woodR,
      edge,
      1,
    ),
  );
  for (let x = 15; x < GX; x += 3)
    g3.appendChild(seg([x, Y1, ZB], [x, Y1, ZT], batt, 1.4, 0.85));
  for (let y = 3; y < GY; y += 3)
    g3.appendChild(seg([X1, y, ZB], [X1, y, ZT], batt, 1.4, 0.85));
  g3.appendChild(seg([X0, Y1, 38], [GX, Y1, 38], "rgba(0,0,0,.25)", 1.4));
  g3.appendChild(seg([X1, Y0, 38], [X1, GY, 38], "rgba(0,0,0,.25)", 1.4));
  const g4 = GG();
  var rb = ZT + 9,
    rf = ZT - 5,
    oX0 = -3,
    oX1 = 67,
    oY0 = -3,
    oY1 = 50;
  g4.appendChild(
    poly(
      [
        [oX0, oY0, rb],
        [oX1, oY0, rb],
        [oX1, oY1, rf],
        [oX0, oY1, rf],
      ],
      roofT,
      edge,
      1.4,
    ),
  );
  for (let x = oX0 + 4; x < oX1; x += 5)
    g4.appendChild(seg([x, oY0, rb], [x, oY1, rf], roofS, 1.4, 0.8));
  g4.appendChild(
    poly(
      [
        [oX0, oY1, rf],
        [oX1, oY1, rf],
        [oX1, oY1, rf - 3],
        [oX0, oY1, rf - 3],
      ],
      roofSide,
      edge,
      1,
    ),
  );
  g4.appendChild(
    poly(
      [
        [oX1, oY0, rb],
        [oX1, oY1, rf],
        [oX1, oY1, rf - 3],
        [oX1, oY0, rb - 3],
      ],
      roofSide,
      edge,
      1,
    ),
  );
  const g5 = GG();
  g5.appendChild(
    poly(
      [
        [GX, Y1, ZB],
        [X1, Y1, ZB],
        [X1, Y1, GZ],
        [GX, Y1, GZ],
      ],
      glass,
      mull,
      1,
    ),
  );
  g5.appendChild(
    poly(
      [
        [X1, GY, ZB],
        [X1, Y1, ZB],
        [X1, Y1, GZ],
        [X1, GY, GZ],
      ],
      glass,
      mull,
      1,
    ),
  );
  for (let x = GX + 6; x < X1; x += 6)
    g5.appendChild(seg([x, Y1, ZB], [x, Y1, GZ], mull, 1));
  for (let y = GY + 6; y < Y1; y += 6)
    g5.appendChild(seg([X1, y, ZB], [X1, y, GZ], mull, 1));
  for (let z = ZB + 12; z < GZ; z += 12) {
    g5.appendChild(seg([GX, Y1, z], [X1, Y1, z], mull, 1));
    g5.appendChild(seg([X1, GY, z], [X1, Y1, z], mull, 1));
  }
  g5.appendChild(
    poly(
      [
        [16, Y1, 44],
        [26, Y1, 44],
        [26, Y1, 60],
        [16, Y1, 60],
      ],
      glass,
      mull,
      1,
    ),
  );
  g5.appendChild(
    poly(
      [
        [4, Y1, ZB],
        [10, Y1, ZB],
        [10, Y1, 30],
        [4, Y1, 30],
      ],
      "#111",
      mull,
      1,
    ),
  );
  const g6 = GG();
  g6.appendChild(
    poly(
      [
        [GX, Y1, ZB],
        [X1, Y1, ZB],
        [X1, Y1, GZ],
        [GX, Y1, GZ],
      ],
      glow,
      "none",
      0,
      0.9,
    ),
  );
  g6.appendChild(
    poly(
      [
        [X1, GY, ZB],
        [X1, Y1, ZB],
        [X1, Y1, GZ],
        [X1, GY, GZ],
      ],
      glow,
      "none",
      0,
      0.82,
    ),
  );
  g6.appendChild(
    poly(
      [
        [16, Y1, 44],
        [26, Y1, 44],
        [26, Y1, 60],
        [16, Y1, 60],
      ],
      glow,
      "none",
      0,
      0.95,
    ),
  );
  for (let x = GX + 6; x < X1; x += 6)
    g6.appendChild(seg([x, Y1, ZB], [x, Y1, GZ], "rgba(110,70,15,.5)", 1));
  for (let z = ZB + 12; z < GZ; z += 12) {
    g6.appendChild(seg([GX, Y1, z], [X1, Y1, z], "rgba(110,70,15,.5)", 1));
    g6.appendChild(seg([X1, GY, z], [X1, Y1, z], "rgba(110,70,15,.5)", 1));
  }
  const L = [g1, g2, g3, g4, g5, g6];
  const dots = [...document.getElementById("b-dots").children];
  const numEl = document.getElementById("b-num"),
    titleEl = document.getElementById("b-title"),
    descEl = document.getElementById("b-desc");
  const stages = [
    {
      t: "Фундамент на сваях",
      d: "Забиваем железобетонные сваи — надёжное основание вашего дома.",
    },
    {
      t: "Силовой каркас",
      d: "Возводим каркас 200 мм — прочный скелет будущего дома.",
    },
    {
      t: "Стены и фасад",
      d: "Обшиваем стены и монтируем фасад «имитация бруса».",
    },
    { t: "Кровля", d: "Ставим стропильную систему и кладём металлочерепицу." },
    {
      t: "Окна и двери",
      d: "Устанавливаем окна 70 мм и входную дверь — тёплый контур готов.",
    },
    {
      t: "Ключи ваши",
      d: "Финальная отделка, подключение коммуникаций — и вы въезжаете.",
    },
  ];
  let cur = -1;
  function setStage(s) {
    if (s === cur) return;
    cur = s;
    dots.forEach((d, i) => d.classList.toggle("act", i <= s));
    numEl.textContent = "0" + (s + 1);
    titleEl.textContent = stages[s].t;
    descEl.textContent = stages[s].d;
  }
  /* Передача владения блоком: когда 3D-сцена отдала первый кадр, SVG-версия
     уходит со сцены и перестаёт писать в те же элементы текста. Пока события
     нет, этот код остаётся единственной реализацией блока. */
  let owned = true;
  document.addEventListener(
    "build:3d-ready",
    () => {
      owned = false;
      svg.style.display = "none";
    },
    { once: true },
  );
  if (
    window.matchMedia("(max-width:900px)").matches ||
    window.matchMedia("(prefers-reduced-motion:reduce)").matches
  ) {
    /* Дом показывается собранным, а этапы — списком.
       Прежде здесь ставился финал и писался текст ШЕСТОГО этапа, и читатель без
       анимации получал один этап из шести: пять оставшихся не показывались
       нигде. Режим уменьшенной анимации просит убрать движение, а не
       содержание, и то же верно для узкого экрана. */
    L.forEach((g) => {
      g.setAttribute("transform", "translate(0 0)");
      g.style.opacity = 1;
    });
    bs.classList.add("is-static");
    return;
  }
  let ticking = false;
  function upd() {
    ticking = false;
    if (!owned) return;
    const total = bs.offsetHeight - window.innerHeight;
    const prog = Math.min(
      Math.max(-bs.getBoundingClientRect().top / total, 0),
      1,
    );
    var n = L.length,
      step = 1 / n;
    for (var i = 0; i < n; i++) {
      var lp = Math.min(Math.max((prog - i * step) / step, 0), 1);
      var e = lp <= 0 ? 0 : lp >= 1 ? 1 : eb(lp);
      L[i].setAttribute(
        "transform",
        "translate(0 " + (-72 * (1 - e)).toFixed(1) + ")",
      );
      L[i].style.opacity = lp <= 0 ? 0 : Math.min(lp * 2.5, 1);
    }
    setStage(Math.min(Math.floor(prog * n), n - 1));
  }
  window.addEventListener("scroll", () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(upd);
    }
  });
  upd();
})();

/* PARALLAX */
/* Смещение считалось на каждом событии прокрутки по всей странице, хотя
   канвас частиц живёт только на первом экране. */
(function () {
  const c = document.getElementById("particles-canvas");
  if (!c) return;
  let ticking = false,
    offscreen = false;
  function upd() {
    ticking = false;
    const past = window.scrollY > window.innerHeight;
    if (past) {
      if (!offscreen) {
        offscreen = true;
        c.style.transform = "";
      }
      return;
    }
    offscreen = false;
    c.style.transform = "translateY(" + window.scrollY * 0.28 + "px)";
  }
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(upd);
      }
    },
    { passive: true },
  );
})();
