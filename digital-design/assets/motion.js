/* ==========================================================================
   🎬 «استوديو الموشن» — إضافة مشتركة لدروس الفصل الثامن: الموشن جرافيك
   --------------------------------------------------------------------------
   • يُحمَّل في <head> قبل ملف الدرس، ثم يُحمَّل studio.js بعد الدرس.
   • يوفّر: HERO_ART (رسمة الترحيب) و R_EXT (قوالب شرائح جديدة):
       mgbuild    ← بناء فيديو موشن عنصرًا عنصرًا (الرسوم، الحركة، النصوص، الصوت)
       keyframes  ← محاكي After Effects مصغّر: إطارات مفتاحية + تسهيل + تشغيل
       typeanim   ← تحريك كلمة/اسم بمؤثرات جاهزة
       storyboard ← القصة المصورة (3 مشاهد) ثم تشغيلها
       wizard     ← محاكاة خطوات Illustrator و After Effects بالنقر
   ========================================================================== */

/* 🎬 رسمة الشريحة الترحيبية: نافذة تركيب (Composition) + خط زمني */
function HERO_ART(firstName) {
  return `<div class="mhero">
    <div class="mh-win">
      <div class="mh-bar"><span class="dots"><i></i><i></i><i></i></span><span>Comp 1 · 1920×1080 · 30fps</span></div>
      <div class="mh-comp">
        <div class="mh-trail"><i></i><i></i><i></i><i></i></div>
        <div class="mh-ball"></div><div class="mh-sq"></div><div class="mh-tri"></div>
        <div class="mh-word">MOTION</div>
        <svg class="mh-path" viewBox="0 0 600 330"><path d="M40 270 C 160 40, 300 40, 360 170 S 520 300, 570 60" fill="none" stroke="#B6F03A" stroke-width="3" stroke-dasharray="6 8"/></svg>
      </div>
      <div class="mh-tl">
        ${[['#6C3BFF', 'Shape'], ['#00C2FF', 'Text'], ['#FF3D8B', 'Logo']].map((r, k) => `<div class="mh-row"><b style="--c:${r[0]}">${r[1]}</b><div class="mh-trk"><span class="mh-lay" style="--c:${r[0]};--s:${k * 12}%;--e:${92 - k * 10}%"></span>${[10 + k * 8, 38, 64 - k * 4, 86].map(p => `<i class="kfd" style="left:${p}%"></i>`).join('')}</div></div>`).join('')}
        <i class="mh-ph"></i>
      </div>
    </div>
    <div class="mh-chip ease"><svg viewBox="0 0 60 40"><path d="M4 36 C 30 36, 30 4, 56 4" fill="none" stroke="#6C3BFF" stroke-width="4" stroke-linecap="round"/></svg><span>Easy Ease</span></div>
    <div class="mh-chip fps">24<small>fps</small></div>
    <div class="mh-chip kf"><i></i><i></i><i></i><span>Keyframes</span></div>
    <div class="mcur c1"><svg viewBox="0 0 24 24"><path d="M4 2 L4 19 L8.5 14.8 L11.6 21.5 L14.4 20.2 L11.4 13.6 L17.5 13.2 Z" fill="#6C3BFF" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg><span>${esc(firstName)}</span></div>
    <div class="mcur c2"><svg viewBox="0 0 24 24"><path d="M4 2 L4 19 L8.5 14.8 L11.6 21.5 L14.4 20.2 L11.4 13.6 L17.5 13.2 Z" fill="#FF3D8B" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg><span>الطالبات</span></div>
  </div>`;
}

/* 🔊 موسيقى خلفية بسيطة (WebAudio) لعنصر «الصوت» */
const MG_MUSIC = (() => {
  let ctx = null, timer = null, step = 0;
  const notes = [523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 880, 698.46];
  const tone = (f, t, d, v) => { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'triangle'; o.frequency.value = f; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .02); g.gain.exponentialRampToValueAtTime(.001, t + d); o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + d + .05); };
  return {
    start() { try { ctx = ctx || new (window.AudioContext || window.webkitAudioContext)(); ctx.resume && ctx.resume(); } catch (e) { return; } this.stop(); step = 0;
      timer = setInterval(() => { const t = ctx.currentTime; tone(notes[step % 8], t, .28, .07); if (step % 2 === 0) tone(notes[step % 8] / 2, t, .5, .05); step++; }, 260); },
    stop() { clearInterval(timer); timer = null; },
    get on() { return !!timer; }
  };
})();

