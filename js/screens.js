/* ============================================================
   screens.js — ຊິ້ນສ່ວນຮ່ວມ + ໜ້າຈໍໄຫຼການຮັບງານ D01–D19
   ທຸກ function ຮັບ state object ແລະ ຄືນ HTML ຂອງໜ້າຈໍທັງໜ້າ
   ============================================================ */

/* ---------- ສູດຄິດໄລ່ຂອງຄົນຂັບ ----------
   ຄ່າໂດຍສານເປັນຂອງບໍລິສັດ · ຄົນຂັບໄດ້ “ຄ່າຖ້ຽວ” = ຄົງທີ່ + % ຂອງຄ່າໂດຍສານ */
const rndK      = n => Math.round(n / 1000) * 1000;
const waitFeeOf = sec => Math.max(0, Math.ceil(sec / 60) - CFG.freeWaitMin) * CFG.waitFee;
/* ---- ສູດເງິນ ----
   ຄ່າໂດຍສານທັງໝົດເປັນຂອງຄົນຂັບ · ຄ່າທຳນຽມປັດຈຸບັນ 0% (feeOf() ຈຶ່ງເປັນ 0 ທຸກຖ້ຽວ) */
const feeOf     = fare => Math.round(fare * feePctOf() / 100) * 100;
/* ລາຍໄດ້ສຸດທິຈາກ 1 ຖ້ຽວ (ບໍ່ລວມທິບ) */
const earnOf    = fare => fare - feeOf(fare);
/* ຄ່າທຳນຽມຄ້າງຈ່າຍ */
const feeList   = s => (s && s.fees) || FEES;
const feeTotal  = s => feeList(s).reduce((a, c) => a + c.amt, 0);
const feePct    = s => Math.min(100, Math.round(feeTotal(s) / CFG.feeDueLimit * 100));
/* ---- ກະເປົາເງິນ ---- */
const walBal  = s => (s && s.wallet && s.wallet.balance !== undefined) ? s.wallet.balance : WALLET.balance;
const walAuto = s => (s && s.wallet && s.wallet.autoFee !== undefined) ? s.wallet.autoFee : WALLET.autoFee;
const walTx   = s => (s && s.walTx) || WALLET_TX;
/* ຍອດທີ່ຖອນໄດ້ = ຍອດເງິນ − ຄ່າທຳນຽມຄ້າງ (ຖ້າເປີດຫັກອັດຕະໂນມັດ) */
const walFree = s => Math.max(0, walBal(s) - (walAuto(s) ? feeTotal(s) : 0));
const walShort = s => walAuto(s) && walBal(s) < feeTotal(s);

/* ລະດັບຄົນຂັບ ຕາມຄະແນນດາວ — ໃຫ້ສິດທິປະໂຫຍດດ້ານງານ (ບໍ່ແມ່ນສ່ວນຫຼຸດຄ່າທຳນຽມແລ້ວ) */
const tierOf    = (r = ME.rating) => [...TIERS].reverse().find(t => r >= t.min) || TIERS[0];
const feePctOf  = () => CFG.commissionPct;
const zeroFee   = () => CFG.commissionPct === 0;
const nextTier  = (r = ME.rating) => TIERS.find(t => t.min > r) || null;
const curJob    = s => s.job || JOBS[0];
const jobFare   = s => (s.bidPrice || curJob(s).offer) + waitFeeOf(s.waitSec || 0);
const canOnline = s => feeTotal(s) < CFG.feeDueLimit && !DOCS.some(d => d.days <= 0);
const mmss      = sec => String(Math.floor(sec / 60)).padStart(2, '0') + ':' + String(sec % 60).padStart(2, '0');
const ll        = p => [p.lat, p.lng];

/* ---------- ຊິ້ນສ່ວນໂຄງແອັບ ---------- */
const appHead = (title, o = {}) => `
  <div class="napp">
    ${o.noBack ? '' : `<span class="bk" data-act="${o.back || 'goBack'}">${I('back')}</span>`}
    <h2>${title}</h2>
    ${o.right ? `<span class="rt" data-act="${o.rightAct || 'noop'}">${o.right}</span>` : ''}
  </div>`;

const NAVS = [
  { k:'home',        lo:'ໜ້າຫຼັກ',      ic:'home' },
  { k:'history',     lo:'ງານ',          ic:'receipt' },
  { k:'earnings',    lo:'ລາຍໄດ້',       ic:'coins' },
  { k:'performance', lo:'ຜົນງານ',       ic:'chart' },
  { k:'profile',     lo:'ບັນຊີ',        ic:'userc' }
];
const navBar = (active, s = {}) => {
  const unread = (s.notifs || NOTIFS).filter(n => n.unread).length;
  return `<div class="nav">${NAVS.map(n => `
    <a class="${n.k === active ? 'on' : ''}" data-act="nav" data-v="${n.k}">
      ${I(n.ic)}${n.k === 'profile' && unread ? `<em>${unread}</em>` : ''}<span>${n.lo}</span>
    </a>`).join('')}</div>`;
};

const appScreen = o => `
  <div class="sb">${statusBar(o.time || '21:40')}</div>
  ${o.head === false ? '' : appHead(o.title, o)}
  <div class="sbody" style="${o.bodyStyle || ''}">${o.body}</div>
  ${o.nav ? navBar(o.nav, o.state || {}) : ''}
  ${gestureBar}`;

const rowItem = o => `
  <div class="rowitem" ${o.act ? `data-act="${o.act}"` : ''} ${o.v ? `data-v="${o.v}"` : ''}>
    <div class="ic" ${o.color ? `style="background:${o.color}2e;color:${o.color}"` : ''}>${I(o.ic)}</div>
    <div class="tx"><b>${o.t}</b>${o.s ? `<span>${o.s}</span>` : ''}</div>
    <div class="rt">${o.r || ''}${o.chev === false ? '' : I('chevR')}</div>
  </div>`;

const field = (label, val, ph, ic) => `
  <div class="fld"><label>${label}</label>
    <div class="inp ${val ? '' : 'ph'}">${ic ? I(ic) : ''}<span>${val || ph}</span></div></div>`;

const sw = on => `<i class="sw ${on ? 'on' : ''}"></i>`;
const stars = n => `<span class="stars">${[1,2,3,4,5].map(i => `<i class="${i <= n ? 'on' : ''}">${I('star')}</i>`).join('')}</span>`;

/* ປ້າຍປະເພດງານ */
const kindTag = k => { const x = kindOf(k);
  return `<span class="kindtag" style="background:${x.color}18;color:${x.color}">${I(x.ic)}${x.n}</span>`; };

/* ແຖວເສັ້ນທາງ ຮັບ → ສົ່ງ */
const routeRow = (from, to, extra = '') => `
  <div class="rt2">
    <div class="line"><i></i><s></s><i class="b"></i></div>
    <div class="ad"><div><b>${from.name}</b><span>${from.addr || ''}</span></div>
                    <div><b>${to.name}</b><span>${to.addr || ''}</span></div></div>
  </div>${extra}`;

/* ແຜນທີ່: ເດໂມ/preview ໃຊ້ແຜນທີ່ແທ້ · gallery ໃຊ້ SVG (ໄວກວ່າເພາະມີຫຼາຍຈໍພ້ອມກັນ) */
const mapFor = (s, o) => s.live ? realMap(o)
  : mapPanel(o.route ? 'route' : 'pickup', o.h, { top:false, btns:o.btns, btnTop:o.btnTop });

