/* ============================================================
   app.js — shell, gallery, interactive demo, flow, spec
   ແອັບພະນັກງານຂັບ Insee Drive
   ============================================================ */
const $  = (q, r=document) => r.querySelector(q);
const $$ = (q, r=document) => [...r.querySelectorAll(q)];
const view = $('#view');
const renderScreen = (key, st) => RENDER[key](st || sampleState(key));

let demo = { ...structuredClone(BASE), screen:'offline' };
let timers = [];
const T = (fn, ms) => timers.push(setTimeout(fn, ms));
const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };
const logEv = (name, d='') => { demo.log.unshift({ name, d, t:new Date().toLocaleTimeString('en-GB') }); demo.log = demo.log.slice(0, 40); };
const go  = k => { demo.back.push(demo.screen); demo.screen = k; };
const ret = k => { demo.back.pop(); demo.screen = k; };

/* ============================================================
   VIEW 1 · ພາບລວມ
   ============================================================ */
function viewOverview(){
  const groups = [...new Set(SCREENS.map(s => s.group))];
  view.innerHTML = `
  <h1 class="h1">ຕົ້ນແບບແອັບຄົນຂັບ Insee Drive</h1>
  <p class="sub">ແອັບຝັ່ງ<b>ຄົນຂັບທົ່ວໄປ</b> ທີ່ຄູ່ກັບແອັບລູກຄ້າ (<code>../prototype</code>) —
     ແບບ inDrive: ລູກຄ້າຕັ້ງລາຄາ · ຄົນຂັບປະມູນ. ໃຊ້ໂດເມນ, ສະຖານະ ແລະ ຊຸດສີດຽວກັນ ເພື່ອຕໍ່ backend ດຽວກັນໄດ້.
     HTML/CSS/JS ລ້ວນໆ ບໍ່ມີ backend ຈິງ.</p>

  <div class="grid g4" style="margin-bottom:18px">
    ${[[SCREENS.length,'ໜ້າຈໍທັງໝົດ'],[groups.length,'ກຸ່ມການເຮັດວຽກ'],[Object.keys(KINDS).length,'ປະເພດງານ'],[Math.round(CFG.commissionPct*100)+'%','ຄ່າທຳນຽມບໍລິການ']]
      .map(([n, l]) => `<div class="panel big"><b>${n}</b><span>${l}</span></div>`).join('')}
  </div>

  <div class="grid g2">
    <div class="panel"><h3>ໄຫຼການໃຊ້ງານ (ຕາມທີ່ກຳນົດ)</h3>
      <div class="chips" style="margin-bottom:12px">${['ລົງທະບຽນ','ຢືນຢັນຕົວຕົນ','ໜ້າຫຼັກ','ລໍຮັບງານ','ປະມູນລາຄາ','ໄປຮັບລູກຄ້າ','ຈົບຖ້ຽວ','ໃຫ້ຄະແນນ']
        .map((x, i) => `<span class="chip b">${i + 1}. ${x}</span>`).join('')}</div>
      <ul class="ul">
        <li><b>ລົງທະບຽນ</b> — ກອກ 3 ຂັ້ນ (ຂໍ້ມູນສ່ວນຕົວ · ໃບຂັບຂີ່ & ລົດ · ແນບເອກະສານ 7 ຢ່າງ)</li>
        <li><b>ຢືນຢັນຕົວຕົນ</b> — OTP → ຖ່າຍບັດປະຈຳຕົວ → ຖ່າຍໜ້າຄູ່ບັດ (ປຽບທຽບໃບໜ້າ)</li>
        <li><b>ໜ້າຫຼັກ</b> — ກົດ GO ເພື່ອອອນລາຍ ແລ້ວລໍງານເຂົ້າ</li>
        <li><b>ປະມູນລາຄາ</b> — ລູກຄ້າຕັ້ງລາຄາ → ຮັບຕາມນັ້ນ ຫຼື ບວກເພີ່ມຂັ້ນລະ ${CFG.priceStep.toLocaleString()} ກີບ → ລູກຄ້າເລືອກໃນ ${CFG.bidWindowSec} ວິ</li>
        <li><b>ໄປຮັບ → ເດີນທາງ → ຈົບ</b> — ນຳທາງ, ລໍ (ຟຣີ ${CFG.freeWaitMin} ນາທີ), ຮັບເງິນ</li>
        <li><b>ໃຫ້ຄະແນນ</b> — ຄົນຂັບໃຫ້ດາວລູກຄ້າ ແລະ ໄດ້ຮັບດາວຈາກລູກຄ້າ (ສະສົມເປັນລະດັບ)</li>
      </ul></div>

    <div class="panel"><h3>ສູດລາຍໄດ້ — ໄດ້ຄ່າໂດຍສານເຕັມ</h3>
      <p class="note">ບໍ່ມີເງິນເດືອນ ແລະ ບໍ່ຕ້ອງນຳສົ່ງເງິນສົດ — <b>ຄ່າໂດຍສານທັງໝົດເປັນຂອງຄົນຂັບ</b>
        ບໍລິສັດຫັກແຕ່ຄ່າທຳນຽມບໍລິການເປັນ % ຂອງແຕ່ລະຖ້ຽວ.</p>
      <table class="tbl"><tbody>
        <tr><td>ຄ່າທຳນຽມບໍລິການ</td><td class="mono">${Math.round(CFG.commissionPct * 100)}% ຂອງຄ່າໂດຍສານ (ບໍ່ຫັກທິບ)</td></tr>
        <tr><td>ທິບ</td><td class="mono">ຄົນຂັບໄດ້ 100%</td></tr>
        <tr><td>ເງິນສົດທີ່ຮັບມາ</td><td class="mono">ເປັນຂອງຄົນຂັບທັນທີ</td></tr>
        <tr><td>ຮອບຕັດຍອດຄ່າທຳນຽມ</td><td class="mono">${CFG.feeCycle} · ໃຫ້ເວລາຈ່າຍ 3 ວັນ</td></tr>
        <tr><td>ຂີດຈຳກັດຄ້າງຈ່າຍ</td><td class="mono">${money(CFG.feeDueLimit)} → ຢຸດສົ່ງງານໃໝ່</td></tr>
        <tr><td>ຄ່າລໍລູກຄ້າ</td><td class="mono">ຟຣີ ${CFG.freeWaitMin} ນາທີ ຈາກນັ້ນ ${CFG.waitFee.toLocaleString()}/ນາທີ</td></tr>
        <tr><td>ຄ່າປັບຍົກເລີກ</td><td class="mono">${money(CFG.cancelPenalty)} (ຍົກເວັ້ນເຫດຜົນທີ່ບໍ່ແມ່ນຄວາມຜິດຄົນຂັບ)</td></tr>
      </tbody></table>
      <h4>ດາວ → ລະດັບ → ຄ່າທຳນຽມ</h4>
      <div class="chips">${TIERS.map(t => `<span class="chip ${t.k === tierOf().k ? 'b' : ''}">${t.n} ${t.min ? t.min.toFixed(1) + '★' : ''}</span>`).join('')}</div>
      <p class="note" style="margin-top:10px">ລະດັບຄຳ ຄ່າທຳນຽມຫຼຸດເປັນ 10% · ແພລທິນຳ 8% —
        ຄະແນນດາວຈຶ່ງເປັນແຮງຈູງໃຈໂດຍກົງ.</p></div>
  </div>

  <div class="grid g2" style="margin-top:16px">
    <div class="panel"><h3>ໝາຍເຫດ: ຝັ່ງພະນັກງານບໍລິສັດ</h3>
      <p class="note">ແອັບນີ້ເປັນຂອງ<b>ຄົນຂັບທົ່ວໄປ</b>ເທົ່ານັ້ນ (ສະໝັກເອງ · ໃຊ້ລົດຕົນເອງ · ຈ່າຍຄ່າທຳນຽມ).
        ພະນັກງານຂັບປະຈຳຂອງບໍລິສັດ <b>ບໍລິສັດເປັນຜູ້ຕັ້ງບັນຊີໃຫ້</b> ແລະ ໃຊ້ລະບົບຄົນລະຊຸດ —
        ຈຶ່ງບໍ່ມີໜ້າກະ, ວັນລາ, ເງິນເດືອນ ຫຼື ການນຳສົ່ງເງິນສົດ ໃນແອັບນີ້.</p>
      <h4>ໜ້າຈໍທີ່ບໍ່ມີໃນແອັບນີ້</h4>
      <div class="chips">${['ກວດລົດກ່ອນເລີ່ມກະ','ຕາຕະລາງກະ','ຂໍລາພັກ','ຮອບຈ່າຍເງິນເດືອນ','ນຳສົ່ງເງິນສົດ']
        .map(x => `<span class="chip">${x}</span>`).join('')}</div></div>

    <div class="panel"><h3>ຊຸດສີ · ຕົວອັກສອນ · stack</h3>
      <div class="swatch"><i style="background:#e1252b"></i><div><b>#e1252b</b><span>ແບຣນ Insee (ຫົວແອັບ · ປຸ່ມຫຼັກ)</span></div></div>
      <div class="swatch"><i style="background:#12a150"></i><div><b>#12a150</b><span>ອອນລາຍ · ລາຍໄດ້ · ຜ່ານເປົ້າ</span></div></div>
      <div class="swatch"><i style="background:#f0921f"></i><div><b>#f0921f</b><span>ຄ່າທຳນຽມຄ້າງ · ເຕືອນ</span></div></div>
      <div class="swatch"><i style="background:#0891b2"></i><div><b>#0891b2</b><span>ລົງທະບຽນ · ຢືນຢັນຕົວຕົນ</span></div></div>
      <h4>ຕົວອັກສອນ</h4>
      <p class="note">Noto Sans Lao (ລາວ) + Inter (ຕົວເລກ/ອັງກິດ) — ຊຸດດຽວກັນກັບແອັບລູກຄ້າ</p>
      <h4>ແນະນຳ stack ຕອນພັດທະນາຈິງ</h4>
      <ul class="ul">
        <li>Flutter ຫຼື React Native (ຕ້ອງແລ່ນພື້ນຫຼັງ + GPS ຕໍ່ເນື່ອງ)</li>
        <li>ແຜນທີ່ + ນຳທາງ: Google Maps SDK / Mapbox Navigation</li>
        <li>Realtime: WebSocket <code>/ws/driver/{id}</code> + push (FCM) ສຳລັບງານໃໝ່</li>
        <li>KYC: ບໍລິການ OCR ບັດປະຈຳຕົວ + face match (ເຊັ່ນ Onfido / Sumsub / ຂອງພາຍໃນ)</li>
        <li>ຕ້ອງມີ foreground service ເພື່ອບໍ່ໃຫ້ OS ຂ້າແອັບລະຫວ່າງຮັບງານ</li>
      </ul></div>
  </div>`;
}

/* ============================================================
   VIEW · ເດໂມເຕັມຈໍ (kiosk) — ແອັບຈິງ ກົດໄດ້ ເຕັມຈໍ ບໍ່ມີແຜງນັກພັດທະນາ
   ໃຊ້ paintDemo() ອັນດຽວກັບແທັບເດໂມ (ຜູກຜ່ານ #demoPhone)
   ============================================================ */
const KIOSK_JUMPS = [
  ['splash','ເປີດແອັບ'], ['apply','ລົງທະບຽນ'], ['applyVerify','ຢືນຢັນຕົວຕົນ'],
  ['login','ເຂົ້າສູ່ລະບົບ'], ['offline','ໜ້າຫຼັກ'], ['jobOffer','ງານເຂົ້າ'],
  ['bid','ປະມູນລາຄາ'], ['toPickup','ໄປຮັບ'], ['chat','ແຊັດ'],
  ['onTrip','ເດີນທາງ'], ['collect','ຮັບເງິນ'], ['ratePax','ໃຫ້ຄະແນນ'],
  ['payqr','ບັນຊີ QR'], ['wallet','ກະເປົາເງິນ'], ['earnings','ລາຍໄດ້']
];
/* ຄຳໃບ້ວ່າ “ກົດຫຍັງຕໍ່” — ຊ່ວຍຄົນນຳສະເໜີ */
const KIOSK_HINT = {
  splash:'ກົດ “ສະໝັກເປັນຄົນຂັບ” ຫຼື ລໍໜ້າເປີດແອັບ',
  apply:'ກົດ “ເລີ່ມສະໝັກ” ເພື່ອເຂົ້າຂັ້ນທີ 1',
  offline:'ກົດປຸ່ມສີຂຽວກາງໜ້າຈໍ ເພື່ອເປີດຮັບງານ',
  online:'ລໍງານເຂົ້າ ຫຼື ກົດແຖບ “ງານ” ຂ້າງລຸ່ມ',
  jobOffer:'ກົດ “ຮັບເລີຍ” ຫຼື “ສະເໜີລາຄາ” ພາຍໃນ 20 ວິນາທີ',
  bid:'ປັບລາຄາດ້ວຍ + / − ແລ້ວກົດສົ່ງລາຄາ',
  bidWait:'ລໍລູກຄ້າເລືອກ — ກົດ ⏩ ຂ້າມການລໍໄດ້',
  toPickup:'ລົດເຄື່ອນເອງຕາມເສັ້ນທາງຈິງ · ກົດໄອຄອນແຊັດເພື່ອລອງແປພາສາ',
  chat:'ພິມຂໍ້ຄວາມ — ລະບົບແປໃຫ້ອັດຕະໂນມັດ',
  arrived:'ເລື່ອນປຸ່ມລຸ່ມສຸດເພື່ອເລີ່ມຖ້ຽວ',
  onTrip:'ນຳທາງໄປປາຍທາງ · ກົດ ⏩ ເພື່ອຂ້າມໄປຮອດ',
  collect:'ເລືອກວິທີຮັບເງິນ 3 ແບບ — ລອງ “QR ບັນຊີຂ້ອຍ”',
  ratePax:'ໃຫ້ດາວ ແລະ ເລືອກປ້າຍຄຳ',
  payqr:'ກົດ “+ ເພີ່ມບັນຊີຮັບເງິນ” ເພື່ອລອງພິມເອງ',
  payqrEdit:'ກົດຊ່ອງເລກບັນຊີ — ແປ້ນພິມຈະເດັ້ງຂຶ້ນ',
  wallet:'ລອງ ເຕີມເງິນ ຫຼື ຖອນເງິນ'
};
let kioskHint = true;

