/* ==========================================================================
   ⚙️ محرك «استوديو التصميم» — مشترك بين دروس التصميم الرقمي
   --------------------------------------------------------------------------
   كل درس يعرّف قبل هذا الملف: LESSON_ID و LESSON و GOALS و MSG و SLIDES
   (واختياريًا LESSON.heroTitle و LESSON.print)
   لا تحتاجين لتعديل هذا الملف لإضافة درس جديد.
   ========================================================================== */
const LIB_URL = '../index.html#/lesson/' + LESSON_ID;
const PR = LESSON.print || {};
if(typeof MSG==='undefined') window.MSG = { correct:'أحسنتِ! 👏 إجابة صحيحة', wrong:'حاولي مرة أخرى 💜', short:'أحسنتِ! 👏', allDone:'ممتاز! أنجزتِ التحدي كاملًا 🎉' };
if(!LESSON.teams) LESSON.teams = [
  { name:'البكسل',   icon:'🟪', color:'#5B5BF7' },
  { name:'الفرشاة',  icon:'🖌️', color:'#FF5FA2' },
  { name:'الطبقة',   icon:'🧩', color:'#13C6A3' },
  { name:'الأيقونة', icon:'✨', color:'#FF8A3D' },
  { name:'المؤشر',   icon:'🖱️', color:'#3DA5FF' },
  { name:'اللوحة',   icon:'🎨', color:'#9B5CF6' },
  { name:'الشبكة',   icon:'📐', color:'#E5A100' },
  { name:'الإطار',   icon:'🖼️', color:'#F43F5E' }
];
const DEFAULT_TEAMS = LESSON.teams.slice();
Object.assign(LESSON, Object.assign({ className:'', classId:'_', students:[], groups:[], drawMode:'names', compMode:'groups', linked:false, defaultPoints:1 }, LESSON));

/* الهيكل الثابت: الشريط، النقاط، التحضير، الخريطة، القرعة، الاستكمال */
document.body.insertAdjacentHTML('afterbegin', `
<div id="stage"><div class="ruler-x"></div><div class="ruler-y"></div><div class="brand" id="brand"></div><div class="pgnum" id="pgnum"></div></div>
<nav id="bar" dir="ltr">
  <button id="prev" title="السابق (←)">← السابق</button><div id="counter"><b>1</b> / 1</div><button id="next" title="التالي (→ أو Space)">التالي →</button>
  <span class="sep"></span>
  <a class="ib" id="homeBtn" href="${LIB_URL}" title="العودة للمكتبة">🏠</a>
  <button id="ovwBtn" class="ib" title="خريطة الشرائح (G)">🗂️</button>
  <button id="prepBtn" class="ib" title="تحضير الشريحة (P)">📝</button>
  <button id="drawBtn" class="ib" title="القرعة (R)">🎲</button>
  <button id="clapBtn" class="ib" title="تصفيق (ت)">👏</button>
  <button id="scoreBtn" class="ib" title="النقاط">🏆</button>
  <button id="fsBtn" class="ib" title="ملء الشاشة">⛶</button>
</nav>
<div id="hint"><span><kbd>Space</kbd> التالي</span>|<span><kbd>P</kbd> التحضير</span>|<span><kbd>G</kbd> الخريطة</span>|<span><kbd>R</kbd> القرعة</span>|<span><kbd>ت</kbd> تصفيق</span></div>
<div id="progress"><i></i></div>
<aside id="score"><div class="sc-head">🏆 النقاط <button id="scClose">✕</button></div><div id="scList"></div><button id="scReset">↺ تصفير النقاط</button></aside>
<div id="teams"></div>
<div id="award"><div class="aw-head"><span id="awQ">🏅 مَن أجابت؟</span> <span id="awPts">+1</span><button id="awClose" title="إغلاق">✕</button></div><div id="awBtns"></div></div>
<aside id="prep">
  <div class="pp-head"><div><small>📝 تحضير الشريحة <span id="ppNum"></span></small><h3 id="ppTitle"></h3></div>
    <div class="pp-nav"><button id="ppPrev" title="الشريحة السابقة">←</button><button id="ppNext" title="الشريحة التالية">→</button><button id="ppClose" title="إغلاق">✕</button></div></div>
  <div class="pp-body">
    <div class="pp-row2"><label>⏱️ الزمن (د)<input type="number" min="0" max="45" data-f="min"></label><label>🎯 الهدف المرتبط<select data-f="goal"></select></label></div>
    <label>🧩 الاستراتيجية / الأسلوب<input type="text" data-f="st"></label>
    <label>👩‍🏫 إجراءات المعلمة<textarea data-f="t" rows="3"></textarea></label>
    <label>👭 نشاط الطالبات<textarea data-f="s" rows="3"></textarea></label>
    <label>✅ التقويم<textarea data-f="ev" rows="2"></textarea></label>
    <label>🗒️ ملاحظاتي<textarea data-f="note" rows="2" placeholder="ملاحظات خاصة بكِ لهذه الشريحة…"></textarea></label>
    <div class="pp-done" id="ppDone"></div>
  </div>
  <div class="pp-foot"><span id="ppSaved">✓ تم الحفظ</span><span class="grow"></span><button class="pbtn" id="ppReset">↺ الافتراضي</button><button class="pbtn dark" id="ppPrint">🖨️ طباعة التحضير كاملًا</button><div id="ppTotal"></div></div>
</aside>
<div class="ov" id="ovw"><div class="ov-card ovw-card"><div class="ov-head">🗂️ خريطة الشرائح <span id="ovwStat"></span><button class="ov-x" data-close="ovw">✕</button></div><div class="ovw-prog"><i id="ovwBar"></i></div><div class="ovw-grid" id="ovwGrid"></div></div></div>
<div class="ov" id="draw"><div class="ov-card draw-card"><div class="ov-head"><span id="drTitle">🎲 القرعة</span><button class="ov-x" data-close="draw">✕</button></div>
  <div class="dr-stage"><div><div class="dr-who" id="drWho">؟</div><div class="dr-full" id="drFull"></div></div></div>
  <div class="dr-row"><label><input type="checkbox" id="drNo" checked> بدون تكرار</label><span id="drLeft"></span><span class="grow"></span><button class="btn ghost" id="drAward">🏅 نقطة</button><button class="btn primary" id="drGo">اسحبي 🎲</button></div></div></div>
<div class="ov" id="resume"><div class="ov-card rs-card"><div class="rs-ic">👋</div><h3 id="rsT"></h3><p id="rsP"></p><div class="rs-bar"><i id="rsBar"></i></div>
  <div class="rs-btns"><button class="btn primary" id="rsGo"></button><button class="btn ghost" id="rsNew">↺ من البداية</button></div></div></div>
<div id="printDoc"></div>
<canvas id="fx"></canvas>`);

/* 📚 الربط بالمكتبة: بيانات المعلمة والفصل والطالبات والمجموعات */
(function(){
  let L=null, S=null;
  try{ L=JSON.parse(localStorage.getItem('reema-lesson')||'null'); }catch(e){}
  try{ S=JSON.parse(localStorage.getItem('reema-library-v1')||'null'); }catch(e){}
  if(S&&S.settings){ if(S.settings.teacher) LESSON.teacher='أ. '+S.settings.teacher; if(S.settings.school) LESSON.school=S.settings.school; }
  // إذا فُتح العرض مباشرة (وليس من زر «ابدئي الدرس») نبني البيانات من إعدادات الدرس المحفوظة في المكتبة
  if((!L || L.lessonId!==LESSON_ID) && S && Array.isArray(S.classes) && S.classes.length){
    const cfg=(S.lessonCfg||{})[LESSON_ID]||{};
    const c=S.classes.find(k=>k.id===cfg.classId)||S.classes.find(k=>k.id===(S.ui||{}).classId)||S.classes[0];
    const ab=(S.absent||{})[c.id]||[];
    const short=n=>{ const w=String(n).replace(/\s+(بنت|بن|ابن)\s+/g,' ').trim().split(/\s+/); return w.length<=2?w.join(' '):w[0]+' '+w[w.length-1]; };
    const nameOf=id=>{ const s=c.students.find(s=>s.id===id); return s?s.name:''; };
    L={ lessonId:LESSON_ID, classId:c.id, className:c.name,
        teacher:S.settings&&S.settings.teacher?'أ. '+S.settings.teacher:'', school:S.settings&&S.settings.school,
        drawMode:cfg.drawMode||'names', compMode:cfg.compMode||'groups',
        students:c.students.filter(x=>!ab.includes(x.id)).map(x=>({ id:x.id, name:x.name, short:short(x.name) })),
        groups:((S.groups||{})[c.id]||[]).map(g=>({ id:g.id, name:g.name, color:g.color, members:(g.members||[]).filter(m=>!ab.includes(m)).map(m=>short(nameOf(m))) })) };
  }
  if(!L || L.lessonId!==LESSON_ID) return;
  LESSON.linked=true;
  if(L.teacher && L.teacher.trim()!=='أ.') LESSON.teacher=L.teacher;
  if(L.school) LESSON.school=L.school;
  LESSON.className=L.className||''; LESSON.classId=L.classId||L.className||'_';
  LESSON.students=L.students||[]; LESSON.groups=(L.groups||[]).filter(g=>g.name);
  LESSON.drawMode=L.drawMode||'names'; LESSON.compMode=L.compMode||'groups';
  const icons=['🟪','🖌️','🧩','✨','🖱️','🎨','📐','🖼️','💡','🔷','🌈','⭐'];
  const pal=['#5B5BF7','#FF5FA2','#13C6A3','#FF8A3D','#3DA5FF','#9B5CF6','#E5A100','#F43F5E','#0EA5A4','#7C3AED'];
  if(LESSON.compMode==='groups' && LESSON.groups.length>=2)
    LESSON.teams=LESSON.groups.slice(0,12).map((g,i)=>({ name:g.name, icon:icons[i%icons.length], color:g.color||pal[i%pal.length], members:g.members||[] }));
  else if(LESSON.compMode==='individual' && LESSON.students.length)
    LESSON.teams=LESSON.students.map((s,i)=>({ name:s.short||s.name, full:s.name, icon:'', color:pal[i%pal.length] }));
  else if(LESSON.compMode==='none') LESSON.teams=[];
})();

const $  = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const PALETTE = ['#5B5BF7','#FF5FA2','#13C6A3','#FF8A3D','#3DA5FF','#9B5CF6','#E5A100','#F43F5E'];
const fmt = s => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;
const shuffle = a => { for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; };
const retrigger = (el, cls) => { if(!el) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };
const shake = el => retrigger(el,'shake');
const esc = s => String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const strip = s => String(s??'').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
const nameOfSlide = s => strip(s.title||s.name||s.tag||'شريحة');
function setFb(fb, ok, text){ if(!fb) return; fb.innerHTML = text || (ok?MSG.correct:MSG.wrong); fb.className='feedback '+(ok?'ok':'bad'); retrigger(fb,'pop'); }

/* 💾 التخزين المحلي (مشترك مع المكتبة) */
const PREP_KEY='reema-prep', PROG_KEY='reema-progress';
const store = {
  get(k){ try{ return JSON.parse(localStorage.getItem(k)||'{}')||{}; }catch(e){ return {}; } },
  set(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); return true; }catch(e){ return false; } }
};

