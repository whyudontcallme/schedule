'use strict';
/* ============ ДАННЫЕ ============ */
const PAIR_TIMES={1:['09:15','10:50'],2:['11:10','12:45'],3:['13:30','15:05'],4:['15:15','16:50'],5:['17:00','18:35']};
const DAY_NAMES={1:'Понедельник',2:'Вторник',3:'Среда',4:'Четверг',5:'Пятница'};
const DAY_SHORT={1:'Пн',2:'Вт',3:'Ср',4:'Чт',5:'Пт'};
const SCHEDULE={
1:[{pair:1,subject:'Введение в профессиональную деятельность',type:'Лекция',teacher:'Коваленко И.В.',room:'3.033',week:'odd'},{pair:2,subject:'Введение в профессиональную деятельность',type:'Практика',teacher:'Коваленко И.В.',room:'3.033',week:'even'},{pair:2,subject:'Начертательная геометрия и инженерная графика',type:'Практика',teacher:'Вохмянин Н.А., Вернер Н.Н.',room:'2.210',week:'odd'},{pair:3,subject:'Математика',type:'Практика',teacher:'Затенко С.И.',room:'2.414',week:'both'},{pair:4,subject:'Физическая культура и спорт',type:'Лекция',teacher:'Курова Н.В.',room:'2а.451',week:'both'},{pair:4,subject:'Физическая культура и спорт',type:'Практика',teacher:'Косарева О.В.',room:'Открытый стадион',week:'both'}],
2:[{pair:1,subject:'Математика',type:'Лекция',teacher:'Куликов В.Н.',room:'2.410',week:'both'},{pair:2,subject:'Начертательная геометрия и инженерная графика',type:'Практика',teacher:'Вохмянин Н.А., Вернер Н.Н.',room:'2.210',week:'both'},{pair:3,subject:'История России',type:'Практика',teacher:'Пеккер И.А.',room:'2.415',week:'both'},{pair:4,subject:'История России',type:'Практика',teacher:'Пеккер И.А.',room:'2.415',week:'even'},{pair:4,subject:'Основы российской государственности',type:'Лекция',teacher:'Шлапакова С.Н.',room:'1.010',week:'odd'}],
3:[{pair:1,subject:'Иностранный язык',type:'Практика',teacher:'Кузько М.В.',room:'2.414',week:'both'},{pair:2,subject:'Физическая культура и спорт',type:'Практика',teacher:'Косарева О.В.',room:'Открытый стадион',week:'both'},{pair:3,subject:'Химия',type:'Лабораторная',teacher:'Виграненко Ю.Т., Пузанов А.И.',room:'2.115',week:'odd'},{pair:4,subject:'Химия',type:'Лабораторная',teacher:'Виграненко Ю.Т., Пузанов А.И.',room:'2.115',week:'odd'},{pair:5,subject:'Экспедиция обучения служением (факультатив)',type:'Практика',teacher:'Шлапакова С.Н.',room:'1.321',week:'odd'}],
4:[{pair:1,subject:'История России',type:'Лекция',teacher:'Пеккер И.А.',room:'2.410',week:'both'},{pair:2,subject:'Основы российской государственности',type:'Практика',teacher:'Глушенкова Н.О.',room:'2.419',week:'both'},{pair:3,subject:'Информатика и цифровые технологии',type:'Лабораторная',teacher:'Новикова М.А.',room:'1.310',week:'both'},{pair:4,subject:'История России',type:'Практика',teacher:'Пеккер И.А.',room:'2.419',week:'both'}],
5:[{pair:1,subject:'Химия',type:'Лекция',teacher:'Виграненко Ю.Т.',room:'2.237',week:'even'},{pair:1,subject:'Физика',type:'Лекция',teacher:'Гаврилов С.П.',room:'1.010',week:'odd'},{pair:2,subject:'Информатика и цифровые технологии',type:'Лекция',teacher:'Карманов А.Г.',room:'1.231',week:'even'},{pair:2,subject:'Начертательная геометрия и инженерная графика',type:'Лекция',teacher:'Вохмянин Н.А.',room:'2.409',week:'odd'},{pair:3,subject:'Физика',type:'Практика',teacher:'Гаврилов С.П.',room:'1.026',week:'even'},{pair:3,subject:'Ознакомительный практикум',type:'Практика',teacher:'Басова Е.Н.',room:'1.213',week:'odd'},{pair:4,subject:'Физика',type:'Лабораторная',teacher:'Гаврилов С.П., Совтус Н.В.',room:'1.025',week:'even'}]};

