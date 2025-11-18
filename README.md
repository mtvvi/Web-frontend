# Web-frontend — лабораторная работа №6

SPA на React/Vite, в котором внедрены Redux Toolkit для хранения фильтров, адаптивная сетка для трёх страниц, поддержка PWA с сервис-воркером, HTTPS dev-сервер и развёртывание на GitHub Pages + Tauri desktop-шелл.

## Требования к показу

1. **GitHub Pages + mock**: открыть опубликованный билд на телефоне, установить PWA, продемонстрировать оффлайн-режим.
2. **Redux Toolkit**: в PWA применить фильтр, вернуться на главную и обратно — значения фильтров должны сохраниться (используется `filtersSlice`).
3. **Адаптивность**: в DevTools показать переломы сетки:
	- карточки каталога — `repeat(auto-fit, minmax(280px, 1fr))` → 3 колонки ≥1200px, 2 колонки около 900px, 1 колонка <640px;
	- форма фильтров — 4/2/1 колонка (см. `FiltersPanel.css`);
	- карточка детали — сетка info-блоков (см. `ServiceDetail.css`).
4. **Tauri**: на ноутбуке запустить `npm run tauri:dev`, сравнить IP из `ifconfig` и поля `VITE_API_BASE_URL`/`tauri.conf.json`, отредактировать услугу в БД и показать обновление в desktop-клиенте.
5. **HTTPS dev**: включить `mkcert`, открыть `https://<LAN-IP>:3000`, убедиться что service worker активен.

## Быстрый старт

```bash
# 1. Установить зависимости
npm install

# 2. Сконфигурировать переменные окружения
cp .env.example .env.local   # и обновить IP/URL в файле

# 3. HTTPS dev (один раз)
npm exec mkcert create-ca
npm exec mkcert create-cert

# 4. Запустить Vite
npm run dev
```

> Для обычного HTTP можно удалить `mkcert` и выставить `VITE_PUBLIC_PATH=/`.

## Redux Toolkit и фильтры

- Слайс `src/features/filters/filtersSlice.ts` хранит два среза состояния: `form` (значения полей) и `applied` (последний применённый набор). `applyFilters` копирует форму → таким образом при уходе на другую страницу поля остаются заполненными, но запросы уходят только после нажатия кнопки.
- `ServicesPage` читает `applied` через `useAppSelector` и передаёт его на API/`SERVICES_MOCK`. Redux DevTools включается автоматически (конфигурация `configureStore`).

## HTTP-клиент

- Файл `src/api/httpClient.ts` автоматически переключается между `fetch` (web/PWA) и `@tauri-apps/api/http` (desktop) → нет CORS даже при обращении по IP.
- Базовые URL’ы задаются переменными:
	- `VITE_API_URL` — dev-прокси для Vite (`vite.config.ts`), указываем `https://<LAN-IP>:8080`.
	- `VITE_API_BASE_URL` — прямой HTTPS-адрес API (`https://172.20.10.14:8080/api`).
	- `VITE_STORAGE_BASE_URL` — HTTPS-адрес MinIO/статических изображений.
	- `VITE_ENABLE_PWA_DEV` — включает сервис-воркер в `npm run dev` (по умолчанию `false`, чтобы не получать ворнинги в консоли).

## Адаптивная вёрстка

Три страницы переведены на адаптивные сетки:

| Страница | Колонки/брейкпоинты | Файл |
|----------|---------------------|------|
| Список услуг | `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))`; фильтры — 4→2→1 колонки (`1200px/640px`). | `ServicesPage.css`, `FiltersPanel.css` |
| Главная | Grid из текста + карточек, `clamp` типографика. | `Home.css` |
| Детальная карточка | Контейнер на 100% ширины, info-блоки auto-fit. | `ServiceDetail.css` |

## PWA + HTTPS

Используется `vite-plugin-pwa`:

- `vite.config.ts`: `VitePWA` (autoUpdate, devOptions.enabled) + манифест и иконки `public/icons/pwa-*`.
- Runtime caching: `NetworkFirst` для REST (`VITE_API_BASE_URL`) и `CacheFirst` для изображений (`VITE_STORAGE_BASE_URL`). После одного успешного запроса каталог и карточки подгружаются оффлайн.
- Dev service worker отключён по умолчанию, чтобы не ловить ворнинги от `vite-plugin-pwa`. Для отладки можно выставить `VITE_ENABLE_PWA_DEV=true` и перезапустить `npm run dev`.
- `src/main.tsx`: `registerSW` + Github Pages redirect fix.
- Запуск HTTPS: `vite-plugin-mkcert` + `server.https = true`. Макет сертификатов создаётся командами `npm exec mkcert create-ca` и `create-cert` (см. методичку).
- Проверка: Chrome → Application → Manifest + Service Worker; кнопка *Install App* должна появиться.

## GitHub Pages деплой

1. Убедитесь, что `VITE_PUBLIC_PATH` совпадает с названием репозитория GitHub Pages. Для `https://mtvvi.github.io/Web-frontend/` это `/Web-frontend/`. Измените значение в `.env.local` **до** запуска сборки.
2. Роутер переведён на `HashRouter` (как в примере) + кастомный `404.html`, поэтому прямые ссылки вида `https://mtvvi.github.io/Web-frontend/#/services` или `https://mtvvi.github.io/Web-frontend/#/services/1` открываются без перезагрузок и работают даже при F5. GitHub отдаёт 404 только если убрать сегмент `/Web-frontend/`, т.к. проект размещён в подпапке.
3. Соберите и переопубликуйте билд (пересоздаст корректные пути `/Web-frontend/...`):
	```bash
	npm run build
	npm run deploy
	```
