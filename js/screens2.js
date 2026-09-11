/* ============================================================
   screens2.js — ໜ້າຈໍແອັບພະນັກງານ D20–D35
   (ລາຍໄດ້ · ຜົນງານ · ປະຫວັດ · ກະ · ລົດ&ເອກະສານ · ຂ່າວ · ບັນຊີ)
   ============================================================ */

/* ============================================================
   D24 · ຄຳຕິຊົມຈາກລູກຄ້າ
   ============================================================ */
function scrReviews(s){
  const f = s.revFilter || 0;
  const list = REVIEWS.filter(r => !f || r.st === f);
  const dist = [5,4,3,2,1].map(n => ({ n, c:REVIEWS.filter(r => r.st === n).length }));
  return appScreen({ time:'21:48', title:'ຄຳຕິຊົມຈາກລູກຄ້າ', state:s, body:`
    <div class="revhero">
      <div class="big"><b>${ME.rating.toFixed(1)}</b>${stars(5)}<span>ຈາກ ${ME.trips.toLocaleString()} ຖ້ຽວ</span></div>
      <div class="dist">${dist.map(d => `<div class="rw"><span>${d.n}★</span>
        <i><s style="width:${Math.round(d.c / REVIEWS.length * 100)}%"></s></i><b>${d.c}</b></div>`).join('')}</div>
    </div>
    <div class="grp">ປ້າຍຄຳທີ່ລູກຄ້າເລືອກຫຼາຍທີ່ສຸດ</div>
    <div class="tagchips">${['ຂັບລົດດີ ປອດໄພ','ສຸພາບ ເປັນມິດ','ລົດສະອາດ','ຮອດໄວ ຕົງເວລາ'].map(t => `<b class="on">${t}</b>`).join('')}</div>
    <div class="segs" style="margin-top:12px">
      ${[[0,'ທັງໝົດ'],[5,'5★'],[4,'4★'],[3,'≤3★']].map(([k, l]) =>
        `<b class="${f === k ? 'on' : ''}" data-act="revFilter" data-v="${k}">${l}</b>`).join('')}
    </div>
    ${list.length ? list.map(r => `<div class="card2 review" style="margin-bottom:9px">
      <div class="hd"><b>${r.by}</b>${stars(r.st)}<span class="rt">${r.date}</span></div>
      <p>${r.tx}</p></div>`).join('')
      : `<div class="empty">${I('star')}<b>ບໍ່ພົບຄຳຕິຊົມໃນໝວດນີ້</b></div>`}
    <div style="height:6px"></div>` });
}

/* ============================================================
   D25 · ປະຫວັດງານ
   ============================================================ */
function scrHistory(s){
  const f = s.histFilter || 'all';
  const list = (s.trips || HISTORY).filter(t => f === 'all' || t.status === f);
  const sum = list.filter(t => t.status === 'done').reduce((a, t) => a + t.fee + t.tip, 0);
  return `<div class="sb">${statusBar('21:48')}</div>
  ${appHead('ປະຫວັດງານ', { noBack:true, right:I('filter'), rightAct:'soon' })}
  <div class="sbody">
    <div class="segs">
      ${[['all','ທັງໝົດ'],['done','ສຳເລັດ'],['cancelled','ຍົກເລີກ']]
        .map(([k, l]) => `<b class="${f === k ? 'on' : ''}" data-act="histFilter" data-v="${k}">${l}</b>`).join('')}
    </div>
    <div class="sumrow"><span>${list.length} ງານ</span><b>ຄ່າຖ້ຽວລວມ ${money(sum)}</b></div>
    ${list.length ? list.map(t => `
      <div class="tripc ${t.status === 'cancelled' ? 'no' : ''}" data-act="openTrip" data-v="${t.id}">
        <div class="hd">${kindTag(t.kind)}
          <span class="st ${t.status === 'done' ? 'ok' : 'no'}">${t.status === 'done' ? 'ສຳເລັດ' : 'ຍົກເລີກ'}</span></div>
        <div class="rt">
          <div class="line"><i></i><s></s><i class="b"></i></div>
          <div class="ad"><div>${t.from}</div><div>${t.to}</div></div>
        </div>
        <div class="ft"><span style="font-size:11px;color:var(--d-dim)">${t.date}</span>
          ${t.rating ? stars(t.rating) : ''}
          <b>${t.status === 'done' ? '+' + money(t.fee + t.tip) : '—'}</b></div>
      </div>`).join('')
      : `<div class="empty">${I('receipt')}<b>ບໍ່ພົບງານໃນໝວດນີ້</b></div>`}
    <div style="height:10px"></div>
  </div>
  ${navBar('history', s)}${gestureBar}`;
}

/* ============================================================
   D26 · ລາຍລະອຽດງານ
   ============================================================ */
function scrHistoryDetail(s){
  const t = histById(s.openTripId || HISTORY[0].id);
  const done = t.status === 'done';
  return appScreen({ time:'21:48', title:'ລາຍລະອຽດງານ', state:s, body:`
    <div class="dethead ${done ? '' : 'no'}">
      ${kindTag(t.kind)}<b>${done ? money(t.fare) : 'ຍົກເລີກ'}</b>
      <span>${t.date} · ${t.id}</span>
    </div>
    <div class="card2" style="padding:12px 14px">
      <div class="rt2"><div class="line"><i></i><s></s><i class="b"></i></div>
        <div class="ad"><div><b>${t.from}</b></div><div><b>${t.to}</b></div></div></div>
    </div>
    ${done ? `
    <div class="grp">ລາຍການເງິນ</div>
    <div class="card2" style="padding:12px 14px">
      <div class="fline"><span>ຄ່າໂດຍສານ (ເກັບໃຫ້ບໍລິສັດ)</span><span>${money(t.fare)}</span></div>
      <div class="fline"><span>ວິທີຈ່າຍ</span><span>${t.pay}</span></div>
      <div class="fline"><span>ຄ່າຖ້ຽວຂອງທ່ານ</span><span>${money(t.fee)}</span></div>
      ${t.tip ? `<div class="fline"><span>ທິບ</span><span style="color:var(--d-ok)">+${money(t.tip)}</span></div>` : ''}
      <div class="fline total"><span>ທ່ານໄດ້ຮັບ</span><span style="color:var(--d-ok)">${money(t.fee + t.tip)}</span></div>
    </div>
    <div class="grp">ຂໍ້ມູນຖ້ຽວ</div>
    <div class="card2" style="padding:12px 14px">
      <div class="fline"><span>ໄລຍະທາງ</span><span>${t.km} km</span></div>
      <div class="fline"><span>ເວລາ</span><span>${t.min} ນາທີ</span></div>
      <div class="fline"><span>ລູກຄ້າ</span><span>${t.pax}</span></div>
      <div class="fline"><span>ຄະແນນທີ່ໄດ້</span><span>${t.rating ? t.rating + ' ★' : 'ບໍ່ໃຫ້ຄະແນນ'}</span></div>
    </div>`
    : `<div class="warnrow">${I('alert')}<span>${t.why || 'ຍົກເລີກ'} — ບໍ່ຖືກຫັກຄະແນນ</span></div>`}
    <div class="grp">ຕ້ອງການຄວາມຊ່ວຍເຫຼືອ</div>
    <div class="card2">
      ${rowItem({ ic:'box', color:'#0ea5e9', t:'ແຈ້ງເຄື່ອງລູກຄ້າລືມໄວ້', s:'ພາຍໃນ 24 ຊົ່ວໂມງ', act:'soon' })}
      ${rowItem({ ic:'alert', color:'#e1252b', t:'ລາຍງານບັນຫາຂອງຖ້ຽວນີ້', s:'ສົ່ງໃຫ້ສູນຄວບຄຸມ', act:'soon' })}
    </div>
    <div style="height:8px"></div>` });
}

/* ============================================================
   D29 · ລົດຂອງຂ້ອຍ
   ============================================================ */
function scrMyCar(s){
  const c = ME.car;
  return appScreen({ time:'21:50', title:'ລົດຂອງຂ້ອຍ', state:s, body:`
    <div class="carhero">
      <div class="art">${carArt(c.art, '#26292d', '#dce5ec')}</div>
      <b>${c.plate}</b><span>${c.model} · ${c.color} · ປີ ${c.year}</span>
      <em class="cls">${c.name}${c.ev ? ' · EV' : ''} · ${c.seats} ບ່ອນນັ່ງ</em>
    </div>
    <div class="grp">ສະພາບປັດຈຸບັນ</div>
    <div class="card2" style="padding:14px">
      <div class="battrow">${I('bolt')}<div class="tx"><b>ນ້ຳມັນ ${c.fuel}%</b><span>ຂັບໄດ້ປະມານ ${Math.round(c.fuel * 5.4)} km</span></div></div>
      <div class="batt"><i style="width:${c.fuel}%"></i></div>
      <div class="statrow" style="margin-top:14px">
        <div><b>${(s.odo || c.odo).toLocaleString()}</b><span>ເລກໄມລ໌ (km)</span></div>
        <div><b>${(TODAY.km).toFixed(1)}</b><span>ຂັບມື້ນີ້ (km)</span></div>
        <div><b>2,750</b><span>ຮອດກຳນົດປ່ຽນຖ່າຍ</span></div>
      </div>
    </div>
    <div class="grp">ບັນທຶກ</div>
    <div class="card2">
      ${rowItem({ ic:'bolt', color:'#12a150', t:'ບັນທຶກການຕື່ມນ້ຳມັນ', s:'ຄັ້ງລ່າສຸດ 10/09 · 06:05 · 180,000 ກີບ', act:'soon' })}
      ${rowItem({ ic:'doc', color:'#0ea5e9', t:'ນັດກວດສະພາບລົດ', s:'ຮອດກຳນົດ 28/09/2026', act:'goDocs' })}
      ${rowItem({ ic:'swap', color:'#0891b2', t:'ປ່ຽນລົດທີ່ໃຊ້ຮັບງານ', s:'ຕ້ອງແນບເອກະສານ ແລະ ກວດສະພາບໃໝ່', act:'soon' })}
      ${rowItem({ ic:'alert', color:'#e1252b', t:'ແຈ້ງລົດເສຍ / ຢຸດຮັບງານຊົ່ວຄາວ', s:'ແຈ້ງສູນເພື່ອບໍ່ໃຫ້ສົ່ງງານມາ', act:'reportCar' })}
    </div>
    ${c.own
      ? `<div class="warnrow">${I('info')}<span>ລົດຄັນນີ້ເປັນ<b>ຂອງທ່ານເອງ</b> — ຄ່ານ້ຳມັນ, ຄ່າສ້ອມແປງ ແລະ ປະກັນໄພ
          ທ່ານຮັບຜິດຊອບເອງ. ຕ້ອງຜ່ານການກວດສະພາບກັບບໍລິສັດທຸກ 6 ເດືອນ</span></div>`
      : `<div class="staffnote">${I('info')}<span>ລົດຄັນນີ້ເປັນ<b>ຊັບສິນຂອງບໍລິສັດ</b> — ຄ່າສ້ອມແປງ, ຄ່າຊາດໄຟ ແລະ ປະກັນໄພ ບໍລິສັດຮັບຜິດຊອບທັງໝົດ</span></div>`}
    <div style="height:8px"></div>` });
}

/* ============================================================
   D30 · ເອກະສານ & ໃບອະນຸຍາດ
   ============================================================ */
function scrDocs(s){
  const st = d => d.days <= 0 ? ['bad','ໝົດອາຍຸແລ້ວ'] : d.days <= 30 ? ['warn','ເຫຼືອ ' + d.days + ' ວັນ'] : ['ok','ປົກກະຕິ'];
  const bad = DOCS.filter(d => d.days <= 30);
  return appScreen({ time:'21:50', title:'ເອກະສານ & ໃບອະນຸຍາດ', state:s, body:`
    ${bad.length ? `<div class="warnrow">${I('alert')}<span>ມີ <b>${bad.length}</b> ລາຍການໃກ້ໝົດອາຍຸ —
      ເອກະສານໝົດອາຍຸຈະ<b>ຮັບງານບໍ່ໄດ້</b></span></div>` : ''}
    <div class="grp">ເອກະສານ ${DOCS.length} ລາຍການ</div>
    ${DOCS.map(d => { const [k, l] = st(d);
      return `<div class="card2 docrow ${k}" data-act="soon">
        <div class="ic">${I(d.ic)}</div>
        <div class="tx"><b>${d.n}</b><span>${d.no}</span></div>
        <div class="rt"><em class="st ${k}">${l}</em><span>ໝົດ ${d.exp}</span></div>
      </div>`; }).join('')}
    <div class="grp">ຈັດການ</div>
    <div class="card2">
      ${rowItem({ ic:'camera', color:'#0ea5e9', t:'ອັບໂຫຼດຮູບເອກະສານໃໝ່', s:'ເຈົ້າໜ້າທີ່ຈະກວດພາຍໃນ 1 ວັນ', act:'soon' })}
      ${rowItem({ ic:'calendar', color:'#12a150', t:'ນັດຕໍ່ອາຍຸ / ກວດສະພາບ', s:'ນັດຜ່ານແອັບ ຫຼື ໂທ ' + CFG.hotline, act:'soon' })}
    </div>
    <div style="height:8px"></div>` });
}

