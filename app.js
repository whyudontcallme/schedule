'use strict';
/* ===== Данные расписания (из твоего сайта) ===== */
const PAIR_TIMES = {1:['09:15','10:50'],2:['11:10','12:45'],3:['13:30','15:05'],4:['15:15','16:50'],5:['17:00','18:35']};
const DAY_NAMES = {1:'Понедельник',2:'Вторник',3:'Среда',4:'Четверг',5:'Пятница'};
const SCHEDULE = {
  1:[
    {pair:1,subject:'Введение в профессиональную деятельность',type:'Лекция',teacher:'Коваленко И.В.',room:'3.033',week:'odd'},
    {pair:2,subject:'Введение в профессиональную деятельность',type:'Практика',teacher:'Коваленко И.В.',room:'3.033',week:'even'},
    {pair:2,subject:'Начертательная геометрия и инженерная графика',type:'Практика',teacher:'Вохмянин Н.А., Вернер Н.Н.',room:'2.210',week:'odd'},
    {pair:3,subject:'Математика',type:'Практика',teacher:'Затенко С.И.',room:'2.414',week:'both'},
    {pair:4,subject:'Физическая культура и спорт',type:'Лекция',teacher:'Курова Н.В.',room:'2а.451',week:'both'},
    {pair:4,subject:'Физическая культура и спорт',type:'Практика',teacher:'Косарева О.В.',room:'Открытый стадион',week:'both'}
  ],
  2:[
    {pair:1,subject:'Математика',type:'Лекция',teacher:'Куликов В.Н.',room:'2.410',week:'both'},
    {pair:2,subject:'Начертательная геометрия и инженерная графика',type:'Практика',teacher:'Вохмянин Н.А., Вернер Н.Н.',room:'2.210',week:'both'},
    {pair:3,subject:'История России',type:'Практика',teacher:'Пеккер И.А.',room:'2.415',week:'both'},
    {pair:4,subject:'История России',type:'Практика',teacher:'Пеккер И.А.',room:'2.415',week:'even'},
    {pair:4,subject:'Основы российской государственности',type:'Лекция',teacher:'Шлапакова С.Н.',room:'1.010',week:'odd'}
  ],
  3:[
    {pair:1,subject:'Иностранный язык',type:'Практика',teacher:'Кузько М.В.',room:'2.414',week:'both'},
    {pair:2,subject:'Физическая культура и спорт',type:'Практика',teacher:'Косарева О.В.',room:'Открытый стадион',week:'both'},
    {pair:3,subject:'Химия',type:'Лабораторная',teacher:'Виграненко Ю.Т., Пузанов А.И.',room:'2.115',week:'odd'},
    {pair:4,subject:'Химия',type:'Лабораторная',teacher:'Виграненко Ю.Т., Пузанов А.И.',room:'2.115',week:'odd'},
    {pair:5,subject:'Экспедиция обучения служением (факультатив)',type:'Практика',teacher:'Шлапакова С.Н.',room:'1.321',week:'odd'}
  ],
  4:[
    {pair:1,subject:'История России',type:'Лекция',teacher:'Пеккер И.А.',room:'2.410',week:'both'},
    {pair:2,subject:'Основы российской государственности',type:'Практика',teacher:'Глушенкова Н.О.',room:'2.419',week:'both'},
    {pair:3,subject:'Информатика и цифровые технологии',type:'Лабораторная',teacher:'Новикова М.А.',room:'1.310',week:'both'},
    {pair:4,subject:'История России',type:'Практика',teacher:'Пеккер И.А.',room:'2.419',week:'both'}
  ],
  5:[
    {pair:1,subject:'Химия',type:'Лекция',teacher:'Виграненко Ю.Т.',room:'2.237',week:'even'},
    {pair:1,subject:'Физика',type:'Лекция',teacher:'Гаврилов С.П.',room:'1.010',week:'odd'},
    {pair:2,subject:'Информатика и цифровые технологии',type:'Лекция',teacher:'Карманов А.Г.',room:'1.231',week:'even'},
    {pair:2,subject:'Начертательная геометрия и инженерная графика',type:'Лекция',teacher:'Вохмянин Н.А.',room:'2.409',week:'odd'},
    {pair:3,subject:'Физика',type:'Практика',teacher:'Гаврилов С.П.',room:'1.026',week:'even'},
    {pair:3,subject:'Ознакомительный практикум',type:'Практика',teacher:'Басова Е.Н.',room:'1.213',week:'odd'},
    {pair:4,subject:'Физика',type:'Лабораторная',teacher:'Гаврилов С.П., Совтус Н.В.',room:'1.025',week:'even'}
  ]
};

