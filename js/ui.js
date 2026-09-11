/* ============================================================
   ui.js — SVG icons, vehicle art, map art, small helpers
   ============================================================ */

const money = n => n.toLocaleString('en-US') + ' ' + CFG.currency;
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---------------- icons ---------------- */
const _s = (b, extra='') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ${extra}>${b}</svg>`;
const _f = (b, extra='') => `<svg viewBox="0 0 24 24" fill="currentColor" ${extra}>${b}</svg>`;

const ICONS = {
  search:  _s('<circle cx="11" cy="11" r="7"/><path d="M20.5 20.5L16.6 16.6"/>'),
  pin:     _f('<path d="M12 2a7 7 0 00-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 00-7-7zm0 9.6A2.6 2.6 0 1112 6.4a2.6 2.6 0 010 5.2z"/>'),
  heart:   _f('<path d="M12 21s-8-4.9-8-10.2A4.8 4.8 0 0112 7.1a4.8 4.8 0 018 3.7C20 16.1 12 21 12 21z"/>'),
  diamond: '<svg viewBox="0 0 24 24" fill="#e1252b"><path d="M12 2.2l6.6 6.6L12 21.8 5.4 8.8z" opacity=".95"/><path d="M12 2.2L5.4 8.8h13.2z" fill="#f2545a"/></svg>',
  traffic: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6.5" y="2.5" width="11" height="19" rx="3.2"/><circle cx="12" cy="7.5" r="2.1" fill="#fff"/><circle cx="12" cy="12" r="2.1" fill="#fff"/><circle cx="12" cy="16.5" r="2.1" fill="#fff"/></svg>',
  layers:  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8.8 3L3 5.6v15.2l5.8-2.6 6.4 2.6L21 18.2V3l-5.8 2.6z" opacity=".9"/><path d="M8.8 3v15.2M15.2 5.6v15.2" stroke="#fff" stroke-width="1.3" fill="none"/></svg>',
  locate:  _s('<circle cx="12" cy="12" r="4.2"/><circle cx="12" cy="12" r="1.1" fill="currentColor"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>'),
  chev:    _s('<path d="M6 9.5l6 6 6-6"/>'),
  wallet:  _s('<rect x="3" y="6" width="18" height="13" rx="3.2"/><path d="M3 10h13a2 2 0 012 2v1a2 2 0 01-2 2H3"/>'),
  percent: _s('<path d="M6.5 17.5L17.5 6.5"/><circle cx="7.5" cy="7.5" r="2.4"/><circle cx="16.5" cy="16.5" r="2.4"/>'),
  seat:    _s('<path d="M6.5 4.5v7.5a3 3 0 003 3h5"/><path d="M18 9.5v10"/><path d="M4.5 19.5h13"/><path d="M6.5 4.5h-2"/>'),
  phone:   _f('<path d="M6.6 2.8h3.1l1.6 4.1-2.1 1.5a12.4 12.4 0 006.4 6.4l1.5-2.1 4.1 1.6v3.1a2.1 2.1 0 01-2.3 2.1A17.3 17.3 0 014.5 5.1a2.1 2.1 0 012.1-2.3z"/>'),
  chat:    _f('<path d="M4 4.5h16a1.5 1.5 0 011.5 1.5v9a1.5 1.5 0 01-1.5 1.5H9.6L5 21v-4.5H4A1.5 1.5 0 012.5 15V6A1.5 1.5 0 014 4.5z"/>'),
  x:       _s('<path d="M6 6l12 12M18 6L6 18"/>', 'stroke-width="2.2"'),
  send:    _f('<path d="M21.4 3.1L2.6 10.4c-.7.3-.7 1.3 0 1.5l5.2 1.8 1.8 5.2c.2.7 1.2.7 1.5 0l7.3-18.8c.2-.6-.4-1.2-1-1z"/>'),
  more:    _f('<circle cx="12" cy="5" r="1.9"/><circle cx="12" cy="12" r="1.9"/><circle cx="12" cy="19" r="1.9"/>'),
  star:    _f('<path d="M12 2.4l3 6 6.6 1-4.8 4.7 1.1 6.6-5.9-3.1-5.9 3.1 1.1-6.6L2.4 9.4l6.6-1z"/>'),
  camera:  _s('<path d="M3 8.5h3.5L8 6h8l1.5 2.5H21v11H3z"/><circle cx="12" cy="13.5" r="3.6"/>'),
  close:   _s('<path d="M6 6l12 12M18 6 6 18"/>', 'stroke-width="2.2"'),
  bksp:    _s('<path d="M9.4 5.4h9.2a2 2 0 0 1 2 2v9.2a2 2 0 0 1-2 2H9.4L3 12z"/><path d="M11.6 9.6 16 14M16 9.6 11.6 14"/>'),
  back:    _s('<path d="M15 4.5l-7 7.5 7 7.5"/>', 'stroke-width="2.3"'),
  info:    _s('<circle cx="12" cy="12" r="9.2"/><path d="M12 11.2v5.4M12 7.6v.1"/>'),
  leaf:    '<svg viewBox="0 0 24 24" fill="#34c759"><path d="M20.5 3.2S8.4 3 5.9 10.4C4.2 15.4 7.6 19 7.6 19s-.6-6 3.4-9.6c0 0-2.7 4-2.5 9.7 0 0 7.3.4 10-5.4 2.2-4.9 2-10.5 2-10.5z"/></svg>',
  tag:     '<svg viewBox="0 0 24 24" fill="#e1252b"><path d="M3.2 12.6l9-9H20a1 1 0 011 1v7.8l-9 9z"/><circle cx="16.6" cy="7.4" r="1.7" fill="#fff"/></svg>',
  arrow:   _s('<path d="M4 12h15M13 6l6 6-6 6"/>', 'stroke-width="2.1"'),
  check:   _s('<path d="M5 13l4.5 4.5L19 6.5"/>', 'stroke-width="2.6"'),
  home:    _s('<path d="M4 10.6L12 4.2l8 6.4V20H4z"/><path d="M9.6 20v-5.6h4.8V20"/>'),
  work:    _s('<rect x="3" y="7.5" width="18" height="12" rx="2.2"/><path d="M9 7.5V6a1.8 1.8 0 011.8-1.8h2.4A1.8 1.8 0 0115 6v1.5"/>'),
  shop:    _s('<path d="M4 9.5h16V20H4z"/><path d="M3.4 9.5L5 4.5h14l1.6 5"/>'),
  plane:   _f('<path d="M21.4 12.2l-8.6-2V4.6a1.4 1.4 0 00-2.8 0v5.6l-8.6 2v1.9l8.6-1.4v4l-2.6 2v1.4l4-1.1 4 1.1v-1.4l-2.6-2v-4l8.6 1.4z"/>'),
  hosp:    _s('<rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><path d="M12 8.5v7M8.5 12h7"/>'),
  card:    '<svg viewBox="0 0 90 58" fill="none"><rect x="1" y="1" width="88" height="56" rx="7" fill="#d81c22"/><path d="M1 22h88" stroke="#fff" stroke-opacity=".55" stroke-width="2"/><rect x="10" y="31" width="14" height="10" rx="2" fill="#f6c453"/><path d="M62 40h8M74 40h5" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><path d="M62 12c4 2 6 5 6 8M67 9c5 3 8 7 8 11" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>',
  cash:    '<svg viewBox="0 0 24 24"><rect x="2.5" y="6" width="19" height="12" rx="2" fill="#7ec98a" stroke="#4d9a5c"/><circle cx="12" cy="12" r="3" fill="#e9f7ea" stroke="#4d9a5c"/><path d="M12 10v4M10.8 11h2.4" stroke="#4d9a5c" stroke-width="1.2"/></svg>',
  ok:      _s('<path d="M5 13l4.5 4.5L19 6.5"/>', 'stroke-width="3"')
};
/* ---- ໄອຄອນເພີ່ມສະເພາະແອັບພະນັກງານຂັບ ---- */
Object.assign(ICONS, {
  power: _s('<path d="M12 3v9"/><path d="M18.4 6.6a9 9 0 11-12.8 0"/>'),
  chart: _s('<path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M22 20H2"/>'),
  doc:   _s('<path d="M14 2H7a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V7z"/><path d="M14 2v5h5"/><path d="M9 13h6"/><path d="M9 17h4"/>'),
  bolt:  _s('<path d="M13 2L4.5 13H11l-1 9 8.5-11H12z"/>'),
  nav:   _s('<path d="M3 11l18-8-8 18-2-8z"/>'),
  coins: _s('<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6"/><path d="M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>'),
  badge: _s('<path d="M9 3h6v3H9z"/><rect x="4" y="6" width="16" height="15" rx="2"/><path d="M9 12h6"/><path d="M9 16h4"/>'),
  swap:  _s('<path d="M7 4L3 8l4 4"/><path d="M3 8h13a4 4 0 014 4"/><path d="M17 20l4-4-4-4"/><path d="M21 16H8a4 4 0 01-4-4"/>'),
  timer: _s('<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5"/><path d="M9 2h6"/>'),
  route: _s('<circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="5" r="2.5"/><path d="M8.5 19H14a4 4 0 000-8H10a4 4 0 010-8h5.5"/>'),
  fire:  _s('<path d="M12 22c4 0 6-2.7 6-6 0-4-3-5.5-3-9 0 0-2 1.5-2 4 0-1.5-1-3-2.5-4C10.5 9 7 10.5 7 15c0 3.6 2 7 5 7z"/>'),
  pause: _s('<rect x="7" y="5" width="3.5" height="14" rx="1"/><rect x="13.5" y="5" width="3.5" height="14" rx="1"/>')
});

const I = (n, cls='') => cls ? `<span class="${cls}">${ICONS[n]||''}</span>` : (ICONS[n] || '');

/* ---------------- status bar ---------------- */
function statusBar(time='21:47', bat='7'){
  return `<div class="sbl"><b>${time} ນ.</b>
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/></svg>
      <svg viewBox="0 0 24 24" fill="#fff"><path d="M4 4h16v11H9l-5 5z"/></svg>
      <svg viewBox="0 0 24 24" fill="#fff"><circle cx="12" cy="12" r="3.4"/></svg></div>
    <div class="sbr">
      <svg viewBox="0 0 24 24" fill="#fff"><path d="M12 2a7 7 0 00-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 00-7-7z"/></svg>
      <span style="font-size:8px;line-height:1;text-align:center">53.0<br>KB/S</span>
      <svg viewBox="0 0 24 24" fill="#fff"><path d="M12 18.5l3-3a4.3 4.3 0 00-6 0zM12 12.5a8.6 8.6 0 016 2.4l2-2a11.4 11.4 0 00-16 0l2 2a8.6 8.6 0 016-2.4z"/></svg>
      <svg viewBox="0 0 24 24" fill="#fff"><path d="M4 20h3v-6H4zM10 20h3V9h-3zM16 20h3V4h-3z"/></svg>
      <span class="bat">${bat}</span></div>`;
}

/* ---------------- vehicle art ---------------- */
const CARART = {
  /* ລົດນ້ອຍທ້າຍຕັດ (ECO / EV PLUS) */
  hatch: (b='#2b3038', g='#dce5ec') => `<svg viewBox="0 0 120 56">
    <path d="M16 40 Q13 31 21 29 L34 26 L44 15 Q48 12 56 12 L76 12 Q85 12 89 18 L97 29 Q105 30 105 38 L105 42 Q105 45 101 45 L20 45 Q16 45 16 40Z" fill="${b}"/>
    <path d="M37 26 L46 16 Q49 14 56 14 L60 14 L60 26 Z" fill="${g}"/>
    <path d="M64 14 L76 14 Q81 14 84 18 L90 26 L64 26 Z" fill="${g}"/>
    <circle cx="35" cy="45" r="9" fill="#15181c"/><circle cx="35" cy="45" r="3.8" fill="#e1252b"/>
    <circle cx="88" cy="45" r="9" fill="#15181c"/><circle cx="88" cy="45" r="3.8" fill="#e1252b"/></svg>`,
  /* ລົດເກັງ 3 ຕອນ (PLUS) */
  sedan: (b='#2b3038', g='#dce5ec') => `<svg viewBox="0 0 120 56">
    <path d="M4 41 Q2 33 11 31 L28 28 L44 19 Q48 16.5 57 16.5 L72 16.5 Q80 16.5 85 21 L94 29 L112 32 Q118 34 118 41 L118 43 Q118 46 114 46 L9 46 Q4 46 4 41Z" fill="${b}"/>
    <path d="M35 28 L47 20 Q50 18.5 57 18.5 L61 18.5 L61 28 Z" fill="${g}"/>
    <path d="M65 18.5 L72 18.5 Q78 18.5 81 22 L87 28 L65 28 Z" fill="${g}"/>
    <circle cx="32" cy="46" r="9" fill="#15181c"/><circle cx="32" cy="46" r="3.8" fill="#e1252b"/>
    <circle cx="96" cy="46" r="9" fill="#15181c"/><circle cx="96" cy="46" r="3.8" fill="#e1252b"/></svg>`,
  /* ລົດ SUV ສູງ (Premium) */
  suv: (b='#2b3038', g='#dce5ec') => `<svg viewBox="0 0 120 56">
    <path d="M36 7 H92" stroke="${b}" stroke-width="3.4" stroke-linecap="round"/>
    <path d="M8 39 Q5 27 16 25 L26 23 L33 11 Q36 8 44 8 L84 8 Q92 8 95 13 L101 24 L110 27 Q117 29 117 37 L117 42 Q117 45 113 45 L12 45 Q8 45 8 39Z" fill="${b}"/>
    <path d="M30 23 L37 12 Q39 10 44 10 L58 10 L58 23 Z" fill="${g}"/>
    <path d="M62 10 L84 10 Q89 10 91 14 L96 23 L62 23 Z" fill="${g}"/>
    <circle cx="32" cy="45" r="10" fill="#15181c"/><circle cx="32" cy="45" r="4.2" fill="#e1252b"/>
    <circle cx="94" cy="45" r="10" fill="#15181c"/><circle cx="94" cy="45" r="4.2" fill="#e1252b"/></svg>`,
  /* ລົດໄຟຟ້າຂະໜາດນ້ອຍ (INSEE EV) */
  micro: (b='#2b3038', g='#dce5ec') => `<svg viewBox="0 0 120 56">
    <path d="M24 42 Q21 30 28 26 L31 12 Q33 8 41 8 L78 8 Q86 8 88 13 L92 27 Q99 30 98 41 L98 43 Q98 45 94 45 L28 45 Q24 45 24 42Z" fill="${b}"/>
    <path d="M35 26 L38 13 Q39 11 44 11 L57 11 L57 26 Z" fill="${g}"/>
    <path d="M61 11 L75 11 Q80 11 81 14 L86 26 L61 26 Z" fill="${g}"/>
    <circle cx="39" cy="45" r="9" fill="#15181c"/><circle cx="39" cy="45" r="3.8" fill="#e1252b"/>
    <circle cx="84" cy="45" r="9" fill="#15181c"/><circle cx="84" cy="45" r="3.8" fill="#e1252b"/></svg>`,
  /* ລົດກະບະ (PICKUP) */
  pickup: (b='#8b9199', g='#dce5ec') => `<svg viewBox="0 0 120 56">
    <path d="M8 40 Q6 32 13 30 L26 27 L36 14 Q39 11 47 11 L62 11 Q69 11 72 16 L78 28 L113 28 Q116 28 116 31 L116 42 Q116 45 112 45 L13 45 Q8 45 8 40Z" fill="${b}"/>
    <path d="M30 27 L39 15 Q41 13 47 13 L52 13 L52 27 Z" fill="${g}"/>
    <path d="M56 13 L62 13 Q66 13 68 17 L73 27 L56 27 Z" fill="${g}"/>
    <path d="M80 30 H114 V40 H80 Z" fill="#6f757d"/>
    <circle cx="30" cy="45" r="9" fill="#15181c"/><circle cx="30" cy="45" r="3.8" fill="#cfd4da"/>
    <circle cx="95" cy="45" r="9" fill="#15181c"/><circle cx="95" cy="45" r="3.8" fill="#cfd4da"/></svg>`,
  /* ລົດຈັກ (Motorcycle) */
  moto: (b='#2b3038', g='#dce5ec') => `<svg viewBox="0 0 120 56">
    <path d="M32 42 Q36 30 52 30 L68 30 L74 22 L86 22" stroke="#e1252b" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    <path d="M88 24 Q96 30 94 42" stroke="#e1252b" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    <path d="M46 30 L72 27 L74 33 L48 36 Z" fill="${b}"/>
    <path d="M78 20 L92 14 L96 19 L82 26 Z" fill="${b}"/>
    <path d="M40 34 L60 33 L58 40 L42 40 Z" fill="${b}" opacity=".85"/>
    <circle cx="30" cy="42" r="10" fill="none" stroke="#15181c" stroke-width="4"/><circle cx="30" cy="42" r="2.8" fill="#e1252b"/>
    <circle cx="94" cy="42" r="10" fill="none" stroke="#15181c" stroke-width="4"/><circle cx="94" cy="42" r="2.8" fill="#e1252b"/></svg>`
};
const carArt = (k, b, g) => (CARART[k] || CARART.hatch)(b, g);

/* ---------------- avatar (illustrated, not a real person) ---------------- */
const avatarArt = (bg) => `<svg viewBox="0 0 100 100">
  <rect width="100" height="100" fill="${bg || '#dbe6ee'}"/>
  <circle cx="50" cy="38" r="18" fill="#3f4a57"/>
  <path d="M50 22c9 0 14 5 14 12 0 2-1 4-1 4s-2-5-6-6c-4-1-9 1-13 3-3 1-5 4-5 4s-2-3-2-6c0-6 5-11 13-11z" fill="#22262b"/>
  <path d="M18 100c2-19 15-28 32-28s30 9 32 28z" fill="#2f3a46"/>
  <path d="M42 74l8 9 8-9 5 3-13 14-13-14z" fill="#3d4a58"/></svg>`;

const carPhotoArt = plate => `<svg viewBox="0 0 200 150">
  <rect width="200" height="150" fill="#dfe4e9"/><rect y="98" width="200" height="52" fill="#c9d0d7"/>
  <path d="M18 100 Q14 78 30 72 L58 64 L78 40 Q84 32 100 32 L140 32 Q156 32 164 44 L180 68 L188 74 Q196 80 194 96 L194 104 Q194 110 186 110 L26 110 Q16 110 18 100Z" fill="#5b6673"/>
  <path d="M64 70 L82 46 Q86 40 100 40 L114 40 L114 70 Z" fill="#a8bcc9"/>
  <path d="M120 40 L140 40 Q150 40 155 48 L169 70 L120 70 Z" fill="#a8bcc9"/>
  <circle cx="56" cy="110" r="17" fill="#20262d"/><circle cx="56" cy="110" r="7" fill="#9aa5b1"/>
  <circle cx="156" cy="110" r="17" fill="#20262d"/><circle cx="156" cy="110" r="7" fill="#9aa5b1"/>
  <rect x="22" y="84" width="54" height="17" rx="3" fill="#fdfdfd" stroke="#b9c2ca"/>
  <text x="49" y="96" text-anchor="middle" font-size="11" font-family="Noto Sans Lao,sans-serif" fill="#1f3d63">${plate}</text></svg>`;

/* ---------------- map art ---------------- */
function mapArt(variant='pickup', w=342, h=300){
  const road = (x1,y1,x2,y2,wd=9) =>
    `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="#e2e5e9" stroke-width="${wd+3}" stroke-linecap="round"/>
     <path d="M${x1} ${y1}L${x2} ${y2}" stroke="#ffffff" stroke-width="${wd}" stroke-linecap="round"/>`;
  const blocks = [];
  for(let r=0;r<7;r++) for(let c=0;c<6;c++){
    const x = 4 + c*60 + ((r%2)?7:0), y = 6 + r*48;
    blocks.push(`<rect x="${x}" y="${y}" width="${34+(c%3)*9}" height="${22+(r%3)*6}" rx="2" fill="#e9e7e2"/>`);
    blocks.push(`<rect x="${x+40}" y="${y+8}" width="${16+(r%2)*8}" height="18" rx="2" fill="#eceae5"/>`);
  }
  let grid = '';
  for(let i=0;i<7;i++) grid += road(-10, 20+i*46, w+10, 14+i*46);
  for(let i=0;i<6;i++) grid += road(18+i*62, -10, 26+i*62, h+10);

  const poi = (x,y,t,sub='') => `<g><circle cx="${x}" cy="${y}" r="8" fill="#8c99a6"/><circle cx="${x}" cy="${y}" r="3" fill="#fff"/>
    <text x="${x+12}" y="${y+2}" font-size="9.5" font-family="Noto Sans Lao,sans-serif" fill="#5f6b7a">${t}</text>
    ${sub?`<text x="${x+12}" y="${y+12}" font-size="8" font-family="Noto Sans Lao,sans-serif" fill="#96a0ab">${sub}</text>`:''}</g>`;
  const flagG = (x,y) => `<g><path d="M${x} ${y}v-26" stroke="#3c4043" stroke-width="2.4"/><path d="M${x} ${y-26}h22v14h-22z" fill="#2fbf5f"/>
    <circle cx="${x}" cy="${y}" r="8" fill="#2b3038" fill-opacity=".18"/><circle cx="${x}" cy="${y}" r="5.5" fill="#2b3038" stroke="#fff" stroke-width="2"/></g>`;
  const flagR = (x,y) => `<g><path d="M${x} ${y}v-28" stroke="#3c4043" stroke-width="2.4"/><path d="M${x} ${y-28}h23v15h-23z" fill="#e1252b"/></g>`;
  const carMark = (x,y) => `<g transform="translate(${x},${y})"><g transform="translate(-27,-13)">${
    carArt('hatch','#1f2630','#4dd0f5').replace('<svg ','<svg width="54" height="25" ')}</g></g>`;

  let extras = '', marks = '';
  if(variant === 'pickup'){
    extras = poi(58, 196,'ຈັນສະຫວ່າງ') + poi(232, 96,'ຮ້ານຕັດຜົມ ສົມຫວັງ','ຮ້ານທຳຜົມບຸລຸດ')
      + `<text x="86" y="252" font-size="10" font-family="Noto Sans Lao,sans-serif" fill="#68727e">Chansawung Market</text>
         <text x="96" y="264" font-size="8.5" font-family="Noto Sans Lao,sans-serif" fill="#7c8794">ຕະຫຼາດຈັນສະຫວ່າງ</text>`;
    marks = flagG(w/2 - 8, h/2 + 4);
  } else if(variant === 'dest'){
    extras = `<rect x="0" y="${h*0.62}" width="${w}" height="28" fill="#a9d6ec"/>
      <path d="M0 ${h*0.58}h${w}" stroke="#cfe6f5" stroke-width="18"/>
      <rect x="30" y="${h*0.2}" width="120" height="70" rx="6" fill="#dde9d6"/>
      <text x="${w/2-52}" y="${h/2+34}" font-size="10.5" font-family="Noto Sans Lao,sans-serif" fill="#68727e">ທ່າອາກາດຍານນານາຊາດວັດໄຕ</text>
      <text x="${w/2-30}" y="${h/2+46}" font-size="8.5" font-family="Noto Sans Lao,sans-serif" fill="#7c8794">Wattay Int'l Airport</text>`;
    marks = flagR(w/2 - 6, h/2 + 10);
  } else if(variant === 'route' || variant === 'live'){
    const rp = `M40 ${h-40} C 90 ${h-70}, 120 ${h-120}, 176 ${h*0.5} S 250 70, ${w-56} 44`;
    extras = `<path d="${rp}" stroke="#e1252b" stroke-width="9" fill="none" stroke-linecap="round" opacity=".92"/>
      <path d="${rp}" stroke="#ffa9ac" stroke-width="3" fill="none" stroke-linecap="round" opacity=".6"/>`;
    marks = flagG(40, h-40) + flagR(w-56, 44) + (variant==='live' ? carMark(176, h*0.5) : '');
  }
  return `<svg class="mapart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice">
    <rect width="${w}" height="${h}" fill="#f4f3ef"/>${blocks.join('')}${grid}${extras}${marks}</svg>`;
}