/* واجهات المحاكاة: Illustrator و After Effects (عنصر data-go هو المطلوب الضغط عليه) */
const WZ_UI = {
  'ai-new': `<div class="wz-dlg wide"><div class="wz-dh">New Document</div><div class="wz-tabs"><span>Recent</span><span>Mobile</span><span>Web</span><span>Print</span><span class="on">Film &amp; Video</span><span>Art &amp; Illustration</span></div>
    <div class="wz-presets">${[['HDV 720', '1280×720'], ['HDTV 1080', '1920×1080'], ['4K UHD', '3840×2160'], ['8K FUHD', '7680×4320']].map((p, k) => `<div class="wz-pre" ${k === 1 ? 'data-go' : ''}><i>▶</i><b>${p[0]}</b><small>${p[1]}</small></div>`).join('')}</div>
    <div class="wz-row"><span>Width 1920 px</span><span>Height 1080 px</span><span>RGB Color</span><span class="wz-btn">Create</span></div></div>`,
  'ai-place': `<div class="wz-menu-open"><div class="wz-dd"><span>New…</span><span>Open…</span><span data-go>Place…</span><span>Export ▸</span><span>Save As…</span></div></div><div class="wz-canvas"><div class="wz-sketch">رمضان</div></div>`,
  'ai-pen': `<div class="wz-tools">${['↖', '✒', '🖌', '▭', 'T', '✋', '🔍'].map((t, k) => `<span ${k === 1 ? 'data-go title="Pen Tool"' : ''}>${t}</span>`).join('')}</div><div class="wz-canvas"><div class="wz-sketch">رمضان</div><div class="wz-tag">Pen Tool ✒</div></div>`,
  'ai-layers': `<div class="wz-canvas"><div class="wz-ink">رمضان</div></div><div class="wz-panel"><div class="wz-ph">Layers</div><div class="wz-lr">👁 Layer 1 — Sketch 🖼</div><div class="wz-lr">👁 Layer 1 — Paths</div><div class="wz-btn sm" data-go>Release to Layers + 🗑 حذف السكتش</div></div>`,
  'ai-save': `<div class="wz-dlg"><div class="wz-dh">Save As</div><div class="wz-row"><span>Save As: <b>رمضان</b></span></div><div class="wz-row"><span>Format:</span><span class="wz-sel" data-go>Adobe Illustrator (ai) ▾</span></div><div class="wz-row"><span class="wz-btn ghost">Cancel</span><span class="wz-btn">Save</span></div></div>`,
  'ae-new': `<div class="wz-home"><div class="wz-tile"><i>⧉</i><b>New Composition</b></div><div class="wz-tile" data-go><i>⧉🎞</i><b>New Composition<br>From Footage</b></div></div>`,
  'ae-import': `<div class="wz-dlg"><div class="wz-dh">Import File</div><div class="wz-file">🖼 رمضان.ai</div><div class="wz-row"><span>Import As:</span><span class="wz-sel" data-go>Composition ▾</span></div><div class="wz-row"><span>☑ Create Composition</span><span class="wz-btn">Open</span></div></div>`,
  'ae-comp': `<div class="wz-dlg"><div class="wz-dh">Composition Settings</div><div class="wz-grid2"><span>Width</span><b>1920 px</b><span>Height</span><b>1080 px</b><span>Frame Rate</span><b>30 fps</b><span>Duration</span><b>0:00:05:00</b><span>Background</span><b><i class="wz-sw"></i> White</b></div><div class="wz-row"><span class="wz-btn ghost">Cancel</span><span class="wz-btn" data-go>OK</span></div></div>`,
  'ae-anim': `<div class="wz-ae"><div class="wz-view"><div class="wz-ink sm">رمضان</div></div><div class="wz-tlx"><div class="wz-lr">▾ 1 &nbsp; رمضان.ai</div><div class="wz-lr in">▾ Transform</div>${['Anchor Point', 'Position', 'Scale', 'Rotation', 'Opacity'].map((p, k) => `<div class="wz-lr in2"><span class="wz-stop" ${k === 1 ? 'data-go' : ''}>⏱</span>${p}<i class="wz-kbar"></i></div>`).join('')}</div></div>`,
  'ae-render': `<div class="wz-menu-open"><div class="wz-dd"><span>New ▸</span><span>Save</span><span>Export ▸</span><span class="sub" data-go>Add to Render Queue</span><span>Close Project</span></div></div><div class="wz-panel wide"><div class="wz-ph">Render Queue</div><div class="wz-lr">Output Module: <b>High Quality</b> · Output To: <b>رمضان.mov</b></div></div>`
};