/* ============ УТИЛИТЫ + АВТО ЧЁТ/НЕЧЕТ ============ */
const $=s=>document.querySelector(s);
const pad2=n=>String(n).padStart(2,'0');
const toMin=s=>{const[a,b]=s.split(':').map(Number);return a*60+b;};
const RU=['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'];
const store={get:(k,d)=>{try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v);}catch{return d;}},set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch{}}};
// Якорь: понедельник 31.08.2026 — НЕЧЁТНАЯ неделя. Дальше чередуем автоматически.
function autoParity(date){
  const d=new Date(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate()));
  const dow=d.getUTCDay();
  const toMon=(dow===0?-6:1-dow);
  const mon=new Date(d);mon.setUTCDate(mon.getUTCDate()+toMon);
  const anchor=Date.UTC(2026,7,31);
  const w=Math.round((mon.getTime()-anchor)/864e5/7);
  return (w%2===0)?'odd':'even';
}
const pname=p=>p==='odd'?'Нечётная':'Чётная';
function dayItems(dow,par){return (SCHEDULE[dow]||[]).filter(x=>x.week==='both'||x.week===par).sort((a,b)=>a.pair-b.pair||a.subject.localeCompare(b.subject,'ru'));}
function tcls(t){t=(t||'').toLowerCase();if(t.includes('лек'))return 'lec';if(t.includes('лаб'))return 'lab';return 'prac';}
function wtag(w){return w==='both'?'обе':(w==='odd'?'нечёт':'чёт');}
function toast(m){const e=$('#toast');e.textContent=m;e.classList.add('show');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('show'),2200);}

let parityOverride=null; // null=авто
let schedDay=(()=>{const d=new Date().getDay();return (d>=1&&d<=5)?d:1;})();
let schedMode='auto';
const effParity=(d=new Date())=>parityOverride||autoParity(d);

/* ============ ТЕМА + НАВИГАЦИЯ ============ */
function initTheme(){const s=store.get('theme',null);if(s)document.documentElement.dataset.theme=s;$('#themeBtn').onclick=()=>{const c=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=c;store.set('theme',c);};}
function go(view){
  document.querySelectorAll('.tabbtn').forEach(b=>b.classList.toggle('active',b.dataset.view===view));
  document.querySelectorAll('.bnav').forEach(b=>b.classList.toggle('active',b.dataset.view===view));
  document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id==='view-'+view));
  closeStages();scrollTo({top:0,behavior:'smooth'});
}
function initNav(){
  document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.view)));
  document.querySelectorAll('.seg').forEach(b=>b.addEventListener('click',()=>{schedMode=b.dataset.w;renderSchedule();}));
  $('#parityBtn').onclick=()=>{
    if(!parityOverride){parityOverride=autoParity(new Date())==='odd'?'even':'odd';toast('Ручной просмотр: '+pname(parityOverride)+' неделя. Нажми ещё раз — верну авто.');}
    else{parityOverride=null;toast('Авто-режим включён');}
    tick(true);
  };
}

/* ============ РЕНДЕР ПАР ============ */
function pairHTML(it,st){
  const[s,e]=PAIR_TIMES[it.pair];
  return `<div class="pair ${st}"><div class="pt"><b>${s}</b><span>${e}</span></div><div class="pn">${it.pair}</div><div class="pb"><h4>${it.subject}</h4><div class="m">${it.teacher} · ауд. ${it.room}</div><div class="tags"><span class="tag ${tcls(it.type)}">${it.type}</span><span class="tag week">${wtag(it.week)}</span></div></div></div>`;
}