function viewKiosk(){
  view.innerHTML = `
    <div class="kiosk" id="kiosk">
      <div class="ktop">
        <div class="kwho"><i class="klogo">${logoMark()}</i>
          <div><b>${CFG.appName}</b><span id="kScreen">—</span></div></div>
        <div class="kctl">
          <button class="kbtn ${kioskHint ? 'on' : ''}" id="kHint" title="ຄຳໃບ້">${I('info')}</button>
          <button class="kbtn" id="kSkip" title="ຂ້າມການລໍຖ້າ">${I('bolt')}</button>
          <button class="kbtn" id="kBack" title="ກັບຄືນ">${I('back')}</button>
          <button class="kbtn" id="kReset" title="ເລີ່ມໃໝ່">${I('refresh')}</button>
          <button class="kbtn wide" id="kFull" title="ເຕັມຈໍ">⛶ ເຕັມຈໍ</button>
        </div>
      </div>
      <div class="kstage"><div id="demoPhone"></div></div>
      <div class="khint" id="kHintBox"></div>
      <div class="kjumps">${KIOSK_JUMPS.filter(([k]) => typeof RENDER[k] === 'function')
        .map(([k, n]) => `<button class="kj" data-k="${k}">${n}</button>`).join('')}</div>
    </div>`;
  $('#kHint').onclick  = () => { kioskHint = !kioskHint; $('#kHint').classList.toggle('on', kioskHint); paintKiosk(); };
  $('#kSkip').onclick  = () => { clearTimers(); skipWait(); };
  $('#kBack').onclick  = () => { ACTIONS.goBack(); paintDemo(); };
  $('#kReset').onclick = () => { clearTimers(); navStop(); chatStop();
    const lg = demo.log; demo = { ...structuredClone(BASE), screen:'splash', log:lg };
    logEv('app.reset'); paintDemo(); };
  $('#kFull').onclick  = kioskFull;
  $$('.kj').forEach(b => b.onclick = () => startDemoAt(b.dataset.k));
  kioskFit();
  paintDemo();
}

function kioskFull(){
  const el = $('#kiosk'); if (!el) return;
  if (document.fullscreenElement) document.exitFullscreen();
  else if (el.requestFullscreen) el.requestFullscreen();
}
/* ຂະຫຍາຍໂທລະສັບໃຫ້ໃຫຍ່ສຸດເທົ່າທີ່ຈໍຮັບໄດ້ */
function kioskFit(){
  const st = $('.kstage'); if (!st) return;
  const h = st.clientHeight || (window.innerHeight - 220);
  const s = Math.max(.72, Math.min(2.1, (h - 18) / 800));
  st.style.setProperty('--ks', s.toFixed(3));
}
function paintKiosk(){
  const lbl = $('#kScreen'); if (!lbl) return;
  const s = screenByKey(demo.screen);
  lbl.textContent = s ? s.id + ' · ' + s.lo : demo.screen;
  $$('.kj').forEach(b => b.classList.toggle('on', b.dataset.k === demo.screen));
  const box = $('#kHintBox');
  const tip = KIOSK_HINT[demo.screen] || (s && s.desc) || '';
  box.hidden = !kioskHint || !tip;
  box.innerHTML = kioskHint && tip ? `${I('info')}<span>${tip}</span>` : '';
  kioskFit();   /* ແຖບຄຳໃບ້ເຊື່ອງ/ສະແດງ → ພື້ນທີ່ປ່ຽນ ຕ້ອງຄິດຂະໜາດຄືນ */
}
window.addEventListener('resize', () => { if ($('.kstage')) kioskFit(); });
document.addEventListener('fullscreenchange', () => { if ($('.kstage')) setTimeout(kioskFit, 60); });

/* ============================================================
   VIEW · ວິທີໃຊ້ແອພ (usage) — ເລົ່າການນຳໃຊ້ເປັນຂັ້ນຕອນ
   ໃຊ້ນຳສະເໜີໃຫ້ຄົນທີ່ບໍ່ເຄີຍເຫັນແອັບມາກ່ອນ
   ============================================================ */
let usageIdx = -1;   /* -1 = ສະແດງທຸກຂັ້ນ (ເລື່ອນອ່ານ) */

function viewUsage(){
  const n = USAGE.length;
  view.innerHTML = `
    <h1 class="h1">ວິທີໃຊ້ແອພ · ${n} ຂັ້ນຕອນ</h1>
    <p class="sub">ຕັ້ງແຕ່ລົງທະບຽນຈົນຮັບເງິນ — ແຕ່ລະຂັ້ນບອກວ່າ <b>ຄົນຂັບເຮັດຫຍັງ</b> ແລະ <b>ລະບົບເຮັດຫຍັງ</b> ພ້ອມໜ້າຈໍຈິງ.
      ກົດຕົວເລກເພື່ອເບິ່ງເທື່ອລະຂັ້ນ ຫຼື ກົດ “ທັງໝົດ” ເພື່ອເລື່ອນອ່ານ.</p>
    <div class="ubar">
      <button class="ustep ${usageIdx < 0 ? 'on' : ''}" data-u="-1">ທັງໝົດ</button>
      ${USAGE.map((u, i) => `<button class="ustep ${usageIdx === i ? 'on' : ''}" data-u="${i}"
        title="${u.t}"><b>${u.n}</b><span>${u.t}</span></button>`).join('')}
    </div>
    <div class="usteps">${(usageIdx < 0 ? USAGE : [USAGE[usageIdx]]).map(uCard).join('')}</div>`;
  $$('.ustep').forEach(b => b.onclick = () => { usageIdx = +b.dataset.u; viewUsage(); window.scrollTo({ top:0, behavior:'smooth' }); });
  $$('.ucard .thumb').forEach(t => t.onclick = () => openModal(t.dataset.key));
  applyUZoom();
}

function uCard(u){
  const keys = (u.keys || []).filter(k => typeof RENDER[k] === 'function');
  return `<section class="ucard">
    <div class="uhead"><i>${u.n}</i><div><b>${u.t}</b><span>${u.s}</span></div></div>
    <div class="ubody">
      <div class="ushots">${keys.map(k => { const s = screenByKey(k);
        return `<figure><div class="thumb" data-key="${k}">${phone(renderScreen(k))}</div>
          <figcaption>${s ? s.lo : k}</figcaption></figure>`; }).join('')}</div>
      <div class="unotes">
        <div class="ulist do"><h4>${I('userc')} ຄົນຂັບເຮັດ</h4><ol>${u.do.map(x => `<li>${x}</li>`).join('')}</ol></div>
        <div class="ulist sys"><h4>${I('bolt')} ລະບົບເຮັດ</h4><ul>${u.sys.map(x => `<li>${x}</li>`).join('')}</ul></div>
        ${u.tip ? `<div class="utip">${I('info')}<span>${u.tip}</span></div>` : ''}
      </div>
    </div>
  </section>`;
}
function applyUZoom(){
  $$('.ucard .thumb').forEach(t => { t.style.setProperty('--ts', .46); t.style.setProperty('--tw', '166px'); t.style.setProperty('--th', '372px'); });
}

/* ============================================================
   VIEW · ນຳສະເໜີ (present) — ສະແດງແຕ່ໜ້າຈໍແອັບ ບໍ່ມີຂໍ້ມູນນັກພັດທະນາ
   ໜຶ່ງໜ້າຈໍຕໍ່ໜຶ່ງສະໄລ້ · ລູກສອນ ←/→ · ເຕັມຈໍ · ຫຼິ້ນອັດຕະໂນມັດ
   ============================================================ */
let presIdx = 0, presTimer = null, presGroup = 'ທັງໝົດ';
const presList = () => SCREENS.filter(s => presGroup === 'ທັງໝົດ' || s.group === presGroup);

function viewPresent(){
  const groups = ['ທັງໝົດ', ...STEP_GROUPS.map(g => g.g)];
  view.innerHTML = `
    <div class="present" id="present">
      <div class="pbar">
        <div class="pgroups">${groups.map(g =>
          `<button class="pg ${g === presGroup ? 'on' : ''}" data-pg="${g}">${g}</button>`).join('')}</div>
        <div class="pctl">
          <button class="pbtn" id="pPlay" title="ຫຼິ້ນອັດຕະໂນມັດ">▶</button>
          <button class="pbtn" id="pFull" title="ເຕັມຈໍ">⛶</button>
        </div>
      </div>
      <div class="pstage">
        <button class="pnav prev" id="pPrev" aria-label="ກ່ອນໜ້າ">‹</button>
        <div class="pphone" id="pPhone"></div>
        <button class="pnav next" id="pNext" aria-label="ຕໍ່ໄປ">›</button>
      </div>
      <div class="pcap"><b id="pTitle"></b><span id="pCount"></span></div>
      <div class="pstrip" id="pStrip"></div>
    </div>`;
  presIdx = Math.min(presIdx, presList().length - 1);
  $$('#present .pg').forEach(b => b.onclick = () => { presGroup = b.dataset.pg; presIdx = 0; viewPresent(); });
  $('#pPrev').onclick = () => presGo(-1);
  $('#pNext').onclick = () => presGo(1);
  $('#pPlay').onclick = presToggle;
  $('#pFull').onclick = presFull;
  paintPresent();
}

function presGo(d){
  const n = presList().length;
  presIdx = (presIdx + d + n) % n;
  paintPresent();
}
function presToggle(){
  const b = $('#pPlay'); if (!b) return;
  if (presTimer){ clearInterval(presTimer); presTimer = null; b.textContent = '▶'; b.classList.remove('on'); }
  else { presTimer = setInterval(() => presGo(1), 4200); b.textContent = '❚❚'; b.classList.add('on'); }
}
function presFull(){
  const el = $('#present'); if (!el) return;
  if (document.fullscreenElement) document.exitFullscreen();
  else el.requestFullscreen && el.requestFullscreen();
}
function paintPresent(){
  const list = presList(), s = list[presIdx];
  if (!s) return;
  navStop();
  $('#pPhone').innerHTML = phone(RENDER[s.key]({ ...sampleState(s.key), live:true }));
  mountMaps();
  if (window.mountQR) mountQR();
  $('#pTitle').textContent = s.lo;
  $('#pCount').textContent = (presIdx + 1) + ' / ' + list.length;
  $('#pStrip').innerHTML = list.map((x, i) =>
    `<button class="pt ${i === presIdx ? 'on' : ''}" data-i="${i}" title="${x.lo}">${x.lo}</button>`).join('');
  $$('#pStrip .pt').forEach(b => b.onclick = () => { presIdx = +b.dataset.i; paintPresent(); });
  const cur = $('#pStrip .pt.on'); if (cur && cur.scrollIntoView) cur.scrollIntoView({ block:'nearest', inline:'center', behavior:'smooth' });
  /* ໜ້າຈໍນຳທາງ → ເປີດເສັ້ນທາງຈິງໃຫ້ເຫັນລົດເຄື່ອນ */
  if (s.key === 'toPickup' || s.key === 'onTrip'){
    const j = JOBS[0];
    const from = s.key === 'toPickup' ? [17.9640, 102.5930] : [j.from.lat, j.from.lng];
    const to   = s.key === 'toPickup' ? [j.from.lat, j.from.lng] : [j.to.lat, j.to.lng];
    routeNav(from, to, R => { if ($('#pPhone')) navStart(R, () => {}, { speed:11.1 }); });
  }
}

/* ============================================================
   VIEW 2 · ໜ້າຈໍ (gallery)
   ============================================================ */
