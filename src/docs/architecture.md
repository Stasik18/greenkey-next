# Архитектура проекта

## Стек

- Next.js App Router - маршрутизация, серверный рендеринг и сборка.
- React - интерфейс и локальное состояние интерактивных компонентов.
- TypeScript - типы компонентов, моделей и клиентской логики.
- Tailwind CSS - основная система стилизации.
- `clsx` - условная сборка классов.

## Структура

```text
app/                                  # URL, metadata и route handlers
  api/send-lead/                      # API приёма заявок
  calculator/page.tsx                 # /calculator
  gallery/page.tsx                    # /gallery
  privacy/page.tsx                    # /privacy
  page.tsx                            # /
  layout.tsx                          # root layout
  icon.svg                            # favicon по конвенции Next.js
  robots.ts
  sitemap.ts

src/
  pages/
    home/
      model/                          # данные калькулятора и модели главной
      lib/
        build-scene.ts                # генератор SVG fallback
        effects/                      # изолированные эффекты главной
      ui/
        sections/                     # секции главной
        components/                   # формы, калькуляторы, модальные окна
        HomePage.tsx                  # композиция секций
        HomeDialogs.tsx               # состояние и доступность модальных слоёв
        HomePageEffects.tsx           # подключение эффектов
    calculator/
      model/                          # 18 групп опций и типы
      lib/                            # расчёт, форматирование и useCalculator
      ui/
        components/                   # header, база, группы, карточки,
                                      # summary, lead form, mobile bar
        CalculatorPage.tsx            # композиция калькулятора
        calculator.css                # стили только маршрута /calculator
    gallery/
      model/                           # объекты, этапы, фотографии
      lib/                             # подсчёты и построение путей к фото
      ui/
        components/                    # карточки, viewer, lightbox, modal
          viewer/                      # отдельные части просмотра объекта
        hooks/                         # controller, keyboard, focus, swipe
        GalleryPage.tsx                # серверная композиция
        GalleryInteractive.tsx         # интерактивная оболочка
        gallery.css                    # стили только маршрута /gallery
    privacy/
      ui/
        components/                    # смысловые группы разделов политики
        PrivacyPage.tsx                # композиция документа
        privacy.css
  features/lead/                       # валидация, отправка, SMTP, storage
  shared/
    lib/hooks/                         # общие React-хуки
    ui/                                # UI Kit и общие компоненты
  widgets/
    header/
    footer/
    call-button/

public/assets/                         # изображения, видео и 3D-ресурсы
```

## Принципы проектирования

1. `app/` отвечает за URL, metadata и соединение маршрута со страницей. Бизнес-логика и большая разметка остаются в `src/pages`.
2. Страницы и статические части по умолчанию являются Server Components. `use client` применяется только для состояния, событий, эффектов и browser API.
3. Состояние не должно жить в компоненте всей страницы, если его можно ограничить интерактивным блоком. Например, состояние выбора комплектации находится в `useCalculator`, а просмотр галереи управляется `useGalleryController`.
4. UI-компоненты получают данные и callbacks через props. Они не должны самостоятельно искать бизнес-данные в DOM или знать о маршрутах, не относящихся к их задаче.
5. Конфигурации, расчёты и данные вынесены из JSX в `model` и `lib`.
6. Общие компоненты без привязки к бизнес-сценарию находятся в `shared/ui`. Компоненты конкретной страницы остаются внутри её папки.
7. Стили маршрутов вынесены в отдельные CSS-файлы и импортируются route-файлом. Общие токены и reset находятся в `src/app/globals.css`.
8. DOM API допустимы в изолированных эффектах для Canvas/SVG, фокуса, scroll и интеграции 3D. Обычная UI-разметка строится через React.

## Страницы

### Главная `/`

`HomePage` только собирает секции в нужном порядке. Каждая секция находится в отдельном файле. Длинная SVG-геометрия вынесена в `lib/build-scene.ts`, а эффекты разбиты на отдельные модули: видео, частицы, typewriter, scroll progress, reveal, счётчики, process line, pointer effects и preloader.