/* ============ ГЛАВНАЯ (часы + авто) ============ */
function tick(force){
  const now=new Date();
  const nm=now.getHours()*60+now.getMinutes();
  const auto=autoParity(now), eff=effParity(now), dow=now.getDay();
  $('#clock').textContent=`${pad2(now.getHours())}:${pad2(now.getMinutes())}:${pad2(now.getSeconds())}`;
  $('#dateLine').textContent=`${RU[dow]}, ${now.toLocaleDateString('ru-RU',{day:'numeric',month:'long'})}`;
  const pb=$('#parityBadge');
  pb.textContent=`АВТО · ${pname(auto).toUpperCase()} НЕДЕЛЯ`;
  $('#parityNote').textContent=parityOverride?`Авто определило: ${pname(auto)}, но ты смотришь вручную: ${pname(parityOverride)} — нажми бейдж сверху для возврата`:`Считаю автоматически от 31.08.2026 (нечётная). Сегодня — ${pname(auto).toLowerCase()} неделя.`;
  const top=$('#parityBtn');
  top.textContent=(parityOverride?`👁 ${pname(parityOverride)} (ручн.)`:`⚡ ${pname(auto)} · авто`);
  top.classList.toggle('manual',!!parityOverride);

  const items=(dow>=1&&dow<=5)?dayItems(dow,eff).map(x=>({...x,s:PAIR_TIMES[x.pair][0],e:PAIR_TIMES[x.pair][1],sM:toMin(PAIR_TIMES[x.pair][0]),eM:toMin(PAIR_TIMES[x.pair][1])})):[];
  let cur=null,next=null;
  for(const it of items){if(nm>=it.sM&&nm<it.eM){cur=it;break;}}
  if(!cur)next=items.find(x=>x.sM>nm)||null;
  const ck=cur?cur.pair+'|'+cur.subject:null;
  if(dow===0||dow===6){$('#nowLab').textContent='Сегодня';$('#nowTitle').textContent='Выходной 🎉';$('#nowMeta').textContent='Пар нет';$('#nowProg').style.width='0%';$('#nowCount').textContent='Отдыхай';}
  else if(cur){$('#nowLab').textContent=`Сейчас идёт · ${cur.s}–${cur.e}`;$('#nowTitle').textContent=`${cur.pair} пара · ${cur.subject}`;$('#nowMeta').textContent=`${cur.teacher} · ауд. ${cur.room} · ${cur.type}`;$('#nowProg').style.width=((nm-cur.sM)/(cur.eM-cur.sM)*100).toFixed(1)+'%';$('#nowCount').textContent=`До конца ${cur.eM-nm} мин`;}
  else if(next){$('#nowLab').textContent=`Следующая · ${next.s}–${next.e}`;$('#nowTitle').textContent=`${next.pair} пара · ${next.subject}`;$('#nowMeta').textContent=`${next.teacher} · ауд. ${next.room} · ${next.type}`;$('#nowProg').style.width='0%';$('#nowCount').textContent=`Через ${next.sM-nm} мин`;}
  else if(items.length){$('#nowLab').textContent='Сегодня';$('#nowTitle').textContent='Пары закончились ✅';$('#nowMeta').textContent='На сегодня всё';$('#nowProg').style.width='100%';$('#nowCount').textContent='До завтра';}
  else{$('#nowLab').textContent='Сегодня';$('#nowTitle').textContent='Пар нет';$('#nowMeta').textContent='По этой неделе занятий нет';$('#nowProg').style.width='0%';$('#nowCount').textContent='—';}

  const done=items.filter(i=>i.eM<=nm).length;
  $('#stToday').textContent=items.length;$('#stLeft').textContent=Math.max(items.length-done,0);
  $('#stNext').textContent=next?next.s:(cur?cur.e:'—');
  let wt=0;for(let d=1;d<=5;d++)wt+=dayItems(d,eff).length;$('#stWeek').textContent=wt;
  $('#todayList').innerHTML=items.length?items.map(it=>{const k=it.pair+'|'+it.subject;return pairHTML(it,k===ck?'now':(it.eM<=nm?'done':''));}).join(''):`<div class="empty">Сегодня занятий нет 🎉</div>`;
  if(force){renderSchedule();renderCal();}
}

/* ============ ВКЛАДКА ПАРЫ + ПОИСК ============ */
function renderSchedule(){
  $('#dayTabs').innerHTML=[1,2,3,4,5].map(d=>`<button class="day-tab ${d===schedDay?'active':''}" data-d="${d}">${DAY_SHORT[d]}</button>`).join('');
  document.querySelectorAll('#dayTabs .day-tab').forEach(b=>b.onclick=()=>{schedDay=+b.dataset.d;renderSchedule();});
  document.querySelectorAll('.seg').forEach(b=>b.classList.toggle('active',b.dataset.w===schedMode));
  const par=schedMode==='auto'?effParity(new Date()):schedMode;
  $('#schedParity').textContent=`${DAY_NAMES[schedDay]} · ${pname(par).toLowerCase()} неделя${schedMode==='auto'?' (авто)':''}`;
  const q=($('#q').value||'').trim().toLowerCase();
  let items=dayItems(schedDay,par);
  if(q)items=items.filter(x=>(x.subject+' '+x.teacher+' '+x.room+' '+x.type).toLowerCase().includes(q));
  $('#schedList').innerHTML=items.length?items.map(x=>pairHTML(x,'')).join(''):`<div class="empty">Ничего не найдено — попробуй «Химия», «Пеккер», «2.415»</div>`;
}