/* ============================================================
   D31 · ແຈ້ງເຕືອນ
   ============================================================ */
function scrNotifications(s){
  const list = s.notifs || NOTIFS;
  return appScreen({ time:'21:51', title:'ແຈ້ງເຕືອນ', state:s,
    right:'<b class="mini" style="color:var(--d-brand)">ອ່ານທັງໝົດ</b>', rightAct:'readAll', body:`
    <div class="card2" style="margin-top:12px">
      ${list.map(n => `<div class="rowitem ${n.unread ? 'un' : ''}" data-act="readNotif" data-v="${n.id}">
        <div class="ic" style="background:${n.unread ? '#fdecec' : '#f5f6f8'};color:${n.unread ? '#e1252b' : '#5a6472'}">${I(n.ic)}</div>
        <div class="tx"><b>${n.title}</b><span>${n.body}</span></div>
        <div class="rt"><span style="font-size:10.5px">${n.time}</span>${n.unread ? '<em class="dotr"></em>' : ''}</div></div>`).join('')}
    </div>
    <div style="height:8px"></div>` });
}

/* ============================================================
   D32 · ປະກາດຈາກບໍລິສັດ
   ============================================================ */
function scrAnnounce(s){
  const open = s.openAnn;
  return appScreen({ time:'21:51', title:'ປະກາດຈາກບໍລິສັດ', state:s, body:`
    <div style="height:12px"></div>
    ${ANNOUNCE.map(a => `<div class="anncard ${a.hot ? 'hot' : ''} ${open === a.id ? 'open' : ''}" data-act="openAnn" data-v="${a.id}">
      <div class="hd"><em class="tag">${a.tag}</em><b>${a.title}</b><i>${I('chev')}</i></div>
      <div class="dt">${a.date} · Insee Drive</div>
      ${open === a.id ? `<p>${a.body}</p>` : ''}
    </div>`).join('')}
    <div class="safenote">📢 ປະກາດທີ່ຕິດປ້າຍ “ດ່ວນ” ຈະສົ່ງ push ໃຫ້ທຸກຄົນຂັບໃນເຂດທັນທີ</div>
    <div style="height:8px"></div>` });
}

/* ============================================================
   D33 · ຄວາມປອດໄພ & SOS
   ============================================================ */
function scrSafety(s){
  return appScreen({ time:'21:52', title:'ຄວາມປອດໄພ & SOS', state:s, body:`
    <div class="sos ${s.sos ? 'on' : ''}" data-act="sos">
      <div class="ring"></div><b>SOS</b><span>${s.sos ? 'ສົ່ງແລ້ວ · ສູນກຳລັງຕິດຕໍ່ກັບມາ' : 'ກົດຄ້າງ 3 ວິນາທີ'}</span>
    </div>
    <div class="safenote">🛡 ກົດ SOS ຈະສົ່ງ <b>ຕຳແໜ່ງສົດ, ລະຫັດພະນັກງານ ແລະ ຂໍ້ມູນຖ້ຽວປັດຈຸບັນ</b>
      ໃຫ້ສູນຄວບຄຸມທັນທີ ພ້ອມເປີດສາຍສົນທະນາ</div>
    <div class="grp">ເຄື່ອງມືຄວາມປອດໄພ</div>
    <div class="card2">
      <div class="rowitem" data-act="toggleShare"><div class="ic" style="background:var(--d-okbg);color:var(--d-ok)">${I('locate')}</div>
        <div class="tx"><b>ແບ່ງປັນຕຳແໜ່ງກັບສູນ</b><span>ສູນເຫັນຕຳແໜ່ງທ່ານຕະຫຼອດກະ</span></div>${sw(s.sharing)}</div>
      <div class="rowitem" data-act="toggleRec"><div class="ic" style="background:var(--d-warnbg);color:var(--d-warn)">${I('camera')}</div>
        <div class="tx"><b>ບັນທຶກສຽງໃນລົດ</b><span>ເກັບ 72 ຊົ່ວໂມງ · ໃຊ້ເມື່ອມີຂໍ້ຂັດແຍ່ງ</span></div>${sw(s.recording)}</div>
      ${rowItem({ ic:'alert', color:'#e1252b', t:'ລາຍງານເຫດການ', s:'ອຸບັດຕິເຫດ · ຜູ້ໂດຍສານກໍ່ກວນ · ອື່ນໆ', act:'soon' })}
    </div>
    <div class="grp">ເບີສຸກເສີນ</div>
    <div class="card2">
      ${EMERGENCY.map(e => rowItem({ ic:e.ic, color:'#e1252b', t:e.name, s:e.num, r:'<b class="mini">ໂທ</b>', act:'callCenter' })).join('')}
    </div>
    <div style="height:8px"></div>` });
}

/* ============================================================
   D35 · ຕັ້ງຄ່າ & ຊ່ວຍເຫຼືອ
   ============================================================ */
function scrSettings(s){
  const st = s.settings || { nav:'gmap', sound:true, vibrate:true, lang:'lo', kinds:{} };
  const NAVAPPS = [['inapp','ນຳທາງໃນແອັບ (ແນະນຳ)','ຄຳສັ່ງລ້ຽວພາສາລາວ · ບໍ່ຕ້ອງສະຫຼັບແອັບ'],
                   ['gmap','Google Maps','ສົ່ງເສັ້ນທາງອອກໄປ Google Maps'],
                   ['osm','OpenStreetMap','ສຳລັບເຄື່ອງທີ່ບໍ່ມີ Google Play']];
  const KINDKEYS = ['taxi','pick','sched','airport','moto','charter','drivemine'];
  return appScreen({ time:'21:53', title:'ຕັ້ງຄ່າ & ຊ່ວຍເຫຼືອ', state:s, body:`
    <div class="grp">ການນຳທາງ</div>
    <div class="card2">
      ${NAVAPPS.map(([k, n, d]) => `<div class="rowitem" data-act="setNav" data-v="${k}">
        <div class="ic" style="background:var(--d-infobg);color:var(--d-info)">${I('nav')}</div>
        <div class="tx"><b>${n}</b><span>${d}</span></div>
        <div class="rt"><i class="rad ${st.nav === k ? 'on' : ''}"></i></div></div>`).join('')}
    </div>
    <div class="grp">ການແຈ້ງງານ</div>
    <div class="card2">
      <div class="rowitem" data-act="toggle" data-v="sound"><div class="ic">${I('bell')}</div>
        <div class="tx"><b>ສຽງແຈ້ງງານໃໝ່</b><span>ດັງແມ່ນເຖິງເປີດໂໝດງຽບ</span></div>${sw(st.sound)}</div>
      <div class="rowitem" data-act="toggle" data-v="vibrate"><div class="ic">${I('alert')}</div>
        <div class="tx"><b>ສັ່ນເຕືອນ</b></div>${sw(st.vibrate)}</div>
      <div class="rowitem" data-act="navMute"><div class="ic">${I('nav')}</div>
        <div class="tx"><b>ສຽງແຈ້ງທາງລະຫວ່າງນຳທາງ</b><span>ອ່ານຄຳສັ່ງລ້ຽວກ່ອນຮອດຈຸດລ້ຽວ</span></div>
        ${sw(typeof NAV === 'undefined' || !NAV.muted)}</div>
    </div>
    <div class="grp">ປະເພດງານທີ່ຮັບ</div>
    <div class="card2">
      ${KINDKEYS.map(k => `<div class="rowitem" data-act="toggleKind" data-v="${k}">
        <div class="ic" style="background:${kindOf(k).color}18;color:${kindOf(k).color}">${I(kindOf(k).ic)}</div>
        <div class="tx"><b>${kindOf(k).n}</b></div>${sw(st.kinds[k])}</div>`).join('')}
    </div>
    <div class="chnote">ປິດປະເພດງານໃດໜຶ່ງ ຈະບໍ່ຖືກນັບເປັນການປະຕິເສດ ແລະ ບໍ່ມີຜົນຕໍ່ອັດຕາຮັບງານ</div>
    <div class="grp">ຄຳຖາມທີ່ພົບເລື້ອຍ</div>
    <div class="card2">
      ${FAQ.map((f, i) => `<div class="faq ${s.faqOpen === i ? 'on' : ''}" data-act="faqOpen" data-v="${i}">
        <div class="q"><b>${f.q}</b>${I('chev')}</div>
        ${s.faqOpen === i ? `<p>${f.a}</p>` : ''}</div>`).join('')}
    </div>
    <div class="grp">ຕິດຕໍ່</div>
    <div class="card2">
      ${rowItem({ ic:'headset', color:'#e1252b', t:'ໂທສູນຄວບຄຸມ ' + CFG.hotline, s:'24 ຊົ່ວໂມງ', act:'callCenter' })}
      ${rowItem({ ic:'userc', color:'#0ea5e9', t:'ຫົວໜ້າສາຂາ', s:ME.supervisor, act:'callCenter' })}
    </div>
    <div style="height:10px"></div>` });
}

/* ============================================================
   D26 · ລາຍໄດ້
   ============================================================ */
function scrEarnings(s){
  const k = s.earnKey || 'day', e = EARN[k];
  const comm = feeOf(e.fare);
  const mine = e.fare - comm + e.tips;
  const max = Math.max(...WEEKBAR.map(w => w.fare));
  return `<div class="sb">${statusBar('21:46')}</div>
  ${appHead('ລາຍໄດ້', { noBack:true, right:I('download'), rightAct:'soon' })}
  <div class="sbody">
    <div class="segs">${EARN_KEYS.map(x => `<b class="${k === x ? 'on' : ''}" data-act="earnPeriod" data-v="${x}">${EARN[x].label}</b>`).join('')}</div>
    <div class="earnbig">
      <span>ລາຍໄດ້ສຸດທິ · ${e.label}</span>
      <b>${money(mine)}</b>
      <div class="sub">${e.trips} ຖ້ຽວ · ${e.hours} ຊົ່ວໂມງ · ສະເລ່ຍ ${money(Math.round(mine / e.trips / 100) * 100)}/ຖ້ຽວ</div>
    </div>
    <div class="grp">ຄິດແນວໃດ</div>
    <div class="card2" style="padding:12px 14px">
      <div class="fline"><span>ຄ່າໂດຍສານລວມ (${e.trips} ຖ້ຽວ)</span><span>${money(e.fare)}</span></div>
      <div class="fline"><span>ຄ່າທຳນຽມບໍລິການ ${Math.round(feePctOf() * 100)}%${zeroFee() ? ' <em class="ptag ok">ໂປຣ</em>' : ''}</span>
        <span style="color:${zeroFee() ? 'var(--d-ok)' : 'var(--d-bad)'}">${zeroFee() ? '0' : '−' + money(comm)}</span></div>
      <div class="fline"><span>ທິບຈາກລູກຄ້າ (ໄດ້ 100%)</span><span style="color:var(--d-ok)">+${money(e.tips)}</span></div>
      <div class="fline total"><span>ລາຍໄດ້ສຸດທິຂອງທ່ານ</span><span>${money(mine)}</span></div>
    </div>
    <div class="grp">7 ມື້ຜ່ານມາ</div>
    <div class="card2 bars">
      ${WEEKBAR.map(w => `<div class="bar ${w.today ? 'on' : ''}">
        <i style="height:${Math.round(w.fare / max * 100)}%"></i>
        <b>${w.trips}</b><span>${w.d}</span></div>`).join('')}
    </div>
    <div class="grp">ກະເປົາເງິນ & ຄ່າທຳນຽມ</div>
    <div class="card2">
      ${rowItem({ ic:'coins', color:'#2fbf71', t:'ກະເປົາເງິນ', s:'ເຕີມເງິນ · ຖອນເງິນ',
        r:'<b class="mini">' + money(walBal(s)) + '</b>', act:'goWallet' })}
      ${rowItem({ ic:'percent', color:zeroFee() ? '#2fbf71' : '#f0921f',
        t:zeroFee() ? 'ຄ່າທຳນຽມບໍລິການ' : 'ຄ່າທຳນຽມຄ້າງຈ່າຍ',
        s:zeroFee() ? 'ໂປຣໂມຊັນຮອດ ' + CFG.zeroFeeUntil : 'ຕັດຍອດ' + CFG.feeCycle,
        r:'<b class="mini' + (zeroFee() ? ' ok' : '') + '">' + (zeroFee() ? '0%' : money(feeTotal(s))) + '</b>', act:'goPayFee' })}
      ${rowItem({ ic:'receipt', color:'#12a150', t:'ປະຫວັດການຈ່າຍ', s:FEE_PAID.length + ' ຮອບຜ່ານມາ', act:'goFeeHistory' })}
    </div>
    ${zeroFee() ? `<div class="safenote">🎉 ຄ່າທຳນຽມ 0% — ຄ່າໂດຍສານ ${money(e.fare)} ເປັນຂອງທ່ານເຕັມ
      (ຖ້າເປັນອັດຕາເກົ່າ ${Math.round(CFG.commissionWas * 100)}% ຈະຖືກຫັກ ${money(Math.round(e.fare * CFG.commissionWas / 100) * 100)})</div>`
      : `<div class="safenote">💡 ຄ່າທຳນຽມຄິດເປັນ ${Math.round(feePctOf() * 100)}% ຂອງຄ່າໂດຍສານ (ບໍ່ຫັກທິບ)</div>`}
    <div style="height:10px"></div>
  </div>
  ${navBar('earnings', s)}${gestureBar}`;
}