let galFilter = 'ທັງໝົດ';
const ZOOMS = { ນ້ອຍ:['.45','198px','392px'], ກາງ:['.63','268px','524px'], ໃຫຍ່:['.85','352px','706px'] };
let galZoom = localStorage.getItem('inseeDrvZoom') || 'ກາງ';
function viewScreens(){
  const groups = ['ທັງໝົດ', ...GROUP_ORDER.filter(g => SCREENS.some(s => s.group === g))];
  const list = SCREENS.filter(s => galFilter === 'ທັງໝົດ' || s.group === galFilter);
  view.innerHTML = `
    <h1 class="h1">ໜ້າຈໍທັງໝົດ · ${SCREENS.length} ໜ້າ</h1>
    <p class="sub">👆 <b>ກົດທີ່ໜ້າຈໍໃດໜຶ່ງ</b> ເພື່ອເບິ່ງຂະໜາດເຕັມ + ອົງປະກອບ + event + API · ປັບຂະໜາດຮູບໄດ້ດ້ວຍປຸ່ມ “ຂະໜາດ” ດ້ານຂວາ.</p>
    <div class="galtools">${groups.map(g => `<button class="fbtn ${g === galFilter ? 'on' : ''}" data-g="${g}">${g}</button>`).join('')}
      <div class="zoomrow"><b>ຂະໜາດ</b>${Object.keys(ZOOMS).map(z =>
        `<button class="fbtn ${z === galZoom ? 'on' : ''}" data-z="${z}">${z}</button>`).join('')}</div>
    </div>
    <div class="gallery">
      ${list.map(s => `<div class="gcard" data-key="${s.key}">
        <span class="gid">${s.id}</span>
        <div class="thumb">${phone(renderScreen(s.key))}</div>
        <div class="gmeta"><b>${s.lo}</b><span>${s.route}</span></div>
      </div>`).join('')}
    </div>`;
  applyZoom();
  $$('.fbtn[data-g]').forEach(b => b.onclick = () => { galFilter = b.dataset.g; viewScreens(); });
  $$('.fbtn[data-z]').forEach(b => b.onclick = () => { galZoom = b.dataset.z; localStorage.setItem('inseeDrvZoom', galZoom); viewScreens(); });
  $$('.gcard').forEach(c => c.onclick = () => openModal(c.dataset.key));
}
function applyZoom(){
  const g = $('.gallery'); if (!g) return;
  const [ts, tw, th] = ZOOMS[galZoom] || ZOOMS['ກາງ'];
  g.style.setProperty('--ts', ts); g.style.setProperty('--tw', tw); g.style.setProperty('--th', th);
}

function openModal(key){
  const s = screenByKey(key);
  if (!s || typeof RENDER[key] !== 'function'){ toast('ບໍ່ພົບໜ້າຈໍ — ໂຫຼດໜ້າເວັບຄືນ (Cmd+Shift+R)'); return; }
  const m = $('#modal');
  m.hidden = false;
  m.innerHTML = `
    <button class="mclose">✕</button>
    <div class="mbox">
      <div>${phone(RENDER[key]({ ...sampleState(key), live:true }))}</div>
      <div class="mspec">
        <h2>${s.lo}</h2>
        <div class="idline">${s.id} · <span style="color:var(--brand2)">${s.route}</span></div>
        <div class="chips"><span class="chip b">${s.group}</span><span class="chip a">${s.en}</span></div>
        <p class="note" style="margin:12px 0 0">${s.desc}</p>
        <h4>ອົງປະກອບ</h4><ul class="ul">${s.comp.map(c => `<li>${c}</li>`).join('')}</ul>
        <h4>ສະຖານະທີ່ຕ້ອງຮອງຮັບ</h4><div class="chips">${s.states.map(c => `<span class="chip">${c}</span>`).join('')}</div>
        <h4>ເຫດການ (events)</h4><div class="chips">${s.events.map(c => `<span class="chip g">${c}</span>`).join('')}</div>
        <h4>API</h4><div class="chips">${s.api.map(c => `<span class="chip b">${c}</span>`).join('')}</div>
        <div class="mactions">
          <button class="abtn" data-go="${key}">▶ ເປີດໃນເດໂມ</button>
          <button class="abtn plain mclose2">ປິດ</button>
        </div>
      </div>
    </div>`;
  const close = () => { m.hidden = true; m.innerHTML = ''; };
  mountMaps(); if (window.mountQR) mountQR();
  $('.mclose', m).onclick = close;
  $('.mclose2', m).onclick = close;
  m.onclick = e => { if (e.target === m) close(); };
  $('[data-go]', m).onclick = () => { close(); startDemoAt(key); switchTab('demo'); };
}

/* ============================================================
   VIEW 3 · ເດໂມ
   ============================================================ */
const STEP_GROUPS = GROUP_ORDER.map(g => ({ g, items:SCREENS.filter(x => x.group === g) })).filter(x => x.items.length);

function viewDemo(){
  view.innerHTML = `
    <h1 class="h1">ເດໂມແອັບຄົນຂັບ (ກົດຫຼິ້ນໄດ້ຈິງ)</h1>
    <p class="sub">ຄລິກພາຍໃນໜ້າຈໍໄດ້ເລີຍ — ລົງທະບຽນ, ຢືນຢັນຕົວຕົນ, ຮັບງານ, ສະເໜີລາຄາ, ໄປຮັບ, ຈົບຖ້ຽວ,
       ໃຫ້ຄະແນນ ແລະ ຈ່າຍຄ່າທຳນຽມ. ດ້ານຂວາສະແດງ state ແລະ event ທີ່ backend ຕ້ອງຮອງຮັບ.</p>
    <div class="demo">
      <div class="panel">
        <h3>ໜ້າຈໍທັງໝົດ (${SCREENS.length})</h3>
        <div class="stepsbox"><ul class="steps" id="steps"></ul></div>
      </div>
      <div class="stage">
        <div id="demoPhone"></div>
        <div class="stagebar">
          <button class="abtn plain" id="btnReset">↺ ເລີ່ມໃໝ່</button>
          <button class="abtn plain" id="btnAuto">⏩ ຂ້າມການລໍຖ້າ</button>
        </div>
      </div>
      <div class="panel">
        <h3>ສະຖານະປັດຈຸບັນ (JSON)</h3>
        <div class="jsonbox" id="stateBox"></div>
        <h3 style="margin-top:16px">ບັນທຶກເຫດການ</h3>
        <div class="evlog" id="evBox"></div>
      </div>
    </div>`;
  $('#btnReset').onclick = () => { clearTimers(); const lg = demo.log;
    navStop(); chatStop(); demo = { ...structuredClone(BASE), screen:'offline', log:lg }; logEv('app.reset'); paintDemo(); };
  $('#btnAuto').onclick = () => { clearTimers(); skipWait(); };
  paintDemo();
}

function paintDemo(){
  const ph = $('#demoPhone'); if (!ph) return;
  if (typeof RENDER[demo.screen] !== 'function'){
    logEv('nav.fallback', demo.screen + ' (ບໍ່ພົບ)');
    demo.screen = 'offline'; demo.back = [];
  }
  demo.seen = demo.seen || {}; demo.seen[demo.screen] = true;
  ph.innerHTML = phone(RENDER[demo.screen]({ ...demo, demo:true, live:true }));
  mountMaps();
  if (typeof setMapMode === 'function' && demo.mapMode) setMapMode(demo.mapMode);
  if (window.mountQR) mountQR();
  /* ໜ້າຈໍຖືກສ້າງຄືນ → ຜູກແຜນທີ່ ແລະ ຂໍ້ຄວາມນຳທາງກັບຄືນ */
  if (NAV.on && NAV.R){ navBindMaps(); const st = navState(); navPaintMap(st); navPaintUI(st); }
  if (CHAT.job) chatPaint();
  if ($('#steps')){
    $('#steps').innerHTML = STEP_GROUPS.map(gr => `<li class="gh">${gr.g}</li>` + gr.items.map(x =>
        `<li class="${x.key === demo.screen ? 'on' : (demo.seen[x.key] ? 'done' : '')}" data-k="${x.key}">
          <i>${demo.seen[x.key] ? '✓' : ''}</i>${x.lo}</li>`).join('')).join('');
    $$('#steps li').forEach(li => li.onclick = () => startDemoAt(li.dataset.k));
  }
  paintKiosk();
  paintState();
}

/* ອັບເດດພຽງ state box + event log (ໃຊ້ຕອນນຳທາງ ໂດຍບໍ່ render ໜ້າຈໍຄືນ) */
function paintState(){
  if (!$('#stateBox')) return;
  const j = demo.job;
  const show = { screen:demo.screen, me:ME.code, tier:tierOf().n, online:demo.online, status:demo.status,
    jobId:j && j.id, kind:j && j.kind, pax:j && j.pax,
    offer:j && j.offer, bidPrice:demo.bidPrice, bidRank:demo.status === 'waiting' ? demo.bidRank : null,
    waitSec:demo.waitSec || null, waitFee:waitFeeOf(demo.waitSec || 0) || null, tripSec:demo.tripSec || null,
    payMethod:demo.payMethod, collected:demo.collected || null,
    fare:j ? (demo.bidPrice || j.offer) : null,
    commission:j ? feeOf(demo.bidPrice || j.offer) : null,
    netEarn:j ? earnOf(demo.bidPrice || j.offer) : null,
    feeDue:feeTotal(demo), feePct:feePct(demo) + '%',
    wallet:walBal(demo), walletAutoFee:walAuto(demo), withdrawable:walFree(demo),
    nav:demo.nav || null,
    chat:CHAT.job ? { paxLang:CHAT.job.paxLang || 'lo', autoTranslate:CHAT.autoTr,
                      msgs:CHAT.msgs.length, unread:CHAT.unread, typing:CHAT.typing } : null,
    applyStep:demo.apply ? demo.apply.step : null,
    verified:demo.apply ? (demo.apply.verify || []).length + '/3' : null,
    todayTrips:demo.today.trips, unread:demo.notifs.filter(n => n.unread).length,
    canOnline:canOnline(demo) };
  $('#stateBox').innerHTML = JSON.stringify(show, null, 2)
    .replace(/"([^"]+)":/g, '<span class="k">"$1"</span>:')
    .replace(/: "([^"]*)"/g, ': <span class="s">"$1"</span>')
    .replace(/: (\d+\.?\d*)/g, ': <span class="n">$1</span>')
    .replace(/: (null|true|false)/g, ': <span class="b">$1</span>');
  $('#evBox').innerHTML = demo.log.map(e => `<div class="ev"><b>${e.t}</b><span>${e.name}${e.d ? ' · ' + e.d : ''}</span></div>`).join('');
}

function startDemoAt(key){
  if (typeof RENDER[key] !== 'function'){ toast('ບໍ່ພົບໜ້າຈໍນີ້'); return; }
  clearTimers(); navStop();
  demo = { ...demo, ...sampleState(key), screen:key, log:demo.log, seen:demo.seen };
  if (key === 'jobOffer') runPop();
  if (key === 'bidWait')  runBidWait();
  if (key === 'arrived')  runWait();
  if (key === 'toPickup' || key === 'onTrip') navFor(key);
  logEv('nav.goto', key);
  if ($('#demoPhone')) paintDemo(); else switchTab('demo');
}

/* ---- ຕົວນັບເວລາຂອງເດໂມ ---- */
function runPop(){
  T(() => { if (demo.screen !== 'jobOffer') return;
    demo.popSec--;
    if (demo.popSec <= 0){ logEv('job.timeout', demo.job && demo.job.id); toast('ໝົດເວລາຕັດສິນໃຈ — ງານຖືກສົ່ງໃຫ້ຄົນຂັບຄົນອື່ນ');
      demo.job = null; demo.status = 'idle'; demo.screen = 'online'; paintDemo(); return; }
    paintDemo(); runPop(); }, 1000);
}
function runBidWait(){
  T(() => { if (demo.screen !== 'bidWait') return;
    demo.bidSec--;
    if (demo.bidSec === 34){ demo.bidders++; demo.bidRank = Math.min(demo.bidders, demo.bidRank + 1); logEv('bid.competitor', 'ມີຄົນຂັບສະເໜີເພີ່ມ'); }
    if (demo.bidSec <= 0){ winBid(); return; }
    paintDemo(); runBidWait(); }, 1000);
}
/* ລູກຄ້າເລືອກລາຄາຂອງເຮົາ → ຮັບງານ ແລະ ເລີ່ມນຳທາງໄປຈຸດຮັບທັນທີ */
function winBid(){
  if (!demo.job) return;
  clearTimers();
  demo.status = 'assigned'; demo.screen = 'toPickup'; demo.back = [];
  logEv('bid.won', money(demo.bidPrice || demo.job.offer));
  logEv('job.assigned', demo.job.id + ' · ' + demo.job.pax);
  toast('🎉 ລູກຄ້າເລືອກທ່ານແລ້ວ — ກຳລັງນຳທາງໄປຈຸດຮັບ');
  paintDemo();
  navFor('toPickup');
  /* ເປີດຊ່ອງແຊັດໄວ້ພື້ນຫຼັງ — ລູກຄ້າທັກມາໄດ້ລະຫວ່າງນຳທາງ */
  chatOpen(demo.job, [{ who:'them', tx:'ຂ້ອຍລໍຢູ່ປະຕູບ້ານສີແດງເດີ້ 🙏', t:'21:50' }], () => paintState());
  chatLeave();
}
/* ລູກຄ້າເລືອກຄົນຂັບຄົນອື່ນ */
function loseBid(){
  if (!demo.job) return;
  clearTimers(); navStop(); chatStop();
  logEv('bid.lost', demo.job && demo.job.id);
  toast('ລູກຄ້າເລືອກຄົນຂັບຄົນອື່ນ — ລໍງານໃໝ່ໄດ້ເລີຍ');
  Object.assign(demo, { job:null, status:'idle', bidPrice:null });
  demo.back = []; demo.screen = 'online';
  paintDemo();
}
function runWait(){
  T(() => { if (demo.screen !== 'arrived') return;
    demo.waitSec += 5;
    if (demo.waitSec === CFG.freeWaitMin * 60) logEv('trip.wait.fee', 'ເລີ່ມຄິດຄ່າລໍ');
    paintDemo(); runWait(); }, 1000);
}
/* ---- ນຳທາງ realtime ----
   ດຶງເສັ້ນທາງຈິງ (OSRM) ແລ້ວໃຫ້ NAV engine ເຄື່ອນລົດ ແລະ ອັບເດດ DOM ເອງທຸກວິນາທີ
   — ບໍ່ເອີ້ນ paintDemo() ໃນ loop ເພື່ອບໍ່ໃຫ້ແຜນທີ່ຖືກສ້າງຄືນ (ກະພິບ) */
