import React, { useState, useRef, useEffect } from "react";

// ---------------------------------------------------------------------------
// Fredericksburg local business directory — split-screen map layout.
// Map powered by Leaflet + OpenStreetMap tiles (no API key required).
// ---------------------------------------------------------------------------

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&display=swap');

:root{
  --bg:#fbfbfa; --surface:#ffffff; --text:#1f2422; --text-2:#646d69; --text-3:#8b938f;
  --line:#e8e8e4; --line-2:#f0f0ec; --brand:#15663f; --brand-bg:#eef4f0; --amber:#b6802a;
  --nav-h:58px;
  --shadow:0 1px 2px rgba(16,24,20,.05),0 1px 3px rgba(16,24,20,.04);
  --shadow-2:0 4px 14px rgba(16,24,20,.08);
}
*{box-sizing:border-box;}
.app{font-family:'Hanken Grotesk',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;font-size:14px;-webkit-font-smoothing:antialiased;}
button{font-family:inherit;cursor:pointer;}
img{display:block;}

/* ── nav ── */
.nav{background:var(--surface);border-bottom:1px solid var(--line);position:sticky;top:0;z-index:40;height:var(--nav-h);}
.nav .inner{display:flex;align-items:center;gap:12px;padding:0 20px;height:100%;}
.brand{display:flex;align-items:center;gap:9px;font-weight:700;font-size:16px;letter-spacing:-.01em;cursor:pointer;white-space:nowrap;margin-right:auto;}
.brand .mark{width:26px;height:26px;border-radius:7px;background:var(--brand);color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;}
.searchbox{display:flex;align-items:center;gap:8px;background:var(--bg);border:1px solid var(--line);border-radius:9px;padding:0 12px;height:40px;flex:1 1 260px;max-width:360px;}
.searchbox:focus-within{border-color:var(--brand);background:#fff;}
.searchbox input{border:none;background:none;outline:none;flex:1;font-size:13.5px;font-family:inherit;color:var(--text);min-width:0;}
.navlink{color:var(--text-2);font-size:13.5px;font-weight:600;background:none;border:none;padding:9px 8px;white-space:nowrap;}
.navlink:hover{color:var(--text);}
.btn{border:1px solid var(--line);background:#fff;border-radius:8px;padding:9px 14px;font-size:13px;font-weight:600;color:var(--text);box-shadow:var(--shadow);white-space:nowrap;min-height:40px;}
.btn:hover{background:var(--bg);}
.btn-primary{background:var(--brand);border-color:var(--brand);color:#fff;}
.btn-primary:hover{background:#0f5031;}

/* ── browse ── */
.browse{position:relative;height:calc(100vh - var(--nav-h));overflow:hidden;}
#fxbg-map{position:absolute;inset:0;width:100%;height:100%;background:#e8e6df;z-index:1;}
.map-loading{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:#e8e6df;font-size:13px;color:var(--text-3);font-weight:500;z-index:2;pointer-events:none;}

/* ── floating list panel ── */
.list-panel{
  position:absolute;top:14px;left:14px;bottom:14px;width:356px;
  z-index:10;display:flex;flex-direction:column;
  background:rgba(251,251,250,.88);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
  border:1px solid rgba(232,232,228,.7);border-radius:16px;
  box-shadow:0 10px 34px rgba(16,24,20,.17);overflow:hidden;
}

/* ── mobile tab strip — lives INSIDE the panel on mobile ── */
.panel-tabs{display:none;}

.filters-bar{border-bottom:1px solid var(--line-2);flex-shrink:0;}
.filters-bar .pills{display:flex;gap:7px;overflow-x:auto;padding:13px 16px;-webkit-overflow-scrolling:touch;}
.filters-bar .pills::-webkit-scrollbar{height:0;}
.pill{border:1px solid var(--line);background:#fff;border-radius:20px;padding:7px 13px;font-size:12.5px;font-weight:600;color:var(--text-2);white-space:nowrap;flex-shrink:0;}
.pill:hover{border-color:var(--text-3);color:var(--text);}
.pill.on{background:var(--brand);border-color:var(--brand);color:#fff;}
.list-scroll{flex:1;overflow-y:auto;padding:6px 14px 16px;}
.list-scroll::-webkit-scrollbar{width:5px;}
.list-scroll::-webkit-scrollbar-thumb{background:#dcdad2;border-radius:5px;}
.listhead{display:flex;justify-content:space-between;align-items:baseline;padding:11px 2px 10px;gap:10px;}
.listhead h2{font-size:16px;font-weight:700;letter-spacing:-.01em;margin:0;}
.listhead .count{color:var(--text-3);font-size:12px;white-space:nowrap;}

/* ── result cards ── */
.card{position:relative;display:flex;gap:13px;background:var(--surface);border:1px solid var(--line);border-radius:13px;padding:11px;margin-bottom:9px;cursor:pointer;transition:transform .12s,box-shadow .12s,border-color .12s;}
.card:last-child{margin-bottom:0;}
.card:hover{transform:translateY(-1px);box-shadow:var(--shadow-2);border-color:#d2cec5;}
.card.hl{border-color:var(--brand);box-shadow:0 0 0 2px rgba(21,102,63,.18),var(--shadow-2);}
.thumb{width:78px;height:78px;border-radius:11px;flex-shrink:0;object-fit:cover;background:#eceae4;}
.thumb-ph{display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:26px;}
.card-body{flex:1;min-width:0;display:flex;flex-direction:column;}
.card-row1{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;}
.bizname{font-weight:700;font-size:14.5px;letter-spacing:-.01em;line-height:1.22;}
.statuspill{flex-shrink:0;font-size:10.5px;font-weight:700;padding:3px 8px;border-radius:20px;white-space:nowrap;margin-top:1px;}
.statuspill.is-open{background:var(--brand-bg);color:var(--brand);}
.statuspill.is-closed{background:#f6e9e4;color:#a8553c;}
.vbadge{display:inline-flex;align-items:center;gap:3px;color:var(--brand);font-size:11px;font-weight:700;margin-top:3px;}
.vbadge svg{width:11px;height:11px;}
.rating{display:flex;align-items:center;gap:4px;font-size:12px;color:var(--text-2);margin-top:4px;flex-wrap:wrap;}
.rating .score{font-weight:700;color:var(--text);}
.stars{color:var(--amber);letter-spacing:.5px;font-size:11px;}
.metaline{font-size:12px;color:var(--text-2);margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.metaline .dot{color:var(--line);margin:0 5px;}
.chips{display:flex;gap:6px;flex-wrap:wrap;margin-top:auto;padding-top:7px;}
.offerchip{display:inline-flex;align-items:center;gap:4px;background:#fdf6e9;border:1px solid #f0e2c4;color:var(--amber);font-size:11px;font-weight:700;border-radius:6px;padding:2px 8px;}
.placechip{font-size:11px;font-weight:700;color:var(--text-2);background:var(--line-2);border-radius:6px;padding:2px 8px;}
.claimchip{font-size:11px;font-weight:700;color:var(--brand);background:var(--brand-bg);border-radius:6px;padding:2px 8px;}
.svcchip{font-size:11px;font-weight:600;color:var(--text-3);background:#f4f3ef;border-radius:6px;padding:2px 8px;}

/* ── leaflet pins ── */
.pin{cursor:pointer;transition:transform .14s ease;will-change:transform;}
.pin .coin{width:40px;height:40px;border-radius:50%;border:3px solid #fff;box-shadow:0 3px 9px rgba(0,0,0,.34);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:16px;}
.pin .coin.sq{border-radius:12px;}
.pin.sel{transform:scale(1.3) translateY(-3px);}
.pin.sel .coin{border-color:var(--brand);box-shadow:0 7px 18px rgba(0,0,0,.42);}

/* ── leaflet chrome overrides ── */
.leaflet-container{font-family:'Hanken Grotesk',sans-serif;background:#e8e6df;}
.leaflet-bar,.leaflet-control-zoom{border:none!important;box-shadow:0 2px 10px rgba(16,24,20,.18)!important;border-radius:11px!important;overflow:hidden;}
.leaflet-control-zoom a{width:34px!important;height:34px!important;line-height:34px!important;color:var(--text)!important;font-size:18px!important;background:#fff!important;border:none!important;}
.leaflet-control-zoom a:first-child{border-bottom:1px solid var(--line-2)!important;}
.leaflet-control-zoom a:hover{background:var(--bg)!important;}
.leaflet-control-attribution{background:rgba(255,255,255,.72)!important;font-size:10px!important;padding:1px 6px!important;border-radius:6px 0 0 0;color:var(--text-3)!important;}
.leaflet-popup-content-wrapper{border-radius:13px!important;box-shadow:0 8px 24px rgba(16,24,20,.22)!important;padding:0!important;overflow:hidden;border:1px solid var(--line);}
.leaflet-popup-content{margin:0!important;width:210px!important;}
.pop{cursor:pointer;}
.pop img{width:100%;height:98px;object-fit:cover;display:block;background:#eceae4;}
.pop .pop-b{padding:9px 12px 11px;}
.pop .pop-name{font-weight:700;font-size:13.5px;letter-spacing:-.01em;line-height:1.2;}
.pop .pop-meta{font-size:11.5px;color:var(--text-2);margin-top:3px;}
.pop .pop-rate{color:var(--amber);font-size:11.5px;font-weight:700;margin-top:4px;}
.pop .pop-head{height:62px;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.95);font-weight:700;font-size:24px;}
.hero{height:180px;border-radius:16px;margin-top:8px;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.9);font-weight:700;font-size:42px;letter-spacing:.05em;}
.ptile{width:100%;aspect-ratio:4/3;border-radius:10px;}

/* ── non-browse pages ── */
.page-wrap{max-width:960px;margin:0 auto;padding:0 20px;}
.back{background:none;border:none;color:var(--text-2);font-size:13px;font-weight:600;padding:16px 0 0;min-height:40px;display:block;}
.back:hover{color:var(--text);}

/* ── detail ── */
.dhead{display:flex;gap:14px;padding:14px 0 16px;border-bottom:1px solid var(--line);}
.dhead .avatar{width:64px;height:64px;border-radius:14px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:700;color:#fff;}
.dhead h1{font-size:23px;font-weight:700;letter-spacing:-.02em;margin:0 0 5px;line-height:1.1;}
.dactions{display:flex;gap:8px;margin-top:14px;flex-wrap:wrap;}
.dsection{padding:20px 0;border-bottom:1px solid var(--line-2);}
.dsection h2{font-size:13px;font-weight:700;margin:0 0 12px;}
.dsection p.about{font-size:14px;line-height:1.6;color:var(--text-2);max-width:620px;margin:0;}
.hours-row{display:flex;justify-content:space-between;max-width:320px;font-size:13.5px;padding:5px 0;color:var(--text-2);}
.hours-row.today{color:var(--text);font-weight:700;}
.offer{border:1px solid var(--line);border-radius:10px;padding:13px 15px;margin-bottom:10px;background:#fff;box-shadow:var(--shadow);}
.offer .tag{display:inline-block;background:#fdf6e9;color:var(--amber);font-size:11px;font-weight:700;border-radius:5px;padding:2px 7px;margin-bottom:7px;}
.offer b{font-size:15px;font-weight:600;display:block;}
.offer p{font-size:12.5px;color:var(--text-2);margin:4px 0 0;}
.offer .exp{font-size:11.5px;color:var(--text-3);font-weight:600;margin-top:7px;}
.event{display:flex;gap:13px;padding:10px 0;border-bottom:1px solid var(--line-2);}
.event:last-child{border-bottom:none;}
.cal{width:50px;flex-shrink:0;border:1px solid var(--line);border-radius:8px;overflow:hidden;text-align:center;}
.cal .m{background:var(--brand);color:#fff;font-size:9.5px;font-weight:600;letter-spacing:.06em;padding:2px 0;text-transform:uppercase;}
.cal .d{font-size:18px;font-weight:700;padding:3px 0;}
.event b{font-size:14px;font-weight:600;}
.event span{font-size:12.5px;color:var(--text-2);display:block;margin-top:1px;}
.review{display:flex;gap:11px;padding:13px 0;border-bottom:1px solid var(--line-2);}
.review:last-child{border-bottom:none;}
.ravatar{width:36px;height:36px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:600;font-size:14px;}
.review .rtop{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
.review .rname{font-weight:600;font-size:13.5px;}
.review .rdate{font-size:12px;color:var(--text-3);}
.review .rstars{color:var(--amber);font-size:12px;margin:3px 0 5px;}
.review p{margin:0;font-size:13.5px;line-height:1.5;color:var(--text-2);}
.mapframe{width:100%;height:220px;border:1px solid var(--line);border-radius:12px;}
.claimbox{background:var(--brand-bg);border:1px solid #d6e5dc;border-radius:12px;padding:18px 20px;margin-top:18px;}
.claimbox h3{margin:0 0 4px;font-size:15px;font-weight:700;}
.claimbox p{margin:0 0 14px;font-size:13px;color:var(--text-2);}

/* ── claim / checkout / verify ── */
.center{max-width:560px;margin:0 auto;padding:34px 20px 70px;}
.center h1{font-size:26px;font-weight:700;letter-spacing:-.02em;margin:0 0 8px;text-align:center;}
.center .lede{text-align:center;color:var(--text-2);font-size:15px;line-height:1.55;margin:0 0 26px;}
.plan{background:var(--surface);border:1px solid var(--line);border-radius:16px;box-shadow:var(--shadow-2);overflow:hidden;}
.plan .top{padding:24px 26px;border-bottom:1px solid var(--line-2);}
.plan .price{font-size:34px;font-weight:700;letter-spacing:-.02em;}
.plan .price span{font-size:15px;font-weight:500;color:var(--text-3);}
.plan .pnote{font-size:12.5px;color:var(--text-3);margin-top:3px;}
.plan ul{list-style:none;margin:0;padding:18px 26px;}
.plan li{display:flex;gap:10px;align-items:flex-start;font-size:13.5px;padding:7px 0;}
.plan li svg{width:16px;height:16px;color:var(--brand);flex-shrink:0;margin-top:1px;}
.plan .pfoot{padding:0 26px 24px;}
.plan .pfoot .btn-primary{width:100%;padding:13px;font-size:14px;border-radius:9px;}
.checkout{max-width:840px;margin:0 auto;padding:8px 20px 70px;}
.checkout h1{font-size:24px;font-weight:700;letter-spacing:-.02em;margin:8px 0 16px;}
.demobar{background:#fdf6e9;border:1px solid #f0e2c4;color:#8a6a23;font-size:12.5px;font-weight:600;border-radius:8px;padding:9px 12px;margin-bottom:16px;}
.cogrid{display:grid;grid-template-columns:1fr 320px;gap:22px;align-items:start;}
.paycard,.summary{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:20px;box-shadow:var(--shadow);}
.summary h3{margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:.06em;color:var(--text-3);}
.srow{display:flex;justify-content:space-between;font-size:13.5px;padding:7px 0;color:var(--text-2);gap:10px;}
.srow.tot{border-top:1px solid var(--line);margin-top:6px;padding-top:12px;color:var(--text);font-weight:700;font-size:15px;}
.secure{display:flex;align-items:center;justify-content:center;gap:6px;font-size:12px;color:var(--text-3);margin-top:12px;}
.payerr{background:#fbeae6;border:1px solid #efc9bf;color:#a8553c;font-size:12.5px;font-weight:600;border-radius:8px;padding:9px 11px;margin-bottom:12px;}
.cancelbtn{background:none;border:1px solid #e7c9c2;color:#a8553c;border-radius:9px;padding:11px;width:100%;font-size:13px;font-weight:600;margin-top:4px;}
.cancelbtn:hover{background:#fbeae6;}
.opt{display:flex;gap:11px;align-items:flex-start;border:1px solid var(--line);border-radius:11px;padding:13px 14px;margin-bottom:9px;cursor:pointer;background:#fff;}
.opt.sel{border-color:var(--brand);background:var(--brand-bg);}
.opt .rdo{width:18px;height:18px;border-radius:50%;border:2px solid var(--line);flex-shrink:0;margin-top:1px;}
.opt.sel .rdo{border-color:var(--brand);background:var(--brand);box-shadow:inset 0 0 0 3px #fff;}
.opt b{font-size:13.5px;font-weight:600;display:block;}
.opt small{font-size:12px;color:var(--text-2);}
.vhint{background:#fdf6e9;border:1px solid #f0e2c4;color:#8a6a23;font-size:12.5px;border-radius:8px;padding:9px 11px;margin:12px 0;line-height:1.5;}
.codeinput{width:100%;text-align:center;letter-spacing:.4em;font-size:22px;font-weight:700;padding:13px;border:1px solid var(--line);border-radius:10px;font-family:inherit;outline:none;color:var(--text);}
.codeinput:focus{border-color:var(--brand);}
.changemethod{background:none;border:none;color:var(--text-2);font-size:12.5px;font-weight:600;width:100%;padding:12px 0 0;}
.changemethod:hover{color:var(--text);}

/* ── dashboard ── */
.panel{display:grid;grid-template-columns:208px 1fr;background:var(--surface);border:1px solid var(--line);border-radius:14px;overflow:hidden;margin-top:14px;box-shadow:var(--shadow);min-height:520px;}
.side{border-right:1px solid var(--line);padding:16px 12px;background:var(--bg);}
.side .who{display:flex;align-items:center;gap:10px;padding:6px 10px 14px;}
.side .who .av{width:34px;height:34px;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:14px;flex-shrink:0;}
.side .who b{font-size:13.5px;font-weight:600;display:block;line-height:1.2;}
.side .who small{font-size:11px;color:var(--brand);font-weight:600;}
.side a{display:block;padding:10px 11px;border-radius:8px;font-size:13px;font-weight:500;color:var(--text-2);white-space:nowrap;}
.side a:hover{background:#fff;color:var(--text);}
.side a.on{background:#fff;color:var(--text);font-weight:600;box-shadow:var(--shadow);}
.main{padding:22px 24px;}
.main h2{font-size:18px;font-weight:700;letter-spacing:-.01em;margin:0 0 3px;}
.main .sub{color:var(--text-2);font-size:13px;margin:0 0 20px;}
.fld{margin-bottom:14px;}
.fld label{display:block;font-size:12px;font-weight:600;color:var(--text-2);margin-bottom:5px;}
.fld input,.fld textarea,.fld select{width:100%;border:1px solid var(--line);border-radius:8px;padding:10px 11px;font-size:13.5px;font-family:inherit;outline:none;background:#fff;color:var(--text);}
.fld input:focus,.fld textarea:focus,.fld select:focus{border-color:var(--brand);}
.two{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.formcard{border:1px solid var(--line);border-radius:11px;padding:15px;background:var(--bg);margin-bottom:12px;}
.formcard h3{margin:0 0 12px;font-size:14px;font-weight:700;}
.formbtns{display:flex;justify-content:flex-end;gap:8px;}
.publishbar{display:flex;justify-content:flex-end;gap:8px;border-top:1px solid var(--line-2);padding-top:16px;margin-top:4px;flex-wrap:wrap;}
.mc{border:1px solid var(--line);border-radius:10px;padding:12px 14px;margin-bottom:9px;display:flex;justify-content:space-between;align-items:center;gap:10px;background:#fff;}
.mc b{font-size:14px;font-weight:600;}
.mc small{font-size:12px;color:var(--text-2);}
.mc .acts{display:flex;gap:6px;flex-shrink:0;}
.linkbtn{background:none;border:none;color:#a8553c;font-size:12.5px;font-weight:600;padding:6px;min-height:36px;}
.dashed{background:none;border:1px dashed var(--line);color:var(--text-2);border-radius:9px;padding:11px;width:100%;font-size:13px;font-weight:500;margin-top:4px;min-height:42px;}
.dashed:hover{border-color:var(--brand);color:var(--brand);}
.empty{color:var(--text-3);font-size:13px;padding:6px 0 12px;}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:18px;}
.stat{border:1px solid var(--line);border-radius:10px;padding:14px;background:#fff;}
.stat .n{font-size:22px;font-weight:700;letter-spacing:-.01em;}
.stat .l{font-size:11.5px;color:var(--text-3);margin-top:2px;}
.stat .d{font-size:11px;color:var(--brand);font-weight:600;margin-top:4px;}
.photogrid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;}
.photogrid img{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:10px;background:#eceae4;}
.photoadd{border:1px dashed var(--line);border-radius:10px;display:flex;align-items:center;justify-content:center;color:var(--text-3);font-size:13px;font-weight:600;aspect-ratio:4/3;}
.photoadd:hover{border-color:var(--brand);color:var(--brand);}
.banner{display:flex;justify-content:space-between;align-items:center;gap:12px;background:var(--brand-bg);border:1px solid #d6e5dc;border-radius:10px;padding:12px 14px;margin-bottom:16px;flex-wrap:wrap;}
.banner span{font-size:13px;}
.tblscroll{overflow-x:auto;-webkit-overflow-scrolling:touch;}
.tbl{width:100%;border-collapse:collapse;font-size:13px;min-width:460px;}
.tbl th{text-align:left;font-size:11px;font-weight:600;color:var(--text-3);text-transform:uppercase;letter-spacing:.04em;padding:8px;border-bottom:1px solid var(--line);}
.tbl td{padding:11px 8px;border-bottom:1px solid var(--line-2);vertical-align:middle;}
.tbl .tn{font-weight:600;display:flex;align-items:center;gap:9px;white-space:nowrap;}
.tbl .av{width:28px;height:28px;border-radius:7px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:11px;flex-shrink:0;}
.st{font-size:11px;font-weight:600;border-radius:20px;padding:3px 9px;display:inline-block;white-space:nowrap;}
.st.claimed{background:var(--brand-bg);color:var(--brand);}
.st.auto{background:#f1f1ed;color:var(--text-2);}
.miniedit{border:1px solid var(--line);background:#fff;border-radius:7px;font-size:12px;font-weight:600;padding:6px 11px;min-height:34px;color:var(--text);}
.miniedit:hover{background:var(--bg);}

.toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:var(--text);color:#fff;font-size:13px;font-weight:500;padding:12px 18px;border-radius:10px;box-shadow:var(--shadow-2);z-index:50;max-width:90%;text-align:center;}
.foot{border-top:1px solid var(--line);margin-top:36px;}
.foot .inner{max-width:960px;margin:0 auto;padding:18px 20px;font-size:12px;color:var(--text-3);}

/* ── responsive ── */
@media(max-width:680px){
  .cogrid{grid-template-columns:1fr;}
  .two{grid-template-columns:1fr;}
}

@media(max-width:600px){
  /* browse fills full remaining height — no offset for a separate tab bar */
  .browse{height:calc(100vh - var(--nav-h));}

  /* hide claim button in nav on mobile */
  .nav .btn-primary{display:none;}

  /*
   * The list panel becomes a full-screen bottom sheet that slides over the map.
   * When mobileTab === "map" we translate it fully off the bottom so the map
   * shows through — this keeps a visual connection between the tabs and the
   * content that's being revealed.
   */
  .list-panel{
    top:0; left:0; right:0; bottom:0;
    width:auto; border-radius:0; border:none;
    box-shadow:none; backdrop-filter:none; -webkit-backdrop-filter:none;
    background:var(--surface);
    transform:translateY(0);
    transition:transform .28s cubic-bezier(.4,0,.2,1);
  }
  .list-panel.mob-map{
    transform:translateY(100%);
  }

  /* tab strip sits at the top of the panel on mobile */
  .panel-tabs{
    display:flex;
    border-bottom:1px solid var(--line);
    flex-shrink:0;
    background:var(--surface);
  }
  .panel-tabs button{
    flex:1; background:none; border:none;
    padding:13px; font-size:13.5px; font-weight:700;
    color:var(--text-2);
    border-bottom:2px solid transparent;
    font-family:inherit;
  }
  .panel-tabs button.on{color:var(--brand);border-bottom-color:var(--brand);}

  /*
   * "Show list" FAB — appears over the map when the panel is slid away.
   * Fades in with a slight delay so it doesn't clash with the slide animation.
   */
  .map-fab{
    position:absolute; bottom:24px; left:50%; transform:translateX(-50%);
    z-index:20;
    background:var(--surface); border:1px solid var(--line);
    border-radius:24px; padding:10px 20px;
    font-size:13.5px; font-weight:700; color:var(--text);
    box-shadow:0 4px 18px rgba(16,24,20,.22);
    display:none;
    white-space:nowrap;
    cursor:pointer;
  }
  .show-map-fab .map-fab{
    display:block;
    animation:fabIn .22s .18s both ease-out;
  }
  @keyframes fabIn{from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}

  .panel{grid-template-columns:1fr;}
  .side{border-right:none;border-bottom:1px solid var(--line);display:flex;gap:6px;overflow-x:auto;padding:10px;-webkit-overflow-scrolling:touch;}
  .side .who{display:none;}
  .side a{padding:9px 13px;border-radius:20px;border:1px solid var(--line);background:#fff;}
  .side a.on{box-shadow:none;border-color:var(--text);background:var(--text);color:#fff;}
  .stats{grid-template-columns:1fr;}
  .photogrid{grid-template-columns:repeat(2,1fr);}
  .dhead h1{font-size:21px;}
  .center h1{font-size:23px;}
  .page-wrap{padding:0 14px;}
}
`;

// ── helpers ──────────────────────────────────────────────────────────────────
const Check = () => (<svg viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>);
const stars  = r => "★".repeat(Math.round(r)) + "☆".repeat(5 - Math.round(r));
const tone   = c => `radial-gradient(circle at 32% 26%, rgba(255,255,255,.26), rgba(0,0,0,.16)), ${c}`;
const MAP_EMBED = "https://www.openstreetmap.org/export/embed.html?bbox=-77.4720%2C38.2940%2C-77.4470%2C38.3120&layer=mapnik&marker=38.3030%2C-77.4595";
const MO = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const monthDay = iso => { const p=(iso||"").split("-"); return p.length===3?{m:MO[+p[1]-1]||"",d:+p[2]}:{m:"",d:""}; };
const fmtDate  = iso => { const {m,d}=monthDay(iso); return m?`${m} ${d}`:""; };
const fmtLong  = iso => iso ? new Date(iso+"T00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}) : "";
const nextMonthISO = () => { const x=new Date(); x.setMonth(x.getMonth()+1); return x.toISOString().slice(0,10); };
const fmtCard  = v => v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
const fmtExp   = v => { const d=v.replace(/\D/g,"").slice(0,4); return d.length>2?d.slice(0,2)+"/"+d.slice(2):d; };
const initials = n => n.split(" ").filter(w=>/[A-Za-z]/.test(w[0])).slice(0,2).map(w=>w[0]).join("");
const KINDS    = ["% off","$ off","BOGO","Free item","Other"];

const REVIEWS = [
  {n:"Dana R.",  c:"#5a6b7a", s:5, dt:"2 weeks ago", t:"Favorite spot downtown. Staff remember your order and the patio is perfect in the morning."},
  {n:"Marcus T.",c:"#7a5230", s:4, dt:"1 month ago",  t:"Solid every time. Gets busy on weekends but the line moves fast."},
  {n:"Priya N.", c:"#3f6b4a", s:5, dt:"1 month ago",  t:"Best pour-over in the area, and they actually know their beans. Highly recommend."},
];

// ── data ─────────────────────────────────────────────────────────────────────
const DATA = [
  { id:1, name:"Caroline Street Coffee", cat:"Coffee & Tea", hood:"Downtown", color:"#7a5230",
    rating:4.8, reviews:214, open:true, until:"6:00 PM", status:"claimed",
    coords:[38.3013,-77.4607],
    about:"A small-batch roastery in a restored storefront on lower Caroline Street. Single-origin pour-overs, espresso, and pastries baked in-house each morning. Back patio open seasonally.",
    addr:"912 Caroline St", phone:"(540) 555-0142", web:"carolinestcoffee.com",
    hours:[["Mon","6:30 AM – 6:00 PM"],["Tue","6:30 AM – 6:00 PM"],["Wed","6:30 AM – 6:00 PM"],["Thu","6:30 AM – 6:00 PM"],["Fri","6:30 AM – 6:00 PM"],["Sat","7:00 AM – 5:00 PM"],["Sun","7:00 AM – 5:00 PM"]], todayIdx:2,
    offers:[{kind:"BOGO",title:"Buy one espresso drink, get one free",details:"Weekdays before 9:00 AM. Show your phone at the counter.",expires:"2026-08-31"},{kind:"$ off",title:"$2 off any pour-over",details:"First visit only.",expires:""}],
    events:[{title:"Latte art throwdown",date:"2026-06-14",time:"7:00 PM",desc:"Watch local baristas compete for the title."},{title:"Local roasters tasting",date:"2026-06-28",time:"2:00 PM",desc:""}],
    sub:{active:true,brand:"Visa",last4:"4242",since:"2025-09-03",renews:"2026-07-03"} },

  { id:2, name:"Hyperion Antiques", cat:"Antiques", hood:"Downtown", color:"#5a6b7a",
    rating:4.5, reviews:96, open:true, until:"6:00 PM", status:"claimed",
    coords:[38.3022,-77.4614],
    about:"Three floors of estate furniture, jewelry, and curiosities. A Caroline Street fixture for over forty years.",
    addr:"608 Caroline St", phone:"(540) 555-0188", web:"hyperionantiques.com",
    hours:[["Mon","Closed"],["Tue","10:00 AM – 6:00 PM"],["Wed","10:00 AM – 6:00 PM"],["Thu","10:00 AM – 6:00 PM"],["Fri","10:00 AM – 6:00 PM"],["Sat","10:00 AM – 6:00 PM"],["Sun","12:00 PM – 5:00 PM"]], todayIdx:2,
    offers:[{kind:"% off",title:"15% off any single item",details:"Excludes appraised pieces over $500.",expires:"2026-07-15"}],
    events:[{title:"Independence Day estate sale",date:"2026-07-04",time:"9:00 AM",desc:""}],
    sub:{active:true,brand:"Mastercard",last4:"5318",since:"2025-11-20",renews:"2026-06-20"} },

  { id:3, name:"Battlefield Brewing Co.", cat:"Brewery", hood:"Route 1 Corridor", color:"#3f6b4a",
    rating:4.7, reviews:331, open:false, until:"3:00 PM", status:"claimed",
    coords:[38.2748,-77.4558],
    about:"Taproom and beer garden pouring small-batch ales brewed on site. Rotating food trucks most evenings.",
    addr:"1495 Emancipation Hwy", phone:"(540) 555-0223", web:"battlefieldbrewing.com",
    hours:[["Mon","Closed"],["Tue","Closed"],["Wed","3:00 PM – 10:00 PM"],["Thu","3:00 PM – 10:00 PM"],["Fri","3:00 PM – 11:00 PM"],["Sat","12:00 PM – 11:00 PM"],["Sun","12:00 PM – 8:00 PM"]], todayIdx:2,
    offers:[{kind:"Other",title:"$5 house pints, 3–5 PM daily",details:"Dine-in only.",expires:""}],
    events:[{title:"Bluegrass + food truck night",date:"2026-06-20",time:"6:00 PM",desc:""},{title:"Trivia night",date:"2026-06-21",time:"7:30 PM",desc:""}],
    sub:{active:true,brand:"Visa",last4:"1187",since:"2025-07-01",renews:"2026-07-01"} },

  { id:4, name:"The Bavarian Chef", cat:"Restaurant", hood:"Downtown", color:"#8a4b3a",
    rating:4.4, reviews:158, open:true, until:"9:00 PM", status:"auto",
    coords:[38.3002,-77.4589],
    addr:"414 William St", phone:"", web:"", about:"", hours:[], offers:[], events:[] },

  { id:5, name:"Riverby Books", cat:"Bookstore", hood:"Downtown", color:"#6a5a8a",
    rating:4.9, reviews:142, open:true, until:"7:00 PM", status:"auto",
    coords:[38.3016,-77.4609],
    addr:"805 Caroline St", phone:"", web:"", about:"", hours:[], offers:[], events:[] },

  { id:6, name:"Sunken Well Tavern", cat:"Restaurant", hood:"College Heights", color:"#996b35",
    rating:4.6, reviews:287, open:true, until:"10:00 PM", status:"auto",
    coords:[38.2993,-77.4583],
    addr:"720 Littlepage St", phone:"", web:"", about:"", hours:[], offers:[], events:[] },

  { id:7, name:"Rappahannock River Plumbing", cat:"Services", hood:"Fredericksburg", color:"#4a6b7a",
    rating:4.7, reviews:89, open:true, until:"5:00 PM", status:"auto",
    coords:null,
    addr:"Service area: all of Fredericksburg", phone:"", web:"", about:"", hours:[], offers:[], events:[] },

  { id:10, name:"Central Rappahannock Library", cat:"Library", hood:"Downtown", color:"#3a6b8a",
    rating:0, reviews:0, open:true, until:"9:00 PM", status:"auto",
    coords:[38.3048,-77.4622],
    about:"The main branch of the Central Rappahannock Regional Library, serving Fredericksburg since 1954. Free Wi-Fi, community meeting rooms, and a local history collection.",
    addr:"1201 Caroline St", phone:"(540) 372-1144", web:"librarypoint.org",
    hours:[["Mon","10:00 AM – 9:00 PM"],["Tue","10:00 AM – 9:00 PM"],["Wed","10:00 AM – 9:00 PM"],["Thu","10:00 AM – 9:00 PM"],["Fri","10:00 AM – 6:00 PM"],["Sat","10:00 AM – 5:00 PM"],["Sun","1:00 PM – 5:00 PM"]], todayIdx:2,
    offers:[], events:[] },

  { id:11, name:"Fredericksburg VRE & Amtrak Station", cat:"Transit", hood:"Downtown", color:"#5a5a7a",
    rating:0, reviews:0, open:true, until:"10:00 PM", status:"auto",
    coords:[38.2986,-77.4602],
    about:"Fredericksburg's commuter rail and intercity Amtrak station. VRE service to DC and Amtrak on the Northeast Regional and Silver Service routes.",
    addr:"200 Lafayette Blvd", phone:"", web:"vre.org",
    hours:[["Mon–Fri","First train ~5:15 AM"],["Sat–Sun","Amtrak only"]], todayIdx:0,
    offers:[], events:[] },

  { id:12, name:"Hurkamp Park", cat:"Park", hood:"Downtown", color:"#3f6b4a",
    rating:0, reviews:0, open:true, until:"Dusk", status:"auto",
    coords:[38.3038,-77.4617],
    about:"A small public green in the heart of downtown, bordered by William and Princess Anne Streets. Host to the Fredericksburg Farmers Market on Saturdays.",
    addr:"200 William St", phone:"", web:"",
    hours:[["Daily","Dawn – Dusk"]], todayIdx:0,
    offers:[], events:[{title:"Farmers Market",date:"2026-06-07",time:"8:00 AM",desc:"Every Saturday, year-round."}] },

  { id:13, name:"Rappahannock River Trail", cat:"Trail", hood:"Riverfront", color:"#2a7a8a",
    rating:0, reviews:0, open:true, until:"Dusk", status:"auto",
    coords:[38.2968,-77.4568],
    about:"A paved multi-use trail running along the Rappahannock River with views of the historic rail bridge. Popular with cyclists, runners, and walkers.",
    addr:"Sophia St riverfront", phone:"", web:"",
    hours:[["Daily","Dawn – Dusk"]], todayIdx:0,
    offers:[], events:[] },

  { id:14, name:"Kenmore Plantation", cat:"Historic Site", hood:"Washington Ave", color:"#8a6b4a",
    rating:0, reviews:0, open:true, until:"5:00 PM", status:"auto",
    coords:[38.3044,-77.4636],
    about:"The 18th-century home of Fielding Lewis and Betty Washington Lewis, sister of George Washington. A National Historic Landmark offering tours and living-history programs.",
    addr:"1201 Washington Ave", phone:"(540) 373-3381", web:"kenmore.org",
    hours:[["Mon","Closed"],["Tue","10:00 AM – 5:00 PM"],["Wed","10:00 AM – 5:00 PM"],["Thu","10:00 AM – 5:00 PM"],["Fri","10:00 AM – 5:00 PM"],["Sat","10:00 AM – 5:00 PM"],["Sun","12:00 PM – 5:00 PM"]], todayIdx:2,
    offers:[], events:[] },
];

const CATS = ["All","Restaurant","Coffee & Tea","Brewery","Antiques","Bookstore","Services","Library","Transit","Park","Trail","Historic Site"];
const PLACE_CATS = new Set(["Library","Transit","Park","Trail","Historic Site"]);

// ── main component ────────────────────────────────────────────────────────────
export default function App() {
  const [view,          setView]          = useState("list");
  const [activeId,      setActiveId]      = useState(null);
  const [cat,           setCat]           = useState("All");
  const [tab,           setTab]           = useState("details");
  const [atab,          setAtab]          = useState("listings");
  const [toast,         setToast]         = useState("");
  const [rows,          setRows]          = useState(DATA);
  const [claimedId,     setClaimedId]     = useState(1);
  const [claimTargetId, setClaimTargetId] = useState(null);
  const [offerForm,     setOfferForm]     = useState(null);
  const [eventForm,     setEventForm]     = useState(null);
  const [pay,           setPay]           = useState(null);
  const [vrf,           setVrf]           = useState(null);
  const [hoverId,       setHoverId]       = useState(null);
  const [mapReady,      setMapReady]      = useState(false);
  const [mobileTab,     setMobileTab]     = useState("list");

  const mapRef         = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef     = useRef({});

  const active = rows.find(r => r.id === activeId);
  const biz    = rows.find(r => r.id === claimedId);
  const list   = cat === "All" ? rows : rows.filter(r => r.cat === cat);

  const ping     = m  => { setToast(m); setTimeout(() => setToast(""), 1700); };
  const go       = v  => { setView(v); window.scrollTo(0, 0); };
  const open     = l  => { setActiveId(l.id); go("detail"); };
  const patchBiz = (id, p) => setRows(rs => rs.map(r => r.id === id ? { ...r, ...p } : r));
  const genCode  = ()  => String(Math.floor(100000 + Math.random() * 900000));

  const saveOffer = f => {
    const o = { kind:f.kind, title:(f.title||"").trim()||"Untitled offer", details:(f.details||"").trim(), expires:f.expires };
    const arr = [...biz.offers]; if (f.idx==null) arr.push(o); else arr[f.idx]=o;
    patchBiz(claimedId,{offers:arr}); setOfferForm(null); ping(f.idx==null?"Offer published":"Offer updated");
  };
  const removeOffer = i => { patchBiz(claimedId,{offers:biz.offers.filter((_,j)=>j!==i)}); ping("Offer removed"); };
  const saveEvent = f => {
    const e = { title:(f.title||"").trim()||"Untitled event", date:f.date, time:(f.time||"").trim(), desc:(f.desc||"").trim() };
    const arr = [...biz.events]; if (f.idx==null) arr.push(e); else arr[f.idx]=e;
    patchBiz(claimedId,{events:arr}); setEventForm(null); ping(f.idx==null?"Event published":"Event updated");
  };
  const removeEvent = i => { patchBiz(claimedId,{events:biz.events.filter((_,j)=>j!==i)}); ping("Event removed"); };

  const subscribe = () => {
    const p=pay, digits=(p.card||"").replace(/\D/g,"");
    if (!p.email||digits.length<15||(p.exp||"").length<5||(p.cvc||"").length<3||!p.name) { setPay({...p,err:"Please complete all fields with a valid card."}); return; }
    const target=claimTargetId||1;
    patchBiz(target,{status:"claimed",sub:{active:true,brand:"Visa",last4:digits.slice(-4),since:new Date().toISOString().slice(0,10),renews:nextMonthISO()}});
    setClaimedId(target); setTab("details"); setPay(null); ping("Subscription active"); go("dash");
  };

  // ── Leaflet map ──────────────────────────────────────────────────────────
  const setupLeaflet = () => {
    if (!mapRef.current || mapInstanceRef.current) return;
    const L = window.L;
    const m = L.map(mapRef.current, { zoomControl:false, attributionControl:true })
               .setView([38.3016, -77.4605], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      subdomains:"abc", maxZoom:19,
      attribution:'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(m);
    L.control.zoom({ position:"topright" }).addTo(m);
    mapInstanceRef.current = m;
    setMapReady(true);
    const fix = () => { if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize(); };
    setTimeout(fix, 60); setTimeout(fix, 300); setTimeout(fix, 800);
    if (window.ResizeObserver) { const ro = new ResizeObserver(fix); ro.observe(mapRef.current); }
  };

  const attachMap = el => {
    if (!el) return;
    mapRef.current = el;
    if (window.L) { setupLeaflet(); return; }
    const found = document.getElementById("lfjs");
    if (found) { found.addEventListener("load", setupLeaflet); return; }
    const lk = document.createElement("link");
    lk.rel="stylesheet"; lk.href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
    document.head.appendChild(lk);
    const sc = document.createElement("script");
    sc.id="lfjs"; sc.src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
    sc.onload = setupLeaflet;
    document.head.appendChild(sc);
  };

  useEffect(() => {
    if (!mapReady || !window.L || !mapInstanceRef.current) return;
    const L=window.L, m=mapInstanceRef.current;
    Object.values(markersRef.current).forEach(mk => m.removeLayer(mk));
    markersRef.current = {};
    const visible = cat==="All" ? rows : rows.filter(r=>r.cat===cat);
    visible.filter(r=>r.coords).forEach(r => {
      const coin = `<div class="coin" style="background:${tone(r.color)}">${r.name[0]}</div>`;
      const icon = L.divIcon({ html:`<div class="pin">${coin}</div>`, className:"", iconSize:[46,46], iconAnchor:[23,23], popupAnchor:[0,-18] });
      const mk = L.marker(r.coords,{icon}).addTo(m);
      const rate = r.rating>0 ? `<div class="pop-rate">★ ${r.rating} · ${r.reviews} reviews</div>` : "";
      mk.bindPopup(`<div class="pop"><div class="pop-head" style="background:${tone(r.color)}">${r.name[0]}</div><div class="pop-b"><div class="pop-name">${r.name}</div><div class="pop-meta">${r.cat} · ${r.hood}</div>${rate}</div></div>`, { closeButton:false, offset:[0,4] });
      mk.on("click", () => open(r));
      mk.on("popupopen", () => { const n=mk.getPopup().getElement(); if(n) n.querySelector(".pop").onclick=()=>open(r); });
      markersRef.current[r.id] = mk;
    });
    const pts = visible.filter(r=>r.coords).map(r=>r.coords);
    if (pts.length) { const pad = mobileTab==="map" ? 16 : 384; try { m.fitBounds(pts,{paddingTopLeft:[pad,30],paddingBottomRight:[40,40],animate:false}); } catch(e){} }
  }, [mapReady, cat, rows, mobileTab]);

  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;
    Object.entries(markersRef.current).forEach(([id, mk]) => {
      const el = mk.getElement && mk.getElement();
      const pin = el && el.querySelector(".pin");
      if (pin) pin.classList.toggle("sel", String(hoverId)===id);
    });
    if (hoverId!=null) {
      const r = rows.find(x=>x.id===hoverId);
      const mk = markersRef.current[hoverId];
      if (r && r.coords) mapInstanceRef.current.panTo(r.coords, { animate:true, duration:0.4 });
      if (mk) mk.openPopup();
    } else {
      mapInstanceRef.current.closePopup();
    }
  }, [hoverId, mapReady]);

  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;
    const m = mapInstanceRef.current, fix = () => m.invalidateSize();
    requestAnimationFrame(fix);
    const t1 = setTimeout(fix, 150), t2 = setTimeout(fix, 600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [mapReady]);

  // invalidate map size when the browse section becomes visible or mobile tab changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const m = mapInstanceRef.current;
    requestAnimationFrame(() => m.invalidateSize());
    const t = setTimeout(() => m.invalidateSize(), 300);
    return () => clearTimeout(t);
  }, [view, mobileTab]);

  useEffect(() => () => {
    if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current=null; }
  }, []);

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div className="app">
      <style>{CSS}</style>

      {/* nav */}
      <nav className="nav"><div className="inner">
        <div className="brand" onClick={() => go("list")}><span className="mark">F</span>Fredericksburg</div>
        <div className="searchbox">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8b938f" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3" strokeLinecap="round"/></svg>
          <input placeholder="Search businesses, places, parks…"/>
        </div>
        <button className="btn btn-primary" onClick={() => { setClaimTargetId(null); go("claim"); }}>Claim a business</button>
      </div></nav>

      {/* ── BROWSE — always mounted so the map never unmounts ── */}
      <div style={{ display: view === "list" ? "block" : "none" }}>
        <div className={"browse" + (mobileTab==="map" ? " show-map-fab" : "")}>
          <div id="fxbg-map" ref={attachMap}/>
          {!mapReady && <div className="map-loading">Loading map…</div>}

          {/* FAB that appears over the map on mobile when the list is slid away */}
          <button className="map-fab" onClick={() => setMobileTab("list")}>≡ Show list</button>

          {/* list panel — slides off screen on mobile when mobileTab === "map" */}
          <div className={"list-panel" + (mobileTab==="map" ? " mob-map" : "")}>

            {/* tab strip lives inside the panel on mobile */}
            <div className="panel-tabs">
              <button className={mobileTab==="list" ? "on" : ""} onClick={() => setMobileTab("list")}>List</button>
              <button className={mobileTab==="map"  ? "on" : ""} onClick={() => setMobileTab("map")}>Map</button>
            </div>

            <div className="filters-bar">
              <div className="pills">
                {CATS.map(c => <button key={c} className={"pill"+(c===cat?" on":"")} onClick={() => setCat(c)}>{c}</button>)}
              </div>
            </div>
            <div className="list-scroll">
              <div className="listhead">
                <h2>{cat==="All" ? "Explore Fredericksburg" : cat}</h2>
                <span className="count">{list.length} results</span>
              </div>
              {list.map(l => (
                <div key={l.id}
                  className={"card"+(hoverId===l.id?" hl":"")}
                  onClick={() => open(l)}
                  onMouseEnter={() => setHoverId(l.id)}
                  onMouseLeave={() => setHoverId(null)}>
                  <div className="thumb thumb-ph" style={{background:tone(l.color)}}>{l.name[0]}</div>
                  <div className="card-body">
                    <div className="card-row1">
                      <span className="bizname">{l.name}</span>
                      {!PLACE_CATS.has(l.cat) && l.open!==null && <span className={"statuspill "+(l.open?"is-open":"is-closed")}>{l.open?"Open":"Closed"}</span>}
                    </div>
                    {l.status==="claimed" && <span className="vbadge"><Check/>Verified</span>}
                    {l.rating>0 && <div className="rating"><span className="score">{l.rating}</span><span className="stars">{stars(l.rating)}</span><span>({l.reviews})</span></div>}
                    <div className="metaline">{l.cat}<span className="dot">·</span>{l.hood}{!PLACE_CATS.has(l.cat) && l.coords && <><span className="dot">·</span>{l.addr}</>}</div>
                    <div className="chips">
                      {PLACE_CATS.has(l.cat) && <span className="placechip">{l.cat}</span>}
                      {l.status==="claimed" && l.offers.length>0 && <span className="offerchip">◆ {l.offers.length} offer{l.offers.length>1?"s":""}</span>}
                      {l.status==="auto" && !PLACE_CATS.has(l.cat) && l.coords && <span className="claimchip">Unclaimed — claim it</span>}
                      {!l.coords && !PLACE_CATS.has(l.cat) && <span className="svcchip">Service area · no location</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── DETAIL ── */}
      {view==="detail" && active && (<div className="page-wrap">
        <button className="back" onClick={() => go("list")}>← Back</button>
        {(active.status==="claimed" || PLACE_CATS.has(active.cat)) && <div className="hero" style={{background:tone(active.color)}}>{initials(active.name)}</div>}
        <div className="dhead">
          <div className="avatar" style={{background:active.color}}>{initials(active.name)}</div>
          <div>
            <h1>{active.name}</h1>
            {active.rating>0 && <div className="rating"><span className="score">{active.rating}</span><span className="stars">{stars(active.rating)}</span><span>({active.reviews} reviews)</span></div>}
            <div className="metaline" style={{fontSize:13}}>{active.cat}<span className="dot">·</span>{active.hood}{active.status==="claimed"&&<> <span className="dot">·</span> <span className="vbadge"><Check/>Verified owner</span></>}</div>
            <div className="dactions">
              <button className="btn btn-primary" onClick={() => ping("Opening directions")}>Directions</button>
              {active.phone && <button className="btn" onClick={() => ping(active.phone)}>Call</button>}
              {active.web && <button className="btn" onClick={() => ping(active.web)}>Website</button>}
            </div>
          </div>
        </div>

        {active.status==="claimed" || PLACE_CATS.has(active.cat) ? (<>
          {active.about && <div className="dsection"><h2>About</h2><p className="about">{active.about}</p></div>}
          {active.offers.length>0 && <div className="dsection"><h2>Offers & coupons</h2>{active.offers.map((o,i)=>(<div key={i} className="offer"><span className="tag">{o.kind}</span><b>{o.title}</b>{o.details&&<p>{o.details}</p>}{o.expires&&<div className="exp">Expires {fmtDate(o.expires)}</div>}</div>))}</div>}
          {active.events.length>0 && <div className="dsection"><h2>Upcoming events</h2>{active.events.map((e,i)=>{const md=monthDay(e.date);return(<div key={i} className="event"><div className="cal"><div className="m">{md.m}</div><div className="d">{md.d}</div></div><div><b>{e.title}</b><span>{e.time}{e.desc?` · ${e.desc}`:""}</span></div></div>);})}</div>}
          {active.hours.length>0 && <div className="dsection"><h2>Hours</h2>{active.hours.map((h,i)=>(<div key={i} className={"hours-row"+(i===active.todayIdx?" today":"")}><span>{h[0]}</span><span>{h[1]}</span></div>))}</div>}
          {active.reviews>0 && <div className="dsection"><h2>Reviews</h2>{REVIEWS.map((r,i)=>(<div key={i} className="review"><div className="ravatar" style={{background:r.c}}>{r.n[0]}</div><div><div className="rtop"><span className="rname">{r.n}</span><span className="rdate">{r.dt}</span></div><div className="rstars">{stars(r.s)}</div><p>{r.t}</p></div></div>))}</div>}
          <div className="dsection" style={{borderBottom:"none"}}><h2>Location</h2><p className="about" style={{marginBottom:12}}>{active.addr}, Fredericksburg, VA 22401</p><iframe className="mapframe" src={MAP_EMBED} title="map" loading="lazy"/></div>
          {active.status==="claimed" && <button className="btn" onClick={() => { setClaimedId(active.id); setTab("details"); go("dash"); }}>Owner? Open dashboard →</button>}
        </>) : (<>
          <div className="dsection" style={{borderBottom:"none"}}><h2>Location</h2><p className="about" style={{marginBottom:12}}>{active.addr}, Fredericksburg, VA 22401</p><iframe className="mapframe" src={MAP_EMBED} title="map" loading="lazy"/></div>
          <div className="claimbox"><h3>Is this your business?</h3><p>This profile was added automatically. Claim it to add your description, hours, photos, offers, and events — and get a verified badge.</p><button className="btn btn-primary" onClick={() => { setClaimTargetId(active.id); go("claim"); }}>Claim this business — $50/mo</button></div>
        </>)}
        <div style={{height:40}}/>
      </div>)}

      {/* ── CLAIM ── */}
      {view==="claim" && (<div className="center">
        <h1>Claim your business</h1>
        <p className="lede">Manage how your business appears to people searching Fredericksburg, and post offers and events directly to your profile.</p>
        <div className="plan">
          <div className="top"><div className="price">$50<span> / month</span></div><div className="pnote">Cancel anytime · no setup fee</div></div>
          <ul>{["Edit your full profile — description, hours, photos, contact","Post unlimited offers and coupons","Add events to your profile and the city calendar","Verified owner badge","Higher placement in your category","Monthly views, calls, and saves"].map(f=>(<li key={f}><Check/>{f}</li>))}</ul>
          <div className="pfoot"><button className="btn btn-primary" onClick={() => {
            const target=claimTargetId||(rows.find(r=>r.status==="auto")||{id:1}).id;
            setClaimTargetId(target); setVrf({method:"phone",sent:false,code:"",entry:"",err:""}); go("verify");
          }}>Continue — $50/mo</button></div>
        </div>
      </div>)}

      {/* ── CHECKOUT ── */}
      {view==="checkout" && pay && (() => { const coBiz=rows.find(r=>r.id===claimTargetId); return (
        <div className="checkout">
          <button className="back" onClick={() => go("claim")}>← Back</button>
          <h1>Checkout</h1>
          <div className="demobar">Demo checkout — no real card is charged.</div>
          <div className="cogrid">
            <div className="paycard">
              {pay.err && <div className="payerr">{pay.err}</div>}
              <div className="fld"><label>Email</label><input value={pay.email} placeholder="you@business.com" onChange={e=>setPay({...pay,email:e.target.value})}/></div>
              <div className="fld"><label>Card number</label><input value={pay.card} placeholder="1234 1234 1234 1234" inputMode="numeric" onChange={e=>setPay({...pay,card:fmtCard(e.target.value)})}/></div>
              <div className="two">
                <div className="fld"><label>Expiry</label><input value={pay.exp} placeholder="MM/YY" inputMode="numeric" onChange={e=>setPay({...pay,exp:fmtExp(e.target.value)})}/></div>
                <div className="fld"><label>CVC</label><input value={pay.cvc} placeholder="123" inputMode="numeric" onChange={e=>setPay({...pay,cvc:e.target.value.replace(/\D/g,"").slice(0,4)})}/></div>
              </div>
              <div className="fld"><label>Name on card</label><input value={pay.name} onChange={e=>setPay({...pay,name:e.target.value})}/></div>
              <div className="fld"><label>Billing ZIP</label><input value={pay.zip} placeholder="22401" inputMode="numeric" onChange={e=>setPay({...pay,zip:e.target.value.replace(/\D/g,"").slice(0,5)})}/></div>
              <button className="btn btn-primary" style={{width:"100%",padding:13,borderRadius:9}} onClick={subscribe}>Subscribe — $50/month</button>
              <div className="secure">🔒 Secure checkout</div>
            </div>
            <div className="summary">
              <h3>ORDER SUMMARY</h3>
              <div className="srow"><span>Owner plan{coBiz?` · ${coBiz.name}`:""}</span><span>$50.00</span></div>
              <div className="srow"><span>Billing</span><span>Monthly</span></div>
              <div className="srow tot"><span>Due today</span><span>$50.00</span></div>
              <p style={{marginTop:14,marginBottom:0,fontSize:12,lineHeight:1.5,color:"var(--text-2)"}}>Renews monthly at $50.00. Cancel anytime from your dashboard.</p>
            </div>
          </div>
        </div>
      ); })()}

      {/* ── VERIFY ── */}
      {view==="verify" && vrf && (() => {
        const vBiz=rows.find(r=>r.id===claimTargetId);
        const mask=p=>p?p.replace(/\d(?=\d{4})/g,"•"):"the number on your listing";
        const toCheckout=()=>{setVrf(null);setPay({email:"",card:"",exp:"",cvc:"",name:"",zip:"",err:""});go("checkout");};
        const METHODS=[["phone","Text a code","To the phone on your listing"],["email","Email a code","To your business email address"]];
        return (
        <div className="center" style={{maxWidth:520}}>
          <button className="back" onClick={() => go("claim")}>← Back</button>
          <h1>Verify ownership</h1>
          <p className="lede">Confirm you represent {vBiz?vBiz.name:"this business"} before managing its listing.</p>
          <div className="paycard" style={{textAlign:"left"}}>
            {!vrf.sent ? (<>
              {METHODS.map(([m,t,d])=>(<div key={m} className={"opt"+(vrf.method===m?" sel":"")} onClick={()=>setVrf({...vrf,method:m})}><div className="rdo"/><div><b>{t}</b><small>{d}</small></div></div>))}
              <button className="btn btn-primary" style={{width:"100%",padding:12,borderRadius:9,marginTop:6}} onClick={()=>setVrf({...vrf,sent:true,code:genCode(),entry:"",err:""})}>Send code</button>
            </>) : (<>
              <p style={{fontSize:13.5,color:"var(--text-2)",margin:"0 0 12px"}}>Enter the 6-digit code sent to {vrf.method==="phone"?mask(vBiz&&vBiz.phone):"your business email"}.</p>
              <input className="codeinput" placeholder="······" inputMode="numeric" value={vrf.entry} onChange={e=>setVrf({...vrf,entry:e.target.value.replace(/\D/g,"").slice(0,6),err:""})}/>
              <div className="vhint">Demo code: {vrf.code}</div>
              {vrf.err && <div className="payerr" style={{marginTop:10}}>{vrf.err}</div>}
              <button className="btn btn-primary" style={{width:"100%",padding:12,borderRadius:9,marginTop:10}} onClick={()=>vrf.entry===vrf.code?toCheckout():setVrf({...vrf,err:"That code doesn't match. Try again."})}>Verify &amp; continue</button>
              <button className="changemethod" onClick={()=>setVrf({...vrf,sent:false,err:""})}>Change method</button>
            </>)}
          </div>
        </div>
      ); })()}

      {/* ── OWNER DASHBOARD ── */}
      {view==="dash" && biz && (<div className="page-wrap" style={{paddingBottom:50}}>
        <button className="back" onClick={() => go("list")}>← Back</button>
        <div className="panel">
          <div className="side">
            <div className="who"><div className="av" style={{background:biz.color}}>{initials(biz.name)}</div><div><b>{biz.name}</b><small>Verified</small></div></div>
            {[["details","Profile"],["offers","Offers"],["events","Events"],["photos","Photos"],["billing","Billing"],["stats","Insights"]].map(([k,l])=><a key={k} className={tab===k?"on":""} onClick={()=>setTab(k)}>{l}</a>)}
          </div>
          <div className="main">
            {tab==="details" && (<>
              <h2>Profile</h2><p className="sub">Changes go live right away.</p>
              <div className="fld"><label>Business name</label><input value={biz.name} onChange={e=>patchBiz(claimedId,{name:e.target.value})}/></div>
              <div className="two"><div className="fld"><label>Phone</label><input value={biz.phone} onChange={e=>patchBiz(claimedId,{phone:e.target.value})}/></div><div className="fld"><label>Website</label><input value={biz.web} onChange={e=>patchBiz(claimedId,{web:e.target.value})}/></div></div>
              <div className="fld"><label>Address</label><input value={biz.addr} onChange={e=>patchBiz(claimedId,{addr:e.target.value})}/></div>
              <div className="fld"><label>Description</label><textarea rows={3} value={biz.about} onChange={e=>patchBiz(claimedId,{about:e.target.value})}/></div>
              <div className="publishbar"><button className="btn" onClick={()=>{setActiveId(claimedId);go("detail");}}>View profile</button><button className="btn btn-primary" onClick={()=>ping("Changes published")}>Publish</button></div>
            </>)}
            {tab==="offers" && (<>
              <h2>Offers & coupons</h2><p className="sub">Active offers appear on your public profile.</p>
              {biz.offers.length===0&&!offerForm&&<div className="empty">No offers yet.</div>}
              {biz.offers.map((o,i)=>(<div key={i} className="mc"><div><b>{o.title}</b><br/><small>{o.kind}{o.expires?` · expires ${fmtDate(o.expires)}`:""}</small></div><div className="acts"><button className="miniedit" onClick={()=>setOfferForm({idx:i,kind:o.kind,title:o.title,details:o.details,expires:o.expires})}>Edit</button><button className="linkbtn" onClick={()=>removeOffer(i)}>Remove</button></div></div>))}
              {offerForm ? (<div className="formcard">
                <h3>{offerForm.idx==null?"New offer":"Edit offer"}</h3>
                <div className="fld"><label>Offer title</label><input value={offerForm.title} placeholder="e.g. 15% off any entrée" onChange={e=>setOfferForm({...offerForm,title:e.target.value})}/></div>
                <div className="two"><div className="fld"><label>Type</label><select value={offerForm.kind} onChange={e=>setOfferForm({...offerForm,kind:e.target.value})}>{KINDS.map(k=><option key={k}>{k}</option>)}</select></div><div className="fld"><label>Expiration</label><input type="date" value={offerForm.expires} onChange={e=>setOfferForm({...offerForm,expires:e.target.value})}/></div></div>
                <div className="fld"><label>Details / terms</label><textarea rows={2} value={offerForm.details} placeholder="Any conditions or exclusions" onChange={e=>setOfferForm({...offerForm,details:e.target.value})}/></div>
                <div className="formbtns"><button className="btn" onClick={()=>setOfferForm(null)}>Cancel</button><button className="btn btn-primary" onClick={()=>saveOffer(offerForm)}>{offerForm.idx==null?"Publish offer":"Save"}</button></div>
              </div>) : <button className="dashed" onClick={()=>setOfferForm({idx:null,kind:"% off",title:"",details:"",expires:""})}>+ Add offer</button>}
            </>)}
            {tab==="events" && (<>
              <h2>Events</h2><p className="sub">Shown on your profile and the city calendar.</p>
              {biz.events.length===0&&!eventForm&&<div className="empty">No events yet.</div>}
              {biz.events.map((e,i)=>(<div key={i} className="mc"><div><b>{e.title}</b><br/><small>{fmtDate(e.date)}{e.time?` · ${e.time}`:""}</small></div><div className="acts"><button className="miniedit" onClick={()=>setEventForm({idx:i,title:e.title,date:e.date,time:e.time,desc:e.desc})}>Edit</button><button className="linkbtn" onClick={()=>removeEvent(i)}>Remove</button></div></div>))}
              {eventForm ? (<div className="formcard">
                <h3>{eventForm.idx==null?"New event":"Edit event"}</h3>
                <div className="fld"><label>Event title</label><input value={eventForm.title} placeholder="e.g. Live music night" onChange={e=>setEventForm({...eventForm,title:e.target.value})}/></div>
                <div className="two"><div className="fld"><label>Date</label><input type="date" value={eventForm.date} onChange={e=>setEventForm({...eventForm,date:e.target.value})}/></div><div className="fld"><label>Time</label><input value={eventForm.time} placeholder="7:00 PM" onChange={e=>setEventForm({...eventForm,time:e.target.value})}/></div></div>
                <div className="fld"><label>Description</label><textarea rows={2} value={eventForm.desc} placeholder="Optional details" onChange={e=>setEventForm({...eventForm,desc:e.target.value})}/></div>
                <div className="formbtns"><button className="btn" onClick={()=>setEventForm(null)}>Cancel</button><button className="btn btn-primary" onClick={()=>saveEvent(eventForm)}>{eventForm.idx==null?"Publish event":"Save"}</button></div>
              </div>) : <button className="dashed" onClick={()=>setEventForm({idx:null,title:"",date:"",time:"",desc:""})}>+ Add event</button>}
            </>)}
            {tab==="photos" && (<>
              <h2>Photos</h2><p className="sub">The first photo is your profile cover.</p>
              <div className="photogrid">{[0,1,2,3].map(n=><div key={n} className="ptile" style={{background:tone(biz.color),filter:`brightness(${1-n*0.07})`}}/>)}<button className="photoadd" onClick={()=>ping("Upload photo")}>+ Add</button></div>
            </>)}
            {tab==="billing" && (<>
              <h2>Billing</h2><p className="sub">Manage your subscription and payment method.</p>
              {biz.sub ? (<>
                <div className="mc"><div><b>Owner plan</b><br/><small>$50.00 / month</small></div><span className={"st "+(biz.sub.active?"claimed":"auto")}>{biz.sub.active?"Active":"Canceled"}</span></div>
                <div className="mc"><div><b>{biz.sub.active?"Next charge":"Access ends"}</b><br/><small>{fmtLong(biz.sub.renews)}</small></div></div>
                <div className="mc"><div><b>Payment method</b><br/><small>{biz.sub.brand} ending {biz.sub.last4}</small></div><button className="miniedit" onClick={()=>ping("Update card")}>Update</button></div>
                {biz.sub.active ? <button className="cancelbtn" onClick={()=>{patchBiz(claimedId,{sub:{...biz.sub,active:false}});ping("Subscription canceled");}}>Cancel subscription</button> : <button className="btn btn-primary" style={{width:"100%",padding:12,borderRadius:9}} onClick={()=>{patchBiz(claimedId,{sub:{...biz.sub,active:true}});ping("Subscription resumed");}}>Resume subscription</button>}
              </>) : (<>
                <div className="empty">No active subscription.</div>
                <button className="btn btn-primary" style={{padding:12,borderRadius:9}} onClick={()=>{setClaimTargetId(claimedId);setPay({email:"",card:"",exp:"",cvc:"",name:"",zip:"",err:""});go("checkout");}}>Subscribe — $50/mo</button>
              </>)}
            </>)}
            {tab==="stats" && (<>
              <h2>Insights</h2><p className="sub">Last 30 days.</p>
              <div className="stats"><div className="stat"><div className="n">1,284</div><div className="l">Profile views</div><div className="d">↑ 12%</div></div><div className="stat"><div className="n">73</div><div className="l">Calls & clicks</div><div className="d">↑ 8%</div></div><div className="stat"><div className="n">41</div><div className="l">Offers saved</div><div className="d">↑ 21%</div></div></div>
              <div className="mc"><div><b>Top search term</b><br/><small>"coffee near me" · 312 views</small></div></div>
              <div className="mc"><div><b>Busiest day</b><br/><small>Saturday · 28% of weekly views</small></div></div>
            </>)}
          </div>
        </div>
      </div>)}

      {/* ── ADMIN ── */}
      {view==="admin" && (<div className="page-wrap" style={{paddingBottom:50}}>
        <button className="back" onClick={() => go("list")}>← Back</button>
        <div className="panel">
          <div className="side">
            <div className="who"><div className="av" style={{background:"#15663f"}}>A</div><div><b>Admin</b><small>Operator</small></div></div>
            {[["listings","All listings"],["add","Add listing"],["sources","Data sources"]].map(([k,l])=><a key={k} className={atab===k?"on":""} onClick={()=>setAtab(k)}>{l}</a>)}
          </div>
          <div className="main">
            {atab==="listings" && (<>
              <h2>All listings</h2><p className="sub">Edit any entry — imported, claimed, or place.</p>
              <div className="banner"><span><b>{rows.filter(r=>r.status==="auto").length}</b> imported · <b>{rows.filter(r=>r.status==="claimed").length}</b> claimed · <b>{rows.filter(r=>PLACE_CATS.has(r.cat)).length}</b> places · <b>{rows.length}</b> total</span><button className="miniedit" onClick={()=>ping("Re-syncing…")}>↻ Re-sync</button></div>
              <div className="tblscroll"><table className="tbl">
                <thead><tr><th>Name</th><th>Category</th><th>Status</th><th></th></tr></thead>
                <tbody>{rows.map(r=>(<tr key={r.id}>
                  <td><span className="tn"><span className="av" style={{background:r.color}}>{initials(r.name)}</span>{r.name}</span></td>
                  <td style={{color:"var(--text-2)"}}>{r.cat}</td>
                  <td><span className={"st "+(r.status==="claimed"?"claimed":"auto")}>{r.status==="claimed"?"Claimed":"Imported"}</span></td>
                  <td style={{textAlign:"right"}}><button className="miniedit" onClick={()=>{if(!PLACE_CATS.has(r.cat)){setClaimedId(r.id);setTab("details");go("dash");}else ping(`Editing ${r.name}`);}}>Edit</button></td>
                </tr>))}</tbody>
              </table></div>
            </>)}
            {atab==="add" && (<>
              <h2>Add listing</h2><p className="sub">Create a business or place the import missed.</p>
              <div className="fld"><label>Name</label><input id="an" placeholder="e.g. Picker's Supply"/></div>
              <div className="two"><div className="fld"><label>Category</label><select id="ac">{CATS.filter(c=>c!=="All").map(c=><option key={c} value={c}>{c}</option>)}</select></div><div className="fld"><label>Neighborhood</label><input id="ah" placeholder="Downtown"/></div></div>
              <div className="fld"><label>Address</label><input id="aa" placeholder="000 Caroline St"/></div>
              <div className="publishbar"><button className="btn btn-primary" onClick={()=>{
                const g=id=>{const el=document.getElementById(id);return el?el.value:""};
                const nm=g("an")||"New listing";
                setRows([...rows,{id:Date.now(),name:nm,cat:g("ac")||"Other",hood:g("ah")||"Downtown",color:"#5a6b7a",rating:4.5,reviews:0,open:true,until:"5:00 PM",status:"auto",coords:null,about:"",addr:g("aa")||"—",phone:"",web:"",hours:[],offers:[],events:[]}]);
                ["an","ac","ah","aa"].forEach(id=>{const el=document.getElementById(id);if(el)el.value=""}); ping("Listing added");
              }}>Add listing</button></div>
            </>)}
            {atab==="sources" && (<>
              <h2>Data sources</h2><p className="sub">Where imported businesses come from.</p>
              <div className="mc"><div><b>Google Places</b><br/><small>Imports name, category, address, hours, rating</small></div><span className="st claimed">Connected</span></div>
              <div className="mc"><div><b>Yelp Fusion</b><br/><small>Supplemental ratings and photos</small></div><button className="miniedit">Connect</button></div>
              <div className="mc"><div><b>Manual</b><br/><small>Listings you add by hand</small></div><span className="st claimed">On</span></div>
              <p className="sub" style={{marginTop:14,marginBottom:0,lineHeight:1.5}}>Imported businesses start as <b>unclaimed</b>. Owners take them over by claiming. You retain edit access to every entry.</p>
            </>)}
          </div>
        </div>
      </div>)}

      <footer className="foot"><div className="inner">Fredericksburg business directory · prototype <span style={{margin:"0 8px",color:"var(--line)"}}>·</span> <button style={{background:"none",border:"none",color:"var(--text-3)",fontSize:12,cursor:"pointer",padding:0}} onClick={() => { setAtab("listings"); go("admin"); }}>Admin</button></div></footer>
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
