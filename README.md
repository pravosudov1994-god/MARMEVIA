# MARMEVIA

Экспертное восстановление мрамора в Москве и Московской области.

## Deployment

Проект разворачивается в Cloudflare Workers как Worker + Static Assets.

- Статический сайт: `public/`
- Worker API: `src/worker.js`
- Конфигурация Cloudflare: `wrangler.jsonc`
- Telegram lead endpoint: `POST /api/lead`
- Health endpoint: `GET /api/health`

Для отправки заявок в Telegram необходимо добавить runtime secret `TELEGRAM_BOT_TOKEN` в Cloudflare Dashboard. Секрет не хранится в GitHub.

Получатель заявок: `@motin_group`.