/* ============================================================
   D27 · ຈ່າຍຄ່າທຳນຽມ
   ============================================================ */
function scrPayFee(s){
  const total = feeTotal(s), pct = feePct(s);
  const amt = s.payAmt !== undefined && s.payAmt !== null ? s.payAmt : total;
  const via = s.payVia || 'qr';
  if (zeroFee()) return appScreen({ time:'21:47', title:'ຄ່າທຳນຽມບໍລິການ', state:s, body:`
    <div class="zerohero">
      <i>${I('gift')}</i>
      <b>0%</b>
      <span>ບໍລິສັດ<b>ບໍ່ຫັກຄ່າທຳນຽມ</b>ຈາກຖ້ຽວຂອງທ່ານ<br>ຄ່າໂດຍສານ ແລະ ທິບເປັນຂອງທ່ານ 100%</span>
      <em>ໂປຣໂມຊັນຮອດ ${CFG.zeroFeeUntil}</em>
    </div>
    <div class="grp">ປຽບທຽບກັບອັດຕາເກົ່າ</div>
    <div class="card2" style="padding:12px 14px">
      <div class="fline"><span>ຄ່າໂດຍສານອາທິດນີ້</span><span>${money(EARN.week.fare)}</span></div>
      <div class="fline"><span>ອັດຕາເກົ່າ ${Math.round(CFG.commissionWas * 100)}% ຈະຖືກຫັກ</span>
        <span style="color:var(--d-dim)">−${money(Math.round(EARN.week.fare * CFG.commissionWas / 100) * 100)}</span></div>
      <div class="fline total"><span>ດຽວນີ້ຖືກຫັກ</span><span style="color:var(--d-ok)">0 ${CFG.currency}</span></div>
    </div>
    <div class="card2" style="margin-top:10px">
      ${rowItem({ ic:'ok', color:'#2fbf71', t:'ບໍ່ມີຍອດຄ້າງຈ່າຍ', s:'ບໍ່ຕ້ອງນຳສົ່ງເງິນສົດ ແລະ ບໍ່ຖືກຢຸດສົ່ງງານ', chev:false })}
      ${rowItem({ ic:'receipt', color:'#5a9bf0', t:'ປະຫວັດການຈ່າຍຮອບເກົ່າ', s:'ກ່ອນເລີ່ມໂປຣໂມຊັນ', act:'goFeeHistory' })}
      ${rowItem({ ic:'bell', color:'#f0921f', t:'ຈະແຈ້ງລ່ວງໜ້າ 30 ວັນ', s:'ຖ້າມີການປ່ຽນແປງອັດຕາຄ່າທຳນຽມ', chev:false })}
    </div>
    <div class="grow"></div>
    <div class="btm"><div class="btn plain" data-act="goWallet">ໄປກະເປົາເງິນ</div></div>` });

  return appScreen({ time:'21:47', title:'ຈ່າຍຄ່າທຳນຽມ', state:s, body:`
    <div class="remithero ${pct >= 100 ? 'over' : pct >= 70 ? 'warn' : ''}">
      <span>ຄ່າທຳນຽມບໍລິການທີ່ຍັງບໍ່ໄດ້ຈ່າຍ</span>
      <b>${money(total)}</b>
      <div class="bar"><i style="width:${pct}%"></i></div>
      <div class="lg"><span>ຕັດຍອດ${CFG.feeCycle}</span><span>ຂີດຈຳກັດ ${money(CFG.feeDueLimit)}</span></div>
      ${pct >= 100 ? '<div class="stop">⛔ ເກີນຂີດຈຳກັດ — ລະບົບຢຸດສົ່ງງານໃໝ່ຈົນກວ່າຈະຈ່າຍ</div>' : ''}
    </div>
    <div class="safenote">ℹ️ ຄ່າໂດຍສານ ແລະ ເງິນສົດທັງໝົດເປັນຂອງທ່ານ — ບໍລິສັດຫັກແຕ່ຄ່າທຳນຽມ
      ${Math.round(feePctOf() * 100)}% ຂອງແຕ່ລະຖ້ຽວ ສະສົມໄວ້ຈ່າຍເປັນຮອບ</div>
    <div class="grp">ຄ່າທຳນຽມແຕ່ລະຖ້ຽວ (${feeList(s).length})</div>
    <div class="card2">
      ${feeList(s).map(c => `<div class="rowitem" data-act="noop">
        <div class="ic" style="background:var(--d-warnbg);color:var(--d-warn)">${I('cash')}</div>
        <div class="tx"><b>${c.tx}</b><span>${c.time} · ຄ່າໂດຍສານ ${c.fare.toLocaleString()}</span></div>
        <div class="rt"><b style="color:var(--d-ink);font-size:13px">${c.amt.toLocaleString()}</b></div></div>`).join('')}
    </div>
    <div class="grp">ຈຳນວນທີ່ຈະຈ່າຍ</div>
    <div class="pricebox">
      <i class="${amt <= 0 ? 'dis' : ''}" data-act="payMinus">−</i>
      <div class="v"><b>${amt.toLocaleString()}</b><span>${CFG.currency}</span></div>
      <i class="${amt >= total ? 'dis' : ''}" data-act="payPlus">+</i>
    </div>
    <div class="quickbid"><b class="on" data-act="payAll">ຈ່າຍທັງໝົດ</b></div>
    <div class="grp">ຊ່ອງທາງຈ່າຍ</div>
    <div class="card2">
      ${PAY_WAYS.map(p => { const enough = p.k !== 'wallet' || walBal(s) >= amt;
        const sub = p.k === 'wallet'
          ? 'ຍອດຄົງເຫຼືອ ' + money(walBal(s)) + (enough ? '' : ' · ບໍ່ພຽງພໍ')
          : p.s;
        return `<div class="rowitem" data-act="payVia" data-v="${p.k}">
        <div class="ic" style="background:var(--d-okbg);color:var(--d-ok)">${I(p.ic)}</div>
        <div class="tx"><b>${p.n}</b><span${enough ? '' : ' style="color:var(--d-bad)"'}>${sub}</span></div>
        <div class="rt"><i class="rad ${via === p.k ? 'on' : ''}"></i></div></div>`; }).join('')}
      ${walAuto(s) ? `<div class="paxnote inner">${I('info')}<span>ເປີດ “ຫັກຄ່າທຳນຽມອັດຕະໂນມັດ” ຢູ່ —
        ຖ້າຍອດກະເປົາພຽງພໍ ລະບົບຈະຫັກໃຫ້ເອງທຸກຖ້ຽວ ບໍ່ຕ້ອງມາຈ່າຍເອງ</span></div>` : ''}
    </div>
    ${via === 'qr' ? `<div class="card2 qrmini" style="margin-top:10px">${qrBox('insee-fee://' + ME.code + '/' + amt, 132)}
      <div class="tx"><b>ສະແກນເພື່ອໂອນເຂົ້າບັນຊີບໍລິສັດ</b><span>${money(amt)} · ຢືນຢັນອັດຕະໂນມັດພາຍໃນ 1 ນາທີ</span></div></div>` : ''}
    <div class="grow"></div>
    <div class="btm">
      <div class="btmsum"><span>ຫຼັງຈາກນີ້ ຄ່າທຳນຽມຄ້າງຈະເຫຼືອ ${money(total - amt)}</span><b>${money(amt)}</b></div>
      <div class="btn ${amt > 0 ? 'pri' : 'dis'}" data-act="confirmPay">ຢືນຢັນຈ່າຍຄ່າທຳນຽມ</div></div>` });
}

/* ============================================================
   D28 · ປະຫວັດການຈ່າຍຄ່າທຳນຽມ
   ============================================================ */
function scrFeeHistory(s){
  return appScreen({ time:'21:47', title:'ປະຫວັດການຈ່າຍຄ່າທຳນຽມ', state:s, body:`
    <div class="safenote">📅 ລະບົບຕັດຍອດ${CFG.feeCycle} ເວລາ 00:00 ແລະ ໃຫ້ເວລາຈ່າຍ 3 ວັນ</div>
    ${FEE_PAID.map(p => `
      <div class="card2" style="margin-bottom:10px;padding:12px 14px">
        <div class="pyhd"><b>ຮອບ ${p.cycle}</b>
          <span class="st ${p.status === 'zero' ? 'warn' : 'ok'}">${p.status === 'zero' ? 'ຄ່າທຳນຽມ 0%' : 'ຈ່າຍແລ້ວ'}</span></div>
        <div class="fline"><span>ຈຳນວນຖ້ຽວ</span><span>${p.trips} ຖ້ຽວ</span></div>
        <div class="fline"><span>ຄ່າໂດຍສານລວມ</span><span>${money(p.fare)}</span></div>
        <div class="fline"><span>ຊ່ອງທາງ</span><span>${p.via} · ${p.paid}</span></div>
        <div class="fline total"><span>ຄ່າທຳນຽມທີ່ຈ່າຍ</span><span>${money(p.amt)}</span></div>
        ${p.status === 'zero' ? '' : `<div class="pyft" data-act="soon">${I('download')} ດາວໂຫຼດໃບຮັບເງິນ PDF</div>`}
      </div>`).join('')}
    <div style="height:6px"></div>` });
}

/* ============================================================
   D29 · ຄະແນນ & ຜົນງານ
   ============================================================ */