/* ===== Утилиты ===== */
const $ = s => document.querySelector(s);
const pad2 = n => String(n).padStart(2,'0');
const toMin = s => { const [h,m]=s.split(':').map(Number); return h*60+m; };
const RU_DOW = ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'];

function getParity(date){
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dow = d.getUTCDay();
  const diffToMon = (dow===0?-6:1-dow);
  const monday = new Date(d); monday.setUTCDate(monday.getUTCDate()+diffToMon);
  const anchor = Date.UTC(2026,7,31); // пн 31.08.2026 — нечётная
  const weeks = Math.round((monday.getTime()-anchor)/86400000/7);
  return (weeks % 2 === 0) ? 'odd' : 'even';
}
const parityName = p => p==='odd' ? 'Нечётная неделя' : 'Чётная неделя';
function dayItems(dow, parity){
  return (SCHEDULE[dow]||[]).filter(x=>x.week==='both'||x.week===parity)
    .sort((a,b)=>a.pair-b.pair || a.subject.localeCompare(b.subject,'ru'));
}
function typeClass(t){
  t=(t||'').toLowerCase();
  if(t.includes('лек')) return 'lec';
  if(t.includes('лаб')) return 'lab';
  return 'prac';
}
function weekTag(w){
  if(w==='both') return 'обе нед.';
  return w==='odd' ? 'нечёт' : 'чёт';
}
function toast(msg){
  const el=$('#toast'); el.textContent=msg; el.classList.add('show');
  clearTimeout(el._t); el._t=setTimeout(()=>el.classList.remove('show'),2200);
}

/* ===== Состояние ===== */
let viewParityOverride = null; // null = авто, иначе odd/even (переключатель в шапке)
let weekMode = 'auto'; // auto|odd|even
const effectiveParity = (d=new Date()) => viewParityOverride || getParity(d);

/* ===== Тема ===== */
function initTheme(){
  const saved = localStorage.getItem('theme');
  if(saved) document.documentElement.dataset.theme = saved;
  else if(matchMedia('(prefers-color-scheme: dark)').matches) document.documentElement.dataset.theme='dark';
  $('#themeBtn').onclick = () => {
    const cur = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = cur;
    localStorage.setItem('theme',cur);
  };
}

/* ===== Рендер карточки пары ===== */
function pairHTML(it, status){
  const [s,e]=PAIR_TIMES[it.pair];
  return `<article class="pair ${status}">
    <div class="pair-time"><b>${s}</b><span>${e}</span></div>
    <div class="pair-num">${it.pair}</div>
    <div class="pair-body">
      <h4>${it.subject}</h4>
      <div class="m">${it.teacher} · ауд. ${it.room}</div>
      <div class="tagrow">
        <span class="tag ${typeClass(it.type)}">${it.type}</span>
        <span class="tag week">${weekTag(it.week)}</span>
      </div>
    </div>
  </article>`;
}
function statusFor(it, nowMin, curKey, nextKey){
  const key = it.pair+'|'+it.subject;
  if(key===curKey) return 'now';
  if(key===nextKey) return '';
  const [,e]=PAIR_TIMES[it.pair];
  return toMin(e)<=nowMin ? 'done' : '';
}
function enrich(items){
  return items.map(it=>({...it, s:PAIR_TIMES[it.pair][0], e:PAIR_TIMES[it.pair][1], sM:toMin(PAIR_TIMES[it.pair][0]), eM:toMin(PAIR_TIMES[it.pair][1])}));
}