/* ---------------- 🔊 الأصوات ---------------- */
const sound = (() => {
  let ctx, master, noiseBuf;
  function ac(){
    if(!ctx){ ctx = new (window.AudioContext || window.webkitAudioContext)(); master = ctx.createDynamicsCompressor(); master.connect(ctx.destination); }
    if(ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function tone(freq, t, dur, type='sine', vol=.18, toFreq){
    const c=ac(), o=c.createOscillator(), g=c.createGain();
    o.type=type; o.frequency.setValueAtTime(freq,t);
    if(toFreq) o.frequency.exponentialRampToValueAtTime(toFreq,t+dur);
    g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(vol,t+.015); g.gain.exponentialRampToValueAtTime(.0001,t+dur);
    o.connect(g).connect(master); o.start(t); o.stop(t+dur+.05);
  }
  function noise(){ const c=ac(); if(!noiseBuf){ noiseBuf=c.createBuffer(1,c.sampleRate*.25,c.sampleRate); const d=noiseBuf.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1; } return noiseBuf; }
  function clapOne(t, vol){
    const c=ac(), src=c.createBufferSource(); src.buffer=noise();
    const bp=c.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=900+Math.random()*1500; bp.Q.value=.8;
    const hp=c.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=400;
    const g=c.createGain(); g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(vol,t+.003); g.gain.exponentialRampToValueAtTime(.0001,t+.07+Math.random()*.06);
    src.connect(hp).connect(bp).connect(g).connect(master); src.start(t, Math.random()*.1); src.stop(t+.2);
  }
  const safe = f => function(){ try{ f.apply(null,arguments); }catch(e){} };
  return {
    ac:safe(ac),
    clap:safe(()=>{ const c=ac(), now=c.currentTime+.02; for(let p=0;p<7;p++){ let t=now+Math.random()*.18; const period=.15+Math.random()*.09; while(t<now+1.8){ const fade=Math.max(.1,1-(t-now)/2); clapOne(t,.9*fade*(.55+Math.random()*.45)); t+=period*(.85+Math.random()*.3); } } }),
    success:safe(()=>{ const t=ac().currentTime; [523.25,659.25,783.99,1046.5].forEach((f,i)=>tone(f,t+i*.09,.35,'triangle',.2)); tone(2093,t+.38,.5,'sine',.07); }),
    wrong:safe(()=>{ const t=ac().currentTime; tone(392,t,.2,'sine',.13); tone(311,t+.16,.32,'sine',.13); }),
    ding:safe(()=>{ const t=ac().currentTime; tone(880,t,.25,'sine',.16); tone(1320,t+.06,.3,'sine',.1); }),
    pop:safe(()=>{ const t=ac().currentTime; tone(420,t,.12,'sine',.18,980); }),
    flip:safe(()=>{ const t=ac().currentTime; tone(700,t,.14,'triangle',.08,320); }),
    tick:safe(()=>{ const t=ac().currentTime; tone(1200,t,.04,'square',.04); }),
    key:safe(()=>{ const t=ac().currentTime; tone(1800+Math.random()*400,t,.03,'square',.025); }),
    bell:safe(()=>{ const t=ac().currentTime; [0,.45,.9].forEach(d=>{ tone(988,t+d,.9,'sine',.2); tone(1480,t+d,.6,'sine',.08); }); })
  };
})();

/* ---------------- 🎉 القصاصات ---------------- */
const confetti = (() => {
  const cv=$('#fx'), cx=cv.getContext('2d'); let parts=[], running=false, dpr=1;
  const size=()=>{ dpr=window.devicePixelRatio||1; cv.width=innerWidth*dpr; cv.height=innerHeight*dpr; };
  size(); addEventListener('resize',size);
  const colors=['#5B5BF7','#7B6CFF','#FF5FA2','#FF6B57','#13C6A3','#FFC542','#3DA5FF'];
  function add(x,y,vx,vy){ parts.push({x,y,vx,vy,s:7+Math.random()*9,r:Math.random()*6,vr:(Math.random()-.5)*.35,c:colors[Math.random()*colors.length|0],life:0,max:110+Math.random()*70,shape:Math.random()*3|0}); }
  function loop(){
    running=true; cx.setTransform(dpr,0,0,dpr,0,0); cx.clearRect(0,0,innerWidth,innerHeight);
    parts=parts.filter(p=>p.life<p.max && p.y<innerHeight+40);
    for(const p of parts){
      p.life++; p.vy+=.32; p.vx*=.99; p.x+=p.vx; p.y+=p.vy; p.r+=p.vr;
      cx.save(); cx.globalAlpha=Math.min(1,(p.max-p.life)/30); cx.translate(p.x,p.y); cx.rotate(p.r); cx.fillStyle=p.c;
      if(p.shape===0){ cx.beginPath(); cx.arc(0,0,p.s/2,0,7); cx.fill(); }
      else if(p.shape===1){ cx.beginPath(); cx.moveTo(0,-p.s/2); cx.lineTo(p.s/2,p.s/2); cx.lineTo(-p.s/2,p.s/2); cx.fill(); }
      else cx.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);
      cx.restore();
    }
    if(parts.length) requestAnimationFrame(loop); else { running=false; cx.clearRect(0,0,innerWidth,innerHeight); }
  }
  return {
    burst(x,y,n=90){ for(let i=0;i<n;i++){ const a=Math.random()*Math.PI*2, v=4+Math.random()*11; add(x,y,Math.cos(a)*v,Math.sin(a)*v-6); } if(!running) loop(); },
    rain(n=160){ for(let i=0;i<n;i++) add(Math.random()*innerWidth,-20-Math.random()*300,(Math.random()-.5)*4,Math.random()*3); if(!running) loop(); }
  };
})();
const COMP = LESSON.teams.length>0;
function celebrate(el, noAward){
  sound.success();
  const r=(el||$('#stage')).getBoundingClientRect();
  confetti.burst(r.left+r.width/2, r.top+r.height/2, 100);
  if(!noAward) showAward();
}
function clap(){
  sound.clap(); retrigger($('#clapBtn'),'pulse');
  for(let i=0;i<16;i++){
    const s=document.createElement('span'); s.className='clap-fly'; s.textContent=['👏','🎨','✨'][i%3];
    s.style.left=(8+Math.random()*84)+'vw'; s.style.fontSize=(3+Math.random()*4)+'vmin';
    s.style.setProperty('--dx',((Math.random()-.5)*30)+'vmin'); s.style.setProperty('--rot',((Math.random()-.5)*60)+'deg');
    s.style.animationDelay=(i*70)+'ms'; document.body.appendChild(s); setTimeout(()=>s.remove(),3400);
  }
}

/* ---------------- ⏱️ المؤقت ---------------- */
class Countdown{
  constructor(sec,onTick,onEnd){ this.total=sec; this.left=sec; this.onTick=onTick; this.onEnd=onEnd; this.id=null; }
  get running(){ return !!this.id; }
  start(){ if(this.id||this.left<=0) return; this.id=setInterval(()=>{ this.left--; this.onTick(this.left); if(this.left<=0){ this.stop(); this.onEnd&&this.onEnd(); } },1000); }
  stop(){ clearInterval(this.id); this.id=null; }
  reset(){ this.stop(); this.left=this.total; this.onTick(this.left); }
}
function mountTimer(slot, sec, opts={}){
  const C=2*Math.PI*52;
  slot.innerHTML=`<div class="timer-box ${opts.big?'big':''}"><div class="timer"><svg viewBox="0 0 120 120"><circle class="tr-bg" cx="60" cy="60" r="52"/><circle class="tr-fg" cx="60" cy="60" r="52"/></svg><div class="tr-txt">${fmt(sec)}</div></div>
    <div class="tr-btns"><button class="tbtn t-play" title="تشغيل/إيقاف">▶</button><button class="tbtn t-reset" title="إعادة">↺</button></div></div>`;
  const box=$('.timer-box',slot), fg=$('.tr-fg',slot), txt=$('.tr-txt',slot), play=$('.t-play',slot);
  fg.style.strokeDasharray=C; fg.style.strokeDashoffset=0;
  const draw=l=>{ txt.textContent=fmt(l); fg.style.strokeDashoffset=C*(1-l/sec); box.classList.toggle('warn',l<=10&&l>0); };
  const cd=new Countdown(sec, l=>{ draw(l); if(l<=5&&l>0) sound.tick(); }, ()=>{ box.classList.add('end'); play.textContent='▶'; sound.bell(); opts.onEnd&&opts.onEnd(); });
  play.onclick=()=>{ sound.ac(); if(cd.running){ cd.stop(); play.textContent='▶'; } else { if(cd.left<=0){ cd.reset(); box.classList.remove('end'); } cd.start(); play.textContent='⏸'; opts.onStart&&opts.onStart(); } };
  $('.t-reset',slot).onclick=()=>{ cd.reset(); box.classList.remove('end','warn'); play.textContent='▶'; opts.onReset&&opts.onReset(); };
  return cd;
}

/* ---------------- 🎨 قوالب الشرائح ---------------- */
const R = {};
const CUR_SVG = c => `<svg viewBox="0 0 24 24"><path d="M4 2 L4 19 L8.5 14.8 L11.6 21.5 L14.4 20.2 L11.4 13.6 L17.5 13.2 Z" fill="${c}" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>`;

R.title = {
  html:s=>{
    const firstName=LESSON.teacher.replace(/^أ\.\s*/,'').split(/\s+/)[0]||'المعلمة';
    const cls=LESSON.className?`<span>👭 ${esc(LESSON.className)}${LESSON.students.length?` · ${LESSON.students.length} حاضرة`:''}</span>`:'';
    let teams='';
    if(LESSON.compMode==='individual'&&LESSON.teams.length) teams=`<div class="hero-teams rv"><b>⚔️ تنافس فردي بين ${LESSON.teams.length} طالبة اليوم!</b></div>`;
    else if(LESSON.teams.length) teams=`<div class="hero-teams rv"><b>⚔️ ${LESSON.teams.length} مجموعات تتنافس اليوم:</b>${LESSON.teams.map(t=>`<span style="--c:${t.color}">${t.icon} ${esc(t.name)}</span>`).join('')}</div>`;
    return `<div class="hero">
    <div>
      <div class="rv"><span class="pill"><i></i>${LESSON.lessonNo} • ${LESSON.subject}</span></div>
      <h1 class="hero-title rv">${LESSON.heroTitle||esc(LESSON.title)}</h1>
      <p class="hero-sub rv">${s.subtitle}</p>
      <div class="hero-meta rv"><span>👩‍🏫 ${esc(LESSON.teacher)}</span><span>🏫 ${esc(LESSON.school)}</span>${cls}</div>
      ${teams}
      <div class="rv"><button class="btn hot lg start-btn">${s.start||'🚀 لنبدأ التصميم'}</button></div>
    </div>
    <div class="hero-art rv">
      <div class="hw"><div class="hw-bar"><span class="dots"><i></i><i></i><i></i></span><span class="hw-url">🔒 www.my-first-site.sa</span></div>
        <div class="hw-body">
          <div class="hw-nav"><div class="pb"></div><div class="pb"></div><div class="pb"></div><div class="pb"></div></div>
          <div class="hw-hero"><div class="pb big"><div class="ln w1"></div><div class="ln"></div><div class="ln w2"></div><div class="ln w3"></div></div><div class="pb img">🖼️</div></div>
          <div class="hw-cards"><div class="pb"></div><div class="pb"></div><div class="pb"></div></div>
        </div></div>
      <div class="hw-swatch">${['#5B5BF7','#FF5FA2','#13C6A3','#FFC542','#17153A'].map(c=>`<i style="--c:${c}"></i>`).join('')}</div>
      <div class="hw-type">Aa<small>Readex Pro · 72</small></div>
      <div class="mcur c1">${CUR_SVG('#5B5BF7')}<span>${esc(firstName)}</span></div>
      <div class="mcur c2">${CUR_SVG('#FF6B57')}<span>الطالبات</span></div>
    </div></div>`;
  },
  init:sec=>{ $('.start-btn',sec).onclick=()=>next(); }
};

R.mcq = {
  html:s=>`<div class="mcq">
    ${s.scene?`<div class="scene rv">${s.scene}</div>`:''}
    <div class="mcq-main">
      <div class="q-card rv"><span class="q-ic">❓</span><p>${s.question}</p></div>
      <div class="opts rv">${s.options.map((o,k)=>`<button class="opt" data-k="${k}"><span class="opt-ic">${o.icon||''}</span><span>${o.t}</span></button>`).join('')}</div>
      <div class="feedback"></div>
      ${s.explain?`<div class="explain">💡 ${s.explain}</div>`:''}
    </div></div>`,
  init:(sec,s)=>{
    const fb=$('.feedback',sec), ex=$('.explain',sec); let done=false;
    $$('.opt',sec).forEach(b=>b.onclick=()=>{
      if(done) return;
      if(+b.dataset.k===s.answer){ done=true; b.classList.add('correct'); $$('.opt',sec).forEach(o=>o!==b&&o.classList.add('dim')); setFb(fb,true); ex&&ex.classList.add('show'); celebrate(b); }
      else { retrigger(b,'wrong'); setFb(fb,false); sound.wrong(); }
    });
  }
};

R.objectives = {
  html:s=>`<div class="goals${s.grid?' grid':''}">${s.goals.map((g,k)=>`<div class="rv"><button class="goal"><span class="goal-n">${k+1}</span><span class="goal-ic">${g.icon}</span><span class="goal-t">${g.t}</span><span class="goal-check">✓</span></button></div>`).join('')}</div>
    ${s.hint?`<p class="hint-sm rv">${s.hint}</p>`:''}`,
  init:sec=>$$('.goal',sec).forEach(g=>g.onclick=()=>{ g.classList.toggle('done'); if(g.classList.contains('done')) sound.ding(); })
};

R.versus = {
  html:s=>`<div class="vs rv">${['a','b'].map(k=>`<div class="vs-card" data-k="${k}"><div class="vs-label">${s[k].label}</div><div class="vs-mock">${s[k].html}</div>
      <button class="btn ghost vs-btn">👍 أفضّلها <b>0</b></button></div>`).join('<div class="vs-mid">VS</div>')}</div>
    <div class="center-row rv"><button class="btn primary vs-reveal">🔍 ما السر؟</button></div>
    <div class="explain">${s.explain}</div>`,
  init:(sec,s)=>{
    $$('.vs-btn',sec).forEach(b=>b.onclick=()=>{ const x=$('b',b); x.textContent=+x.textContent+1; retrigger(x,'pop'); sound.pop(); });
    $('.vs-reveal',sec).onclick=()=>{
      const w=$(`.vs-card[data-k="${s.answer}"]`,sec); w.classList.add('win');
      $$('.vs-card',sec).forEach(c=>c!==w&&c.classList.add('lose'));
      $('.explain',sec).classList.add('show'); celebrate(w,true);
    };
  }
};

R.brainstorm = {
  html:s=>`<div class="bs">
    <div class="bs-side">
      <div class="bs-prompt rv">${s.prompt}</div>
      <div class="bs-input rv"><input type="text" placeholder="اكتبي فكرة الطالبة هنا…" maxlength="28"><button class="btn primary bs-add">＋</button></div>
      <div class="bs-btns rv"><button class="btn ghost bs-sug">💡 فكرة مقترحة</button><button class="btn ghost bs-clear">🧹 مسح</button></div>
      <div class="timer-slot rv"></div>
    </div>
    <div class="bs-area rv"><div class="bs-center">${s.center}</div></div></div>`,
  init:(sec,s)=>{
    const area=$('.bs-area',sec), inp=$('input',sec); let n=0, sug=0;
    const add=t=>{
      t=(t||'').trim(); if(!t) return;
      const outer=n%18<10, k=outer? n%18 : n%18-10;
      const ang=(outer? k*36 : k*45+22)*Math.PI/180 - Math.PI/2;
      const rx=outer?39:25, ry=outer?40:28, jit=n>=18?4:0;
      const b=document.createElement('div'); b.className='bubble'; b.textContent=t;
      b.style.setProperty('--c',PALETTE[n%PALETTE.length]);
      b.style.left=(50+Math.cos(ang)*rx+jit)+'%'; b.style.top=(50+Math.sin(ang)*ry+jit)+'%';
      area.appendChild(b); n++; sound.pop();
    };
    $('.bs-add',sec).onclick=()=>{ add(inp.value); inp.value=''; inp.focus(); };
    inp.addEventListener('keydown',e=>{ if(e.key==='Enter'){ add(inp.value); inp.value=''; } });
    $('.bs-sug',sec).onclick=e=>{ if(sug<s.suggestions.length) add(s.suggestions[sug++]); if(sug>=s.suggestions.length) e.currentTarget.disabled=true; };
    $('.bs-clear',sec).onclick=()=>{ $$('.bubble',area).forEach(b=>b.remove()); n=0; sug=0; $('.bs-sug',sec).disabled=false; };
    mountTimer($('.timer-slot',sec), s.seconds||120);
  }
};

R.blanks = {
  html:s=>`<div class="def-card ${s.ux?'ux':''} rv"><div class="def-src">${s.source}</div>
      <p class="def-text">${s.text.replace(/\[(.+?)\]/g,(_,w)=>`<button class="blank"><span>${w}</span></button>`)}</p></div>
    <div class="center-row rv"><button class="btn ghost bl-all">👀 إظهار الكل</button></div>
    ${s.note?`<div class="note-card rv">${s.note}</div>`:''}`,
  init:sec=>{
    const open=b=>{ if(b.classList.contains('open')) return; b.classList.add('open'); sound.pop(); if($$('.blank:not(.open)',sec).length===0) celebrate($('.def-card',sec),true); };
    $$('.blank',sec).forEach(b=>b.onclick=()=>open(b));
    $('.bl-all',sec).onclick=()=>$$('.blank',sec).forEach((b,i)=>setTimeout(()=>open(b),i*180));
  }
};

function flipInit(sec){ $$('.fc',sec).forEach(c=>c.onclick=()=>{ c.classList.toggle('flipped'); sound.flip(); }); }
R.cards = {
  html:s=>`${s.subtitle?`<p class="lead rv">${s.subtitle}</p>`:''}
    <div class="cards" style="--n:${s.cards.length}${s.h?`;--h:${s.h}px`:''}">${s.cards.map(c=>`<div class="fc-wrap rv"><button class="fc" style="--c:${c.color||'#5B5BF7'}">
      <div class="fc-face fc-front"><div class="fc-ic">${c.icon}</div><div class="fc-title">${c.title}</div><div class="fc-hint">اضغطي للقلب ↻</div></div>
      <div class="fc-face fc-back"><div class="fc-title sm">${c.icon} ${c.title}</div><p>${c.text}</p></div></button></div>`).join('')}</div>`,
  init:flipInit
};

R.sort = {
  html:s=>{
    const bk=b=>`<button class="bucket" data-b="${b.key}" style="--c:${b.color}"><div class="bk-head"><span class="bk-ic">${b.icon}</span><span>${b.label}</span><span class="bk-count">0</span></div><div class="bk-list"><div class="bk-empty">اضغطي هنا</div></div></button>`;
    return `<p class="lead rv">${s.prompt}</p>
      <div class="sort-wrap rv">${bk(s.buckets[0])}
        <div class="sort-center"><div class="sort-prog"></div><div class="sort-card"></div><div class="sort-hint">👉 اختاري العمود المناسب 👈</div><div class="feedback"></div></div>
        ${bk(s.buckets[1])}</div>`;
  },
  init:(sec,s)=>{
    const card=$('.sort-card',sec), prog=$('.sort-prog',sec), fb=$('.feedback',sec);
    const items=shuffle(s.items.slice()); let i=0;
    const show=()=>{ const it=items[i]; card.innerHTML=`<div class="sc-ic">${it.icon||'❔'}</div><div>${it.t}</div>`; retrigger(card,'enter'); prog.textContent=`${i+1} / ${items.length}`; };
    show();
    $$('.bucket',sec).forEach(b=>b.onclick=()=>{
      if(i>=items.length) return;
      const it=items[i];
      if(it.b===b.dataset.b){
        const list=$('.bk-list',b), e=$('.bk-empty',list); e&&e.remove();
        const chip=document.createElement('div'); chip.className='bk-chip'; chip.textContent=`${it.icon||''} ${it.t}`; list.appendChild(chip);
        const c=$('.bk-count',b); c.textContent=+c.textContent+1;
        i++; setFb(fb,true,MSG.short);
        if(i===items.length){ card.innerHTML=`<div class="sc-ic">🎉</div><div>${MSG.allDone}</div>`; retrigger(card,'enter'); prog.textContent='✓'; $('.sort-hint',sec).style.visibility='hidden'; celebrate(card); }
        else { sound.ding(); show(); }
      } else { shake(card); sound.wrong(); setFb(fb,false); }
    });
  }
};

R.reveal = {
  html:s=>`<div class="q-card rv"><span class="q-ic">${s.qIcon||'🤔'}</span><p>${s.question}</p></div>
    <div class="reveal-grid rv" style="--n:${s.cols||s.items.length};--h:${s.h||300}px">${s.items.map((it,k)=>`<button class="rev"><div class="rev-cover">${k+1}<small>اضغطي للكشف</small></div>
      <div class="rev-content"><div class="rev-ic">${it.icon}</div><div class="rev-t">${it.t}</div>${it.d?`<p>${it.d}</p>`:''}</div></button>`).join('')}</div>
    <div class="center-row rv"><button class="btn ghost rev-all">👀 إظهار الكل</button></div>`,
  init:sec=>{
    const open=r=>{ if(r.classList.contains('open')) return; r.classList.add('open'); sound.pop(); if(!$$('.rev:not(.open)',sec).length) sound.ding(); };
    $$('.rev',sec).forEach(r=>r.onclick=()=>open(r));
    $('.rev-all',sec).onclick=()=>$$('.rev',sec).forEach((r,i)=>setTimeout(()=>open(r),i*250));
  }
};

R.compare = {
  html:s=>`<div class="cmp rv">
      <div class="cmp-head"><div></div>${s.cols.map(c=>`<div class="cmp-col" style="--c:${c.color}"><div class="cmp-ic">${c.icon}</div><div class="cmp-name">${c.name}</div><div class="cmp-an">${c.analogy}</div></div>`).join('')}</div>
      ${s.rows.map(r=>`<div class="cmp-row"><div class="cmp-k">${r.k}</div><div class="cmp-v">${r.a}</div><div class="cmp-v">${r.b}</div></div>`).join('')}
    </div>
    <div class="center-row rv"><button class="btn primary cmp-next">▶ وجه المقارنة التالي</button><button class="btn ghost cmp-all">👀 الكل</button></div>`,
  init:sec=>{
    const rows=$$('.cmp-row',sec), btn=$('.cmp-next',sec); let i=0;
    const step=()=>{ if(i<rows.length){ rows[i++].classList.add('show'); sound.pop(); } if(i>=rows.length){ btn.disabled=true; btn.textContent='✓ اكتملت المقارنة'; } };
    btn.onclick=step; $('.cmp-all',sec).onclick=()=>{ while(i<rows.length) step(); };
  }
};

R.match = {
  html:s=>{ const order=shuffle(s.pairs.map((_,k)=>k));
    return `<p class="lead rv">${s.prompt}</p>
    <div class="match rv"><div class="m-col">${s.pairs.map((p,k)=>`<button class="m-item term" data-k="${k}">${p.a}</button>`).join('')}</div>
      <div class="m-col">${order.map(k=>`<button class="m-item def" data-k="${k}">${s.pairs[k].b}</button>`).join('')}</div></div>`; },
  init:(sec,s)=>{
    let selT=null, selD=null, done=0; const lead=$('.lead',sec);
    const tryPair=()=>{
      if(!selT||!selD) return;
      const a=selT, b=selD; selT=selD=null; a.classList.remove('sel'); b.classList.remove('sel');
      if(a.dataset.k===b.dataset.k){
        done++; const c=PALETTE[(done-1)%PALETTE.length];
        [a,b].forEach(x=>{ x.classList.add('matched'); x.style.setProperty('--mc',c); x.dataset.badge=done; });
        if(done===s.pairs.length){ lead.innerHTML='🎉 '+MSG.allDone; lead.classList.add('ok-text'); celebrate($('.match',sec)); } else sound.ding();
      } else { shake(a); shake(b); sound.wrong(); }
    };
    const pick=(el,isTerm)=>{
      if(isTerm){ if(selT) selT.classList.remove('sel'); selT = selT===el?null:el; selT&&selT.classList.add('sel'); }
      else      { if(selD) selD.classList.remove('sel'); selD = selD===el?null:el; selD&&selD.classList.add('sel'); }
      tryPair();
    };
    $$('.term',sec).forEach(t=>t.onclick=()=>pick(t,true));
    $$('.def',sec).forEach(d=>d.onclick=()=>pick(d,false));
  }
};

R.tf = {
  html:s=>`<div class="tf-list">${s.items.map((it,k)=>`<div class="tf-row rv" data-k="${k}"><div class="tf-n">${k+1}</div>
      <div><p class="tf-t">${it.t}</p><div class="tf-why"></div></div>
      <div class="tf-btns"><button class="tf-b yes" data-v="1">✔ صح</button><button class="tf-b no" data-v="0">✖ خطأ</button></div></div>`).join('')}</div>`,
  init:(sec,s)=>{
    $$('.tf-row',sec).forEach(row=>{
      const it=s.items[+row.dataset.k], why=$('.tf-why',row);
      $$('.tf-b',row).forEach(b=>b.onclick=()=>{
        if((b.dataset.v==='1')===it.a){ row.classList.add('solved'); b.classList.add('right'); why.className='tf-why show'; why.innerHTML='✓ '+(it.why||MSG.correct); celebrate(b); }
        else { shake(row); sound.wrong(); why.className='tf-why show bad'; why.textContent=MSG.wrong; }
      });
    });
  }
};

/* 🧪 محاكي أنواع الواجهات */
R.simui = {
  html:s=>`<div class="sim">
    <div class="sim-tabs rv">${s.tabs.map((t,k)=>`<button class="sim-tab" data-k="${k}" style="--c:${t.color}"><span>${t.icon}</span><b>${t.name}</b><small>${t.en}</small></button>`).join('')}</div>
    <div class="sim-stage rv">
      <div class="sim-view v-cli" data-v="0"><div class="cli-lines"><div class="cl"><span class="pr">C:\student&gt; </span><span class="caret"></span></div></div><button class="btn primary cli-go">⌨️ اكتبي الأمر</button></div>
      <div class="sim-view v-gui" data-v="1">
        <div class="gphone"><div class="gapps">${[['🗺️','الخرائط'],['📷','الكاميرا'],['🎵','الصوتيات'],['☁️','الطقس'],['📚','مدرستي'],['🛒','المتجر'],['💬','الرسائل'],['📅','التقويم'],['⚙️','الإعدادات']].map(a=>`<button class="gapp"><i>${a[0]}</i>${a[1]}</button>`).join('')}</div>
          <div class="gopen"><div class="gi"></div><div class="gn"></div><button>← رجوع</button></div></div>
        <div class="gui-note">👆 اضغطي على أي أيقونة لفتح التطبيق<br><br>الأيقونات والأزرار والنوافذ… كلها <b>عناصر رسومية</b> نختار منها بدل كتابة الأوامر.</div>
      </div>
      <div class="sim-view v-voice" data-v="2">
        <button class="vmic">🎙️</button>
        <div class="wave">${Array.from({length:18},(_,k)=>`<i style="--k:${k}"></i>`).join('')}</div>
        <div class="vbub me">«اقترح عليّ ألوانًا هادئة لموقع مدرستي» 🎨</div>
        <div class="vbub ai">✨ جرّبي البنفسجي مع الفيروزي والوردي <span class="sw"><i style="--c:#5B5BF7"></i><i style="--c:#13C6A3"></i><i style="--c:#FF5FA2"></i></span></div>
      </div>
      <div class="sim-def">👈 اختاري نوعًا من القائمة لتجربته</div>
    </div></div>`,
  init:(sec,s)=>{
    const tabs=$$('.sim-tab',sec), views=$$('.sim-view',sec), def=$('.sim-def',sec);
    const pick=(t,quiet)=>{
      const k=+t.dataset.k; tabs.forEach(x=>x.classList.toggle('on',x===t)); views.forEach(v=>v.classList.toggle('on',+v.dataset.v===k));
      def.style.setProperty('--c',s.tabs[k].color); def.innerHTML=s.tabs[k].def; if(quiet) return; retrigger(def,'pop'); sound.pop();
      t.classList.add('seen'); if(!$$('.sim-tab:not(.seen)',sec).length && !sec._all){ sec._all=1; setTimeout(()=>{ sound.ding(); },300); }
    };
    tabs.forEach(t=>t.onclick=()=>pick(t));
    pick(tabs[0],true);
    // سطر الأوامر
    const lines=$('.cli-lines',sec), go=$('.cli-go',sec); let busy=false;
    const script=[['cmd','dir'],['out','📁 Documents      📁 Pictures'],['out','📄 project.xd     📄 notes.txt'],['cmd','mkdir website'],['out','✔ The folder "website" was created.'],['cmd','cd website']];
    const add=(cls,txt)=>{ const d=document.createElement('div'); d.className='cl '+cls; d.textContent=txt; lines.appendChild(d); return d; };
    go.onclick=async()=>{
      if(busy) return; busy=true; lines.innerHTML=''; go.disabled=true;
      for(const [type,txt] of script){
        if(type==='cmd'){ const d=add('','');const p=document.createElement('span');p.className='pr';p.textContent='C:\\student> ';d.appendChild(p);const tx=document.createElement('span');d.appendChild(tx);const c=document.createElement('span');c.className='caret';d.appendChild(c);
          for(const ch of txt){ tx.textContent+=ch; sound.key(); await new Promise(r=>setTimeout(r,110)); } await new Promise(r=>setTimeout(r,350)); c.remove(); }
        else { add('out',txt); await new Promise(r=>setTimeout(r,300)); }
      }
      const d=add('',''); d.innerHTML='<span class="pr">C:\\student\\website&gt; </span><span class="caret"></span>';
      sound.ding(); busy=false; go.disabled=false; go.textContent='↻ أعيدي';
    };
    // الرسومية
    const op=$('.gopen',sec);
    $$('.gapp',sec).forEach(a=>a.onclick=()=>{ $('.gi',op).textContent=$('i',a).textContent; $('.gn',op).textContent=a.textContent.replace($('i',a).textContent,''); op.classList.add('on'); sound.pop(); });
    $('button',op).onclick=e=>{ e.stopPropagation(); op.classList.remove('on'); };
    // الصوت
    const vv=$('.v-voice',sec), me=$('.vbub.me',sec), ai=$('.vbub.ai',sec);
    $('.vmic',sec).onclick=()=>{
      me.classList.remove('on'); ai.classList.remove('on'); vv.classList.add('listen'); sound.pop();
      setTimeout(()=>{ me.classList.add('on'); },900);
      setTimeout(()=>{ vv.classList.remove('listen'); ai.classList.add('on'); sound.ding(); },2600);
    };
  }
};

/* 🤝 شكل فن */
R.venn = {
  html:s=>`<div class="venn-wrap">
    <div class="venn-side rv"><p class="lead">${s.prompt}</p><div class="sort-prog"></div><div class="sort-card" style="min-height:260px"></div><div class="feedback"></div></div>
    <div class="venn rv">
      <div class="vz ux" data-z="ux"><span class="vz-t">💜 مصممة UX</span><div class="vz-list"></div></div>
      <div class="vz ui" data-z="ui"><span class="vz-t">🎨 مصممة UI</span><div class="vz-list"></div></div>
      <button class="vz-both" data-z="both"><span class="vz-t">🤝 مشتركة</span><div class="vz-list"></div></button>
    </div></div>`,
  init:(sec,s)=>{
    const card=$('.sort-card',sec), prog=$('.sort-prog',sec), fb=$('.feedback',sec);
    const items=shuffle(s.items.slice()); let i=0;
    const col={ui:'#5B5BF7',ux:'#FF6B57',both:'#13C6A3'};
    const show=()=>{ card.innerHTML=`<div class="sc-ic">🧩</div><div>${items[i].t}</div>`; retrigger(card,'enter'); prog.textContent=`${i+1} / ${items.length}`; };
    show();
    $$('[data-z]',sec).forEach(z=>z.addEventListener('click',e=>{
      e.stopPropagation(); if(i>=items.length) return;
      const it=items[i];
      if(it.z===z.dataset.z){
        const c=document.createElement('div'); c.className='vchip'; c.style.setProperty('--c',col[it.z]); c.textContent=it.t; $('.vz-list',z).appendChild(c);
        i++; setFb(fb,true,MSG.short);
        if(i===items.length){ card.innerHTML=`<div class="sc-ic">🎉</div><div>${MSG.allDone}</div>`; prog.textContent='✓'; celebrate(card); }
        else { sound.ding(); show(); }
      } else { shake(card); sound.wrong(); setFb(fb,false); }
    }));
  }
};

/* 🛠️ مختبر إصلاح الواجهة */
R.fixui = {
  html:s=>`<div class="fix">
    <div class="fix-side rv"><p class="lead">${s.prompt}</p>
      ${s.fixes.map(f=>`<button class="fix-t" data-c="${f.c}"><span class="tg"></span><span>${f.icon} ${f.t}</span></button>`).join('')}
      <div class="meter">😵‍💫 الحيرة <div class="mt-bar"><i></i></div><span class="mt-emo">😵</span></div>
    </div>
    <div class="fix-canvas rv"><div class="fc-label">Dialog · Delete Project</div>
      <div class="dlg-mock"><div class="dm-ic">🗑️</div><div class="dm-t">تنبيه</div>
        <div class="dm-p">هل انت متأكد من العملية؟</div>
        <div class="dm-p2">سيتم حذف «مشروع الوحدة» <b>نهائيًا</b> ولا يمكن استرجاعه. هل تريدين المتابعة؟</div>
        <div class="dm-btns"><button class="dm-b del">حذف</button><button class="dm-b cancel">إلغاء</button></div></div>
      <div class="fix-toast"></div>
      <div class="explain" style="max-width:900px">💡 ${s.explain}</div>
    </div></div>`,
  init:(sec,s)=>{
    const dlg=$('.dlg-mock',sec), toast=$('.fix-toast',sec), bar=$('.mt-bar i',sec), emo=$('.mt-emo',sec);
    const emos=['😵','😣','😕','🙂','😀','🤩'];
    const upd=()=>{ const n=$$('.fix-t.on',sec).length; bar.style.width=(100-n*20)+'%'; emo.textContent=emos[n];
      if(n===s.fixes.length && !sec._done){ sec._done=1; $('.explain',sec).classList.add('show'); celebrate(dlg); } };
    $$('.fix-t',sec).forEach(b=>b.onclick=()=>{ b.classList.toggle('on'); dlg.classList.toggle(b.dataset.c,b.classList.contains('on')); b.classList.contains('on')?sound.ding():sound.pop(); upd(); });
    const say=(t,ok)=>{ toast.textContent=t; toast.className='fix-toast '+(ok?'ok':'bad'); retrigger(toast,'pop'); };
    $('.del',sec).onclick=()=>{ if(dlg.classList.contains('fx-color')){ say('🛑 الزر الأحمر يحذّركِ بوضوح… فلن تضغطيه بالخطأ ✓',true); sound.ding(); } else { say('😱 أووه! تم حذف المشروع… كنتِ تقصدين «إلغاء»؟ الزران متشابهان!',false); shake(dlg); sound.wrong(); } };
    $('.cancel',sec).onclick=()=>{ if(dlg.classList.contains('fx-color')&&dlg.classList.contains('fx-size')){ say('✅ تم الإلغاء بأمان — التصميم الواضح حمى المشروع 👏',true); sound.success(); } else if(Math.random()<.55){ say('😵 ضغطة خاطئة! الزر صغير وملتصق بزر «حذف»…',false); shake(dlg); sound.wrong(); } else { say('🤔 تم الإلغاء… لكن هل كنتِ متأكدة أي زر ضغطتِ؟',false); sound.pop(); } };
    upd();
  }
};

/* 🐝 خلية العوامل */
R.honey = {
  html:s=>{ const P=[[536,142],[662,360],[536,578],[284,578],[158,360],[284,142]];
    return `<div class="honey-wrap">
    <div class="honey rv">
      ${s.items.map((it,k)=>`<button class="hx" data-k="${k}" style="left:${P[k][0]}px;top:${P[k][1]}px;--c:${it.color}"><div class="hx-in"><span class="hi">${it.icon}</span><b>${it.t}</b><small>${it.en}</small></div></button>`).join('')}
      <button class="hx center" style="left:410px;top:360px"><div class="hx-in"><span class="hi">💎</span><b>${s.center.t}</b><small>${s.center.en}</small></div></button>
    </div>
    <div class="hp rv"><div class="hp-ic">🐝</div><h3>اكتشفي الخلية</h3><p>اضغطي على كل خلية لتعرفي عاملًا من العوامل التي تميّز تصميم تجربة المستخدم… وعندما تكتمل تتوهج <b>القيمة</b> 💎</p><div class="hp-count">0 / ${s.items.length}</div></div></div>`; },
  init:(sec,s)=>{
    const hp=$('.hp',sec), ctr=$('.hx.center',sec);
    const showP=(c,html)=>{ hp.style.setProperty('--c',c); hp.innerHTML=html; retrigger(hp,'enter'); };
    $$('.hx[data-k]',sec).forEach(h=>h.onclick=()=>{
      const it=s.items[+h.dataset.k]; h.classList.add('on'); sound.pop();
      const n=$$('.hx.on[data-k]',sec).length;
      showP(it.color,`<div class="hp-ic">${it.icon}</div><h3>${it.t}<small>${it.en}</small></h3><p>${it.d}</p><div class="hq">❓ ${it.q}</div><div class="hp-count">${n} / ${s.items.length}</div>`);
      if(n===s.items.length && !sec._glow){ sec._glow=1; ctr.classList.add('glow'); setTimeout(()=>celebrate(ctr,true),300); }
    });
    ctr.onclick=()=>{ sound.ding(); showP('#17153A',`<div class="hp-ic">💎</div><h3>${s.center.t}<small>${s.center.en}</small></h3><p>${s.center.d}</p>`); };
  }
};

/* 🧮 المعادلة */
R.equation = {
  html:s=>`<div class="eq rv">${s.parts.map((p,k)=>`<button class="eq-c" data-k="${k}" style="--c:${p.color}"><span class="ei">${p.icon}</span><b>${p.t}</b><small>${p.en}</small><span class="eqq">${k===2?'؟ النتيجة':'اضغطي'}</span></button>`).join('').replace(/<\/button><button class="eq-c" data-k="1"/,'</button><span class="eq-op">+</span><button class="eq-c" data-k="1"').replace(/<\/button><button class="eq-c" data-k="2"/,'</button><span class="eq-op">=</span><button class="eq-c" data-k="2"')}</div>
    <div class="note-card rv" style="opacity:.15;transition:opacity .5s">${s.note}</div>`,
  init:sec=>{
    $$('.eq-c',sec).forEach(c=>c.onclick=()=>{ if(c.classList.contains('open')) return; c.classList.add('open');
      if(!$$('.eq-c:not(.open)',sec).length){ $('.note-card',sec).style.opacity=1; celebrate(c); } else sound.pop(); });
  }
};

/* ⭐ تقييم المتجرين */
R.audit = {
  html:s=>`<div class="audit">
    <div class="au-shop rv"><div class="au-bar"><span class="dots"><i></i><i></i><i></i></span><span class="url"></span></div>
      <div class="shop a on" data-s="0">
        <div class="s-top"><span class="s-logo">🛋️ بيت الأناقة</span><div class="s-search">🔍 ابحثي عن منتج…</div><span class="s-cart">🛒 2</span></div>
        <div class="s-nav"><span>الرئيسية</span><span>غرف المعيشة</span><span>غرف النوم</span><span>المكاتب</span><span>العروض</span></div>
        <div class="s-ban"><div><b>خصم 30٪ على الكنب</b><small>توصيل مجاني خلال 3 أيام 🚚 · دفع آمن 🔒</small></div><span>تسوّقي الآن</span></div>
        <div class="s-grid">${[['🛋️','كنبة مريحة','1,299 ر.س','⭐ 4.8 (320)'],['🪑','كرسي مكتب','349 ر.س','⭐ 4.6 (190)'],['🛏️','سرير مزدوج','1,890 ر.س','⭐ 4.9 (410)']].map(p=>`<div class="s-card"><div class="s-img">${p[0]}</div><div class="s-name">${p[1]}</div><div class="s-price">${p[2]}</div><div class="s-rate">${p[3]}</div><div class="s-add">أضيفي للسلة</div></div>`).join('')}</div>
      </div>
      <div class="shop b" data-s="1">
        <div class="s-top">${['الرئيسية','منتجات','منتجات2','عروض','عروض جديدة','اتصل','عنا','سياسة','دخول','تسجيل','المزيد','المزيد+'].map(x=>`<span>${x}</span>`).join('')}</div>
        <div class="s-mq">🔥🔥 تخفيضات!!! اضغط هنا الآن!!! 🔥🔥</div>
        <div class="s-grid">${['🛋️','🪑','🛏️','🚪','💡','🪞','🧸','🖼️'].map(e=>`<div class="s-card"><div class="s-img">${e}</div>منتج رائع<div class="s-add">اضغط</div></div>`).join('')}</div>
        <div class="s-pop">✖ اشترك الآن في النشرة!!!<small>(لا يوجد زر إغلاق واضح)</small></div>
      </div>
    </div>
    <div class="au-side rv">
      <div class="au-tabs"><button class="au-tab on" data-s="0">🛋️ المتجر (أ)</button><button class="au-tab" data-s="1">🎪 المتجر (ب)</button></div>
      <div class="au-rows">${s.factors.map((f,k)=>`<div class="au-row" data-f="${k}"><span class="an">${f}</span><span class="stars">${[1,2,3,4,5].map(v=>`<button class="star" data-v="${v}">★</button>`).join('')}</span></div>`).join('')}</div>
      <div class="au-score"><div class="ring"><b>0%</b></div><div><div class="au-verdict">قيّمي العوامل بالنجوم ⭐</div><div class="au-vs"></div></div></div>
    </div></div>`,
  init:(sec,s)=>{
    const urls=['🔒 www.bait-alanaqa.sa','⚠️ http://best-offers-2026.biz/shop!!!'];
    const R2=[Array(s.factors.length).fill(0),Array(s.factors.length).fill(0)]; let cur=0;
    const pct=a=>Math.round(a.reduce((x,y)=>x+y,0)/(a.length*5)*100);
    const verdict=p=>p===0?'قيّمي العوامل بالنجوم ⭐':p>=80?'🤩 تجربة مستخدم ممتازة!':p>=60?'🙂 تجربة جيدة تحتاج تحسينات بسيطة':p>=40?'😕 تجربة متوسطة… تحتاج تطويرًا':'😖 تجربة مستخدم سيئة';
    const draw=()=>{
      $$('.au-row',sec).forEach((r,k)=>$$('.star',r).forEach(st=>st.classList.toggle('on',+st.dataset.v<=R2[cur][k])));
      const p=pct(R2[cur]), ring=$('.ring',sec); ring.style.setProperty('--v',p); ring.style.setProperty('--c',p>=60?'#12B886':p>=40?'#FFC542':'#FF4D6A'); $('.ring b',sec).textContent=p+'%';
      $('.au-verdict',sec).textContent=verdict(p);
      const a=pct(R2[0]), b=pct(R2[1]);
      $('.au-vs',sec).innerHTML=(a&&b)?`المتجر (أ) <b>${a}%</b> 🆚 المتجر (ب) <b>${b}%</b> — ${a===b?'تعادل!':(a>b?'الفوز للمتجر (أ) 🏆':'الفوز للمتجر (ب) 🏆')}`:'قيّمي المتجرين للمقارنة بينهما';
      $('.au-bar .url',sec).textContent=urls[cur];
    };
    $$('.au-tab',sec).forEach(t=>t.onclick=()=>{ cur=+t.dataset.s; $$('.au-tab',sec).forEach(x=>x.classList.toggle('on',x===t)); $$('.shop',sec).forEach(x=>x.classList.toggle('on',+x.dataset.s===cur)); sound.pop(); draw(); });
    $$('.au-row',sec).forEach(r=>$$('.star',r).forEach(st=>st.onclick=()=>{ R2[cur][+r.dataset.f]=+st.dataset.v; sound.tick(); draw();
      if(R2[0].every(Boolean)&&R2[1].every(Boolean)&&!sec._cel){ sec._cel=1; celebrate($('.au-score',sec),true); } }));
    draw();
  }
};

/* 🤝 مهام المجموعات */
function taskTeams(){
  if(LESSON.groups.length) return LESSON.groups.slice(0,8).map((g,i)=>({ name:g.name, color:g.color||PALETTE[i%8], icon:(LESSON.teams[i]&&LESSON.teams[i].icon)||'🧩', members:g.members||[] }));
  if(LESSON.compMode==='groups' && LESSON.teams.length) return LESSON.teams.slice(0,8);
  return DEFAULT_TEAMS.slice(0,8);
}
R.groups = {
  html:s=>{ const T=taskTeams(), n=Math.min(4,T.length);
    return `<div class="grp-top rv"><p class="lead">${s.prompt}</p><div class="timer-slot"></div></div>
    <div class="cards grp8 rv" style="--n:${n};--h:${T.length>4?255:420}px">${T.map((g,k)=>`<div class="fc-wrap"><button class="fc" style="--c:${g.color}">
      <div class="fc-face fc-front"><div class="fc-ic">${g.icon}</div><div class="fc-title">${esc(g.name)}</div>${g.members&&g.members.length?`<div class="fc-mem">${g.members.map(esc).join('، ')}</div>`:''}<div class="fc-hint">اضغطي لكشف المهمة 🎯</div></div>
      <div class="fc-face fc-back"><p>${(s.tasks||[])[k]||'مهمة حرة تحددها المعلمة'}</p></div></button></div>`).join('')}</div>`; },
  init:(sec,s)=>{ flipInit(sec); mountTimer($('.timer-slot',sec), s.seconds||180, { onEnd:()=>showAward() }); }
};

R.leaderboard = {
  html:()=>`<div class="lb rv"></div><div class="center-row rv"><button class="btn primary lg lb-go">🥁 أعلني الفائز</button></div>`,
  draw(sec, reveal){
    if(!COMP){ $('.lb',sec).innerHTML=''; return; }
    const max=Math.max(1,...scores), top=Math.max(...scores);
    const order=LESSON.teams.map((t,k)=>k).sort((a,b)=>scores[b]-scores[a]).slice(0,8);
    $('.lb',sec).innerHTML=order.map((k,pos)=>{ const t=LESSON.teams[k], win=reveal&&top>0&&scores[k]===top;
      return `<div class="lb-row ${win?'win':''}" style="--c:${t.color}"><span class="lb-pos">${win?'👑':pos+1}</span><span class="lb-name">${t.icon} ${esc(t.name)}</span>
        <div class="lb-track"><div class="lb-bar" style="width:${reveal?Math.max(4,scores[k]/max*100):4}%"></div></div><span class="lb-pts">${reveal?scores[k]:'؟'}</span></div>`; }).join('');
  },
  init:sec=>{ $('.lb-go',sec).onclick=()=>{
    R.leaderboard.draw(sec,true); sound.success(); setTimeout(()=>confetti.rain(220),300);
    const w=$$('.lb-row.win .lb-name',sec); if(w.length) $('.lb-go',sec).textContent='🏆 الفائز: '+w.map(x=>x.textContent).join(' و ');
  }; },
  enter:sec=>{ R.leaderboard.draw(sec,false); $('.lb-go',sec).textContent='🥁 أعلني الفائز'; }
};

R.challenge = {
  html:s=>`<div class="ch-wrap">
    <div class="ch-left rv"><div class="timer-slot"></div><div class="ch-score">✅ إجابات صحيحة: <b>0</b></div></div>
    <div class="rv"><div class="ch-card"><div class="ch-num"></div><p class="ch-q"></p><div class="ch-a"></div></div>
      <div class="ch-btns"><button class="btn ghost ch-show">👀 الإجابة</button><button class="btn ok ch-plus">✓ صحيحة +1</button><button class="btn primary ch-next">التالي ⬅</button></div></div></div>`,
  init:(sec,s)=>{
    let i=0, score=0; const q=$('.ch-q',sec), a=$('.ch-a',sec), num=$('.ch-num',sec), sc=$('.ch-score b',sec), plus=$('.ch-plus',sec);
    const show=()=>{ num.textContent=`السؤال ${i+1} من ${s.questions.length}`; q.textContent=s.questions[i].q; a.textContent='💡 '+s.questions[i].a; a.classList.remove('show'); plus.disabled=false; retrigger(q,'enter'); };
    show();
    $('.ch-show',sec).onclick=()=>{ a.classList.add('show'); sound.pop(); };
    plus.onclick=()=>{ score++; sc.textContent=score; plus.disabled=true; retrigger(sc,'shake'); sound.ding(); showAward(1); };
    $('.ch-next',sec).onclick=()=>{ i=(i+1)%s.questions.length; show(); };
    mountTimer($('.timer-slot',sec), s.seconds||60, { big:true,
      onEnd:()=>{ num.textContent='⏰ انتهى الوقت!'; q.textContent=`النتيجة: ${score} إجابات صحيحة`; a.classList.remove('show'); if(score>0) confetti.burst(innerWidth/2,innerHeight/2,120); },
      onReset:()=>{ score=0; sc.textContent=0; i=0; show(); } });
  }
};

R.review = {
  html:s=>{
    const n=s.nodes.length, pts=s.nodes.map((_,k)=>{ const a=(k*360/n-90)*Math.PI/180; return [50+Math.cos(a)*40, 50+Math.sin(a)*40]; });
    return `<div class="map rv">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">${pts.map(p=>`<line x1="50" y1="50" x2="${p[0]}" y2="${p[1]}"/>`).join('')}</svg>
      ${s.nodes.map((nd,k)=>`<button class="node" data-k="${k}" style="left:${pts[k][0]}%;top:${pts[k][1]}%;--c:${nd.color}">${nd.icon} ${nd.t}</button>`).join('')}
      <div class="map-center"><div class="mc-ic">${s.center.icon}</div><div class="mc-t">${s.center.t}</div><div class="mc-d">${s.center.d}</div></div></div>`;
  },
  init:(sec,s)=>{
    const c=$('.map-center',sec);
    $$('.node',sec).forEach(nb=>nb.onclick=()=>{
      const nd=s.nodes[+nb.dataset.k]; nb.classList.add('seen');
      c.style.background=`linear-gradient(145deg,${nd.color},#17153A)`;
      c.innerHTML=`<div class="mc-ic">${nd.icon}</div><div class="mc-t">${nd.t}</div><div class="mc-d">${nd.d}</div>`; retrigger(c,'enter'); sound.pop();
      if(!$$('.node:not(.seen)',sec).length) setTimeout(()=>celebrate(c,true),300);
    });
  }
};

R.closing = {
  html:s=>`<div class="closing"><div class="cl-ic rv">${s.icon||'🎨'}</div><h1 class="cl-title rv">${s.title}</h1><p class="cl-msg rv">${s.message}</p>
    <div class="cl-tips rv">${s.tips.map(t=>`<span class="chip lg">${t}</span>`).join('')}</div>
    <div class="cl-rate rv"><span>كيف تقيّمين فهمكِ للدرس؟</span>${s.rating.map((r,k)=>`<button class="rate" data-k="${k}">${r.e}</button>`).join('')}</div>
    <div class="rate-msg"></div></div>`,
  init:(sec,s)=>$$('.rate',sec).forEach(b=>b.onclick=()=>{
    $$('.rate',sec).forEach(x=>x.classList.remove('on')); b.classList.add('on');
    const m=$('.rate-msg',sec); m.textContent=s.rating[+b.dataset.k].m; retrigger(m,'shake'); sound.ding();
  }),
  enter:()=>setTimeout(()=>confetti.rain(),700)
};

/* ======================================================================
   🧩 قوالب إضافية (الدرس الثاني والثالث)
   ====================================================================== */
const NS='http://www.w3.org/2000/svg';
const svgEl=(tag,o)=>{ const el=document.createElementNS(NS,tag); for(const k in o) el.setAttribute(k,o[k]); return el; };
const isActive=sec=>sec.classList.contains('active');

/* 🔁 مراجعة الدرس السابق */
R.recap = {
  html:s=>`<div class="recap rv">${s.questions.map((q,k)=>`<button class="rc" style="--c:${PALETTE[k%PALETTE.length]}">
      <div class="rc-top"><span class="rc-kind">${q.kind}</span><span class="rc-n">${k+1}</span></div>
      <div class="rc-q">${q.q}</div><div class="rc-hint">💡 اضغطي لإظهار الإجابة</div><div class="rc-a">${q.a}</div></button>`).join('')}</div>`,
  init:sec=>$$('.rc',sec).forEach(c=>c.onclick=()=>{ c.classList.toggle('open'); if(c.classList.contains('open')) sound.pop(); })
};

/* 🧗 الترتيب */
R.order = {
  html:s=>`<p class="lead rv">${s.prompt}</p>
    <div class="slots rv">${s.items.map((_,k)=>`<div class="slot" data-k="${k}"><span class="slot-n">${k+1}</span></div>`).join('<span class="slot-arrow">←</span>')}</div>
    <div class="pool rv"></div>
    <div class="order-info rv"><span class="oi-ic">${s.infoIcon||'💡'}</span><p>${s.intro||'كل خطوة تضعينها في مكانها الصحيح ستكشف شرحها.'}</p></div>`,
  init:(sec,s)=>{
    const pool=$('.pool',sec), info=$('.order-info p',sec), slots=$$('.slot',sec); let idx=0;
    let order=s.items.map((_,k)=>k); do{ shuffle(order); }while(order.length>1 && order.every((v,i)=>v===i));
    order.forEach(k=>{
      const it=s.items[k], b=document.createElement('button'); b.className='chip-stage'; b.innerHTML=`${it.icon} ${it.t}`;
      b.onclick=()=>{
        if(k===idx){
          const sl=slots[k]; sl.classList.add('filled'); sl.innerHTML=`<div class="placed"><span class="pi">${it.icon}</span><b>${it.t}</b><small>${it.en||''}</small></div>`;
          sl.onclick=()=>{ slots.forEach(x=>x.classList.remove('sel')); sl.classList.add('sel'); info.innerHTML=it.info; };
          b.classList.add('gone'); info.innerHTML=it.info; idx++;
          if(idx===s.items.length){ info.innerHTML='🎉 <b>'+MSG.allDone+'</b> — اضغطي على أي خطوة لمراجعتها.'; celebrate($('.slots',sec)); } else sound.ding();
        } else { shake(b); sound.wrong(); info.innerHTML='🤔 ليست هذه الخطوة التالية… فكّري: ماذا نفعل قبلها؟'; }
      };
      pool.appendChild(b);
    });
  }
};

/* 📍 استكشاف واجهة (نقاط ساخنة) + وضع الاختبار */
R.hotspot = {
  html:s=>`<div class="hs-wrap">
    <div class="hs-mock rv">${s.mock}</div>
    <div class="hs-side rv">
      <div class="hs-modes"><button class="hs-m on" data-m="x">🔍 استكشفي</button><button class="hs-m" data-m="q">🎯 اختبريني</button></div>
      <div class="hs-panel"><div class="hs-ic">👆</div><h3>${s.hint||'اضغطي على أي جزء في الشاشة لتتعرفي عليه'}</h3></div>
      <div class="hs-count"></div><div class="feedback"></div>
    </div></div>`,
  init:(sec,s)=>{
    const by=k=>s.items.find(i=>i.h===k), panel=$('.hs-panel',sec), fb=$('.feedback',sec), cnt=$('.hs-count',sec);
    let mode='x', seen=new Set(), queue=[], target=null, score=0;
    const stat=()=>{ cnt.textContent = mode==='x' ? `اكتشفتِ ${seen.size} من ${s.items.length}` : (target?`السؤال ${s.items.length-queue.length} من ${s.items.length} · ✅ ${score}`:''); };
    const show=it=>{ panel.innerHTML=`<div class="hs-ic">${it.n?`<span class="hs-num">${it.n}</span>`:'📍'}</div><h3>${it.t}${it.en?`<small>${it.en}</small>`:''}</h3>${it.d?`<p>${it.d}</p>`:''}`; retrigger(panel,'pop'); };
    const ask=()=>{
      if(!queue.length){ target=null; panel.innerHTML=`<div class="hs-ic">🏆</div><h3>أنهيتِ الاختبار!</h3><p>${score} إجابة صحيحة من ${s.items.length}</p>`; retrigger(panel,'pop'); celebrate(panel); stat(); return; }
      target=queue.shift(); panel.innerHTML=`<div class="hs-ic">🎯</div><h3>أين ${target.t}${target.en?`<small>${target.en}</small>`:''}؟</h3><p>اضغطي على مكانه في الشاشة</p>`; retrigger(panel,'pop'); stat();
    };
    $$('[data-h]',sec).forEach(el=>el.addEventListener('click',e=>{
      e.stopPropagation(); const it=by(el.dataset.h); if(!it) return;
      $$('[data-h].hs-on',sec).forEach(x=>x.classList.remove('hs-on')); el.classList.add('hs-on');
      if(mode==='x'){ seen.add(it.h); el.classList.add('hs-seen'); show(it); sound.pop(); stat(); if(seen.size===s.items.length&&!sec._all){ sec._all=1; setTimeout(()=>sound.ding(),200); } }
      else if(target){ if(it.h===target.h){ score++; setFb(fb,true,MSG.short); sound.ding(); setTimeout(ask,650); } else { shake(el); setFb(fb,false); sound.wrong(); } }
    }));
    $$('.hs-m',sec).forEach(b=>b.onclick=()=>{
      mode=b.dataset.m; $$('.hs-m',sec).forEach(x=>x.classList.toggle('on',x===b)); fb.textContent=''; $$('[data-h].hs-on',sec).forEach(x=>x.classList.remove('hs-on'));
      if(mode==='q'){ queue=shuffle(s.items.slice()); score=0; ask(); } else { target=null; panel.innerHTML=`<div class="hs-ic">👆</div><h3>${s.hint||'اضغطي على أي جزء في الشاشة لتتعرفي عليه'}</h3>`; stat(); }
      sound.pop();
    });
    stat();
  }
};

/* 🖼️ اختيار اللوحة الفنية Artboard */
const AB_INNER = {
  phone:`<div class="abi-status"><span>9:41</span><span>📶 🔋</span></div><div class="abi-head"></div><div class="abi-row"></div><div class="abi-row"></div><div class="abi-row"></div><div class="abi-row"></div><div class="abi-tab"></div>`,
  web:`<div class="abi-nav"><i></i><span></span><span></span><span></span></div><div class="abi-hero"></div><div class="abi-cards"><i></i><i></i><i></i></div>`,
  social:`<div class="abi-story"><div class="abi-av"></div><div class="abi-big"></div><div class="abi-cap"></div><div class="abi-cap s"></div></div>`,
  custom:`<div class="abi-empty">＋</div>`
};
R.artboard = {
  html:s=>`<div class="ab-wrap">
    <div class="ab-list rv">${s.presets.map((p,k)=>`<button class="ab-p" data-k="${k}"><span class="ab-i">${p.icon}</span><span><b>${p.t}</b><small>${p.en} · ${p.w}×${p.h}</small></span></button>`).join('')}
      <div class="ab-custom"><span>✏️ حجم مخصص</span><label>W<input type="number" class="ab-w" value="1280" min="50" max="4000"></label><label>H<input type="number" class="ab-h" value="800" min="50" max="4000"></label><button class="btn ghost ab-go">إنشاء</button></div></div>
    <div class="ab-stage rv"><div class="ab-board"><div class="ab-name">Artboard</div><div class="ab-in"><div class="abi-empty">👈 اختاري نوع اللوحة الفنية</div></div><div class="ab-dim"></div></div></div></div>`,
  init:(sec,s)=>{
    const board=$('.ab-board',sec), inn=$('.ab-in',sec), name=$('.ab-name',sec), dim=$('.ab-dim',sec);
    const set=(w,h,kind,label)=>{
      const sc=Math.min(860/w, 560/h); board.style.width=Math.round(w*sc)+'px'; board.style.height=Math.round(h*sc)+'px';
      board.dataset.kind=kind; inn.innerHTML=AB_INNER[kind]||AB_INNER.custom; name.textContent=label; dim.textContent=`${w} × ${h} px`; retrigger(inn,'pop'); sound.pop();
    };
    $$('.ab-p',sec).forEach(b=>b.onclick=()=>{ const p=s.presets[+b.dataset.k]; $$('.ab-p',sec).forEach(x=>x.classList.toggle('on',x===b)); set(p.w,p.h,p.kind,p.label||p.en+' – 1'); b.classList.add('seen');
      if(!$$('.ab-p:not(.seen)',sec).length && !sec._all){ sec._all=1; setTimeout(()=>sound.ding(),300); } });
    $('.ab-go',sec).onclick=()=>{ const w=Math.max(50,Math.min(4000,+$('.ab-w',sec).value||800)), h=Math.max(50,Math.min(4000,+$('.ab-h',sec).value||600)); $$('.ab-p',sec).forEach(x=>x.classList.remove('on')); set(w,h,'custom',`Custom – ${w}×${h}`); };
    board.style.width='560px'; board.style.height='400px';
  }
};

/* ✒️ برنامج تصميم مصغّر (يحاكي Adobe XD): رسم + خصائص + طبقات + مهام */
const MX_TOOLS={ select:['↖','تحديد','Select'], rect:['▭','مستطيل','Rectangle'], ellipse:['◯','قطع ناقص','Ellipse'], polygon:['△','مضلع','Polygon'], line:['╱','خط','Line'], pen:['✒','قلم','Pen'] };
const MX_NAMES={ rect:'Rectangle', ellipse:'Ellipse', polygon:'Polygon', line:'Line', path:'Path' };
const MX_ICON={ rect:'▭', ellipse:'◯', polygon:'△', line:'╱', path:'✒' };
const MX_SW=['#5B5BF7','#FF5FA2','#13C6A3','#FFC542','#FF6B57','#3DA5FF','#9B2C2C','#17153A','#FFFFFF','none'];
R.minixd = {
  html:s=>`<div class="mx-wrap">
    ${s.missions?`<div class="mx-miss rv"><span class="mm-h">🎯 المهام:</span>${s.missions.map((m,k)=>`<span class="mm" data-k="${k}">${m.t}</span>`).join('')}</div>`:''}
    <div class="mx rv" dir="ltr">
      <div class="mx-top"><span class="mx-logo">Xd</span><span class="mx-tab on">Design</span><span class="mx-tab">Prototype</span><span class="mx-tab">Share</span><span class="mx-file">${s.file||'Untitled — Web 1920 – 1'}</span><span class="mx-zoom">100%</span></div>
      <div class="mx-body">
        <div class="mx-tools">${(s.tools||Object.keys(MX_TOOLS)).map(t=>`<button class="mx-tool ${t==='select'?'on':''}" data-t="${t}" title="${MX_TOOLS[t][1]} ${MX_TOOLS[t][2]}">${MX_TOOLS[t][0]}</button>`).join('')}</div>
        <div class="mx-layers"><div class="mx-lh"><b>Layers</b><span>الطبقات</span></div>
          <div class="mx-lops">${s.groupOps?'<button class="mx-op" data-op="group" title="تجميع Object › Group">⧉ Group</button><button class="mx-op" data-op="ungroup" title="فك التجميع Object › Ungroup">⧈ Ungroup</button>':''}<button class="mx-op" data-op="up" title="نقل للأعلى">▲</button><button class="mx-op" data-op="down" title="نقل للأسفل">▼</button><button class="mx-op" data-op="del" title="حذف">🗑</button></div>
          <div class="mx-ab">‹ ARTBOARD · Web 1920 – 1</div><div class="mx-list"></div>
          ${s.groupOps?'<label class="mx-multi"><input type="checkbox"> تحديد متعدد (أو Shift)</label>':''}</div>
        <div class="mx-canvas no-swipe"><svg class="mx-svg" viewBox="-40 -30 880 580" preserveAspectRatio="xMidYMid meet"><rect class="mx-board" x="0" y="0" width="800" height="520"/><g class="mx-shapes"></g><g class="mx-ui"></g></svg><div class="mx-tip"></div></div>
        <div class="mx-props"></div>
      </div></div></div>`,
  init:(sec,s)=>{
    const svg=$('.mx-svg',sec), G=$('.mx-shapes',sec), UI=$('.mx-ui',sec), list=$('.mx-list',sec), props=$('.mx-props',sec), tip=$('.mx-tip',sec);
    let shapes=[], groups={}, sel=[], tool='select', uid=1, gid=1, drag=null, pen=null, anchors=null, multi=false, tipT;
    const counters={}, done=new Set();
    const TIPS={ select:'↖ اضغطي على شكل لتحديده واسحبيه لتحريكه · نقرتان على الشكل = وضع تحرير المسار', rect:'▭ اسحبي داخل اللوحة لرسم مستطيل', ellipse:'◯ اسحبي داخل اللوحة لرسم قطع ناقص (دائرة)', polygon:'△ اسحبي داخل اللوحة لرسم مضلع', line:'╱ اسحبي من نقطة البداية إلى نقطة النهاية لرسم خط مستقيم', pen:'✒ اضغطي لإضافة نقاط المسار… اضغطي على النقطة الأولى لإغلاق الشكل، أو Esc / نقرتين لإنهائه مفتوحًا' };
    const say=(t,warn)=>{ tip.textContent=t; tip.classList.toggle('warn',!!warn); retrigger(tip,'pop'); clearTimeout(tipT); if(warn) tipT=setTimeout(()=>{ tip.classList.remove('warn'); tip.textContent=TIPS[tool]; },2600); };
    const mission=key=>{ if(!s.missions) return; s.missions.forEach((m,k)=>{ if(m.k===key && !done.has(k)){ done.add(k); const el=$(`.mm[data-k="${k}"]`,sec); el.classList.add('ok'); retrigger(el,'pop'); sound.ding(); if(done.size===s.missions.length) setTimeout(()=>celebrate($('.mx',sec)),300); } }); };
    const mk=(type,o)=>{ counters[type]=(counters[type]||0)+1; const sh=Object.assign({ id:'s'+(uid++), type, name:MX_NAMES[type]+' '+counters[type], fill:'#C9C6F5', stroke:'#5B5BF7', sw:3, dash:false, da:14, gap:8, r:0, hidden:false, locked:false, group:null },o); shapes.push(sh); return sh; };
    const byId=id=>shapes.find(x=>x.id===id);
    const selShapes=()=>shapes.filter(x=>sel.includes(x.id));
    const pt=e=>{ const r=svg.getBoundingClientRect(), vb=svg.viewBox.baseVal, sc=Math.min(r.width/vb.width, r.height/vb.height), ox=(r.width-vb.width*sc)/2, oy=(r.height-vb.height*sc)/2; return { x:(e.clientX-r.left-ox)/sc+vb.x, y:(e.clientY-r.top-oy)/sc+vb.y }; };
    const bbox=sh=>{ if(sh.type==='line') return { x:Math.min(sh.x1,sh.x2), y:Math.min(sh.y1,sh.y2), w:Math.abs(sh.x2-sh.x1), h:Math.abs(sh.y2-sh.y1) };
      if(sh.type==='path'){ const xs=sh.pts.map(p=>p[0]), ys=sh.pts.map(p=>p[1]); return { x:Math.min(...xs), y:Math.min(...ys), w:Math.max(...xs)-Math.min(...xs), h:Math.max(...ys)-Math.min(...ys) }; }
      return { x:sh.x, y:sh.y, w:sh.w, h:sh.h }; };
    const pts=sh=>{ const b=bbox(sh); if(sh.type==='line') return [[sh.x1,sh.y1],[sh.x2,sh.y2]]; if(sh.type==='path') return sh.pts;
      if(sh.type==='polygon') return [[b.x+b.w/2,b.y],[b.x+b.w,b.y+b.h],[b.x,b.y+b.h]];
      if(sh.type==='ellipse') return [[b.x+b.w/2,b.y],[b.x+b.w,b.y+b.h/2],[b.x+b.w/2,b.y+b.h],[b.x,b.y+b.h/2]];
      return [[b.x,b.y],[b.x+b.w,b.y],[b.x+b.w,b.y+b.h],[b.x,b.y+b.h]]; };
    const move=(sh,dx,dy)=>{ if(sh.type==='line'){ sh.x1+=dx; sh.x2+=dx; sh.y1+=dy; sh.y2+=dy; } else if(sh.type==='path') sh.pts=sh.pts.map(p=>[p[0]+dx,p[1]+dy]); else { sh.x+=dx; sh.y+=dy; } };
    const geom=sh=>{
      let el;
      if(sh.type==='rect') el=svgEl('rect',{ x:sh.x, y:sh.y, width:Math.max(1,sh.w), height:Math.max(1,sh.h), rx:Math.min(sh.r,sh.w/2,sh.h/2) });
      else if(sh.type==='ellipse') el=svgEl('ellipse',{ cx:sh.x+sh.w/2, cy:sh.y+sh.h/2, rx:Math.max(1,sh.w/2), ry:Math.max(1,sh.h/2) });
      else if(sh.type==='polygon') el=svgEl('polygon',{ points:pts(sh).map(p=>p.join(',')).join(' ') });
      else if(sh.type==='line') el=svgEl('line',{ x1:sh.x1, y1:sh.y1, x2:sh.x2, y2:sh.y2 });
      else el=svgEl('path',{ d:'M'+sh.pts.map(p=>p.join(' ')).join(' L ')+(sh.closed?' Z':'') });
      const open=sh.type==='line'||(sh.type==='path'&&!sh.closed);
      for(const [k,v] of Object.entries({ fill:open?'none':sh.fill, stroke:sh.sw>0?sh.stroke:'none', 'stroke-width':sh.sw, 'stroke-dasharray':sh.dash?`${sh.da} ${sh.gap}`:'none', 'stroke-linecap':sh.dash?'butt':'round', 'stroke-linejoin':'round' })) el.setAttribute(k,v);
      el.dataset.id=sh.id; el.classList.add('mx-sh'); if(sh.hidden) el.style.display='none'; if(sh.locked) el.classList.add('locked');
      return el;
    };
    const drawShapes=()=>{ G.innerHTML=''; shapes.forEach(sh=>G.appendChild(geom(sh))); };
    const drawUI=()=>{
      UI.innerHTML='';
      selShapes().forEach(sh=>{ if(sh.hidden) return; const b=bbox(sh); UI.appendChild(svgEl('rect',{ x:b.x-6, y:b.y-6, width:b.w+12, height:b.h+12, class:'mx-selbox'+(sh.locked?' locked':'') })); });
      if(anchors){ const sh=byId(anchors); if(sh&&!sh.hidden) pts(sh).forEach(p=>UI.appendChild(svgEl('rect',{ x:p[0]-6, y:p[1]-6, width:12, height:12, class:'mx-anchor' }))); }
      if(pen && pen.pts.length){ UI.appendChild(svgEl('polyline',{ points:pen.pts.concat(pen.cur?[pen.cur]:[]).map(p=>p.join(',')).join(' '), class:'mx-penprev' }));
        pen.pts.forEach((p,i)=>UI.appendChild(svgEl('circle',{ cx:p[0], cy:p[1], r:i===0?9:6, class:'mx-pt'+(i===0?' first':'') }))); }
    };
    const rowHTML=(sh,child)=>`<div class="mx-row ${sel.includes(sh.id)?'on':''} ${sh.hidden?'hid':''} ${child?'child':''}" data-id="${sh.id}"><span class="mx-ri">${MX_ICON[sh.type]}</span><span class="mx-rn">${esc(sh.name)}</span>
      <span class="mx-ra"><button data-a="export" title="تصدير">⤴</button><button data-a="lock" title="قفل" class="${sh.locked?'act':''}">${sh.locked?'🔒':'🔓'}</button><button data-a="eye" title="إخفاء" class="${sh.hidden?'act':''}">${sh.hidden?'🙈':'👁'}</button></span></div>`;
    const drawLayers=()=>{
      const seenG=new Set(); let h='';
      shapes.slice().reverse().forEach(sh=>{
        if(sh.group){ if(seenG.has(sh.group)) return; seenG.add(sh.group); const mem=shapes.filter(x=>x.group===sh.group).reverse(), g=groups[sh.group], on=mem.every(m=>sel.includes(m.id));
          h+=`<div class="mx-row grp ${on?'on':''}" data-g="${sh.group}"><span class="mx-ri">📁</span><span class="mx-rn">${esc(g.name)}</span><span class="mx-ra"><button data-a="export" title="تصدير">⤴</button><button data-a="lock" title="قفل" class="${mem.every(m=>m.locked)?'act':''}">${mem.every(m=>m.locked)?'🔒':'🔓'}</button><button data-a="eye" title="إخفاء" class="${mem.every(m=>m.hidden)?'act':''}">${mem.every(m=>m.hidden)?'🙈':'👁'}</button></span></div>`;
          mem.forEach(m=>h+=rowHTML(m,true));
        } else h+=rowHTML(sh,false);
      });
      list.innerHTML=h||'<div class="mx-empty">لا توجد طبقات بعد — ارسمي شكلًا ✏️</div>';
    };
    const drawProps=()=>{
      const ss=selShapes();
      if(!ss.length){ props.innerHTML=`<div class="mx-ph">Property Inspector<small>مفتش الخصائص</small></div><div class="mx-none">حدّدي شكلًا لتعديل خصائصه 👆<br><br>أي شكل في XD له قسمان أساسيان:<br><b>التعبئة Fill</b> و<b>الحدود Border</b></div>`; return; }
      const sh=ss[ss.length-1], b=bbox(sh), open=sh.type==='line'||(sh.type==='path'&&!sh.closed);
      const sw=(k)=>MX_SW.map(c=>`<button class="mx-c ${sh[k]===c?'on':''} ${c==='none'?'none':''}" data-k="${k}" data-c="${c}" style="--c:${c==='none'?'#fff':c}" title="${c==='none'?'بدون':c}"></button>`).join('');
      props.innerHTML=`<div class="mx-ph">Property Inspector<small>مفتش الخصائص</small></div>
        <div class="mx-pn">${MX_ICON[sh.type]} ${esc(ss.length>1?ss.length+' layers':sh.name)}</div>
        <div class="mx-pg"><span>W</span><b>${Math.round(b.w)}</b><span>H</span><b>${Math.round(b.h)}</b><span>X</span><b>${Math.round(b.x)}</b><span>Y</span><b>${Math.round(b.y)}</b></div>
        ${open?'':`<div class="mx-pl">Fill <small>التعبئة</small></div><div class="mx-sw">${sw('fill')}</div>`}
        <div class="mx-pl">Border <small>الحدود</small></div><div class="mx-sw">${sw('stroke')}</div>
        <label class="mx-rg"><span>Size</span><input type="range" min="0" max="20" value="${sh.sw}" data-p="sw"><b>${sh.sw}</b></label>
        <label class="mx-ck"><input type="checkbox" data-p="dash" ${sh.dash?'checked':''}> Dash <small>خط متقطع</small></label>
        <div class="mx-dash ${sh.dash?'':'off'}"><label class="mx-rg"><span>Dash</span><input type="range" min="2" max="60" value="${sh.da}" data-p="da"><b>${sh.da}</b></label><label class="mx-rg"><span>Gap</span><input type="range" min="2" max="60" value="${sh.gap}" data-p="gap"><b>${sh.gap}</b></label></div>
        ${sh.type==='rect'?`<label class="mx-rg"><span>Radius</span><input type="range" min="0" max="80" value="${sh.r}" data-p="r"><b>${sh.r}</b></label>`:''}`;
    };
    const draw=()=>{ drawShapes(); drawUI(); drawLayers(); drawProps(); };
    const setTool=t=>{ tool=t; if(t!=='pen') pen=null; $$('.mx-tool',sec).forEach(b=>b.classList.toggle('on',b.dataset.t===t)); svg.dataset.tool=t; tip.classList.remove('warn'); tip.textContent=TIPS[t]; };
    const select=(sh,add)=>{ const ids=sh.group?shapes.filter(x=>x.group===sh.group).map(x=>x.id):[sh.id];
      if(add){ const all=ids.every(i=>sel.includes(i)); sel=all?sel.filter(i=>!ids.includes(i)):sel.concat(ids.filter(i=>!sel.includes(i))); } else sel=ids; anchors=null; };
    const finishPen=closed=>{
      if(pen){ let P=pen.pts; if(P.length>2){ const a=P[P.length-1], b=P[P.length-2]; if(Math.hypot(a[0]-b[0],a[1]-b[1])<4) P=P.slice(0,-1); }
        if(P.length>=2){ const sh=mk('path',{ pts:P, closed:closed&&P.length>=3, fill:'#FFD6E7', stroke:'#FF5FA2', sw:3 }); sel=[sh.id]; mission('draw-path'); sound.pop(); } }
      pen=null; setTool('select'); draw();
    };
    // الأدوات
    $$('.mx-tool',sec).forEach(b=>b.onclick=()=>{ if(pen) finishPen(false); setTool(b.dataset.t); sound.tick(); });
    // الرسم والتحريك
    svg.addEventListener('pointerdown',e=>{
      const p=pt(e);
      if(tool==='select'){
        const t=e.target.closest('.mx-sh');
        if(!t){ sel=[]; anchors=null; draw(); return; }
        const sh=byId(t.dataset.id); select(sh, e.shiftKey||e.ctrlKey||e.metaKey||multi);
        if(sh.locked){ say('🔒 هذه الطبقة مقفلة — لا يمكن نقلها أو تعديلها إلا بإلغاء القفل',true); sound.wrong(); draw(); return; }
        drag={ mode:'move', last:p, moved:false }; try{ svg.setPointerCapture(e.pointerId); }catch(_){} draw();
      } else if(tool==='pen'){
        if(!pen) pen={ pts:[] };
        if(pen.pts.length>=3 && Math.hypot(p.x-pen.pts[0][0],p.y-pen.pts[0][1])<18){ finishPen(true); return; }
        pen.pts.push([Math.round(p.x),Math.round(p.y)]); sound.tick(); drawUI();
      } else {
        const sh=tool==='line'? mk('line',{ x1:p.x, y1:p.y, x2:p.x, y2:p.y, stroke:'#17153A', sw:4 }) : mk(tool,{ x:p.x, y:p.y, w:0, h:0, fill:{rect:'#C9C6F5',ellipse:'#BFF3E6',polygon:'#FFE3A3'}[tool] });
        drag={ mode:'create', sh, start:p }; try{ svg.setPointerCapture(e.pointerId); }catch(_){} sel=[sh.id]; drawShapes(); drawUI();
      }
    });
    svg.addEventListener('pointermove',e=>{
      const p=pt(e);
      if(pen){ pen.cur=[p.x,p.y]; drawUI(); }
      if(!drag) return;
      if(drag.mode==='move'){ const dx=p.x-drag.last.x, dy=p.y-drag.last.y; drag.last=p; selShapes().filter(x=>!x.locked).forEach(x=>move(x,dx,dy)); if(Math.abs(dx)+Math.abs(dy)>0) drag.moved=true; drawShapes(); drawUI(); }
      else { const sh=drag.sh; if(sh.type==='line'){ sh.x2=p.x; sh.y2=p.y; } else { sh.x=Math.min(drag.start.x,p.x); sh.y=Math.min(drag.start.y,p.y); sh.w=Math.abs(p.x-drag.start.x); sh.h=Math.abs(p.y-drag.start.y); } drawShapes(); drawUI(); }
    });
    const up=()=>{
      if(!drag) return;
      if(drag.mode==='create'){ const sh=drag.sh;
        if(sh.type==='line'){ if(Math.hypot(sh.x2-sh.x1,sh.y2-sh.y1)<10){ sh.x2=sh.x1+200; sh.y2=sh.y1; } }
        else if(sh.w<10||sh.h<10){ sh.w=sh.type==='polygon'?160:180; sh.h=sh.type==='rect'?120:140; }
        mission('draw-'+sh.type); setTool('select'); sound.pop(); }
      else if(drag.moved) mission('move');
      drag=null; draw();
    };
    svg.addEventListener('pointerup',up); svg.addEventListener('pointercancel',up);
    svg.addEventListener('dblclick',e=>{
      if(tool==='pen'){ finishPen(false); return; }
      const t=e.target.closest('.mx-sh'); if(!t) return; const sh=byId(t.dataset.id); if(sh.locked) return;
      anchors=sh.id; sel=[sh.id]; drawUI(); say('✳️ وضع تحرير المسار: تظهر نقاط الربط للشكل لتحريرها أو حذفها أو إضافة نقاط جديدة'); mission('anchors'); sound.pop();
    });
    document.addEventListener('keydown',e=>{
      if(!isActive(sec) || e.target.matches('input,textarea,select')) return;
      if(e.key==='Escape' && pen){ finishPen(false); }
      else if((e.key==='Delete'||e.key==='Backspace') && sel.length){ e.preventDefault(); act('del'); }
    });
    // الخصائص
    props.addEventListener('click',e=>{ const c=e.target.closest('.mx-c'); if(!c) return; const k=c.dataset.k; selShapes().forEach(x=>{ x[k]=c.dataset.c; if(k==='stroke'&&x.sw===0) x.sw=3; }); mission(k==='fill'?'fill':'stroke'); sound.tick(); drawShapes(); drawProps(); });
    props.addEventListener('input',e=>{ const i=e.target.closest('[data-p]'); if(!i) return; const k=i.dataset.p, v=i.type==='checkbox'?i.checked:+i.value;
      selShapes().forEach(x=>x[k]=v); const out=i.parentElement.querySelector('b'); if(out) out.textContent=v;
      if(k==='dash'){ $('.mx-dash',props).classList.toggle('off',!v); if(v) mission('dash'); }
      if(k==='r'&&v>0) mission('radius'); if(k==='sw') mission('stroke');
      drawShapes(); drawUI(); });
    // الطبقات
    const act=(a,ids)=>{
      ids=ids||sel; const ss=shapes.filter(x=>ids.includes(x.id));
      if(a==='eye'){ const hide=!ss.every(x=>x.hidden); ss.forEach(x=>x.hidden=hide); if(hide){ mission('hide'); sel=sel.filter(i=>!ids.includes(i)); } sound.pop(); }
      else if(a==='lock'){ const lock=!ss.every(x=>x.locked); ss.forEach(x=>x.locked=lock); if(lock) mission('lock'); sound.pop(); }
      else if(a==='export'){ say(`📤 تم تجهيز «${ss.length>1?(groups[ss[0].group]||{}).name||ss.length+' طبقات':ss[0].name}» للتصدير ونقلها إلى المكونات المُصدَّرة`); mission('export'); sound.ding(); }
      else if(a==='del'){ if(!ss.length) return; shapes=shapes.filter(x=>!ids.includes(x.id)); sel=[]; anchors=null; sound.pop(); }
      else if(a==='group'){ const free=ss.filter(x=>!x.group); if(free.length<2){ say('⧉ حدّدي طبقتين أو أكثر أولًا (فعّلي «تحديد متعدد» أو اضغطي Shift)',true); sound.wrong(); return; }
        const g='g'+(gid++); groups[g]={ name:'Group '+(gid-1) }; const top=Math.max(...free.map(x=>shapes.indexOf(x)));
        free.forEach(x=>x.group=g); const rest=shapes.filter(x=>!free.includes(x)); const at=rest.filter(x=>shapes.indexOf(x)<top).length; rest.splice(at,0,...free.sort((a,b)=>shapes.indexOf(a)-shapes.indexOf(b))); shapes=rest;
        sel=free.map(x=>x.id); mission('group'); say('⧉ تم التجميع: يمكنكِ الآن تحديد المجموعة كاملة ونقلها كأنها طبقة واحدة'); sound.ding(); }
      else if(a==='ungroup'){ const gs=[...new Set(ss.map(x=>x.group).filter(Boolean))]; if(!gs.length){ say('⧈ حدّدي مجموعة أولًا لفك تجميعها',true); sound.wrong(); return; }
        shapes.forEach(x=>{ if(gs.includes(x.group)) x.group=null; }); gs.forEach(g=>delete groups[g]); mission('ungroup'); say('⧈ تم فك التجميع: عادت كل طبقة مستقلة'); sound.pop(); }
      else if(a==='up'||a==='down'){ if(!ss.length) return; const d=a==='up'?1:-1, idx=ss.map(x=>shapes.indexOf(x)).sort((x,y)=>x-y), lo=idx[0], hi=idx[idx.length-1];
        const nb=d>0?hi+1:lo-1; if(nb<0||nb>=shapes.length) return; const [n]=shapes.splice(nb,1); shapes.splice(d>0?lo:hi,0,n); if(n.group&&!ss.some(x=>x.group===n.group)){} mission('order'); sound.tick(); }
      draw();
    };
    $('.mx-lops',sec).addEventListener('click',e=>{ const b=e.target.closest('[data-op]'); if(b) act(b.dataset.op); });
    const mcb=$('.mx-multi input',sec); if(mcb) mcb.onchange=()=>{ multi=mcb.checked; };
    list.addEventListener('click',e=>{
      const row=e.target.closest('.mx-row'); if(!row) return;
      const ids=row.dataset.g?shapes.filter(x=>x.group===row.dataset.g).map(x=>x.id):[row.dataset.id];
      const a=e.target.closest('[data-a]'); if(a){ act(a.dataset.a,ids); return; }
      const add=e.shiftKey||e.ctrlKey||e.metaKey||multi;
      if(add){ const all=ids.every(i=>sel.includes(i)); sel=all?sel.filter(i=>!ids.includes(i)):sel.concat(ids.filter(i=>!sel.includes(i))); } else sel=ids;
      anchors=null; sound.tick(); draw();
    });
    list.addEventListener('dblclick',e=>{
      const n=e.target.closest('.mx-rn'); if(!n) return; const row=n.closest('.mx-row'); const obj=row.dataset.g?groups[row.dataset.g]:byId(row.dataset.id);
      const inp=document.createElement('input'); inp.value=obj.name; inp.className='mx-rename'; n.replaceWith(inp); inp.focus(); inp.select();
      const ok=()=>{ const v=inp.value.trim(); if(v&&v!==obj.name){ obj.name=v; mission('rename'); sound.ding(); } draw(); };
      inp.addEventListener('keydown',ev=>{ if(ev.key==='Enter'){ ev.preventDefault(); inp.blur(); } if(ev.key==='Escape'){ inp.value=obj.name; inp.blur(); } });
      inp.addEventListener('blur',ok,{ once:true });
    });
    (s.preset||[]).forEach(p=>mk(p.type,Object.assign({},p)));
    setTool('select'); draw();
  }
};

/* ┅ مختبر الحدود المتقطعة */
R.dashlab = {
  html:s=>`<div class="dl-wrap">
    <div class="dl-ctrl rv"><p class="lead">${s.prompt||''}</p><div class="dl-ch"></div>
      ${[['sw','Size','سماكة الحد',0,30],['da','Dash','طول الشَّرطة',0,60],['gap','Gap','المسافة بين الشَّرطات',0,60]].map(([k,en,ar,mi,ma])=>`<label class="dl-r"><span><b>${en}</b>${ar}</span><input type="range" min="${mi}" max="${ma}" data-k="${k}"><output></output></label>`).join('')}
      <div class="feedback"></div>
      <div class="center-row"><button class="btn ghost dl-show">👀 القيم الصحيحة</button><button class="btn primary dl-next">التحدي التالي ⬅</button></div></div>
    <div class="dl-boards rv">
      <div class="dl-b"><small>🎯 الهدف</small><svg viewBox="0 0 300 300"><rect class="dl-t" x="55" y="55" width="190" height="190"/></svg><div class="dl-v"></div></div>
      <div class="dl-b mine"><small>✏️ تصميمكِ</small><svg viewBox="0 0 300 300"><rect class="dl-m" x="55" y="55" width="190" height="190"/></svg><div class="dl-v"></div></div>
    </div></div>`,
  init:(sec,s)=>{
    const T=s.targets; let i=0, cur={ sw:4, da:0, gap:0 }, solved=false;
    const ap=(el,v,c)=>{ el.setAttribute('fill',c.fill||'#8E2B2B'); el.setAttribute('stroke',c.stroke||'#5B5BF7'); el.setAttribute('stroke-width',v.sw); el.setAttribute('stroke-dasharray',v.da>0?`${v.da} ${v.gap}`:'none'); };
    const vals=v=>`Size ${v.sw} · Dash ${v.da} · Gap ${v.gap}`;
    const load=()=>{ const t=T[i]; solved=false; ap($('.dl-t',sec),t,t); $('.dl-b .dl-v',sec).textContent='؟ · ؟ · ؟'; $('.dl-ch',sec).textContent=`التحدي ${i+1} من ${T.length}: ${t.label||'حاكي الحدود في الشكل الهدف'}`;
      cur={ sw:4, da:0, gap:0 }; $$('.dl-r input',sec).forEach(r=>{ r.value=cur[r.dataset.k]; r.nextElementSibling.textContent=r.value; }); upd(); $('.feedback',sec).textContent=''; };
    const upd=()=>{ const t=T[i]; ap($('.dl-m',sec),cur,t); $('.mine .dl-v',sec).textContent=vals(cur);
      const near=(a,b)=>Math.abs(a-b)<=2, solid=v=>v.da===0;
      const ok=near(cur.sw,t.sw) && (solid(t)?cur.da===0:(near(cur.da,t.da)&&near(cur.gap,t.gap)));
      if(ok&&!solved){ solved=true; setFb($('.feedback',sec),true,'🎯 مطابق تمامًا! '+MSG.short); $('.dl-b .dl-v',sec).textContent=vals(t); celebrate($('.mine',sec)); } };
    $$('.dl-r input',sec).forEach(r=>r.addEventListener('input',()=>{ cur[r.dataset.k]=+r.value; r.nextElementSibling.textContent=r.value; upd(); }));
    $('.dl-show',sec).onclick=()=>{ $('.dl-b .dl-v',sec).textContent=vals(T[i]); sound.pop(); };
    $('.dl-next',sec).onclick=()=>{ i=(i+1)%T.length; load(); sound.pop(); };
    load();
  }
};

/* ⧉ تقاطع الأشكال (Boolean) */
const BO_OPS=[
  { t:'دمج', en:'Add', d:'يوحّد الشكلين في شكل واحد بحدود خارجية واحدة.' },
  { t:'طرح', en:'Subtract', d:'يقصّ الشكل العلوي (الدائرة) من الشكل السفلي (المربع).' },
  { t:'تقاطع', en:'Intersect', d:'يُبقي الجزء المشترك بين الشكلين فقط.' },
  { t:'استبعاد التداخل', en:'Exclude Overlap', d:'يحذف الجزء المشترك ويُبقي باقي الشكلين.' }
];
let boN=0;
function boArt(op,big){
  const u='bo'+(boN++), SQ='M110 60 h150 v150 h-150 Z', CI='M180 200 a80 80 0 1 0 160 0 a80 80 0 1 0 -160 0 Z', B='#2BB5D8', Gr='#8BC34A';
  const ghost=big&&op>=0?`<path d="${SQ}" fill="none" stroke="#C9C5E8" stroke-width="2" stroke-dasharray="6 6"/><path d="${CI}" fill="none" stroke="#C9C5E8" stroke-width="2" stroke-dasharray="6 6"/>`:'';
  let a;
  if(op<0) a=`<path d="${SQ}" fill="${B}"/><path d="${CI}" fill="${Gr}"/>`;
  else if(op===0) a=`<path d="${SQ}" fill="${B}"/><path d="${CI}" fill="${B}"/>`;
  else if(op===1) a=`<defs><mask id="${u}"><rect x="0" y="0" width="420" height="300" fill="#fff"/><path d="${CI}" fill="#000"/></mask></defs><path d="${SQ}" fill="${B}" mask="url(#${u})"/>`;
  else if(op===2) a=`<defs><clipPath id="${u}"><path d="${SQ}"/></clipPath></defs><path d="${CI}" fill="${B}" clip-path="url(#${u})"/>`;
  else a=`<path d="${SQ} ${CI}" fill="${B}" fill-rule="evenodd"/>`;
  return `<svg viewBox="80 40 290 250">${ghost}${a}</svg>`;
}
R.boolean = {
  html:s=>`<div class="bo-wrap">
    <div class="bo-side rv">
      <div class="hs-modes"><button class="hs-m on" data-m="x">🔍 جرّبي</button><button class="hs-m" data-m="q">🎯 اختبريني</button></div>
      <div class="bo-ops">${BO_OPS.map((o,k)=>`<button class="bo-op" data-k="${k}"><span class="bo-ic">${boArt(k,false)}</span><span><b>${o.t}</b><small>${o.en}</small></span></button>`).join('')}</div>
      <button class="btn ghost bo-reset">↺ الشكلان الأصليان</button>
      <div class="feedback"></div>
    </div>
    <div class="bo-stage rv"><div class="bo-cap">حدّدي الشكلين ثم اختاري عملية من نافذة الخصائص 👉</div><div class="bo-svg">${boArt(-1,true)}</div><div class="bo-info">${s.note||''}</div></div></div>`,
  init:(sec,s)=>{
    let mode='x', target=-1, score=0, asked=0;
    const box=$('.bo-svg',sec), cap=$('.bo-cap',sec), info=$('.bo-info',sec), fb=$('.feedback',sec);
    const showOp=k=>{ box.innerHTML=boArt(k,true); retrigger(box,'pop'); if(k>=0){ cap.innerHTML=`<b>${BO_OPS[k].t}</b> ${BO_OPS[k].en}`; info.textContent=BO_OPS[k].d; } else { cap.textContent='الشكلان الأصليان: مربع أزرق ودائرة خضراء متداخلان'; info.innerHTML=s.note||''; } };
    const ask=()=>{ if(asked>=4){ cap.innerHTML=`🏆 أنهيتِ الاختبار: ${score} من 4`; celebrate(box); target=-1; return; }
      const left=[0,1,2,3].filter(k=>!sec._asked.includes(k)); target=left[Math.floor(Math.random()*left.length)]; sec._asked.push(target); asked++;
      box.innerHTML=boArt(target,true); retrigger(box,'pop'); cap.innerHTML=`🎯 السؤال ${asked} من 4: أي عملية أنتجت هذا الشكل؟`; info.textContent=''; };
    $$('.bo-op',sec).forEach(b=>b.onclick=()=>{
      const k=+b.dataset.k; $$('.bo-op',sec).forEach(x=>x.classList.toggle('on',x===b));
      if(mode==='x'){ showOp(k); b.classList.add('seen'); sound.pop(); if(!$$('.bo-op:not(.seen)',sec).length&&!sec._all){ sec._all=1; setTimeout(()=>sound.ding(),300); } }
      else if(target>=0){ if(k===target){ score++; setFb(fb,true,MSG.short); info.textContent=BO_OPS[k].d; sound.ding(); setTimeout(ask,900); } else { shake(b); setFb(fb,false); sound.wrong(); } }
    });
    $('.bo-reset',sec).onclick=()=>{ $$('.bo-op',sec).forEach(x=>x.classList.remove('on')); showOp(-1); sound.pop(); };
    $$('.hs-m',sec).forEach(b=>b.onclick=()=>{ mode=b.dataset.m; $$('.hs-m',sec).forEach(x=>x.classList.toggle('on',x===b)); fb.textContent=''; $$('.bo-op',sec).forEach(x=>x.classList.remove('on'));
      if(mode==='q'){ sec._asked=[]; asked=0; score=0; ask(); } else { target=-1; showOp(-1); } sound.pop(); });
    showOp(-1);
  }
};

/* 📄→💻→🎨 مراحل المخطط الهيكلي */
const WF_SCREENS = {
  signin:`<div class="w-scr"><div class="w-hero"><span class="vis">🌿</span></div><div class="w-title">Sign In</div><div class="w-lab">Email</div><div class="w-in"></div><div class="w-lab">Password</div><div class="w-in"></div><div class="w-link">Forgot Password?</div><div class="w-btn">Login</div></div>`,
  chats:`<div class="w-scr"><div class="w-head">Chats <span class="w-dot"></span></div>${['Jane Gilbert','Bill Jonson','Jane Philips','Joan','Marry Smith'].map((n,k)=>`<div class="w-chat"><span class="w-av"><span class="vis">${['👩🏻','👨🏽','👩🏼','👧🏻','👩🏾'][k]}</span></span><span class="w-cl"><b>${n}</b><i></i></span><span class="w-t">${['12:14','11:10','10:45','10:20','09:35'][k]}</span></div>`).join('')}</div>`
};
R.stages = {
  html:s=>`<div class="stg-steps rv">${s.steps.map((g,k)=>`<button class="stg-b" data-k="${k}" style="--c:${g.color}"><span class="stg-i">${g.icon}</span><span><b>${g.t}</b><small>${g.en}</small></span></button>`).join('<span class="stg-ar">←</span>')}</div>
    <div class="stg-main rv"><div class="stg-screens">${s.screens.map(k=>`<div class="stg-ph" data-st="0">${WF_SCREENS[k]}</div>`).join('')}</div><div class="stg-note"></div></div>`,
  init:(sec,s)=>{
    const pick=(k,quiet)=>{ $$('.stg-ph',sec).forEach(p=>p.dataset.st=k); $$('.stg-b',sec).forEach((b,j)=>{ b.classList.toggle('on',j===k); if(j<=k&&!quiet) b.classList.add('seen'); });
      const g=s.steps[k], n=$('.stg-note',sec); n.style.setProperty('--c',g.color); n.innerHTML=`<span>${g.icon}</span><div><b>${g.t} ${g.en}</b><br>${g.d}</div>`; if(quiet) return; retrigger(n,'pop'); sound.pop();
      if(!$$('.stg-b:not(.seen)',sec).length&&!sec._all){ sec._all=1; setTimeout(()=>celebrate($('.stg-screens',sec),true),300); } };
    $$('.stg-b',sec).forEach(b=>b.onclick=()=>pick(+b.dataset.k));
    pick(0,true); $$('.stg-b',sec)[0].classList.add('seen');
  }
};

/* 🧱 بناء مخطط هيكلي لصفحة موقع */
const WB_BLOCKS = {
  nav:   { t:'شريط التنقل', en:'Navigation', sym:'▭═', h:`<div class="wb-nav"><span class="wf-box sm"><span class="vis">🏫 مدرستي</span></span><span class="wf-line s"><span class="vis">الرئيسية</span></span><span class="wf-line s"><span class="vis">الأخبار</span></span><span class="wf-line s"><span class="vis">تواصل</span></span></div>` },
  hero:  { t:'صورة رئيسية', en:'Picture Container', sym:'☒', h:`<div class="wb-hero wf-x"><span class="vis">🏫 مرحبًا بكِ في مدرستنا</span></div>` },
  title: { t:'عنوان', en:'Heading', sym:'▬', h:`<div class="wb-title wf-line b"><span class="vis">أحدث الأخبار</span></div>` },
  text:  { t:'كتلة نص', en:'Text Block', sym:'☰', h:`<div class="wb-text"><span class="wf-line"></span><span class="wf-line"></span><span class="wf-line m"></span><span class="vis">نسعى لتقديم بيئة تعليمية رقمية ممتعة تُعدّ الطالبات للمستقبل.</span></div>` },
  button:{ t:'زر', en:'Button', sym:'⬭', h:`<div class="wb-btnrow"><span class="wb-btn"><span class="wf-line s"></span><span class="vis">سجّلي الآن</span></span></div>` },
  cards: { t:'بطاقات', en:'Cards', sym:'☒☒☒', h:`<div class="wb-cards">${['📚 المكتبة','🏆 الإنجازات','🎨 الأنشطة'].map(c=>`<div class="wb-card"><div class="wf-x sm"><span class="vis">${c.split(' ')[0]}</span></div><span class="wf-line"></span><span class="vis">${c.split(' ')[1]}</span></div>`).join('')}</div>` },
  shade: { t:'منطقة مظللة', en:'Shading', sym:'▒', h:`<div class="wb-shade"><span class="vis">📢 إعلان: بدء التسجيل في النادي الرقمي</span></div>` },
  footer:{ t:'تذييل الصفحة', en:'Footer', sym:'▁▁', h:`<div class="wb-footer"><span class="wf-line s"></span><span class="wf-line s"></span><span class="vis">© مدرستي 1448هـ · جميع الحقوق محفوظة</span></div>` }
};
R.wfbuild = {
  html:s=>`<div class="wb-wrap">
    <div class="wb-pal rv"><div class="wb-ph">🧱 عناصر المخطط الهيكلي</div>
      <div class="wb-adds">${Object.entries(WB_BLOCKS).map(([k,b])=>`<button class="wb-add" data-k="${k}"><span class="wb-sym">${b.sym}</span><span><b>${b.t}</b><small>${b.en}</small></span></button>`).join('')}</div>
      <div class="wb-modes">${['📄 ورقي','💻 رقمي','🎨 مرئي'].map((t,k)=>`<button class="wb-m ${k===1?'on':''}" data-st="${k}">${t}</button>`).join('')}</div>
      <button class="btn ghost wb-clear">🧹 مسح الصفحة</button></div>
    <div class="wb-page rv" data-st="1"><div class="wb-bar"><span class="dots"><i></i><i></i><i></i></span><span class="wb-url">${s.site||'www.my-school.sa'}</span></div><div class="wb-body"><div class="wb-empty">👉 اضغطي على العناصر لبناء الصفحة</div></div></div>
    <div class="wb-layers rv"><div class="wb-lh">◧ Layers <small>الطبقات</small></div><div class="wb-ll"></div><div class="wb-lc"></div></div></div>`,
  init:(sec,s)=>{
    const body=$('.wb-body',sec), page=$('.wb-page',sec), ll=$('.wb-ll',sec), lc=$('.wb-lc',sec); let items=[], n={}, uid=0;
    const MAX=s.max||8;
    const render=()=>{
      body.innerHTML=items.length?items.map(it=>`<div class="wb-blk" data-id="${it.id}" title="اضغطي للحذف">${WB_BLOCKS[it.k].h}<button class="wb-x">✕</button></div>`).join(''):'<div class="wb-empty">👉 اضغطي على العناصر لبناء الصفحة</div>';
      ll.innerHTML=items.slice().reverse().map(it=>`<div class="wb-lr"><span>${WB_BLOCKS[it.k].sym}</span>${it.name}</div>`).join('')||'<div class="wb-le">لا توجد طبقات</div>';
      lc.innerHTML=`كل عنصر تضيفينه = <b>طبقة جديدة</b> (${items.length})`;
    };
    $$('.wb-add',sec).forEach(b=>b.onclick=()=>{ if(items.length>=MAX){ shake(page); sound.wrong(); return; } const k=b.dataset.k; n[k]=(n[k]||0)+1; items.push({ id:++uid, k, name:WB_BLOCKS[k].en+' '+n[k] }); render(); sound.pop(); const last=body.lastElementChild; last&&retrigger(last,'pop');
      if(items.length===5&&!sec._five){ sec._five=1; setTimeout(()=>sound.ding(),200); } });
    body.addEventListener('click',e=>{ const x=e.target.closest('.wb-x'); if(!x) return; const id=+x.parentElement.dataset.id; items=items.filter(i=>i.id!==id); render(); sound.tick(); });
    $$('.wb-m',sec).forEach(b=>b.onclick=()=>{ page.dataset.st=b.dataset.st; $$('.wb-m',sec).forEach(x=>x.classList.toggle('on',x===b)); sound.pop(); if(b.dataset.st==='2'&&items.length>=4&&!sec._vis){ sec._vis=1; celebrate(page); } });
    $('.wb-clear',sec).onclick=()=>{ items=[]; n={}; render(); sound.pop(); };
    render();
  }
};

/* ---------------- 🧱 بناء الشرائح ---------------- */
const PRINT = location.hash==='#print';
const ACTIVE = SLIDES.filter(s=>!(s.comp && !COMP));
const stage=$('#stage'); const slides=[]; let current=0;
const ANIMS=['slide','fade','zoom'];
if(!PRINT) ACTIVE.forEach((s,i)=>{
  const r=R[s.type]; if(!r){ console.warn('نوع شريحة غير معروف:',s.type); return; }
  const sec=document.createElement('section'); sec.className='slide t-'+s.type;
  const showTitle=s.title&&!['title','closing'].includes(s.type);
  const head=(s.tag?`<div class="tag rv">${s.tag}</div>`:'')+(showTitle?`<h2 class="title rv"><span class="sel">${s.title}<i class="hd a"></i><i class="hd b"></i><i class="hd c"></i><i class="hd d"></i><em class="dim">H 82 · Readex Pro</em></span></h2>`:'');
  sec.innerHTML=`<div class="ab-label"><i></i>Artboard ${String(i+1).padStart(2,'0')} — ${s.type}</div><div class="slide-inner">${head}<div class="content">${r.html(s,i)}</div></div>`;
  stage.appendChild(sec);
  $$('.rv',sec).forEach((el,k)=>el.style.setProperty('--i',Math.min(k,9)));
  try{ r.init&&r.init(sec,s,i); }catch(e){ console.error(s.id,e); }
  slides.push({el:sec,cfg:s,r});
});
$('#brand').textContent=`${LESSON.lessonNo}: ${LESSON.title}`;

/* ---------------- 🧭 التنقل ---------------- */
function go(n, quiet){
  if(n<0||n>=slides.length) return;
  const dir=n>=current?1:-1, old=slides[current].el, nw=slides[n].el;
  if(n!==current){ old.classList.remove('active'); retrigger(old,'leaving'); setTimeout(()=>old.classList.remove('leaving'),460); }
  const anim=slides[n].cfg.anim||ANIMS[n%ANIMS.length];
  nw.classList.remove('in-fade','in-zoom','in-slide-next','in-slide-prev','active'); void nw.offsetWidth;
  nw.classList.add('active','in-'+(anim==='slide'?(dir>0?'slide-next':'slide-prev'):anim));
  current=n; updateUI();
  slides[n].r.enter&&slides[n].r.enter(nw,slides[n].cfg);
  if(!quiet) saveProgress();
  if(document.body.classList.contains('prep-open')) fillPrep();
}
const next=()=>go(current+1), prev=()=>go(current-1);
function updateUI(){
  $('#counter').innerHTML=`<b>${current+1}</b> / ${slides.length}`;
  $('#pgnum').textContent=`${String(current+1).padStart(2,'0')} / ${slides.length}`;
  $('#progress i').style.width=((current+1)/slides.length*100)+'%';
  $('#prev').disabled=current===0; $('#next').disabled=current===slides.length-1;
}

/* ---------------- 📍 تتبّع التقدم (لكل فصل) ---------------- */
function progOf(){ const all=store.get(PROG_KEY); return ((all[LESSON_ID]||{})[LESSON.classId])||null; }
function saveProgress(){
  const all=store.get(PROG_KEY), L=all[LESSON_ID]=all[LESSON_ID]||{};
  const p=L[LESSON.classId]=L[LESSON.classId]||{visited:[]};
  const id=slides[current].cfg.id;
  if(!Array.isArray(p.visited)) p.visited=[];
  if(!p.visited.includes(id)) p.visited.push(id);
  p.visited=p.visited.filter(v=>ACTIVE.some(s=>s.id===v));
  p.slide=current; p.slideId=id; p.max=Math.max(p.max||0,current); p.total=slides.length;
  p.title=nameOfSlide(slides[current].cfg); p.className=LESSON.className||'بدون فصل محدد';
  p.updated=Date.now(); p.done=p.visited.length>=slides.length || current===slides.length-1 || !!p.done;
  if(COMP) p.scores=Object.fromEntries(LESSON.teams.map((t,k)=>[t.name,scores[k]]));
  store.set(PROG_KEY,all);
}

/* ---------------- 📐 ملاءمة الشاشة ---------------- */
function prepWidth(){ return document.body.classList.contains('prep-open') ? Math.min(innerWidth*.36,560) : 0; }
function fit(){ const aw=innerWidth-prepWidth(), s=Math.min(aw/1920, innerHeight/1080); stage.style.left=(aw/2)+'px'; stage.style.transform=`translate(-50%,-50%) scale(${s})`; }
addEventListener('resize',fit); fit(); setTimeout(()=>document.body.classList.add('ready'),300);

/* ---------------- ⌨️ لوحة المفاتيح ---------------- */
const anyOverlay=()=>$$('.ov.open').length>0;
document.addEventListener('keydown',e=>{
  if(e.target.matches('input,textarea,select')){ if(e.key==='Escape') e.target.blur(); return; }
  const k=e.key;
  if(k==='Escape'){ $$('.ov.open').forEach(o=>o.classList.remove('open')); if(document.body.classList.contains('prep-open')) togglePrep(false); return; }
  if(anyOverlay()){ if((k===' '||k==='Enter') && $('#draw').classList.contains('open')){ e.preventDefault(); $('#drGo').click(); } return; }
  if(k==='ArrowRight'||k===' '||e.code==='Space'||k==='PageDown'){ e.preventDefault(); next(); }
  else if(k==='ArrowLeft'||k==='PageUp'){ e.preventDefault(); prev(); }
  else if(k==='ArrowUp'||k==='ArrowDown'){ e.preventDefault(); }
  else if(k==='ت'||e.code==='KeyF'){ e.preventDefault(); clap(); }
  else if(e.code==='KeyP'){ e.preventDefault(); togglePrep(); }
  else if(e.code==='KeyG'){ e.preventDefault(); openOverview(); }
  else if(e.code==='KeyR'){ e.preventDefault(); openDraw(); }
  else if(k==='Home'){ e.preventDefault(); go(0); }
  else if(k==='End'){ e.preventDefault(); go(slides.length-1); }
});
document.addEventListener('keyup',e=>{ if((e.key===' '||e.code==='Space')&&!e.target.matches('input,textarea,select')) e.preventDefault(); });
document.addEventListener('click',e=>{ const b=e.target.closest('button'); if(b) setTimeout(()=>b.blur(),0); });
addEventListener('wheel',e=>{ if(!e.target.closest('#prep,.ov,#score,#printDoc')) e.preventDefault(); },{passive:false});

let tx=null, ty=null;
stage.addEventListener('touchstart',e=>{ if(e.target.closest('input,.no-swipe')) return; tx=e.touches[0].clientX; ty=e.touches[0].clientY; },{passive:true});
stage.addEventListener('touchend',e=>{ if(tx===null) return; const dx=e.changedTouches[0].clientX-tx, dy=e.changedTouches[0].clientY-ty; tx=null;
  if(Math.abs(dx)>140&&Math.abs(dy)<80){ dx<0?next():prev(); } });

/* ---------------- 🎛️ الشريط ---------------- */
$('#next').onclick=next; $('#prev').onclick=prev; $('#clapBtn').onclick=clap;
$('#fsBtn').onclick=()=>{ if(!document.fullscreenElement) document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen(); else document.exitFullscreen(); };
$('#homeBtn').addEventListener('click',()=>saveProgress());
let idleT;
function wake(){ document.body.classList.remove('idle'); clearTimeout(idleT);
  idleT=setTimeout(()=>{ if(!$('#bar').matches(':hover')&&!$('#score').classList.contains('open')&&!document.body.classList.contains('prep-open')&&!anyOverlay()) document.body.classList.add('idle'); },2800); }
['mousemove','mousedown','touchstart'].forEach(ev=>addEventListener(ev,wake,{passive:true})); wake();
$$('[data-close]').forEach(b=>b.onclick=()=>$('#'+b.dataset.close).classList.remove('open'));
$$('.ov').forEach(o=>o.addEventListener('click',e=>{ if(e.target===o && o.id!=='resume') o.classList.remove('open'); }));

/* ---------------- 🏆 التنافس ---------------- */
const scores=LESSON.teams.map(()=>0);
const tIcon=t=>t.icon||esc((t.name||'؟').trim()[0]);
function addPoints(k,d){ scores[k]=Math.max(0,scores[k]+d); drawScores(k); const chip=$(`#teams .tm[data-k="${k}"]`); chip&&retrigger(chip,'bump'); saveProgress(); }
function drawScores(bumpIdx){
  if(!COMP){ $('#teams').innerHTML=''; return; }
  const max=Math.max(...scores);
  $('#scList').innerHTML=LESSON.teams.map((t,k)=>`<div class="sc-row" style="--c:${t.color}"><span class="crown">${max>0&&scores[k]===max?'👑':''}</span>
    <span class="sc-name" title="${esc(t.full||t.name)}">${t.icon} ${esc(t.name)}</span><button data-k="${k}" data-d="-1">−</button><span class="sc-pts ${k===bumpIdx?'bump':''}">${scores[k]}</span><button data-k="${k}" data-d="1">＋</button></div>`).join('');
  const many=LESSON.teams.length>10;
  let idx=LESSON.teams.map((_,k)=>k); if(many) idx=idx.sort((a,b)=>scores[b]-scores[a]).slice(0,6);
  $('#teams').innerHTML=idx.map(k=>{ const t=LESSON.teams[k]; return `<button class="tm ${max>0&&scores[k]===max?'lead':''}" data-k="${k}" style="--c:${t.color}" title="${esc(t.name)}">
    <span class="tm-ic">${max>0&&scores[k]===max?'👑':''}${many?esc(t.name):tIcon(t)}</span><b>${scores[k]}</b></button>`; }).join('')+(many?`<button class="tm more">+${LESSON.teams.length-6}</button>`:'');
}
$('#scList').addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b) return; const d=+b.dataset.d; addPoints(+b.dataset.k,d); d>0?sound.ding():sound.pop(); });
$('#teams').addEventListener('click',()=>$('#score').classList.add('open'));
$('#scoreBtn').onclick=()=>$('#score').classList.toggle('open');
$('#scClose').onclick=()=>$('#score').classList.remove('open');
$('#scReset').onclick=()=>{ if(confirm('تصفير جميع النقاط؟')){ scores.fill(0); drawScores(); saveProgress(); } };
if(!COMP){ $('#scoreBtn').style.display='none'; }
let awardT;
function showAward(pts){
  if(!COMP) return;
  pts = pts || slides[current].cfg.points || LESSON.defaultPoints || 1;
  const box=$('#award'), many=LESSON.teams.length>10;
  $('#awPts').textContent='+'+pts;
  $('#awQ').textContent=LESSON.compMode==='individual'?'🏅 مَن الطالبة التي أجابت؟':'🏅 أي مجموعة أجابت؟';
  $('#awBtns').className=many?'many':'';
  $('#awBtns').innerHTML=LESSON.teams.map((t,k)=>`<button data-k="${k}" style="--c:${t.color}" title="${esc(t.full||t.name)}"><span>${tIcon(t)}</span><small>${esc(t.name)}</small></button>`).join('');
  $$('#awBtns button').forEach(b=>b.onclick=()=>{
    addPoints(+b.dataset.k,pts); sound.ding();
    const r=b.getBoundingClientRect(); confetti.burst(r.left+r.width/2,r.top,30);
    box.classList.remove('open');
  });
  box.classList.add('open'); clearTimeout(awardT); awardT=setTimeout(()=>box.classList.remove('open'),15000);
}
$('#awClose').onclick=()=>$('#award').classList.remove('open');