function mapPanel(variant, h=290, opts={}){
  const btns = opts.btns === false ? '' : `<div class="mapbtns" style="top:${opts.btnTop||44}px">
      <div class="mbtn"> ${I('traffic')}</div>
      <div class="mbtn"> ${I('layers')}</div>
      <div class="mbtn blue"> ${I('locate')}</div></div>`;
  const top = opts.top === false ? '' : `<div class="mbtn sq" style="position:absolute;right:10px;top:8px">${I('locate')}</div>`;
  return `<div class="map" style="height:${h}px">${mapArt(variant, 342, h)}${top}${btns}
    <div class="matt">Insee Map · mock</div></div>`;
}

/* ---------------- skyline (searching screen) ---------------- */
const skylineArt = () => `<svg class="sky" viewBox="0 0 342 170" preserveAspectRatio="xMidYMax slice">
  <rect width="342" height="170" fill="none"/>
  ${[[10,70],[46,46],[80,92],[118,60],[152,104],[190,52],[224,84],[258,64],[292,96],[320,58]]
    .map(([x,hh],i)=>`<rect x="${x}" y="${150-hh}" width="${26+(i%3)*6}" height="${hh}" rx="3" fill="#f6dcdd" opacity="${0.55+(i%3)*0.12}"/>`).join('')}
  ${[[24,120],[96,132],[176,118],[262,128],[318,124]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="9" fill="#cfe9d6"/><rect x="${x-1.6}" y="${y}" width="3.2" height="10" fill="#bcd9c4"/>`).join('')}
  <rect x="0" y="150" width="342" height="20" fill="#e8eef3"/>
  <path d="M0 158h342" stroke="#fff" stroke-width="3" stroke-dasharray="14 10"/></svg>`;

/* ---------------- phone frame ---------------- */
const phone = inner => `<div class="phone"><div class="scr">${inner}</div></div>`;
const appBar = (time='21:47') =>
  `<div class="sb">${statusBar(time)}</div>
   <div class="abar"><h1>${CFG.appName}</h1><div class="xpill"><em></em>${I('x')}</div></div>`;
const gestureBar = '<div class="gbar"><i></i></div>';

/* ---------- ໄອຄອນເພີ່ມ (ພາກຂະຫຍາຍ) ---------- */
Object.assign(ICONS, {
  car:      _f('<path d="M5.4 11l1.5-4.3A2.6 2.6 0 019.4 5h5.2a2.6 2.6 0 012.5 1.7L18.6 11l1.4.6a2 2 0 011.2 1.8V18a1 1 0 01-1 1h-1.4a1 1 0 01-1-1v-1H6.2v1a1 1 0 01-1 1H3.8a1 1 0 01-1-1v-4.6a2 2 0 011.2-1.8zM7.6 11h8.8l-1-3a1 1 0 00-1-.7H9.6a1 1 0 00-1 .7zM6.6 13.4a1.3 1.3 0 100 2.6 1.3 1.3 0 000-2.6zm10.8 0a1.3 1.3 0 100 2.6 1.3 1.3 0 000-2.6z"/>'),
  moto2:    _f('<path d="M18.5 12a3.5 3.5 0 100 7 3.5 3.5 0 000-7zm0 2a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM5.5 12a3.5 3.5 0 100 7 3.5 3.5 0 000-7zm0 2a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM14 5h4v2h-2.3l1.1 2.6-1.6 1.2-1-2.3-2.6 2.4 2.2 1.5-1.1 1.6-3.4-2.3a1.2 1.2 0 01-.2-1.8l3.4-3.2A2 2 0 0114 5z"/>'),
  box:      _s('<path d="M3.5 7.8L12 3.6l8.5 4.2v8.4L12 20.4l-8.5-4.2z"/><path d="M3.5 7.8L12 12l8.5-4.2M12 12v8.4"/>'),
  calendar: _s('<rect x="3.5" y="5" width="17" height="15.5" rx="2.6"/><path d="M3.5 9.6h17M8 3.3v3.4M16 3.3v3.4"/>'),
  clock:    _s('<circle cx="12" cy="12" r="8.6"/><path d="M12 7.2V12l3.2 1.9"/>'),
  bell:     _f('<path d="M12 2.6a5.4 5.4 0 00-5.4 5.4v3.2L5 14.4a1 1 0 00.9 1.5h12.2a1 1 0 00.9-1.5l-1.6-3.2V8A5.4 5.4 0 0012 2.6zM9.6 17.4a2.5 2.5 0 004.8 0z"/>'),
  receipt:  _s('<path d="M6 2.8h12v18.4l-2.4-1.6-2.4 1.6-2.4-1.6-2.4 1.6V2.8z"/><path d="M9.2 8h5.6M9.2 12h5.6"/>'),
  gift:     _f('<path d="M20 8.5h-2.6a3 3 0 00-.5-4.4c-1.5-1-3.2-.3-4.9 1.9-1.7-2.2-3.4-2.9-4.9-1.9a3 3 0 00-.5 4.4H4a1 1 0 00-1 1v2.6a1 1 0 001 1h16a1 1 0 001-1V9.5a1 1 0 00-1-1zM4.6 14.5V20a1 1 0 001 1h5.5v-6.5zm8.3 0V21h5.5a1 1 0 001-1v-5.5z"/>'),
  shield:   _s('<path d="M12 3l7.2 2.6v5.6c0 4.2-3 7.6-7.2 9-4.2-1.4-7.2-4.8-7.2-9V5.6z"/><path d="M9.2 12l2 2 3.6-3.7"/>'),
  headset:  _s('<path d="M4.6 14v-2.4a7.4 7.4 0 0114.8 0V14"/><rect x="2.8" y="13.4" width="4" height="6" rx="1.8"/><rect x="17.2" y="13.4" width="4" height="6" rx="1.8"/><path d="M19.4 19.4v.4a2.6 2.6 0 01-2.6 2.6H13"/>'),
  userc:    _f('<path d="M12 2.4a9.6 9.6 0 100 19.2 9.6 9.6 0 000-19.2zm0 4.4a3.2 3.2 0 110 6.4 3.2 3.2 0 010-6.4zm0 13.4a7.4 7.4 0 01-5.4-2.4c.6-1.9 3-3 5.4-3s4.8 1.1 5.4 3A7.4 7.4 0 0112 20.2z"/>'),
  edit:     _s('<path d="M4 20h4.2L19 9.2a2.1 2.1 0 000-3l-1.2-1.2a2.1 2.1 0 00-3 0L4 15.8z"/><path d="M14.5 6.5l3 3"/>'),
  plus:     _s('<path d="M12 5.2v13.6M5.2 12h13.6"/>', 'stroke-width="2.2"'),
  trash:    _s('<path d="M4.8 6.6h14.4M9.6 6.6V4.8a1.2 1.2 0 011.2-1.2h2.4a1.2 1.2 0 011.2 1.2v1.8M6.6 6.6l.9 12.6a1.6 1.6 0 001.6 1.5h5.8a1.6 1.6 0 001.6-1.5l.9-12.6"/>'),
  chevR:    _s('<path d="M9.5 5.5l6.4 6.5-6.4 6.5"/>'),
  download: _s('<path d="M12 3.6v11.2M7.4 10.4L12 15l4.6-4.6M4.4 19.4h15.2"/>'),
  lock:     _s('<rect x="4.6" y="10.2" width="14.8" height="10.4" rx="2.4"/><path d="M8 10.2V7.4a4 4 0 018 0v2.8"/>'),
  mail:     _s('<rect x="3" y="5.4" width="18" height="13.2" rx="2.4"/><path d="M3.6 6.6L12 12.6l8.4-6"/>'),
  ccard:    _s('<rect x="2.6" y="5.4" width="18.8" height="13.2" rx="2.6"/><path d="M2.6 9.8h18.8M6.4 14.8h3.4"/>'),
  share:    _s('<circle cx="18" cy="5.4" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="18.6" r="2.6"/><path d="M8.3 10.8 15.7 6.8M8.3 13.2l7.4 4"/>'),
  bank:     _s('<path d="M3.2 9.6 12 4.4l8.8 5.2"/><path d="M5.4 9.6v8.2M9.8 9.6v8.2M14.2 9.6v8.2M18.6 9.6v8.2"/><path d="M3 19.6h18"/>'),
  qr:       _s('<rect x="3.4" y="3.4" width="6.4" height="6.4" rx="1.4"/><rect x="14.2" y="3.4" width="6.4" height="6.4" rx="1.4"/><rect x="3.4" y="14.2" width="6.4" height="6.4" rx="1.4"/><path d="M14.2 14.2h3v3h-3zM20.6 14.2v3M17.6 20.6h3"/>'),
  moon:     _f('<path d="M20.4 14.6A8.6 8.6 0 019.4 3.6a8.8 8.8 0 102.9 17.1 8.8 8.8 0 008.1-6.1z"/>'),
  logout:   _s('<path d="M9.6 20.4H5.8a1.8 1.8 0 01-1.8-1.8V5.4a1.8 1.8 0 011.8-1.8h3.8"/><path d="M15.4 16.4l4.4-4.4-4.4-4.4M19.4 12H9.2"/>'),
  globe:    _s('<circle cx="12" cy="12" r="8.8"/><path d="M3.4 12h17.2M12 3.2c2.3 2.4 3.5 5.5 3.5 8.8S14.3 18.4 12 20.8c-2.3-2.4-3.5-5.5-3.5-8.8S9.7 5.6 12 3.2z"/>'),
  alert:    _s('<path d="M12 3.8L21 19.6H3z"/><path d="M12 9.8v4.4M12 17v.1"/>'),
  scan:     _s('<path d="M3.6 8.4V5.6a2 2 0 012-2h2.8M20.4 8.4V5.6a2 2 0 00-2-2h-2.8M3.6 15.6v2.8a2 2 0 002 2h2.8M20.4 15.6v2.8a2 2 0 01-2 2h-2.8M3.6 12h16.8"/>'),
  refresh:  _s('<path d="M20 11.4a8 8 0 10-1.4 5.6"/><path d="M20 4.6v6.8h-6.8"/>'),
  filter:   _s('<path d="M4 6.4h16M7 12h10M10 17.6h4"/>'),
  send2:    _s('<path d="M21 3L3 10.5l7.4 2.9L13.5 21z"/>'),
  wheel:    _s('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v6M4.2 16.5l5.2-3M19.8 16.5l-5.2-3"/>')
});

/* ============================================================
   ແຜນທີ່ແທ້ — Leaflet + OpenStreetMap
   ໃຊ້ໃນເດໂມ/preview/modal · ໃນ gallery ໃຊ້ SVG ຈຳລອງ (ໄວກວ່າ)
   ============================================================ */
let _mapSeq = 0;
const MAPS = {};                       /* id -> {map, o, layer} */
/* ໂໝດແຜນທີ່: ປົກກະຕິ (OSM) ຫຼື ດາວທຽມ (Esri World Imagery) */
const TILES = {
  street: { url:'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            attr:'© OpenStreetMap', max:19, lo:'ປົກກະຕິ' },
  sat:    { url:'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            attr:'© Esri · Maxar', max:19, lo:'ດາວທຽມ' }
};
let MAP_MODE = 'street';
function setMapMode(m){
  if (!TILES[m]) return;
  MAP_MODE = m;
  Object.values(MAPS).forEach(o => { if (o.layer) o.layer.setUrl(TILES[m].url); });
  document.querySelectorAll('.matt2').forEach(a => a.textContent = TILES[m].attr);
  document.querySelectorAll('.modetag').forEach(a => a.textContent = TILES[m].lo);
  document.querySelectorAll('[data-act="toggleMapMode"]').forEach(b => b.classList.toggle('on', m === 'sat'));
  document.querySelectorAll('.map').forEach(el => el.classList.toggle('satmode', m === 'sat'));
}
const GEO = { pos:null, tried:false };  /* ຕຳແໜ່ງ GPS ປັດຈຸບັນ */

/* ໝຸດ SVG ສຳລັບແຜນທີ່ແທ້ */
const pinSVG = (color, label) => `<svg viewBox="0 0 24 34">
  <path d="M12 0a10 10 0 00-10 10c0 7.5 10 24 10 24s10-16.5 10-24A10 10 0 0012 0z" fill="${color}"/>
  <circle cx="12" cy="10" r="4.4" fill="#fff"/>${label ? `<text x="12" y="13" text-anchor="middle" font-size="7" fill="${color}" font-weight="700">${label}</text>` : ''}</svg>`;

/* ສ້າງ placeholder — mountMaps() ຈະຕິດ Leaflet ໃສ່ພາຍຫຼັງ */
function realMap(o){
  const id = 'lmap' + (++_mapSeq);
  const cfg = encodeURIComponent(JSON.stringify(o));
  return `<div class="map" style="height:${o.h}px" id="wrap_${id}">
    <div class="lmap" id="${id}" data-map="${cfg}"></div>
    ${o.pin ? `<div class="pinshadow"></div>
      <div class="centerpin">${pinSVG(o.pin === 'dest' ? '#e1252b' : '#12a150')}</div>
      <div class="droptip">ລາກແຜນທີ່ເພື່ອປັບຈຸດ</div>` : ''}
    ${o.gps ? `<div class="gpsbtn" data-act="useGps">${I('locate')}</div>` : ''}
    ${o.btns === false ? '' : `<div class="mapbtns" style="top:${o.btnTop || 10}px">
      <div class="mbtn">${I('traffic')}</div>
      <div class="mbtn mapmode ${MAP_MODE === 'sat' ? 'on' : ''}" data-act="toggleMapMode" title="ສະຫຼັບແຜນທີ່">${I('layers')}</div>
      <div class="mbtn blue" data-act="useGps">${I('locate')}</div></div>`}
    ${o.btns === false ? `<div class="mbtn mapmode mini ${MAP_MODE === 'sat' ? 'on' : ''}" data-act="toggleMapMode">${I('layers')}</div>` : ''}
    <div class="modetag">${TILES[MAP_MODE].lo}</div>
    <div class="matt2">${TILES[MAP_MODE].attr}</div>
  </div>`;
}

/* ຕິດ Leaflet ໃສ່ທຸກ placeholder ທີ່ຍັງບໍ່ໄດ້ຕິດ */
function mountMaps(onMove){
  document.querySelectorAll('.lmap[data-map]').forEach(el => {
    if (el._mounted) return;
    el._mounted = true;
    let o = {};
    try { o = JSON.parse(decodeURIComponent(el.dataset.map)); } catch(e){}
    /* ບໍ່ມີເນັດ / Leaflet ໂຫຼດບໍ່ໄດ້ → ໃຊ້ແຜນທີ່ SVG ຈຳລອງແທນ */
    if (typeof L === 'undefined'){ el.outerHTML = mapArt(o.variant || 'pickup', 342, o.h || 200); return; }
    const c = o.center || [CFG.center.lat, CFG.center.lng];
    const map = L.map(el, { zoomControl:false, attributionControl:false, dragging:!!o.pin || !!o.drag,
      scrollWheelZoom:false, doubleClickZoom:!!o.pin, touchZoom:!!o.pin, keyboard:false, tap:true });
    const layer = L.tileLayer(TILES[MAP_MODE].url, { maxZoom:19 }).addTo(map);
    MAPS[el.id] = { map, o, layer };
    if (o.nav){
      /* ໂໝດນຳທາງ — ເສັ້ນທາງ ແລະ ລົດ ຖືກຜູກໂດຍ navBindMaps() */
      map.setView(o.center || c, o.zoom || 16);
      if (typeof NAV !== 'undefined' && NAV.R) navBindMaps();
    } else if (o.route && o.route.length === 2){
      /* ໃຊ້ເສັ້ນທາງຈິງຖ້າມີ (o.line) · ບໍ່ດັ່ງນັ້ນເສັ້ນຊື່ລະຫວ່າງ 2 ຈຸດ */
      const pts = (o.line && o.line.length > 2) ? o.line : o.route;
      const line = L.polyline(pts, { color:'#e1252b', weight:6, opacity:.9, lineCap:'round', lineJoin:'round' }).addTo(map);
      L.marker(o.route[0], { icon:L.divIcon({ html:pinSVG('#12a150'), className:'', iconSize:[24,34], iconAnchor:[12,34] }) }).addTo(map);
      L.marker(o.route[1], { icon:L.divIcon({ html:pinSVG('#e1252b'), className:'', iconSize:[24,34], iconAnchor:[12,34] }) }).addTo(map);
      map.fitBounds(line.getBounds(), { padding:[26, 26] });
      if (o.car) L.marker((o.line && o.line.length > 2) ? o.line[Math.floor(o.line.length / 2)] : o.car, { icon:L.divIcon({ html:`<div style="width:34px">${carArt('hatch','#1f2630','#dce5ec')}</div>`,
        className:'', iconSize:[34,16], iconAnchor:[17,8] }) }).addTo(map);
    } else {
      map.setView(c, o.zoom || 16);
      if (o.marker) L.marker(c, { icon:L.divIcon({ html:pinSVG(o.marker === 'dest' ? '#e1252b' : '#12a150'),
        className:'', iconSize:[24,34], iconAnchor:[12,34] }) }).addTo(map);
    }
    if (o.pin){
      const wrap = el.parentElement;
      map.on('movestart', () => wrap.classList.add('dragging'));
      map.on('moveend', () => { wrap.classList.remove('dragging');
        const p = map.getCenter(); if (onMove) onMove(o.pin, p.lat, p.lng); });
    }
    setTimeout(() => map.invalidateSize(), 60);
  });
}

/* ຂໍຕຳແໜ່ງປັດຈຸບັນ (ໃຊ້ໄດ້ໃນ https ຫຼື localhost) */
function askGeo(cb){
  if (GEO.pos){ cb(GEO.pos); return; }
  if (!navigator.geolocation){ GEO.tried = true; cb(null); return; }
  navigator.geolocation.getCurrentPosition(
    r => { GEO.pos = { lat:r.coords.latitude, lng:r.coords.longitude }; GEO.tried = true; cb(GEO.pos); },
    () => { GEO.tried = true; cb(null); },
    { enableHighAccuracy:true, timeout:6000, maximumAge:60000 });
}

/* ແປພິກັດເປັນທີ່ຢູ່ (Nominatim) — ຖ້າລົ້ມເຫຼວໃຊ້ພິກັດແທນ */
function reverseGeo(lat, lng, cb){
  const fb = `ພິກັດ ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=lo`)
    .then(r => r.ok ? r.json() : null)
    .then(j => cb(j && j.display_name ? j.display_name.split(',').slice(0, 3).join(', ') : fb))
    .catch(() => cb(fb));
}

/* ---------- ຮູບຕົວຢ່າງຈຸດຮັບ (ພາບປະກອບ SVG) ---------- */
const PHOTOS = {
  gate: `<svg viewBox="0 0 200 140"><rect width="200" height="140" fill="#cfe3f0"/>
    <rect y="96" width="200" height="44" fill="#c9cfd4"/><rect y="92" width="200" height="6" fill="#9aa5ad"/>
    <rect x="18" y="42" width="96" height="54" fill="#e8e1d4"/><rect x="18" y="36" width="96" height="8" fill="#b03a3a"/>
    <rect x="52" y="62" width="28" height="34" fill="#8b5e34"/><circle cx="74" cy="80" r="2" fill="#e8c34a"/>
    <rect x="26" y="52" width="18" height="14" fill="#7fb4d8"/><rect x="88" y="52" width="18" height="14" fill="#7fb4d8"/>
    <rect x="120" y="58" width="66" height="38" fill="none" stroke="#6b7a86" stroke-width="3"/>
    <path d="M120 58h66M120 70h66M120 82h66" stroke="#6b7a86" stroke-width="2"/>
    <circle cx="160" cy="34" r="16" fill="#4f9d5c"/><rect x="157" y="44" width="6" height="16" fill="#7a5a3a"/>
    <g transform="translate(120,84) scale(.46)">${carArt('hatch','#e1252b','#dce5ec')}</g>
    <rect y="118" width="200" height="22" fill="rgba(255,255,255,.85)"/><text x="100" y="133" text-anchor="middle" font-size="9" fill="#5a6472" font-family="Noto Sans Lao,sans-serif">ປະຕູບ້ານສີແດງ ຕິດຮ້ານຂາຍເຄື່ອງ</text></svg>`,
  shop: `<svg viewBox="0 0 200 140"><rect width="200" height="140" fill="#dbe7ef"/>
    <rect y="100" width="200" height="40" fill="#c9cfd4"/>
    <rect x="24" y="34" width="152" height="66" fill="#f2ede2"/>
    <rect x="24" y="26" width="152" height="14" fill="#e1252b"/>
    <text x="100" y="37" text-anchor="middle" font-size="10" fill="#fff" font-family="Noto Sans Lao,sans-serif">ຮ້ານກາເຟ</text>
    <path d="M24 40h152l-8 14H32z" fill="#f0b429"/>
    <rect x="40" y="62" width="34" height="38" fill="#8fc4e6"/><rect x="86" y="62" width="34" height="38" fill="#8fc4e6"/>
    <rect x="132" y="62" width="26" height="38" fill="#8b5e34"/>
    <circle cx="176" cy="86" r="8" fill="#4f9d5c"/>
    <rect y="118" width="200" height="22" fill="rgba(255,255,255,.85)"/><text x="100" y="133" text-anchor="middle" font-size="9" fill="#5a6472" font-family="Noto Sans Lao,sans-serif">ຢືນລໍຢູ່ໜ້າຮ້ານກາເຟ ປ້າຍແດງ</text></svg>`,
  landmark: `<svg viewBox="0 0 200 140"><rect width="200" height="140" fill="#cfe3f0"/>
    <rect y="102" width="200" height="38" fill="#cbd6c2"/>
    <path d="M100 18l16 34h-32z" fill="#e0b23c"/><rect x="88" y="52" width="24" height="18" fill="#e8d9a8"/>
    <path d="M74 70h52l8 14H66z" fill="#e0b23c"/><rect x="70" y="84" width="60" height="18" fill="#e8d9a8"/>
    <rect x="94" y="88" width="12" height="14" fill="#8b5e34"/>
    <circle cx="34" cy="88" r="14" fill="#4f9d5c"/><circle cx="168" cy="84" r="17" fill="#4f9d5c"/>
    <rect y="118" width="200" height="22" fill="rgba(255,255,255,.85)"/><text x="100" y="133" text-anchor="middle" font-size="9" fill="#5a6472" font-family="Noto Sans Lao,sans-serif">ຢູ່ຂ້າງວັດ ທາງເຂົ້າຊອຍ</text></svg>`
};
const photoArt = k => PHOTOS[k] || PHOTOS.gate;


/* ============================================================
   ຄິວອາໂຄດ (QR) — ໃຊ້ qrcode-generator ຖ້າໂຫຼດໄດ້
   ບໍ່ດັ່ງນັ້ນວາດລວດລາຍຈຳລອງ (ບໍ່ສະແກນໄດ້ ແຕ່ໜ້າຕາຄືກັນ)
   ============================================================ */
function qrBox(payload, size){
  return `<div class="qrimg" data-qr="${encodeURIComponent(payload)}" style="width:${size}px;height:${size}px"></div>`;
}
function fakeQR(payload, n){
  let h = 0; for (let i = 0; i < payload.length; i++) h = (h * 31 + payload.charCodeAt(i)) >>> 0;
  const rnd = () => (h = (h * 1103515245 + 12345) >>> 0) / 4294967296;
  const finder = (x, y) => `<rect x="${x}" y="${y}" width="7" height="7" fill="#111"/>
    <rect x="${x+1}" y="${y+1}" width="5" height="5" fill="#fff"/><rect x="${x+2}" y="${y+2}" width="3" height="3" fill="#111"/>`;
  let cells = '';
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++){
    const inF = (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);
    if (!inF && rnd() > .5) cells += `<rect x="${x}" y="${y}" width="1" height="1" fill="#111"/>`;
  }
  return `<svg viewBox="0 0 ${n} ${n}" style="width:100%;height:100%"><rect width="${n}" height="${n}" fill="#fff"/>
    ${cells}${finder(0,0)}${finder(n-7,0)}${finder(0,n-7)}</svg>`;
}
function mountQR(){
  document.querySelectorAll('.qrimg[data-qr]').forEach(el => {
    if (el._done) return; el._done = true;
    const payload = decodeURIComponent(el.dataset.qr);
    try {
      if (typeof qrcode === 'undefined') throw new Error('no lib');
      const q = qrcode(0, 'M'); q.addData(payload); q.make();
      el.innerHTML = q.createSvgTag({ cellSize:4, margin:0, scalable:true });
      const svg = el.querySelector('svg'); if (svg){ svg.style.width = '100%'; svg.style.height = '100%'; }
    } catch(e){ el.innerHTML = fakeQR(payload, 33); }
  });
}


/* ============================================================
   ໂລໂກ້ & ຮູບຄົນ
   · ຖ້າມີໄຟລ໌ໃນ assets/ (ຮູບຈາກ AI) → ໃຊ້ຮູບນັ້ນ
   · ຖ້າບໍ່ມີ → ໃຊ້ພາບ SVG ທີ່ວາດໄວ້ (ບໍ່ພັງ)
   ============================================================ */
const ASSET = {
  logo:'assets/logo.png', user:'assets/user.png',
  d1:'assets/driver-1.png', d2:'assets/driver-2.png', d3:'assets/driver-3.png',
  d4:'assets/driver-4.png', d5:'assets/driver-5.png'
};
const photoSlot = (key, svg) => ASSET[key]
  ? `<span class="pslot">${svg}<img src="${ASSET[key]}" alt="" loading="lazy" onerror="this.remove()"></span>`
  : svg;

/* ---- ໂລໂກ້ Insee Drive: ປີກນົກອິນຊີ + ເສັ້ນທາງ ---- */
function logoSVG(){
  return `<svg viewBox="0 0 100 100">
    <defs><linearGradient id="lgG" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f2545a"/><stop offset="1" stop-color="#b3121a"/></linearGradient></defs>
    <rect width="100" height="100" rx="27" fill="url(#lgG)"/>
    <path d="M18 66c16 2 30-3 40-14 6-6 10-14 12-24" stroke="#fff" stroke-width="7.5" fill="none"
      stroke-linecap="round" opacity=".95"/>
    <path d="M63 20l13 2-3 13z" fill="#fff"/>
    <path d="M24 78c14 3 27 1 38-6" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".55"/>
    <circle cx="30" cy="47" r="7" fill="#fff"/>
  </svg>`;
}
const logoMark = () => photoSlot('logo', logoSVG());

/* ---- ຮູບໂປຣໄຟລ໌ (ວາດເອງ) — 6 ແບບບໍ່ຊ້ຳກັນ ---- */
const FACES = [
  { bg:'#dbe6ee', skin:'#e8c39e', hair:'#22262b', shirt:'#2f3a46', cap:false, long:false },
  { bg:'#e8e2d6', skin:'#d9a877', hair:'#2b2118', shirt:'#b3121a', cap:true,  long:false },
  { bg:'#dfe8dc', skin:'#f2d3b3', hair:'#3b2a1e', shirt:'#1f6fa8', cap:false, long:true  },
  { bg:'#e6dfe8', skin:'#c68642', hair:'#141414', shirt:'#2c6a48', cap:true,  long:false },
  { bg:'#f0e2e2', skin:'#e8c39e', hair:'#4a3423', shirt:'#6b4fa0', cap:false, long:true  },
  { bg:'#e3edf4', skin:'#e0b48a', hair:'#1c1c1c', shirt:'#c8242a', cap:false, long:false }
];
function faceSVG(i){
  const f = FACES[i % FACES.length];
  return `<svg viewBox="0 0 100 100">
    <rect width="100" height="100" fill="${f.bg}"/>
    ${f.long ? `<path d="M24 44c0-16 11-26 26-26s26 10 26 26v30H24z" fill="${f.hair}"/>` : ''}
    <ellipse cx="50" cy="46" rx="19" ry="21" fill="${f.skin}"/>
    <path d="M31 42c0-13 8-21 19-21s19 8 19 21c0-6-4-9-9-10-6-1-13 2-19 5-5 2-10 3-10 5z" fill="${f.hair}"/>
    ${f.cap ? `<path d="M28 38c1-13 10-20 22-20s21 7 22 20z" fill="${f.shirt}"/>
               <path d="M26 38h48v5H26z" fill="${f.hair}" opacity=".85"/>` : ''}
    <circle cx="43" cy="46" r="2.4" fill="#2b2118"/><circle cx="57" cy="46" r="2.4" fill="#2b2118"/>
    <path d="M45 56c3 2.4 7 2.4 10 0" stroke="#a9744d" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M50 67c-15 0-27 8-29 22h58c-2-14-14-22-29-22z" fill="${f.shirt}"/>
    <path d="M43 67l7 8 7-8 5 2-12 13-12-13z" fill="#fff" opacity=".9"/>
  </svg>`;
}
const FACE_INDEX = { user:5, d1:0, d2:1, d3:2, d4:3, d5:4 };
/* ຮູບຄົນ: key = 'user' | 'd1'..'d5' */
const personArt = key => photoSlot(key, faceSVG(FACE_INDEX[key] ?? 0));

/* ============================================================
   ຄິດໄລ່ເສັ້ນທາງຈິງຕາມຖະໜົນ (OSRM public server · ບໍ່ຕ້ອງໃຊ້ key)
   ຖ້າເອີ້ນບໍ່ໄດ້ → ຄິດເສັ້ນຊື່ × 1.35 (ຄ່າສະເລ່ຍທາງອ້ອມ)
   ============================================================ */
function haversineKm(a, b){
  const R = 6371, d2r = Math.PI / 180;
  const dLat = (b[0] - a[0]) * d2r, dLng = (b[1] - a[1]) * d2r;
  const x = Math.sin(dLat / 2) ** 2 +
    Math.cos(a[0] * d2r) * Math.cos(b[0] * d2r) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}
function routeRoad(from, to, cb){
  const url = `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}`
            + `?overview=full&geometries=geojson&alternatives=false&steps=false`;
  const fallback = () => {
    const km = +(haversineKm(from, to) * 1.35).toFixed(1);
    cb({ km, min: Math.max(3, Math.round(km * 2.6)), line:[from, to], real:false });
  };
  const t = setTimeout(fallback, 6000);
  fetch(url).then(r => r.ok ? r.json() : null).then(j => {
    clearTimeout(t);
    const r0 = j && j.routes && j.routes[0];
    if (!r0 || !r0.geometry) return fallback();
    cb({ km:+(r0.distance / 1000).toFixed(1), min:Math.max(2, Math.round(r0.duration / 60)),
         line:r0.geometry.coordinates.map(c => [c[1], c[0]]), real:true });
  }).catch(() => { clearTimeout(t); fallback(); });
}


/* ============================================================
   ການນຳທາງແບບ realtime
   - ດຶງເສັ້ນທາງຈິງພ້ອມຄຳສັ່ງລ້ຽວຈາກ OSRM (steps=true)
   - ເຄື່ອນລົດຕາມເສັ້ນທາງທຸກວິນາທີ · ອັບເດດ ຄຳສັ່ງ / ໄລຍະ / ETA ສົດ
   - ອັບເດດ DOM ໂດຍກົງ (ບໍ່ render ໜ້າຈໍຄືນ) ເພື່ອບໍ່ໃຫ້ແຜນທີ່ກະພິບ
   ============================================================ */

/* ---- ເລຂາຄະນິດເສັ້ນທາງ ---- */
function cumDist(line){
  const c = [0];
  for (let i = 1; i < line.length; i++) c.push(c[i - 1] + haversineKm(line[i - 1], line[i]) * 1000);
  return c;
}
function bearingOf(a, b){
  const d2r = Math.PI / 180, r2d = 180 / Math.PI;
  const y = Math.sin((b[1] - a[1]) * d2r) * Math.cos(b[0] * d2r);
  const x = Math.cos(a[0] * d2r) * Math.sin(b[0] * d2r) -
            Math.sin(a[0] * d2r) * Math.cos(b[0] * d2r) * Math.cos((b[1] - a[1]) * d2r);
  return (Math.atan2(y, x) * r2d + 360) % 360;
}
/* ຕຳແໜ່ງເມື່ອແລ່ນໄປແລ້ວ m ແມັດ ຕາມເສັ້ນທາງ */
function posAt(line, cum, m){
  const last = cum.length - 1;
  if (m <= 0) return { pos:line[0], bearing:bearingOf(line[0], line[1] || line[0]), idx:0 };
  if (m >= cum[last]) return { pos:line[last], bearing:bearingOf(line[last - 1] || line[last], line[last]), idx:last };
  let i = 1;
  while (i < last && cum[i] < m) i++;
  const seg = cum[i] - cum[i - 1] || 1;
  const t = (m - cum[i - 1]) / seg;
  const a = line[i - 1], b = line[i];
  return { pos:[a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], bearing:bearingOf(a, b), idx:i };
}

/* ---- ຄຳສັ່ງລ້ຽວເປັນພາສາລາວ ---- */
const TURN_LO = {
  'left':'ລ້ຽວຊ້າຍ', 'right':'ລ້ຽວຂວາ',
  'slight left':'ຊິດຊ້າຍ', 'slight right':'ຊິດຂວາ',
  'sharp left':'ລ້ຽວຊ້າຍຫັກສອກ', 'sharp right':'ລ້ຽວຂວາຫັກສອກ',
  'straight':'ໄປຊື່', 'uturn':'ກັບລົດ'
};
function instrText(st){
  if (!st) return 'ໄປຊື່';
  const road = st.name ? ' ເຂົ້າ ' + st.name : '';
  const t = st.type, m = st.mod || 'straight';
  if (t === 'arrive')   return 'ຮອດປາຍທາງ' + (st.mod === 'left' ? ' ຢູ່ເບື້ອງຊ້າຍ' : st.mod === 'right' ? ' ຢູ່ເບື້ອງຂວາ' : '');
  if (t === 'depart')   return 'ເລີ່ມເດີນທາງ' + road;
  if (t === 'roundabout' || t === 'rotary')
    return 'ເຂົ້າວົງວຽນ ອອກທາງອອກທີ ' + (st.exit || 1) + road;
  if (t === 'merge')    return 'ລວມເຂົ້າຊ່ອງ' + road;
  if (t === 'on ramp')  return 'ຂຶ້ນທາງດ່ວນ' + road;
  if (t === 'off ramp') return 'ອອກທາງດ່ວນ' + road;
  if (t === 'fork')     return (m.includes('left') ? 'ແຍກຊ້າຍ' : m.includes('right') ? 'ແຍກຂວາ' : 'ໄປຊື່') + road;
  if (t === 'end of road') return 'ສຸດທາງ · ' + (TURN_LO[m] || 'ໄປຊື່') + road;
  if (t === 'new name' || t === 'continue') return 'ໄປຊື່' + road;
  return (TURN_LO[m] || 'ໄປຊື່') + road;
}
/* ໄອຄອນລູກສອນຕາມທິດລ້ຽວ */
function turnIcon(st){
  const t = st ? st.type : '', m = (st && st.mod) || 'straight';
  if (t === 'arrive') return _s('<circle cx="12" cy="12" r="8"/><path d="M9 12l2 2 4-4"/>');
  if (t === 'roundabout' || t === 'rotary')
    return _s('<circle cx="12" cy="13" r="5"/><path d="M12 21v-3"/><path d="M17 13h4"/><path d="M21 13l-3-3"/>');
  if (m === 'uturn') return _s('<path d="M8 21V11a4 4 0 018 0v4"/><path d="M12 19l4 2 0-4"/>');
  if (m.includes('sharp left'))  return _s('<path d="M16 20V10L7 5"/><path d="M4 9l3-4 4 3"/>');
  if (m.includes('sharp right')) return _s('<path d="M8 20V10l9-5"/><path d="M20 9l-3-4-4 3"/>');
  if (m.includes('slight left'))  return _s('<path d="M12 21v-8l-4-4"/><path d="M5 12V8h4"/>');
  if (m.includes('slight right')) return _s('<path d="M12 21v-8l4-4"/><path d="M19 12V8h-4"/>');
  if (m.includes('left'))  return _s('<path d="M17 21v-8H7"/><path d="M11 8l-4 5 4 5"/>');
  if (m.includes('right')) return _s('<path d="M7 21v-8h10"/><path d="M13 8l4 5-4 5"/>');
  return _s('<path d="M12 21V4"/><path d="M6 10l6-6 6 6"/>');
}
const fmtM = m => m >= 1000 ? (m / 1000).toFixed(1) + ' km'
  : m >= 100 ? Math.round(m / 10) * 10 + ' ແມັດ' : Math.max(0, Math.round(m / 5) * 5) + ' ແມັດ';

/* ---- ດຶງເສັ້ນທາງພ້ອມຄຳສັ່ງລ້ຽວ ---- */
function routeNav(from, to, cb){
  const url = `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}`
            + `?overview=full&geometries=geojson&alternatives=false&steps=true`;
  const fallback = () => {
    const line = [from, to], cum = cumDist(line), total = cum[1];
    cb({ line, cum, km:+(total / 1000).toFixed(1), min:Math.max(2, Math.round(total / 11.1 / 60)), real:false,
         steps:[{ m:0, dist:total, name:'', type:'depart', mod:'straight' },
                { m:total, dist:0, name:'', type:'arrive', mod:'straight' }] });
  };
  const t = setTimeout(fallback, 7000);
  fetch(url).then(r => r.ok ? r.json() : null).then(j => {
    clearTimeout(t);
    const r0 = j && j.routes && j.routes[0];
    if (!r0 || !r0.geometry) return fallback();
    const line = r0.geometry.coordinates.map(c => [c[1], c[0]]);
    const cum = cumDist(line);
    let acc = 0;
    const steps = ((r0.legs && r0.legs[0] && r0.legs[0].steps) || []).map(s => {
      const o = { m:acc, dist:s.distance, dur:s.duration, name:s.name || '',
                  type:(s.maneuver || {}).type || 'continue', mod:(s.maneuver || {}).modifier || '',
                  exit:(s.maneuver || {}).exit };
      acc += s.distance; return o;
    });
    if (!steps.length) steps.push({ m:0, dist:r0.distance, name:'', type:'depart', mod:'straight' },
                                  { m:r0.distance, dist:0, name:'', type:'arrive', mod:'straight' });
    cb({ line, cum, steps, km:+(r0.distance / 1000).toFixed(1),
         min:Math.max(2, Math.round(r0.duration / 60)), real:true });
  }).catch(() => { clearTimeout(t); fallback(); });
}

/* ---- ເຄື່ອງຈັກນຳທາງ ---- */
const NAV = { on:false, R:null, m:0, speed:11.1, timer:null, cb:null, follow:true, muted:false, spoke:null };
const navCarSVG = () => `<div class="navcar"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l7 18-7-4-7 4z"/></svg></div>`;