/* ບັດລູກຄ້າ */
const paxCard = (j, acts = true) => `
  <div class="usercard">
    <div class="av">${personArt(j.face || 'user')}</div>
    <div class="tx"><b>${j.pax}</b><span>${stars(Math.round(j.paxRating))} ${j.paxRating} · ${j.paxTrips} ຖ້ຽວ</span></div>
    ${acts ? `<div class="acts"><i data-act="callPax">${I('phone')}</i><i class="hasbadge" data-act="goChat">${I('chat')}<em class="chatbadge"></em></i></div>` : ''}
  </div>`;

/* ============================================================
   D01 · ໜ້າເປີດແອັບ
   ============================================================ */
function scrSplash(s){
  return `<div class="sb">${statusBar('21:40')}</div>
  <div class="sbody" style="background:linear-gradient(168deg,#ffffff 0%,#fff5f5 55%,#fde8e9 100%);color:#0f151d;align-items:center;text-align:center">
    <div class="grow"></div>
    <div class="brandmark" style="box-shadow:none">${logoMark()}</div>
    <div style="font-size:24px;font-weight:800;letter-spacing:1.4px">INSEE <span style="font-weight:400">Drive</span></div>
    <div class="drvpill">${I('badge')} ແອັບພະນັກງານຂັບ</div>
    <div style="height:26px"></div>
    <div class="loader" style="border-color:rgba(225,37,43,.20);border-top-color:#e1252b"></div>
    <div class="grow"></div>
    <div style="font-size:11px;color:#98a3b1;padding-bottom:16px">ຮຸ່ນ 0.1 · ສູນບໍລິການ ${CFG.hotline}</div>
  </div>${gestureBar}`;
}

/* ============================================================
   D02 · ເຂົ້າສູ່ລະບົບດ້ວຍລະຫັດພະນັກງານ
   ============================================================ */
function scrLogin(s){
  return `<div class="sb">${statusBar('21:41')}</div>
  <div class="sbody">
    <div style="padding:26px 20px 6px">
      <div class="brandmark" style="width:60px;height:60px;border-radius:18px;margin:0 0 16px">${logoMark()}</div>
      <h3 style="font-size:20px;font-weight:800;color:var(--d-ink);margin:0 0 6px">ເຂົ້າສູ່ລະບົບຄົນຂັບ</h3>
      <p style="font-size:12.5px;color:var(--d-dim);line-height:1.65;margin:0">ໃສ່ລະຫັດຄົນຂັບ <b>PTN-XXXX</b>
        ທີ່ໄດ້ຮັບຫຼັງຜ່ານການລົງທະບຽນ ພ້ອມເບີໂທທີ່ລົງທະບຽນໄວ້</p>
    </div>
    <div style="height:12px"></div>
    ${field('ລະຫັດຄົນຂັບ', ME.code, 'PTN-0000', 'badge')}
    ${field('ເບີໂທລະສັບ', ME.phone, '+856 20 ...', 'phone')}
    <div class="staffnote" style="margin-top:4px">${I('info')}<span>ຂັບລົດຂອງທ່ານເອງ ໄດ້<b>ຄ່າໂດຍສານເຕັມ</b> —
      ${zeroFee() ? '🎉 <b>ຄ່າທຳນຽມ 0%</b> — ບໍລິສັດບໍ່ຫັກຫຍັງເລີຍ'
        : 'ຈ່າຍແຕ່ຄ່າທຳນຽມບໍລິການ ' + Math.round(CFG.commissionPct * 100) + '% ໃຫ້ບໍລິສັດ'}</span></div>
    <div class="grow"></div>
    <div class="btm">
      <div class="btn pri" data-act="sendOtp">ຮັບລະຫັດ OTP</div>
      <div class="applycta" data-act="goApply">
        <div><b>ຍັງບໍ່ມີບັນຊີ? ລົງທະບຽນເປັນຄົນຂັບ</b><span>ໃຊ້ລົດຂອງທ່ານເອງ · ອະນຸມັດພາຍໃນ 1–2 ວັນ</span></div>
        ${I('chevR')}</div>
      <div class="linkred" style="background:none" data-act="goApplyStatus">ຕິດຕາມໃບລົງທະບຽນທີ່ສົ່ງໄປແລ້ວ</div>
    </div>
  </div>${gestureBar}`;
}

/* ============================================================
   D03 · ຢືນຢັນ OTP
   ============================================================ */
function scrOtp(s){
  const v = (s.otp || '').padEnd(4, ' ');
  return appScreen({ time:'21:41', title:'ຢືນຢັນລະຫັດ', body:`
    <div style="padding:22px 20px 4px">
      <h3 style="font-size:18px;font-weight:800;color:var(--d-ink);margin:0 0 6px">ໃສ່ລະຫັດ 4 ຫຼັກ</h3>
      <p style="font-size:12.5px;color:var(--d-dim);line-height:1.6;margin:0">ສົ່ງໄປທີ່ ${ME.phone} ສຳລັບ ${ME.code}</p>
    </div>
    <div class="otpwrap">${[0,1,2,3].map(i => `<b class="${v[i].trim() ? 'on' : ''}">${v[i].trim() || ''}</b>`).join('')}</div>
    <div style="text-align:center;font-size:12px;color:var(--d-dim)">ສົ່ງລະຫັດໃໝ່ໄດ້ໃນ <b style="color:var(--d-brand)">00:42</b></div>
    <div style="text-align:center;padding:10px" ><span class="linkred" style="background:none;display:inline-block;padding:6px 12px" data-act="resendOtp">ສົ່ງລະຫັດໃໝ່</span></div>
    <div class="grow"></div>
    <div class="btm"><div class="btn ${(s.otp || '').length === 4 ? 'pri' : 'dis'}" data-act="verifyOtp">ຢືນຢັນ ແລະ ເຂົ້າສູ່ລະບົບ</div></div>` });
}

/* ============================================================
   D05 · ໜ້າຫຼັກ — ອອບລາຍ
   ============================================================ */
