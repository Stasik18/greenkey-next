/**
 * Отправка заявок — одна реализация на все формы сайта.
 *
 * Раньше каждая страница обрабатывала отправку сама, и обработчики успели
 * разойтись между собой: на главной кнопка после отправки теряла подпись, в
 * галерее — нет. Здесь один модуль на пять форм, поэтому расходиться нечему.
 *
 * ГЛАВНОЕ ПРАВИЛО: «Заявка отправлена» показывается ТОЛЬКО после ответа
 * сервера с {"ok":true}. Никаких таймеров, изображающих отправку: человек,
 * которому сказали «принято», должен получить звонок.
 *
 * ПРИ ОШИБКЕ ПОЛЯ НЕ ОЧИЩАЮТСЯ. Заново вводить телефон из-за сбоя сети —
 * верный способ потерять заявку совсем. Форма сбрасывается только после
 * подтверждения сервера.
 *
 * Подключение: <script src="assets/js/lead-form.js" defer></script> после
 * site-ui.js. Форма помечается атрибутом data-lead-form="<ключ формы>",
 * ключ обязан совпадать с белым списком в api/send-lead.php.
 */
(function () {
  "use strict";

  var ENDPOINT = "/api/send-lead";

  /* Запасные каналы связи. Показываются в тексте ошибки: если сервер не
     принял заявку, у человека должен остаться способ до нас достучаться. */
  var FALLBACK = {
    tel: "+7 903 512-03-26",
    telHref: "tel:+79035120326",
    telegram: "https://t.me/+79035120326",
    max: "https://max.ru/79035120326",
  };

  var MESSAGES = {
    validation_failed: "Проверьте заполнение формы.",
    too_fast: "Слишком быстро — проверьте поля и отправьте ещё раз.",
    form_expired:
      "Страница открыта давно. Обновите её и заполните форму заново.",
    rate_limited: "Вы уже отправили несколько заявок подряд.",
    rate_limited_global: "Сервис перегружен.",
    origin_rejected: "Запрос отклонён сервером.",
    send_failed: "Не получилось отправить заявку.",
    network: "Не удалось связаться с сервером.",
    unknown: "Что-то пошло не так.",
  };

  /** Сборщики дополнительных данных для форм, где полей мало, а передать надо
   *  больше (калькулятор отправляет всю комплектацию). */
  var collectors = {};

  /** Монотонные часы страницы. Возвращают null там, где их нет, — тогда
   *  длительность заполнения просто не передаётся, и сервер обходится
   *  меткой `ts`. */
  function perfNow() {
    return window.performance && typeof window.performance.now === "function"
      ? window.performance.now()
      : null;
  }

  /**
   * Отмечает момент готовности формы — двумя часами сразу.
   *
   * `leadTs` по системным часам оставлен для совместимости и как грубый
   * запасной вариант; основной источник — `leadPerf` по монотонным часам, по
   * которым и считается длительность заполнения. Обе отметки ставятся вместе:
   * при подключении формы и заново после успешной отправки.
   */
  function stampStart(form) {
    form.dataset.leadTs = String(Date.now());
    var perf = perfNow();
    if (perf !== null) form.dataset.leadPerf = String(perf);
    else delete form.dataset.leadPerf;
  }

  /* ── UTM ──────────────────────────────────────────────────────────────
     Метки приходят в адресе один раз, при первом заходе, а заявку человек
     оставляет позже и уже на другой странице. Поэтому метки запоминаются на
     время сессии. Ничего личного в них нет — это параметры рекламы. */

  var UTM_KEYS = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
  ];

  function readUtm() {
    var stored = {};
    try {
      var saved = window.sessionStorage.getItem("gk_utm");
      if (saved) stored = JSON.parse(saved) || {};
    } catch (e) {
      /* приватный режим — просто работаем без памяти */
    }

    var params = new URLSearchParams(window.location.search);
    var found = {};
    var has = false;
    UTM_KEYS.forEach(function (key) {
      var value = params.get(key);
      if (value) {
        found[key] = value.slice(0, 120);
        has = true;
      }
    });

    if (has) {
      stored = found;
      try {
        window.sessionStorage.setItem("gk_utm", JSON.stringify(stored));
      } catch (e) {
        /* см. выше */
      }
    }
    return stored;
  }

  /* ── Разметка статуса ─────────────────────────────────────────────────
     Блок сообщений создаётся скриптом, а не лежит в HTML: так его нельзя
     забыть добавить при появлении новой формы. */

  function ensureStatus(form) {
    var status = form.querySelector(".lead-status");
    if (status) return status;

    status = document.createElement("div");
    status.className = "lead-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");

    var submit = form.querySelector('[type="submit"], .lead-submit');
    if (submit && submit.parentNode === form) form.insertBefore(status, submit);
    else form.appendChild(status);

    return status;
  }

  /**
   * Показывает сообщение статуса.
   *
   * РАЗМЕТКУ СТРОКОЙ НЕ ПРИНИМАЕТ. Раньше здесь стояло `status.innerHTML = html`,
   * и в него уходил `payload.message` — текст из ответа сервера. Сегодня все
   * сообщения сервера литеральные, и XSS не было, но связка «текст ответа →
   * innerHTML» держала заряженное ружьё: достаточно однажды написать на сервере
   * `'Поле «' . $name . '» заполнено неверно'`, и введённое посетителем
   * выполнилось бы как разметка. Причём выглядела бы такая правка совершенно
   * естественно, и связь с этим местом никто бы не заметил.
   *
   * Теперь строки всегда становятся текстом, а оформление собирается узлами.
   * Ошибиться так, чтобы сюда попала разметка, больше нельзя.
   *
   * @param {string} kind  'error' | 'success'
   * @param {Array<string|Node>} parts строки → textContent, узлы → как есть
   */
  function showStatus(form, kind, parts) {
    var status = ensureStatus(form);
    status.className = "lead-status is-" + kind;
    status.textContent = "";
    parts.forEach(function (part) {
      status.appendChild(
        typeof part === "string" ? document.createTextNode(part) : part,
      );
    });
  }

  function clearStatus(form) {
    var status = form.querySelector(".lead-status");
    if (status) {
      status.className = "lead-status";
      status.textContent = "";
    }
  }

  /** Ссылка. Адрес берётся только из констант FALLBACK, текст — через
   *  textContent. */
  function statusLink(href, text, external) {
    var a = document.createElement("a");
    a.href = href;
    a.textContent = text;
    if (external) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
    return a;
  }

  /** <span class="lead-status-alt"> с готовыми узлами внутри. */
  function statusAlt(parts) {
    var span = document.createElement("span");
    span.className = "lead-status-alt";
    parts.forEach(function (part) {
      span.appendChild(
        typeof part === "string" ? document.createTextNode(part) : part,
      );
    });
    return span;
  }

  /**
   * Ряд запасных каналов связи.
   *
   * Раньше это была строчка «Позвоните: … · Telegram · MAX» со ссылками
   * высотой 15 px. Момент, в который её показывают, — худший из возможных:
   * заявка не ушла, и эти три ссылки остались единственным способом до нас
   * достучаться. Попасть по ним пальцем было почти нельзя. Теперь это
   * «таблетки» в 44 px — минимальная цель по WCAG 2.5.5, оформление общее
   * с блоком успеха калькулятора (см. `.lead-status-actions` в site-ui.css).
   */
  function contactRow() {
    var row = document.createElement("div");
    row.className = "lead-status-actions";
    row.appendChild(statusLink(FALLBACK.telHref, FALLBACK.tel, false));
    row.appendChild(statusLink(FALLBACK.telegram, "Telegram", true));
    row.appendChild(statusLink(FALLBACK.max, "MAX", true));
    return row;
  }

  /** Сообщение об ошибке: текст плюс постоянная подпись с работающими
   *  каналами связи. Текст приходит от сервера и остаётся текстом. */
  function errorParts(text) {
    var hint = document.createElement("span");
    hint.className = "lead-status-hint";
    hint.textContent = "Позвоните или напишите — заявку примем вручную:";
    return [text, hint, contactRow()];
  }

  /* ── Ошибки полей ─────────────────────────────────────────────────── */

  function markField(form, name, message) {
    var field = form.querySelector('[name="' + name + '"]');
    if (!field) return;
    field.setAttribute("aria-invalid", "true");
    field.classList.add("is-invalid");

    var hint = field.parentNode.querySelector(".field-error");
    if (!hint) {
      hint = document.createElement("span");
      hint.className = "field-error";
      hint.id =
        "err-" +
        (field.id || name) +
        "-" +
        Math.random().toString(36).slice(2, 7);
      field.parentNode.appendChild(hint);
    }
    hint.textContent = message;
    field.setAttribute("aria-describedby", hint.id);
  }

  function clearFieldErrors(form) {
    form.querySelectorAll(".is-invalid").forEach(function (field) {
      field.classList.remove("is-invalid");
      field.removeAttribute("aria-invalid");
      field.removeAttribute("aria-describedby");
    });
    form.querySelectorAll(".field-error").forEach(function (hint) {
      hint.remove();
    });
  }

  /* ── Клиентская проверка ──────────────────────────────────────────────
     Дублирует серверную намеренно: сервер — единственный источник истины,
     но показать ошибку без похода в сеть быстрее и понятнее. */

  function validate(form, data) {
    var problems = {};

    if (!data.phone) {
      problems.phone = "Укажите телефон.";
    } else if (data.phone.replace(/\D+/g, "").length < 10) {
      problems.phone = "В номере должно быть не меньше 10 цифр.";
    }

    if (data.name && data.name.length < 2) {
      problems.name = "Слишком короткое имя.";
    }

    if (!data.consent) {
      problems.consent = "Отметьте согласие на обработку данных.";
    }

    return problems;
  }

  /* ── Сбор данных ──────────────────────────────────────────────────── */

  function collect(form) {
    var source = form.dataset.leadForm;
    var data = {
      source: source,
      page: window.location.pathname + window.location.search,
      utm: readUtm(),
      ts: Number(form.dataset.leadTs) || 0,
      consent: false,
    };

    /* Длительность заполнения отдельным полем.
       `ts` — момент по часам устройства, и сервер может сравнить его со своими
       только приблизительно: часы посетителя бывают сбиты на часы и на сутки.
       Здесь же обе отметки сняты с одних и тех же монотонных часов страницы,
       поэтому разность верна независимо от системного времени, перевода часов
       и синхронизации по сети. Сервер предпочитает её, а `ts` оставляет как
       грубый запасной вариант. */
    var startedPerf = Number(form.dataset.leadPerf);
    if (perfNow() !== null && !isNaN(startedPerf)) {
      data.fill_ms = Math.max(0, Math.round(perfNow() - startedPerf));
    }

    ["name", "phone", "comment", "address", "service", "website"].forEach(
      function (field) {
        var el = form.querySelector('[name="' + field + '"]');
        if (el) data[field] = (el.value || "").trim();
      },
    );

    var consent = form.querySelector('[name="consent"]');
    data.consent = !!(consent && consent.checked);

    if (collectors[source]) {
      var extra = collectors[source]() || {};
      Object.keys(extra).forEach(function (key) {
        data[key] = extra[key];
      });
    }

    return data;
  }

  /* ── Отправка ─────────────────────────────────────────────────────── */

  function submit(form) {
    /* Защита от двойного клика. Кнопка тоже блокируется, но флаг надёжнее:
       Enter в поле ввода отправляет форму мимо кнопки. */
    if (form.dataset.leadBusy === "1") return;

    var button = form.querySelector('[type="submit"], .lead-submit');
    var data = collect(form);

    clearFieldErrors(form);
    clearStatus(form);

    var problems = validate(form, data);
    var firstProblem = Object.keys(problems)[0];
    if (firstProblem) {
      Object.keys(problems).forEach(function (field) {
        markField(form, field, problems[field]);
      });
      showStatus(form, "error", [MESSAGES.validation_failed]);
      var focusTarget = form.querySelector('[name="' + firstProblem + '"]');
      if (focusTarget) focusTarget.focus();
      return;
    }

    form.dataset.leadBusy = "1";
    if (button) {
      if (!button.dataset.leadLabel)
        button.dataset.leadLabel = button.textContent;
      button.disabled = true;
      button.textContent = "Отправляем…";
    }

    var request = fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "same-origin",
      cache: "no-store",
    });

    request
      .then(function (response) {
        return response
          .json()
          .catch(function () {
            return {};
          })
          .then(function (payload) {
            return { status: response.status, payload: payload };
          });
      })
      .then(function (result) {
        var payload = result.payload || {};

        if (result.status === 200 && payload.ok) {
          onSuccess(form, button, payload);
          return;
        }

        if (payload.fields) {
          Object.keys(payload.fields).forEach(function (field) {
            markField(form, field, payload.fields[field]);
          });
        }

        var text =
          payload.message || MESSAGES[payload.error] || MESSAGES.unknown;
        showStatus(form, "error", errorParts(text));
        restore(form, button);
      })
      .catch(function () {
        showStatus(form, "error", errorParts(MESSAGES.network));
        restore(form, button);
      });
  }

  function restore(form, button) {
    form.dataset.leadBusy = "0";
    if (button) {
      button.disabled = false;
      if (button.dataset.leadLabel)
        button.textContent = button.dataset.leadLabel;
    }
  }

  /** Успех. Только здесь форма очищается — и только после ответа сервера. */
  function onSuccess(form, button, payload) {
    // Номер заявки приходит от сервера и тоже становится текстом, а не
    // разметкой: доверять ответу на слово незачем, если это ничего не стоит.
    var headline = document.createElement("b");
    headline.textContent = "Заявка отправлена.";

    showStatus(form, "success", [
      headline,
      " Перезвоним в рабочее время.",
      statusAlt(["Номер заявки: " + (payload.id || "—")]),
    ]);

    form.reset();
    stampStart(form);

    if (button) {
      button.textContent = "Заявка отправлена ✓";
      button.classList.add("is-sent");
    }

    /* Форма снова доступна через несколько секунд: человек может захотеть
       оставить вторую заявку — например, по другому объекту. */
    window.setTimeout(function () {
      if (button) button.classList.remove("is-sent");
      restore(form, button);
      var success = form.querySelector(".lead-status.is-success");
      if (success) clearStatus(form);
      if (form.dataset.leadCloseModal) {
        var modal = document.getElementById(form.dataset.leadCloseModal);
        if (modal && typeof window.closeModal === "function")
          window.closeModal(form.dataset.leadCloseModal);
      }
    }, 6000);

    form.dispatchEvent(
      new CustomEvent("lead:sent", { detail: payload, bubbles: true }),
    );
  }

  /* ── Подключение форм ─────────────────────────────────────────────── */

  function enhance(form) {
    if (form.dataset.leadReady === "1") return;
    form.dataset.leadReady = "1";

    stampStart(form);
    form.dataset.leadBusy = "0";

    form.setAttribute("novalidate", "novalidate");

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      submit(form);
    });

    /* Ошибка поля снимается, как только человек начал его исправлять. */
    form.addEventListener("input", function (event) {
      var field = event.target;
      if (field.classList && field.classList.contains("is-invalid")) {
        field.classList.remove("is-invalid");
        field.removeAttribute("aria-invalid");
        var hint = field.parentNode.querySelector(".field-error");
        if (hint) hint.remove();
      }
    });
  }

  function init() {
    document.querySelectorAll("form[data-lead-form]").forEach(enhance);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.LeadForm = {
    /** Регистрирует сборщик дополнительных полей для формы с этим ключом. */
    setCollector: function (source, fn) {
      collectors[source] = fn;
    },
    enhance: enhance,
    endpoint: ENDPOINT,
  };
})();