function navStart(R, cb, opt = {}){
  navStop();
  NAV.R = R; NAV.m = opt.m || 0; NAV.cb = cb || null; NAV.on = true;
  NAV.speed = opt.speed || 11.1;          /* ~40 km/h */
  NAV.follow = opt.follow !== false;
  NAV.spoke = null;
  navBindMaps();
  navStep(0);
  NAV.timer = setInterval(() => navStep(), 1000);
}
function navStop(){ if (NAV.timer) clearInterval(NAV.timer); NAV.timer = null; NAV.on = false; }
function navSkipTo(frac){ if (!NAV.R) return; NAV.m = NAV.R.cum[NAV.R.cum.length - 1] * frac; navStep(0); }

function navState(){
  const R = NAV.R; if (!R) return null;
  const total = R.cum[R.cum.length - 1] || 1;
  const m = Math.min(NAV.m, total);
  const p = posAt(R.line, R.cum, m);
  const nx = R.steps.find(s => s.m > m + 2) || R.steps[R.steps.length - 1];
  const remain = Math.max(0, total - m);
  const secs = remain / NAV.speed;
  return { m, total, remain, prog:m / total,
           remainKm:+(remain / 1000).toFixed(1),
           remainMin:Math.max(1, Math.round(secs / 60)),
           eta:etaClock(secs), pos:p.pos, bearing:p.bearing,
           step:nx, toTurn:Math.max(0, nx.m - m), done:remain <= 6 };
}
/* ເວລາຮອດປາຍທາງ (ໂມງ) */
function etaClock(secs){
  const d = new Date(Date.now() + secs * 1000);
  return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
}
function navStep(adv){
  if (!NAV.R) return;
  const step = adv === 0 ? 0 : NAV.speed * (0.8 + Math.random() * 0.4);
  NAV.m = Math.min(NAV.m + step, NAV.R.cum[NAV.R.cum.length - 1]);
  const st = navState();
  navPaintMap(st);
  navPaintUI(st);
  navSpeak(st);
  if (NAV.cb) NAV.cb(st);
  if (st.done) navStop();
}
/* ແຈ້ງດ້ວຍສຽງ (ຈຳລອງ — ຂຶ້ນເປັນ toast ຄັ້ງດຽວຕໍ່ຄຳສັ່ງ) */
function navSpeak(st){
  if (NAV.muted || !st.step) return;
  const key = st.step.m + '|' + (st.toTurn > 300 ? 'far' : st.toTurn > 80 ? 'near' : 'now');
  if (NAV.spoke === key) return;
  NAV.spoke = key;
  if (st.toTurn > 300 || st.step.type === 'depart') return;
  if (typeof toast === 'function')
    toast('🔊 ອີກ ' + fmtM(st.toTurn) + ' · ' + instrText(st.step));
}