/* ---------------- 🎲 القرعة (من طالبات الفصل الحاضرات أو مجموعاته) ---------------- */
let drawn=[];
function drawPool(){
  if(LESSON.drawMode==='groups' && LESSON.groups.length) return LESSON.groups.map(g=>({ id:g.id||g.name, label:g.name, full:(g.members||[]).join('، '), team:LESSON.teams.findIndex(t=>t.name===g.name) }));
  if(LESSON.students.length) return LESSON.students.map(s=>({ id:s.id, label:s.short||s.name, full:s.name, team:LESSON.compMode==='individual'?LESSON.teams.findIndex(t=>t.full===s.name):LESSON.teams.findIndex(t=>(t.members||[]).includes(s.short)) }));
  return LESSON.teams.map((t,k)=>({ id:'t'+k, label:t.icon+' '+t.name, full:'', team:k }));
}
let lastWin=null;
function openDraw(){
  const pool=drawPool(); if(!pool.length) return;
  $('#drTitle').textContent=(LESSON.drawMode==='groups'?'🎲 قرعة المجموعات':'🎲 قرعة الأسماء')+(LESSON.className?' — '+LESSON.className:'');
  $('#drWho').textContent='؟'; $('#drWho').className='dr-who'; $('#drFull').textContent=''; $('#drAward').style.display='none';
  $('#drLeft').textContent=`${pool.length-drawn.length} متبقية`;
  $('#draw').classList.add('open');
}
$('#drGo').onclick=()=>{
  const all=drawPool(); if(!all.length) return; let pool=all;
  if($('#drNo').checked){ pool=all.filter(x=>!drawn.includes(x.id)); if(!pool.length){ drawn=[]; pool=all; } }
  const win=pool[Math.floor(Math.random()*pool.length)], el=$('#drWho'); el.className='dr-who spin'; $('#drFull').textContent=''; $('#drGo').disabled=true; $('#drAward').style.display='none';
  let k=0,d=45;(function t(){ el.textContent=all[Math.floor(Math.random()*all.length)].label; sound.tick(); if(++k<24){ d*=1.1; setTimeout(t,d); }
    else { el.textContent=win.label; el.className='dr-who win'; $('#drFull').textContent=win.full; drawn.push(win.id); $('#drGo').disabled=false; sound.success();
      lastWin=win; $('#drAward').style.display=(COMP&&win.team>=0)?'':'none'; $('#drLeft').textContent=`${all.length-drawn.length} متبقية`; } })();
};
$('#drAward').onclick=()=>{ if(lastWin&&lastWin.team>=0){ addPoints(lastWin.team,1); sound.ding(); $('#drAward').style.display='none'; } };
$('#drawBtn').onclick=openDraw;
if(!drawPool().length || LESSON.drawMode==='none') $('#drawBtn').style.display='none';