function scrPerformance(s){
  const max = Math.max(...WEEKBAR.map(w => w.trips));
  const t = tierOf(), nx = nextTier();
  return `<div class="sb">${statusBar('21:47')}</div>
  ${appHead('ຄະແນນ & ຜົນງານ', { noBack:true })}
  <div class="sbody">
    <div class="ratehero">
      <b>${ME.rating.toFixed(1)}</b>
      ${stars(Math.round(ME.rating))}
      <span>ຈາກ ${ME.trips.toLocaleString()} ຖ້ຽວ</span>
      <em class="tier">${I('badge')}ລະດັບ${t.n}${zeroFee() ? ' · ຄ່າທຳນຽມ 0%' : ' · ຄ່າທຳນຽມ ' + Math.round(feePctOf() * 100) + '%'}</em>
      ${nx ? `<div class="nxt"><div class="tr"><i style="width:${Math.round(ME.rating / nx.min * 100)}%"></i></div>
        <span>ອີກ <b>${(nx.min - ME.rating).toFixed(1)}★</b> ຈະຂຶ້ນລະດັບ${nx.n} — ${nx.s}</span></div>` : ''}
    </div>
    <div class="grp">ລະດັບຄົນຂັບ</div>
    <div class="card2">
      ${TIERS.map(x => `<div class="rowitem ${x.k === t.k ? 'un' : ''}" data-act="noop">
        <div class="ic" style="background:${x.k === t.k ? '#fff4e5' : '#f5f6f8'};color:${x.k === t.k ? '#a8641a' : '#9aa0a6'}">${I('badge')}</div>
        <div class="tx"><b>${x.n} ${x.min ? '· ' + x.min.toFixed(1) + '★ ຂຶ້ນໄປ' : ''}</b><span>${x.s}</span></div>
        <div class="rt">${x.k === t.k ? '<em class="st ok">ປັດຈຸບັນ</em>' : ''}</div></div>`).join('')}
    </div>
    <div class="grp">ຕົວຊີ້ວັດ 7 ມື້ຜ່ານມາ</div>
    ${KPI.map(x => { const good = x.low ? x.v <= x.target : x.v >= x.target;
      const w = x.fmt === 'star' ? x.v / 5 * 100 : Math.min(100, x.low ? (1 - x.v / (x.target * 2)) * 100 : x.v);
      return `<div class="card2 kpicard ${good ? '' : 'bad'}">
        <div class="hd"><b>${x.n}</b><span class="v">${x.fmt === 'star' ? x.v.toFixed(1) : x.v}${x.unit}</span></div>
        <div class="track"><i style="width:${w}%"></i>
          <s style="left:${x.fmt === 'star' ? x.target / 5 * 100 : (x.low ? (1 - x.target / (x.target * 2)) * 100 : x.target)}%"></s></div>
        <div class="ft"><span>${x.hint}</span><em>${good ? '✅ ຜ່ານເປົ້າ' : '⚠️ ຕ່ຳກວ່າເປົ້າ'} ${x.low ? '≤' : '≥'} ${x.target}${x.unit}</em></div>
      </div>`; }).join('')}
    <div class="grp">ຖ້ຽວ 7 ມື້</div>
    <div class="card2 bars">
      ${WEEKBAR.map(w => `<div class="bar ${w.today ? 'on' : ''}">
        <i style="height:${Math.round(w.trips / max * 100)}%"></i><b>${w.trips}</b><span>${w.d}</span></div>`).join('')}
    </div>
    <div class="grp">ວິທີເພີ່ມຄະແນນ</div>
    <div class="card2">
      ${rowItem({ ic:'star', color:'#f0921f', t:'ຄຳຕິຊົມຈາກລູກຄ້າ', s:REVIEWS.length + ' ລາຍການ · ສະເລ່ຍ ' + ME.rating.toFixed(1), act:'goReviews' })}
      ${rowItem({ ic:'timer', color:'#0ea5e9', t:'ຮອດຈຸດຮັບຕົງເວລາ', s:'ຖ້າຊ້າ ໃຫ້ແຈ້ງລູກຄ້າລ່ວງໜ້າທຸກຄັ້ງ', chev:false })}
      ${rowItem({ ic:'leaf', color:'#12a150', t:'ລົດສະອາດ ນ້ຳດື່ມພ້ອມ', s:'ເປັນປ້າຍຄຳທີ່ລູກຄ້າເລືອກຫຼາຍທີ່ສຸດ', chev:false })}
    </div>
    <div style="height:10px"></div>
  </div>
  ${navBar('performance', s)}${gestureBar}`;
}

/* ============================================================
   D38 · ບັນຊີຂອງຂ້ອຍ
   ============================================================ */
function scrProfile(s){
  const unread = (s.notifs || NOTIFS).filter(n => n.unread).length;
  const t = tierOf();
  return `<div class="sb">${statusBar('21:52')}</div>
  ${appHead('ບັນຊີຂອງຂ້ອຍ', { noBack:true })}
  <div class="sbody">
    <div class="dprof">
      <div class="av">${personArt('user')}</div>
      <b>${ME.name}</b>
      <span class="staffbadge">${I('badge')}${ME.code}</span>
      <span class="sub">ຄົນຂັບ Insee Drive · ຮ່ວມງານຕັ້ງແຕ່ ${ME.since}</span>
      <div class="statrow">
        <div><b>${ME.rating.toFixed(1)}</b><span>ຄະແນນ</span></div>
        <div><b>${ME.trips.toLocaleString()}</b><span>ຖ້ຽວ</span></div>
        <div><b>${ME.onTime}%</b><span>ຕົງເວລາ</span></div>
      </div>
    </div>
    <div class="card2 tiercard" style="margin:12px" data-act="goPerformance">
      ${I('badge')}<div><b>ລະດັບ${t.n}</b><span>${t.s}</span></div>
      <b class="pz">${ME.rating.toFixed(1)}★</b>
    </div>
    <div class="grp">ຂໍ້ມູນຄົນຂັບ</div>
    <div class="card2" style="padding:12px 14px">
      <div class="fline"><span>ເບີໂທ</span><span>${ME.phone}</span></div>
      <div class="fline"><span>ພາສາທີ່ເວົ້າໄດ້</span><span>${ME.langs.join(' · ')}</span></div>
      <div class="fline"><span>ເຂດບໍລິການ</span><span>${ME.area}</span></div>
      <div class="fline"><span>ຂັບເກຍທຳມະດາ</span><span>${ME.manual ? 'ໄດ້ ✅' : 'ບໍ່ໄດ້'}</span></div>
    </div>
    <div class="grp">ກະເປົາເງິນ & ຄ່າທຳນຽມ</div>
    <div class="card2">
      ${rowItem({ ic:'coins', color:'#2fbf71', t:'ກະເປົາເງິນ', s:'ເຕີມເງິນ · ຖອນເງິນ · ລາຍການເຄື່ອນໄຫວ',
        r:'<b class="mini">' + money(walBal(s)) + '</b>', act:'goWallet' })}
      ${rowItem({ ic:'percent', color:zeroFee() ? '#2fbf71' : '#f0921f',
        t:zeroFee() ? 'ຄ່າທຳນຽມບໍລິການ' : 'ຄ່າທຳນຽມຄ້າງຈ່າຍ',
        s:zeroFee() ? 'ໂປຣໂມຊັນ 0% ຮອດ ' + CFG.zeroFeeUntil : 'ຕັດຍອດ' + CFG.feeCycle,
        r:'<b class="mini' + (zeroFee() ? ' ok' : '') + '">' + (zeroFee() ? '0%' : money(feeTotal(s))) + '</b>', act:'goPayFee' })}
      ${rowItem({ ic:'qr', color:'#e1252b', t:'ບັນຊີຮັບເງິນ (QR)',
        s:pq(s).on ? bankByKey(pq(s).bankKey).n + ' ' + pq(s).acc : 'ຍັງບໍ່ທັນຜູກ', act:'goPayQR' })}
      ${rowItem({ ic:'receipt', color:'#12a150', t:'ປະຫວັດການຈ່າຍຄ່າທຳນຽມ', act:'goFeeHistory' })}
    </div>
    <div class="grp">ລົດ ແລະ ເອກະສານ</div>
    <div class="card2">
      ${rowItem({ ic:'car', color:'#26292d', t:'ລົດຂອງຂ້ອຍ', s:ME.car.plate + ' · ' + ME.car.model, act:'goMyCar' })}
      ${rowItem({ ic:'doc', color:'#7c3aed', t:'ເອກະສານ & ໃບອະນຸຍາດ',
        s:DOCS.filter(d => d.days <= 30).length ? '⚠️ ' + DOCS.filter(d => d.days <= 30).length + ' ລາຍການໃກ້ໝົດອາຍຸ' : 'ຄົບຖ້ວນ', act:'goDocs' })}
    </div>
    <div class="grp">ອື່ນໆ</div>
    <div class="card2">
      ${rowItem({ ic:'bell', color:'#e1252b', t:'ແຈ້ງເຕືອນ', r:unread ? `<em class="badge2">${unread}</em>` : '', act:'goNotifs' })}
      ${rowItem({ ic:'headset', color:'#0ea5e9', t:'ປະກາດຈາກບໍລິສັດ', act:'goAnnounce' })}
      ${rowItem({ ic:'shield', color:'#12a150', t:'ຄວາມປອດໄພ & SOS', act:'goSafety' })}
      ${rowItem({ ic:'edit', color:'#5a6472', t:'ຕັ້ງຄ່າ & ຊ່ວຍເຫຼືອ', act:'goSettings' })}
    </div>
    <div class="logoutwrap">
      <div class="logoutbtn" data-act="logout"><i>${I('logout')}</i><b>ອອກຈາກລະບົບ</b></div>
    </div>
    <div class="legal">${CFG.appName} · ຮຸ່ນ 0.1 · ${ME.code}</div>
  </div>
  ${navBar('profile', s)}${gestureBar}`;
}

/* ============================================================
   D29 · ກະເປົາເງິນ
   ============================================================ */
function scrWallet(s){
  const bal = walBal(s), due = feeTotal(s), auto = walAuto(s);
  const f = s.walFilter || 'all';
  const list = walTx(s).filter(t => f === 'all' ? true : f === 'in' ? t.amt > 0 : t.amt < 0);
  return appScreen({ time:'21:46', title:'ກະເປົາເງິນ', state:s, body:`
    <div class="walcard">
      <span>ຍອດເງິນໃນກະເປົາ</span>
      <b>${money(bal)}</b>
      <div class="wacts">
        <a data-act="goTopup">${I('plus')}ເຕີມເງິນ</a>
        <a data-act="goWithdraw">${I('download')}ຖອນເງິນ</a>
      </div>
    </div>
    ${walShort(s) ? `<div class="warnrow bad">${I('alert')}<span>ຍອດເງິນບໍ່ພໍຫັກຄ່າທຳນຽມ
      <b>${money(due)}</b> — ເຕີມເງິນ ຫຼື ຈ່າຍເອງກ່ອນ</span></div>` : ''}

    <div class="grp">ຄ່າທຳນຽມບໍລິການ</div>
    <div class="card2">
      ${zeroFee()
        ? rowItem({ ic:'gift', color:'#2fbf71', t:'ຄ່າທຳນຽມ 0%',
            s:'ບໍ່ມີການຫັກຈາກກະເປົາ · ໂປຣໂມຊັນຮອດ ' + CFG.zeroFeeUntil,
            r:'<b class="mini ok">0%</b>', act:'goPayFee' })
        : `<div class="rowitem" data-act="walAuto"><div class="ic" style="background:var(--d-warnbg);color:var(--d-warn)">${I('percent')}</div>
            <div class="tx"><b>ຫັກຄ່າທຳນຽມອັດຕະໂນມັດ</b><span>${auto
              ? 'ຫັກຈາກກະເປົາທັນທີທຸກຖ້ຽວ' : 'ປິດຢູ່ — ຕ້ອງໄປຈ່າຍເອງ'}</span></div>${sw(auto)}</div>
           ${rowItem({ ic:'coins', color:'#f0921f', t:'ຄ່າທຳນຽມຄ້າງຈ່າຍ', s:auto ? 'ຫັກຈາກກະເປົາອັດຕະໂນມັດ' : 'ຕ້ອງຈ່າຍເອງ',
             r:'<b class="mini">' + money(due) + '</b>', act:'goPayFee' })}`}
    </div>

    <div class="grp">ບັນຊີຮັບເງິນ</div>
    <div class="card2">
      ${rowItem({ ic:'qr', color:'#e1252b', t:'ບັນຊີຮັບເງິນ (QR) ຂອງຂ້ອຍ',
        s:pq(s).on ? bankByKey(pq(s).bankKey).n + ' ' + pq(s).acc + ' · ເຂົ້າໂດຍກົງ' : 'ຍັງບໍ່ທັນຜູກ — ລູກຄ້າສະແກນຈ່າຍບໍ່ໄດ້',
        r:'<b class="mini ' + (pq(s).on ? 'ok' : '') + '">' + (pq(s).on ? 'ເປີດ' : 'ປິດ') + '</b>', act:'goPayQR' })}
      ${rowItem({ ic:'ccard', color:'#5a9bf0', t:'ບັນຊີຖອນເງິນ · ' + WALLET.bank.name + ' ···' + WALLET.bank.last,
        s:WALLET.bank.holder, r:'<b class="mini">ປ່ຽນ</b>', act:'soon' })}
    </div>
    <div class="chnote">ເງິນເຂົ້າກະເປົາມີແຕ່ 3 ທາງ: ລູກຄ້າຈ່າຍ<b>ຜ່ານກະເປົາ</b> · ເຕີມເງິນເອງ · ໂບນັດ —
      <b>ເງິນສົດ</b> ແລະ <b>QR ບັນຊີທ່ານ</b> ບໍ່ຜ່ານລະບົບ</div>

    <div class="grp">ລາຍການເຄື່ອນໄຫວ</div>
    <div class="segs">
      ${[['all','ທັງໝົດ'],['in','ເງິນເຂົ້າ'],['out','ເງິນອອກ']]
        .map(([k, l]) => `<b class="${f === k ? 'on' : ''}" data-act="walFilter" data-v="${k}">${l}</b>`).join('')}
    </div>
    <div class="card2">
      ${list.length ? list.map(t => { const m = txMeta(t.kind);
        return `<div class="rowitem" data-act="noop">
          <div class="ic" style="background:${m.color}2e;color:${m.color}">${I(m.ic)}</div>
          <div class="tx"><b>${t.t}</b><span>${t.s} · ${t.date}</span></div>
          <div class="rt"><b class="amt ${t.amt > 0 ? 'up' : 'down'}">${t.amt > 0 ? '+' : '−'}${Math.abs(t.amt).toLocaleString()}</b></div>
        </div>`; }).join('')
        : `<div class="empty">${I('receipt')}<b>ບໍ່ມີລາຍການໃນໝວດນີ້</b></div>`}
    </div>
    <div style="height:10px"></div>` });
}