/* ---- ຜູກກັບແຜນທີ່ Leaflet ---- */
function navPruneMaps(){
  Object.keys(MAPS).forEach(id => { if (!document.getElementById(id)) delete MAPS[id]; });
}
function navBindMaps(){
  navPruneMaps();
  if (typeof L === 'undefined' || !NAV.R) return;
  Object.keys(MAPS).forEach(id => {
    const M = MAPS[id]; if (!M || !M.o || !M.o.nav) return;
    if (M.rest) M.map.removeLayer(M.rest);
    if (M.doneLine) M.map.removeLayer(M.doneLine);
    M.doneLine = L.polyline(NAV.R.line, { color:'#9aa7b4', weight:7, opacity:.55, lineCap:'round' }).addTo(M.map);
    M.rest = L.polyline(NAV.R.line, { color:'#2b6cf6', weight:8, opacity:.95, lineCap:'round', lineJoin:'round' }).addTo(M.map);
    if (!M.car) M.car = L.marker(NAV.R.line[0],
      { icon:L.divIcon({ html:navCarSVG(), className:'', iconSize:[40,40], iconAnchor:[20,20] }), zIndexOffset:900 }).addTo(M.map);
    if (!M.destPin) M.destPin = L.marker(NAV.R.line[NAV.R.line.length - 1],
      { icon:L.divIcon({ html:pinSVG('#e1252b'), className:'', iconSize:[24,34], iconAnchor:[12,34] }) }).addTo(M.map);
    M.map.setView(NAV.R.line[0], 16);
  });
}
function navPaintMap(st){
  if (typeof L === 'undefined' || !st) return;
  Object.keys(MAPS).forEach(id => {
    const M = MAPS[id]; if (!M || !M.car) return;
    M.car.setLatLng(st.pos);
    const el = M.car.getElement && M.car.getElement();
    if (el){ const c = el.querySelector('.navcar'); if (c) c.style.transform = 'rotate(' + st.bearing.toFixed(0) + 'deg)'; }
    if (M.rest){
      const R = NAV.R, i = posAt(R.line, R.cum, st.m).idx;
      M.rest.setLatLngs([st.pos].concat(R.line.slice(i)));
    }
    if (NAV.follow) M.map.panTo(st.pos, { animate:true, duration:.9 });
  });
}
/* ອັບເດດຂໍ້ຄວາມນຳທາງໃນ DOM ໂດຍກົງ (ບໍ່ render ໜ້າຈໍຄືນ) */
function navPaintUI(st){
  const set = (id, v) => { const e = document.getElementById(id); if (e && e.textContent !== v) e.textContent = v; };
  set('navDist',   fmtM(st.toTurn));
  set('navInstr',  instrText(st.step));
  set('navRemain', st.remainKm + ' km');
  set('navMin',    st.remainMin + ' ນາທີ');
  set('navEta',    st.eta);
  set('navSpeed',  Math.round(NAV.speed * 3.6) + ' km/h');
  const ic = document.getElementById('navIcon'); if (ic) ic.innerHTML = turnIcon(st.step);
  const pr = document.getElementById('navProg'); if (pr) pr.style.width = Math.round(st.prog * 100) + '%';
  const nx = document.getElementById('navThen');
  if (nx && NAV.R){ const after = NAV.R.steps.find(s => s.m > st.step.m + 2);
    nx.textContent = after ? 'ຈາກນັ້ນ ' + instrText(after) : 'ຈາກນັ້ນ ຮອດປາຍທາງ'; }
}