function scrOffline(s){
  const t = s.today || TODAY, blocked = !canOnline(s);
  return `<div class="sb">${statusBar('21:42')}</div>
  <div class="sbody" style="background:var(--d-bg)">
    <div class="drvtop">
      <div class="av">${personArt('user')}</div>
      <div class="tx"><b>${ME.name}</b><span>${ME.code} · ${ME.car.plate}</span></div>
      <i data-act="goNotifs">${I('bell')}${(s.notifs || NOTIFS).filter(n => n.unread).length
        ? `<em>${(s.notifs || NOTIFS).filter(n => n.unread).length}</em>` : ''}</i>
    </div>
    <div class="gohero">
      ${mapFor(s, { h:186, center:ll(CFG.center), zoom:15, marker:'pickup', btns:false })}
      <div class="goveil"></div>
      <div class="gobtn ${blocked ? 'off' : ''}" data-act="${blocked ? 'blockedOnline' : 'goOnline'}">
        ${I('power')}<b>ເລີ່ມຮັບງານ</b></div>
      <div class="gostate">${blocked ? '⚠️ ຕິດເງື່ອນໄຂ — ເບິ່ງລຸ່ມນີ້' : 'ພັກຢູ່ · ກົດເພື່ອອອນລາຍ'}</div>
    </div>

    <div class="grp">ສະຫຼຸບມື້ນີ້</div>
    <div class="card2" style="padding:14px">
      <div class="statrow">
        <div><b>${t.trips}</b><span>ຖ້ຽວ</span></div>
        <div><b>${(earnOf(t.fare) + t.tips).toLocaleString()}</b><span>ລາຍໄດ້ (ກີບ)</span></div>
        <div><b>${t.hours}</b><span>ຊົ່ວໂມງ</span></div>
      </div>
      <div class="goalbar"><i style="width:${Math.round(ME.rating / 5 * 100)}%"></i></div>
      <div class="goaltx"><span>${stars(Math.round(ME.rating))} ${ME.rating.toFixed(1)} · ລະດັບ${tierOf().n}</span>
        <b>${nextTier() ? '+' + (nextTier().min - ME.rating).toFixed(1) + '★ → ' + nextTier().n : 'ລະດັບສູງສຸດ 🏆'}</b></div>
    </div>

    ${zeroFee() ? `
    <div class="grp">ຄ່າທຳນຽມ</div>
    <div class="card2 zerofee" data-act="goWallet">
      <div class="hd">${I('gift')}<b>0%</b><span class="rt">${I('chevR')}</span></div>
      <div class="ft">ຄ່າໂດຍສານ ແລະ ທິບເປັນຂອງທ່ານ <b>100%</b> · ໂປຣໂມຊັນຮອດ ${CFG.zeroFeeUntil}</div>
    </div>` : `
    <div class="grp">ຄ່າທຳນຽມຄ້າງຈ່າຍ</div>
    <div class="card2 cashcard ${feePct(s) >= 100 ? 'over' : feePct(s) >= 70 ? 'warn' : ''}" data-act="goPayFee">
      <div class="hd">${I('coins')}<b>${money(feeTotal(s))}</b>
        <span class="rt">${I('chevR')}</span></div>
      <div class="bar"><i style="width:${feePct(s)}%"></i></div>
      <div class="ft">ຂີດຈຳກັດ ${money(CFG.feeDueLimit)} · ຕັດຍອດ${CFG.feeCycle}</div>
    </div>`}

    <div class="grp">ຕ້ອງເບິ່ງ</div>
    <div class="card2">
      ${DOCS.filter(d => d.warn).map(d => rowItem({ ic:'alert', color:'#f0921f', t:d.n + ' ໃກ້ໝົດອາຍຸ',
        s:'ເຫຼືອ ' + d.days + ' ວັນ · ໝົດ ' + d.exp, act:'goDocs' })).join('')}
      ${rowItem({ ic:'bell', color:'#e1252b', t:'ປະກາດຈາກບໍລິສັດ', s:ANNOUNCE[0].title, act:'goAnnounce' })}
    </div>
    <div style="height:10px"></div>
  </div>
  ${navBar('home', s)}${gestureBar}`;
}

/* ============================================================
   D06 · ໜ້າຫຼັກ — ອອນລາຍ
   ============================================================ */
function scrOnline(s){
  const queue = JOBS.slice(0, 3);
  return `<div class="sb">${statusBar('21:43')}</div>
  <div class="sbody" style="background:var(--d-bg);padding:0">
    <div class="onlinebar"><span class="dot"></span><b>ອອນລາຍ · ພ້ອມຮັບງານ</b>
      <span class="tm">${I('timer')} ລໍ 00:48</span>
      <i data-act="goOffline">${I('pause')}</i></div>
    ${mapFor(s, { h:230, center:ll(CFG.center), zoom:14, marker:'pickup', btnTop:10 })}
    <div class="zonerow">
      <b class="hot">${I('fire')} ສີໂຄດຕະບອງ ×1.4</b>
      <b>ຈັນທະບູລີ ×1.1</b><b>ໄຊເສດຖາ ×1.0</b><b>ສີສັດຕະນາກ ×0.9</b>
    </div>
    <div class="grp">ງານທີ່ເປີດຢູ່ (${queue.length}) <span class="grpmore" data-act="goJobs">ເບິ່ງທັງໝົດ</span></div>
    ${queue.map(j => jobCard(j, s)).join('')}
    <div class="safenote">💡 ຢູ່ໂຊນສີແດງ ໄດ້ງານໄວກວ່າ ແລະ ຄ່າຖ້ຽວຄູນເພີ່ມຕາມຕົວຄູນຂອງໂຊນ</div>
    <div style="height:10px"></div>
  </div>
  ${navBar('home', s)}${gestureBar}`;
}

/* ບັດງານ (ໃຊ້ຮ່ວມ D06 · D07) */
function jobCard(j, s){
  return `<div class="jobc ${j.hot ? 'hot' : ''}" data-act="openJob" data-v="${j.id}">
    <div class="hd">${kindTag(j.kind)}
      ${j.kind === 'pick' ? '<span class="pickme">ເລືອກທ່ານ</span>' : ''}
      <span class="rt">${I('nav')} ${j.dist} km · ${j.eta} ນາທີ</span></div>
    ${routeRow(j.from, j.to)}
    <div class="ft">
      <span class="pay ${j.pay}">${I(j.pay === 'cash' ? 'cash' : 'wallet')}${j.pay === 'cash' ? 'ເງິນສົດ' : 'ກະເປົາເງິນ'}</span>
      <span class="km">${j.km} km · ${j.min} ນາທີ</span>
      <b>${money(j.offer)}</b></div>
    <div class="fee">${zeroFee() ? 'ທ່ານໄດ້ເຕັມ' : 'ລາຍໄດ້ສຸດທິ'} <b>${money(earnOf(j.offer))}</b>
      <span>${zeroFee() ? '(ຄ່າທຳນຽມ 0%)' : '(ຫັກຄ່າທຳນຽມ ' + money(feeOf(j.offer)) + ')'}</span></div>
  </div>`;
}

/* ============================================================
   D07 · ຄິວງານທີ່ເປີດຢູ່
   ============================================================ */
function scrJobList(s){
  const f = s.jobFilter || 'all';
  const sort = s.jobSort || 'near';
  let list = JOBS.filter(j => f === 'all' || j.kind === f);
  list = [...list].sort((a, b) => sort === 'near' ? a.dist - b.dist : b.offer - a.offer);
  list = [...list].sort((a, b) => (b.kind === 'pick') - (a.kind === 'pick'));
  return `<div class="sb">${statusBar('21:43')}</div>
  ${appHead('ຄິວງານ', { noBack:true, right:I('refresh'), rightAct:'refreshJobs' })}
  <div class="sbody">
    <div class="segs">
      ${[['all','ທັງໝົດ'],['taxi','ທັນທີ'],['sched','ຈອງລ່ວງໜ້າ'],['charter','ເໝົາລົດ']]
        .map(([k, l]) => `<b class="${f === k ? 'on' : ''}" data-act="jobFilter" data-v="${k}">${l}</b>`).join('')}
    </div>
    <div class="sortrow">ຮຽງຕາມ:
      <b class="${sort === 'near' ? 'on' : ''}" data-act="jobSort" data-v="near">ໃກ້ທີ່ສຸດ</b>
      <b class="${sort === 'pay' ? 'on' : ''}" data-act="jobSort" data-v="pay">ລາຄາສູງສຸດ</b>
      <span class="rt">${list.length} ງານ</span></div>
    ${list.length ? list.map(j => jobCard(j, s)).join('')
      : `<div class="empty">${I('search')}<b>ບໍ່ພົບງານໃນໝວດນີ້</b><span>ລອງຍ້າຍໄປໂຊນຄວາມຕ້ອງການສູງ ຫຼື ປ່ຽນຕົວກັ່ນຕອງ</span></div>`}
    <div style="height:10px"></div>
  </div>
  ${navBar('home', s)}${gestureBar}`;
}

/* ============================================================
   D08 · ງານໃໝ່ເຂົ້າ (ນັບຖອຍຫຼັງ)
   ============================================================ */