/* ============ КАЛЕНДАРЬ ============ */
let cy=2026,cm=8,sel=new Date();
const MN=['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
function renderCal(){
  $('#calTitle').textContent=`${MN[cm]} ${cy}`;
  const first=new Date(cy,cm,1);let off=first.getDay();off=off===0?6:off-1;
  const dim=new Date(cy,cm+1,0).getDate(),today=new Date();
  let h=['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(d=>`<div class="dow">${d}</div>`).join('');
  for(let i=0;i<off;i++)h+=`<div class="cell pad"></div>`;
  for(let d=1;d<=dim;d++){
    const dt=new Date(cy,cm,d),dow=dt.getDay(),we=(dow===0||dow===6);
    const par=autoParity(dt);
    const cls=`cell ${we?'we':''} ${dt.toDateString()===today.toDateString()?'today':''} ${dt.toDateString()===sel.toDateString()?'sel':''}`;
    h+=`<div class="${cls}" data-d="${d}"><span>${d}</span>${we?'<i class="free"></i>':`<i class="${par==='odd'?'odd':'even'}"></i>`}</div>`;
  }
  $('#calGrid').innerHTML=h;
  document.querySelectorAll('#calGrid .cell[data-d]').forEach(c=>c.onclick=()=>{sel=new Date(cy,cm,+c.dataset.d);renderCal();});
  const dow=sel.getDay(),par=effParity(sel);
  if(dow===0||dow===6)$('#calDetail').innerHTML=`<b>${sel.toLocaleDateString('ru-RU',{day:'numeric',month:'long'})} — выходной 🎉</b>`;
  else{const items=dayItems(dow,par);$('#calDetail').innerHTML=`<b>${RU[dow]}, ${sel.toLocaleDateString('ru-RU',{day:'numeric',month:'long'})} · ${pname(par).toLowerCase()} неделя (авто)</b><div class="timeline" style="margin-top:10px">${items.length?items.map(x=>pairHTML(x,'')).join(''):'<div class="empty">Пар нет</div>'}</div>`;}
}

/* ============ ИГРЫ ============ */
function openGame(g){closeStages();$('#gamesHub').style.display='none';$('#stage-'+g).classList.add('on');}
function closeStages(){document.querySelectorAll('.stage').forEach(s=>s.classList.remove('on'));const h=$('#gamesHub');if(h)h.style.display='';}
function initGames(){
  document.querySelectorAll('.game-card').forEach(c=>c.onclick=()=>openGame(c.dataset.game));
  document.querySelectorAll('[data-back]').forEach(b=>b.onclick=closeStages);
  initSnake();initTTT();init2048();initMemory();initReact();initBJ();initInvoker();
  refreshScores();
}
function refreshScores(){
  $('#sc-snake').textContent='Рекорд: '+store.get('snakeBest',0);
  $('#sc-ttt').textContent=store.get('tttX',0)+' : '+store.get('tttO',0);
  $('#sc-2048').textContent='Рекорд: '+store.get('g2048Best',0);
  const m=store.get('memBest',null);$('#sc-memory').textContent=m==null?'—':'Лучший: '+m+' ходов';
  const r=store.get('reactBest',null);$('#sc-react').textContent=r==null?'—':'Рекорд: '+r+' мс';
  $('#sc-bj').textContent=store.get('bjW',0)+' / '+store.get('bjL',0);
  const ib=store.get('invBest',null);$('#sc-invoker').textContent=ib==null?'Рекорд: —':'Рекорд: '+ib;
}
/* --- змейка --- */
function initSnake(){
  const cv=$('#snakeCanvas'),ctx=cv.getContext('2d'),N=20,S=20;
  let sn,dir,nd,food,score,loop,alive;
  const best0=store.get('snakeBest',0);$('#snakeBest').textContent=best0;
  function reset(){sn=[{x:10,y:10},{x:9,y:10},{x:8,y:10}];dir={x:1,y:0};nd={x:1,y:0};score=0;alive=true;$('#snakeScore').textContent='0';food=spawn();clearInterval(loop);loop=setInterval(step,130);}
  function spawn(){while(true){const f={x:(Math.random()*N)|0,y:(Math.random()*N)|0};if(!sn.some(s=>s.x===f.x&&s.y===f.y))return f;}}
  function step(){
    dir=nd;const h={x:sn[0].x+dir.x,y:sn[0].y+dir.y};
    if(h.x<0||h.y<0||h.x>=N||h.y>=N||sn.some(s=>s.x===h.x&&s.y===h.y)){alive=false;clearInterval(loop);const b=store.get('snakeBest',0);if(score>b){store.set('snakeBest',score);$('#snakeBest').textContent=score;}refreshScores();toast('Игра окончена · счёт '+score);return;}
    sn.unshift(h);
    if(h.x===food.x&&h.y===food.y){score++;$('#snakeScore').textContent=score;food=spawn();}else sn.pop();
    ctx.fillStyle='#0a0e1c';ctx.fillRect(0,0,400,400);
    ctx.fillStyle='#ff5f6e';ctx.beginPath();ctx.arc(food.x*S+S/2,food.y*S+S/2,8,0,7);ctx.fill();
    sn.forEach((s,i)=>{ctx.fillStyle=i===0?'#7cf2dd':(i%2?'#5f7cff':'#a47bff');ctx.beginPath();ctx.roundRect(s.x*S+2,s.y*S+2,S-4,S-4,6);ctx.fill();});
  }
  document.querySelectorAll('.dpad button').forEach(b=>b.onclick=()=>{const d=b.dataset.dir;nd=d==='up'?{x:0,y:-1}:d==='down'?{x:0,y:1}:d==='left'?{x:-1,y:0}:{x:1,y:0};if(sn&&(nd.x===-dir.x&&nd.y===-dir.y))nd=dir;});
  addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(k==='arrowup'||k==='w')nd={x:0,y:-1};else if(k==='arrowdown'||k==='s')nd={x:0,y:1};else if(k==='arrowleft'||k==='a')nd={x:-1,y:0};else if(k==='arrowright'||k==='d')nd={x:1,y:0};});
  let tx=0,ty=0;cv.addEventListener('touchstart',e=>{const t=e.touches[0];tx=t.clientX;ty=t.clientY;},{passive:true});
  cv.addEventListener('touchend',e=>{const t=e.changedTouches[0],dx=t.clientX-tx,dy=t.clientY-ty;if(Math.abs(dx)<20&&Math.abs(dy)<20)return;nd=Math.abs(dx)>Math.abs(dy)?{x:Math.sign(dx),y:0}:{x:0,y:Math.sign(dy)};},{passive:true});
  $('#snakeRestart').onclick=reset;reset();
}
/* --- крестики --- */
function initTTT(){
  let b=Array(9).fill(''),turn='✕';
  function draw(){$('#tttGrid').innerHTML=b.map((v,i)=>`<button data-i="${i}">${v}</button>`).join('');document.querySelectorAll('#tttGrid button').forEach(x=>x.onclick=()=>move(+x.dataset.i));$('#tttX').textContent=store.get('tttX',0);$('#tttO').textContent=store.get('tttO',0);$('#tttD').textContent=store.get('tttD',0);refreshScores();}
  function win(){const L=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];for(const[a,c,d]of L)if(b[a]&&b[a]===b[c]&&b[a]===b[d])return b[a];return b.includes('')?null:'draw';}
  function move(i){if(b[i])return;b[i]=turn;const w=win();if(w){if(w==='draw'){store.set('tttD',store.get('tttD',0)+1);$('#tttStatus').textContent='Ничья!';}else{store.set(w==='✕'?'tttX':'tttO',store.get(w==='✕'?'tttX':'tttO',0)+1);$('#tttStatus').textContent='Победил '+w+'!';}draw();setTimeout(()=>{b=Array(9).fill('');turn='✕';$('#tttStatus').textContent='Ход: ✕';draw();},1200);return;}turn=turn==='✕'?'○':'✕';$('#tttStatus').textContent='Ход: '+turn;draw();}
  $('#tttRestart').onclick=()=>{b=Array(9).fill('');turn='✕';$('#tttStatus').textContent='Ход: ✕';draw();};
  draw();
}
/* --- 2048 --- */
function init2048(){
  let g,score;
  function reset(){g=Array.from({length:4},()=>Array(4).fill(0));score=0;add();add();draw();}
  function add(){const e=[];g.forEach((r,y)=>r.forEach((v,x)=>{if(!v)e.push([y,x]);}));if(!e.length)return;const[y,x]=e[(Math.random()*e.length)|0];g[y][x]=Math.random()<.9?2:4;}
  function slide(r){r=r.filter(v=>v);for(let i=0;i<r.length-1;i++)if(r[i]===r[i+1]){r[i]*=2;score+=r[i];r.splice(i+1,1);}while(r.length<4)r.push(0);return r;}
  function move(dx,dy){
    let moved=false;const ng=g.map(r=>r.slice());
    for(let n=0;n<4;n++){
      let line=[];for(let i=0;i<4;i++){const y=dy!==0?(dy>0?3-i:i):n,x=dx!==0?(dx>0?3-i:i):n;line.push(ng[y][x]);}
      const nl=slide(line);
      for(let i=0;i<4;i++){const y=dy!==0?(dy>0?3-i:i):n,x=dx!==0?(dx>0?3-i:i):n;if(ng[y][x]!==nl[i])moved=true;ng[y][x]=nl[i];}
    }
    if(moved){g=ng;add();draw();const b=store.get('g2048Best',0);if(score>b)store.set('g2048Best',score);refreshScores();if(!g.flat().includes(0)&&over())toast('Игра окончена · '+score);}
  }
  function over(){for(let y=0;y<4;y++)for(let x=0;x<4;x++){if(!g[y][x])return false;if(x<3&&g[y][x]===g[y][x+1])return false;if(y<3&&g[y][x]===g[y+1][x])return false;}return true;}
  function draw(){$('#g2048Score').textContent=score;$('#g2048Best').textContent=Math.max(store.get('g2048Best',0),score);$('#g2048Grid').innerHTML=g.flat().map(v=>`<div class="t${v}">${v||''}</div>`).join('');}
  addEventListener('keydown',e=>{if(!$('#stage-g2048').classList.contains('on'))return;if(e.key==='ArrowUp')move(0,-1);if(e.key==='ArrowDown')move(0,1);if(e.key==='ArrowLeft')move(-1,0);if(e.key==='ArrowRight')move(1,0);});
  let tx=0,ty=0;const el=$('#g2048Grid');el.addEventListener('touchstart',e=>{const t=e.touches[0];tx=t.clientX;ty=t.clientY;},{passive:true});
  el.addEventListener('touchend',e=>{const t=e.changedTouches[0],dx=t.clientX-tx,dy=t.clientY-ty;if(Math.abs(dx)<24&&Math.abs(dy)<24)return;if(Math.abs(dx)>Math.abs(dy))move(Math.sign(dx),0);else move(0,Math.sign(dy));},{passive:true});
  $('#g2048Restart').onclick=reset;reset();
}
/* --- memory --- */
function initMemory(){
  const E=['🍎','🚀','🐱','⚽','🎧','🌙','🍕','🎲'];let deck,open,moves,found,t0,timer;
  function reset(){deck=[...E,...E].sort(()=>Math.random()-.5);open=[];moves=0;found=0;clearInterval(timer);t0=Date.now();$('#memTime').textContent='0';timer=setInterval(()=>$('#memTime').textContent=((Date.now()-t0)/1000)|0,500);draw();}
  function draw(){$('#memMoves').textContent=moves;$('#memBest').textContent=store.get('memBest',null)??'—';$('#memGrid').innerHTML=deck.map((v,i)=>`<button data-i="${i}" class="${open.includes(i)?'open':''}">${open.includes(i)?v:'?'}</button>`).join('');document.querySelectorAll('#memGrid button').forEach(b=>b.onclick=()=>flip(+b.dataset.i));}
  function flip(i){if(open.includes(i)||open.length===2)return;open.push(i);if(open.length===2){moves++;const[a,b]=open;if(deck[a]===deck[b]){setTimeout(()=>{found+=2;open=[];if(found===16){clearInterval(timer);const best=store.get('memBest',null);if(best==null||moves<best)store.set('memBest',moves);refreshScores();toast('Готово за '+moves+' ходов!');}draw();},450);}else setTimeout(()=>{open=[];draw();},600);}draw();}
  $('#memRestart').onclick=reset;reset();
}
/* --- реакция --- */
function initReact(){
  const box=$('#reactBox');let st='idle',t0,tm;
  function best(){$('#reactBest').textContent=store.get('reactBest',null)??'—';refreshScores();}
  box.onclick=()=>{
    if(st==='idle'){st='wait';box.className='react-box wait';box.textContent='Жди зелёный…';tm=setTimeout(()=>{st='go';box.className='react-box go';box.textContent='ЖМИ!';t0=performance.now();},800+Math.random()*2200);}
    else if(st==='wait'){clearTimeout(tm);st='idle';box.className='react-box';box.textContent='Рано! Нажми чтобы заново';}
    else{const ms=Math.round(performance.now()-t0);st='idle';box.className='react-box';box.textContent=ms+' мс · ещё раз?';const b=store.get('reactBest',null);if(b==null||ms<b)store.set('reactBest',ms);const c=document.createElement('span');c.textContent=ms+' мс';$('#reactList').prepend(c);best();}
  };
  $('#reactReset').onclick=()=>{st='idle';box.className='react-box';box.textContent='Нажми, чтобы начать';$('#reactList').innerHTML='';};
  best();
}
/* --- блекджек --- */
function initBJ(){
  let deck,ph,dh,done;
  const val=h=>{let s=0,a=0;for(const c of h){let v=c.slice(0,-1);if(v==='A'){a++;s+=11;}else if(['K','Q','J'].includes(v))s+=10;else s+=+v;}while(s>21&&a){s-=10;a--;}return s;};
  const card=()=>{const r=['A','2','3','4','5','6','7','8','9','10','J','Q','K'][(Math.random()*13)|0],s=['♠','♥','♦','♣'][(Math.random()*4)|0];return r+s;};
  function draw(hide){const fc=c=>`<div class="cf ${c.includes('♥')||c.includes('♦')?'red':''}">${c}</div>`;$('#bjD').innerHTML=dh.map((c,i)=>(i===0&&hide)?'<div class="cf">?</div>':fc(c)).join('');$('#bjPRow').innerHTML=ph.map(fc).join('');$('#bjDS').textContent=hide?'?':val(dh);$('#bjPS').textContent=val(ph);$('#bjW').textContent=store.get('bjW',0);$('#bjL').textContent=store.get('bjL',0);$('#bjP').textContent=store.get('bjP',0);refreshScores();}
  function end(m){done=true;$('#bjMsg').textContent=m;draw(false);}
  function deal(){deck=0;ph=[card(),card()];dh=[card(),card()];done=false;$('#bjMsg').textContent='';draw(true);if(val(ph)===21)end('Блэкджек! Победа 🎉'),store.set('bjW',store.get('bjW',0)+1),draw(false);}
  $('#bjNew').onclick=deal;
  $('#bjHit').onclick=()=>{if(done)return;ph.push(card());draw(true);const v=val(ph);if(v>21){store.set('bjL',store.get('bjL',0)+1);end('Перебор '+v+' · победа дилера');}else if(v===21)$('#bjStand').click();};
  $('#bjStand').onclick=()=>{if(done)return;while(val(dh)<17)dh.push(card());const p=val(ph),d=val(dh);if(d>21){store.set('bjW',store.get('bjW',0)+1);end('Дилер перебрал · победа! 🎉');}else if(p>d){store.set('bjW',store.get('bjW',0)+1);end(`Ты ${p} vs ${d} · победа! 🎉`);}else if(p<d){store.set('bjL',store.get('bjL',0)+1);end(`Ты ${p} vs ${d} · дилер выиграл`);}else{store.set('bjP',store.get('bjP',0)+1);end(`Ничья ${p}:${d}`);}};
  deal();
}