/* ============================================================
   ແຊັດກັບລູກຄ້າແບບ realtime + ແປພາສາອັດຕະໂນມັດ
   - ຂໍ້ຄວາມເຂົ້າເອງ (ຈຳລອງ WebSocket) · ຕົວບອກ “ກຳລັງພິມ”
   - ສະຖານະ ສົ່ງແລ້ວ → ສົ່ງເຖິງ → ອ່ານແລ້ວ
   - ແປສອງທາງ: ລູກຄ້າເຫັນພາສາລູກຄ້າ · ຄົນຂັບເຫັນພາສາລາວ
   - ອັບເດດ DOM ໂດຍກົງ ບໍ່ render ໜ້າຈໍຄືນ (ຮັກສາຕຳແໜ່ງ scroll)
   ============================================================ */
const CHAT = { open:false, job:null, msgs:[], unread:0, typing:false, autoTr:true, timers:[], seq:0, onChange:null };
const chatClock = () => { const d = new Date();
  return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };
const chatLang = () => (CHAT.job && CHAT.job.paxLang) || 'lo';
const chatNeedTr = () => CHAT.autoTr && chatLang() !== 'lo';
const _cT = (fn, ms) => CHAT.timers.push(setTimeout(fn, ms));
const chatClearTimers = () => { CHAT.timers.forEach(clearTimeout); CHAT.timers = []; };