function scrJobOffer(s){
  const j = curJob(s), sec = s.popSec ?? CFG.jobPopSec;
  const pct = sec / CFG.jobPopSec;
  const special = j.kind === 'charter' ? 'goCharterJob' : j.kind === 'drivemine' ? 'goDriveMineJob' : null;
  return appScreen({ time:'21:44', title:'ງານໃໝ່', head:false, bodyStyle:'background:var(--d-bg)', body:`
    <div class="offerhead">
      <div class="ring" style="--p:${pct}"><b>${sec}</b><span>ວິ</span></div>
      <div class="tx">${kindTag(j.kind)}
        <b>${j.when ? j.when : 'ຮັບທັນທີ'}</b>
        <span>${I('nav')} ຫ່າງຈາກທ່ານ ${j.dist} km · ໄປຮັບ ${j.eta} ນາທີ</span></div>
    </div>
    <div class="card2" style="padding:12px 14px">${routeRow(j.from, j.to)}
      <div class="jline"><span>ໄລຍະ ແລະ ເວລາ</span><b>${j.km} km · ${j.min} ນາທີ</b></div>
      <div class="jline"><span>ວິທີຈ່າຍ</span><b>${j.pay === 'cash' ? '💵 ເງິນສົດ (ຮັບເອງ)' : '👛 ກະເປົາເງິນ (ໂອນເຂົ້າບັນຊີ)'}</b></div>
    </div>
    <div class="offerprice">
      <div><span>ລູກຄ້າສະເໜີ</span><b>${money(j.offer)}</b></div>
      <div class="mine"><span>ລາຍໄດ້ຂອງທ່ານ</span><b>${money(earnOf(j.offer))}</b></div>
    </div>
    ${j.note ? `<div class="paxnote">${I('info')}<span>${j.note}</span></div>` : ''}
    <div class="grp">ລູກຄ້າ</div>
    <div class="card2">${paxCard(j, false)}</div>
    ${special ? `<div class="staffnote">${I('alert')}<span>ງານນີ້ເປັນ <b>${kindOf(j.kind).n}</b> —
      ມີໃບງານສະເພາະ ກະລຸນາອ່ານກ່ອນຮັບ</span></div>
      <div style="padding:0 12px"><div class="btn ored" data-act="${special}">ເປີດໃບງານ${kindOf(j.kind).n}</div></div>` : ''}
    <div class="grow"></div>
    <div class="btm"><div class="row2">
      <div class="btn plain" data-act="declineJob">ປະຕິເສດ</div>
      <div class="btn pri" data-act="goBid">ສະເໜີລາຄາ</div></div></div>` });
}

/* ============================================================
   D09 · ສະເໜີລາຄາ
   ============================================================ */
function scrBid(s){
  const j = curJob(s);
  const price = s.bidPrice || j.offer;
  const avg = rndK(j.offer * 1.06);
  const high = price > avg;
  const low = price < CFG.minFare;
  return appScreen({ time:'21:44', title:'ສະເໜີລາຄາ', body:`
    <div class="card2" style="padding:12px 14px;margin-bottom:2px">${routeRow(j.from, j.to)}</div>
    <div class="grp">ລາຄາທີ່ທ່ານສະເໜີ</div>
    <div class="pricebox">
      <i class="${price <= Math.max(CFG.minFare, j.offer) ? 'dis' : ''}" data-act="bidMinus">−</i>
      <div class="v"><b>${price.toLocaleString()}</b><span>${CFG.currency}</span></div>
      <i data-act="bidPlus">+</i>
    </div>
    <div class="quickbid">
      <b class="${price === j.offer ? 'on' : ''}" data-act="bidSet" data-v="${j.offer}">ຕາມລູກຄ້າ</b>
      <b class="${price === j.offer + 5000 ? 'on' : ''}" data-act="bidSet" data-v="${j.offer + 5000}">+5,000</b>
      <b class="${price === j.offer + 10000 ? 'on' : ''}" data-act="bidSet" data-v="${j.offer + 10000}">+10,000</b>
    </div>
    <div class="cmpbar">
      <div class="track"><i style="left:${Math.min(96, Math.max(2, (price / (avg * 1.5)) * 100))}%"></i>
        <s style="left:${(avg / (avg * 1.5)) * 100}%"></s></div>
      <div class="lg"><span>ຂັ້ນຕ່ຳ ${CFG.minFare.toLocaleString()}</span><span>ຄ່າສະເລ່ຍເສັ້ນທາງນີ້ ${avg.toLocaleString()}</span></div>
    </div>
    ${high ? `<div class="warnrow">${I('alert')}<span>ສູງກວ່າຄ່າສະເລ່ຍ ${money(price - avg)} — ໂອກາດຖືກເລືອກຫຼຸດລົງ</span></div>` : ''}
    ${low ? `<div class="warnrow bad">${I('alert')}<span>ຕ່ຳກວ່າຂັ້ນຕ່ຳລະບົບ ${money(CFG.minFare)} — ສົ່ງບໍ່ໄດ້</span></div>` : ''}
    <div class="grp">ຖ້າລູກຄ້າເລືອກທ່ານ</div>
    <div class="card2" style="padding:12px 14px">
      <div class="fline"><span>ຄ່າໂດຍສານທີ່ລູກຄ້າຈ່າຍ</span><span>${money(price)}</span></div>
      <div class="fline"><span>ຄ່າທຳນຽມບໍລິການ ${Math.round(feePctOf() * 100)}%${zeroFee() ? ' <em class="ptag ok">ໂປຣ</em>' : ''}</span>
        <span style="color:${zeroFee() ? 'var(--d-ok)' : 'var(--d-bad)'}">${zeroFee() ? '0' : '−' + money(feeOf(price))}</span></div>
      <div class="fline total"><span>ທ່ານໄດ້ຮັບ</span><span style="color:var(--d-ok)">${money(earnOf(price))}</span></div>
    </div>
    <div class="grow"></div>
    <div class="btm">
      <div class="btmsum"><span>ລູກຄ້າມີເວລາຕັດສິນໃຈ ${CFG.bidWindowSec} ວິນາທີ</span><b>${money(price)}</b></div>
      <div class="btn ${low ? 'dis' : 'pri'}" data-act="submitBid">ສົ່ງລາຄາໃຫ້ລູກຄ້າ</div></div>` });
}

/* ============================================================
   D10 · ລໍລູກຄ້າເລືອກ
   ============================================================ */
function scrBidWait(s){
  const j = curJob(s), sec = s.bidSec ?? CFG.bidWindowSec;
  const rank = s.bidRank || 2, n = s.bidders || 4;
  return appScreen({ time:'21:45', title:'ລໍລູກຄ້າຕັດສິນໃຈ', body:`
    <div class="waitbig">
      <div class="pulsering"><b>${mmss(sec)}</b></div>
      <b>ສົ່ງລາຄາແລ້ວ ${money(s.bidPrice || j.offer)}</b>
      <span>ລູກຄ້າກຳລັງເລືອກຈາກຄົນຂັບ ${n} ຄົນ</span>
    </div>
    <div class="grp">ອັນດັບລາຄາຂອງທ່ານ</div>
    <div class="card2" style="padding:12px 14px">
      ${Array.from({ length:n }, (_, i) => {
        const me = i + 1 === rank;
        return `<div class="rankrow ${me ? 'me' : ''}">
          <i>${i + 1}</i><span>${me ? 'ລາຄາຂອງທ່ານ' : 'ຄົນຂັບ ' + String.fromCharCode(65 + i)}</span>
          <b>${me ? money(s.bidPrice || j.offer) : money(rndK((s.bidPrice || j.offer) * (1 + (i + 1 - rank) * 0.09)))}</b></div>`;
      }).join('')}
      <div class="ranknote">ລູກຄ້າເຫັນລາຄາ, ຄະແນນ ແລະ ເວລາໄປຮັບຂອງທຸກຄົນ — ບໍ່ເຫັນຊື່ຈົນກວ່າຈະເລືອກ</div>
    </div>
    <div class="safenote">⏳ ລະຫວ່າງລໍ ທ່ານຍັງເບິ່ງງານອື່ນໃນຄິວໄດ້ — ຖ້າລູກຄ້າເລືອກທ່ານ ລະບົບຈະແຈ້ງທັນທີ</div>
    <div class="simrow">ຈຳລອງຜົນ (ສຳລັບເດໂມ):
      <b class="ok" data-act="simWin">ລູກຄ້າເລືອກທ່ານ</b>
      <b data-act="simLose">ເລືອກຄົນອື່ນ</b></div>
    <div class="grow"></div>
    <div class="btm"><div class="row2">
      <div class="btn plain" data-act="withdrawBid">ຖອນລາຄາ</div>
      <div class="btn ored" data-act="goJobs">ເບິ່ງງານອື່ນ</div></div></div>` });
}

