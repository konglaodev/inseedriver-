/* ============================================================
   state.js — ສະຖານະເລີ່ມຕົ້ນ (BASE) ແລະ ສະຖານະຕົວຢ່າງຂອງແຕ່ລະໜ້າຈໍ
   ໃຊ້ຮ່ວມກັນລະຫວ່າງ index.html (gallery + demo) ແລະ preview.html
   ============================================================ */
const BASE = {
  /* ---- ໃບລົງທະບຽນ (ສຳລັບຄົນທີ່ຍັງບໍ່ມີບັນຊີ) ---- */
  apply:null,
  /* ---- ສະຖານະຄົນຂັບ ---- */
  online:false, otp:'', checks:[],
  /* ---- ງານປັດຈຸບັນ ----
     status: idle → offered → bidding → waiting → assigned → arrived → onTrip → collect → rated */
  job:null, status:'idle', bidPrice:null, bidRank:2, bidders:4,
  /* ນຳທາງ realtime */
  nav:null, route:null, navTime:null,
  popSec:CFG.jobPopSec, bidSec:CFG.bidWindowSec, waitSec:0, tripSec:0, stops:0,
  messages:[], reason:null, paxRating:0, paxTags:[], payMethod:null, tip:0, collected:false,
  /* ---- ຂໍ້ມູນສະສົມ ---- */
  fees:FEES.map(f => ({ ...f })),
  /* ກະເປົາເງິນ */
  wallet:{ balance:WALLET.balance, autoFee:WALLET.autoFee },
  walTx:WALLET_TX.map(t => ({ ...t })),
  walFilter:'all', topupAmt:200000, topupWay:'qr', wdAmt:null,
  trips:HISTORY.map(t => ({ ...t })),
  notifs:NOTIFS.map(n => ({ ...n })),
  today:{ ...TODAY },
  /* ---- UI ---- */
  screen:'offline', back:[], log:[], mapMode:'street',
  jobFilter:'all', jobSort:'near', earnKey:'day', histFilter:'all', revFilter:0,
  openTripId:null, openAnn:null, faqOpen:0,
  payAmt:null, payVia:'qr',
  sos:false, sharing:true, recording:false,
  settings:{ nav:'inapp', sound:true, vibrate:true, lang:'lo',
             kinds:{ taxi:true, pick:true, sched:true, airport:true, moto:false, charter:true, drivemine:true } }
};

/* ໃບລົງທະບຽນຕົວຢ່າງ (ໃຊ້ຊ້ຳໃນຫຼາຍຂັ້ນ) */
const AP = {
  name:'ທ້າວ ວິໄລສັກ ພົມມະຈັນ', dob:'14/03/1992', sex:'m', idno:'01-2288741',
  phone:'+856 20 5566 7788', email:'vilaysak@email.la',
  village:'ບ້ານໜອງບອນ', district:'ໄຊເສດຖາ', province:'ນະຄອນຫຼວງວຽງຈັນ',
  licType:'B', licNo:'LA-4471882', licExp:'14/03/2028', years:'7', manual:true,
  langs:['ລາວ','ໄທ'], zone:'ຈັນທະບູລີ',
  carType:'sedan', carModel:'Toyota Vios', carYear:'2019', carPlate:'ກມ 2278'
};
const DOCS_ALL = ['id','lic','res','pol','reg','vins','vpic'];