/* ຄຳຕອບອັດຕະໂນມັດຂອງລູກຄ້າ (ຂຽນເປັນລາວ ແລ້ວແປໄປພາສາລູກຄ້າ) */
const CHAT_REPLY = [
  { k:['ຮອດແລ້ວ','ລໍຢູ່ໜ້າປະຕູ'], r:'ອອກມາດຽວນີ້ 🙏' },
  { k:['3 ນາທີ','2 ນາທີ'],        r:'ໂອເຄ ລໍໄດ້' },
  { k:['ລົດຕິດ'],                  r:'ບໍ່ເປັນຫຍັງ ຂັບປອດໄພເດີ້' },
  { k:['ຈອດບ່ອນນີ້ບໍ່ໄດ້','ຍ້າຍ'], r:'ໄດ້ ຂ້ອຍຍ່າງມາຫາ' },
  { k:['ຂອບໃຈ'],                   r:'ຂອບໃຈເຊັ່ນກັນ 🙏' }
];
const CHAT_IDLE = ['ຮອດແລ້ວບໍ?', 'ຂ້ອຍໃສ່ເສື້ອສີຟ້າ', 'ຂໍເວລາ 2 ນາທີ'];

function chatOpen(job, seed, onChange){
  chatClearTimers();
  const fresh = !CHAT.job || !job || CHAT.job.id !== job.id;
  CHAT.job = job || CHAT.job;
  CHAT.onChange = onChange || CHAT.onChange;
  if (fresh){ CHAT.msgs = []; CHAT.seq = 0;
    (seed || []).forEach(m => m.who === 'me' ? chatSend(m.tx, true) : chatRecv(m.tx, true)); }
  CHAT.open = true; CHAT.unread = 0;
  chatPaint(); chatIdleTimer();
}
function chatLeave(){ CHAT.open = false; chatClearTimers(); chatPaint(); }
function chatStop(){ chatClearTimers(); CHAT.open = false; CHAT.job = null; CHAT.msgs = []; CHAT.unread = 0; CHAT.typing = false; }