/* ============================================================
   D12 · ຮອດຈຸດຮັບ · ລໍລູກຄ້າ
   ============================================================ */
function scrArrived(s){
  const j = curJob(s), sec = s.waitSec || 0;
  const fee = waitFeeOf(sec), free = sec < CFG.freeWaitMin * 60;
  const canCancel = sec >= 600;
  return `<div class="sb">${statusBar('21:49')}</div>
  <div class="sbody" style="padding:0;background:var(--d-bg)">
    ${mapFor(s, { h:180, center:ll(j.from), zoom:17, marker:'pickup', btns:false })}
    <div class="waitbox ${free ? '' : 'fee'}">
      <div class="tm">${mmss(sec)}</div>
      <b>${free ? 'ລໍຟຣີ · ເຫຼືອ ' + mmss(CFG.freeWaitMin * 60 - sec) : 'ກຳລັງຄິດຄ່າລໍ ' + money(fee)}</b>
      <span>${free ? `ຟຣີ ${CFG.freeWaitMin} ນາທີ ຈາກນັ້ນ ${CFG.waitFee.toLocaleString()} ກີບ/ນາທີ`
        : `ຄ່າລໍຈະບວກເຂົ້າຄ່າໂດຍສານອັດຕະໂນມັດ`}</span>
    </div>
    <div class="card2">${paxCard(j)}</div>
    <div class="grp">ແຈ້ງລູກຄ້າດ່ວນ</div>
    <div class="quick">${QUICK.slice(0, 4).map(q => `<b data-act="quickMsg" data-v="${q}">${q}</b>`).join('')}</div>
    <div class="grp">ຈຸດຮັບ</div>
    <div class="card2">${rowItem({ ic:'pin', color:'#12a150', t:j.from.name, s:j.from.addr, chev:false })}</div>
    <div style="padding:8px 12px 4px">${slideTrack('ລູກຄ້າຂຶ້ນລົດແລ້ວ · ເລີ່ມການເດີນທາງ', 'startTrip', '')}</div>
    <div class="linkred ${canCancel ? '' : 'dim'}" data-act="${canCancel ? 'goCancel' : 'waitMore'}">
      ${canCancel ? 'ຍົກເລີກໄດ້ຟຣີ (ລໍເກີນ 10 ນາທີ)' : 'ຍົກເລີກໄດ້ຟຣີເມື່ອລໍຄົບ 10 ນາທີ'}</div>
  </div>${gestureBar}`;
}

/* ============================================================
   D14 · ແຊັດກັບລູກຄ້າ
   ============================================================ */
/* ============================================================
   ຊິ້ນສ່ວນນຳທາງ realtime (ໃຊ້ຮ່ວມ D17 ໄປຮັບ · D19 ເດີນທາງ)
   ຄ່າເລີ່ມຕົ້ນເປັນ seed ເທົ່ານັ້ນ — navPaintUI() ຈະຂຽນທັບທຸກວິນາທີ
   ============================================================ */
const navSeed = { m:0, dist:240, instr:'ໄປຊື່ ເຂົ້າ ຖະໜົນ ໄກສອນ ພົມວິຫານ', then:'ຈາກນັ້ນ ລ້ຽວຂວາ' };

const navBanner = (seed = navSeed) => `
  <div class="navtop">
    <div class="row">
      <i id="navIcon">${turnIcon({ type:'continue', mod:'straight' })}</i>
      <div class="tx"><b id="navDist">${fmtM(seed.dist)}</b><span id="navInstr">${seed.instr}</span></div>
    </div>
    <div class="then" id="navThen">${seed.then}</div>
  </div>`;

const navMap = (s, h = 330) => `
  <div class="navwrap">
    ${mapFor(s, { h, nav:true, center:ll(CFG.center), zoom:16, btns:false })}
    <div class="navbtns">
      <i data-act="navRecenter" title="ກັບມາຕຳແໜ່ງລົດ">${I('locate')}</i>
      <i data-act="navOverview" title="ເບິ່ງທັງເສັ້ນທາງ">${I('route')}</i>
      <i class="${(typeof NAV !== 'undefined' && NAV.muted) ? 'off' : ''}" data-act="navMute" title="ສຽງແຈ້ງທາງ">${I('bell')}</i>
    </div>
    <div class="navspeed" id="navSpeed">40 km/h</div>
    <div class="navprog"><i id="navProg" style="width:0%"></i></div>
  </div>`;

const navFoot = (kmSeed, minSeed) => `
  <div class="navfoot">
    <div><b id="navEta">—</b><span>ຮອດເວລາ</span></div>
    <div><b id="navRemain">${kmSeed} km</b><span>ເຫຼືອ</span></div>
    <div><b id="navMin">${minSeed} ນາທີ</b><span>ເວລາ</span></div>
  </div>`;

/* ============================================================
   D17 · ໄປຮັບລູກຄ້າ (ນຳທາງ realtime)
   ============================================================ */
function scrToPickup(s){
  const j = curJob(s);
  return `<div class="sb dark">${statusBar(s.navTime || '21:46')}</div>
  <div class="sbody navscr" style="padding:0;background:var(--d-bg)">
    ${navBanner({ dist:j.dist * 1000 * 0.4, instr:'ໄປຊື່ ເຂົ້າ ຖະໜົນ ໄກສອນ ພົມວິຫານ', then:'ຈາກນັ້ນ ລ້ຽວຂວາ ເຂົ້າ ' + j.from.name })}
    ${navMap(s, 322)}
    <div class="navsheet">
      ${navFoot(j.dist, j.eta)}
      <div class="navdest">${I('pin')}<div><b>ໄປຮັບທີ່ ${j.from.name}</b><span>${j.from.addr}</span></div>
        <i data-act="openNav" title="ເປີດແອັບນຳທາງພາຍນອກ">${I('nav')}</i></div>
      <div class="navpax">
        <div class="av">${personArt(j.face || 'user')}</div>
        <div class="tx"><b>${j.pax}</b><span>${stars(Math.round(j.paxRating))} ${j.paxRating} · ${kindOf(j.kind).n}</span></div>
        <i data-act="callPax">${I('phone')}</i><i data-act="goChat">${I('chat')}</i>
      </div>
      ${j.note ? `<div class="paxnote inner">${I('info')}<span>${j.note}</span></div>` : ''}
      <div style="padding:8px 12px 2px">${slideTrack('ຮອດຈຸດຮັບແລ້ວ', 'arrivePickup', '')}</div>
      <div class="linkred" data-act="goCancel">ຍົກເລີກງານນີ້</div>
    </div>
  </div>${gestureBar}`;
}

