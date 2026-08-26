const polishStylesheet = document.createElement('link');
polishStylesheet.rel = 'stylesheet';
polishStylesheet.href = 'mobile-polish.css?v=2';
document.head.appendChild(polishStylesheet);

const PHONE = '79775684264';
const waBase = `https://wa.me/${PHONE}`;

const menuButton = document.querySelector('.menu-button');
const mobileMenu = document.querySelector('.mobile-menu');

function closeMenu() {
  if (!mobileMenu || !menuButton) return;
  mobileMenu.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}

menuButton?.addEventListener('click', () => {
  const open = mobileMenu?.classList.toggle('open') ?? false;
  menuButton.setAttribute('aria-expanded', String(open));
});

mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

const services = {
  marble: [
    { id: 'clean', name: 'Глубокая очистка', unit: 'м²', base: 1500 },
    { id: 'polish', name: 'Полировка / восстановление блеска', unit: 'м²', base: 1800 },
    { id: 'grind', name: 'Шлифовка и полировка', unit: 'м²', base: 2800 },
    { id: 'restore', name: 'Комплексная реставрация', unit: 'м²', base: 4500 },
    { id: 'post', name: 'Послемонтажное восстановление', unit: 'м²', base: 5000 },
    { id: 'protect', name: 'Защитная обработка', unit: 'м²', base: 500 },
    { id: 'joints', name: 'Восстановление швов', unit: 'м²', base: 1000 },
    { id: 'stain', name: 'Удаление пятен', unit: 'зона', base: 6000, local: true },
    { id: 'rust', name: 'Удаление ржавчины', unit: 'зона', base: 8000, local: true },
    { id: 'etch', name: 'Восстановление после химического повреждения', unit: 'зона', base: 5000, local: true },
    { id: 'chip', name: 'Ремонт скола', unit: 'шт.', base: 3500, local: true },
    { id: 'crack', name: 'Ремонт трещины', unit: 'шт.', base: 5000, local: true },
    { id: 'pit', name: 'Выбоина / глубокое повреждение', unit: 'шт.', base: 5000, local: true },
    { id: 'unknown', name: 'Не знаю, что требуется', quoteOnly: true }
  ],
  porcelain: [
    { id: 'clean', name: 'Глубокая очистка', unit: 'м²', base: 1200 },
    { id: 'construction', name: 'Удаление строительных загрязнений', unit: 'м²', base: 1500 },
    { id: 'restore', name: 'Восстановительная обработка', unit: 'м²', base: 1500 },
    { id: 'joints', name: 'Восстановление / обработка швов', unit: 'м²', base: 900 },
    { id: 'chip', name: 'Ремонт скола', unit: 'шт.', base: 4000, local: true },
    { id: 'crack', name: 'Ремонт трещины', unit: 'шт.', base: 5000, local: true },
    { id: 'polish', name: 'Полировка — после диагностики поверхности', quoteOnly: true },
    { id: 'unknown', name: 'Не знаю, что требуется', quoteOnly: true }
  ]
};

const objects = [
  { id: 'floor', name: 'Пол / большой холл', factor: 1, unit: 'м²' },
  { id: 'walls', name: 'Стены', factor: 1.4, unit: 'м²' },
  { id: 'bath', name: 'Ванная комната', factor: 1.5, unit: 'м²' },
  { id: 'shower', name: 'Душевая зона', factor: 1.6, unit: 'м²' },
  { id: 'stairs', name: 'Лестница / ступени', factor: 1.5, unit: 'шт.' },
  { id: 'counter', name: 'Столешница', factor: 1.5, unit: 'пог. м' },
  { id: 'island', name: 'Кухонный остров', factor: 1.6, unit: 'пог. м' },
  { id: 'sill', name: 'Подоконник', factor: 1.4, unit: 'пог. м' },
  { id: 'entry', name: 'Входная группа', factor: 1.4, unit: 'м²' },
  { id: 'fireplace', name: 'Камин', quoteOnly: true, unit: 'шт.' },
  { id: 'column', name: 'Колонна', quoteOnly: true, unit: 'шт.' },
  { id: 'decor', name: 'Декоративный элемент', quoteOnly: true, unit: 'шт.' },
  { id: 'other', name: 'Другое', quoteOnly: true, unit: 'шт.' }
];

const condition = { light: 1, medium: 1.15, hard: 1.35, unknown: 1.15 };
const conditionNames = {
  light: 'лёгкое',
  medium: 'среднее',
  hard: 'сложное',
  unknown: 'не определено'
};

function volumeFactor(n) {
  if (n <= 15) return 1;
  if (n <= 50) return 0.95;
  if (n <= 100) return 0.90;
  if (n <= 300) return 0.85;
  if (n <= 1000) return 0.80;
  return null;
}