/* ---- ຄົນຂັບສົ່ງ (ພິມເປັນລາວ → ແປໄປພາສາລູກຄ້າ) ---- */
function chatSend(loText, quiet){
  if (!loText || !loText.trim()) return;
  const to = chatLang();
  const out = to === 'lo' ? null : translate(loText, to).text;
  const m = { id:++CHAT.seq, who:'me', text:loText.trim(), tr:out, lang:'lo',
              t:chatClock(), status:'sent' };
  CHAT.msgs.push(m);
  chatPaint();
  if (quiet){ m.status = 'read'; return; }
  _cT(() => { m.status = 'deliv'; chatPaint(); }, 700);
  _cT(() => { m.status = 'read';  chatPaint(); }, 1800);
  chatAutoReply(loText);
  chatIdleTimer();
}
/* ---- ລູກຄ້າສົ່ງ (ພາສາລູກຄ້າ → ແປເປັນລາວໃຫ້ຄົນຂັບ) ---- */
function chatRecv(loSeed, quiet){
  const from = chatLang();
  const shown = from === 'lo' ? loSeed : translate(loSeed, from).text;   /* ຕົ້ນສະບັບຂອງລູກຄ້າ */
  const m = { id:++CHAT.seq, who:'them', text:shown, tr:from === 'lo' ? null : loSeed,
              lang:from, t:chatClock() };
  CHAT.msgs.push(m);
  CHAT.typing = false;
  if (!CHAT.open && !quiet){
    CHAT.unread++;
    if (typeof toast === 'function') toast('💬 ' + (CHAT.job ? CHAT.job.pax : 'ລູກຄ້າ') + ': ' + loSeed);
  }
  chatPaint();
  if (CHAT.onChange) CHAT.onChange(m);
  if (!quiet) chatIdleTimer();
}
/* ຕອບກັບອັດຕະໂນມັດ: ຂຶ້ນ “ກຳລັງພິມ” ກ່ອນ ແລ້ວຄ່ອຍສົ່ງ */
function chatAutoReply(loText){
  const row = CHAT_REPLY.find(x => x.k.some(k => loText.includes(k)));
  const reply = row ? row.r : ['ໂອເຄ ລໍໄດ້', 'ຮັບຊາບ 🙏', 'ໄດ້ເລີຍ'][Math.floor(Math.random() * 3)];
  _cT(() => { CHAT.typing = true; chatPaint(); }, 1200);
  _cT(() => chatRecv(reply), 2900 + Math.random() * 900);
}
/* ລູກຄ້າທັກມາເອງເມື່ອງຽບດົນ */
function chatIdleTimer(){
  _cT(() => {
    if (!CHAT.job) return;
    const last = CHAT.msgs[CHAT.msgs.length - 1];
    if (last && last.who === 'them') return;
    CHAT.typing = true; chatPaint();
    _cT(() => chatRecv(CHAT_IDLE[Math.floor(Math.random() * CHAT_IDLE.length)]), 1800);
  }, 11000);
}
function chatToggleTr(){ CHAT.autoTr = !CHAT.autoTr; chatPaint(); return CHAT.autoTr; }