/* ============================================================
   D19 · ກຳລັງເດີນທາງ (ນຳທາງ realtime)
   ============================================================ */
function scrOnTrip(s){
  const j = curJob(s);
  const fare = jobFare(s) + (s.stops || 0) * 10000;
  return `<div class="sb dark">${statusBar(s.navTime || '21:52')}</div>
  <div class="sbody navscr" style="padding:0;background:var(--d-bg)">
    ${navBanner({ dist:600, instr:'ໄປຊື່ ເຂົ້າ ຖະໜົນ ທ່າເດື່ອ', then:'ຈາກນັ້ນ ລ້ຽວຊ້າຍ ເຂົ້າ ' + j.to.name })}
    ${navMap(s, 300)}
    <div class="navsheet">
      ${navFoot(j.km, j.min)}
      <div class="navdest">${I('pin')}<div><b>ໄປສົ່ງທີ່ ${j.to.name}</b><span>${j.to.addr}</span></div>
        <i data-act="openNav" title="ເປີດແອັບນຳທາງພາຍນອກ">${I('nav')}</i></div>
      <div class="navfare">
        <span>ຄ່າໂດຍສານທີ່ຈະເກັບ</span><b>${money(fare)}</b>
        <em>ລາຍໄດ້ສຸດທິ ${money(earnOf(fare))}</em>
      </div>
      <div class="mactions dark">
        <b data-act="addStop">${I('plus')}ແວ່ຈຸດ</b>
        <b class="hasbadge" data-act="goChat">${I('chat')}ແຊັດ<em class="chatbadge"></em></b>
        <b class="emerg" data-act="goSafety">SOS</b>
      </div>
      <div style="padding:6px 12px 2px">${slideTrack('ຮອດປາຍທາງ · ຈົບການເດີນທາງ', 'completeTrip', '')}</div>
      <div style="height:8px"></div>
    </div>
  </div>${gestureBar}`;
}

/* ============================================================
   D20 · ແຊັດກັບລູກຄ້າ (realtime + ແປອັດຕະໂນມັດ)
   ============================================================ */
/* ແປງຂໍ້ຄວາມຕົວຢ່າງເປັນຮູບແບບຂອງ engine (ໃຊ້ຕອນ render ໃນ gallery) */
const chatSeed = (s, lang) => (s.messages || []).map(m => {
  const tx = m.tx || (m.type === 'loc' ? 'ຕຳແໜ່ງປັດຈຸບັນຂອງຂ້ອຍ 📍' : '');
  return m.who === 'me'
    ? { who:'me', text:tx, tr:lang === 'lo' ? null : translate(tx, lang).text, lang:'lo', t:m.t, status:'read' }
    : { who:'them', text:lang === 'lo' ? tx : translate(tx, lang).text,
        tr:lang === 'lo' ? null : tx, lang, t:m.t };
});

function scrChat(s){
  const j = curJob(s);
  const lang = j.paxLang || 'lo';
  const seeded = chatSeed(s, lang);
  return `<div class="sb">${statusBar('21:51')}</div>
  <div class="chead">
    <span class="bk" data-act="leaveChat">${I('back')}</span>
    <div class="av">${personArt(j.face || 'user')}<em></em></div>
    <div class="tx"><b>${j.pax}</b><span id="chatSub">${lang === 'lo' ? 'ອອນລາຍ'
      : 'ເວົ້າ' + langOf(lang).n + ' · ແປອັດຕະໂນມັດເປີດ'}</span></div>
    ${lang === 'lo' ? '' : `<i id="chatTr" class="trbtn on" data-act="chatTr" title="ເປີດ/ປິດ ການແປ">${I('globe')}</i>`}
    <i class="cal" data-act="callPax">${I('phone')}</i>
  </div>
  ${lang === 'lo' ? '' : `<div class="trbar">${I('globe')}<span>ລູກຄ້າເວົ້າ<b>${langOf(lang).n}</b> ${langOf(lang).f} —
    ຂໍ້ຄວາມຖືກແປອັດຕະໂນມັດທັງສອງທາງ</span></div>`}
  <div class="sbody chat" id="chatList">
    <div class="dp">ມື້ນີ້</div>
    ${seeded.map(m => chatBubble(m, lang, true)).join('')}
  </div>
  <div class="quick">${QUICK.map(q => `<b data-act="quickMsg" data-v="${q}">${q}</b>`).join('')}</div>
  <div class="cinput">
    <i data-act="shareLoc" title="ສົ່ງຕຳແໜ່ງ">${I('locate')}</i>
    <input id="chatInput" class="box" placeholder="ພິມເປັນພາສາລາວ — ລະບົບແປໃຫ້ເອງ" autocomplete="off">
    <i class="send" data-act="sendMsg">${I('send')}</i>
  </div>${gestureBar}`;
}

/* ============================================================
   D15 · ຈົບການເດີນທາງ & ຮັບເງິນ
   ============================================================ */
function scrCollect(s){
  const j = curJob(s);
  const fare = jobFare(s) + (s.stops || 0) * 10000;
  const tip = s.tip || 0;
  const m = s.payMethod || (j.pay === 'cash' ? 'cash' : 'wallet');
  const paid = s.collected;
  return appScreen({ time:'22:08', title:'ຈົບການເດີນທາງ', head:false, body:`
    <div class="donehead ${paid ? 'ok' : ''}">
      <i>${I(paid ? 'ok' : 'car')}</i>
      <b>${paid ? 'ຮັບເງິນຮຽບຮ້ອຍ' : 'ຮອດປາຍທາງແລ້ວ'}</b>
      <span>${j.from.name} → ${j.to.name} · ${j.km} km · ${j.min} ນາທີ</span>
    </div>
    <div class="grp">ຍອດທີ່ຕ້ອງເກັບ</div>
    <div class="card2" style="padding:12px 14px">
      <div class="fline"><span>ຄ່າໂດຍສານທີ່ຕົກລົງ</span><span>${money(s.bidPrice || j.offer)}</span></div>
      ${waitFeeOf(s.waitSec || 0) ? `<div class="fline"><span>ຄ່າລໍ</span><span>${money(waitFeeOf(s.waitSec || 0))}</span></div>` : ''}
      ${s.stops ? `<div class="fline"><span>ຈຸດແວ່ເພີ່ມ</span><span>${money(s.stops * 10000)}</span></div>` : ''}
      ${tip ? `<div class="fline"><span>ທິບຈາກລູກຄ້າ 🎉</span><span style="color:var(--d-ok)">+${money(tip)}</span></div>` : ''}
      <div class="fline total"><span>ລວມ</span><span>${money(fare + tip)}</span></div>
    </div>
    <div class="grp">ວິທີຮັບເງິນ</div>
    <div class="paygrid3">
      ${[['cash','ເງິນສົດ','cash'],['qr','ໃຫ້ສະແກນ QR','qr'],['wallet','ຫັກກະເປົາລູກຄ້າ','wallet']]
        .map(([k, n, ic]) => `<b class="${m === k ? 'on' : ''}" data-act="payMethod" data-v="${k}">${I(ic)}${n}</b>`).join('')}
    </div>
    ${m === 'qr' ? `<div class="card2 qrmini">${qrBox('insee-driver://' + ME.emp + '/' + (fare + tip), 132)}
      <div class="tx"><b>ໃຫ້ລູກຄ້າສະແກນ</b><span>${money(fare + tip)} · ເຂົ້າບັນຊີບໍລິສັດໂດຍກົງ ບໍ່ຕ້ອງນຳສົ່ງ</span></div></div>` : ''}
    ${m === 'cash' ? (zeroFee()
      ? `<div class="safenote">💵 ເງິນສົດເປັນຂອງທ່ານ <b>ທັງໝົດ</b> — ບໍ່ຕ້ອງນຳສົ່ງ ແລະ ບໍ່ມີຄ່າທຳນຽມ</div>`
      : `<div class="safenote">💵 ເງິນສົດເປັນຂອງທ່ານທັນທີ — ລະບົບບວກຄ່າທຳນຽມ
          <b>${money(feeOf(fare))}</b> ເຂົ້າຍອດຄ້າງຈ່າຍ</div>`) : ''}
    ${m === 'wallet' ? `<div class="safenote">👛 ຫັກຈາກກະເປົາເງິນຂອງລູກຄ້າອັດຕະໂນມັດ — ບໍ່ຕ້ອງຮັບເງິນສົດ</div>` : ''}
    <div class="grp">ລາຍໄດ້ຂອງທ່ານ</div>
    <div class="card2 earnrow"><div>${I('coins')}<b>${money(earnOf(fare) + tip)}</b></div>
      <span>${zeroFee() ? 'ຄ່າໂດຍສານ ' + money(fare) + ' (ຄ່າທຳນຽມ 0%)'
        : 'ຄ່າໂດຍສານ ' + money(fare) + ' − ຄ່າທຳນຽມ ' + money(feeOf(fare))}${tip ? ' + ທິບ ' + money(tip) : ''}</span></div>
    <div class="grow"></div>
    <div class="btm"><div class="btn pri" data-act="collectPay">${m === 'cash' ? 'ຮັບເງິນສົດແລ້ວ'
      : m === 'qr' ? 'ຢືນຢັນໄດ້ຮັບເງິນ' : 'ຢືນຢັນຫັກກະເປົາ'}</div></div>` });
}