function money(n) {
  return Math.ceil(n / 1000) * 1000;
}

const materialEl = document.querySelector('#material');
const serviceEl = document.querySelector('#service');
const objectEl = document.querySelector('#object');
const amountEl = document.querySelector('#amount');
const amountLabel = document.querySelector('#amount-label');
const conditionEl = document.querySelector('#condition');
const priceEl = document.querySelector('#price');
const summaryEl = document.querySelector('#calc-summary');

function currentService() {
  return services[materialEl?.value]?.find((service) => service.id === serviceEl?.value) || services.marble[0];
}

function currentObject() {
  return objects.find((object) => object.id === objectEl?.value) || objects[0];
}

function populateObjects() {
  if (!objectEl) return;
  objectEl.innerHTML = objects.map((object) => `<option value="${object.id}">${object.name}</option>`).join('');
}

function populateServices() {
  if (!serviceEl || !materialEl) return;
  serviceEl.innerHTML = services[materialEl.value]
    .map((service) => `<option value="${service.id}">${service.name}</option>`)
    .join('');
  updateUnit();
  calculate();
}

function displayUnit(service, object) {
  if (service.local) return service.unit;
  return object.unit || service.unit || 'м²';
}

function updateUnit() {
  if (!amountLabel || !amountEl) return;
  const service = currentService();
  const object = currentObject();
  const unit = displayUnit(service, object);

  const label = unit === 'м²' ? 'Площадь' : unit === 'пог. м' ? 'Длина' : 'Количество';
  amountLabel.textContent = `4. ${label}, ${unit}`;
  amountEl.min = '1';
  amountEl.max = '5000';
}

function calculate() {
  if (!materialEl || !amountEl || !conditionEl || !priceEl || !summaryEl) return;

  const service = currentService();
  const object = currentObject();
  const rawAmount = Number(amountEl.value) || 1;
  const amount = Math.min(5000, Math.max(1, rawAmount));
  const difficulty = condition[conditionEl.value] || 1;
  const materialName = materialEl.value === 'marble' ? 'Мрамор' : 'Керамогранит';
  const unit = displayUnit(service, object);
  const summary = `${materialName} · ${service.name} · ${object.name} · ${amount} ${unit} · состояние: ${conditionNames[conditionEl.value]}`;

  const tooLargeForAutoQuote = !service.local && unit === 'м²' && amount > 1000;
  if (service.quoteOnly || object.quoteOnly || tooLargeForAutoQuote) {
    priceEl.textContent = 'после оценки по фото';
    summaryEl.textContent = summary;
    return;
  }

  let total;
  if (service.local) {
    total = service.base * amount * difficulty;
  } else {
    const volume = unit === 'м²' ? volumeFactor(amount) : 1;
    total = service.base * amount * object.factor * difficulty * (volume ?? 1);
  }

  total = Math.max(15000, money(total));
  priceEl.textContent = `от ${total.toLocaleString('ru-RU')} ₽`;
  summaryEl.textContent = summary;
}

materialEl?.addEventListener('change', populateServices);
serviceEl?.addEventListener('change', () => {
  updateUnit();
  calculate();
});
objectEl?.addEventListener('change', () => {
  updateUnit();
  calculate();
});
amountEl?.addEventListener('input', calculate);
amountEl?.addEventListener('blur', () => {
  const value = Math.min(5000, Math.max(1, Number(amountEl.value) || 1));
  amountEl.value = String(value);
  calculate();
});
conditionEl?.addEventListener('change', calculate);

populateObjects();
populateServices();

function waLink(text) {
  return `${waBase}?text=${encodeURIComponent(text)}`;
}

const waFooter = document.querySelector('#wa-footer');
const waMobile = document.querySelector('#wa-mobile');
if (waFooter) waFooter.href = waLink('Здравствуйте! Хочу проконсультироваться по реставрации мрамора.');
if (waMobile) waMobile.href = waLink('Здравствуйте! Хочу получить оценку работ MARMEVIA.');

const form = document.querySelector('#estimate-form');
form?.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!form.reportValidity()) return;

  const data = new FormData(form);
  const fileInput = form.querySelector('input[type=file]');
  const fileCount = fileInput?.files?.length || 0;
  const text = [
    'Здравствуйте! Заявка с сайта MARMEVIA.',
    `Имя: ${data.get('name')}`,
    `Телефон: ${data.get('phone')}`,
    `Материал: ${data.get('material')}`,
    data.get('message') ? `Задача: ${data.get('message')}` : '',
    fileCount ? `Выбрано фотографий: ${fileCount}. Прикреплю их в WhatsApp.` : '',
    `Расчёт калькулятора: ${priceEl?.textContent || 'не выполнялся'}. ${summaryEl?.textContent || ''}`
  ].filter(Boolean).join('\n');

  window.location.href = waLink(text);
});
