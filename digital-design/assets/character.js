/* ==========================================================================
   ✏️ «استوديو الشخصيات» — إضافة مشتركة لدروس الفصل السابع: تصميم الشخصيات
   --------------------------------------------------------------------------
   • يُحمَّل في <head> قبل ملف الدرس، ثم يُحمَّل studio.js بعد الدرس.
   • يوفّر:
       CH.svg(params)  ← مولّد شخصية SVG (الطول بالرؤوس، شكل الرأس والجذع،
                          الزي، اللون، تعبير الوجه، الإضاءة، خطوط الرؤوس…)
       HERO_ART()      ← رسمة الشريحة الترحيبية
       R_EXT           ← قوالب شرائح جديدة يدمجها المحرك تلقائيًا
   ========================================================================== */

const CH = (() => {
  let uid = 0;
  const INK = '#3A2A4A';
  const r1 = n => Math.round(n * 10) / 10;

  function svg(o = {}) {
    const p = Object.assign({
      H: 4, head: 'circle', body: 'square', outfit: 'casual',
      color: '#E85D3F', pants: '#3B3355', skin: '#F2C29B', hair: '#2B2135', accent: '#FFC542',
      expr: 'neutral', eye: 1, eyeLine: null, look: 0, beard: false,
      light: null, lightColor: '#FFE2B0', guides: false, sections: false, featureMap: false,
      view: 'full', style: 'color', pose: 'down', dy: 0, squash: 1, bg: null, shadow: true, clay: false
    }, o);
    const id = 'ch' + (++uid);
    const sk = p.style === 'sketch';
    const G = 560, T = 500, top = G - T, cx = 200;
    const u = T / p.H;
    const pen = sk ? '#77728C' : INK, sw = sk ? 2.4 : 3.2;
    const F = c => sk ? 'none' : c;
    const at = (c, x = '') => `fill="${F(c)}" stroke="${pen}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round" ${x}`;
    const out = [], back = [], front = [], defs = [];

    /* ---------- الرأس ---------- */
    const hw = u * (p.head === 'triangle' ? .5 : p.head === 'square' ? .44 : .45), hh = u / 2, hc = top + hh;
    const eyeLine = p.eyeLine ?? (p.head === 'triangle' ? .38 : p.head === 'square' ? .5 : .52);
    let headSvg;
    if (p.head === 'square') headSvg = `<rect x="${r1(cx - hw)}" y="${top}" width="${r1(hw * 2)}" height="${r1(u)}" rx="${r1(u * .2)}" ${at(p.skin)}/>`;
    else if (p.head === 'triangle') {
      const t = top + u * .04, b = top + u, r = u * .13;
      headSvg = `<path d="M${r1(cx - hw + r)} ${r1(t)} L${r1(cx + hw - r)} ${r1(t)} Q${r1(cx + hw)} ${r1(t)} ${r1(cx + hw - r * .55)} ${r1(t + r)} L${r1(cx + r * .45)} ${r1(b - r * .7)} Q${cx} ${r1(b)} ${r1(cx - r * .45)} ${r1(b - r * .7)} L${r1(cx - hw + r * .55)} ${r1(t + r)} Q${r1(cx - hw)} ${r1(t)} ${r1(cx - hw + r)} ${r1(t)} Z" ${at(p.skin)}/>`;
    } else headSvg = `<ellipse cx="${cx}" cy="${r1(hc)}" rx="${r1(hw)}" ry="${r1(hh)}" ${at(p.skin)}/>`;

    /* ---------- الجسم ---------- */
    const neck = p.H >= 4;
    const tt = top + u * (neck ? 1.06 : .96);
    const L = (p.H - 1) * .45 * u;
    const hip = tt + L;
    const SW = Math.min(300, u * (.55 + .2 * p.H));
    const footH = Math.max(9, u * .13);
    const AW = Math.max(11, SW * .19);
    let shX, shY;
    if (p.body === 'circle') { shX = SW * .5; shY = tt + L * .22; }
    else if (p.body === 'triangle') { shX = SW * .3; shY = tt + Math.min(u * .14, L * .2); }
    else { shX = SW * .5; shY = tt + Math.min(u * .14, L * .2); }
    const long = p.outfit === 'thobe' || p.outfit === 'girl';
    const bodyCol = p.outfit === 'thobe' ? '#FBFAF6' : p.color;

    // الشعر الخلفي للفتاة
    if (p.outfit === 'girl') {
      const hl = Math.min(hip, tt + L * .55);
      back.push(`<path d="M${r1(cx - hw * 1.12)} ${r1(hc)} C${r1(cx - hw * 1.2)} ${r1(top - u * .1)} ${r1(cx + hw * 1.2)} ${r1(top - u * .1)} ${r1(cx + hw * 1.12)} ${r1(hc)} L${r1(cx + hw * 1.05)} ${r1(hl)} Q${cx} ${r1(hl + u * .12)} ${r1(cx - hw * 1.05)} ${r1(hl)} Z" ${at(p.hair)}/>`);
    }

    // الساقان
    if (!long) {
      const LW = SW * .27, lx = SW * .2;
      [-1, 1].forEach(s => {
        const x = cx + s * lx;
        out.push(`<rect x="${r1(x - LW / 2)}" y="${r1(hip - 6)}" width="${r1(LW)}" height="${r1(G - footH - hip + 8)}" rx="${r1(LW * .3)}" ${at(p.pants)}/>`);
        out.push(`<ellipse cx="${r1(x + s * LW * .18)}" cy="${r1(G - footH / 2)}" rx="${r1(LW * .72)}" ry="${r1(footH / 2 + 1)}" ${at('#2A2236')}/>`);
      });
    } else {
      // صنادل / حذاء يظهر من تحت الثوب
      [-1, 1].forEach(s => out.push(`<ellipse cx="${r1(cx + s * SW * .2)}" cy="${r1(G - footH / 2)}" rx="${r1(SW * .17)}" ry="${r1(footH / 2 + 1)}" ${at(p.outfit === 'thobe' ? '#8B5A3C' : '#2A2236')}/>`));
    }

    // الجذع (أو الثوب/الفستان الطويل)
    const bottom = long ? G - footH * .8 : hip;
    let trunk;
    if (p.body === 'circle') {
      const bw = SW * .62;
      if (long) trunk = `<path d="M${r1(cx - SW * .36)} ${r1(tt)} Q${r1(cx - bw * 1.25)} ${r1(tt + L * .55)} ${r1(cx - bw * .78)} ${r1(bottom)} L${r1(cx + bw * .78)} ${r1(bottom)} Q${r1(cx + bw * 1.25)} ${r1(tt + L * .55)} ${r1(cx + SW * .36)} ${r1(tt)} Z" ${at(bodyCol)}/>`;
      else trunk = `<ellipse cx="${cx}" cy="${r1(tt + L * .5)}" rx="${r1(bw)}" ry="${r1(L * .58)}" ${at(bodyCol)}/>`;
    } else if (p.body === 'triangle') {
      const bw = long ? SW * .7 : SW * .62;
      trunk = `<path d="M${r1(cx - SW * .26)} ${r1(tt)} L${r1(cx + SW * .26)} ${r1(tt)} L${r1(cx + bw)} ${r1(bottom)} L${r1(cx - bw)} ${r1(bottom)} Z" ${at(bodyCol)}/>`;
    } else {
      const bw = long ? SW * .56 : SW * .5;
      trunk = long
        ? `<path d="M${r1(cx - SW * .5)} ${r1(tt + u * .05)} Q${r1(cx - SW * .5)} ${r1(tt)} ${r1(cx - SW * .4)} ${r1(tt)} L${r1(cx + SW * .4)} ${r1(tt)} Q${r1(cx + SW * .5)} ${r1(tt)} ${r1(cx + SW * .5)} ${r1(tt + u * .05)} L${r1(cx + bw)} ${r1(bottom)} L${r1(cx - bw)} ${r1(bottom)} Z" ${at(bodyCol)}/>`
        : `<rect x="${r1(cx - SW / 2)}" y="${r1(tt)}" width="${r1(SW)}" height="${r1(L)}" rx="${r1(Math.max(6, u * .1))}" ${at(bodyCol)}/>`;
    }
    out.push(trunk);
    if (p.outfit === 'thobe' && !sk) out.push(`<line x1="${cx}" y1="${r1(tt + 4)}" x2="${cx}" y2="${r1(tt + Math.min(L * .45, u * .9))}" stroke="#D8D4C8" stroke-width="2.4"/>`);
    if (p.outfit === 'girl' && !sk) out.push(`<path d="M${r1(cx - SW * .42)} ${r1(tt + L * .55)} L${r1(cx + SW * .42)} ${r1(tt + L * .55)}" stroke="${p.accent}" stroke-width="${r1(Math.max(5, u * .07))}" stroke-linecap="round"/>`);
    if (p.outfit === 'casual' && !sk) out.push(`<path d="M${r1(cx - Math.min(hw * .45, SW * .22))} ${r1(tt + 2)} Q${cx} ${r1(tt + Math.min(u * .28, L * .3))} ${r1(cx + Math.min(hw * .45, SW * .22))} ${r1(tt + 2)}" fill="none" stroke="${INK}" stroke-width="2.4" opacity=".55"/>`);

    // الذراعان
    const AL = Math.max(L * .95, u * .7) + (p.H >= 5 ? u * .2 : 0);
    const sleeve = p.outfit === 'thobe' ? '#FBFAF6' : bodyCol;
    [-1, 1].forEach(s => {
      const sx = cx + s * shX, sy = shY;
      let hx, hy, mx, my;
      const pose = p.pose === 'wave' ? (s > 0 ? 'up' : 'down') : p.pose;
      if (pose === 'up') { hx = sx + s * AL * .55; hy = sy - AL * .72; mx = sx + s * AL * .5; my = sy - AL * .15; }
      else if (pose === 'out') { hx = sx + s * AL * .92; hy = sy + AL * .25; mx = sx + s * AL * .45; my = sy + AL * .05; }
      else { hx = sx + s * AW * .9; hy = sy + AL; mx = sx + s * AW * 1.2; my = sy + AL * .5; }
      const d = `M${r1(sx)} ${r1(sy)} Q${r1(mx)} ${r1(my)} ${r1(hx)} ${r1(hy)}`;
      if (sk) out.push(`<path d="${d}" fill="none" stroke="${pen}" stroke-width="${r1(AW)}" stroke-linecap="round" opacity=".18"/><path d="${d}" fill="none" stroke="${pen}" stroke-width="${sw}" stroke-linecap="round"/>`);
      else out.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="${r1(AW + sw * 2)}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${sleeve}" stroke-width="${r1(AW)}" stroke-linecap="round"/>`);
      out.push(`<circle cx="${r1(hx)}" cy="${r1(hy)}" r="${r1(AW * .62)}" ${at(p.skin)}/>`);
    });

    // الرقبة
    if (neck) out.push(`<rect x="${r1(cx - u * .12)}" y="${r1(top + u * .82)}" width="${r1(u * .24)}" height="${r1(tt - top - u * .78)}" ${at(p.skin)}/>`);

    /* ---------- الرأس والملامح ---------- */
    out.push(headSvg);
    // الشعر الأمامي
    if (p.outfit === 'girl') {
      out.push(`<path d="M${r1(cx - hw * 1.02)} ${r1(top + u * .42)} C${r1(cx - hw * 1.05)} ${r1(top - u * .02)} ${r1(cx + hw * 1.05)} ${r1(top - u * .02)} ${r1(cx + hw * 1.02)} ${r1(top + u * .42)} Q${r1(cx + hw * .5)} ${r1(top + u * .16)} ${r1(cx)} ${r1(top + u * .26)} Q${r1(cx - hw * .5)} ${r1(top + u * .16)} ${r1(cx - hw * 1.02)} ${r1(top + u * .42)} Z" ${at(p.hair)}/>`);
      if (!sk) out.push(`<path d="M${r1(cx - hw * .9)} ${r1(top + u * .2)} Q${cx} ${r1(top - u * .06)} ${r1(cx + hw * .9)} ${r1(top + u * .2)}" fill="none" stroke="${p.accent}" stroke-width="${r1(Math.max(4, u * .06))}" stroke-linecap="round"/>`);
    } else if (p.outfit === 'casual') {
      out.push(`<path d="M${r1(cx - hw * 1.0)} ${r1(top + u * .36)} C${r1(cx - hw * 1.06)} ${r1(top - u * .06)} ${r1(cx + hw * 1.06)} ${r1(top - u * .06)} ${r1(cx + hw * 1.0)} ${r1(top + u * .36)} Q${r1(cx + hw * .6)} ${r1(top + u * .14)} ${r1(cx + hw * .1)} ${r1(top + u * .2)} Q${r1(cx - hw * .4)} ${r1(top + u * .08)} ${r1(cx - hw * 1.0)} ${r1(top + u * .36)} Z" ${at(p.hair)}/>`);
    } else if (p.outfit === 'thobe') {
      const pid = id + 'sh';
      const cell = Math.max(5, u * .085);
      defs.push(`<pattern id="${pid}" width="${r1(cell)}" height="${r1(cell)}" patternUnits="userSpaceOnUse"><rect width="${r1(cell)}" height="${r1(cell)}" fill="#fff"/><rect width="${r1(cell * .48)}" height="${r1(cell)}" fill="#D63A3A" opacity=".85"/><rect width="${r1(cell)}" height="${r1(cell * .48)}" fill="#D63A3A" opacity=".85"/></pattern>`);
      const drop = Math.min(u * .55, 80);
      const sh = `M${r1(cx - hw * 1.14)} ${r1(top + u * .52)} C${r1(cx - hw * 1.18)} ${r1(top - u * .14)} ${r1(cx + hw * 1.18)} ${r1(top - u * .14)} ${r1(cx + hw * 1.14)} ${r1(top + u * .52)} L${r1(cx + hw * 1.3)} ${r1(tt + drop)} L${r1(cx + hw * .72)} ${r1(tt + drop * .7)} L${r1(cx + hw * .8)} ${r1(top + u * .5)} C${r1(cx + hw * .82)} ${r1(top + u * .1)} ${r1(cx - hw * .82)} ${r1(top + u * .1)} ${r1(cx - hw * .8)} ${r1(top + u * .5)} L${r1(cx - hw * .72)} ${r1(tt + drop * .7)} L${r1(cx - hw * 1.3)} ${r1(tt + drop)} Z`;
      front.push(`<path d="${sh}" ${sk ? at('none') : `fill="url(#${pid})" stroke="${INK}" stroke-width="${sw}" stroke-linejoin="round"`}/>`);
      const ig = Math.max(3, u * .05);
      front.push(`<ellipse cx="${cx}" cy="${r1(top + u * .1)}" rx="${r1(hw * .98)}" ry="${r1(u * .075)}" fill="none" stroke="${sk ? pen : '#1E1A22'}" stroke-width="${r1(ig)}"/>`);
      front.push(`<ellipse cx="${cx}" cy="${r1(top + u * .17)}" rx="${r1(hw * .96)}" ry="${r1(u * .07)}" fill="none" stroke="${sk ? pen : '#1E1A22'}" stroke-width="${r1(ig)}"/>`);
    }

    const face = [];
    const eyeY = top + u * eyeLine, er = u * .072 * p.eye, ex = hw * (p.head === 'triangle' ? .36 : .42);
    const E = p.expr;
    // العينان
    [-1, 1].forEach(s => {
      const x = cx + s * ex;
      const ry = er * (E === 'surprised' ? 1.3 : E === 'happy' ? .95 : 1.15), rx = er * (E === 'surprised' ? 1.12 : 1);
      face.push(`<ellipse cx="${r1(x)}" cy="${r1(eyeY)}" rx="${r1(rx)}" ry="${r1(ry)}" fill="#fff" stroke="${pen}" stroke-width="${r1(sw * .8)}"/>`);
      const pr = er * (E === 'surprised' ? .38 : .58), py = eyeY + (E === 'sad' ? er * .3 : 0);
      if (!sk) face.push(`<circle cx="${r1(x + p.look * er * .35)}" cy="${r1(py)}" r="${r1(pr)}" fill="#2A1E2E"/><circle cx="${r1(x + p.look * er * .35 + pr * .35)}" cy="${r1(py - pr * .4)}" r="${r1(pr * .32)}" fill="#fff"/>`);
      else face.push(`<circle cx="${r1(x)}" cy="${r1(py)}" r="${r1(pr)}" fill="none" stroke="${pen}" stroke-width="2"/>`);
      if (E === 'angry') face.push(`<path d="M${r1(x - s * rx * 1.1)} ${r1(eyeY - ry * .2)} L${r1(x + s * rx * 1.1)} ${r1(eyeY - ry * .9)} L${r1(x + s * rx * 1.1)} ${r1(eyeY - ry * 1.3)} L${r1(x - s * rx * 1.1)} ${r1(eyeY - ry * 1.3)} Z" fill="${F(p.skin)}" stroke="none"/><line x1="${r1(x - s * rx * 1.1)}" y1="${r1(eyeY - ry * .2)}" x2="${r1(x + s * rx * 1.1)}" y2="${r1(eyeY - ry * .9)}" stroke="${pen}" stroke-width="${r1(sw * .8)}"/>`);
      if (E === 'sad') face.push(`<path d="M${r1(x + s * rx * 1.1)} ${r1(eyeY - ry * .25)} L${r1(x - s * rx * 1.1)} ${r1(eyeY - ry * .9)} L${r1(x - s * rx * 1.1)} ${r1(eyeY - ry * 1.3)} L${r1(x + s * rx * 1.1)} ${r1(eyeY - ry * 1.3)} Z" fill="${F(p.skin)}" stroke="none"/><line x1="${r1(x + s * rx * 1.1)}" y1="${r1(eyeY - ry * .25)}" x2="${r1(x - s * rx * 1.1)}" y2="${r1(eyeY - ry * .9)}" stroke="${pen}" stroke-width="${r1(sw * .8)}"/>`);
    });
    // الحاجبان: [ارتفاع الطرف الداخلي، ارتفاع الطرف الخارجي]
    const BR = { neutral: [0, 0], happy: [-.55, -.45], sad: [-1, .25], surprised: [-1.1, -.9], angry: [.75, -.45] }[E] || [0, 0];
    const by = eyeY - er * 2, bl = er * 1.25, bw = Math.max(3, u * .032);
    [-1, 1].forEach(s => {
      const xi = cx + s * (ex - bl * .8), xo = cx + s * (ex + bl * .9);
      const yi = by + BR[0] * er, yo = by + BR[1] * er;
      face.push(`<path d="M${r1(xi)} ${r1(yi)} Q${r1((xi + xo) / 2)} ${r1(Math.min(yi, yo) - er * (E === 'angry' ? 0 : .35))} ${r1(xo)} ${r1(yo)}" fill="none" stroke="${sk ? pen : '#2A1E2E'}" stroke-width="${r1(bw)}" stroke-linecap="round"/>`);
    });
    // الأنف
    const ny = eyeY + er * 1.6;
    face.push(p.H <= 3 ? `<ellipse cx="${cx}" cy="${r1(ny)}" rx="${r1(er * .32)}" ry="${r1(er * .22)}" fill="${sk ? 'none' : '#D9967A'}" stroke="${sk ? pen : 'none'}"/>`
      : `<path d="M${r1(cx)} ${r1(eyeY + er * .6)} Q${r1(cx + er * .55)} ${r1(ny + er * .25)} ${r1(cx - er * .1)} ${r1(ny + er * .4)}" fill="none" stroke="${pen}" stroke-width="${r1(sw * .7)}" stroke-linecap="round"/>`);
    // الفم
    const my = top + u * Math.min(p.head === 'triangle' ? .7 : .84, eyeLine + (p.head === 'triangle' ? .26 : .27)), mw = hw * (p.head === 'triangle' ? .32 : .4);
    const ms = `stroke="${pen}" stroke-width="${r1(sw * .9)}" stroke-linecap="round"`;
    if (E === 'happy') face.push(`<path d="M${r1(cx - mw)} ${r1(my - er * .3)} Q${cx} ${r1(my + er * 2.4)} ${r1(cx + mw)} ${r1(my - er * .3)} Z" fill="${sk ? 'none' : '#7A2E3B'}" ${ms}/>` + (sk ? '' : `<path d="M${r1(cx - mw * .55)} ${r1(my + er * .9)} Q${cx} ${r1(my + er * .35)} ${r1(cx + mw * .55)} ${r1(my + er * .9)} Q${cx} ${r1(my + er * 1.6)} ${r1(cx - mw * .55)} ${r1(my + er * .9)} Z" fill="#E0707A"/>`));
    else if (E === 'sad') face.push(`<path d="M${r1(cx - mw * .7)} ${r1(my + er * .7)} Q${cx} ${r1(my - er * .6)} ${r1(cx + mw * .7)} ${r1(my + er * .7)}" fill="none" ${ms}/>`);
    else if (E === 'surprised') face.push(`<ellipse cx="${cx}" cy="${r1(my + er * .45)}" rx="${r1(mw * .3)}" ry="${r1(er * 1.05)}" fill="${sk ? 'none' : '#7A2E3B'}" ${ms}/>`);
    else if (E === 'angry') face.push(`<path d="M${r1(cx - mw * .62)} ${r1(my + er * .45)} Q${r1(cx - mw * .2)} ${r1(my - er * .15)} ${cx} ${r1(my + er * .05)} Q${r1(cx + mw * .2)} ${r1(my - er * .15)} ${r1(cx + mw * .62)} ${r1(my + er * .45)}" fill="none" ${ms}/>`);
    else face.push(`<path d="M${r1(cx - mw * .5)} ${r1(my)} Q${cx} ${r1(my + er * .55)} ${r1(cx + mw * .5)} ${r1(my)}" fill="none" ${ms}/>`);
    if (p.beard && !sk) face.push(`<path d="M${r1(cx - mw * .75)} ${r1(my - er * .55)} Q${cx} ${r1(my - er * 1.1)} ${r1(cx + mw * .75)} ${r1(my - er * .55)}" fill="none" stroke="#2A1E2E" stroke-width="${r1(Math.max(4, u * .04))}" stroke-linecap="round"/><path d="M${r1(cx - mw * .35)} ${r1(my + er * 1.5)} Q${cx} ${r1(my + er * 3)} ${r1(cx + mw * .35)} ${r1(my + er * 1.5)}" fill="#2A1E2E" opacity=".9"/>`);
    // الخدود
    if ((E === 'happy' || p.H <= 3) && !sk) [-1, 1].forEach(s => face.push(`<ellipse cx="${r1(cx + s * ex * 1.25)}" cy="${r1(eyeY + er * 2)}" rx="${r1(er * .9)}" ry="${r1(er * .5)}" fill="#FF8A8A" opacity=".45"/>`));

    // خريطة الملامح الأساسية/الثانوية
    const fmap = [];
    if (p.featureMap) {
      fmap.push(`<g class="fm-p"><ellipse cx="${cx}" cy="${r1(eyeY - er * .7)}" rx="${r1(ex + er * 2)}" ry="${r1(er * 2.5)}" fill="#E8404F" opacity=".32"/><ellipse cx="${cx}" cy="${r1(my + er * .4)}" rx="${r1(mw * 1.25)}" ry="${r1(er * 1.7)}" fill="#E8404F" opacity=".32"/></g>`);
      fmap.push(`<g class="fm-s"><ellipse cx="${cx}" cy="${r1(top + u * .19)}" rx="${r1(hw * .6)}" ry="${r1(u * .08)}" fill="#2F86FF" opacity=".32"/><ellipse cx="${cx}" cy="${r1(ny)}" rx="${r1(er * .9)}" ry="${r1(er * 1.2)}" fill="#2F86FF" opacity=".32"/><ellipse cx="${cx}" cy="${r1(top + u * (p.head === 'triangle' ? .86 : .93))}" rx="${r1(hw * .3)}" ry="${r1(u * .055)}" fill="#2F86FF" opacity=".32"/></g>`);
    }

    // خطوط بناء الوجه (ص 238): خط المنتصف العمودي + خطوط العينين والأنف والفم
    if (p.construct) {
      const cs = `stroke="#2E9BD6" stroke-width="${r1(Math.max(1.6, u * .012))}" stroke-dasharray="${r1(u * .04)} ${r1(u * .03)}" fill="none"`;
      const lw = hw * 1.25, lab = (y, t) => `<text x="${r1(cx - lw - u * .03)}" y="${r1(y + u * .025)}" font-size="${r1(u * .065)}" fill="#2E9BD6" font-weight="700" direction="ltr" text-anchor="end">${t}</text>`;
      fmap.push(`<line x1="${cx}" y1="${r1(top - u * .06)}" x2="${cx}" y2="${r1(top + u * 1.04)}" ${cs}/>`,
        `<line x1="${r1(cx - lw)}" y1="${r1(eyeY)}" x2="${r1(cx + lw)}" y2="${r1(eyeY)}" ${cs}/>${lab(eyeY, 'العينان')}`,
        `<line x1="${r1(cx - lw * .7)}" y1="${r1(ny + er * .3)}" x2="${r1(cx + lw * .7)}" y2="${r1(ny + er * .3)}" ${cs}/>${lab(ny + er * .3, 'الأنف')}`,
        `<line x1="${r1(cx - lw * .7)}" y1="${r1(my + er * .3)}" x2="${r1(cx + lw * .7)}" y2="${r1(my + er * .3)}" ${cs}/>${lab(my + er * .3, 'الفم')}`);
    }

    /* ---------- الإضاءة ---------- */
    let filt = '', lightBits = '', overlay = '';
    if (p.light && !sk) {
      const az = { top: 270, bottom: 90, left: 180, right: 0 }[p.light];
      defs.push(`<filter id="${id}L" x="-25%" y="-25%" width="150%" height="150%"><feGaussianBlur in="SourceAlpha" stdDeviation="16" result="b"/><feDiffuseLighting in="b" surfaceScale="9" diffuseConstant="1.55" lighting-color="${p.lightColor}" result="d"><feDistantLight azimuth="${az}" elevation="40"/></feDiffuseLighting><feComposite in="d" in2="SourceAlpha" operator="in" result="dl"/><feBlend in="SourceGraphic" in2="dl" mode="multiply"/></filter>`);
      filt = `filter="url(#${id}L)"`;
      const g = { top: ['0', '0', '0', '1'], bottom: ['0', '1', '0', '0'], left: ['0', '0', '1', '0'], right: ['1', '0', '0', '0'] }[p.light];
      defs.push(`<linearGradient id="${id}O" x1="${g[0]}" y1="${g[1]}" x2="${g[2]}" y2="${g[3]}"><stop offset="0" stop-color="${p.lightColor}" stop-opacity=".35"/><stop offset=".55" stop-color="#1A1030" stop-opacity=".05"/><stop offset="1" stop-color="#1A1030" stop-opacity=".42"/></linearGradient>`);
      overlay = `<rect x="0" y="0" width="400" height="600" rx="18" fill="url(#${id}O)" pointer-events="none"/>`;
      const lp = { top: [cx, 30], bottom: [cx, 592], left: [22, 250], right: [378, 250] }[p.light];
      lightBits = `<circle cx="${lp[0]}" cy="${lp[1]}" r="70" fill="${p.lightColor}" opacity=".45"/><circle cx="${lp[0]}" cy="${lp[1]}" r="22" fill="#FFF6D8" stroke="#E8A93A" stroke-width="3"/>`;
    }
    if (p.clay && !sk) {
      defs.push(`<filter id="${id}C"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="7"/></filter>`);
      filt = `filter="url(#${id}C)"`;
    }

    /* ---------- خطوط الرؤوس والأقسام ---------- */
    const guide = [];
    if (p.sections) {
      [[top, top + u, '#FF8A5B', 'الرأس'], [top + u, hip, '#19B5A5', 'الجذع'], [hip, G, '#8E6CEF', 'الجزء السفلي']].forEach(([a, b, c, t]) =>
        guide.push(`<rect x="40" y="${r1(a)}" width="322" height="${r1(b - a)}" fill="${c}" opacity=".1"/><line x1="40" y1="${r1(b)}" x2="362" y2="${r1(b)}" stroke="${c}" stroke-width="3"/><text x="376" y="${r1((a + b) / 2)}" font-size="17" font-weight="700" fill="${c}" text-anchor="middle" transform="rotate(90 376 ${r1((a + b) / 2)})">${t}</text>`));
    }
    if (p.guides) {
      const n = Math.floor(p.H + 1e-6);
      for (let k = 0; k <= n; k++) guide.push(`<line x1="18" y1="${r1(G - k * u)}" x2="382" y2="${r1(G - k * u)}" stroke="#E85D3F" stroke-width="1.6" stroke-dasharray="7 6" opacity=".7"/>`);
      if (p.H - n > .01) guide.push(`<line x1="18" y1="${top}" x2="382" y2="${top}" stroke="#E85D3F" stroke-width="1.6" stroke-dasharray="7 6" opacity=".7"/>`);
      for (let k = 0; k < n; k++) { const y = top + k * u + Math.min(u, G - top - k * u) / 2; guide.push(`<circle cx="22" cy="${r1(y)}" r="${r1(Math.min(15, u * .32))}" fill="#E85D3F"/><text x="22" y="${r1(y + Math.min(6, u * .12))}" font-size="${r1(Math.min(17, u * .36))}" font-weight="700" fill="#fff" text-anchor="middle">${k + 1}</text>`); }
    }

    /* ---------- التجميع ---------- */
    const sy = p.squash, tf = `translate(0 ${r1(-p.dy)}) translate(${cx} ${G}) scale(${r1(1 / Math.sqrt(sy) * 100) / 100} ${sy}) translate(${-cx} ${-G})`;
    const shadow = p.shadow ? `<ellipse cx="${cx + (p.light === 'left' ? 40 : p.light === 'right' ? -40 : 0)}" cy="${G + 4}" rx="${r1(SW * .62 * Math.max(.45, 1 - p.dy / 260))}" ry="9" fill="#2A1E3A" opacity="${sk ? .08 : .16}"/>` : '';
    let vb = '0 0 400 600';
    if (p.view === 'face') vb = `${r1(cx - u * .82)} ${r1(top - u * .2)} ${r1(u * 1.64)} ${r1(u * 1.55)}`;
    return `<svg class="ch-svg${p.view === 'face' ? ' face' : ''}" viewBox="${vb}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg"><defs>${defs.join('')}</defs>
      ${p.bg ? `<rect x="0" y="0" width="400" height="600" rx="18" fill="${p.bg}"/>` : ''}${lightBits}${guide.join('')}${shadow}
      <g transform="${tf}"><g ${filt}>${back.join('')}${out.join('')}${front.join('')}${face.join('')}</g>${fmap.join('')}</g>${overlay}</svg>`;
  }

  /* إطارات قفزة لشخصية (للرسوم المتحركة) */
  function jumpFrame(i, n, base = {}) {
    const t = i / n;
    let dy = 0, sq = 1, pose = 'down';
    if (t < .14) { sq = 1 - .16 * Math.sin(Math.PI * t / .14); }
    else if (t < .86) { const k = (t - .14) / .72; dy = Math.sin(Math.PI * k) * 150; sq = 1 + .1 * Math.cos(Math.PI * k) * (k < .5 ? 1 : .4); pose = 'up'; }
    else { sq = 1 - .14 * Math.sin(Math.PI * (t - .86) / .14); }
    return svg(Object.assign({ H: 3, expr: dy > 40 ? 'happy' : 'neutral' }, base, { dy, squash: sq, pose }));
  }

  return { svg, jumpFrame, INK };
})();

/* 🎨 رسمة الشريحة الترحيبية: من السكتش إلى الشخصية الملونة */
function HERO_ART(firstName) {
  const curs = c => `<svg viewBox="0 0 24 24"><path d="M3 21 L5 15 L16 4 L20 8 L9 19 Z" fill="${c}" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/><path d="M3 21 L5 15 L9 19 Z" fill="#3A2A4A"/></svg>`;
  return `<div class="chero">
    <div class="ch-sheet">
      <div class="ch-tape t1"></div><div class="ch-tape t2"></div>
      <div class="ch-fig sk">${CH.svg({ H: 4, outfit: 'thobe', style: 'sketch', guides: true, expr: 'happy', pose: 'wave' })}</div>
      <div class="ch-arrow">➜</div>
      <div class="ch-fig col">${CH.svg({ H: 4, outfit: 'girl', color: '#2EA6A0', accent: '#FFC542', expr: 'happy', pose: 'wave' })}</div>
      <div class="ch-cap"><span>✏️ Sketch</span><span>🎨 Final</span></div>
    </div>
    <div class="ch-chip faces"><span>😀</span><span>😢</span><span>😮</span><span>😠</span></div>
    <div class="ch-chip shapes"><i class="c"></i><i class="s"></i><i class="t"></i></div>
    <div class="ch-chip ratio">4 رؤوس<small>طول الشخصية</small></div>
    <div class="mcur c1">${curs('#E85D3F')}<span>${esc(firstName)}</span></div>
    <div class="mcur c2">${curs('#2EA6A0')}<span>الطالبات</span></div>
  </div>`;
}

/* ==========================================================================
   🧩 قوالب الشرائح الجديدة
   ========================================================================== */
window.R_EXT = {

  /* 🧪 مختبر الشخصية: خيارات (أو منزلق) تغيّر الشخصية مباشرة */
  charlab: {
    html: s => `<div class="cl-wrap${s.options ? '' : ' noopt'}">
      <div class="cl-stage rv">
        <div class="cl-paper${s.view === 'face' ? ' face' : ''}"><div class="cl-svg"></div>
          ${(s.toggles || []).length ? `<div class="cl-tg">${s.toggles.map(t => `<button class="cl-t" data-k="${t.k}">${t.t}</button>`).join('')}</div>` : ''}</div>
        ${s.slider ? `<div class="cl-slider"><span class="cl-sl">${s.slider.label || ''}</span><input type="range" min="${s.slider.min}" max="${s.slider.max}" step="${s.slider.step || 1}" value="${s.base[s.slider.param]}"><b class="cl-val"></b></div>` : ''}
      </div>
      <div class="cl-side rv">
        ${s.options ? `<div class="cl-opts" style="--n:${s.cols || (s.options.length > 4 ? 2 : 1)}">${s.options.map((o, k) => `<button class="cl-o" data-k="${k}" style="--c:${o.color || 'var(--p)'}"><span class="cl-oi">${o.icon}</span><span><b>${o.t}</b>${o.en ? `<small>${o.en}</small>` : ''}</span></button>`).join('')}</div>` : ''}
        <div class="cl-info"></div>
        ${s.all ? `<button class="btn ghost cl-all">👀 قارني بينها</button>` : ''}
      </div></div>`,
    init: (sec, s) => {
      const box = $('.cl-svg', sec), info = $('.cl-info', sec), P = Object.assign({}, s.base);
      let k = -1, flags = {}, all = false;
      (s.toggles || []).forEach(t => { if (t.def) { flags[t.k] = true; $(`.cl-t[data-k="${t.k}"]`, sec).classList.add('on'); } });
      const fl = () => { const o = {}; (s.toggles || []).forEach(t => { if (flags[t.k]) Object.assign(o, t.on || { [t.k]: true }); }); return o; };
      const bindRv = () => $$('.ci-rv', info).forEach(e => e.onclick = () => { if (e.classList.contains('open')) return; e.classList.add('open'); sound.pop(); if (!$$('.ci-rv:not(.open)', info).length) celebrate(info, true); });
      const sl = $('.cl-slider input', sec);
      const draw = quiet => {
        if (all) {
          box.innerHTML = `<div class="cl-grid" style="--n:${s.options.length}">${s.options.map(o => `<div><div class="cl-mini">${CH.svg(Object.assign({}, P, o.params, fl()))}</div><b style="color:${o.color}">${o.icon} ${o.t}</b></div>`).join('')}</div>`;
        } else box.innerHTML = CH.svg(Object.assign({}, P, fl()));
        if (!quiet) retrigger(box, 'pop');
        if (sl) { const v = +sl.value; $('.cl-val', sec).textContent = s.slider.fmt ? s.slider.fmt(v) : v; if (s.slider.info && k < 0) { info.style.setProperty('--c', 'var(--p)'); info.innerHTML = s.slider.info(v); } }
      };
      const pick = (j, quiet) => {
        k = j; all = false; const o = s.options[j];
        Object.assign(P, s.base, o.params);
        $$('.cl-o', sec).forEach(b => b.classList.toggle('on', +b.dataset.k === j));
        if (!quiet) $$('.cl-o', sec)[j].classList.add('seen');
        info.style.setProperty('--c', o.color || 'var(--p)');
        info.innerHTML = `<div class="ci-h"><span>${o.icon}</span><h3>${o.t}${o.en ? `<small>${o.en}</small>` : ''}</h3></div><p>${o.d || ''}</p>${o.chips ? `<div class="ci-chips">${o.chips.map(c => `<span>${c}</span>`).join('')}</div>` : ''}`;
        draw(quiet); if (quiet) return; sound.pop(); retrigger(info, 'pop');
        if (!$$('.cl-o:not(.seen)', sec).length && !sec._all) { sec._all = 1; setTimeout(() => celebrate(box, true), 250); }
      };
      $$('.cl-o', sec).forEach(b => b.onclick = () => pick(+b.dataset.k));
      $$('.cl-t', sec).forEach(b => b.onclick = () => { b.classList.toggle('on'); flags[b.dataset.k] = b.classList.contains('on'); draw(); sound.pop(); });
      if (sl) sl.oninput = () => { P[s.slider.param] = +sl.value; if (k >= 0 && s.options) { k = -1; $$('.cl-o', sec).forEach(b => b.classList.remove('on')); } draw(true); sound.tick(); };
      const ab = $('.cl-all', sec); if (ab) ab.onclick = () => { all = !all; ab.textContent = all ? '↩ شخصية واحدة' : '👀 قارني بينها'; draw(); sound.pop(); };
      if (s.info) { info.innerHTML = s.info; bindRv(); }
      if (s.options && s.start !== -1) pick(s.start || 0, true); else draw(true);
    }
  },

  /* ☸️ عجلة النماذج الأصلية (12 نموذجًا) + اختبريني */
  wheel: {
    html: s => {
      const n = s.items.length, R = 330, r0 = 140, C = 360;
      const pt = (a, r) => [C + r * Math.cos(a), C + r * Math.sin(a)];
      const seg = s.items.map((it, k) => {
        const a0 = (k / n) * 2 * Math.PI - Math.PI / 2 - Math.PI / n + .012, a1 = ((k + 1) / n) * 2 * Math.PI - Math.PI / 2 - Math.PI / n - .012, am = (a0 + a1) / 2;
        const [x0, y0] = pt(a0, R), [x1, y1] = pt(a1, R), [x2, y2] = pt(a1, r0), [x3, y3] = pt(a0, r0);
        const [ix, iy] = pt(am, 280), [tx, ty] = pt(am, 200);
        const w = it.t.split(' '), lines = it.t.length > 7 && w.length > 1 ? [w[0], w.slice(1).join(' ')] : [it.t];
        const txt = lines.length > 1 ? `<text x="${tx}" y="${ty - 4}" class="wh-t two"><tspan x="${tx}">${lines[0]}</tspan><tspan x="${tx}" dy="22">${lines[1]}</tspan></text>` : `<text x="${tx}" y="${ty + 8}" class="wh-t">${it.t}</text>`;
        return `<g class="wh-s" data-k="${k}" style="--c:${it.color}"><path d="M${x0} ${y0} A${R} ${R} 0 0 1 ${x1} ${y1} L${x2} ${y2} A${r0} ${r0} 0 0 0 ${x3} ${y3} Z"/>
          <text x="${ix}" y="${iy + 14}" class="wh-i">${it.icon}</text>${txt}</g>`;
      }).join('');
      return `<div class="wh-wrap"><div class="wh rv"><svg viewBox="0 0 720 720">${seg}<circle cx="360" cy="360" r="128" class="wh-c"/></svg>
        <div class="wh-center"><b>${s.center || '12'}</b><span>${s.centerT || 'نموذجًا أصليًا'}</span></div></div>
        <div class="hs-side rv"><div class="hs-modes"><button class="hs-m on" data-m="x">🔍 استكشفي</button><button class="hs-m" data-m="q">🎯 اختبريني</button></div>
          <div class="hs-panel wh-p"><div class="hs-ic">☸️</div><h3>${s.hint || 'اضغطي على أي نموذج في العجلة'}</h3></div><div class="hs-count"></div><div class="feedback"></div></div></div>`;
    },
    init: (sec, s) => {
      const panel = $('.wh-p', sec), fb = $('.feedback', sec), cnt = $('.hs-count', sec);
      let mode = 'x', seen = new Set(), queue = [], target = null, score = 0;
      const QN = Math.min(s.quizN || s.items.length, s.items.length);
      const stat = () => cnt.textContent = mode === 'x' ? `اكتشفتِ ${seen.size} من ${s.items.length}` : (target ? `السؤال ${QN - queue.length} من ${QN} · ✅ ${score}` : '');
      const show = it => { panel.style.setProperty('--c', it.color); panel.innerHTML = `<div class="hs-ic">${it.icon}</div><h3>${it.t}${it.en ? `<small>${it.en}</small>` : ''}</h3><p>${it.d}</p>${it.ex ? `<div class="wh-ex">💡 ${it.ex}</div>` : ''}`; retrigger(panel, 'pop'); };
      const ask = () => {
        if (!queue.length) { target = null; panel.innerHTML = `<div class="hs-ic">🏆</div><h3>أنهيتِ الاختبار!</h3><p>${score} إجابة صحيحة من ${QN}</p>`; celebrate(panel); stat(); return; }
        target = queue.shift(); panel.style.setProperty('--c', '#E85D3F');
        panel.innerHTML = `<div class="hs-ic">🎯</div><h3>أي نموذج أصلي هذا؟</h3><p>«${target.q || target.d}»</p>`; retrigger(panel, 'pop'); stat();
      };
      $$('.wh-s', sec).forEach(g => g.addEventListener('click', () => {
        const it = s.items[+g.dataset.k];
        $$('.wh-s.on', sec).forEach(x => x.classList.remove('on')); g.classList.add('on');
        if (mode === 'x') { seen.add(it.t); g.classList.add('seen'); show(it); sound.pop(); stat(); if (seen.size === s.items.length && !sec._all) { sec._all = 1; setTimeout(() => sound.ding(), 200); } }
        else if (target) { if (it === target) { score++; setFb(fb, true, MSG.short); sound.ding(); setTimeout(ask, 700); } else { setFb(fb, false); sound.wrong(); } }
      }));
      $$('.hs-m', sec).forEach(b => b.onclick = () => {
        mode = b.dataset.m; $$('.hs-m', sec).forEach(x => x.classList.toggle('on', x === b)); fb.textContent = ''; $$('.wh-s.on', sec).forEach(x => x.classList.remove('on'));
        if (mode === 'q') { queue = shuffle(s.items.slice()).slice(0, s.quizN || s.items.length); score = 0; ask(); }
        else { target = null; panel.innerHTML = `<div class="hs-ic">☸️</div><h3>${s.hint || 'اضغطي على أي نموذج في العجلة'}</h3>`; stat(); }
        sound.pop();
      });
      stat();
    }
  },

  /* 🗺️ خريطة أسئلة القصة للشخصية: الأسئلة / مثال / شخصيتنا */
  storymap: {
    html: s => `<div class="sm-top rv"><div class="hs-modes">${(s.modes || [['q', '❓ الأسئلة'], ['ex', '🧔 مثال: ' + (s.exName || 'تركي')], ['me', '✏️ شخصيتنا']]).map((m, k) => `<button class="hs-m ${k ? '' : 'on'}" data-m="${m[0]}">${m[1]}</button>`).join('')}</div></div>
      <div class="sm rv">
        ${s.branches.map((b, k) => `<div class="sm-b b${k}" style="--c:${b.color}"><div class="sm-h">${b.icon} ${b.t}</div><ul>${b.qs.map(q => `<li><span class="sm-q">${q[0]}</span><span class="sm-a">${q[1] || ''}</span><span class="sm-in" contenteditable="true" data-ph="…"></span></li>`).join('')}</ul></div>`).join('')}
        <div class="sm-c"><div class="sm-av">${s.avatar || ''}</div><b>${s.center || 'خريطة أسئلة القصة'}</b></div>
        <svg class="sm-lines" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M50 50 L22 22 M50 50 L78 22 M50 50 L22 78 M50 50 L78 78"/></svg>
      </div>`,
    init: (sec, s) => {
      const sm = $('.sm', sec);
      const set = m => { sm.dataset.m = m; $$('.hs-m', sec).forEach(x => x.classList.toggle('on', x.dataset.m === m)); $$('.sm li', sec).forEach(li => li.classList.remove('open')); };
      $$('.hs-m', sec).forEach(b => b.onclick = () => { set(b.dataset.m); sound.pop(); });
      $$('.sm li', sec).forEach(li => li.addEventListener('click', () => {
        if (sm.dataset.m !== 'ex' || li.classList.contains('open')) return; li.classList.add('open'); sound.pop();
        if (!$$('.sm li:not(.open)', sec).length) celebrate($('.sm-c', sec), true);
      }));
      $$('.sm-in', sec).forEach(e => e.addEventListener('keydown', ev => ev.stopPropagation()));
      set('q');
    }
  },

  /* 🎞️ دفتر التقليب: 24 إطارًا في الثانية */
  flipbook: {
    html: s => {
      const n = s.n || 24;
      return `<div class="fb-wrap"><div class="fb-main rv">
        <div class="fb-paper ${s.style === 'sketch' ? 'sk' : ''}"><div class="fb-onion"></div><div class="fb-frame"></div><div class="fb-no"></div><div class="fb-holes"><i></i><i></i><i></i></div></div>
        <div class="fb-strip" style="--n:${n}">${Array.from({ length: n }, (_, k) => `<button data-k="${k}">${k + 1}</button>`).join('')}</div>
        <div class="fb-ctrl"><button class="btn ghost fb-prev">⏮</button><button class="btn primary fb-play">▶ تشغيل</button><button class="btn ghost fb-next">⏭</button>
          <span class="fb-sp">السرعة:</span>${(s.fps || [2, 6, 12, 24]).map(f => `<button class="fb-f ${f === 12 ? 'on' : ''}" data-f="${f}">${f}</button>`).join('')}<span class="fb-sp">إطار/ث</span>
          <button class="fb-on">🧅 الورق الشفاف</button></div></div>
        <div class="fb-side rv"><div class="fb-big"><b class="fb-fps">12</b><span>إطارًا في الثانية</span></div><div class="fb-meter"><i></i></div><p class="fb-say"></p>${s.note ? `<div class="fb-note">${s.note}</div>` : ''}</div></div>`;
    },
    init: (sec, s) => {
      const n = s.n || 24, base = Object.assign({ style: s.style || 'color' }, s.base || {});
      const frames = Array.from({ length: n }, (_, i) => CH.jumpFrame(i, n, base));
      const fr = $('.fb-frame', sec), on = $('.fb-onion', sec), no = $('.fb-no', sec), cells = $$('.fb-strip button', sec);
      let i = 0, fps = 12, timer = null, onion = false;
      const say = { 2: '🐢 بطيئة جدًا… نرى كل رسمة منفصلة', 6: '🙂 نرى الحركة لكنها متقطعة', 12: '😊 حركة مقبولة', 24: '🤩 حركة سلسة! هذا هو معيار الرسوم المتحركة التقليدية' };
      const showI = () => { fr.innerHTML = frames[i]; on.innerHTML = onion ? frames[(i - 1 + n) % n] : ''; no.textContent = `إطار ${i + 1} / ${n}`; cells.forEach((c, k) => c.classList.toggle('on', k === i)); };
      const upd = () => { $('.fb-fps', sec).textContent = fps; $('.fb-meter i', sec).style.width = (fps / 24 * 100) + '%'; $('.fb-say', sec).textContent = say[fps] || ''; $$('.fb-f', sec).forEach(b => b.classList.toggle('on', +b.dataset.f === fps)); };
      const stop = () => { clearInterval(timer); timer = null; $('.fb-play', sec).textContent = '▶ تشغيل'; };
      const play = () => { stop(); timer = setInterval(() => { if (!isActive(sec)) return stop(); i = (i + 1) % n; showI(); }, 1000 / fps); $('.fb-play', sec).textContent = '⏸ إيقاف'; };
      $('.fb-play', sec).onclick = () => { timer ? stop() : play(); sound.pop(); };
      $('.fb-next', sec).onclick = () => { stop(); i = (i + 1) % n; showI(); sound.tick(); };
      $('.fb-prev', sec).onclick = () => { stop(); i = (i - 1 + n) % n; showI(); sound.tick(); };
      cells.forEach(c => c.onclick = () => { stop(); i = +c.dataset.k; showI(); sound.tick(); });
      $$('.fb-f', sec).forEach(b => b.onclick = () => { fps = +b.dataset.f; upd(); if (timer) play(); sound.pop(); if (fps === 24 && !sec._24) { sec._24 = 1; celebrate($('.fb-big', sec), true); } });
      $('.fb-on', sec).onclick = e => { onion = !onion; e.currentTarget.classList.toggle('on', onion); showI(); sound.pop(); };
      showI(); upd();
    },
    enter: sec => { const b = $('.fb-play', sec); if (b && b.textContent.includes('إيقاف')) b.click(); }
  },

  /* 🧑‍🎨 مصمم الشخصيات: كل الأسس في مكان واحد + بطاقة الشخصية */
  builder: {
    html: s => {
      const grp = (k, t, opts) => `<div class="bd-g"><div class="bd-gt">${t}</div><div class="bd-row">${opts.map(o => `<button class="bd-o" data-g="${k}" data-v="${o[0]}" title="${o[2] || ''}">${o[1]}</button>`).join('')}</div></div>`;
      return `<div class="bd-wrap">
      <div class="bd-ctrl rv">
        ${grp('outfit', '👘 الزي', [['thobe', '🧔 ثوب وشماغ'], ['girl', '👧 فستان'], ['casual', '👕 عصري']])}
        ${grp('head', '🙂 شكل الرأس', [['circle', '⚪ دائري'], ['square', '⬜ مربع'], ['triangle', '🔻 مثلث']])}
        ${grp('body', '🧍 شكل الجذع', [['square', '⬜ مربع'], ['circle', '⚪ دائري'], ['triangle', '🔺 مثلث']])}
        <div class="bd-g"><div class="bd-gt">📏 الطول بالرؤوس: <b class="bd-hv">4</b></div><input type="range" class="bd-h" min="2" max="8" step="1" value="4"></div>
        <div class="bd-g"><div class="bd-gt">🎨 اللون</div><div class="bd-row sw">${CH_COLORS.map((c, k) => `<button class="bd-sw" data-k="${k}" style="--c:${c.c}" title="${c.t}"></button>`).join('')}</div></div>
        ${grp('expr', '🎭 التعبير', [['neutral', '😐'], ['happy', '😀'], ['sad', '😢'], ['surprised', '😮'], ['angry', '😠']])}
        ${grp('light', '💡 الإضاءة', [['', 'بدون'], ['top', '⬆️'], ['bottom', '⬇️'], ['right', '➡️'], ['left', '⬅️']])}
      </div>
      <div class="bd-stage rv"><div class="bd-paper"><div class="bd-svg"></div></div>
        <div class="bd-name"><span>اسم الشخصية:</span><input type="text" maxlength="18" placeholder="مثال: نورة" value="${s.name || ''}"></div></div>
      <div class="bd-card rv"><div class="bd-ch">🪪 بطاقة الشخصية</div><div class="bd-out"></div>
        <button class="btn ghost bd-rnd">🎲 شخصية عشوائية</button></div></div>`;
    },
    init: (sec, s) => {
      const P = Object.assign({ H: 4, head: 'circle', body: 'square', outfit: 'girl', color: CH_COLORS[3].c, expr: 'happy', light: '' }, s.base || {});
      let ci = CH_COLORS.findIndex(c => c.c === P.color); if (ci < 0) ci = 3;
      const age = h => h <= 2.5 ? ['طفل صغير (أقل من 5 سنوات)', 'رأس كبير وجسم قصير وألوان زاهية'] : h <= 4 ? ['طفل (6–12 سنة)', 'رأس كبير وأجسام أنحف وتفاصيل أكثر'] : h <= 5.5 ? ['مراهق (14–18 سنة)', 'يشبه العالم الحقيقي بتفاصيل أكثر'] : ['شخص بالغ', 'متوسط طوله 6–7 رؤوس'];
      const SH = { circle: 'ناعمة، هادئة، ودودة', square: 'قوية، ثابتة، يُعتمد عليها', triangle: 'حادّة، ماكرة، لا يمكن التنبؤ بها' };
      const BD = { square: 'قوية', circle: 'مرحة', triangle: 'قد توحي بعدم الثقة' };
      const EX = { neutral: 'هادئة', happy: 'سعيدة 😀', sad: 'حزينة 😢', surprised: 'مندهشة 😮', angry: 'غاضبة 😠' };
      const LT = { '': 'إضاءة عادية', top: 'من الأعلى: طبيعية ومريحة', bottom: 'من الأسفل: غامضة أو مخيفة', right: 'جانبية: درامية', left: 'جانبية: درامية' };
      const draw = quiet => {
        $('.bd-svg', sec).innerHTML = CH.svg(Object.assign({}, P, { light: P.light || null, guides: false }));
        if (!quiet) retrigger($('.bd-svg', sec), 'pop');
        $$('.bd-o', sec).forEach(b => b.classList.toggle('on', String(P[b.dataset.g] ?? '') === b.dataset.v));
        $$('.bd-sw', sec).forEach(b => b.classList.toggle('on', +b.dataset.k === ci));
        $('.bd-hv', sec).textContent = P.H; $('.bd-h', sec).value = P.H;
        const nm = $('.bd-name input', sec).value.trim() || 'شخصيتي', a = age(P.H), c = CH_COLORS[ci];
        $('.bd-out', sec).innerHTML = `<h3>${esc(nm)}</h3>
          <div class="bd-l"><span>📏</span><div><b>${P.H} رؤوس — ${a[0]}</b><small>${a[1]}</small></div></div>
          <div class="bd-l"><span>🔷</span><div><b>شخصية ${SH[P.head]}</b><small>من لغة الشكل (الرأس) · جذع ${BD[P.body]}</small></div></div>
          <div class="bd-l"><span style="color:${c.c}">●</span><div><b>${c.t}</b><small>${c.m}</small></div></div>
          <div class="bd-l"><span>🎭</span><div><b>${EX[P.expr]}</b><small>تعبير الوجه يعكس حالتها النفسية</small></div></div>
          <div class="bd-l"><span>💡</span><div><b>${LT[P.light || '']}</b><small>الضوء يحدد المزاج والجو</small></div></div>`;
      };
      $$('.bd-o', sec).forEach(b => b.onclick = () => { P[b.dataset.g] = b.dataset.v; draw(); sound.pop(); });
      $$('.bd-sw', sec).forEach(b => b.onclick = () => { ci = +b.dataset.k; P.color = CH_COLORS[ci].c; draw(); sound.pop(); });
      $('.bd-h', sec).oninput = e => { P.H = +e.target.value; draw(true); sound.tick(); };
      const nm = $('.bd-name input', sec); nm.oninput = () => draw(true); nm.addEventListener('keydown', e => e.stopPropagation());
      $('.bd-rnd', sec).onclick = () => {
        const pk = a => a[Math.floor(Math.random() * a.length)];
        Object.assign(P, { outfit: pk(['thobe', 'girl', 'casual']), head: pk(['circle', 'square', 'triangle']), body: pk(['square', 'circle', 'triangle']), H: pk([2, 3, 4, 5, 6, 7]), expr: pk(['neutral', 'happy', 'sad', 'surprised', 'angry']), light: pk(['', '', 'top', 'bottom', 'left']) });
        ci = Math.floor(Math.random() * CH_COLORS.length); P.color = CH_COLORS[ci].c; draw(); sound.ding();
      };
      draw(true);
    }
  },

  /* 🧰 معرض البرامج والتطبيقات + اختبريني */
  apps: {
    html: s => `<div class="ap-wrap"><div class="ap-left rv">
        <div class="ap-f">${[['all', 'الكل']].concat(s.cats).map((c, k) => `<button class="ap-fb ${k ? '' : 'on'}" data-c="${c[0]}">${c[1]}</button>`).join('')}</div>
        <div class="ap-grid">${s.apps.map((a, k) => `<button class="ap" data-k="${k}" data-c="${a.cat}"><span class="ap-ic" style="--bg:${a.bg};--fg:${a.fg || '#fff'}">${a.abbr}</span><b>${a.name}</b><small>${a.en}</small></button>`).join('')}</div></div>
      <div class="hs-side rv"><div class="hs-modes"><button class="hs-m on" data-m="x">🔍 استكشفي</button><button class="hs-m" data-m="q">🎯 اختبريني</button></div>
        <div class="hs-panel ap-p"><div class="hs-ic">🧰</div><h3>${s.hint || 'اضغطي على أي برنامج للتعرف عليه'}</h3></div><div class="hs-count"></div><div class="feedback"></div></div></div>`,
    init: (sec, s) => {
      const panel = $('.ap-p', sec), fb = $('.feedback', sec), cnt = $('.hs-count', sec);
      let mode = 'x', seen = new Set(), queue = [], target = null, score = 0;
      const catName = c => (s.cats.find(x => x[0] === c) || [, ''])[1];
      const stat = () => cnt.textContent = mode === 'x' ? `تعرّفتِ على ${seen.size} من ${s.apps.length}` : (target ? `السؤال ${s.quizN - queue.length} من ${s.quizN} · ✅ ${score}` : '');
      const show = a => { panel.style.setProperty('--c', a.bg); panel.innerHTML = `<div class="ap-h"><span class="ap-ic" style="--bg:${a.bg};--fg:${a.fg || '#fff'}">${a.abbr}</span><h3>${a.name}<small>${a.en}</small></h3></div><span class="ap-cat">${catName(a.cat)}</span><p>${a.d}</p>${a.tags ? `<div class="ci-chips">${a.tags.map(t => `<span>${t}</span>`).join('')}</div>` : ''}`; retrigger(panel, 'pop'); };
      const ask = () => {
        if (!queue.length) { target = null; panel.innerHTML = `<div class="hs-ic">🏆</div><h3>أنهيتِ الاختبار!</h3><p>${score} إجابة صحيحة من ${s.quizN}</p>`; celebrate(panel); stat(); return; }
        target = queue.shift(); panel.style.setProperty('--c', '#E85D3F'); panel.innerHTML = `<div class="hs-ic">🎯</div><h3>أي برنامج هذا؟</h3><p>${target.q}</p>`; retrigger(panel, 'pop'); stat();
      };
      $$('.ap-fb', sec).forEach(b => b.onclick = () => { $$('.ap-fb', sec).forEach(x => x.classList.toggle('on', x === b)); $$('.ap', sec).forEach(a => a.classList.toggle('hide', b.dataset.c !== 'all' && a.dataset.c !== b.dataset.c)); sound.pop(); });
      $$('.ap', sec).forEach(el => el.onclick = () => {
        const a = s.apps[+el.dataset.k]; $$('.ap.on', sec).forEach(x => x.classList.remove('on')); el.classList.add('on');
        if (mode === 'x') { seen.add(a.name); el.classList.add('seen'); show(a); sound.pop(); stat(); if (seen.size === s.apps.length && !sec._all) { sec._all = 1; setTimeout(() => sound.ding(), 200); } }
        else if (target) { if (a === target) { score++; setFb(fb, true, MSG.short); sound.ding(); setTimeout(ask, 700); } else { shake(el); setFb(fb, false); sound.wrong(); } }
      });
      $$('.hs-m', sec).forEach(b => b.onclick = () => {
        mode = b.dataset.m; $$('.hs-m', sec).forEach(x => x.classList.toggle('on', x === b)); fb.textContent = ''; $$('.ap.on', sec).forEach(x => x.classList.remove('on'));
        if (mode === 'q') { queue = shuffle(s.apps.filter(a => a.q).slice()).slice(0, s.quizN); score = 0; ask(); }
        else { target = null; panel.innerHTML = `<div class="hs-ic">🧰</div><h3>${s.hint || 'اضغطي على أي برنامج للتعرف عليه'}</h3>`; stat(); }
        sound.pop();
      });
      s.quizN = Math.min(s.quizN || 6, s.apps.filter(a => a.q).length); stat();
    }
  },

  /* 🖌️ لوحة رسم رقمية مصغّرة (تحاكي MediBang Paint): طبقات + فرش + تماثل + قالب الرأس */
  paint: {
    html: s => `<div class="pt-wrap no-swipe">
      <div class="pt-tools rv">
        ${[['pen', '✒️', 'قلم'], ['brush', '🖌️', 'فرشاة'], ['marker', '🖍️', 'تحديد'], ['eraser', '🧽', 'ممحاة']].map((t, k) => `<button class="pt-tool ${k ? '' : 'on'}" data-t="${t[0]}" title="${t[2]}"><span>${t[1]}</span><small>${t[2]}</small></button>`).join('')}
        <div class="pt-sep"></div>
        <button class="pt-tool pt-sym" title="رسم متماثل"><span>🪞</span><small>تماثل</small></button>
        <button class="pt-tool pt-undo" title="تراجع"><span>↶</span><small>تراجع</small></button>
        <button class="pt-tool pt-clear" title="مسح الطبقة"><span>🗑️</span><small>مسح</small></button>
      </div>
      <div class="pt-mid rv">
        <div class="pt-top"><span class="pt-logo">🎨 MediBang Paint</span><label>الحجم <input type="range" class="pt-size" min="2" max="60" value="8"><b class="pt-sv">8</b></label>
          <button class="pt-tpl on">🙂 قالب الرأس</button><button class="pt-save">💾 حفظ</button></div>
        <div class="pt-canvas"><div class="pt-tplv">${PT_TEMPLATE}</div><div class="pt-layers-c"></div><div class="pt-toast"></div></div>
      </div>
      <div class="pt-side rv">
        <div class="pt-panel"><div class="pt-ph">🎨 Color <small>الألوان</small></div>
          <div class="pt-cols">${PT_COLORS.map((c, k) => `<button class="pt-c ${k ? '' : 'on'}" data-c="${c}" style="--c:${c}"></button>`).join('')}<label class="pt-c pt-pick" title="لون مخصص"><input type="color" value="#E85D3F">＋</label></div></div>
        <div class="pt-panel grow"><div class="pt-ph">◧ Layer <small>الطبقات</small><button class="pt-add" title="طبقة جديدة">＋</button></div><div class="pt-ll"></div></div>
        ${s.missions ? `<div class="pt-panel"><div class="pt-ph">🎯 المهام</div><div class="pt-miss">${s.missions.map((m, k) => `<span class="mm" data-k="${k}">${m.t}</span>`).join('')}</div></div>` : ''}
      </div></div>`,
    init: (sec, s) => {
      const host = $('.pt-layers-c', sec), ll = $('.pt-ll', sec), toast = $('.pt-toast', sec);
      // دقة داخلية بنفس نسبة أبعاد اللوح المعروض (حتى لا تتمدد الخطوط)
      const W = 1400, br = host.getBoundingClientRect(), H = br.width > 0 ? Math.round(W * br.height / br.width) : 760;
      let layers = [], cur = 0, tool = 'pen', color = '#3A2A4A', size = 8, sym = false, drawing = null, hist = [], done = new Set(), nId = 0;
      const mission = k => { if (!s.missions) return; s.missions.forEach((m, j) => { if (m.k === k && !done.has(j)) { done.add(j); const el = $(`.mm[data-k="${j}"]`, sec); el.classList.add('ok'); retrigger(el, 'pop'); sound.ding(); if (done.size === s.missions.length) setTimeout(() => celebrate($('.pt-canvas', sec)), 250); } }); };
      const say = t => { toast.textContent = t; retrigger(toast, 'pop'); clearTimeout(toast._t); toast._t = setTimeout(() => toast.textContent = '', 2200); };
      const addLayer = name => {
        const c = document.createElement('canvas'); c.width = W; c.height = H; c.className = 'pt-cv'; host.appendChild(c);
        layers.push({ id: ++nId, name: name || ('Layer ' + nId), c, ctx: c.getContext('2d'), vis: true }); cur = layers.length - 1; renderLayers();
      };
      const renderLayers = () => {
        layers.forEach((L, k) => { L.c.style.zIndex = k + 1; L.c.style.display = L.vis ? '' : 'none'; });
        ll.innerHTML = layers.slice().reverse().map(L => { const k = layers.indexOf(L); return `<div class="pt-l ${k === cur ? 'on' : ''}" data-k="${k}"><button class="pt-eye">${L.vis ? '👁️' : '🚫'}</button><span>${L.name}</span></div>`; }).join('');
        $$('.pt-l', ll).forEach(r => { r.onclick = e => { const k = +r.dataset.k; if (e.target.closest('.pt-eye')) { layers[k].vis = !layers[k].vis; if (!layers[k].vis) { mission('hide'); say('🚫 أخفيتِ الطبقة — الرسم ما زال محفوظًا فيها'); } renderLayers(); sound.pop(); return; } cur = k; renderLayers(); sound.tick(); }; });
      };
      const pos = e => { const r = layers[0].c.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width * W, y: (e.clientY - r.top) / r.height * H }; };
      const stroke = (ctx, a, b) => {
        ctx.save();
        ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
        ctx.strokeStyle = color; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.lineWidth = tool === 'brush' ? size * 2.2 : tool === 'marker' ? size * 3 : tool === 'eraser' ? size * 3 : size;
        ctx.globalAlpha = tool === 'brush' ? .35 : tool === 'marker' ? .25 : 1;
        if (tool === 'brush') { ctx.shadowColor = color; ctx.shadowBlur = size * 1.4; }
        const seg = (p, q) => { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); };
        seg(a, b); if (sym) seg({ x: W - a.x, y: a.y }, { x: W - b.x, y: b.y });
        ctx.restore();
      };
      host.addEventListener('pointerdown', e => {
        const L = layers[cur]; if (!L) return; if (!L.vis) { say('⚠️ الطبقة مخفية… أظهريها أولًا 👁️'); sound.wrong(); return; }
        try { host.setPointerCapture(e.pointerId); } catch (_) { }
        hist.push({ k: cur, img: L.ctx.getImageData(0, 0, W, H) }); if (hist.length > 12) hist.shift();
        drawing = pos(e); stroke(L.ctx, drawing, { x: drawing.x + .1, y: drawing.y + .1 });
      });
      host.addEventListener('pointermove', e => { if (!drawing) return; const p = pos(e); stroke(layers[cur].ctx, drawing, p); drawing = p; });
      const up = () => { if (!drawing) return; drawing = null; mission(tool === 'eraser' ? 'erase' : 'draw'); if (sym) mission('sym'); if (cur > 0) mission('layerdraw'); };
      host.addEventListener('pointerup', up); host.addEventListener('pointercancel', up);
      $$('.pt-tool[data-t]', sec).forEach(b => b.onclick = () => { tool = b.dataset.t; $$('.pt-tool[data-t]', sec).forEach(x => x.classList.toggle('on', x === b)); sound.pop(); });
      $('.pt-sym', sec).onclick = e => { sym = !sym; e.currentTarget.classList.toggle('on', sym); say(sym ? '🪞 الرسم المتماثل: ما ترسمينه على جهة يُنسخ على الأخرى — مثالي للوجه!' : 'تم إيقاف التماثل'); sound.pop(); };
      $('.pt-undo', sec).onclick = () => { const h = hist.pop(); if (!h) return; layers[h.k].ctx.putImageData(h.img, 0, 0); mission('undo'); sound.tick(); };
      $('.pt-clear', sec).onclick = () => { const L = layers[cur]; hist.push({ k: cur, img: L.ctx.getImageData(0, 0, W, H) }); L.ctx.clearRect(0, 0, W, H); sound.pop(); };
      $('.pt-size', sec).oninput = e => { size = +e.target.value; $('.pt-sv', sec).textContent = size; };
      $$('.pt-c[data-c]', sec).forEach(b => b.onclick = () => { color = b.dataset.c; $$('.pt-c', sec).forEach(x => x.classList.toggle('on', x === b)); if (color !== '#3A2A4A') mission('color'); sound.pop(); });
      const pk = $('.pt-pick input', sec); pk.oninput = () => { color = pk.value; $$('.pt-c', sec).forEach(x => x.classList.remove('on')); pk.parentElement.classList.add('on'); mission('color'); };
      $('.pt-add', sec).onclick = () => { if (layers.length >= 6) { say('الحد الأقصى 6 طبقات في هذا التمرين'); return; } addLayer(); mission('layer'); say('➕ طبقة جديدة فوق الطبقات السابقة: ارسمي التلوين أو التفاصيل هنا'); sound.ding(); };
      $('.pt-tpl', sec).onclick = e => { const on = e.currentTarget.classList.toggle('on'); $('.pt-tplv', sec).style.display = on ? '' : 'none'; sound.pop(); };
      $('.pt-save', sec).onclick = () => {
        const out = document.createElement('canvas'); out.width = W; out.height = H; const o = out.getContext('2d'); o.fillStyle = '#fff'; o.fillRect(0, 0, W, H);
        layers.forEach(L => L.vis && o.drawImage(L.c, 0, 0));
        const a = document.createElement('a'); a.download = 'شخصيتي.png'; a.href = out.toDataURL('image/png'); a.click(); mission('save'); say('💾 تم حفظ الرسمة كصورة PNG');
      };
      addLayer('Sketch'); renderLayers();
    }
  }
};

/* ألوان الشخصيات ومعانيها (ص 230) */
const CH_COLORS = [
  { c: '#E5484D', t: 'الأحمر', m: 'الشجاعة، الحيوية، الخطر، القوة، الغضب، الحب' },
  { c: '#F5C531', t: 'الأصفر', m: 'الحكمة، الفرح، السعادة، الفكر، الحذر، التفاؤل' },
  { c: '#2E9BD6', t: 'الأزرق', m: 'الثقة، الولاء، الحكمة، الذكاء، الهدوء، الحقيقة' },
  { c: '#8E6CEF', t: 'البنفسجي', m: 'النبل، الأناقة، الرقي، الفخامة، الغموض، الحكمة' },
  { c: '#2EAE6A', t: 'الأخضر', m: 'الطبيعة، النمو، الانسجام، النضارة، الأمان' },
  { c: '#FF8A3D', t: 'البرتقالي', m: 'البهجة، الحماس، الإبداع، الانبهار، الجاذبية، النجاح' },
  { c: '#3A3542', t: 'الأسود', m: 'القوة، الأناقة، الغموض، الخوف، الحزن، الرقي' },
  { c: '#F4F1EA', t: 'الأبيض', m: 'الحداثة، السلام، البراءة، البساطة، النور، الخير' }
];
const PT_COLORS = ['#3A2A4A', '#E5484D', '#FF8A3D', '#F5C531', '#2EAE6A', '#2E9BD6', '#8E6CEF', '#F2C29B', '#C98E62', '#FFFFFF'];
/* قالب خطوط بناء الرأس (ص 238): دائرة + خط منتصف عمودي + خط العينين + خطوط الفك */
const PT_TEMPLATE = `<svg viewBox="0 0 1400 1000" preserveAspectRatio="xMidYMid meet"><g fill="none" stroke="#8FB7E8" stroke-width="3" stroke-dasharray="12 10">
  <circle cx="700" cy="440" r="250"/><line x1="700" y1="150" x2="700" y2="920"/><line x1="430" y1="500" x2="970" y2="500"/>
  <line x1="470" y1="620" x2="930" y2="620"/><line x1="500" y1="720" x2="900" y2="720"/>
  <path d="M470 520 Q500 800 700 880 Q900 800 930 520"/></g>
  <g fill="#8FB7E8" font-family="Readex Pro,sans-serif" font-size="26" direction="ltr" text-anchor="start"><text x="985" y="508">خط العينين</text><text x="945" y="628">الأنف</text><text x="915" y="728">الفم</text><text x="715" y="190">خط المنتصف</text></g></svg>`;