/* ---------------- 📝 التحضير (يُحفظ لكل شريحة في هذا الدرس) ---------------- */
const PF=['min','goal','st','t','s','ev','note'];
function defPrep(s){ const p=s.prep||{}; return { min:p.min??2, goal:p.goal||'', st:p.st||'', t:p.t||'', s:p.s||'', ev:p.ev||'', note:'' }; }
function prepOf(s){ const mine=((store.get(PREP_KEY)[LESSON_ID])||{})[s.id]; return Object.assign(defPrep(s), mine||{}); }
function savePrepField(id,f,v){ const all=store.get(PREP_KEY), L=all[LESSON_ID]=all[LESSON_ID]||{}; const o=L[id]=L[id]||{}; o[f]=v; L._updated=Date.now(); return store.set(PREP_KEY,all); }
function isCustom(id){ const o=((store.get(PREP_KEY)[LESSON_ID])||{})[id]; return !!(o&&Object.keys(o).length); }
$('[data-f="goal"]').innerHTML=Object.entries(GOALS).map(([k,v])=>`<option value="${k}">${v}</option>`).join('');
function totalMin(){ return ACTIVE.reduce((a,s)=>a+(+prepOf(s).min||0),0); }
function fillPrep(){
  const s=slides[current].cfg, p=prepOf(s);
  $('#ppNum').textContent=`${current+1} / ${slides.length}`; $('#ppTitle').textContent=nameOfSlide(s);
  PF.forEach(f=>{ const el=$(`#prep [data-f="${f}"]`); if(el && document.activeElement!==el) el.value=p[f]??''; });
  const pr=progOf(); const seen=pr&&pr.visited&&pr.visited.includes(s.id);
  $('#ppDone').innerHTML=seen?`<b>✓</b> تم عرض هذه الشريحة${LESSON.className?' مع '+esc(LESSON.className):''}`:'⏳ لم تُعرض هذه الشريحة بعد';
  $('#ppTotal').innerHTML=`⏱️ مجموع زمن الدرس حسب التحضير: <b>${totalMin()} دقيقة</b>${isCustom(s.id)?' · ✏️ معدّل':''}`;
}
let savedT;
$$('#prep [data-f]').forEach(el=>el.addEventListener('input',()=>{
  const ok=savePrepField(slides[current].cfg.id, el.dataset.f, el.dataset.f==='min'?(+el.value||0):el.value);
  const m=$('#ppSaved'); m.textContent=ok?'✓ تم الحفظ':'⚠️ تعذّر الحفظ'; m.classList.add('on'); clearTimeout(savedT); savedT=setTimeout(()=>m.classList.remove('on'),1400);
  if(el.dataset.f==='min') $('#ppTotal').innerHTML=`⏱️ مجموع زمن الدرس حسب التحضير: <b>${totalMin()} دقيقة</b> · ✏️ معدّل`;
}));
function togglePrep(force){
  const on=force===undefined?!document.body.classList.contains('prep-open'):force;
  document.body.classList.toggle('prep-open',on); $('#prepBtn').classList.toggle('on',on);
  if(on) fillPrep(); fit(); wake();
}
$('#prepBtn').onclick=()=>togglePrep();
$('#ppClose').onclick=()=>togglePrep(false);
$('#ppPrev').onclick=prev; $('#ppNext').onclick=next;
$('#ppReset').onclick=()=>{ if(!confirm('إرجاع تحضير هذه الشريحة للنص الافتراضي؟')) return; const all=store.get(PREP_KEY); if(all[LESSON_ID]) delete all[LESSON_ID][slides[current].cfg.id]; store.set(PREP_KEY,all); fillPrep(); };
$('#ppPrint').onclick=()=>{ saveProgress(); window.open(location.pathname+'#print','_blank'); };