/* ===== Главная ===== */
function renderAll(){
  const now = new Date();
  const nowMin = now.getHours()*60+now.getMinutes();
  const parity = effectiveParity(now);
  const dow = now.getDay();

  // шапка
  $('#clock').textContent = `${pad2(now.getHours())}:${pad2(now.getMinutes())}:${pad2(now.getSeconds())}`;
  $('#dateLine').textContent = `${RU_DOW[dow]}, ${now.toLocaleDateString('ru-RU',{day:'numeric',month:'long'})}`;
  $('#parityLine').textContent = parityName(parity) + (viewParityOverride?' (просмотр)':'');
  const pb = $('#parityBtn');
  pb.textContent = (parity==='odd'?'○ Нечётная':'● Чётная') + (viewParityOverride?' · авто ↩':'');
  pb.title = 'Нажми, чтобы посмотреть другую неделю';

  // сегодня
  const items = (dow>=1&&dow<=5) ? enrich(dayItems(dow,parity)) : [];
  let cur=null,next=null;
  for(const it of items){ if(nowMin>=it.sM && nowMin<it.eM){cur=it;break;} }
  if(!cur) next = items.find(it=>it.sM>nowMin) || null;
  const curKey = cur?cur.pair+'|'+cur.subject:null;
  const nextKey = (!cur&&next)?next.pair+'|'+next.subject:null;

  // now-card
  const nc = $('#nowCard');
  if(dow===0||dow===6){
    nc.innerHTML = `<div class="lab">Сегодня</div><h2>Выходной 🎉</h2><div class="meta">Пар нет. Отдыхай — а завтра всё покажем.</div><span class="badge free">выходной</span>`;
  } else if(cur){
    const pct = Math.min(100,Math.max(0,(nowMin-cur.sM)/(cur.eM-cur.sM)*100));
    const left = cur.eM-nowMin;
    nc.innerHTML = `<div class="lab">Сейчас идёт · ${cur.s}–${cur.e}</div>
      <h2>${cur.pair} пара · ${cur.subject}</h2>
      <div class="meta">${cur.teacher} · ауд. ${cur.room} · ${cur.type}</div>
      <div class="progress"><i style="width:${pct.toFixed(1)}%"></i></div>
      <div class="count">До конца ${left} мин</div>
      <span class="badge live">● идёт пара</span>`;
  } else if(next){
    const left = next.sM-nowMin;
    nc.innerHTML = `<div class="lab">Следующая · ${next.s}–${next.e}</div>
      <h2>${next.pair} пара · ${next.subject}</h2>
      <div class="meta">${next.teacher} · ауд. ${next.room} · ${next.type}</div>
      <div class="count">Через ${left} мин</div>
      <span class="badge soon">следующая через ${left} мин</span>`;
  } else if(items.length){
    nc.innerHTML = `<div class="lab">Сегодня</div><h2>Пары закончились ✅</h2><div class="meta">На сегодня всё. Загляни во вкладку «Завтра».</div><span class="badge done">всё прошло</span>`;
  } else {
    nc.innerHTML = `<div class="lab">Сегодня</div><h2>Пар нет</h2><div class="meta">В этот день по ${parityName(parity).toLowerCase()} занятий нет.</div><span class="badge free">нет пар</span>`;
  }

  // stats
  const done = items.filter(i=>i.eM<=nowMin).length;
  $('#stToday').textContent = items.length;
  $('#stLeft').textContent = Math.max(items.length-done,0);
  $('#stNext').textContent = next ? next.s : (cur?cur.e:'—');
  let weekTotal=0; for(let d=1;d<=5;d++) weekTotal+=dayItems(d,parity).length;
  $('#stWeek').textContent = weekTotal;

  // today list
  $('#todayList').innerHTML = items.length
    ? items.map(it=>pairHTML(it,statusFor(it,nowMin,curKey,nextKey))).join('')
    : `<div class="empty">На сегодня пар нет 🎉</div>`;

  renderTomorrow(now);
  renderWeek();
  renderSearch();
}

function renderTomorrow(now){
  const t = new Date(now); t.setDate(t.getDate()+1);
  const parity = effectiveParity(t);
  const dow = t.getDay();
  $('#tomorrowTitle').textContent = `${RU_DOW[dow]}, ${t.toLocaleDateString('ru-RU',{day:'numeric',month:'long'})} · ${parityName(parity)}`;
  const box = $('#tomorrowList');
  if(dow===0||dow===6){ box.innerHTML = `<div class="empty">Завтра выходной 🎉</div>`; return; }
  const items = dayItems(dow,parity);
  box.innerHTML = items.length ? items.map(it=>pairHTML(it,'')).join('') : `<div class="empty">Завтра пар нет</div>`;
}