window.R_EXT = {

  /* 🧩 بناء فيديو موشن بعناصره الأربعة */
  mgbuild: {
    html: s => `<div class="mb-wrap">
      <div class="mb-side rv"><p class="lead">${s.prompt || ''}</p>
        ${s.items.map((it, k) => `<button class="fix-t mb-t" data-c="${it.c}" data-k="${k}" style="--c:${it.color}"><span class="tg"></span><span>${it.icon} ${it.t}</span></button>`).join('')}
        <div class="mb-info"><div class="mbi-ic">🎬</div><p>اضغطي على عنصر لإضافته إلى الفيديو… وراقبي كيف يتغير!</p></div></div>
      <div class="mb-screen rv"><div class="mb-bar"><span class="dots"><i></i><i></i><i></i></span><span>Preview · ${s.name || 'إعلان توعوي'}</span><span class="mb-live">● LIVE</span></div>
        <div class="mb-stage">
          <div class="mb-empty">🎞️ إطار فارغ… أضيفي العناصر</div>
          <div class="mb-gfx"><span class="d d1">💧</span><span class="d d2">💧</span><span class="d d3">💧</span><div class="wave w1"></div><div class="wave w2"></div><div class="sun"></div><div class="tap">🚰</div></div>
          <div class="mb-txt"><b>${s.headline || 'كل قطرة تصنع فرقًا'}</b><small>${s.sub || 'وفّر الماء… من أجل مستقبلنا 🌱'}</small><span class="logo">${s.logo || '💧 حملة قطرة'}</span></div>
          <div class="mb-snd"><span>🔊</span>${Array.from({ length: 10 }, (_, k) => `<i style="--k:${k}"></i>`).join('')}</div>
        </div></div></div>`,
    init: (sec, s) => {
      const st = $('.mb-stage', sec), info = $('.mb-info', sec);
      const upd = () => { const n = $$('.mb-t.on', sec).length; st.classList.toggle('has', n > 0); if (n === s.items.length && !sec._done) { sec._done = 1; celebrate(st, true); } };
      $$('.mb-t', sec).forEach(b => b.onclick = () => {
        const on = b.classList.toggle('on'), it = s.items[+b.dataset.k]; st.classList.toggle(b.dataset.c, on);
        if (b.dataset.c === 'e-sound') on ? MG_MUSIC.start() : MG_MUSIC.stop();
        info.style.setProperty('--c', it.color);
        info.innerHTML = `<div class="mbi-ic">${it.icon}</div><h3>${it.t}${it.en ? `<small>${it.en}</small>` : ''}</h3><p>${it.d}</p>`; retrigger(info, 'pop');
        on ? sound.ding() : sound.pop(); upd();
      });
      const chk = setInterval(() => { if (!document.body.contains(sec)) return clearInterval(chk); if (!isActive(sec) && MG_MUSIC.on && $('.mb-t[data-c="e-sound"].on', sec)) { MG_MUSIC.stop(); const b = $('.mb-t[data-c="e-sound"]', sec); b.classList.remove('on'); st.classList.remove('e-sound'); } }, 500);
    }
  },

  /* ⏱ محاكي After Effects: إطارات مفتاحية */
  keyframes: {
    html: s => {
      const T = s.T || 3, ticks = Array.from({ length: T * 2 + 1 }, (_, k) => `<span style="left:${k / (T * 2) * 100}%">${k % 2 ? '' : (k / 2) + 's'}</span>`).join('');
      return `<div class="kf-wrap no-swipe">
      <div class="kf-main rv">
        <div class="kf-comp"><div class="kf-safe"></div><div class="kf-obj">${s.obj || '<div class="kf-logo">MG</div>'}</div><div class="kf-tc">0:00:00:00</div><div class="kf-toast"></div></div>
        <div class="kf-tl">
          <div class="kf-ctrl"><button class="kf-play">▶ Play</button><button class="kf-ease">〰️ Easy Ease</button><button class="kf-demo">🎬 مثال جاهز</button><button class="kf-reset">↺ Reset</button><span class="kf-time">0.0s</span></div>
          <div class="kf-row kf-head"><span></span><span class="kf-hl">Transform</span><span></span><span></span><div class="kf-ruler">${ticks}<i class="kf-ph"></i></div></div>
          ${KF_PROPS.map(p => `<div class="kf-row" data-p="${p.k}"><button class="kf-sw" title="Stopwatch">⏱</button><span class="kf-name">${p.en}<small>${p.t}</small></span><input type="range" min="${p.min}" max="${p.max}" step="1" value="${p.def}"><span class="kf-v">${p.def}</span><div class="kf-track"><i class="kf-ph"></i></div></div>`).join('')}
        </div></div>
      <div class="kf-side rv"><div class="kf-tip">💡 <b>الإطار المفتاحي Keyframe</b>: نقطة نحدد عندها قيمة الخاصية. حرّكي المؤشر الزمني، ثم اضغطي ⏱ وغيّري القيمة… والبرنامج يملأ الحركة بين الإطارات تلقائيًا.</div>
        ${s.missions ? `<div class="kf-miss">${s.missions.map((m, k) => `<span class="mm" data-k="${k}">${m.t}</span>`).join('')}</div>` : ''}</div></div>`;
    },
    init: (sec, s) => {
      const T = s.T || 3, obj = $('.kf-obj', sec), tc = $('.kf-tc', sec), toast = $('.kf-toast', sec);
      const st = {}, keys = {}, anim = {}; KF_PROPS.forEach(p => { st[p.k] = p.def; keys[p.k] = []; anim[p.k] = false; });
      let t = 0, ease = false, raf = null, last = 0, done = new Set();
      const say = m => { toast.textContent = m; retrigger(toast, 'pop'); clearTimeout(toast._t); toast._t = setTimeout(() => toast.textContent = '', 2400); };
      const mission = k => { if (!s.missions) return; s.missions.forEach((m, j) => { if (m.k === k && !done.has(j)) { done.add(j); const el = $(`.mm[data-k="${j}"]`, sec); el.classList.add('ok'); retrigger(el, 'pop'); sound.ding(); if (done.size === s.missions.length) setTimeout(() => celebrate($('.kf-comp', sec)), 250); } }); };
      const E = u => ease ? (u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2) : u;
      const val = (p, tt) => { const k = keys[p]; if (!anim[p] || !k.length) return st[p]; if (tt <= k[0].t) return k[0].v; if (tt >= k[k.length - 1].t) return k[k.length - 1].v;
        for (let i = 0; i < k.length - 1; i++) if (tt >= k[i].t && tt <= k[i + 1].t) { const u = (tt - k[i].t) / (k[i + 1].t - k[i].t || 1); return k[i].v + (k[i + 1].v - k[i].v) * E(u); } return st[p]; };
      const checkM = () => { if (keys.x.length >= 2 || keys.y.length >= 2) mission('pos'); if (keys.s.length >= 2) mission('scale'); if (keys.r.length >= 2) mission('rot'); if (keys.o.length >= 2) mission('op'); };
      const draw = () => {
        const v = {}; KF_PROPS.forEach(p => v[p.k] = val(p.k, t));
        obj.style.transform = `translate(calc(-50% + ${v.x}px), calc(-50% + ${v.y}px)) rotate(${v.r}deg) scale(${v.s / 100})`; obj.style.opacity = v.o / 100;
        const pct = t / T * 100; $$('.kf-ph', sec).forEach(e => e.style.left = pct + '%');
        const fr = Math.round(t * 30); tc.textContent = `0:00:0${Math.floor(t)}:${String(fr % 30).padStart(2, '0')}`; $('.kf-time', sec).textContent = t.toFixed(1) + 's';
        KF_PROPS.forEach(p => { const row = $(`.kf-row[data-p="${p.k}"]`, sec), inp = $('input', row); if (document.activeElement !== inp) inp.value = Math.round(v[p.k]); $('.kf-v', row).textContent = Math.round(v[p.k]) + p.u;
          row.classList.toggle('anim', anim[p.k]); $('.kf-track', row).innerHTML = `<i class="kf-ph" style="left:${pct}%"></i>` + keys[p.k].map((k, j) => `<b class="kfd${Math.abs(k.t - t) < .05 ? ' cur' : ''}${ease ? ' ez' : ''}" data-j="${j}" style="left:${k.t / T * 100}%"></b>`).join(''); });
      };
      const setKey = (p, v) => { const k = keys[p], tt = Math.round(t * 10) / 10, f = k.find(x => Math.abs(x.t - tt) < .05); if (f) f.v = v; else { k.push({ t: tt, v }); k.sort((a, b) => a.t - b.t); sound.tick(); } checkM(); };
      KF_PROPS.forEach(p => {
        const row = $(`.kf-row[data-p="${p.k}"]`, sec), inp = $('input', row);
        $('.kf-sw', row).onclick = () => { stop(); if (!anim[p.k]) { anim[p.k] = true; keys[p.k] = [{ t: Math.round(t * 10) / 10, v: st[p.k] }]; say('⏱ تم تفعيل التحريك لخاصية ' + p.t + ' — أضيف أول إطار مفتاحي ◆'); sound.pop(); }
          else { st[p.k] = val(p.k, t); anim[p.k] = false; keys[p.k] = []; say('أُلغي تحريك ' + p.t); } draw(); };
        inp.oninput = () => { stop(); const v = +inp.value; if (anim[p.k]) setKey(p.k, v); else st[p.k] = v; draw(); };
        inp.onchange = () => { if (!anim[p.k]) say('💡 اضغطي ⏱ أولًا لتسجيل إطار مفتاحي عند هذا الزمن'); };
        $('.kf-track', row).addEventListener('click', e => { const d = e.target.closest('.kfd'); if (d) { stop(); t = keys[p.k][+d.dataset.j].t; draw(); } });
      });
      const ruler = $('.kf-ruler', sec);
      const seek = e => { const r = ruler.getBoundingClientRect(); t = Math.max(0, Math.min(T, (e.clientX - r.left) / r.width * T)); t = Math.round(t * 10) / 10; draw(); };
      ruler.addEventListener('pointerdown', e => { stop(); seek(e); try { ruler.setPointerCapture(e.pointerId); } catch (_) { } ruler._d = 1; });
      ruler.addEventListener('pointermove', e => { if (ruler._d) seek(e); });
      ruler.addEventListener('pointerup', () => ruler._d = 0);
      const loop = ts => { if (!isActive(sec)) return stop(); const dt = (ts - (last || ts)) / 1000; last = ts; t += dt; if (t > T) t = 0; draw(); raf = requestAnimationFrame(loop); };
      function stop() { if (raf) cancelAnimationFrame(raf); raf = null; last = 0; $('.kf-play', sec).textContent = '▶ Play'; }
      $('.kf-play', sec).onclick = () => { if (raf) return stop(); const any = Object.values(keys).some(k => k.length >= 2); if (!any) say('أضيفي إطارين مفتاحيين على الأقل لخاصية واحدة لتظهر الحركة'); else mission('play'); $('.kf-play', sec).textContent = '⏸ Pause'; raf = requestAnimationFrame(loop); sound.pop(); };
      $('.kf-ease', sec).onclick = e => { ease = !ease; e.currentTarget.classList.toggle('on', ease); if (ease) { mission('ease'); say('〰️ Easy Ease: الحركة تبدأ ببطء ثم تتسارع ثم تتباطأ… فتبدو طبيعية'); } draw(); sound.pop(); };
      $('.kf-reset', sec).onclick = () => { stop(); KF_PROPS.forEach(p => { st[p.k] = p.def; keys[p.k] = []; anim[p.k] = false; }); t = 0; ease = false; $('.kf-ease', sec).classList.remove('on'); draw(); };
      $('.kf-demo', sec).onclick = () => { stop(); const D = s.demo || { x: [[0, -320], [1.4, 0]], s: [[0, 30], [1.4, 100], [2, 120], [2.4, 100]], r: [[0, -180], [1.4, 0]], o: [[0, 0], [.6, 100]] };
        KF_PROPS.forEach(p => { anim[p.k] = !!D[p.k]; keys[p.k] = (D[p.k] || []).map(a => ({ t: a[0], v: a[1] })); }); ease = true; $('.kf-ease', sec).classList.add('on'); t = 0; draw(); say('🎬 مثال جاهز: اضغطي Play'); sound.ding(); };
      draw();
    }
  },

  /* ✍️ تحريك كلمة أو اسم */
  typeanim: {
    html: s => `<div class="ta-wrap">
      <div class="ta-side rv">
        <label class="ta-in"><span>✏️ اكتبي الكلمة أو اسمكِ:</span><input type="text" maxlength="14" value="${esc(s.word || 'اسمي')}"></label>
        <div class="ta-g"><div class="ta-gt">🎞️ نوع الحركة</div><div class="ta-ps">${TA_PRESETS.map((p, k) => `<button class="ta-p" data-k="${k}"><span>${p.icon}</span>${p.t}<small>${p.en}</small></button>`).join('')}</div></div>
        <div class="ta-g"><div class="ta-gt">〰️ التسهيل Easing</div><div class="ta-ps three">${[['linear', 'خطي Linear'], ['cubic-bezier(.65,0,.35,1)', 'Easy Ease'], ['cubic-bezier(.34,1.56,.64,1)', 'ارتداد Back']].map((e, k) => `<button class="ta-e ${k === 1 ? 'on' : ''}" data-e="${e[0]}">${e[1]}</button>`).join('')}</div></div>
        <div class="ta-g"><div class="ta-gt">⏱ المدة: <b class="ta-dv">1.2</b> ثانية</div><input type="range" class="ta-d" min="0.4" max="3" step="0.1" value="1.2"></div>
      </div>
      <div class="ta-screen rv"><div class="ta-stage"><div class="ta-word"></div></div><div class="ta-bar"><button class="btn primary ta-play">▶ إعادة التشغيل</button><span class="ta-cnt"></span></div></div></div>`,
    init: (sec, s) => {
      let k = 0, e = 'cubic-bezier(.65,0,.35,1)', d = 1.2; const seen = new Set(), inp = $('.ta-in input', sec), stg = $('.ta-word', sec);
      const play = () => { const P = TA_PRESETS[k], w = esc(inp.value.trim() || 'اسمي');
        stg.innerHTML = P.k === 'write' ? `<svg viewBox="0 0 1000 300"><text x="500" y="200" text-anchor="middle" class="ta-svgt" style="animation-duration:${d * 1.8}s,${d * .6}s;animation-delay:0s,${d * 1.5}s">${w}</text></svg>`
          : P.k === 'type' ? `<span class="ta-w ta-type" style="--n:${w.length};animation-duration:${d}s">${w}</span>` : `<span class="ta-w" style="animation:ta-${P.k} ${d}s ${e} both">${w}</span>`;
        $('.ta-cnt', sec).textContent = `جرّبتِ ${seen.size} من ${TA_PRESETS.length} حركات`; };
      $$('.ta-p', sec).forEach(b => b.onclick = () => { k = +b.dataset.k; $$('.ta-p', sec).forEach(x => x.classList.toggle('on', x === b)); seen.add(k); b.classList.add('seen'); play(); sound.pop(); if (seen.size >= 4 && !sec._c) { sec._c = 1; setTimeout(() => celebrate($('.ta-stage', sec), true), d * 1000); } });
      $$('.ta-e', sec).forEach(b => b.onclick = () => { e = b.dataset.e; $$('.ta-e', sec).forEach(x => x.classList.toggle('on', x === b)); play(); sound.pop(); });
      $('.ta-d', sec).oninput = ev => { d = +ev.target.value; $('.ta-dv', sec).textContent = d.toFixed(1); };
      $('.ta-d', sec).onchange = play;
      inp.addEventListener('keydown', ev => { ev.stopPropagation(); if (ev.key === 'Enter') play(); });
      inp.addEventListener('change', play);
      $('.ta-play', sec).onclick = () => { play(); sound.pop(); };
      $$('.ta-p', sec)[0].classList.add('on'); seen.add(0); $$('.ta-p', sec)[0].classList.add('seen'); play();
    },
    enter: sec => { const b = $('.ta-play', sec); b && setTimeout(() => b.click(), 500); }
  },

  /* 🎞️ القصة المصورة Storyboard: ثلاثة مشاهد ثم التشغيل */
  storyboard: {
    html: s => `<div class="sb-wrap">
      <div class="sb-frames rv">${(s.scenes || []).map((sc, k) => `<button class="sb-f" data-k="${k}"><span class="sb-n">${sc.t}</span><div class="sb-pic">${SB_SVG(s.word, sc.p, sc.color, k)}</div><p>${sc.d}</p></button>`).join('<span class="sb-ar">←</span>')}</div>
      <div class="sb-bottom rv"><div class="sb-prev"><div class="sb-big"></div></div>
        <div class="sb-side"><label class="ta-in"><span>✏️ كلمة المشروع:</span><input type="text" maxlength="12" value="${esc(s.word)}"></label><button class="btn primary sb-play">▶ تشغيل الفيديو</button><p class="sb-note">${s.note || ''}</p></div></div></div>`,
    init: (sec, s) => {
      const inp = $('.ta-in input', sec), big = $('.sb-big', sec);
      const render = () => { const w = esc(inp.value.trim() || s.word); $$('.sb-f', sec).forEach((f, k) => $('.sb-pic', f).innerHTML = SB_SVG(w, s.scenes[k].p, s.scenes[k].color, k)); big.innerHTML = `<div class="sb-hint">▶ اضغطي «تشغيل الفيديو» لمشاهدة المشاهد متتابعة</div>`; };
      $$('.sb-f', sec).forEach(f => f.onclick = () => { $$('.sb-f', sec).forEach(x => x.classList.toggle('on', x === f)); f.classList.add('seen'); const k = +f.dataset.k; big.innerHTML = SB_SVG(esc(inp.value.trim() || s.word), s.scenes[k].p, s.scenes[k].color, k, true); sound.pop(); });
      $('.sb-play', sec).onclick = () => { const w = esc(inp.value.trim() || s.word); big.innerHTML = `<svg viewBox="0 0 1000 340"><text x="500" y="230" text-anchor="middle" class="sb-anim">${w}</text></svg>`; sound.ding(); if (!sec._p) { sec._p = 1; setTimeout(() => celebrate(big, true), 3200); } };
      inp.addEventListener('keydown', e => e.stopPropagation()); inp.addEventListener('input', render);
      render();
    }
  },

  /* 🖱️ محاكاة خطوات البرنامج بالنقر */
  wizard: {
    html: s => `<div class="wz-wrap">
      <div class="wz-steps rv">${s.steps.map((st, k) => `<button class="wz-s" data-k="${k}"><span class="wz-n">${k + 1}</span><span>${st.t}</span></button>`).join('')}<div class="wz-info"></div></div>
      <div class="wz-app rv ${s.app}"><div class="wz-top"><span class="wz-logo">${s.app === 'ae' ? 'Ae' : 'Ai'}</span><span class="wz-title">${s.app === 'ae' ? 'Adobe After Effects' : 'Adobe Illustrator'}</span><span class="wz-mn">File &nbsp; Edit &nbsp; ${s.app === 'ae' ? 'Composition &nbsp; Layer &nbsp; Effect &nbsp; Animation' : 'Object &nbsp; Type &nbsp; Select &nbsp; Effect &nbsp; View'} &nbsp; Window &nbsp; Help</span></div>
        <div class="wz-body"></div><div class="wz-msg"></div></div></div>`,
    init: (sec, s) => {
      let cur = 0; const body = $('.wz-body', sec), msg = $('.wz-msg', sec), info = $('.wz-info', sec);
      const show = k => { cur = k; const st = s.steps[k]; body.innerHTML = WZ_UI[st.ui] || ''; retrigger(body, 'pop');
        $$('.wz-s', sec).forEach((b, j) => { b.classList.toggle('on', j === k); });
        info.innerHTML = `<b>${st.t}</b><p>${st.d}</p><div class="wz-do">👆 ${st.do}</div>`; msg.textContent = '';
        const go = $('[data-go]', body); if (go) go.onclick = ev => { ev.stopPropagation(); $$('.wz-s', sec)[k].classList.add('done'); go.classList.add('ok'); msg.className = 'wz-msg ok'; msg.textContent = '✅ ' + (st.ok || 'أحسنتِ!'); sound.ding();
          if (k < s.steps.length - 1) setTimeout(() => show(k + 1), 1100); else setTimeout(() => { body.innerHTML = `<div class="wz-done">🎉<b>${s.final || 'أنهيتِ جميع الخطوات!'}</b></div>`; celebrate(body); }, 900); };
      };
      body.addEventListener('click', () => { if ($('.wz-done', body)) return; msg.className = 'wz-msg bad'; msg.textContent = '🔎 ابحثي عن العنصر المتوهج في الواجهة'; retrigger(msg, 'shake'); sound.wrong(); });
      $$('.wz-s', sec).forEach(b => b.onclick = () => { show(+b.dataset.k); sound.pop(); });
      show(0);
    }
  }
};