/* ---------------- 🗂️ خريطة الشرائح ---------------- */
function openOverview(){
  const pr=progOf()||{visited:[]}, seen=pr.visited||[];
  const nSeen=ACTIVE.filter(s=>seen.includes(s.id)).length;
  $('#ovwStat').textContent=`${LESSON.className?esc(LESSON.className)+' · ':''}عُرضت ${nSeen} من ${slides.length} شريحة`;
  $('#ovwBar').style.width=(nSeen/slides.length*100)+'%';
  $('#ovwGrid').innerHTML=slides.map((sl,i)=>{ const s=sl.cfg, p=prepOf(s);
    return `<button class="ovw-it ${seen.includes(s.id)?'seen':''} ${i===current?'cur':''}" data-i="${i}">${isCustom(s.id)?'<span class="pm" title="تحضير معدّل">📝</span>':''}<span class="on">${String(i+1).padStart(2,'0')} · ${p.min||0} د</span><span class="ot">${esc(nameOfSlide(s))}</span><span class="og">${strip(s.tag||'')}</span></button>`; }).join('');
  $$('#ovwGrid .ovw-it').forEach(b=>b.onclick=()=>{ $('#ovw').classList.remove('open'); go(+b.dataset.i); });
  $('#ovw').classList.add('open');
}
$('#ovwBtn').onclick=openOverview;