function startNav(from, to, opt = {}){
  navStop();
  demo.nav = { loading:true, phase:opt.phase || 'trip' };
  routeNav(from, to, R => {
    demo.route = R;
    demo.nav = { loading:false, phase:opt.phase || 'trip', km:R.km, min:R.min, real:R.real };
    logEv('nav.route', R.km + ' km · ' + R.min + ' ນາທີ' + (R.real ? ' (ຖະໜົນຈິງ)' : ' (ປະມານ)'));
    navStart(R, st => {
      demo.tripSec = Math.round(st.m / NAV.speed);
      demo.nav = { loading:false, phase:opt.phase || 'trip', km:R.km, min:R.min, real:R.real,
                   remainKm:st.remainKm, remainMin:st.remainMin, eta:st.eta,
                   instr:instrText(st.step), toTurn:Math.round(st.toTurn) };
      paintState();
      if (st.done) onNavDone(opt.phase);
    }, { speed:opt.speed || 11.1 });
  });
}
function onNavDone(phase){
  if (phase === 'pickup' && demo.screen === 'toPickup'){
    logEv('nav.arrived', 'ຈຸດຮັບ'); toast('📍 ຮອດຈຸດຮັບແລ້ວ — ເລື່ອນປຸ່ມເພື່ອຢືນຢັນ');
  } else if (phase === 'trip' && demo.screen === 'onTrip'){
    logEv('nav.arrived', 'ປາຍທາງ'); toast('🏁 ຮອດປາຍທາງແລ້ວ — ເລື່ອນປຸ່ມເພື່ອຈົບການເດີນທາງ');
  }
}
/* ເລີ່ມນຳທາງຕາມໜ້າຈໍປັດຈຸບັນ */
function navFor(screen){
  const j = demo.job; if (!j) return;
  if (screen === 'toPickup') startNav(ll(currentPos()), ll(j.from), { phase:'pickup', speed:10 });
  if (screen === 'onTrip')   startNav(ll(j.from), ll(j.to), { phase:'trip', speed:11.5 });
}
const currentPos = () => ({ lat:CFG.center.lat - 0.012, lng:CFG.center.lng - 0.008 });
function skipWait(){
  if (demo.screen === 'jobOffer'){ demo.popSec = 1; runPop(); }
  else if (demo.screen === 'bidWait'){ winBid(); }
  else if (demo.screen === 'arrived'){ demo.waitSec += 300; logEv('demo.skip', 'ລໍ +5 ນາທີ'); paintDemo(); }
  else if ((demo.screen === 'onTrip' || demo.screen === 'toPickup') && NAV.R){
    navSkipTo(0.985); logEv('demo.skip', 'ໄປໃກ້ປາຍທາງ'); }
  else toast('ໜ້ານີ້ບໍ່ມີການລໍຖ້າໃຫ້ຂ້າມ');
}

/* ============================================================
   ACTIONS — ພຶດຕິກຳການກົດທັງໝົດຂອງເດໂມ
   ============================================================ */