function renderWeek(){
  document.querySelectorAll('.seg').forEach(b=>b.classList.toggle('active', b.dataset.w===weekMode));
  const now = new Date();
  const parity = weekMode==='auto' ? effectiveParity(now) : weekMode;
  $('#weekList').innerHTML = [1,2,3,4,5].map(d=>{
    const items = dayItems(d,parity);
    const cnt = items.length ? `${items.length} ${plural(items.length,'пара','пары','пар')}` : 'нет пар';
    return `<div class="card week-day"><header><h3>${DAY_NAMES[d]}</h3><small>${cnt}</small></header>
      <div class="body">${items.length?items.map(it=>pairHTML(it,'')).join(''):'<div class="empty">—</div>'}</div></div>`;
  }).join('');
}
const plural=(n,a,b,c)=>{n=Math.abs(n)%100;const d=n%10;if(n>10&&n<20)return c;if(d>1&&d<5)return b;if(d===1)return a;return c;};

function renderSearch(){
  const q = ($('#q').value||'').trim().toLowerCase();
  const box = $('#searchList');
  const all = [];
  for(let d=1;d<=5;d++) for(const it of (SCHEDULE[d]||[]))
    all.push({...it, dow:d, day:DAY_NAMES[d]});
  const f = q ? all.filter(it=>(it.subject+' '+it.teacher+' '+it.room+' '+it.type+' '+it.day).toLowerCase().includes(q)) : all.slice(0,12);
  box.innerHTML = f.length ? f.slice(0,60).map(it=>
    `<article class="pair"><div class="pair-time"><b>${PAIR_TIMES[it.pair][0]}</b><span>${PAIR_TIMES[it.pair][1]}</span></div>
    <div class="pair-num">${it.pair}</div>
    <div class="pair-body"><h4>${it.subject}</h4><div class="m">${it.day} · ${it.teacher} · ауд. ${it.room}</div>
    <div class="tagrow"><span class="tag ${typeClass(it.type)}">${it.type}</span><span class="tag week">${weekTag(it.week)}</span></div></div></article>`
  ).join('') + (f.length>60?`<div class="empty">Показаны первые 60 из ${f.length}. Уточни запрос.</div>`:'')
  : `<div class="empty">Ничего не найдено. Попробуй «Химия», «Пеккер», «2.415».</div>`;
}

/* ===== Навигация ===== */
function switchTab(name){
  document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active',t.dataset.tab===name));
  document.querySelectorAll('.bnav').forEach(t=>t.classList.toggle('active',t.dataset.tab===name));
  document.querySelectorAll('.tabpanel').forEach(p=>p.classList.toggle('active',p.id==='tab-'+name));
  window.scrollTo({top:0,behavior:'smooth'});
}
function initNav(){
  document.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>switchTab(b.dataset.tab)));
  document.querySelectorAll('.seg').forEach(b=>b.addEventListener('click',()=>{weekMode=b.dataset.w;renderWeek();}));
  $('#parityBtn').onclick = () => {
    if(!viewParityOverride) viewParityOverride = getParity(new Date())==='odd'?'even':'odd';
    else viewParityOverride = null;
    renderAll();
    toast(viewParityOverride ? 'Смотришь '+(viewParityOverride==='odd'?'нечётную':'чётную')+' неделю. Нажми ещё раз для авто.' : 'Вернулись в авто-режим');
  };
  $('#openTomorrow').onclick = ()=>switchTab('tomorrow');
  $('#copyToday').onclick = async ()=>{
    const now=new Date(); const parity=effectiveParity(now); const dow=now.getDay();
    const items=(dow>=1&&dow<=5)?dayItems(dow,parity):[];
    const txt = items.length
      ? `${RU_DOW[dow]} · ${parityName(parity)}\n`+items.map(it=>`${PAIR_TIMES[it.pair][0]}–${PAIR_TIMES[it.pair][1]} · ${it.pair} пара · ${it.subject} · ${it.teacher} · ${it.room}`).join('\n')
      : 'Сегодня пар нет 🎉';
    try{ await navigator.clipboard.writeText(txt); toast('День скопирован в буфер'); }
    catch{ toast('Не вышло скопировать'); }
  };
  $('#q').addEventListener('input',renderSearch);
  document.querySelectorAll('.chip').forEach(c=>c.addEventListener('click',()=>{$('#q').value=c.dataset.q;renderSearch();$('#q').focus();}));
}

/* ===== Старт ===== */
initTheme(); initNav(); renderAll();
setInterval(renderAll, 1000*10);
setInterval(()=>{ // часы каждую секунду без полного ререндера
  const n=new Date();
  $('#clock').textContent=`${pad2(n.getHours())}:${pad2(n.getMinutes())}:${pad2(n.getSeconds())}`;
},1000);