/* ============================================================
   D30 · ເຕີມເງິນ
   ============================================================ */
function scrTopup(s){
  const bal = walBal(s);
  const amt = s.topupAmt || TOPUP_AMTS[2];
  const way = TOPUP_WAYS.find(w => w.k === (s.topupWay || 'qr')) || TOPUP_WAYS[0];
  const fee = way.k === 'card' ? Math.round(amt * 0.015 / 100) * 100 : way.fee;
  return appScreen({ time:'21:46', title:'ເຕີມເງິນ', state:s, body:`
    <div class="walmini">${I('coins')}<div><b>${money(bal)}</b><span>ຍອດປັດຈຸບັນ</span></div>
      <em>+${money(amt)}</em></div>

    <div class="grp">ຈຳນວນທີ່ຈະເຕີມ</div>
    <div class="amtgrid">
      ${TOPUP_AMTS.map(v => `<b class="${amt === v ? 'on' : ''}" data-act="topupAmt" data-v="${v}">${(v / 1000).toLocaleString()}k</b>`).join('')}
    </div>
    <div class="pricebox" style="margin-top:9px">
      <i class="${amt <= 10000 ? 'dis' : ''}" data-act="topupMinus">−</i>
      <div class="v"><b>${amt.toLocaleString()}</b><span>${CFG.currency}</span></div>
      <i data-act="topupPlus">+</i>
    </div>

    <div class="grp">ຊ່ອງທາງເຕີມ</div>
    <div class="card2">
      ${TOPUP_WAYS.map(w => `<div class="rowitem" data-act="topupWay" data-v="${w.k}">
        <div class="ic" style="background:var(--d-infobg);color:var(--d-info)">${I(w.ic)}</div>
        <div class="tx"><b>${w.n}</b><span>${w.s}</span></div>
        <div class="rt"><i class="rad ${way.k === w.k ? 'on' : ''}"></i></div></div>`).join('')}
    </div>

    ${way.k === 'qr' ? `<div class="card2 qrmini" style="margin-top:10px">${qrBox('insee-topup://' + ME.code + '/' + amt, 132)}
      <div class="tx"><b>ສະແກນດ້ວຍແອັບທະນາຄານ</b><span>${money(amt)} · ເຂົ້າກະເປົາອັດຕະໂນມັດພາຍໃນ 1 ນາທີ</span></div></div>` : ''}

    <div class="grp">ສະຫຼຸບ</div>
    <div class="card2" style="padding:12px 14px">
      <div class="fline"><span>ຈຳນວນທີ່ເຕີມ</span><span>${money(amt)}</span></div>
      <div class="fline"><span>ຄ່າທຳນຽມຊ່ອງທາງ</span><span>${fee ? money(fee) : 'ບໍ່ມີ'}</span></div>
      <div class="fline total"><span>ຍອດຫຼັງເຕີມ</span><span style="color:var(--d-ok)">${money(bal + amt)}</span></div>
    </div>
    <div class="grow"></div>
    <div class="btm">
      <div class="btmsum"><span>ຈ່າຍລວມ ${money(amt + fee)}</span><b>${money(amt)}</b></div>
      <div class="btn pri" data-act="confirmTopup">ຢືນຢັນເຕີມເງິນ</div></div>` });
}

/* ============================================================
   D31 · ຖອນເງິນ
   ============================================================ */
function scrWithdraw(s){
  const free = walFree(s), due = feeTotal(s);
  const amt = s.wdAmt !== undefined && s.wdAmt !== null ? s.wdAmt : Math.min(free, 500000);
  const low = amt < WALLET.minWithdraw, over = amt > free;
  const net = Math.max(0, amt - WALLET.withdrawFee);
  return appScreen({ time:'21:46', title:'ຖອນເງິນ', state:s, body:`
    <div class="walcard wd">
      <span>ຖອນໄດ້ສູງສຸດ</span>
      <b>${money(free)}</b>
      <div class="lg"><span>ຍອດເງິນ ${money(walBal(s))}</span>
        ${walAuto(s) && due ? `<span>− ກັນຄ່າທຳນຽມ ${money(due)}</span>` : ''}</div>
    </div>

    <div class="grp">ຈຳນວນທີ່ຈະຖອນ</div>
    <div class="amtgrid">
      ${[100000, 200000, 500000].map(v => `<b class="${amt === v ? 'on' : ''}" data-act="wdAmt" data-v="${v}">${(v / 1000).toLocaleString()}k</b>`).join('')}
      <b class="${amt === free ? 'on' : ''}" data-act="wdAmt" data-v="${free}">ທັງໝົດ</b>
    </div>
    <div class="pricebox" style="margin-top:9px">
      <i class="${amt <= 0 ? 'dis' : ''}" data-act="wdMinus">−</i>
      <div class="v"><b>${amt.toLocaleString()}</b><span>${CFG.currency}</span></div>
      <i class="${amt >= free ? 'dis' : ''}" data-act="wdPlus">+</i>
    </div>
    ${low ? `<div class="warnrow">${I('alert')}<span>ຖອນຂັ້ນຕ່ຳ ${money(WALLET.minWithdraw)}</span></div>` : ''}
    ${over ? `<div class="warnrow bad">${I('alert')}<span>ເກີນຍອດທີ່ຖອນໄດ້</span></div>` : ''}

    <div class="grp">ເຂົ້າບັນຊີ</div>
    <div class="card2">
      ${rowItem({ ic:'ccard', color:'#5a9bf0', t:WALLET.bank.name + ' ···' + WALLET.bank.last,
        s:WALLET.bank.holder, r:'<b class="mini">ປ່ຽນ</b>', act:'soon' })}
    </div>

    <div class="grp">ສະຫຼຸບ</div>
    <div class="card2" style="padding:12px 14px">
      <div class="fline"><span>ຈຳນວນທີ່ຖອນ</span><span>${money(amt)}</span></div>
      <div class="fline"><span>ຄ່າທຳນຽມການຖອນ</span><span>−${money(WALLET.withdrawFee)}</span></div>
      <div class="fline total"><span>ໄດ້ຮັບຈິງ</span><span style="color:var(--d-ok)">${money(net)}</span></div>
    </div>
    <div class="safenote">🏦 ${WALLET.withdrawEta}</div>
    <div class="grow"></div>
    <div class="btm">
      <div class="btmsum"><span>ຍອດຫຼັງຖອນ ${money(walBal(s) - amt)}</span><b>${money(net)}</b></div>
      <div class="btn ${low || over ? 'dis' : 'pri'}" data-act="confirmWithdraw">ຢືນຢັນຖອນເງິນ</div></div>` });
}

/* ============================================================
   D02–D08 · ລົງທະບຽນເປັນຄົນຂັບ (ຄົນນອກ · ຍັງບໍ່ມີບັນຊີ)
   ໄຫຼ: ລົງທະບຽນ → ຢືນຢັນຕົວຕົນ → ສົ່ງ → ລໍກວດ → ເປີດໃຊ້ງານ
   ============================================================ */
const apOf = s => ({ step:1, name:'', dob:'', sex:'', idno:'', phone:'', email:'',
  village:'', district:'', province:'ນະຄອນຫຼວງວຽງຈັນ', licType:'B', licNo:'', licExp:'', years:'',
  manual:false, langs:['ລາວ'], zone:'', carType:'sedan', carModel:'', carYear:'', carPlate:'',
  docs:[], verify:[], otp:'', agree:[], ...(s.apply || {}) });
const apSteps = ['ຂໍ້ມູນສ່ວນຕົວ','ໃບຂັບຂີ່ & ລົດ','ແນບເອກະສານ','ຢືນຢັນຕົວຕົນ'];
const apBar = n => `<div class="apbar">${apSteps.map((t, i) => `
  <div class="st ${i + 1 < n ? 'done' : i + 1 === n ? 'on' : ''}"><i>${i + 1 < n ? I('check') : i + 1}</i><span>${t}</span></div>`).join('')}</div>`;
const apOk1 = a => !!(a.name && a.dob && a.idno && a.phone && a.village);
const apOk2 = a => !!(a.licNo && a.licExp && a.years && licOk(a.licType) && a.carModel && a.carPlate);
const apOk3 = a => APPLY_DOCS.filter(d => d.req).every(d => a.docs.includes(d.k));
const apOk4 = a => VERIFY_STEPS.every(v => a.verify.includes(v.k));

/* ---- D02 · ໜ້າແນະນຳ ---- */
function scrApply(s){
  return appScreen({ time:'21:39', title:'ລົງທະບຽນເປັນຄົນຂັບ', body:`
    <div class="aphero">
      <div class="brandmark" style="width:52px;height:52px;border-radius:16px;margin:0 auto 12px">${logoMark()}</div>
      <b>ຂັບກັບ Insee Drive</b>
      <span>ລູກຄ້າຕັ້ງລາຄາ · ທ່ານຮັບຕາມນັ້ນ ຫຼື ສະເໜີລາຄາຂອງທ່ານເອງ<br>
        ໃຊ້<b>ລົດຂອງທ່ານເອງ</b> · ອອນລາຍເມື່ອໃດກໍ່ໄດ້</span>
      <em class="open">🟢 ກຳລັງເປີດຮັບ 120 ຄົນ ໃນ${CFG.city}</em>
    </div>

    <div class="grp">ລາຍໄດ້ຄິດແນວໃດ</div>
    <div class="card2 formula">
      <div class="fr"><span>ຄ່າໂດຍສານທີ່ລູກຄ້າຈ່າຍ</span><b>53,000</b></div>
      <div class="fr ${zeroFee() ? 'zero' : 'sub'}"><span>ຄ່າທຳນຽມບໍລິການ ${Math.round(CFG.commissionPct * 100)}%${zeroFee() ? ' 🎉' : ''}</span>
        <b>${zeroFee() ? '0' : '−6,400'}</b></div>
      <div class="fr tot"><span>ທ່ານໄດ້ຮັບ</span><b>${zeroFee() ? '53,000' : '46,600'} ${CFG.currency}</b></div>
      <div class="note2">${zeroFee()
        ? 'ບໍລິສັດບໍ່ຫັກຫຍັງເລີຍ ຮອດ ' + CFG.zeroFeeUntil + ' · ທິບໄດ້ 100% · ເງິນສົດບໍ່ຕ້ອງນຳສົ່ງ'
        : 'ທິບຈາກລູກຄ້າໄດ້ 100% · ເງິນສົດເປັນຂອງທ່ານທັນທີ ບໍ່ຕ້ອງນຳສົ່ງ'}</div>
    </div>

    <div class="grp">ສິ່ງທີ່ທ່ານຈະໄດ້ຮັບ</div>
    <div class="card2">${BENEFITS.map(b => rowItem({ ic:b.ic, color:'#0891b2', t:b.n, s:b.s, chev:false })).join('')}</div>

    <div class="grp">ເງື່ອນໄຂຜູ້ສະໝັກ</div>
    <div class="card2" style="padding:11px 14px">
      ${APPLY_REQS.map(r => `<div class="reqrow">${I('ok')}<div><b>${r.n}</b><span>${r.s}</span></div></div>`).join('')}
    </div>

    <div class="grp">ຂັ້ນຕອນຫຼັງສົ່ງ · ${STAGES.length} ຂັ້ນ</div>
    <div class="card2 plan">
      ${STAGES.map((x, i) => `<div class="prow"><i>${i + 1}</i><b>${x.days}</b><span>${x.n}</span></div>`).join('')}
    </div>
    <div class="safenote">⚡ ກວດເອກະສານ + ກວດລົດ ຜ່ານແລ້ວ ເລີ່ມຮັບງານໄດ້ພາຍໃນ 1–2 ວັນ</div>
    <div class="grow"></div>
    <div class="btm">
      <div class="btn pri" data-act="apStart">ເລີ່ມລົງທະບຽນ</div>
      <div class="linkred" style="background:none" data-act="goApplyStatus">ຕິດຕາມໃບທີ່ສົ່ງໄປແລ້ວ</div>
    </div>` });
}