/* ---------------- 🖨️ طباعة التحضير ---------------- */
function renderPrint(){
  document.body.classList.add('print-mode'); document.title='تحضير — '+LESSON.fullTitle;
  const nl=t=>esc(t||'');
  const rows=ACTIVE.map((s,i)=>{ const p=prepOf(s); return `<tr><td>${i+1}</td><td><b>${esc(nameOfSlide(s))}</b><small>${esc(strip(s.tag||''))}</small></td><td>${p.min||0} د</td><td>${esc(GOALS[p.goal]||'')}</td><td>${nl(p.st)}</td><td>${nl(p.t)}</td><td>${nl(p.s)}</td><td>${nl(p.ev)}</td><td>${nl(p.note)}</td></tr>`; }).join('');
  $('#printDoc').innerHTML=`
    <div class="pd-tools"><button onclick="print()">🖨️ طباعة / حفظ PDF</button><button class="l" onclick="location.hash='';location.reload()">↩ العودة للعرض</button></div>
    <div class="pd-head"><div><div class="sub">${esc(LESSON.subject)} · ${esc(LESSON.unit)}</div><h1>تحضير ${esc(LESSON.lessonNo)}: ${esc(LESSON.fullTitle)}</h1></div><div class="sub">⏱️ الزمن الكلي: <b>${totalMin()} دقيقة</b></div></div>
    <div class="pd-meta"><div><b>المعلمة</b>${esc(LESSON.teacher)}</div><div><b>المدرسة</b>${esc(LESSON.school)}</div><div><b>الفصل</b>${esc(LESSON.className||'…………………')}</div><div><b>التاريخ</b>…… / …… / ………</div></div>
    <div class="pd-goals"><h3>🎯 أهداف الدرس</h3><ol>${Object.keys(GOALS).filter(k=>k!=='g0'&&k!=='g4').map(k=>`<li>${GOALS[k]}</li>`).join('')}</ol>
      <div style="margin-top:6px"><b>المفاهيم الرئيسة:</b> ${PR.concepts||'—'} &nbsp;·&nbsp; <b>الوسائل:</b> ${PR.tools||'العرض التفاعلي، السبورة الذكية، الكتاب المدرسي'}</div></div>
    <table><thead><tr><th>#</th><th style="width:15%">الشريحة</th><th>الزمن</th><th style="width:11%">الهدف</th><th style="width:10%">الاستراتيجية</th><th style="width:20%">إجراءات المعلمة</th><th style="width:14%">نشاط الطالبات</th><th style="width:12%">التقويم</th><th style="width:10%">ملاحظات</th></tr></thead><tbody>${rows}</tbody></table>
    ${PR.homework?`<div class="pd-goals" style="margin-top:14px"><b>📚 الواجب:</b> ${PR.homework}</div>`:''}
    <div class="pd-sign"><span>توقيع المعلمة: ………………………</span><span>توقيع المشرفة / القائدة: ………………………</span></div>`;
}

