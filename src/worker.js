const TELEGRAM_CHAT_ID = '-5542654432';
const MAX_FILES = 6;
const MAX_FILE_BYTES = 10 * 1024 * 1024;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
      'referrer-policy': 'strict-origin-when-cross-origin'
    }
  });
}

function clean(value, max = 1500) {
  return String(value ?? '').replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, max);
}

async function telegramCall(token, method, body) {
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    body,
    headers: body instanceof FormData ? undefined : { 'content-type': 'application/json' }
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload?.ok) {
    throw new Error(`Telegram ${method} failed: ${response.status}`);
  }
  return payload.result;
}

async function sendLead(request, env) {
  if (!env.TELEGRAM_BOT_TOKEN) {
    return json({ ok: false, error: 'telegram_not_configured' }, 503);
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, error: 'invalid_form' }, 400);
  }

  if (clean(form.get('website'), 200)) {
    return json({ ok: true });
  }

  const name = clean(form.get('name'), 120);
  const phone = clean(form.get('phone'), 80);
  const material = clean(form.get('material'), 120);
  const message = clean(form.get('message'), 1800);
  const calculation = clean(form.get('calculation'), 700);
  const source = clean(form.get('source'), 300) || 'marmevia.ru';

  if (!name || !phone) {
    return json({ ok: false, error: 'name_and_phone_required' }, 400);
  }

  const text = [
    '🔔 Новая заявка MARMEVIA',
    '',
    `Имя: ${name}`,
    `Телефон: ${phone}`,
    material ? `Материал: ${material}` : '',
    message ? `Задача: ${message}` : '',
    calculation ? `Расчёт: ${calculation}` : '',
    `Источник: ${source}`
  ].filter(Boolean).join('\n');

  try {
    await telegramCall(env.TELEGRAM_BOT_TOKEN, 'sendMessage', JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text,
      disable_web_page_preview: true
    }));
  } catch {
    return json({ ok: false, error: 'telegram_send_failed' }, 502);
  }

  const files = form.getAll('photos')
    .filter((item) => item instanceof File && item.size > 0)
    .slice(0, MAX_FILES);

  let sentFiles = 0;
  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    if (file.size > MAX_FILE_BYTES) continue;

    const media = new FormData();
    media.append('chat_id', TELEGRAM_CHAT_ID);
    media.append('caption', `MARMEVIA · фото ${i + 1}/${files.length} · ${name}`);
    media.append('document', file, file.name || `photo-${i + 1}`);

    try {
      await telegramCall(env.TELEGRAM_BOT_TOKEN, 'sendDocument', media);
      sentFiles += 1;
    } catch {
      // Текстовая заявка уже доставлена; ошибка одного вложения не должна
      // заставлять клиента повторно отправлять всю форму.
    }
  }

  return json({ ok: true, sentFiles });
}

class BodyInjector {
  element(element) {
    element.append(`
      <style id="marmevia-process-mobile-fix">
        @media (max-width: 720px) {
          #process .steps {
            display: grid !important;
            grid-template-columns: 1fr !important;
            gap: 0 !important;
            position: relative !important;
          }
          #process .steps article {
            display: grid !important;
            grid-template-columns: 48px minmax(0, 1fr) !important;
            grid-template-areas:
              "num title"
              "num text" !important;
            column-gap: 14px !important;
            row-gap: 6px !important;
            align-items: start !important;
            min-height: 0 !important;
            padding: 22px 0 !important;
            border-left: 0 !important;
            border-bottom: 1px solid rgba(116, 89, 53, .18) !important;
          }
          #process .steps article:last-child {
            border-bottom: 0 !important;
          }
          #process .steps article > b {
            grid-area: num !important;
            position: static !important;
            display: block !important;
            margin: 2px 0 0 !important;
            padding: 0 !important;
            color: #b88742 !important;
            font-family: var(--serif) !important;
            font-size: 24px !important;
            line-height: 1 !important;
          }
          #process .steps article > h3 {
            grid-area: title !important;
            min-width: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            font-size: 24px !important;
            line-height: 1.08 !important;
            overflow-wrap: normal !important;
            word-break: normal !important;
          }
          #process .steps article > p {
            grid-area: text !important;
            min-width: 0 !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            font-size: 13px !important;
            line-height: 1.55 !important;
            color: var(--muted) !important;
            overflow-wrap: normal !important;
            word-break: normal !important;
          }
        }
        @media (max-width: 430px) {
          #process .steps article {
            grid-template-columns: 42px minmax(0, 1fr) !important;
            column-gap: 12px !important;
            padding: 20px 0 !important;
          }
          #process .steps article > h3 { font-size: 22px !important; }
          #process .steps article > p { font-size: 12.5px !important; }
        }
      </style>
      <script src="/visual-refresh.js?v=9" defer></script><script src="/lead.js?v=2" defer></script>
    `, { html: true });
  }
}

class EstimateIntroRewriter {
  element(element) {
    element.setInnerContent('Пришлите несколько фотографий поверхности и кратко опишите задачу. Заявка отправится напрямую мастеру MARMEVIA — переходить в мессенджер не потребуется.');
  }
}

class EstimateLinkRewriter {
  constructor(label) {
    this.label = label;
  }

  element(element) {
    element.setInnerContent(this.label);
    element.setAttribute('href', '#estimate');
    element.removeAttribute('target');
  }
}

async function serveAsset(request, env) {
  const response = await env.ASSETS.fetch(request);
  const contentType = response.headers.get('content-type') || '';

  if (response.ok && contentType.includes('text/html')) {
    return new HTMLRewriter()
      .on('#estimate .estimate-grid > div > p:nth-of-type(2)', new EstimateIntroRewriter())
      .on('#wa-footer', new EstimateLinkRewriter('Оценка по фото'))
      .on('#wa-mobile', new EstimateLinkRewriter('Оценка'))
      .on('body', new BodyInjector())
      .transform(response);
  }

  return response;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/health') {
      return json({ ok: true, telegramConfigured: Boolean(env.TELEGRAM_BOT_TOKEN) });
    }

    if (url.pathname === '/api/lead') {
      if (request.method !== 'POST') {
        return json({ ok: false, error: 'method_not_allowed' }, 405);
      }
      return sendLead(request, env);
    }

    return serveAsset(request, env);
  }
};