/* ---- D03 · ຂັ້ນ 1 ຂໍ້ມູນສ່ວນຕົວ ---- */
function scrApplyPersonal(s){
  const a = apOf(s);
  return appScreen({ time:'21:40', title:'ລົງທະບຽນ · ຂັ້ນ 1/4', body:`
    ${apBar(1)}
    <div class="grp">ຊື່ ແລະ ວັນເກີດ</div>
    <div class="card2" style="padding:2px 0">
      ${field('ຊື່ ແລະ ນາມສະກຸນ (ຕາມບັດປະຈຳຕົວ)', a.name, 'ເຊັ່ນ ທ້າວ ວິໄລສັກ ພົມມະຈັນ', 'userc')}
      ${field('ວັນເດືອນປີເກີດ', a.dob, 'ວວ/ດດ/ປປປປ', 'calendar')}
    </div>
    <div class="grp">ເພດ</div>
    <div class="transrow">
      ${[['m','ຊາຍ'],['f','ຍິງ']].map(([k, n]) => `<b class="${a.sex === k ? 'on' : ''}" data-act="apSex" data-v="${k}">${n}</b>`).join('')}
    </div>
    <div class="grp">ເອກະສານ ແລະ ການຕິດຕໍ່</div>
    <div class="card2" style="padding:2px 0">
      ${field('ເລກບັດປະຈຳຕົວ / ສຳມະໂນຄົວ', a.idno, '00-0000000', 'ccard')}
      ${field('ເບີໂທລະສັບ', a.phone, '+856 20 ...', 'phone')}
      ${field('ອີເມວ (ບໍ່ບັງຄັບ)', a.email, 'name@email.la', 'mail')}
    </div>
    <div class="grp">ທີ່ຢູ່ປັດຈຸບັນ</div>
    <div class="card2" style="padding:2px 0">
      ${field('ບ້ານ', a.village, 'ເຊັ່ນ ບ້ານໜອງບອນ', 'home')}
      ${field('ເມືອງ', a.district, 'ເຊັ່ນ ສີໂຄດຕະບອງ', 'pin')}
      ${field('ແຂວງ', a.province, '', 'globe')}
    </div>
    <div class="safenote">🔒 ຂໍ້ມູນນີ້ໃຊ້ເພື່ອກວດປະຫວັດ ແລະ ຕິດຕໍ່ກັບເທົ່ານັ້ນ — ບໍ່ເປີດເຜີຍໃຫ້ລູກຄ້າ</div>
    <div class="grow"></div>
    <div class="btm"><div class="btn ${apOk1(a) ? 'pri' : 'dis'}" data-act="apNext">
      ${apOk1(a) ? 'ຕໍ່ໄປ · ໃບຂັບຂີ່ & ລົດ' : 'ກອກຂໍ້ມູນໃຫ້ຄົບກ່ອນ'}</div></div>` });
}

/* ---- D04 · ຂັ້ນ 2 ໃບຂັບຂີ່ & ລົດ ---- */
function scrApplyLicense(s){
  const a = apOf(s);
  const bad = !licOk(a.licType);
  const few = a.years && +a.years < CFG.partnerMinYear;
  const old = a.carYear && (2026 - +a.carYear) > CFG.carMaxAge;
  return appScreen({ time:'21:40', title:'ລົງທະບຽນ · ຂັ້ນ 2/4', body:`
    ${apBar(2)}
    <div class="grp">ປະເພດໃບຂັບຂີ່</div>
    <div class="licrow">
      ${LIC_TYPES.map(l => `<b class="${a.licType === l.k ? 'on' : ''} ${l.ok ? '' : 'no'}"
        data-act="apLic" data-v="${l.k}">${l.k}<small>${l.n.split('· ')[1]}</small></b>`).join('')}
    </div>
    ${bad ? `<div class="warnrow bad">${I('alert')}<span>ໃບຂັບຂີ່ປະເພດ <b>A</b> ຮັບໄດ້ສະເພາະ<b>ງານລົດຈັກຮັບຈ້າງ</b> —
      ຖ້າຢາກຮັບງານລົດເກັງຕ້ອງມີປະເພດ B ຂຶ້ນໄປ</span></div>` : ''}
    <div class="card2" style="padding:2px 0;margin-top:9px">
      ${field('ເລກໃບຂັບຂີ່', a.licNo, 'LA-0000000', 'doc')}
      ${field('ວັນໝົດອາຍຸ', a.licExp, 'ວວ/ດດ/ປປປປ', 'calendar')}
      ${field('ປະສົບການຂັບລົດ (ປີ)', a.years, 'ເຊັ່ນ 5', 'timer')}
    </div>
    ${few ? `<div class="warnrow">${I('alert')}<span>ຕ້ອງມີປະສົບການ ${CFG.partnerMinYear} ປີຂຶ້ນໄປ — ອາດບໍ່ຜ່ານ</span></div>` : ''}
    <div class="card2" style="margin-top:9px">
      <div class="rowitem" data-act="apManual"><div class="ic">${I('wheel')}</div>
        <div class="tx"><b>ຂັບເກຍທຳມະດາ (MT) ໄດ້</b><span>ຮັບງານ “ຂັບລົດຂອງລູກຄ້າ” ໄດ້ຫຼາຍຂຶ້ນ</span></div>${sw(a.manual)}</div>
    </div>

    <div class="grp">ລົດຂອງທ່ານ</div>
    <div class="pickgrid">
      ${CAR_TYPES.map(c => `<div class="opt2 ${a.carType === c.k ? 'on' : ''}" data-act="apCarType" data-v="${c.k}">
        ${carArt(c.art, a.carType === c.k ? '#0e7490' : '#9aa3ac', '#dce5ec')}<b>${c.n}</b></div>`).join('')}
    </div>
    <div class="card2" style="padding:2px 0;margin-top:9px">
      ${field('ຍີ່ຫໍ້ ແລະ ລຸ້ນ', a.carModel, 'ເຊັ່ນ Toyota Vios', 'car')}
      ${field('ປີຜະລິດ', a.carYear, 'ເຊັ່ນ 2019', 'calendar')}
      ${field('ປ້າຍທະບຽນ', a.carPlate, 'ເຊັ່ນ ກມ 2278', 'ccard')}
    </div>
    ${old ? `<div class="warnrow bad">${I('alert')}<span>ລົດອາຍຸເກີນ ${CFG.carMaxAge} ປີ — ຮັບລົງທະບຽນບໍ່ໄດ້</span></div>`
      : `<div class="chnote">ລົດຕ້ອງມີອາຍຸບໍ່ເກີນ ${CFG.carMaxAge} ປີ · ມີປະກັນໄພ · ຜ່ານການກວດສະພາບກັບບໍລິສັດ</div>`}

    <div class="grp">ພາສາທີ່ເວົ້າໄດ້</div>
    <div class="tagchips">${LANG_OPTS.map(l => `<b class="${a.langs.includes(l) ? 'on' : ''}" data-act="apLang" data-v="${l}">${l}</b>`).join('')}</div>
    <div class="grp">ເຂດທີ່ສະດວກຂັບ</div>
    <div class="tagchips">${ZONES.map(z => `<b class="${a.zone === z ? 'on' : ''}" data-act="apZone" data-v="${z}">${z}</b>`).join('')}</div>
    <div class="grow"></div>
    <div class="btm"><div class="row2">
      <div class="btn plain" data-act="apBack">ກັບຄືນ</div>
      <div class="btn ${apOk2(a) && !old ? 'pri' : 'dis'}" data-act="apNext">ຕໍ່ໄປ · ເອກະສານ</div></div></div>` });
}

/* ---- D05 · ຂັ້ນ 3 ແນບເອກະສານ ---- */
function scrApplyDocs(s){
  const a = apOf(s);
  const need = APPLY_DOCS.filter(d => d.req);
  const got  = need.filter(d => a.docs.includes(d.k)).length;
  return appScreen({ time:'21:41', title:'ລົງທະບຽນ · ຂັ້ນ 3/4', body:`
    ${apBar(3)}
    <div class="grp">ເອກະສານທີ່ຕ້ອງແນບ (${got}/${need.length})</div>
    <div class="card2">
      ${APPLY_DOCS.map(d => { const on = a.docs.includes(d.k);
        return `<div class="rowitem" data-act="apDoc" data-v="${d.k}">
          <div class="ic" style="background:${on ? '#eefaf2' : '#f5f6f8'};color:${on ? '#12a150' : '#5a6472'}">${I(d.ic)}</div>
          <div class="tx"><b>${d.n}</b><span>${d.s}</span></div>
          <div class="rt">${on ? `<em class="st ok">ແນບແລ້ວ</em>` : `<b class="mini" style="color:var(--d-brand)">${I('camera')} ແນບ</b>`}</div>
        </div>`; }).join('')}
    </div>
    <div class="grp">ຄຳແນະນຳການຖ່າຍ</div>
    <div class="card2" style="padding:11px 14px">
      <div class="inclrow ok">${I('ok')}<span>ຖ່າຍໃນທີ່ແຈ້ງ ເຫັນຕົວໜັງສືຄົບທຸກມຸມ</span></div>
      <div class="inclrow ok">${I('ok')}<span>ຮູບລົດ ຕ້ອງເຫັນປ້າຍທະບຽນຊັດເຈນ</span></div>
      <div class="inclrow no">${I('x')}<span>ຢ່າໃຊ້ຮູບຖ່າຍຈາກໜ້າຈໍ ຫຼື ສຳເນົາທີ່ບໍ່ຊັດ</span></div>
    </div>
    <div class="safenote">📎 ໄຟລ໌ຮັບໄດ້ JPG / PNG / PDF ຂະໜາດບໍ່ເກີນ 5 MB ຕໍ່ໄຟລ໌</div>
    <div class="grow"></div>
    <div class="btm"><div class="row2">
      <div class="btn plain" data-act="apBack">ກັບຄືນ</div>
      <div class="btn ${apOk3(a) ? 'pri' : 'dis'}" data-act="apNext">
        ${apOk3(a) ? 'ຕໍ່ໄປ · ຢືນຢັນຕົວຕົນ' : `ຍັງເຫຼືອ ${need.length - got} ລາຍການ`}</div></div></div>` });
}