`HomeDialogs` отвечает за открытие/закрытие модалок и управление фокусом. Разметка формы модалки находится в `HomeLeadModal`. `PriceCalculator` состоит из вкладок, поля площади, блока результата и индивидуального предложения. `ContactsLeadForm` управляет контактными вкладками.

### Калькулятор `/calculator`

`CalculatorPage` собирает отдельные компоненты: `CalculatorHeader`, `BaseConfiguration`, `OptionsGroup`, `CalculatorSummary`, `CalculatorLeadSection` и `CalculatorMobileBar`.

- `model/options.ts` - базовая цена и 18 групп комплектации.
- `model/types.ts` - типы группы и опции.
- `lib/calculator.ts` - чистые функции расчёта, форматирования и подготовки заявки.
- `lib/useCalculator.ts` - React state выбора комплектации, сроков, участка и канала связи.
- `ui/components/OptionCard.tsx` - отдельная карточка опции.

Расчёт стоимости не зависит от разметки и может тестироваться отдельно.

### Галерея `/gallery`

`GalleryPage` остаётся Server Component. Заголовок и пояснение рендерятся на сервере. Клиентская часть разделена на:

- `GalleryHouseGrid` - карточки объектов.
- `HouseViewer` - композиция просмотра одного объекта.
- `ViewerBar`, `ViewerHero`, `HouseFacts`, `ProjectGallery`, `ConstructionTimeline`, `ConstructionStage`, `ViewerCallToAction` - самостоятельные части viewer.
- `PhotoLightbox` - полноэкранный просмотр фото.
- `GalleryCallModal` - форма обратного звонка.
- `useGalleryController` - состояние и действия.
- `useGalleryKeyboard` - Escape и стрелки.
- `useGalleryLayerAccessibility` - inert-фон и focus trap.
- `useLightboxSwipe` - свайп фотографий.

Данные объектов и этапов находятся в `model/gallery-data.ts`; функции подготовки групп фотографий - в `lib/gallery-utils.ts`. Миниатюры используют готовые `-t.webp`. В длинном timeline применяется `content-visibility: auto`.

### Политика `/privacy`

`PrivacyPage` собирает четыре смысловые группы: сведения об операторе и целях, состав данных и обработка, передача и хранение, права и защита. Текстовые формулировки вынесены из единого компонента в отдельные компоненты разделов.

## Общие виджеты

- `Header` - навигация, мобильное меню и корректные ссылки на якоря главной.
- `Footer` - общий подвал.
- `CallButton` - плавающая кнопка звонка, скрывается у подвала.

## 3D-сцена

Three.js и GSAP остаются отдельным графическим движком в `public/assets/js/build3d` и `public/assets/vendor`. Он загружается лениво рядом с секцией строительства. React управляет SVG fallback и передаёт управление 3D-сцене после события `build:3d-ready`. Переписывать графический движок на React не требуется: это не UI-компонент.

## Маршрутизация

- `/` - главная.
- `/calculator` - калькулятор.
- `/gallery` - галерея.
- `/privacy` - политика.

Ссылки из Header на якоря главной учитывают текущий pathname. На внутренних страницах `#about` становится `/#about`.

Старые адреса `/index.html`, `/calculator.html`, `/gallery.html` и `/privacy.html` перенаправляются на новые маршруты постоянным redirect 308.

## Формы и backend

Все формы используют общий `LeadForm` и отправляют JSON на `/api/send-lead`. Route Handler вызывает `src/features/lead/lib/handler.ts`, где находятся проверки Origin, размера тела, honeypot, времени заполнения, белый список форм, валидация, rate limit, дедупликация и формирование письма.

Приём заявок по умолчанию выключен через `GREENKEY_LEAD_ENABLED=false`, как и в исходном PHP. SMTP-переменные задаются в `.env.local` или окружении сервера. Секреты нельзя коммитить. При serverless или нескольких Node-инстансах локальные файлы лимитов и дедупликации следует заменить общим Redis/DB-хранилищем.