const ACTIONS = {
  noop:   () => {},
  soon:   () => toast('ຟັງຊັນນີ້ຍັງບໍ່ມີໃນຕົ້ນແບບ (ໄວ້ພັດທະນາຈິງ)'),
  goBack: () => { demo.screen = demo.back.pop() || 'offline'; },
  nav:    d => { clearTimers(); navStop(); demo.back = []; demo.screen = d.v === 'home' ? (demo.online ? 'online' : 'offline') : d.v;
                 logEv('nav.tab', d.v); },

  /* ---- ນຳທາງ realtime ---- */
  navRecenter: () => { NAV.follow = true; const st = navState();
    if (st) navPaintMap(st); logEv('nav.recenter'); toast('📍 ຕິດຕາມລົດອັດຕະໂນມັດ'); },
  navOverview: () => { NAV.follow = false;
    Object.keys(MAPS).forEach(id => { const M = MAPS[id];
      if (M && M.rest) M.map.fitBounds(M.rest.getBounds(), { padding:[30, 30] }); });
    logEv('nav.overview'); toast('🗺 ເບິ່ງທັງເສັ້ນທາງ — ກົດ 📍 ເພື່ອຕິດຕາມລົດຄືນ'); },
  navMute: () => { NAV.muted = !NAV.muted; logEv('nav.voice', NAV.muted ? 'ປິດ' : 'ເປີດ');
    toast(NAV.muted ? '🔇 ປິດສຽງແຈ້ງທາງ' : '🔊 ເປີດສຽງແຈ້ງທາງ'); },
  navReroute: () => { const j = demo.job; if (!j) return;
    logEv('nav.reroute'); toast('🔄 ກຳລັງຄິດເສັ້ນທາງໃໝ່...'); navFor(demo.screen); },

  /* ---- ປຸ່ມເທິງແຜນທີ່ (ມາຈາກ ui.js realMap) ---- */
  toggleMapMode: () => {
    const m = (typeof MAP_MODE !== 'undefined' && MAP_MODE === 'sat') ? 'street' : 'sat';
    setMapMode(m); demo.mapMode = m; logEv('map.mode', m === 'sat' ? 'ດາວທຽມ' : 'ປົກກະຕິ');
    toast(m === 'sat' ? '🛰 ສະຫຼັບເປັນແຜນທີ່ດາວທຽມ' : '🗺 ສະຫຼັບເປັນແຜນທີ່ປົກກະຕິ'); },
  useGps: () => { logEv('map.recenter'); toast('📍 ຍ້າຍແຜນທີ່ກັບມາຕຳແໜ່ງປັດຈຸບັນ');
    askGeo(pos => { if (!pos) toast('ບໍ່ໄດ້ຮັບອະນຸຍາດ GPS — ໃຊ້ຈຸດກາງນະຄອນຫຼວງແທນ'); }); },

  /* ---- ລົງທະບຽນເປັນຄົນຂັບ (D02–D08) ---- */
  goApply:       () => { demo.apply = demo.apply || {}; demo.back = []; demo.screen = 'apply'; logEv('register.view'); },
  goApplyStatus: () => { go('applyStatus'); logEv('register.status.view'); },
  goLogin:       () => { demo.back = []; demo.screen = 'login'; },
  apSet:    (k, v) => { demo.apply = { ...apOf(demo), [k]:v }; },
  apStart:  () => { demo.apply = { ...apOf(demo), step:1 }; demo.back = []; demo.screen = 'applyPersonal';
                    logEv('register.start'); },
  apNext:   () => { const a = apOf(demo);
    const next = { 1:'applyLicense', 2:'applyDocs', 3:'applyVerify', 4:'applyReview' }[a.step];
    if (!next) return;
    demo.apply = { ...a, step:a.step + 1 }; demo.screen = next; logEv('register.step', 'ຂັ້ນ ' + (a.step + 1)); },
  apBack:   () => { const a = apOf(demo);
    const prev = { 2:'applyPersonal', 3:'applyLicense', 4:'applyDocs', 5:'applyVerify' }[a.step];
    demo.apply = { ...a, step:Math.max(1, a.step - 1) };
    demo.screen = prev || 'apply'; },
  apGo1:    () => { demo.apply = { ...apOf(demo), step:1 }; demo.screen = 'applyPersonal'; },
  apGo2:    () => { demo.apply = { ...apOf(demo), step:2 }; demo.screen = 'applyLicense'; },
  apGo3:    () => { demo.apply = { ...apOf(demo), step:3 }; demo.screen = 'applyDocs'; },
  apGo4:    () => { demo.apply = { ...apOf(demo), step:4 }; demo.screen = 'applyVerify'; },
  apSex:    d => ACTIONS.apSet('sex', d.v),
  apLic:    d => { if (!LIC_TYPES.some(x => x.k === d.v)) return;
    ACTIONS.apSet('licType', d.v); logEv('register.licence', d.v);
    if (!licOk(d.v)) toast('ໃບຂັບຂີ່ປະເພດ A ຮັບໄດ້ສະເພາະງານລົດຈັກ'); },
  apManual: () => ACTIONS.apSet('manual', !apOf(demo).manual),
  apCarType:d => { if (!CAR_TYPES.some(x => x.k === d.v)) return;
    ACTIONS.apSet('carType', d.v); logEv('register.vehicle', d.v); },
  apLang:   d => { const l = apOf(demo).langs;
    ACTIONS.apSet('langs', l.includes(d.v) ? l.filter(x => x !== d.v) : [...l, d.v]); },
  apZone:   d => { ACTIONS.apSet('zone', d.v); logEv('register.zone', d.v); },
  apDoc:    d => { const k = apOf(demo).docs, on = k.includes(d.v);
    ACTIONS.apSet('docs', on ? k.filter(x => x !== d.v) : [...k, d.v]);
    logEv(on ? 'register.doc.remove' : 'register.doc.upload', d.v);
    if (!on) toast('📎 ແນບ “' + (APPLY_DOCS.find(x => x.k === d.v) || {}).n + '” ແລ້ວ'); },
  /* ຢືນຢັນຕົວຕົນ 3 ຂັ້ນ */
  apVerify: d => {
    const a = apOf(demo); if (a.verify.includes(d.v)) return;
    const step = VERIFY_STEPS.find(v => v.k === d.v); if (!step) return;
    ACTIONS.apSet('verify', [...a.verify, d.v]);
    if (d.v === 'phone')  { ACTIONS.apSet('otp', '4821'); toast('✅ ຢືນຢັນເບີໂທສຳເລັດ'); }
    if (d.v === 'idcard') toast('📇 ອ່ານຂໍ້ມູນຈາກບັດປະຈຳຕົວສຳເລັດ');
    if (d.v === 'selfie') toast('🙂 ປຽບທຽບໃບໜ້າກັບບັດ — ຕົງກັນ 98%');
    logEv('verify.' + d.v, 'ຜ່ານ'); },
  apAgree:  d => { const g = apOf(demo).agree;
    ACTIONS.apSet('agree', g.includes(d.v) ? g.filter(x => x !== d.v) : [...g, d.v]);
    logEv('register.consent', d.v); },
  apSubmit: () => {
    const a = apOf(demo);
    if (a.agree.length < 3){ toast('ຕ້ອງຕິກຂໍ້ຕົກລົງໃຫ້ຄົບ 3 ຂໍ້'); return; }
    logEv('register.submit', APPLY_DEMO.ref);
    toast('✅ ສົ່ງໃບລົງທະບຽນແລ້ວ · ເລກອ້າງອີງ ' + APPLY_DEMO.ref);
    demo.back = []; demo.screen = 'applyStatus'; },
  apConfirmAppt: () => { logEv('register.appt.confirm', APPLY_DEMO.appt.d);
    toast('ຢືນຢັນເຂົ້າຮ່ວມ ' + APPLY_DEMO.appt.d + ' ' + APPLY_DEMO.appt.t + ' ແລ້ວ'); },
  apCancel: () => { logEv('register.cancel'); toast('ຍົກເລີກໃບລົງທະບຽນແລ້ວ');
    demo.apply = null; demo.back = []; demo.screen = 'login'; },

  /* ---- ປຸ່ມເທິງແຜນທີ່ (ມາຈາກ ui.js realMap) ---- */
  toggleMapMode: () => {
    const m = (typeof MAP_MODE !== 'undefined' && MAP_MODE === 'sat') ? 'street' : 'sat';
    setMapMode(m); demo.mapMode = m; logEv('map.mode', m === 'sat' ? 'ດາວທຽມ' : 'ປົກກະຕິ');
    toast(m === 'sat' ? '🛰 ສະຫຼັບເປັນແຜນທີ່ດາວທຽມ' : '🗺 ສະຫຼັບເປັນແຜນທີ່ປົກກະຕິ'); },
  useGps: () => { logEv('map.recenter'); toast('📍 ຍ້າຍແຜນທີ່ກັບມາຕຳແໜ່ງປັດຈຸບັນ');
    askGeo(pos => { if (!pos) toast('ບໍ່ໄດ້ຮັບອະນຸຍາດ GPS — ໃຊ້ຈຸດກາງນະຄອນຫຼວງແທນ'); }); },

  /* ---- ເຂົ້າສູ່ລະບົບ ---- */
  sendOtp:   () => { demo.otp = ''; go('otp'); logEv('auth.requestOtp', ME.code); },
  resendOtp: () => toast('ສົ່ງລະຫັດ OTP ໃໝ່ແລ້ວ'),
  verifyOtp: () => { demo.back = []; demo.screen = 'offline'; logEv('auth.verifyOtp', 'ສຳເລັດ');
                     toast('ຍິນດີຕ້ອນຮັບ ' + ME.en + ' 👋'); },
  callCenter:() => toast('☎️ ກຳລັງໂທຫາ ' + CFG.hotline + '...'),

  /* ໃຊ້ໃນໃບງານ “ຂັບລົດຂອງລູກຄ້າ” — ກວດສະພາບ ແລະ ຖ່າຍຮູບກ່ອນຮັບມອບ */
  toggleCheck: d => { const c = demo.checks || [];
    demo.checks = c.includes(d.v) ? c.filter(x => x !== d.v) : [...c, d.v];
    logEv('drivemine.inspect', d.v + (demo.checks.includes(d.v) ? ' ✓' : ' ✗')); },
  takePhoto: d => { logEv('drivemine.photo', d.v); toast('📸 ຖ່າຍຮູບດ້ານ' + d.v + 'ແລ້ວ'); },
  reportCar: () => { logEv('vehicle.report'); toast('ແຈ້ງສູນຄວບຄຸມແລ້ວ — ຈະຕິດຕໍ່ກັບພາຍໃນ 10 ນາທີ'); },

  /* ---- ອອນລາຍ / ອອບລາຍ ---- */
  goOnline: () => { demo.online = true; demo.screen = 'online'; demo.back = [];
    logEv('driver.goOnline', ME.area); toast('🟢 ອອນລາຍແລ້ວ — ກຳລັງຊອກງານໃຫ້ທ່ານ');
    T(() => { if (demo.screen === 'online'){ ACTIONS.openJob({ v:JOBS[0].id }); paintDemo(); } }, 2600); },
  blockedOnline: () => {
    if (feeTotal(demo) >= CFG.feeDueLimit){ toast('⛔ ຄ່າທຳນຽມຄ້າງເກີນຂີດຈຳກັດ — ຕ້ອງຈ່າຍກ່ອນ'); go('payFee'); return; }
    toast('⛔ ມີເອກະສານໝົດອາຍຸ — ຕໍ່ອາຍຸກ່ອນຈຶ່ງຮັບງານໄດ້'); go('docs'); },
  goOffline: () => { clearTimers(); navStop(); demo.online = false; demo.job = null; demo.status = 'idle';
    demo.screen = 'offline'; demo.back = []; logEv('driver.goOffline'); toast('⏸ ພັກແລ້ວ — ຢຸດຮັບງານຊົ່ວຄາວ'); },

  /* ---- ຄິວງານ ---- */
  goJobs:      () => { clearTimers(); go('jobList'); logEv('job.queue.view'); },
  jobFilter:   d => { demo.jobFilter = d.v; logEv('job.filter', d.v); },
  jobSort:     d => { demo.jobSort = d.v; logEv('job.sort', d.v); },
  refreshJobs: () => toast('ໂຫຼດຄິວງານໃໝ່ແລ້ວ'),
  openJob: d => {
    const j = jobById(d.v);
    if (!demo.settings.kinds[j.kind]){ toast('ທ່ານປິດຮັບງານປະເພດ “' + kindOf(j.kind).n + '” ຢູ່ — ເປີດໄດ້ໃນຕັ້ງຄ່າ'); return; }
    clearTimers();
    demo.job = j; demo.status = 'offered'; demo.popSec = CFG.jobPopSec; demo.bidPrice = j.offer;
    demo.back = []; demo.screen = j.kind === 'charter' ? 'charterJob' : j.kind === 'drivemine' ? 'driveMineJob' : 'jobOffer';
    logEv('job.view', j.id + ' · ' + kindOf(j.kind).n);
    if (demo.screen === 'jobOffer') runPop(); },
  declineJob: () => { clearTimers(); logEv('job.decline', demo.job && demo.job.id);
    toast('ປະຕິເສດແລ້ວ — ມີຜົນຕໍ່ອັດຕາຮັບງານ');
    demo.job = null; demo.status = 'idle'; demo.back = []; demo.screen = demo.online ? 'online' : 'offline'; },

  /* ---- ສະເໜີລາຄາ ---- */
  goBid:   () => { if (!demo.job) return; clearTimers(); demo.status = 'bidding'; demo.bidPrice = demo.bidPrice || demo.job.offer;
                   go('bid'); logEv('bid.open', money(demo.bidPrice)); },
  bidPlus: () => { if (!demo.job) return; demo.bidPrice = (demo.bidPrice || demo.job.offer) + CFG.priceStep; logEv('bid.change', money(demo.bidPrice)); },
  bidMinus:() => { if (!demo.job) return; const min = Math.max(CFG.minFare, demo.job.offer);
                   demo.bidPrice = Math.max(min, (demo.bidPrice || demo.job.offer) - CFG.priceStep); logEv('bid.change', money(demo.bidPrice)); },
  bidSet:  d => { demo.bidPrice = +d.v; logEv('bid.change', money(demo.bidPrice)); },
  submitBid: () => {
    if (!demo.job) return;
    if ((demo.bidPrice || 0) < CFG.minFare){ toast('ຕ່ຳກວ່າຂັ້ນຕ່ຳລະບົບ'); return; }
    clearTimers();
    demo.status = 'waiting'; demo.bidSec = CFG.bidWindowSec;
    demo.bidders = 4; demo.bidRank = demo.bidPrice === demo.job.offer ? 1 : 2;
    demo.back = []; demo.screen = 'bidWait';
    logEv('bid.submit', money(demo.bidPrice)); toast('ສົ່ງລາຄາແລ້ວ — ລໍລູກຄ້າຕັດສິນໃຈ');
    runBidWait(); },
  simWin:  () => winBid(),
  simLose: () => loseBid(),
  withdrawBid: () => { clearTimers(); navStop(); logEv('bid.withdraw'); toast('ຖອນລາຄາແລ້ວ');
    demo.job = null; demo.status = 'idle'; demo.back = []; demo.screen = 'online'; },

  /* ---- ງານພິເສດ ---- */
  goCharterJob:   () => { clearTimers(); go('charterJob'); },
  goDriveMineJob: () => { clearTimers(); go('driveMineJob'); },
  acceptCharter:  () => { if (!demo.job) return; clearTimers(); demo.status = 'assigned'; demo.bidPrice = demo.job.offer;
    demo.back = []; demo.screen = 'toPickup'; logEv('charter.accept', demo.job.id);
    toast('ຮັບງານເໝົາແລ້ວ — ລະບົບຈະເຕືອນກ່ອນເວລາ 1 ຊົ່ວໂມງ'); },
  acceptDriveMine: () => {
    if (!demo.job) return;
    if (!ME.manual && demo.job.myCar.trans === 'manual'){ toast('ທ່ານຍັງບໍ່ໄດ້ລົງທະບຽນຂັບເກຍທຳມະດາ'); return; }
    clearTimers(); demo.status = 'assigned'; demo.bidPrice = demo.job.offer;
    demo.back = []; demo.screen = 'toPickup'; logEv('drivemine.handover', demo.job.myCar.plate);
    toast('ຮັບມອບລົດແລ້ວ — ຂັບໄປສົ່ງລູກຄ້າໄດ້ເລີຍ'); },

  /* ---- ເດີນທາງ ---- */
  callPax:  () => toast('☎️ ໂທຜ່ານລະບົບ — ເບີຈິງຂອງທັງສອງຝ່າຍຖືກປົກປິດ'),
  /* ---- ແຊັດ realtime ---- */
  goChat:   () => { if (!demo.job) return;
    chatOpen(demo.job, demo.messages, () => paintState());
    go('chat'); logEv('chat.open', demo.job.pax + ' · ' + langOf(demo.job.paxLang || 'lo').n); },
  leaveChat:() => { chatLeave(); demo.screen = demo.back.pop() || 'onTrip'; },
  chatTr:   () => { const on = chatToggleTr(); logEv('chat.translate', on ? 'ເປີດ' : 'ປິດ');
    toast(on ? '🌐 ເປີດການແປອັດຕະໂນມັດ' : 'ປິດການແປ — ສະແດງຕົ້ນສະບັບ'); },
  openNav:  () => { logEv('trip.navigate', demo.settings.nav);
    toast('🧭 ສົ່ງເສັ້ນທາງໄປ ' + (demo.settings.nav === 'gmap' ? 'Google Maps' : demo.settings.nav === 'osm' ? 'OpenStreetMap' : 'ນຳທາງໃນແອັບ') + ' — ນຳທາງໃນແອັບຍັງແລ່ນຢູ່'); },
  quickMsg: d => { if (!demo.job) return;
    if (!CHAT.job) chatOpen(demo.job, demo.messages, () => paintState());
    chatSend(d.v);
    const to = demo.job.paxLang || 'lo';
    logEv('message.send', d.v + (to === 'lo' ? '' : ' → ' + langOf(to).n));
    if (demo.screen !== 'chat') toast('ສົ່ງໃຫ້ລູກຄ້າແລ້ວ' + (to === 'lo' ? '' : ' (ແປເປັນ' + langOf(to).n + ')')); },
  sendMsg:  () => {
    const el = document.getElementById('chatInput');
    const tx = (el && el.value || '').trim();
    if (!tx){ toast('ພິມຂໍ້ຄວາມກ່ອນ'); return; }
    if (el) el.value = '';
    chatSend(tx);
    const to = demo.job ? (demo.job.paxLang || 'lo') : 'lo';
    logEv('message.send', tx + (to === 'lo' ? '' : ' → ' + langOf(to).n)); },
  shareLoc: () => { if (!demo.job) return;
    if (!CHAT.job) chatOpen(demo.job, demo.messages, () => paintState());
    chatSend('ຕຳແໜ່ງປັດຈຸບັນຂອງຂ້ອຍ 📍');
    logEv('location.share'); toast('ສົ່ງຕຳແໜ່ງໃຫ້ລູກຄ້າແລ້ວ'); },

  arrivePickup: () => { if (!demo.job) return; clearTimers(); navStop(); demo.status = 'arrived'; demo.waitSec = 0;
    demo.back = []; demo.screen = 'arrived'; logEv('trip.arrived', demo.job.from.name);
    toast('ແຈ້ງລູກຄ້າແລ້ວວ່າທ່ານຮອດຈຸດຮັບ'); runWait(); },
  waitMore: () => toast('ຍັງຍົກເລີກຟຣີບໍ່ໄດ້ — ຕ້ອງລໍໃຫ້ຄົບ 10 ນາທີກ່ອນ'),
  startTrip: () => { if (!demo.job) return; clearTimers(); demo.status = 'onTrip'; demo.tripSec = 0;
    demo.back = []; demo.screen = 'onTrip'; logEv('trip.start', demo.job.id);
    navFor('onTrip');
    if (waitFeeOf(demo.waitSec)) logEv('trip.wait.fee', money(waitFeeOf(demo.waitSec)));
    toast('ເລີ່ມການເດີນທາງ — ຂັບປອດໄພເດີ້'); },
  addStop: () => { demo.stops = (demo.stops || 0) + 1; logEv('trip.stop.add', demo.stops + ' ຈຸດ');
    toast('ເພີ່ມຈຸດແວ່ — ບວກ ' + money(10000) + ' ເຂົ້າຄ່າໂດຍສານ'); },
  shareTrip: () => { demo.sharing = true; logEv('safety.share'); toast('🛡 ແບ່ງປັນຖ້ຽວນີ້ກັບສູນຄວບຄຸມແລ້ວ'); },
  completeTrip: () => { if (!demo.job) return; clearTimers(); navStop(); demo.status = 'collect';
    demo.payMethod = demo.job.pay === 'cash' ? 'cash' : 'wallet';
    demo.tip = demo.job.pay === 'cash' ? 5000 : 0;
    demo.back = []; demo.screen = 'collect'; logEv('trip.complete', demo.job.id); },

  /* ---- ຮັບເງິນ ---- */
  payMethod: d => { demo.payMethod = d.v; logEv('payment.method', d.v); },
  /* ---------- ບັນຊີຮັບເງິນ QR — ຄົນຂັບເພີ່ມ / ແກ້ / ລຶບ ເອງ ---------- */
  goPayQR: () => go('payqr'),

  payqrToggle: () => {
    const on = !pqOn(demo);
    demo.payqr = { ...(demo.payqr || PAYQR), on };
    if (!on && demo.payMethod === 'qr') demo.payMethod = 'cash';
    logEv('payqr.toggle', on ? 'ເປີດຮັບ QR' : 'ປິດຮັບ QR');
  },

  /* ເປີດຟອມ: ເພີ່ມໃໝ່ */
  payqrAdd: () => {
    demo.qrEdit = { id:null, bankKey:'bcel', acc:'', holder:'', nick:'',
                    way:'manual', primary:pqList(demo).length === 0, img:null };
    demo.kb = null;
    logEv('payqr.add', 'ເປີດຟອມເພີ່ມບັນຊີ');
    go('payqrEdit');
  },
  /* ເປີດຟອມ: ແກ້ບັນຊີເກົ່າ */
  payqrEditOpen: d => {
    const q = pqById(demo, d && d.v);
    if (!q) return;
    demo.qrEdit = { ...q, way:q.src === 'image' ? 'image' : 'manual', img:q.src === 'image' };
    demo.kb = null;
    logEv('payqr.edit', bankByKey(q.bankKey).n + ' ' + q.acc);
    go('payqrEdit');
  },
  payqrWay: d => {
    if (!demo.qrEdit || !d || (d.v !== 'manual' && d.v !== 'image')) return;
    demo.qrEdit = { ...demo.qrEdit, way:d.v };
  },
  /* ຈຳລອງການອ່ານຄ່າອອກຈາກຮູບ QR ທີ່ອັບໂຫຼດ */
  payqrUpload: () => {
    if (!demo.qrEdit) return;
    const n = (demo.qrEdit.upN || 0) % QR_UPLOADS.length;
    const u = QR_UPLOADS[n];
    demo.qrEdit = { ...demo.qrEdit, ...u, img:true, way:'image', upN:n + 1 };
    logEv('payqr.upload', 'ອ່ານຮູບໄດ້ · ' + bankByKey(u.bankKey).n + ' ' + u.acc);
    toast('ອ່ານຮູບ QR ສຳເລັດ — ກວດຂໍ້ມູນແລ້ວກົດບັນທຶກ');
  },
  payqrBank: d => {
    const k = d && d.v;
    if (!demo.qrEdit || !k || !BANKS.some(b => b.k === k)) return;
    demo.qrEdit = { ...demo.qrEdit, bankKey:k };
  },
  payqrPrimaryDraft: () => {
    if (!demo.qrEdit) return;
    demo.qrEdit = { ...demo.qrEdit, primary:!demo.qrEdit.primary };
  },
  /* ຕັ້ງບັນຊີຫຼັກຈາກລາຍການ */
  payqrPrimary: d => {
    const id = d && d.v;
    if (!pqById(demo, id)) return;
    demo.payqrs = pqList(demo).map(q => ({ ...q, primary:q.id === id }));
    logEv('payqr.primary', bankByKey(pqById(demo, id).bankKey).n);
    toast('ຕັ້ງເປັນບັນຊີຫຼັກແລ້ວ');
  },
  payqrDelete: d => {
    const id = d && d.v, q = pqById(demo, id);
    if (!q) return;
    const rest = pqList(demo).filter(x => x.id !== id);
    if (!rest.length){ toast('ຕ້ອງເຫຼືອຢ່າງໜ້ອຍ 1 ບັນຊີ'); return; }
    if (q.primary) rest[0] = { ...rest[0], primary:true };
    demo.payqrs = rest;
    logEv('payqr.delete', bankByKey(q.bankKey).n + ' ' + q.acc);
    toast('ລຶບບັນຊີແລ້ວ');
    if (demo.screen === 'payqrEdit'){ demo.qrEdit = null; demo.kb = null; ACTIONS.goBack(); }
  },
  payqrSave: () => {
    const d = demo.qrEdit;
    if (!d){ toast('ບັນທຶກຮູບ QR ແລ້ວ'); return; }        /* ກົດຈາກ D43 = ບັນທຶກຮູບ */
    if (!accOk(d.acc)){ toast('ເລກບັນຊີສັ້ນເກີນໄປ'); return; }
    if (String(d.holder || '').trim().length < 3){ toast('ໃສ່ຊື່ເຈົ້າຂອງບັນຊີກ່ອນ'); return; }
    const list = pqList(demo);
    const old  = d.id ? pqById(demo, d.id) : null;
    /* ຊື່ ຫຼື ເລກບັນຊີປ່ຽນ → ຕ້ອງຢືນຢັນຄືນ */
    const same = old && old.acc === d.acc && old.holder === d.holder && old.bankKey === d.bankKey;
    const rec = { id:d.id || newQrId(list), bankKey:d.bankKey, acc:d.acc, holder:d.holder,
      nick:d.nick || '', src:d.img ? 'image' : 'manual',
      verified:same ? old.verified : false, primary:!!d.primary,
      updated:'ດຽວນີ້', scans30:old ? old.scans30 : 0, recv30:old ? old.recv30 : 0 };
    let next = old ? list.map(q => q.id === rec.id ? rec : q) : [...list, rec];
    if (rec.primary) next = next.map(q => ({ ...q, primary:q.id === rec.id }));
    else if (!next.some(q => q.primary)) next = next.map((q, k) => ({ ...q, primary:k === 0 }));
    demo.payqrs = next;
    demo.qrEdit = null; demo.kb = null;
    logEv('payqr.save', (old ? 'ແກ້ໄຂ · ' : 'ເພີ່ມ · ') + bankByKey(rec.bankKey).n + ' ' + rec.acc);
    toast(old ? 'ບັນທຶກການແກ້ໄຂແລ້ວ' : 'ເພີ່ມບັນຊີແລ້ວ — ລູກຄ້າສະແກນຈ່າຍໄດ້ເລີຍ');
    ACTIONS.goBack();
  },
  payqrShare: () => { logEv('payqr.share', 'ແບ່ງປັນ QR'); toast('ແບ່ງປັນ QR ບັນຊີຮັບເງິນ'); },

  /* ---------- ແປ້ນພິມໃນແອັບ ---------- */
  kbOpen: d => {
    const f = d && d.v;
    if (!demo.qrEdit || !KB_MAX[f]) return;
    demo.kb = { field:f, val:String(demo.qrEdit[f] || ''), lao:f === 'nick' };
  },
  kbKey: d => {
    const k = demo.kb, c = d && d.v;
    if (!k || c === undefined || c === null) return;
    const max = KB_MAX[k.field] || 24;
    const raw = String(k.val || '');
    if (k.field === 'acc'){
      if (!/^[0-9]$/.test(c)) return;
      const digits = raw.replace(/\D/g, '');
      if (digits.length >= (KB_MAX.acc || 20)) return;
      demo.kb = { ...k, val:fmtAcc(digits + c) };
    } else {
      if (raw.length >= max) return;
      demo.kb = { ...k, val:raw + c };
    }
  },
  kbDel: () => {
    const k = demo.kb;
    if (!k) return;
    const raw = String(k.val || '');
    demo.kb = { ...k, val:k.field === 'acc' ? fmtAcc(raw.replace(/\D/g, '').slice(0, -1)) : raw.slice(0, -1) };
  },
  kbClear: () => { if (demo.kb) demo.kb = { ...demo.kb, val:'' }; },
  kbLang:  () => { if (demo.kb) demo.kb = { ...demo.kb, lao:!demo.kb.lao }; },
  kbClose: () => { demo.kb = null; },
  kbDone: () => {
    const k = demo.kb;
    if (!k || !demo.qrEdit) { demo.kb = null; return; }
    let v = String(k.val || '').trim();
    if (k.field === 'holder') v = v.toUpperCase();
    demo.qrEdit = { ...demo.qrEdit, [k.field]:v };
    demo.kb = null;
    logEv('payqr.input', k.field + ' = ' + (v || '(ຫວ່າງ)'));
  },

  collectPay: () => {
    if (!demo.job || demo.collected) return;
    const j = demo.job, fare = jobFare(demo) + (demo.stops || 0) * 10000, tip = demo.tip || 0;
    demo.collected = true;
    const comm = feeOf(fare);
    const route = carByKey(j.car).name + ' · ' + j.from.name + ' → ' + j.to.name;
    /* ເງິນເຂົ້າລະບົບມີທາງດຽວ: ລູກຄ້າຈ່າຍ “ຜ່ານກະເປົາ”
       ເງິນສົດ → ມືຄົນຂັບ · QR → ບັນຊີທະນາຄານຄົນຂັບໂດຍກົງ (ທັງສອງບໍ່ຜ່ານລະບົບ) */
    if (demo.payMethod === 'wallet'){
      demo.wallet = { ...demo.wallet, balance:walBal(demo) + fare + tip };
      demo.walTx = [{ id:'wi' + demo.walTx.length, kind:'in', t:'ຄ່າໂດຍສານ · ' + route,
        s:'ລູກຄ້າຈ່າຍຜ່ານກະເປົາເງິນ', date:'ດຽວນີ້', amt:fare + tip }, ...demo.walTx];
      logEv('payment.wallet', money(fare + tip) + ' → ກະເປົາໃນແອັບ');
    } else if (demo.payMethod === 'qr'){
      const p = pq(demo);
      demo.payqr = { ...p, scans30:(p.scans30 || 0) + 1, recv30:(p.recv30 || 0) + fare + tip };
      logEv('payment.qr.direct', money(fare + tip) + ' → ' + bankByKey(p.bankKey).n + ' ' + p.acc + ' (ບໍ່ຜ່ານລະບົບ)');
    } else {
      logEv('payment.cash.direct', money(fare + tip) + ' → ມືຄົນຂັບ (ບໍ່ຜ່ານລະບົບ)');
    }
    /* ຄ່າທຳນຽມ: ຫັກຈາກກະເປົາຖ້າເປີດອັດຕະໂນມັດ ແລະ ຍອດພໍ · ບໍ່ດັ່ງນັ້ນເຂົ້າຍອດຄ້າງ */
    if (walAuto(demo) && walBal(demo) >= comm){
      demo.wallet = { ...demo.wallet, balance:walBal(demo) - comm };
      demo.walTx = [{ id:'wf' + demo.walTx.length, kind:'fee', t:'ຫັກຄ່າທຳນຽມບໍລິການ',
        s:'ອັດຕະໂນມັດ · ຖ້ຽວ ' + j.id, date:'ດຽວນີ້', amt:-comm }, ...demo.walTx];
      logEv('fee.autopay', money(comm) + ' ຫັກຈາກກະເປົາ');
    } else {
      demo.fees = [{ id:'f' + demo.fees.length + 1, job:j.id, tx:route, time:'ດຽວນີ້', fare, amt:comm }, ...demo.fees];
      logEv('fee.accrue', money(comm));
    }
    logEv('payment.collect', money(fare + tip) + ' · ' + payName(demo.payMethod) + ' → ' + payDest(demo.payMethod));
    toast(demo.payMethod === 'cash'
      ? '💵 ຮັບເງິນສົດ ' + money(fare + tip) + ' — ຄ່າທຳນຽມ ' + money(comm) + (walAuto(demo) && walBal(demo) >= 0 ? ' ຫັກຈາກກະເປົາ' : ' ເຂົ້າຍອດຄ້າງ')
      : '✅ ເງິນ ' + money(fare + tip) + ' ເຂົ້າກະເປົາແລ້ວ — ຫັກຄ່າທຳນຽມ ' + money(comm));
    demo.today = { ...demo.today, trips:demo.today.trips + 1, fare:demo.today.fare + fare, tips:demo.today.tips + tip };
    demo.status = 'rated'; demo.back = []; demo.screen = 'ratePax';
    logEv('trip.settled', money(earnOf(fare) + tip) + ' ເຂົ້າລາຍໄດ້'); },

  /* ---- ຄະແນນລູກຄ້າ ---- */
  ratePax: d => { demo.paxRating = +d.v; demo.paxTags = []; logEv('pax.rate', d.v + ' ດາວ'); },
  paxTag:  d => { const t = demo.paxTags || [];
    demo.paxTags = t.includes(d.v) ? t.filter(x => x !== d.v) : [...t, d.v]; },
  reportPax: () => { logEv('pax.report'); toast('ສົ່ງລາຍງານໃຫ້ສູນຄວບຄຸມແລ້ວ'); },
  finishJob: () => {
    if (!demo.job) return;
    clearTimers(); chatStop();
    const j = demo.job, fare = jobFare(demo) + (demo.stops || 0) * 10000;
    demo.trips = [{ id:j.id, date:'ດຽວນີ້', kind:j.kind, from:j.from.name, to:j.to.name, pax:j.pax,
      fare, fee:feeOf(fare), tip:demo.tip || 0, km:j.km, min:j.min,
      pay:demo.payMethod === 'cash' ? 'ເງິນສົດ' : demo.payMethod === 'qr' ? 'QR' : 'ກະເປົາເງິນ',
      rating:0, status:'done' }, ...demo.trips];
    demo.notifs = [{ id:'nj' + demo.notifs.length, ic:'coins', unread:true, time:'ດຽວນີ້',
      title:'ລາຍໄດ້ເຂົ້າແລ້ວ ' + money(earnOf(fare) + (demo.tip || 0)),
      body:j.from.name + ' → ' + j.to.name }, ...demo.notifs];
    logEv('job.next', 'ຈົບງານ ' + j.id);
    Object.assign(demo, { job:null, status:'idle', bidPrice:null, waitSec:0, tripSec:0, stops:0,
      messages:[], payMethod:null, tip:0, collected:false, paxRating:0, paxTags:[], reason:null });
    demo.back = []; demo.screen = demo.online ? 'online' : 'offline';
    toast('ຈົບງານແລ້ວ ✅ ພ້ອມຮັບງານຕໍ່'); },

  /* ---- ຍົກເລີກ ---- */
  goCancel:   () => { clearTimers(); navStop(); go('cancel'); },
  pickReason: d => { const r = reasonById(d.v); if (!r) return; demo.reason = d.v; logEv('trip.cancel.reason', r.tx); },
  confirmCancel: () => {
    const r = reasonById(demo.reason);
    if (!r) return;
    clearTimers(); chatStop();
    logEv('trip.cancel.confirm', r.tx + (r.free ? ' (ບໍ່ຫັກ)' : ' (ຫັກ ' + money(CFG.cancelPenalty) + ')'));
    toast(r.free ? 'ຍົກເລີກແລ້ວ — ບໍ່ມີຜົນຕໍ່ຄະແນນຂອງທ່ານ'
                 : '⚠️ ຍົກເລີກແລ້ວ — ຫັກ ' + money(CFG.cancelPenalty) + ' ແລະ ມີຜົນຕໍ່ອັດຕາຮັບງານ');
    Object.assign(demo, { job:null, status:'idle', bidPrice:null, waitSec:0, tripSec:0, stops:0, messages:[], reason:null });
    demo.back = []; demo.screen = demo.online ? 'online' : 'offline'; },

  /* ---- ລາຍໄດ້ ---- */
  earnPeriod: d => { demo.earnKey = d.v; logEv('earnings.period', d.v); },
  goPayFee:     () => { demo.payAmt = feeTotal(demo); go('payFee'); logEv('fee.pay.open', money(feeTotal(demo))); },

  /* ---- ກະເປົາເງິນ (D29–D31) ---- */
  goWallet:   () => { demo.back = []; demo.screen = 'wallet'; logEv('wallet.view', money(walBal(demo))); },
  goTopup:    () => { demo.topupAmt = demo.topupAmt || 200000; go('topup'); logEv('topup.open'); },
  goWithdraw: () => { demo.wdAmt = Math.min(walFree(demo), 500000); go('withdraw'); logEv('withdraw.open', money(walFree(demo))); },
  walFilter:  d => { demo.walFilter = d.v; },
  walAuto:    () => { demo.wallet = { ...demo.wallet, autoFee:!walAuto(demo) };
    logEv('wallet.autofee', walAuto(demo) ? 'ເປີດ' : 'ປິດ');
    toast(walAuto(demo) ? '⚙️ ຫັກຄ່າທຳນຽມຈາກກະເປົາອັດຕະໂນມັດ' : 'ປິດການຫັກອັດຕະໂນມັດ — ຕ້ອງຈ່າຍເອງ'); },
  /* ເຕີມເງິນ */
  topupAmt:   d => { demo.topupAmt = +d.v; },
  topupPlus:  () => { demo.topupAmt = (demo.topupAmt || 0) + 50000; },
  topupMinus: () => { demo.topupAmt = Math.max(10000, (demo.topupAmt || 0) - 50000); },
  topupWay:   d => { demo.topupWay = d.v; },
  confirmTopup: () => {
    const amt = demo.topupAmt || 0; if (amt < 10000) return;
    const way = TOPUP_WAYS.find(w => w.k === (demo.topupWay || 'qr')) || TOPUP_WAYS[0];
    demo.wallet = { ...demo.wallet, balance:walBal(demo) + amt };
    demo.walTx = [{ id:'wt' + demo.walTx.length, kind:'topup', t:'ເຕີມເງິນຜ່ານ ' + way.n,
      s:'ສຳເລັດ', date:'ດຽວນີ້', amt }, ...demo.walTx];
    logEv('topup.confirm', money(amt) + ' · ' + way.k);
    toast('✅ ເຕີມເງິນ ' + money(amt) + ' ສຳເລັດ — ຍອດ ' + money(walBal(demo)));
    demo.screen = demo.back.pop() || 'wallet'; },
  /* ຖອນເງິນ */
  wdAmt:   d => { demo.wdAmt = Math.min(walFree(demo), +d.v); },
  wdPlus:  () => { demo.wdAmt = Math.min(walFree(demo), (demo.wdAmt || 0) + 50000); },
  wdMinus: () => { demo.wdAmt = Math.max(0, (demo.wdAmt || 0) - 50000); },
  confirmWithdraw: () => {
    const amt = demo.wdAmt || 0;
    if (amt < WALLET.minWithdraw || amt > walFree(demo)) return;
    demo.wallet = { ...demo.wallet, balance:walBal(demo) - amt };
    demo.walTx = [{ id:'ww' + demo.walTx.length, kind:'out',
      t:'ຖອນເຂົ້າ ' + WALLET.bank.name + ' ···' + WALLET.bank.last,
      s:'ກຳລັງດຳເນີນ · ຄ່າທຳນຽມ ' + WALLET.withdrawFee.toLocaleString(), date:'ດຽວນີ້', amt:-amt }, ...demo.walTx];
    demo.notifs = [{ id:'nw' + demo.notifs.length, ic:'coins', unread:true, time:'ດຽວນີ້',
      title:'ຖອນເງິນສຳເລັດ', body:money(amt - WALLET.withdrawFee) + ' ເຂົ້າ ' + WALLET.bank.name + ' ···' + WALLET.bank.last }, ...demo.notifs];
    demo.wdAmt = 0;
    logEv('withdraw.confirm', money(amt));
    toast('🏦 ຖອນ ' + money(amt - WALLET.withdrawFee) + ' — ' + WALLET.withdrawEta);
    demo.screen = demo.back.pop() || 'wallet'; },
  goFeeHistory: () => go('feeHistory'),
  goPerformance:() => { demo.back = []; demo.screen = 'performance'; },
  payPlus:  () => { demo.payAmt = Math.min(feeTotal(demo), (demo.payAmt || 0) + 10000); },
  payMinus: () => { demo.payAmt = Math.max(0, (demo.payAmt || 0) - 10000); },
  payAll:   () => { demo.payAmt = feeTotal(demo); },
  payVia:   d => { demo.payVia = d.v; },
  confirmPay: () => {
    const amt = demo.payAmt || 0; if (!amt) return;
    let left = amt;
    demo.fees = demo.fees.filter(c => { if (left >= c.amt){ left -= c.amt; return false; } return true; });
    if (left > 0 && demo.fees.length) demo.fees[0] = { ...demo.fees[0], amt:demo.fees[0].amt - left };
    if (demo.payVia === 'wallet'){
      demo.wallet = { ...demo.wallet, balance:walBal(demo) - amt };
      demo.walTx = [{ id:'wp' + demo.walTx.length, kind:'fee', t:'ຈ່າຍຄ່າທຳນຽມຈາກກະເປົາ',
        s:'ຈ່າຍເອງ', date:'ດຽວນີ້', amt:-amt }, ...demo.walTx];
    }
    demo.notifs = [{ id:'nf' + demo.notifs.length, ic:'ok', unread:true, time:'ດຽວນີ້',
      title:'ຈ່າຍຄ່າທຳນຽມສຳເລັດ', body:money(amt) + ' ຜ່ານ ' + (PAY_WAYS.find(p => p.k === demo.payVia) || {}).n }, ...demo.notifs];
    demo.payAmt = 0;
    logEv('fee.pay.confirm', money(amt) + ' · ' + demo.payVia);
    toast('✅ ຈ່າຍ ' + money(amt) + ' ສຳເລັດ — ຄ່າທຳນຽມຄ້າງເຫຼືອ ' + money(feeTotal(demo)));
    demo.screen = demo.back.pop() || 'earnings'; },

  /* ---- ຜົນງານ & ປະຫວັດ ---- */
  goReviews:  () => go('reviews'),
  revFilter:  d => { demo.revFilter = +d.v; },
  histFilter: d => { demo.histFilter = d.v; },
  openTrip:   d => { demo.openTripId = d.v; go('historyDetail'); logEv('history.open', d.v); },


  /* ---- ລົດ & ເອກະສານ ---- */
  goMyCar: () => go('myCar'),
  goDocs:  () => go('docs'),

  /* ---- ຂ່າວ & ຄວາມປອດໄພ ---- */
  goNotifs:  () => go('notifications'),
  readNotif: d => { const n = demo.notifs.find(x => x.id === d.v); if (n) n.unread = false; logEv('notif.read', d.v); },
  readAll:   () => { demo.notifs.forEach(n => n.unread = false); logEv('notif.readAll'); toast('ໝາຍວ່າອ່ານທັງໝົດແລ້ວ'); },
  goAnnounce:() => go('announce'),
  openAnn:   d => { demo.openAnn = demo.openAnn === d.v ? null : d.v; logEv('announce.open', d.v); },
  goSafety:  () => go('safety'),
  sos:       () => { demo.sos = !demo.sos; logEv('safety.sos', demo.sos ? 'ສົ່ງແລ້ວ' : 'ຍົກເລີກ');
    toast(demo.sos ? '🚨 ສົ່ງ SOS ພ້ອມຕຳແໜ່ງໃຫ້ສູນຄວບຄຸມແລ້ວ' : 'ຍົກເລີກ SOS ແລ້ວ'); },
  toggleShare:() => { demo.sharing = !demo.sharing; logEv('safety.share', String(demo.sharing)); },
  toggleRec:  () => { demo.recording = !demo.recording; logEv('safety.record', String(demo.recording));
    toast(demo.recording ? '🎙 ເລີ່ມບັນທຶກສຽງໃນລົດ' : 'ຢຸດບັນທຶກ'); },

  /* ---- ບັນຊີ & ຕັ້ງຄ່າ ---- */
  goSettings: () => go('settings'),
  setNav:     d => { demo.settings = { ...demo.settings, nav:d.v }; logEv('settings.nav', d.v); },
  toggle:     d => { demo.settings = { ...demo.settings, [d.v]:!demo.settings[d.v] }; logEv('settings.toggle', d.v); },
  toggleKind: d => { const k = { ...demo.settings.kinds }; k[d.v] = !k[d.v];
    demo.settings = { ...demo.settings, kinds:k }; logEv('settings.jobKind', d.v + (k[d.v] ? ' ເປີດ' : ' ປິດ'));
    toast((k[d.v] ? 'ເປີດ' : 'ປິດ') + 'ຮັບງານ “' + kindOf(d.v).n + '”'); },
  faqOpen:    d => { demo.faqOpen = demo.faqOpen === +d.v ? -1 : +d.v; logEv('faq.open', d.v); },
  logout:     () => { clearTimers(); navStop(); chatStop(); const lg = demo.log;
    demo = { ...structuredClone(BASE), screen:'login', log:lg }; logEv('auth.logout'); }
};