/* ---- D06 · ຂັ້ນ 4 ຢືນຢັນຕົວຕົນ (KYC) ---- */
function scrApplyVerify(s){
  const a = apOf(s);
  const cur = VERIFY_STEPS.findIndex(v => !a.verify.includes(v.k));
  const done = cur < 0;
  return appScreen({ time:'21:41', title:'ລົງທະບຽນ · ຂັ້ນ 4/4', body:`
    ${apBar(4)}
    <div class="vfhero ${done ? 'ok' : ''}">
      <i>${I(done ? 'ok' : 'shield')}</i>
      <b>${done ? 'ຢືນຢັນຕົວຕົນສຳເລັດ' : 'ຢືນຢັນຕົວຕົນ'}</b>
      <span>${done ? 'ລະບົບປຽບທຽບໃບໜ້າກັບບັດປະຈຳຕົວແລ້ວ — ຕົງກັນ 98%'
        : 'ເຮັດ 3 ຂັ້ນລຸ່ມນີ້ ເພື່ອຢືນຢັນວ່າເປັນທ່ານຈິງ'}</span>
    </div>
    <div class="card2">
      ${VERIFY_STEPS.map((v, i) => { const on = a.verify.includes(v.k);
        const active = i === cur;
        return `<div class="vfrow ${on ? 'done' : active ? 'on' : ''}" data-act="${active || on ? 'apVerify' : 'noop'}" data-v="${v.k}">
          <i>${on ? I('check') : i + 1}</i>
          <div class="tx"><b>${v.n}</b><span>${v.s}</span></div>
          <div class="rt">${on ? '<em class="st ok">ຜ່ານ</em>'
            : active ? `<b class="mini" style="color:var(--d-brand)">${I(v.ic)} ເລີ່ມ</b>` : ''}</div>
        </div>`; }).join('')}
    </div>
    ${cur === 0 ? `<div class="grp">ລະຫັດ OTP ທີ່ສົ່ງໄປ ${a.phone || 'ເບີຂອງທ່ານ'}</div>
      <div class="otpwrap">${[0,1,2,3].map(i => `<b class="${(a.otp || '')[i] ? 'on' : ''}">${(a.otp || '')[i] || ''}</b>`).join('')}</div>`
    : cur === 1 ? `<div class="grp">ວາງບັດປະຈຳຕົວໃນກອບ</div>
      <div class="vfframe card"><div class="fr"></div><span>${I('ccard')} ໃຫ້ເຫັນຕົວໜັງສື ແລະ ຮູບຄົບ</span></div>`
    : cur === 2 ? `<div class="grp">ຖ່າຍໜ້າຄູ່ກັບບັດປະຈຳຕົວ</div>
      <div class="vfframe face"><div class="fr"></div><span>${I('camera')} ຖືບັດໄວ້ຂ້າງໜ້າ ຢ່າໃຫ້ບັງໃບໜ້າ</span></div>`
    : `<div class="card2" style="padding:12px 14px">
        <div class="fline"><span>ເບີໂທ</span><span>✅ ຢືນຢັນແລ້ວ</span></div>
        <div class="fline"><span>ບັດປະຈຳຕົວ</span><span>✅ ອ່ານຂໍ້ມູນໄດ້</span></div>
        <div class="fline total"><span>ປຽບທຽບໃບໜ້າ</span><span style="color:var(--d-ok)">98% ຕົງກັນ</span></div>
      </div>`}
    <div class="safenote">🔒 ຮູບບັດ ແລະ ໃບໜ້າ ເກັບເຂົ້າລະຫັດ ໃຊ້ສະເພາະການຢືນຢັນຕົວຕົນ ບໍ່ສະແດງໃຫ້ລູກຄ້າເຫັນ</div>
    <div class="grow"></div>
    <div class="btm"><div class="row2">
      <div class="btn plain" data-act="apBack">ກັບຄືນ</div>
      <div class="btn ${done ? 'pri' : 'dis'}" data-act="apNext">${done ? 'ຕໍ່ໄປ · ກວດຄືນ' : `ຢືນຢັນໃຫ້ຄົບ ${a.verify.length}/3`}</div></div></div>` });
}

/* ---- D07 · ກວດຄືນ & ສົ່ງ ---- */
function scrApplyReview(s){
  const a = apOf(s);
  const AGREE = [
    { k:'bg',   n:'ຍິນຍອມໃຫ້ກວດປະຫວັດອາຊະຍາກຳກັບ ປກສ' },
    { k:'data', n:'ຍິນຍອມໃຫ້ເກັບ ແລະ ໃຊ້ຂໍ້ມູນສ່ວນຕົວຕາມນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ' },
    { k:'true', n:'ຢືນຢັນວ່າຂໍ້ມູນ ແລະ ເອກະສານທັງໝົດຖືກຕ້ອງ ແລະ ເປັນຄວາມຈິງ' }
  ];
  const ok = AGREE.every(x => a.agree.includes(x.k));
  const sec = (title, act, rows) => `
    <div class="grp">${title} <span class="grpmore" data-act="${act}">ແກ້ໄຂ</span></div>
    <div class="card2" style="padding:12px 14px">${rows.map(([k, v]) =>
      `<div class="fline"><span>${k}</span><span>${v || '—'}</span></div>`).join('')}</div>`;
  return appScreen({ time:'21:42', title:'ກວດຄືນ & ສົ່ງ', body:`
    ${sec('ຂໍ້ມູນສ່ວນຕົວ', 'apGo1', [['ຊື່', a.name], ['ວັນເກີດ', a.dob],
      ['ເພດ', a.sex === 'f' ? 'ຍິງ' : a.sex === 'm' ? 'ຊາຍ' : ''], ['ບັດປະຈຳຕົວ', a.idno],
      ['ເບີໂທ', a.phone], ['ທີ່ຢູ່', [a.village, a.district, a.province].filter(Boolean).join(', ')]])}
    ${sec('ໃບຂັບຂີ່ & ລົດ', 'apGo2', [['ປະເພດ', a.licType], ['ເລກໃບຂັບຂີ່', a.licNo],
      ['ໝົດອາຍຸ', a.licExp], ['ປະສົບການ', a.years ? a.years + ' ປີ' : ''],
      ['ເກຍທຳມະດາ', a.manual ? 'ຂັບໄດ້' : 'ຂັບບໍ່ໄດ້'],
      ['ລົດ', [(CAR_TYPES.find(c => c.k === a.carType) || {}).n, a.carModel, a.carYear, a.carPlate].filter(Boolean).join(' · ')],
      ['ພາສາ', a.langs.join(' · ')], ['ເຂດ', a.zone]])}
    ${sec('ເອກະສານ', 'apGo3', APPLY_DOCS.map(d => [d.n, a.docs.includes(d.k) ? '✅ ແນບແລ້ວ' : '❌ ຍັງ']))}
    ${sec('ຢືນຢັນຕົວຕົນ', 'apGo4', VERIFY_STEPS.map(v => [v.n, a.verify.includes(v.k) ? '✅ ຜ່ານ' : '❌ ຍັງ']))}
    <div class="grp">ຂໍ້ຕົກລົງ</div>
    <div class="card2">
      ${AGREE.map(x => `<div class="chkrow ${a.agree.includes(x.k) ? 'on' : ''}" data-act="apAgree" data-v="${x.k}">
        <i class="box">${a.agree.includes(x.k) ? I('check') : ''}</i>
        <div class="tx"><span>${x.n}</span></div></div>`).join('')}
    </div>
    <div class="warnrow">${I('alert')}<span><b>ສົ່ງແລ້ວຍັງຮັບງານບໍ່ໄດ້ເທື່ອ</b> —
      ຕ້ອງຜ່ານການກວດເອກະສານ ແລະ ກວດສະພາບລົດກ່ອນ (ປະມານ 1–2 ວັນ)</span></div>
    <div class="grow"></div>
    <div class="btm"><div class="row2">
      <div class="btn plain" data-act="apBack">ກັບຄືນ</div>
      <div class="btn ${ok ? 'pri' : 'dis'}" data-act="apSubmit">ສົ່ງໃບລົງທະບຽນ</div></div></div>` });
}

/* ---- D08 · ຕິດຕາມສະຖານະ ---- */
function scrApplyStatus(s){
  const d = APPLY_DEMO;
  const cur = STAGES.findIndex(x => x.k === d.stage);
  return appScreen({ time:'21:43', title:'ສະຖານະໃບລົງທະບຽນ', body:`
    <div class="apstat">
      <em>${I('userc')}ຄົນຂັບ Insee Drive</em>
      <b>${d.ref}</b>
      <span>ສົ່ງເມື່ອ ${d.sent} · ${d.name}</span>
      <div class="pg"><i style="width:${Math.round((cur + 1) / STAGES.length * 100)}%"></i></div>
      <span class="pgtx">ຂັ້ນທີ ${cur + 1} ຈາກ ${STAGES.length}</span>
    </div>
    <div class="grp">ຂັ້ນຕອນ</div>
    <div class="card2 aptl">
      ${STAGES.map((x, i) => `<div class="tl ${i < cur ? 'done' : i === cur ? 'on' : ''}">
        <i>${i < cur ? I('check') : i + 1}</i>
        <div class="tx"><b>${x.n}</b><span>${x.s}</span></div>
        <em>${i < cur ? 'ຜ່ານແລ້ວ' : i === cur ? 'ກຳລັງດຳເນີນ' : x.days}</em></div>`).join('')}
    </div>
    <div class="grp">${d.appt.title}</div>
    <div class="card2 apappt">
      <div class="hd">${I('calendar')}<b>${d.appt.d} · ${d.appt.t}</b></div>
      <div class="rw">${I('pin')}<span>${d.appt.place}</span></div>
      <div class="rw">${I('info')}<span>${d.appt.bring}</span></div>
      <div class="acts"><b data-act="apConfirmAppt">ຢືນຢັນເຂົ້າຮ່ວມ</b><b class="alt" data-act="soon">ຂໍເລື່ອນນັດ</b></div>
    </div>
    <div class="grp">ຕິດຕໍ່</div>
    <div class="card2">
      ${rowItem({ ic:'headset', color:'#e1252b', t:'ສູນຊ່ວຍເຫຼືອຄົນຂັບ ' + CFG.hotline, s:'ທຸກວັນ 07:00–21:00', act:'callCenter' })}
      ${rowItem({ ic:'chat', color:'#0ea5e9', t:'ແຊັດກັບຜູ້ຮັບຜິດຊອບ', s:'ຕອບພາຍໃນ 1 ຊົ່ວໂມງ', act:'soon' })}
    </div>
    <div class="linkred" data-act="apCancel">ຍົກເລີກໃບລົງທະບຽນ</div>
    <div class="grow"></div>
    <div class="btm"><div class="btn plain" data-act="goLogin">ກັບໄປໜ້າເຂົ້າສູ່ລະບົບ</div></div>` });
}

/* ---- ທະບຽນ renderer ທັງໝົດ (44 ໜ້າຈໍ) ---- */
/* ============================================================
   D43 · ບັນຊີຮັບເງິນ (QR) — ລາຍການບັນຊີຂອງຄົນຂັບເອງ
   ເພີ່ມໄດ້ຫຼາຍບັນຊີ · ເລືອກອັນໃດເປັນ “ຫຼັກ” ທີ່ເອົາມາສ້າງ QR
   ============================================================ */
