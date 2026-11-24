# GreenKey

Сайт строительной компании «Зелёный ключ».

## Стек

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Three.js + GSAP для отдельной 3D-сцены строительства

## Запуск

```bash
npm install
npm run dev
```

Открой `http://localhost:3000`.

## Команды

```bash
npm run typecheck
npm run lint
npm run build
npm run start
```

## Маршруты

- `/` - главная страница.
- `/calculator` - калькулятор комплектации и стоимости дома.
- `/gallery` - объекты и фотоотчёты строительства.
- `/privacy` - политика конфиденциальности.

Старые `.html` адреса перенаправляются на соответствующие маршруты Next.js.

## Архитектура

- `app/` - маршруты, metadata, API и системные route-файлы Next.js.
- `src/pages/` - страницы и их UI.
- `src/shared/` - UI Kit, общие компоненты и хуки.
- `src/widgets/` - Header, Footer и плавающая кнопка звонка.
- `src/features/lead/` - серверная логика обработки заявок.
- `public/assets/` - изображения, видео и ресурсы 3D-сцены.

Подробные правила и карта проекта: `src/docs/architecture.md`.

## Заявки

Приём заявок выключен по умолчанию. API `/api/send-lead` отвечает `503 disabled`, пока не настроен SMTP.

Для локальной настройки:

1. Скопируй `.env.example` в `.env.local`.
2. Заполни SMTP-переменные тестового почтового ящика.
3. Добавь `localhost` в `GREENKEY_LEAD_ALLOWED_HOSTS`.
4. Проверь отправку на тестовом окружении.
5. Только после этого включай `GREENKEY_LEAD_ENABLED=true`.

В production переменные задаются в окружении Node-процесса. Не коммить SMTP-пароль и не включай приём заявок на локальных или preview-копиях с рабочими реквизитами.

## 3D-сцена

Three.js/GSAP загружаются отдельно и лениво только рядом с секцией строительства. SVG fallback остаётся доступен, если устройство слабое или пользователь включил reduced motion.