const SAMPLE = {
  /* ລົງທະບຽນ & ຢືນຢັນຕົວຕົນ */
  splash:        {},
  apply:         {},
  applyPersonal: { apply:{ ...AP, step:1 } },
  applyLicense:  { apply:{ ...AP, step:2 } },
  applyDocs:     { apply:{ ...AP, step:3, docs:['id','lic','res','pol'] } },
  applyVerify:   { apply:{ ...AP, step:4, docs:DOCS_ALL, verify:['phone'], otp:'48' } },
  applyReview:   { apply:{ ...AP, step:5, docs:DOCS_ALL, verify:['phone','idcard','selfie'], agree:['bg','data'] } },
  applyStatus:   {},

  /* ເຂົ້າສູ່ລະບົບ */
  login:         {},
  otp:           { otp:'4821' },

  /* ໜ້າຫຼັກ & ລໍຮັບງານ */
  offline:       {},
  online:        { online:true },
  jobList:       { online:true },

  /* ປະມູນລາຄາ */
  jobOffer:      { online:true, job:JOBS[0], status:'offered', popSec:14 },
  bid:           { online:true, job:JOBS[0], status:'bidding', bidPrice:JOBS[0].offer + 5000 },
  bidWait:       { online:true, job:JOBS[0], status:'waiting', bidPrice:JOBS[0].offer + 5000, bidSec:38, bidRank:2, bidders:4 },

  /* ໄປຮັບ & ເດີນທາງ */
  toPickup:      { online:true, job:JOBS[0], status:'assigned', bidPrice:JOBS[0].offer },
  arrived:       { online:true, job:JOBS[0], status:'arrived', bidPrice:JOBS[0].offer, waitSec:412 },
  onTrip:        { online:true, job:JOBS[0], status:'onTrip', bidPrice:JOBS[0].offer, waitSec:412, tripSec:540 },
  chat:          { online:true, job:JOBS[0], status:'assigned', messages:[
                     { who:'them', tx:'ຂ້ອຍລໍຢູ່ປະຕູບ້ານສີແດງເດີ້ 🙏', t:'21:50' },
                     { who:'me',   tx:'ຮັບຊາບ ຮອດໃນ 2 ນາທີ', t:'21:50' },
                     { who:'me',   tx:'ຕຳແໜ່ງປັດຈຸບັນຂອງຂ້ອຍ 📍', t:'21:51' },
                     { who:'them', tx:'ເຫັນແລ້ວ ຂອບໃຈ', t:'21:51' }] },
  collect:       { online:true, job:JOBS[0], status:'collect', bidPrice:JOBS[0].offer, waitSec:412, tip:5000, payMethod:'cash' },

  /* ໃຫ້ຄະແນນ · ຍົກເລີກ · ງານພິເສດ */
  ratePax:       { online:true, job:JOBS[0], status:'rated', bidPrice:JOBS[0].offer, waitSec:412, tip:5000,
                   payMethod:'cash', collected:true, paxRating:5, paxTags:['ສຸພາບ ເປັນມິດ'] },
  cancel:        { online:true, job:JOBS[0], status:'arrived', reason:'r1' },
  charterJob:    { online:true, job:JOBS[4], status:'offered' },
  driveMineJob:  { online:true, job:JOBS[5], status:'offered', checks:['i0','i1','i2'] },

  /* ລາຍໄດ້ & ຄ່າທຳນຽມ */
  earnings:      { earnKey:'week' },
  payFee:        { payAmt:58100, payVia:'qr' },
  feeHistory:    {},

  /* ກະເປົາເງິນ */
  wallet:        { walFilter:'all' },
  topup:         { topupAmt:200000, topupWay:'qr' },
  withdraw:      { wdAmt:500000 },

  /* ຄະແນນ & ຜົນງານ */
  performance:   {},
  reviews:       { revFilter:0 },

  /* ປະຫວັດງານ */
  history:       { histFilter:'all' },
  historyDetail: { openTripId:HISTORY[1].id },

  /* ລົດ & ເອກະສານ */
  myCar:         {},
  docs:          {},

  /* ຂ່າວ & ຄວາມປອດໄພ */
  notifications: {},
  announce:      { openAnn:'a1' },
  safety:        { sharing:true },

  /* ບັນຊີ */
  profile:       {},
  settings:      { faqOpen:1 }
};

const sampleState = key => ({ ...BASE, ...(SAMPLE[key] || {}) });