function scrPayQR(s){
  const list = pqList(s), main = pqMain(s), on = pqOn(s);
  const bk = main ? bankByKey(main.bankKey) : null;
  return appScreen({ time:'21:52', title:'ບັນຊີຮັບເງິນ (QR)', state:s, body:`

    ${main && on ? `<div class="card2 qrcard">
      <div class="qrtop">${I('bank')}<div><b>${bk.n}</b><span>${main.nick || bk.s}</span></div>
        ${main.verified ? `<i class="vtag ok">${I('ok')}ຢືນຢັນແລ້ວ</i>` : `<i class="vtag wait">${I('timer')}ລໍຢືນຢັນ</i>`}</div>
      <div class="qrbig">${qrBox(payqrPayload(main, 0), 168)}</div>
      <div class="qrwho"><b>${main.holder}</b><span>${main.acc}</span></div>
      <div class="qracts">
        <a data-act="payqrShare">${I('share')}ແບ່ງປັນ</a>
        <a data-act="payqrSave">${I('download')}ບັນທຶກຮູບ</a>
        <a data-act="payqrEditOpen" data-v="${main.id}">${I('edit')}ແກ້ໄຂ</a>
      </div>
    </div>`
    : `<div class="card2 qrcard off"><div class="qrempty">${I('qr')}
        <b>${list.length ? 'ປິດຮັບຜ່ານ QR ຢູ່' : 'ຍັງບໍ່ມີບັນຊີຮັບເງິນ'}</b>
        <span>${list.length ? 'ເປີດສະວິດຂ້າງລຸ່ມ ຈຶ່ງຈະສະແດງ QR ຕອນຈົບຖ້ຽວ'
                            : 'ເພີ່ມບັນຊີທະນາຄານຂອງທ່ານ ເພື່ອໃຫ້ລູກຄ້າສະແກນຈ່າຍ'}</span></div></div>`}

    <div class="grp">ບັນຊີຂອງຂ້ອຍ · ${list.length} ບັນຊີ</div>
    <div class="card2">
      ${list.length ? list.map(q => { const b = bankByKey(q.bankKey);
        return `<div class="qrow ${q.primary ? 'main' : ''}">
          <i class="lg">${I('bank')}</i>
          <div class="tx" data-act="payqrEditOpen" data-v="${q.id}">
            <b>${b.n}${q.nick ? ' · ' + q.nick : ''}</b>
            <span>${q.acc} · ${q.holder}</span>
            <div class="tags">
              ${q.primary ? '<em class="on">ບັນຊີຫຼັກ</em>' : ''}
              ${q.verified ? '<em class="ok">ຢືນຢັນແລ້ວ</em>' : '<em class="wait">ລໍຢືນຢັນ</em>'}
              <em class="src">${q.src === 'image' ? 'ຈາກຮູບ QR' : 'ພິມເອງ'}</em>
            </div>
          </div>
          <div class="qacts">
            ${q.primary ? '' : `<a data-act="payqrPrimary" data-v="${q.id}" title="ຕັ້ງເປັນຫຼັກ">${I('star')}</a>`}
            <a data-act="payqrEditOpen" data-v="${q.id}" title="ແກ້ໄຂ">${I('edit')}</a>
            <a class="del" data-act="payqrDelete" data-v="${q.id}" title="ລຶບ">${I('trash')}</a>
          </div>
        </div>`; }).join('')
      : `<div class="empty">${I('qr')}<b>ຍັງບໍ່ມີບັນຊີ</b><span>ກົດ “ເພີ່ມບັນຊີຮັບເງິນ” ຂ້າງລຸ່ມ</span></div>`}
    </div>
    <div style="padding:0 12px"><div class="btn ored" data-act="payqrAdd">${I('plus')} ເພີ່ມບັນຊີຮັບເງິນ</div></div>

    <div class="grp">ຮັບຈ່າຍຜ່ານ QR</div>
    <div class="card2">
      <div class="rowitem" data-act="payqrToggle"><div class="ic" style="background:var(--d-brandbg);color:var(--d-brand)">${I('qr')}</div>
        <div class="tx"><b>ເປີດໃຫ້ລູກຄ້າສະແກນ QR</b><span>${on
          ? 'ເປີດຢູ່ — ຈະສະແດງ QR ບັນຊີຫຼັກຕອນຈົບຖ້ຽວ' : 'ປິດຢູ່ — ຮັບແຕ່ເງິນສົດ ແລະ ກະເປົາ'}</span></div>${sw(on)}</div>
    </div>

    <div class="grp">ເງິນແຕ່ລະທາງໄປໃສ</div>
    <div class="card2 flowtbl">
      <div class="ft-row"><i class="ic cash">${I('cash')}</i>
        <div class="tx"><b>ເງິນສົດ</b><span>ມືທ່ານໂດຍກົງ</span></div><em class="tag out">ບໍ່ຜ່ານລະບົບ</em></div>
      <div class="ft-row"><i class="ic qr">${I('qr')}</i>
        <div class="tx"><b>QR ບັນຊີຂ້ອຍ</b><span>${main && on ? bk.n + ' ' + main.acc + ' · ເຂົ້າໂດຍກົງ' : 'ປິດ / ຍັງບໍ່ມີບັນຊີ'}</span></div><em class="tag out">ບໍ່ຜ່ານລະບົບ</em></div>
      <div class="ft-row"><i class="ic wal">${I('wallet')}</i>
        <div class="tx"><b>ກະເປົາເງິນໃນແອັບ</b><span>ຖອນເຂົ້າບັນຊີພາຍຫຼັງ</span></div><em class="tag in">ຜ່ານລະບົບ</em></div>
    </div>
    <div class="chnote">ບໍລິສັດ<b>ບໍ່ໄດ້ຈັບເງິນຄ່າໂດຍສານ</b>ຂອງທ່ານ — ເງິນທີ່ເຂົ້າລະບົບມີແຕ່ໃນ<b>ກະເປົາ</b>ເທົ່ານັ້ນ</div>

    ${main ? `<div class="grp">30 ວັນຜ່ານມາ · ${bk.n}</div>
    <div class="card2 statrow2">
      <div><b>${main.scans30 || 0}</b><span>ຄັ້ງທີ່ຖືກສະແກນ</span></div>
      <div><b>${money(main.recv30 || 0)}</b><span>ຮັບເຂົ້າບັນຊີ</span></div>
    </div>` : ''}
    <div class="grow"></div>` });
}

/* ============================================================
   D44 · ເພີ່ມ / ແກ້ໄຂບັນຊີຮັບເງິນ — ຄົນຂັບເຮັດເອງ
   2 ວິທີ: ພິມເລກບັນຊີເອງ ຫຼື ອັບໂຫຼດຮູບ QR ຈາກແອັບທະນາຄານ
   ============================================================ */
function scrPayQREdit(s){
  const d = s.qrEdit || {};
  const isNew = !d.id;
  const way = d.way || 'manual';
  const bk = bankByKey(d.bankKey);
  const ready = accOk(d.acc) && String(d.holder || '').trim().length >= 3;
  const only = pqList(s).length <= 1 && !isNew;
  return appScreen({ time:'21:53', title:isNew ? 'ເພີ່ມບັນຊີຮັບເງິນ' : 'ແກ້ໄຂບັນຊີຮັບເງິນ', state:s, body:`

    <div class="segs">
      ${[['manual','ພິມເລກບັນຊີເອງ'],['image','ອັບໂຫຼດຮູບ QR']]
        .map(([k, n]) => `<b class="${way === k ? 'on' : ''}" data-act="payqrWay" data-v="${k}">${n}</b>`).join('')}
    </div>

    <div class="card2 qrprev ${ready ? '' : 'dim'}">
      ${ready ? qrBox(payqrPayload(d, 0), 132) : `<div class="phbox">${I('qr')}</div>`}
      <div class="tx"><b>${ready ? 'ຕົວຢ່າງ QR ຂອງທ່ານ' : 'ຕົວຢ່າງ QR'}</b>
        <span>${ready ? bk.n + ' · ' + d.acc : 'ໃສ່ເລກບັນຊີ ແລະ ຊື່ໃຫ້ຄົບ ແລ້ວ QR ຈະຂຶ້ນຢູ່ນີ້'}</span>
        ${ready ? `<span>${d.holder}</span>` : ''}</div>
    </div>

    ${way === 'image' ? `
      <div class="grp">ຮູບ QR ຈາກແອັບທະນາຄານ</div>
      ${d.img ? `<div class="card2 upok">${I('ok')}<div><b>ອ່ານຮູບສຳເລັດ</b>
          <span>${bk.n} · ${d.acc} · ${d.holder}</span></div>
          <a data-act="payqrUpload">ປ່ຽນຮູບ</a></div>`
        : `<div class="card2 updrop" data-act="payqrUpload">${I('qr')}
            <b>ກົດເພື່ອເລືອກຮູບ QR</b>
            <span>ບັນທຶກຮູບ QR ຈາກແອັບທະນາຄານຂອງທ່ານ ແລ້ວເລືອກມາທີ່ນີ້<br>ລະບົບຈະອ່ານທະນາຄານ ເລກບັນຊີ ແລະ ຊື່ ໃຫ້ອັດຕະໂນມັດ</span></div>`}
      <div class="chnote">ອ່ານບໍ່ອອກ? ສະຫຼັບໄປ <b>“ພິມເລກບັນຊີເອງ”</b> ໄດ້ທຸກເວລາ</div>
    ` : ''}

    <div class="grp">ທະນາຄານ</div>
    <div class="licrow">
      ${BANKS.map(b => `<b class="${d.bankKey === b.k ? 'on' : ''}" data-act="payqrBank" data-v="${b.k}">${b.n}</b>`).join('')}
    </div>

    <div class="grp">ຂໍ້ມູນບັນຊີ</div>
    <div class="card2" style="padding:12px 14px">
      <div class="fld"><label>ເລກບັນຊີ${d.acc && !accOk(d.acc) ? ' <em class="err">ສັ້ນເກີນໄປ (ຢ່າງໜ້ອຍ 8 ໂຕ)</em>' : ''}</label>
        <div class="inp tap ${d.acc ? '' : 'ph'} ${d.acc && !accOk(d.acc) ? 'bad' : ''}"
          data-act="kbOpen" data-v="acc">${d.acc || '0000 0000 000'}${I('edit')}</div></div>
      <div class="fld"><label>ຊື່ເຈົ້າຂອງບັນຊີ (ຕົວອັກສອນອັງກິດ)</label>
        <div class="inp tap ${d.holder ? '' : 'ph'}" data-act="kbOpen" data-v="holder">${d.holder || 'NAME SURNAME'}${I('edit')}</div></div>
      <div class="fld"><label>ຊື່ຫຍໍ້ (ບໍ່ບັງຄັບ — ໄວ້ແຍກບັນຊີ)</label>
        <div class="inp tap ${d.nick ? '' : 'ph'}" data-act="kbOpen" data-v="nick">${d.nick || 'ເຊັ່ນ: ບັນຊີຫຼັກ'}${I('edit')}</div></div>
    </div>
    <div class="chnote">ຊື່ຕ້ອງ<b>ກົງກັບໃບຂັບຂີ່</b>ຂອງທ່ານ — ຖ້າບໍ່ກົງ ລະບົບຈະໃຫ້ຢືນຢັນກ່ອນໃຊ້</div>

    <div class="card2" style="margin-top:10px">
      <div class="rowitem" data-act="payqrPrimaryDraft"><div class="ic" style="background:var(--d-brandbg);color:var(--d-brand)">${I('star')}</div>
        <div class="tx"><b>ຕັ້ງເປັນບັນຊີຫຼັກ</b><span>${d.primary
          ? 'ເອົາບັນຊີນີ້ສ້າງ QR ຕອນຈົບຖ້ຽວ' : 'ໃຊ້ບັນຊີຫຼັກອັນເກົ່າຢູ່'}</span></div>${sw(!!d.primary)}</div>
    </div>

    ${isNew ? '' : `<div class="linkred ${only ? 'dim' : ''}" data-act="${only ? 'noop' : 'payqrDelete'}" data-v="${d.id}">
      ${only ? 'ລຶບບໍ່ໄດ້ — ຕ້ອງເຫຼືອຢ່າງໜ້ອຍ 1 ບັນຊີ' : 'ລຶບບັນຊີນີ້'}</div>`}

    <div class="grow"></div>
    <div class="btm"><div class="btn ${ready ? 'pri' : 'dis'}" data-act="${ready ? 'payqrSave' : 'noop'}">
      ${isNew ? 'ເພີ່ມບັນຊີນີ້' : 'ບັນທຶກການແກ້ໄຂ'}</div></div>
    ${kbSheet(s)}` });
}

const RENDER = {
  /* ບັນຊີຮັບເງິນ QR */
  payqr:scrPayQR, payqrEdit:scrPayQREdit,
  /* ລົງທະບຽນ & ຢືນຢັນຕົວຕົນ */
  splash:scrSplash, apply:scrApply, applyPersonal:scrApplyPersonal, applyLicense:scrApplyLicense,
  applyDocs:scrApplyDocs, applyVerify:scrApplyVerify, applyReview:scrApplyReview, applyStatus:scrApplyStatus,
  /* ເຂົ້າສູ່ລະບົບ */
  login:scrLogin, otp:scrOtp,
  /* ໜ້າຫຼັກ & ຄິວງານ */
  offline:scrOffline, online:scrOnline, jobList:scrJobList,
  /* ປະມູນລາຄາ */
  jobOffer:scrJobOffer, bid:scrBid, bidWait:scrBidWait,
  /* ໄປຮັບ & ເດີນທາງ */
  toPickup:scrToPickup, arrived:scrArrived, onTrip:scrOnTrip, chat:scrChat, collect:scrCollect,
  /* ໃຫ້ຄະແນນ · ຍົກເລີກ · ງານພິເສດ */
  ratePax:scrRatePax, cancel:scrCancel, charterJob:scrCharterJob, driveMineJob:scrDriveMineJob,
  /* ລາຍໄດ້ & ຄ່າທຳນຽມ */
  earnings:scrEarnings, payFee:scrPayFee, feeHistory:scrFeeHistory,
  /* ກະເປົາເງິນ */
  wallet:scrWallet, topup:scrTopup, withdraw:scrWithdraw,
  /* ຄະແນນ · ປະຫວັດ · ລົດ */
  performance:scrPerformance, reviews:scrReviews, history:scrHistory, historyDetail:scrHistoryDetail,
  myCar:scrMyCar, docs:scrDocs,
  /* ຂ່າວ · ຄວາມປອດໄພ · ບັນຊີ */
  notifications:scrNotifications, announce:scrAnnounce, safety:scrSafety,
  profile:scrProfile, settings:scrSettings
};
