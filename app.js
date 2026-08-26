const PHONE = '79775684264';
const waBase = `https://wa.me/${PHONE}`;

const menuButton = document.querySelector('.menu-button');
const mobileMenu = document.querySelector('.mobile-menu');
menuButton?.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  mobileMenu.classList.remove('open'); menuButton.setAttribute('aria-expanded','false');
}));

const services = {
  marble: [
    {id:'clean', name:'Глубокая очистка', unit:'m²', base:1500, local:false},
    {id:'polish', name:'Полировка / восстановление блеска', unit:'m²', base:1800, local:false},
    {id:'grind', name:'Шлифовка и полировка', unit:'m²', base:2800, local:false},
    {id:'restore', name:'Комплексная реставрация', unit:'m²', base:4500, local:false},
    {id:'post', name:'Послемонтажное восстановление', unit:'m²', base:5000, local:false},
    {id:'protect', name:'Защитная обработка', unit:'m²', base:500, local:false},
    {id:'joints', name:'Восстановление швов', unit:'m²', base:1000, local:false},
    {id:'stain', name:'Удаление пятен', unit:'зона', base:6000, local:true},
    {id:'rust', name:'Удаление ржавчины', unit:'зона', base:8000, local:true},
    {id:'etch', name:'Химическое повреждение / травление', unit:'зона', base:5000, local:true},
    {id:'chip', name:'Ремонт скола', unit:'шт.', base:3500, local:true},
    {id:'crack', name:'Ремонт трещины', unit:'шт.', base:5000, local:true},
    {id:'pit', name:'Выбоина / глубокое повреждение', unit:'шт.', base:5000, local:true}
  ],
  porcelain: [
    {id:'clean', name:'Глубокая очистка', unit:'m²', base:1200, local:false},
    {id:'construction', name:'Удаление строительных загрязнений', unit:'m²', base:1500, local:false},
    {id:'restore', name:'Восстановительная обработка', unit:'m²', base:1500, local:false},
    {id:'joints', name:'Обработка швов', unit:'m²', base:900, local:false},
    {id:'chip', name:'Ремонт скола', unit:'шт.', base:4000, local:true},
    {id:'crack', name:'Ремонт трещины', unit:'шт.', base:5000, local:true}
  ]
};
const objects = [
  ['floor','Пол / большой холл',1,'m²'], ['walls','Стены',1.4,'m²'], ['bath','Ванная комната',1.5,'m²'], ['shower','Душевая зона',1.6,'m²'],
  ['stairs','Лестница / ступени',1.5,'шт.'], ['counter','Столешница',1.5,'пог. м'], ['island','Кухонный остров',1.6,'пог. м'], ['sill','Подоконник',1.4,'пог. м'],
  ['entry','Входная группа',1.4,'м²'], ['other','Другое',1.2,'м²']
];
const condition = {light:1, medium:1.15, hard:1.35, unknown:1.15};
const conditionNames = {light:'лёгкое', medium:'среднее', hard:'сложное', unknown:'не определено'};
function volumeFactor(n){ if(n<=15)return 1; if(n<=50)return .95; if(n<=100)return .90; if(n<=300)return .85; if(n<=1000)return .80; return .78; }
function money(n){ return Math.ceil(n/1000)*1000; }

const materialEl = document.querySelector('#material');
const serviceEl = document.querySelector('#service');
const objectEl = document.querySelector('#object');
const amountEl = document.querySelector('#amount');
const amountLabel = document.querySelector('#amount-label');
const conditionEl = document.querySelector('#condition');
const priceEl = document.querySelector('#price');
const summaryEl = document.querySelector('#calc-summary');

function populateObjects(){
  objectEl.innerHTML = objects.map(([id,name])=>`<option value="${id}">${name}</option>`).join('');
}
function populateServices(){
  serviceEl.innerHTML = services[materialEl.value].map(s=>`<option value="${s.id}">${s.name}</option>`).join('');
  updateUnit(); calculate();
}
function currentService(){ return services[materialEl.value].find(s=>s.id===serviceEl.value) || services[materialEl.value][0]; }
function currentObject(){ return objects.find(o=>o[0]===objectEl.value) || objects[0]; }
function updateUnit(){
  const s=currentService(); const o=currentObject();
  const unit = s.local ? s.unit : o[3];
  amountLabel.textContent = `4. ${unit==='m²'?'Площадь':unit==='пог. м'?'Длина':'Количество'}, ${unit}`;
  amountEl.min=1; amountEl.max=5000;
}
function calculate(){
  const s=currentService(), o=currentObject(), n=Math.max(1,Number(amountEl.value)||1), c=condition[conditionEl.value]||1;
  let total;
  if(s.local){ total=s.base*n*c; }
  else { total=s.base*n*o[2]*c*volumeFactor(n); }
  total=Math.max(15000,money(total));
  const mat=materialEl.value==='marble'?'Мрамор':'Керамогранит';
  priceEl.textContent=`от ${total.toLocaleString('ru-RU')} ₽`;
  summaryEl.textContent=`${mat} · ${s.name} · ${n} ${s.local?s.unit:o[3]} · состояние: ${conditionNames[conditionEl.value]}`;
}
materialEl?.addEventListener('change',populateServices); serviceEl?.addEventListener('change',()=>{updateUnit();calculate()}); objectEl?.addEventListener('change',()=>{updateUnit();calculate()}); amountEl?.addEventListener('input',calculate); conditionEl?.addEventListener('change',calculate);
populateObjects(); populateServices();

function waLink(text){ return `${waBase}?text=${encodeURIComponent(text)}`; }
document.querySelector('#wa-footer').href = waLink('Здравствуйте! Хочу проконсультироваться по реставрации мрамора.');
document.querySelector('#wa-mobile').href = waLink('Здравствуйте! Хочу получить оценку работ MARMEVIA.');

const form = document.querySelector('#estimate-form');
form?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const data=new FormData(form);
  const fileCount=[...form.querySelector('input[type=file]').files].length;
  const text=[
    'Здравствуйте! Заявка с сайта MARMEVIA.',
    `Имя: ${data.get('name')}`,
    `Телефон: ${data.get('phone')}`,
    `Материал: ${data.get('material')}`,
    data.get('message') ? `Задача: ${data.get('message')}` : '',
    fileCount ? `Выбрано фотографий: ${fileCount}. Прикреплю их в WhatsApp.` : '',
    `Расчёт калькулятора: ${priceEl.textContent}. ${summaryEl.textContent}`
  ].filter(Boolean).join('\n');
  window.open(waLink(text),'_blank','noopener');
});