/* ---------------- dispatch ---------------- */
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if (!el) return;
  const fn = ACTIONS[el.dataset.act];
  if (!fn) return;
  fn(el.dataset);
  paintDemo();
});

let toastT;
function toast(msg){
  const t = $('#toast'); if (!t) return;
  t.textContent = msg; t.hidden = false;
  clearTimeout(toastT); toastT = setTimeout(() => t.hidden = true, 2600);
}

/* ============================================================
   VIEW 4 · ຂັ້ນຕອນການໄຫຼ
   ============================================================ */
function viewFlow(){
  const W = 152, H = 54, GAP = 178;
  const main = ['apply','login','online','jobOffer','bid','bidWait','toPickup','arrived','onTrip','collect','ratePax'];
  const pos = {};
  main.forEach((k, i) => pos[k] = { x:20 + i * GAP, y:40 });
  pos.applyVerify = { x:pos.apply.x,    y:170, cls:'branch' };
  pos.chat        = { x:pos.onTrip.x,   y:170, cls:'branch' };
  pos.charterJob  = { x:pos.jobOffer.x, y:170, cls:'branch' };
  pos.driveMineJob= { x:pos.bid.x,      y:170, cls:'branch' };
  pos.cancel      = { x:pos.arrived.x,  y:300, cls:'danger' };
  pos.payFee      = { x:pos.collect.x,  y:170, cls:'branch' };
  pos.ratePax.cls = 'done';

  const node = k => { const s = screenByKey(k), p = pos[k];
    return `<g class="fnode ${p.cls || ''}" data-k="${k}">
      <rect x="${p.x}" y="${p.y}" width="${W}" height="${H}"/>
      <text class="fid" x="${p.x + 11}" y="${p.y + 19}">${s.id}</text>
      <text class="fnm" x="${p.x + 11}" y="${p.y + 39}">${s.lo.length > 17 ? s.lo.slice(0, 16) + '…' : s.lo}</text></g>`; };
  const hEdge = (a, b) => `<path class="fedge" d="M${pos[a].x + W} ${pos[a].y + H/2} H${pos[b].x - 6}"/>`;
  const vEdge = (a, b, cls='dash') => { const A = pos[a], B = pos[b];
    return `<path class="fedge ${cls}" d="M${A.x + W/2} ${A.y + H} C${A.x + W/2} ${A.y + H + 40}, ${B.x + W/2} ${B.y - 40}, ${B.x + W/2} ${B.y - 6}"/>`; };

  let edges = '';
  for (let i = 0; i < main.length - 1; i++) edges += hEdge(main[i], main[i + 1]);
  edges += vEdge('onTrip', 'chat') + vEdge('jobOffer', 'charterJob') + vEdge('bid', 'driveMineJob')
         + vEdge('collect', 'payFee') + vEdge('apply', 'applyVerify');
  edges += `<path class="fedge red" d="M${pos.arrived.x + W/2} ${pos.arrived.y + H} C${pos.arrived.x + W/2} 200, ${pos.cancel.x} 250, ${pos.cancel.x + W/2} ${pos.cancel.y - 6}"/>`;
  edges += `<path class="fedge red" d="M${pos.cancel.x + W/2} ${pos.cancel.y + H} V385 H${pos.online.x + W/2} V${pos.online.y + H + 6}"/>`;
  edges += `<path class="fedge dash" d="M${pos.ratePax.x + W/2} ${pos.ratePax.y - 6} V16 H${pos.online.x + W/2} V${pos.online.y - 6}"/>`;
  const labels = `<text class="flabel" x="${pos.applyVerify.x + 4}" y="160">ຢືນຢັນຕົວຕົນ</text>
    <text class="flabel" x="${pos.chat.x + 4}" y="160">ໜ້າຍ່ອຍ</text>
    <text class="flabel" x="${pos.charterJob.x + 4}" y="160">ໃບງານພິເສດ</text>
    <text class="flabel" x="${pos.driveMineJob.x + 4}" y="160">ໃບງານພິເສດ</text>
    <text class="flabel" x="${pos.payFee.x + 4}" y="160">ຄ່າທຳນຽມສະສົມ</text>
    <text class="flabel" x="${pos.cancel.x + 16}" y="${pos.cancel.y - 10}">ຍົກເລີກໄດ້ກ່ອນເລີ່ມຖ້ຽວ</text>
    <text class="flabel" x="${pos.online.x + W + 20}" y="378">ກັບໄປລໍງານໃໝ່</text>
    <text class="flabel" x="${pos.online.x + W + 200}" y="12">ຈົບງານ → ພ້ອມຮັບງານຕໍ່</text>`;

  view.innerHTML = `
    <h1 class="h1">ຂັ້ນຕອນການໄຫຼ (ຝັ່ງຄົນຂັບ)</h1>
    <p class="sub">ເສັ້ນທຶບ = ເສັ້ນທາງຫຼັກ · ເສັ້ນຂີດ = ໜ້າຍ່ອຍ/ໃບງານພິເສດ · ເສັ້ນແດງ = ການຍົກເລີກ. ກົດທີ່ກ່ອງເພື່ອເປີດລາຍລະອຽດ.</p>
    <div class="flowwrap"><svg width="2140" height="420" viewBox="0 0 2140 420">
      <defs>
        <marker id="arw" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0 0l8 4.5L0 9z" fill="#3a5c75"/></marker>
        <marker id="arwv" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0 0l8 4.5L0 9z" fill="#6a4f78"/></marker>
        <marker id="arwr" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0 0l8 4.5L0 9z" fill="#8d3b41"/></marker>
      </defs>
      ${edges}${labels}${Object.keys(pos).map(node).join('')}
    </svg></div>
    <div class="grid g3" style="margin-top:20px">
      <div class="panel"><h3>ສະຖານະງານ (ຝັ່ງຄົນຂັບ)</h3>
        <div class="chips">${['idle','offered','bidding','waiting','assigned','arrived','onTrip','collect','rated']
          .map(x => `<span class="chip b">${x}</span>`).join('')}</div>
        <p class="note" style="margin-top:12px">ຍິງຜ່ານ <code>/ws/driver/{id}</code> ແລະ <code>/ws/booking/{id}</code> ຊຸດດຽວກັນກັບແອັບລູກຄ້າ.</p></div>
      <div class="panel"><h3>ກົດເກນສຳຄັນ</h3><ul class="ul">
        <li>ຢືນຢັນຕົວຕົນຄົບ 3 ຂັ້ນ ຈຶ່ງສົ່ງໃບລົງທະບຽນໄດ້</li>
        <li>ຄ່າທຳນຽມຄ້າງເກີນ ${money(CFG.feeDueLimit)} → ຢຸດສົ່ງງານໃໝ່</li>
        <li>ເອກະສານໝົດອາຍຸ → ອອນລາຍບໍ່ໄດ້</li>
        <li>ລາຄາຕ່ຳກວ່າ ${money(CFG.minFare)} ສະເໜີບໍ່ໄດ້</li>
        <li>ຍົກເລີກດ້ວຍເຫດຜົນທີ່ບໍ່ແມ່ນຄວາມຜິດຄົນຂັບ → ບໍ່ຫັກຄະແນນ</li>
        <li>ປິດຮັບງານບາງປະເພດ ບໍ່ນັບເປັນການປະຕິເສດ</li></ul></div>
      <div class="panel"><h3>ກໍລະນີຜິດພາດທີ່ຕ້ອງອອກແບບ</h3><ul class="ul">
        <li>ໝົດເວລາ ${CFG.jobPopSec} ວິນາທີ → ງານໄປຫາຄົນຂັບຄົນອື່ນ</li>
        <li>ຢືນຢັນໃບໜ້າບໍ່ຕົງກັບບັດ → ຕ້ອງຖ່າຍໃໝ່</li>
        <li>ລູກຄ້າເລືອກຄົນອື່ນ / ຍົກເລີກລະຫວ່າງລໍ</li>
        <li>ລູກຄ້າບໍ່ມາ → ລໍຄົບ 10 ນາທີ ຍົກເລີກຟຣີ</li>
        <li>ເນັດຫຼຸດລະຫວ່າງຖ້ຽວ → ຕ້ອງ queue event ໄວ້ສົ່ງພາຍຫຼັງ</li>
        <li>ແອັບຖືກ OS ຂ້າ → ຕ້ອງມີ foreground service</li>
        <li>ຮັບເງິນສົດແລ້ວແອັບປິດ → ຕ້ອງ reconcile ຄ່າທຳນຽມຕອນເປີດໃໝ່</li></ul></div>
    </div>`;
  view.insertAdjacentHTML('beforeend', `
    <h1 class="h1" style="margin-top:30px">ແຜນທີ່ໜ້າຈໍທັງແອັບ · ${SCREENS.length} ໜ້າ</h1>
    <p class="sub">ຈັດເປັນ ${STEP_GROUPS.length} ກຸ່ມ — ກົດທີ່ຊື່ໜ້າຈໍເພື່ອເປີດເບິ່ງ.</p>
    <div class="grid" id="sitemap" style="grid-template-columns:repeat(auto-fill,minmax(250px,1fr))">
      ${STEP_GROUPS.map(gr => `<div class="panel"><h3>${gr.g} · ${gr.items.length} ໜ້າ</h3>
        <div class="chips">${gr.items.map(x => `<span class="chip b" data-k="${x.key}" style="cursor:pointer">${x.id} · ${x.lo}</span>`).join('')}</div></div>`).join('')}
    </div>`);
  $$('.fnode').forEach(n => n.onclick = () => openModal(n.dataset.k));
  $$('#sitemap [data-k]').forEach(n => n.onclick = () => openModal(n.dataset.k));
}