/* ---------------- ▶️ البداية + الاستكمال ---------------- */
const JUMP=(location.hash.match(/^#s=(\d+)/)||[])[1];
if(PRINT){ renderPrint(); }
else if(JUMP){ drawScores(); go(Math.min(+JUMP-1,slides.length-1)); }
else {
  drawScores();
  const pr=progOf();
  if(pr && pr.slide>0 && pr.slide<slides.length){
    // استرجاع النقاط المحفوظة
    if(COMP && pr.scores) LESSON.teams.forEach((t,k)=>{ if(pr.scores[t.name]!=null) scores[k]=pr.scores[t.name]; });
    const n=Math.min(pr.slide,slides.length-1), seen=(pr.visited||[]).length;
    const d=pr.updated?new Date(pr.updated).toLocaleDateString('ar-SA',{weekday:'long',day:'numeric',month:'long'}):'';
    $('#rsT').textContent=`أهلًا ${LESSON.teacher}!`;
    $('#rsP').innerHTML=`آخر مرة${LESSON.className?' مع <b>'+esc(LESSON.className)+'</b>':''} وصلتِ إلى الشريحة <b>${n+1}</b>: «${esc(nameOfSlide(slides[n].cfg))}»${d?'<br>'+d:''} · عُرضت ${seen} من ${slides.length} شريحة`;
    $('#rsBar').style.width=(Math.min(seen,slides.length)/slides.length*100)+'%';
    $('#rsGo').textContent=`▶ أكملي من الشريحة ${n+1}`;
    $('#rsGo').onclick=()=>{ $('#resume').classList.remove('open'); drawScores(); go(n); };
    $('#rsNew').onclick=()=>{ $('#resume').classList.remove('open'); scores.fill(0); drawScores(); go(0); };
    go(0,true); $('#resume').classList.add('open');
  } else go(0);
}
