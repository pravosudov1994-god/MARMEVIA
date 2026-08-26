(() => {
  const MAX_FILES = 6;
  const MAX_FILE_BYTES = 10 * 1024 * 1024;

  function initLeadForm() {
    const form = document.querySelector('#estimate-form');
    if (!form) return;

    const intro = document.querySelector('#estimate .estimate-grid > div > p:not(.eyebrow)');
    if (intro) {
      intro.textContent = 'Пришлите несколько фотографий поверхности и кратко опишите задачу. Заявка отправится напрямую мастеру MARMEVIA — переходить в мессенджер не потребуется.';
    }

    const footerAction = document.querySelector('#wa-footer');
    if (footerAction) {
      footerAction.textContent = 'Оценка по фото';
      footerAction.href = '#estimate';
    }

    const mobileAction = document.querySelector('#wa-mobile');
    if (mobileAction) {
      mobileAction.textContent = 'Оценка';
      mobileAction.href = '#estimate';
    }

    if (!form.querySelector('input[name="website"]')) {
      const honeypot = document.createElement('input');
      honeypot.type = 'text';
      honeypot.name = 'website';
      honeypot.tabIndex = -1;
      honeypot.autocomplete = 'off';
      honeypot.setAttribute('aria-hidden', 'true');
      honeypot.style.position = 'absolute';
      honeypot.style.left = '-9999px';
      honeypot.style.width = '1px';
      honeypot.style.height = '1px';
      form.appendChild(honeypot);
    }

    const fileInput = form.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.setAttribute('accept', 'image/*');
    }

    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton?.textContent || 'Получить оценку';

    const status = document.createElement('div');
    status.className = 'lead-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    if (submitButton) submitButton.insertAdjacentElement('afterend', status);
    else form.appendChild(status);

    const style = document.createElement('style');
    style.textContent = `
      .lead-status{grid-column:1/-1;min-height:0;font-size:13px;line-height:1.5;margin-top:-2px}
      .lead-status.success{padding:12px 14px;border:1px solid rgba(99,135,92,.28);background:rgba(99,135,92,.08);border-radius:10px;color:#40513d}
      .lead-status.error{padding:12px 14px;border:1px solid rgba(155,76,60,.25);background:rgba(155,76,60,.07);border-radius:10px;color:#7a3e34}
      .estimate-form button[disabled]{opacity:.72;cursor:wait}
    `;
    document.head.appendChild(style);

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();

      if (!form.reportValidity()) return;

      status.className = 'lead-status';
      status.textContent = '';

      const files = Array.from(fileInput?.files || []);
      if (files.length > MAX_FILES) {
        status.className = 'lead-status error';
        status.textContent = `Можно отправить не более ${MAX_FILES} фотографий за одну заявку.`;
        return;
      }

      const oversized = files.find((file) => file.size > MAX_FILE_BYTES);
      if (oversized) {
        status.className = 'lead-status error';
        status.textContent = `Файл «${oversized.name}» больше 10 МБ. Уменьшите его или выберите другую фотографию.`;
        return;
      }

      const data = new FormData(form);
      const price = document.querySelector('#price')?.textContent?.trim() || 'не выполнялся';
      const summary = document.querySelector('#calc-summary')?.textContent?.trim() || '';
      data.set('calculation', `${price}${summary ? ` · ${summary}` : ''}`);
      data.set('source', window.location.href);

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Отправляем…';
      }

      try {
        const response = await fetch('/api/lead', {
          method: 'POST',
          body: data,
          headers: { 'accept': 'application/json' }
        });

        const payload = await response.json().catch(() => ({}));
        if (!response.ok || !payload.ok) {
          throw new Error(payload.error || `http_${response.status}`);
        }

        form.reset();
        status.className = 'lead-status success';
        status.textContent = 'Спасибо. Заявка отправлена мастеру MARMEVIA. Мы свяжемся с вами по указанному телефону.';
      } catch (error) {
        console.error('MARMEVIA lead error', error);
        status.className = 'lead-status error';
        status.innerHTML = 'Не удалось отправить заявку. Позвоните нам: <a href="tel:+79775684264"><strong>+7 (977) 568-42-64</strong></a>.';
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
        }
      }
    }, { capture: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLeadForm, { once: true });
  } else {
    initLeadForm();
  }
})();