/* ============================================================
   D16 · ໃຫ້ຄະແນນລູກຄ້າ
   ============================================================ */
function scrRatePax(s){
  const j = curJob(s), r = s.paxRating || 0;
  const tags = r >= 4 ? PAX_TAGS.good : PAX_TAGS.bad;
  const fare = jobFare(s) + (s.stops || 0) * 10000;
  return appScreen({ time:'22:09', title:'ໃຫ້ຄະແນນລູກຄ້າ', head:false, body:`
    <div class="ratebox">
      <div class="av">${personArt(j.face || 'user')}</div>
      <b>${j.pax}</b>
      <span>ໃຫ້ຄະແນນເພື່ອຊ່ວຍພະນັກງານຄົນອື່ນ (ລູກຄ້າບໍ່ເຫັນ)</span>
      <div class="stars big">${[1,2,3,4,5].map(i => `<i class="${i <= r ? 'on' : ''}" data-act="ratePax" data-v="${i}">${I('star')}</i>`).join('')}</div>
      ${r ? `<div class="ratelabel">${RATE_LABEL[r]}</div>` : ''}
    </div>
    ${r ? `<div class="grp">ເລືອກປ້າຍຄຳ</div>
    <div class="tagchips">${tags.map(t => `<b class="${(s.paxTags || []).includes(t) ? 'on' : ''}"
      data-act="paxTag" data-v="${t}">${t}</b>`).join('')}</div>` : ''}
    <div class="grp">ສະຫຼຸບຖ້ຽວນີ້</div>
    <div class="card2" style="padding:12px 14px">
      <div class="fline"><span>ຄ່າໂດຍສານ</span><span>${money(fare)}</span></div>
      <div class="fline"><span>ຄ່າທຳນຽມ ${Math.round(feePctOf() * 100)}%</span>
        <span style="color:${zeroFee() ? 'var(--d-ok)' : 'var(--d-bad)'}">${zeroFee() ? '0' : '−' + money(feeOf(fare))}</span></div>
      <div class="fline"><span>ວິທີຈ່າຍ</span><span>${s.payMethod === 'cash' ? 'ເງິນສົດ' : s.payMethod === 'qr' ? 'QR' : 'ກະເປົາເງິນ'}</span></div>
      <div class="fline total"><span>ລາຍໄດ້ສຸດທິ + ທິບ</span><span style="color:var(--d-ok)">${money(earnOf(fare) + (s.tip || 0))}</span></div>
    </div>
    <div class="linkred" style="background:none" data-act="reportPax">ລາຍງານບັນຫາຮ້າຍແຮງ</div>
    <div class="grow"></div>
    <div class="btm"><div class="row2">
      <div class="btn plain" data-act="finishJob">ຂ້າມ</div>
      <div class="btn pri" data-act="finishJob">ສົ່ງ ແລະ ຮັບງານຕໍ່</div></div></div>` });
}

/* ============================================================
   D17 · ເຫດຜົນການຍົກເລີກ
   ============================================================ */
function scrCancel(s){
  const r = reasonById(s.reason);
  const free = r ? r.free : null;
  return appScreen({ time:'21:50', title:'ຍົກເລີກງານ', body:`
    <div class="warnhead">${I('alert')}<div><b>ຍົກເລີກແລ້ວມີຜົນຕໍ່ອັດຕາຮັບງານ</b>
      <span>ອັດຕາປັດຈຸບັນ ${ME.accept}% · ຕ້ອງຮັກສາໃຫ້ເກີນ ${CFG.acceptTarget}%</span></div></div>
    <div class="grp">ເລືອກເຫດຜົນ</div>
    <div class="card2">
      ${REASONS.map(x => `<div class="reason ${s.reason === x.id ? 'on' : ''}" data-act="pickReason" data-v="${x.id}">
        <span class="emo">${x.emo}</span><b>${x.tx}</b>
        ${x.free ? '<em class="freetag">ບໍ່ຫັກຄະແນນ</em>' : ''}
        <i class="rad ${s.reason === x.id ? 'on' : ''}"></i></div>`).join('')}
    </div>
    ${r ? `<div class="card2 impact ${free ? 'ok' : 'bad'}" style="margin-top:10px;padding:12px 14px">
      <b>${free ? '✅ ເຫດຜົນນີ້ບໍ່ມີຜົນຕໍ່ທ່ານ' : '⚠️ ເຫດຜົນນີ້ມີຜົນຕໍ່ທ່ານ'}</b>
      <div class="fline"><span>ຄ່າປັບ</span><span>${free ? 'ບໍ່ມີ' : money(CFG.cancelPenalty)}</span></div>
      <div class="fline"><span>ອັດຕາຮັບງານ</span><span>${free ? 'ບໍ່ຫັກ' : 'ຫັກ 1 ຄັ້ງ'}</span></div>
      <div class="fline"><span>ລູກຄ້າ</span><span>${free ? 'ລະບົບຈັດຄົນຂັບໃໝ່ໃຫ້' : 'ລະບົບຈັດຄົນຂັບໃໝ່ໃຫ້'}</span></div>
    </div>` : ''}
    <div class="grow"></div>
    <div class="btm"><div class="row2">
      <div class="btn plain" data-act="goBack">ກັບໄປງານ</div>
      <div class="btn ${s.reason ? 'red' : 'dis'}" data-act="confirmCancel">ຢືນຢັນຍົກເລີກ</div></div></div>` });
}

/* ============================================================
   D18 · ໃບງານເໝົາລົດ
   ============================================================ */