/* --- инвокер (как invoker-game.com): QWE + Invoke на скорость --- */
const INV_SPELLS=[
 {n:'Cold Snap',c:['Q','Q','Q'],e:'❄️'},{n:'Ghost Walk',c:['Q','Q','W'],e:'👻'},
 {n:'Ice Wall',c:['Q','Q','E'],e:'🧊'},{n:'Tornado',c:['Q','W','W'],e:'🌪️'},
 {n:'EMP',c:['W','W','W'],e:'⚡'},{n:'Alacrity',c:['W','W','E'],e:'🗡️'},
 {n:'Forge Spirit',c:['Q','E','E'],e:'🔥'},{n:'Chaos Meteor',c:['W','E','E'],e:'☄️'},
 {n:'Sun Strike',c:['E','E','E'],e:'☀️'},{n:'Deafening Blast',c:['Q','W','E'],e:'💥'}
];
function initInvoker(){
  let orbs=[],target=null,score=0,streak=0,left=30,timer=null,playing=false;
  const orbBox=()=>{$('#invOrbs').innerHTML=[0,1,2].map(i=>{const o=orbs[i];return o?`<span class="${o}">${o}</span>`:'<span></span>';}).join('');};
  const needTxt=t=>[...t.c].sort().join(' + ');
  function pick(){target=INV_SPELLS[(Math.random()*INV_SPELLS.length)|0];$('#invSpell').textContent=target.e+' '+target.n;$('#invNeed').textContent='Нужно: '+needTxt(target);orbs=[];orbBox();}
  function msg(t,cls){const m=$('#invMsg');m.textContent=t;m.className='inv-msg'+(cls?' '+cls:'');}
  function best(){$('#invBest').textContent=store.get('invBest',null)??'—';refreshScores();}
  function start(){score=0;streak=0;left=30;playing=true;$('#invScore').textContent='0';$('#invStreak').textContent='0';$('#invTime').textContent='30';clearInterval(timer);pick();msg('Набери QWE и жми R');timer=setInterval(()=>{if(!$('#stage-invoker').classList.contains('on'))return;left--;$('#invTime').textContent=left;if(left<=0){playing=false;clearInterval(timer);msg('Время! Счёт: '+score,score>0?'good':'');const b=store.get('invBest',null);if(b==null||score>b){store.set('invBest',score);toast('Новый рекорд: '+score+'!');}best();}},1000);}
  function press(o){if(!playing)start();if(orbs.length>=3)orbs.shift();orbs.push(o);orbBox();}
  function invoke(){
    if(!playing){start();return;}
    if(orbs.length<3){msg('Сначала набери 3 орбы!','bad');return;}
    const got=[...orbs].sort().join(''),want=[...target.c].sort().join('');
    if(got===want){score++;streak++;$('#invScore').textContent=score;$('#invStreak').textContent=streak;msg('✅ '+target.n+'!','good');pick();}
    else{streak=0;$('#invStreak').textContent='0';msg('❌ Мимо! Надо было: '+needTxt(target),'bad');}
  }
  document.querySelectorAll('.inv-key[data-orb]').forEach(b=>{b.onclick=()=>press(b.dataset.orb);});
  $('#invInvoke').onclick=invoke;
  addEventListener('keydown',e=>{if(!$('#stage-invoker').classList.contains('on'))return;const k=e.key.toLowerCase();if(k==='q'||k==='й')press('Q');else if(k==='w'||k==='ц')press('W');else if(k==='e'||k==='у')press('E');else if(k==='r'||k==='к')invoke();});
  $('#invRestart').onclick=start;
  orbBox();pick();best();
}