/* ============================================================
   VIEW 5 · ສະເປັກ
   ============================================================ */
function viewSpec(){
  const api = [...new Set(SCREENS.flatMap(s => s.api))];
  const events = [...new Set(SCREENS.flatMap(s => s.events))];
  view.innerHTML = `
    <h1 class="h1">ສະເປັກສຳລັບນັກພັດທະນາ</h1>
    <p class="sub">ຕາຕະລາງ route, event ແລະ API ຂອງທຸກໜ້າຈໍ — ໃຊ້ເປັນເອກະສານສົ່ງມອບ (handoff) ໄດ້ເລີຍ.</p>
    <div class="panel scrollx" style="margin-bottom:18px">
      <table class="tbl">
        <thead><tr><th>ລະຫັດ</th><th>ໜ້າຈໍ</th><th>ເສັ້ນທາງ</th><th>ເຫດການ</th><th>API</th><th>ສະຖານະຫຼັກ</th></tr></thead>
        <tbody>${SCREENS.map(s => `<tr>
          <td class="mono">${s.id}</td>
          <td><b>${s.lo}</b><br><span style="color:var(--muted);font-size:11px">${s.group} · ${s.key}</span></td>
          <td class="mono">${s.route}</td>
          <td>${s.events.map(e => `<code>${e}</code>`).join('<br>')}</td>
          <td>${s.api.map(a => `<code>${a}</code>`).join('<br>')}</td>
          <td style="font-size:11px;color:var(--muted)">${s.states.join(' · ')}</td>
        </tr>`).join('')}</tbody>
      </table>
    </div>
    <div class="grid g2">
      <div class="panel"><h3>API ທັງໝົດ · ${api.length} ເສັ້ນທາງ</h3>
        <div class="chips">${api.map(a => `<span class="chip b">${a}</span>`).join('')}</div></div>
      <div class="panel"><h3>Event ທັງໝົດ · ${events.length} ລາຍການ</h3>
        <div class="chips">${events.map(e => `<span class="chip g">${e}</span>`).join('')}</div></div>
    </div>
    <div class="grid g2" style="margin-top:16px">
      <div class="panel"><h3>ໂຄງສ້າງຂໍ້ມູນ · ງານ (job)</h3>
        <div class="jsonbox" style="max-height:none">${JSON.stringify({
          id:JOBS[0].id, kind:'taxi|sched|airport|moto|pick|charter|drivemine',
          status:'offered|bidding|waiting|assigned|arrived|onTrip|collect|rated|cancelled',
          pax:{ name:'string', rating:4.9, trips:87 },
          from:{ name:'string', addr:'string', lat:0, lng:0 },
          to:{ name:'string', addr:'string', lat:0, lng:0 },
          km:9.0, min:22, offer:53000, bidPrice:58000, pay:'cash|wallet',
          waitSec:0, waitFee:0, stops:0, tip:0,
          driver:{ emp:'INS-0142', plate:'ກນ 6244' },
          tripFee:'ຄິດຝັ່ງ server ຕາມ CFG.tripFee + tripFeePct'
        }, null, 2).replace(/"([^"]+)":/g, '<span class="k">"$1"</span>:')
         .replace(/: "([^"]*)"/g, ': <span class="s">"$1"</span>')
         .replace(/: (\d+\.?\d*)/g, ': <span class="n">$1</span>')}</div></div>
      <div class="panel"><h3>ຄວາມແຕກຕ່າງຈາກແອັບລູກຄ້າ</h3>
        <table class="tbl"><thead><tr><th></th><th>ລູກຄ້າ</th><th>ຄົນຂັບ</th></tr></thead><tbody>
          <tr><td>ເຂົ້າສູ່ລະບົບ</td><td>ເບີໂທ + OTP</td><td>ລະຫັດພະນັກງານ + OTP</td></tr>
          <tr><td>ສະໝັກເອງ</td><td>ໄດ້</td><td><b>ບໍ່ໄດ້</b> (HR ສ້າງໃຫ້)</td></tr>
          <tr><td>ລາຄາ</td><td>ຕັ້ງລາຄາ</td><td>ຮັບ ຫຼື ບວກເພີ່ມ</td></tr>
          <tr><td>ເງິນ</td><td>ຈ່າຍ</td><td>ເກັບ → <b>ນຳສົ່ງ</b></td></tr>
          <tr><td>ກະ / ວັນລາ</td><td>ບໍ່ມີ</td><td><b>ມີ</b></td></tr>
          <tr><td>ເອກະສານ</td><td>ບໍ່ມີ</td><td><b>ມີ + ວັນໝົດອາຍຸ</b></td></tr>
          <tr><td>GPS ພື້ນຫຼັງ</td><td>ຕອນຈອງ</td><td><b>ຕະຫຼອດກະ</b></td></tr>
          <tr><td>ແຖບນຳທາງ</td><td>ໜ້າຫຼັກ·ເດີນທາງ·ໂປຣ·ແຈ້ງ·ບັນຊີ</td><td>ໜ້າຫຼັກ·ງານ·ລາຍໄດ້·ຜົນງານ·ບັນຊີ</td></tr>
        </tbody></table></div>
    </div>`;
}