4. SPA fallback — `public/404.html` принудительно отправляет на `/Web-frontend/` и кладёт исходный путь в `sessionStorage`, а `src/main.tsx` подхватывает его, выставляя `window.location.hash` до монтирования `HashRouter`.

## Пошаговый сценарий демонстрации (RU)

1. **Backend + БД**
	- `cd Web-backend && docker compose up -d` — поднимаем Postgres, Redis и MinIO.
	- Проверяем, что API слушает `:8080`, а MinIO — `:9000`, и что хост ноутбука в сети имеет IP `172.20.10.14` (или другой, который прописываем в `.env`).
2. **Настройка фронта**
	- `cd Web-frontend && cp .env.example .env.local` → обновляем IP во всех `VITE_*` на актуальный.
	- Один раз генерируем сертификаты `npm exec mkcert create-ca && npm exec mkcert create-cert`.
	- Запускаем `npm run dev` и открываем `https://172.20.10.14:3000` с ноутбука; предупреждение о сертификате подтверждаем.
3. **Redux + фильтры**
	- На вкладке «Услуги» применяем фильтр по цене, уходим на главную и возвращаемся: значения формы сохранены благодаря `filtersSlice`.
	- В DevTools → Redux можно показать экшн `filters/applyFilters`.
4. **PWA и оффлайн**
	- Собираем prod-бандл `npm run build` и проверяем локально `npm run preview -- --host 0.0.0.0 --https` (mkcert уже создан).
	- На телефоне открываем `https://172.20.10.14:4173`, нажимаем *Добавить на экран*, после установки выключаем Wi-Fi — список услуг и детали продолжают открываться из Workbox-кэша.
	- Если нужен сервис-воркер прямо в `npm run dev`, временно ставим `VITE_ENABLE_PWA_DEV=true` и перезапускаем dev-сервер.
5. **GitHub Pages**
	- Перед деплоем ставим правильный `VITE_PUBLIC_PATH`, выполняем `npm run deploy`, проверяем `https://<username>.github.io/restinpeace/` на телефоне.
6. **Tauri**
	- `npm run tauri:dev` — окно открывается поверх HTTPS dev-сервера.
	- В меню «Навигация» выбираем «Обновить данные» (транслируется событие `desktop:refresh`), затем «Открыть главную».
	- В `tauri.conf.json` IP совпадает с `.env`, благодаря allowlist запросы уходят по HTTPS без CORS.

## Tauri desktop

Файлы лежат в `src-tauri/`.

```bash
# Требуются Rust и Cargo, затем
npm run tauri:dev         # dev shell
npm run tauri:build       # полноценный дистрибутив
```

- `tauri.conf.json` → HTTPS devPath (`https://localhost:3000`) и allowlist для LAN-хоста `https://172.20.10.14:8080/**` + MinIO на `:9000`. Перед показом лабораторной нужно сверить IP с `ifconfig` и обновить файл/`.env` при необходимости.
- `src-tauri/src/main.rs` добавляет нативное меню с событиями `desktop:refresh` и `desktop:navigate-home`. В React-части `useDesktopBridge` слушает эти события и либо перезагружает список услуг, либо возвращает на главную.
- В desktop-сборке HTTP запросы выполняются через `@tauri-apps/api/http`, что позволяет обходить CORS и обращаться к IP ≠ `localhost`.

## Ответы для защиты

- **Flux/Redux**: реализовано хранилище `store/index.ts`, редьюсер `filtersSlice`, `dispatch(updateFilters/applyFilters)` и подключение через `<Provider />`.
- **PWA vs Tauri**: PWA — icon + SW/manifest, устанавливается из браузера; Tauri — нативное окно, HTTP через allowlist, доступ к диалогам/меню.
- **GitHub Pages**: `gh-pages -d dist`, статический билд, AJAX-requests идут на внешний API по HTTPS.
- **Deployment диаграмма**: узлы — GitHub Pages (статический фронтенд + PWA), браузер или Tauri (клиент), backend (REST API + MinIO), БД/Postgres. Между фронтом и API — HTTPS, между API и DB — TCP/Postgres. PWA/Tauri получают статику из Pages/дистрибутива, изображения с MinIO.

## Полезные команды

| Задача | Команда |
|--------|---------|
| Линтер | `npm run lint` |
| HTTPS dev | `npm run dev` (после mkcert) |
| Prod build | `npm run build` |
| Pages deploy | `npm run deploy` |
| Tauri dev | `npm run tauri:dev` |
| Tauri build | `npm run tauri:build` |

## Что показать преподавателю

1. Redux DevTools — действие `filters/applyFilters`.
2. Изменение ширины окна и сворачивание сетки/фильтров.
3. Установку PWA и работу оффлайн.
4. В Tauri: меню → «Обновить данные», IP не `localhost`, отображение новых данных из БД.
5. Статический билд на GitHub Pages, открытый с телефона через HTTPS.