function scrCharterJob(s){
  const j = JOBS.find(x => x.kind === 'charter') || JOBS[4];
  const rest = j.offer - (j.deposit || 0);
  const plan = [
    { t:'07:00', n:'ຮັບລູກຄ້າ ' + j.from.name, ic:'pin' },
    { t:'07:15', n:'ອອກເດີນທາງໄປ ວັງວຽງ', ic:'nav' },
    { t:'11:00', n:'ຮອດ ວັງວຽງ · ລູກຄ້າທ່ຽວ (ຈອດລໍ)', ic:'timer' },
    { t:'16:00', n:'ອອກຈາກ ວັງວຽງ ກັບນະຄອນຫຼວງ', ic:'route' },
    { t:'20:00', n:'ສົ່ງລູກຄ້າ ' + j.from.name + ' · ຈົບງານ', ic:'ok' }
  ];
  return appScreen({ time:'21:44', title:'ໃບງານເໝົາລົດ', body:`
    <div class="jobhero chtr">
      <div class="art">${carArt(carByKey(j.car).art, '#0f766e', '#ccfbf1')}</div>
      <div class="tx"><b>${j.route}</b><span>${carByKey(j.car).name} · ${j.when}</span></div>
      <b class="pz">${money(j.offer)}</b>
    </div>
    <div class="grp">ຕາຕະລາງເດີນທາງ (ປະມານ)</div>
    <div class="card2 plan">
      ${plan.map((p, i) => `<div class="prow ${i === 0 ? 'first' : ''}">
        <i>${I(p.ic)}</i><b>${p.t}</b><span>${p.n}</span></div>`).join('')}
    </div>
    <div class="grp">ເງື່ອນໄຂງານ</div>
    <div class="card2" style="padding:12px 14px">
      <div class="fline"><span>ໄລຍະທາງທີ່ລວມ</span><span>${j.km} km (ໄປ-ກັບ)</span></div>
      <div class="fline"><span>ເກີນຈາກນັ້ນ</span><span>4,800 ກີບ/ກມ</span></div>
      <div class="fline"><span>ມັດຈຳທີ່ລູກຄ້າຈ່າຍແລ້ວ</span><span style="color:var(--d-ok)">${money(j.deposit)}</span></div>
      <div class="fline total"><span>ຍອດທີ່ຕ້ອງເກັບໃນມື້ໃຊ້ງານ</span><span>${money(rest)}</span></div>
    </div>
    <div class="card2" style="padding:11px 14px;margin-top:10px">
      <div class="inclrow ok">${I('ok')}<span>ຄ່ານ້ຳມັນ ບໍລິສັດຮັບຜິດຊອບ (ລູກຄ້າຊື້ແພັກເກັດແລ້ວ)</span></div>
      <div class="inclrow ok">${I('ok')}<span>ຈອດລໍໄດ້ຕະຫຼອດ ບໍ່ຄິດຄ່າລໍ</span></div>
      <div class="inclrow no">${I('x')}<span>ຄ່າອາຫານ ແລະ ຄ່າເຂົ້າຊົມ ລູກຄ້າຮັບຜິດຊອບເອງ</span></div>
    </div>
    <div class="staffnote">${I('info')}<span>ບັນທຶກເລກໄມລ໌ <b>ກ່ອນອອກ</b> ແລະ <b>ຫຼັງຈົບງານ</b> ໃນແອັບ
      ເພື່ອຄິດ ກມ ສ່ວນເກີນໃຫ້ຖືກຕ້ອງ</span></div>
    <div class="card2">${paxCard(j, false)}</div>
    <div class="grow"></div>
    <div class="btm"><div class="row2">
      <div class="btn plain" data-act="declineJob">ປະຕິເສດ</div>
      <div class="btn pri" data-act="acceptCharter">ຮັບງານເໝົານີ້</div></div></div>` });
}

/* ============================================================
   D19 · ໃບງານຂັບລົດຂອງລູກຄ້າ
   ============================================================ */
function scrDriveMineJob(s){
  const j = JOBS.find(x => x.kind === 'drivemine') || JOBS[5];
  const mt = j.myCar.trans === 'manual';
  const ok = mt ? ME.manual : true;
  const insp = ['ຮອຍຂູດຂີດຮອບຄັນ', 'ລະດັບນ້ຳມັນ / ແບັດເຕີຣີ', 'ເລກໄມລ໌ປັດຈຸບັນ', 'ຂອງມີຄ່າໃນລົດ', 'ຢາງ ແລະ ໄຟ'];
  return appScreen({ time:'21:44', title:'ໃບງານຂັບລົດຂອງລູກຄ້າ', body:`
    <div class="jobhero dm">
      <div class="art">${carArt('pickup', '#5b21b6', '#e5dcff')}</div>
      <div class="tx"><b>${j.myCar.type} · ${j.myCar.plate}</b>
        <span>${mt ? 'ເກຍທຳມະດາ (MT)' : 'ເກຍອັດຕະໂນມັດ (AT)'} · ຂອງລູກຄ້າ</span></div>
      <b class="pz">${money(j.offer)}</b>
    </div>
    <div class="${ok ? 'staffnote' : 'warnrow bad'}">${I(ok ? 'ok' : 'alert')}<span>${ok
      ? `ທ່ານລົງທະບຽນວ່າ<b>ຂັບເກຍທຳມະດາໄດ້</b> — ຮັບງານນີ້ໄດ້`
      : `ງານນີ້ຕ້ອງການຄົນຂັບທີ່ຂັບ<b>ເກຍທຳມະດາ</b> — ທ່ານຍັງບໍ່ໄດ້ລົງທະບຽນ`}</span></div>
    <div class="grp">ວິທີໄປຫາລູກຄ້າ</div>
    <div class="card2">${rowItem({ ic:'moto2', color:'#7c3aed', t:'ໄປດ້ວຍລົດຈັກຂອງບໍລິສັດ',
      s:'ຫ່າງ ' + j.dist + ' km · ປະລົດຈັກໄວ້ຈຸດຮັບ ບໍລິສັດຈັດເກັບໃຫ້', chev:false })}</div>
    <div class="grp">ກວດສະພາບລົດກັບລູກຄ້າ (ບັງຄັບ)</div>
    <div class="card2">
      ${insp.map((x, i) => `<div class="chkrow ${(s.checks || []).includes('i' + i) ? 'on' : ''}"
        data-act="toggleCheck" data-v="i${i}">
        <i class="box">${(s.checks || []).includes('i' + i) ? I('check') : ''}</i>
        <div class="tx">${I('search')}<span>${x}</span></div></div>`).join('')}
    </div>
    <div class="grp">ຖ່າຍຮູບກ່ອນຂັບ (ບັງຄັບ)</div>
    <div class="photorow">${['ໜ້າ','ຫຼັງ','ຊ້າຍ','ຂວາ'].map(d => `
      <div class="ph" data-act="takePhoto" data-v="${d}">${I('camera')}<span>${d}</span></div>`).join('')}</div>
    <div class="safenote">📸 ຮູບ ແລະ ລາຍການກວດ ໃຊ້ເປັນຫຼັກຖານປ້ອງກັນຂໍ້ຂັດແຍ່ງ — ຖ່າຍໃຫ້ຄົບກ່ອນຮັບມອບລົດ</div>
    <div class="card2">${paxCard(j, false)}</div>
    <div class="grow"></div>
    <div class="btm"><div class="row2">
      <div class="btn plain" data-act="declineJob">ປະຕິເສດ</div>
      <div class="btn ${ok ? 'pri' : 'dis'}" data-act="acceptDriveMine">ຮັບມອບລົດ ແລະ ເລີ່ມງານ</div></div></div>` });
}