/* ---------------- router ---------------- */
const VIEWS = { kiosk:viewKiosk, usage:viewUsage, present:viewPresent, overview:viewOverview, screens:viewScreens, demo:viewDemo, flow:viewFlow, spec:viewSpec };
function switchTab(name){
  if (!VIEWS[name]) name = 'screens';
  if (presTimer && name !== 'present'){ clearInterval(presTimer); presTimer = null; }
  if (name !== 'present' && name !== 'demo') navStop();
  $$('.tab').forEach(t => t.classList.toggle('on', t.dataset.view === name));
  VIEWS[name]();
  window.scrollTo({ top:0, behavior:'smooth' });
  if (location.hash.slice(1) !== name) location.hash = name;
}
$$('.tab').forEach(t => t.onclick = () => switchTab(t.dataset.view));
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target && e.target.id === 'chatInput'){ ACTIONS.sendMsg(); paintDemo(); return; }
  if ($('#present') && $('#modal').hidden){
    if (e.key === 'ArrowRight'){ presGo(1); return; }
    if (e.key === 'ArrowLeft'){ presGo(-1); return; }
    if (e.key === ' '){ e.preventDefault(); presToggle(); return; }
  }
  if (e.key === 'Escape' && !$('#modal').hidden){ $('#modal').hidden = true; $('#modal').innerHTML = ''; } });
const lg = document.querySelector('.logo'); if (lg) lg.innerHTML = logoMark();
logEv('app.start');
const startView = (location.hash || '').replace('#', '');
switchTab(VIEWS[startView] ? startView : 'screens');
window.addEventListener('hashchange', () => {
  const v = location.hash.replace('#', '');
  if (VIEWS[v] && !$(`.tab[data-view="${v}"]`).classList.contains('on')) switchTab(v);
});