/* ---- ວາດ ---- */
const TICK = { sent:'✓', deliv:'✓✓', read:'✓✓' };
function chatBubble(m, lang, autoTr){
  lang = lang || chatLang();
  const tr = (autoTr === undefined ? CHAT.autoTr : autoTr) && lang !== 'lo';
  if (m.who === 'me'){
    return `<div class="msg me">${esc(m.text)}
      ${tr && m.tr ? `<span class="tr">${langOf(lang).f} ${esc(m.tr)}</span>` : ''}
      <i class="meta">${m.t}<b class="tick ${m.status}">${TICK[m.status] || '✓'}</b></i></div>`;
  }
  const main = tr && m.tr ? m.tr : m.text;
  const orig = tr && m.tr ? m.text : null;
  return `<div class="msg them">${esc(main)}
    ${orig ? `<span class="tr">${langOf(m.lang).f} ${esc(orig)}</span>` : ''}
    <i class="meta">${m.t}</i></div>`;
}
function chatPaint(){
  const list = document.getElementById('chatList');
  if (list){
    list.innerHTML = `<div class="dp">ມື້ນີ້</div>`
      + CHAT.msgs.map(chatBubble).join('')
      + (CHAT.typing ? `<div class="msg them typing"><i></i><i></i><i></i></div>` : '');
    list.scrollTop = list.scrollHeight;
  }
  const sub = document.getElementById('chatSub');
  if (sub) sub.textContent = CHAT.typing ? 'ກຳລັງພິມ…'
    : chatLang() === 'lo' ? 'ອອນລາຍ' : 'ເວົ້າ' + langOf(chatLang()).n + ' · ແປອັດຕະໂນມັດ' + (CHAT.autoTr ? 'ເປີດ' : 'ປິດ');
  const tg = document.getElementById('chatTr');
  if (tg) tg.className = 'trbtn ' + (CHAT.autoTr ? 'on' : '');
  document.querySelectorAll('.chatbadge').forEach(e => {
    e.textContent = CHAT.unread || '';
    e.style.display = CHAT.unread ? 'grid' : 'none';
  });
}

/* ============================================================
   ປຸ່ມເລື່ອນເພື່ອຢືນຢັນ — ໃຊ້ໄດ້ທັງເມົ້າ ແລະ ນິ້ວ
   <div class="slideconfirm" data-act="acceptBid" data-v="d1">
   ============================================================ */
const slideTrack = (label, act, v) => `
  <div class="slideconfirm" data-act="${act}" data-v="${v}">
    <div class="track">
      <span class="lbl">${label}</span>
      <i class="knob">${I('arrow')}</i>
    </div>
    <div class="hint">ເລື່ອນປຸ່ມໄປທາງຂວາຈົນສຸດເພື່ອຢືນຢັນ</div>
  </div>`;

let _slide = null;
function _slideXY(e){ return e.touches ? e.touches[0].clientX : e.clientX; }
function _slideStart(e){
  const k = e.target.closest && e.target.closest('.slideconfirm .knob');
  if (!k) return;
  const el = k.closest('.slideconfirm'), track = el.querySelector('.track');
  if (el.classList.contains('done')) return;
  _slide = { el, k, startX:_slideXY(e), max:track.clientWidth - k.offsetWidth - 8, moved:false };
  el.classList.add('dragging');
}
function _slideMove(e){
  if (!_slide) return;
  const x = Math.max(0, Math.min(_slide.max, _slideXY(e) - _slide.startX));
  if (x > 3) _slide.moved = true;
  _slide.k.style.transform = `translateX(${x}px)`;
  _slide.el.style.setProperty('--p', (x / _slide.max).toFixed(3));
}
function _slideEnd(){
  if (!_slide) return;
  const { el, k, max, moved } = _slide; _slide = null;
  el.classList.remove('dragging');
  const p = parseFloat(el.style.getPropertyValue('--p') || 0);
  if (p >= 0.82){
    k.style.transition = 'transform .15s'; k.style.transform = `translateX(${max}px)`;
    el.style.setProperty('--p', 1); el.classList.add('done');
    k.innerHTML = ICONS.check;
    const act = el.dataset.act, v = el.dataset.v;
    setTimeout(() => {
      /* ACTIONS ປະກາດດ້ວຍ const → ບໍ່ຢູ່ໃນ window ຕ້ອງອ້າງອີງໂດຍກົງ */
      if (typeof ACTIONS !== 'undefined' && typeof ACTIONS[act] === 'function'){
        ACTIONS[act]({ v });
        if (typeof paintDemo === 'function') paintDemo();
      }
    }, 220);
  } else {
    k.style.transition = 'transform .22s'; k.style.transform = 'translateX(0)';
    el.style.setProperty('--p', 0);
    setTimeout(() => k.style.transition = '', 240);
    if (!moved && typeof toast === 'function') toast('ເລື່ອນປຸ່ມໄປທາງຂວາເພື່ອຢືນຢັນ →');
  }
}
document.addEventListener('pointerdown', _slideStart);
document.addEventListener('pointermove', _slideMove);
document.addEventListener('pointerup', _slideEnd);
document.addEventListener('pointercancel', _slideEnd);
document.addEventListener('touchstart', _slideStart, { passive:true });
document.addEventListener('touchmove', _slideMove, { passive:true });
document.addEventListener('touchend', _slideEnd);