const KF_PROPS = [
  { k: 'x', t: 'الموضع X', en: 'Position X', min: -360, max: 360, def: 0, u: '' },
  { k: 'y', t: 'الموضع Y', en: 'Position Y', min: -150, max: 150, def: 0, u: '' },
  { k: 's', t: 'التكبير والتصغير', en: 'Scale', min: 0, max: 200, def: 100, u: '%' },
  { k: 'r', t: 'التدوير', en: 'Rotation', min: -360, max: 360, def: 0, u: '°' },
  { k: 'o', t: 'الشفافية', en: 'Opacity', min: 0, max: 100, def: 100, u: '%' }
];
const TA_PRESETS = [
  { k: 'fade', icon: '🌫️', t: 'تلاشي', en: 'Fade' },
  { k: 'slide', icon: '➡️', t: 'انتقال', en: 'Slide' },
  { k: 'scale', icon: '🔍', t: 'تكبير', en: 'Scale' },
  { k: 'rotate', icon: '🔄', t: 'تدوير', en: 'Rotate' },
  { k: 'bounce', icon: '⚽', t: 'ارتداد', en: 'Bounce' },
  { k: 'write', icon: '✍️', t: 'كتابة يدوية', en: 'Write-on' },
  { k: 'type', icon: '⌨️', t: 'آلة كاتبة', en: 'Typewriter' },
  { k: 'blur', icon: '💨', t: 'ضبابي', en: 'Blur In' }
];
/* مشهد القصة المصورة: نسبة رسم الخط p (0–1) */
function SB_SVG(w, p, color, k, big) {
  const dash = 2600, off = Math.round(dash * (1 - p));
  return `<svg viewBox="0 0 1000 340"><text x="500" y="230" text-anchor="middle" class="sb-t${color ? ' col' : ''}" style="stroke-dasharray:${dash};stroke-dashoffset:${off}">${w}</text></svg>`;
}