/* ============ ИНСТРУМЕНТЫ ============ */
function initCalc(){
  let expr='';
  const upd=()=>{$('#calcExpr').innerHTML=expr||'&nbsp;';try{const v=expr?Function('return ('+expr.replace(/,/g,'.')+')')():0;$('#calcRes').textContent=(Math.round(v*1e8)/1e8).toString().replace('.',',');}catch{$('#calcRes').textContent='…';}};
  $('#keys').addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b)return;const k=b.dataset.k;
    if(k==='clear')expr='';else if(k==='back')expr=expr.slice(0,-1);else if(k==='pct')expr+='/100';else if(k==='='){try{const v=Function('return ('+expr.replace(/,/g,'.')+')')()|0;const r=(Math.round(v*1e8)/1e8).toString();const row=document.createElement('div');row.textContent=expr+' = '+r;$('#calcHist').prepend(row);expr=r;}catch{toast('Ошибка выражения');}}else expr+=k;
    upd();
  });
  upd();
}
function initTimers(){
  // таймер
  let tLeft=300,tId=null;
  const fmt=s=>`${pad2((s/3600)|0)}:${pad2(((s/60)|0)%60)}:${pad2(s%60)}`;
  const show=()=>$('#timerV').textContent=fmt(tLeft);
  $('#timerStart').onclick=()=>{tLeft=(+$('#tH').value)*3600+(+$('#tM').value)*60+(+$('#tS').value);if(tLeft<=0)return;clearInterval(tId);show();tId=setInterval(()=>{tLeft--;show();if(tLeft<=0){clearInterval(tId);toast('Время вышло ⏰');try{navigator.vibrate(200);}catch{}}},1000);};
  $('#timerStop').onclick=()=>clearInterval(tId);show();
  // секундомер
  let sT=0,sId=null,laps=[];
  const sf=t=>`${pad2((t/600)|0)}:${pad2(((t/10)|0)%60)}.${(t%10)}`;
  $('#stopStart').onclick=e=>{if(sId){clearInterval(sId);sId=null;e.target.textContent='Старт';}else{e.target.textContent='Пауза';const t0=Date.now()-sT*100;sId=setInterval(()=>{sT=Math.round((Date.now()-t0)/100);$('#stopV').textContent=sf(sT);},100);}};
  $('#stopLap').onclick=()=>{laps.unshift(sT);$('#laps').innerHTML=laps.map((l,i)=>`<div><span>Круг ${laps.length-i}</span><b>${sf(l)}</b></div>`).join('');};
  $('#stopReset').onclick=()=>{clearInterval(sId);sId=null;sT=0;laps=[];$('#laps').innerHTML='';$('#stopV').textContent='00:00.0';$('#stopStart').textContent='Старт';};
  // pomodoro
  let pLeft=25*60,pId=null,work=true;
  const pshow=()=>{$('#pomoV').textContent=`${pad2((pLeft/60)|0)}:${pad2(pLeft%60)}`;$('#pomoMode').textContent=work?'работа':'отдых';};
  $('#pomoStart').onclick=e=>{if(pId){clearInterval(pId);pId=null;e.target.textContent='Старт';}else{e.target.textContent='Пауза';pId=setInterval(()=>{pLeft--;if(pLeft<0){work=!work;pLeft=(work?+$('#pW').value:+$('#pR').value)*60;toast(work?'Пора работать 🍅':'Отдых ☕');}pshow();},1000);}};
  $('#pomoReset').onclick=()=>{clearInterval(pId);pId=null;work=true;pLeft=(+$('#pW').value)*60;$('#pomoStart').textContent='Старт';pshow();};
  pshow();
}

/* ============ СТАРТ ============ */
initTheme();initNav();
$('#calPrev').onclick=()=>{cm--;if(cm<0){cm=11;cy--;}renderCal();};
$('#calNext').onclick=()=>{cm++;if(cm>11){cm=0;cy++;}renderCal();};
$('#calToday').onclick=()=>{const n=new Date();cy=n.getFullYear();cm=n.getMonth();sel=n;renderCal();};
$('#q').addEventListener('input',renderSchedule);
$('#copyToday').onclick=async()=>{const n=new Date(),p=effParity(n),d=n.getDay();const items=(d>=1&&d<=5)?dayItems(d,p):[];const t=items.length?`${RU[d]} · ${pname(p)} неделя (авто)\n`+items.map(x=>`${PAIR_TIMES[x.pair][0]}–${PAIR_TIMES[x.pair][1]} · ${x.pair} · ${x.subject} · ${x.teacher} · ${x.room}`).join('\n'):'Сегодня пар нет 🎉';try{await navigator.clipboard.writeText(t);toast('Скопировано');}catch{toast('Не скопировалось');}};
initGames();initCalc();initTimers();
renderSchedule();renderCal();tick(false);
setInterval(()=>tick(false),1000);
setInterval(()=>{renderSchedule();},30000);
