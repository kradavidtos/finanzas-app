"use client";
import { useState, useEffect } from "react";

// ─── TOKENS ───────────────────────────────────────────────────────
const C = {
  sage:"#7C8C6E", sageLight:"#A3B38C", sageDark:"#5A6650",
  olive:"#6B7355", botanico:"#4A5240",
  beige:"#F5F0E8", beigeWarm:"#EDE6D6", sand:"#D4C5A9", sandLight:"#E8DECA", cream:"#FAF8F4",
  white:"#FFFFFF", graysoft:"#8A8A8A", graylight:"#E8E4DC",
  charcoal:"#2C2C2A", amber:"#C4893A", amberLight:"#E8B870", rose:"#C47A6B",
};
const FD="'Playfair Display',Georgia,serif";
const FB="'DM Sans',system-ui,sans-serif";
const FM="'DM Mono',monospace";

// ─── FORMATO PESOS COLOMBIANOS ────────────────────────────────────
const fmt = (n) => {
  const num = Math.round(Number(n));
  return "$" + num.toLocaleString("es-CO");
};
const pct = (a,b) => b===0 ? 0 : Math.min(100, Math.round((a/b)*100));

// ─── ESTADO INICIAL VACÍO ─────────────────────────────────────────
const EMPTY = {
  ingresos: [],
  gastos: [],
  deudas: [],
  ahorros: [
    { id:1, nombre:"Fondo emergencia", actual:0, meta:0, color:C.sage },
    { id:2, nombre:"Colchón sin clientes", actual:0, meta:0, color:C.olive },
    { id:3, nombre:"Ahorro libre", actual:0, meta:0, color:C.sageLight },
  ],
  metas: [],
  nombre: "",
  onboarding: false,
};

// ─── ICONS ────────────────────────────────────────────────────────
const Ic = ({ n, sz=18, c="currentColor" }) => {
  const paths = {
    home:["M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z","M9 22V12h6v10"],
    income:["M12 2v20","M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"],
    expense:["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4","M17 8l-5-5-5 5","M12 3v12"],
    debt:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    savings:["M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1","M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"],
    goal:"M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z",
    distribute:["M8 6h13","M8 12h13","M8 18h13","M3 6h.01","M3 12h.01","M3 18h.01"],
    stats:["M18 20V10","M12 20V4","M6 20v-6"],
    habits:["M12 2a10 10 0 1 0 10 10","M12 6v6l4 2"],
    settings:["M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z","M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"],
    plus:["M12 5v14","M5 12h14"],
    x:["M18 6L6 18","M6 6l12 12"],
    check:"M20 6L9 17l-5-5",
    chevron:"M9 18l6-6-6-6",
    leaf:["M2 22l10-10","M16 8c0 0-4 0-8 8","M2 8c0-4 4-6 8-6s8 2 8 6-2 6-4 8"],
    fire:"M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",
    trend:["M22 7l-9.5 9.5-5-5L1 17"],
    sparkle:"M12 3L9.5 9.5 3 12l6.5 2.5L12 21l2.5-6.5L21 12l-6.5-2.5z",
    shield:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    trophy:["M8 21h8","M12 17v4","M7 4H4v6a8 8 0 0 0 16 0V4h-3","M7 4h10"],
    graph:["M3 3v18h18","M7 16l4-8 4 4 4-4"],
    wallet:["M21 12V7H5a2 2 0 0 1 0-4h14v4","M3 5v14a2 2 0 0 0 2 2h16v-5","M18 12a1 1 0 1 0 2 0 1 1 0 0 0-2 0"],
    lock:["M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z","M7 11V7a5 5 0 0 1 10 0v4"],
    refresh:["M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8","M21 3v5h-5","M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16","M8 16H3v5"],
    bolt:"M13 2L3 14h9l-1 8 10-12h-9l1-8",
    moon:"M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
    trash:["M3 6h18","M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"],
    arrow:["M5 12h14","M12 5l7 7-7 7"],
  };
  const d = paths[n];
  if (!d) return null;
  return (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none"
      stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      {(Array.isArray(d)?d:[d]).map((p,i)=><path key={i} d={p}/>)}
    </svg>
  );
};

// ─── STYLES ───────────────────────────────────────────────────────
const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{height:100%;overflow:hidden}
  .fr{font-family:${FB};background:${C.cream};color:${C.charcoal};height:100vh;display:flex;overflow:hidden;-webkit-font-smoothing:antialiased}
  ::-webkit-scrollbar{width:3px}
  ::-webkit-scrollbar-thumb{background:${C.sand};border-radius:4px}
  @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fillBar{from{width:0}to{width:var(--w)}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
  .fu {animation:fadeUp .4s ease both}
  .fu1{animation:fadeUp .4s .06s ease both}
  .fu2{animation:fadeUp .4s .12s ease both}
  .fu3{animation:fadeUp .4s .18s ease both}
  .fu4{animation:fadeUp .4s .24s ease both}
  .flt{animation:float 3.5s ease-in-out infinite}
  .card{background:${C.white};border-radius:18px;border:1px solid ${C.graylight};padding:20px;box-shadow:0 1px 8px rgba(0,0,0,.04);transition:box-shadow .2s,transform .2s}
  .card:hover{box-shadow:0 6px 20px rgba(0,0,0,.08);transform:translateY(-1px)}
  .btn{display:inline-flex;align-items:center;gap:6px;padding:9px 17px;border-radius:10px;border:none;cursor:pointer;font-family:${FB};font-size:13px;font-weight:500;transition:.16s}
  .bp{background:${C.botanico};color:${C.cream}}
  .bp:hover{background:${C.sageDark};transform:translateY(-1px)}
  .bg{background:transparent;color:${C.graysoft};border:1px solid ${C.graylight}}
  .bg:hover{background:${C.beige};color:${C.charcoal}}
  .br{background:transparent;color:${C.rose};border:1px solid ${C.rose}44}
  .br:hover{background:#FDF0EE}
  .inp{width:100%;padding:11px 15px;border:1px solid ${C.graylight};border-radius:11px;font-family:${FB};font-size:14px;color:${C.charcoal};background:${C.cream};outline:none;transition:.16s}
  .inp:focus{border-color:${C.sage};box-shadow:0 0 0 3px rgba(124,140,110,.12)}
  .lbl{font-size:10px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:${C.graysoft};margin-bottom:5px}
  .pb{height:6px;background:${C.graylight};border-radius:99px;overflow:hidden}
  .pf{height:100%;border-radius:99px;animation:fillBar 1s cubic-bezier(.34,1.56,.64,1) both}
  .tag{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:99px;font-size:10px;font-weight:600}
  .ni{display:flex;align-items:center;gap:8px;padding:9px 12px;border-radius:10px;cursor:pointer;transition:.14s;font-size:13px;font-weight:400;color:${C.graysoft};border:none;background:none;width:100%;text-align:left}
  .ni:hover{background:${C.beige};color:${C.charcoal}}
  .ni.act{background:${C.botanico};color:${C.cream};font-weight:500}
  .g2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  .g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px}
  .mo{position:fixed;inset:0;background:rgba(26,26,24,.55);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;z-index:999;padding:16px;animation:fadeUp .16s ease}
  .mb{background:${C.white};border-radius:20px;padding:26px;width:100%;max-width:460px;animation:fadeUp .2s ease;max-height:90vh;overflow-y:auto}
  .ic{background:linear-gradient(135deg,${C.botanico},${C.sage});color:${C.cream};border-radius:18px;padding:20px 22px}
  .empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 24px;text-align:center;gap:12px;opacity:.6}
  select.inp{appearance:none;background-image:url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 7L11 1' stroke='%238A8A8A' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:32px}
  @media(max-width:680px){.sd{display:none!important}.g2,.g3{grid-template-columns:1fr}.mp{padding:16px!important}}
`;

// ─── PROGRESS RING ────────────────────────────────────────────────
const Ring=({p,sz=74,col=C.sage,bg=C.graylight,children})=>{
  const r=(sz-10)/2,circ=2*Math.PI*r,off=circ-(p/100)*circ;
  return(
    <div style={{position:"relative",width:sz,height:sz,flexShrink:0}}>
      <svg width={sz} height={sz} style={{transform:"rotate(-90deg)"}}>
        <circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke={bg} strokeWidth={7}/>
        <circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke={col} strokeWidth={7}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={off}
          style={{transition:"stroke-dashoffset 1s cubic-bezier(.34,1.56,.64,1)"}}/>
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>{children}</div>
    </div>
  );
};

// ─── MODAL ───────────────────────────────────────────────────────
const Modal=({title,onClose,children})=>(
  <div className="mo" onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div className="mb">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
        <h3 style={{fontFamily:FD,fontSize:19,fontWeight:500}}>{title}</h3>
        <button onClick={onClose} className="btn bg" style={{padding:7,borderRadius:9}}><Ic n="x" sz={14}/></button>
      </div>
      {children}
    </div>
  </div>
);

// ─── EMPTY STATE ─────────────────────────────────────────────────
const Empty=({icon,text,sub})=>(
  <div className="empty">
    <div style={{width:48,height:48,borderRadius:14,background:`${C.sage}18`,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <Ic n={icon} sz={22} c={C.sage}/>
    </div>
    <div style={{fontFamily:FD,fontSize:16,color:C.charcoal}}>{text}</div>
    <div style={{fontSize:13,color:C.graysoft}}>{sub}</div>
  </div>
);

// ─── ONBOARDING ──────────────────────────────────────────────────
const Onboarding=({onDone})=>{
  const [nombre,setNombre]=useState("");
  const [paso,setPaso]=useState(0);
  const pasos=[
    {titulo:"Bienvenida a Flore",sub:"Tu sistema financiero personal. Empecemos con lo básico.",icon:"leaf"},
    {titulo:"¿Cómo te llamas?",sub:"Para personalizar tu experiencia.",icon:"sparkle"},
    {titulo:"Todo listo",sub:"Tu app está limpia y lista para empezar.",icon:"check"},
  ];
  return(
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:C.cream,padding:24}}>
      <div style={{maxWidth:420,width:"100%",textAlign:"center"}}>
        <div style={{width:64,height:64,borderRadius:18,background:`linear-gradient(135deg,${C.botanico},${C.sage})`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 28px"}}>
          <Ic n={pasos[paso].icon} sz={28} c={C.cream}/>
        </div>
        <h1 style={{fontFamily:FD,fontSize:28,fontWeight:500,marginBottom:10,color:C.charcoal}}>{pasos[paso].titulo}</h1>
        <p style={{fontSize:15,color:C.graysoft,marginBottom:32,lineHeight:1.6}}>{pasos[paso].sub}</p>

        {paso===1&&(
          <input className="inp" placeholder="Tu nombre" value={nombre}
            onChange={e=>setNombre(e.target.value)}
            style={{marginBottom:20,fontSize:16,textAlign:"center"}}/>
        )}

        {paso===2&&(
          <div style={{background:C.beige,borderRadius:16,padding:"20px",marginBottom:24,textAlign:"left"}}>
            {[
              {ic:"income",t:"Registra cada ingreso que entra"},
              {ic:"debt",t:"Agrega tus deudas y su progreso"},
              {ic:"distribute",t:"Distribuye cada pago inteligentemente"},
              {ic:"savings",t:"Crea bolsillos de ahorro"},
            ].map((i,idx)=>(
              <div key={idx} style={{display:"flex",alignItems:"center",gap:12,marginBottom:idx<3?12:0}}>
                <div style={{width:30,height:30,borderRadius:8,background:`${C.sage}20`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <Ic n={i.ic} sz={14} c={C.sage}/>
                </div>
                <span style={{fontSize:13,color:C.charcoal}}>{i.t}</span>
              </div>
            ))}
          </div>
        )}

        <button className="btn bp" style={{width:"100%",justifyContent:"center",padding:"13px",fontSize:15}}
          onClick={()=>{
            if(paso<2)setPaso(p=>p+1);
            else onDone(nombre||"tú");
          }}>
          {paso===2?"Comenzar":"Siguiente"}
          <Ic n="arrow" sz={16} c={C.cream}/>
        </button>

        <div style={{display:"flex",justifyContent:"center",gap:6,marginTop:20}}>
          {pasos.map((_,i)=>(
            <div key={i} style={{width:i===paso?20:6,height:6,borderRadius:99,background:i===paso?C.botanico:C.graylight,transition:".3s"}}/>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── NAV ─────────────────────────────────────────────────────────
const NAV=[
  {id:"dashboard",l:"Dashboard",ic:"home"},
  {id:"ingresos",l:"Ingresos",ic:"income"},
  {id:"gastos",l:"Gastos",ic:"expense"},
  {id:"deudas",l:"Deudas",ic:"debt"},
  {id:"ahorros",l:"Ahorros",ic:"savings"},
  {id:"metas",l:"Metas",ic:"goal"},
  {id:"distribucion",l:"Distribución",ic:"distribute"},
  {id:"estadisticas",l:"Estadísticas",ic:"stats"},
  {id:"habitos",l:"Hábitos",ic:"habits"},
  {id:"configuracion",l:"Configuración",ic:"settings"},
];

const LogoIcon=()=>(
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="8" fill="#5A6650"/>
    <line x1="10" y1="8" x2="10" y2="24" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
    <line x1="10" y1="8" x2="21" y2="8" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
    <line x1="10" y1="16" x2="18" y2="16" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
  </svg>
);

const LogoFlore=({col})=>{
  if(col) return <LogoIcon/>;
  return(
    <div style={{display:"flex",alignItems:"center",gap:9,overflow:"hidden"}}>
      <LogoIcon/>
      <div>
        <div style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:600,color:C.charcoal,lineHeight:1.1,letterSpacing:"-.3px"}}>Flore</div>
        <div style={{fontSize:9,color:C.graysoft,letterSpacing:".1em",textTransform:"uppercase"}}>finanzas</div>
      </div>
    </div>
  );
};

const Sidebar=({active,go,col,setCol})=>(
  <div className="sd" style={{width:col?58:210,background:C.white,borderRight:`1px solid ${C.graylight}`,display:"flex",flexDirection:"column",padding:"20px 10px",transition:"width .26s ease",flexShrink:0,overflow:"hidden"}}>
    <div style={{padding:"0 3px 24px",display:"flex",alignItems:"center",gap:8,overflow:"hidden"}}>
      <LogoFlore col={col}/>
    </div>
    <nav style={{flex:1,display:"flex",flexDirection:"column",gap:1}}>
      {NAV.map(n=>(
        <button key={n.id} className={`ni ${active===n.id?"act":""}`} onClick={()=>go(n.id)}
          title={col?n.l:""} style={{justifyContent:col?"center":"flex-start"}}>
          <Ic n={n.ic} sz={15}/>{!col&&<span style={{whiteSpace:"nowrap"}}>{n.l}</span>}
        </button>
      ))}
    </nav>
    <button onClick={()=>setCol(!col)} className="btn bg"
      style={{marginTop:4,justifyContent:col?"center":"flex-start",padding:"8px 12px",fontSize:11}}>
      <Ic n="chevron" sz={13}/>{!col&&"Colapsar"}
    </button>
  </div>
);

const NAV_MOB=[
  {id:"dashboard",l:"Inicio",ic:"home"},
  {id:"ingresos",l:"Ingresos",ic:"income"},
  {id:"deudas",l:"Deudas",ic:"debt"},
  {id:"gastos",l:"Gastos",ic:"expense"},
  {id:"distribucion",l:"Repartir",ic:"distribute"},
];
const NAV_MAS=[
  {id:"ahorros",l:"Ahorros",ic:"savings"},
  {id:"metas",l:"Metas",ic:"goal"},
  {id:"estadisticas",l:"Estadísticas",ic:"stats"},
  {id:"habitos",l:"Hábitos",ic:"habits"},
  {id:"configuracion",l:"Config",ic:"settings"},
];
const BottomNav=({active,go})=>{
  const [masOpen,setMasOpen]=useState(false);
  const enMas=NAV_MAS.some(n=>n.id===active);
  return(
    <>
      {masOpen&&(
        <div onClick={()=>setMasOpen(false)} style={{position:"fixed",inset:0,zIndex:199,background:"rgba(26,26,24,.4)",backdropFilter:"blur(4px)"}}>
          <div onClick={e=>e.stopPropagation()} style={{position:"absolute",bottom:70,left:12,right:12,background:C.white,borderRadius:20,padding:"16px 8px",boxShadow:"0 -4px 24px rgba(0,0,0,.12)"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:4}}>
              {NAV_MAS.map(n=>(
                <button key={n.id} onClick={()=>{go(n.id);setMasOpen(false);}}
                  style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,padding:"14px 8px",background:active===n.id?`${C.botanico}12`:C.cream,borderRadius:14,border:`1px solid ${active===n.id?C.botanico+"30":C.graylight}`,cursor:"pointer",color:active===n.id?C.botanico:C.charcoal,fontSize:11,fontFamily:FB,fontWeight:active===n.id?600:400}}>
                  <Ic n={n.ic} sz={20} c={active===n.id?C.botanico:C.graysoft}/>
                  <span>{n.l}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:C.white,borderTop:`1px solid ${C.graylight}`,display:"flex",zIndex:200,paddingBottom:"env(safe-area-inset-bottom)"}}>
        {NAV_MOB.map(n=>(
          <button key={n.id} onClick={()=>{go(n.id);setMasOpen(false);}}
            style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,background:"none",border:"none",cursor:"pointer",padding:"8px 0 6px",color:active===n.id?C.botanico:C.graysoft,fontSize:9,fontFamily:FB,fontWeight:active===n.id?600:400,transition:".14s"}}>
            <div style={{width:30,height:30,borderRadius:9,background:active===n.id?`${C.botanico}15`:"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Ic n={n.ic} sz={17} c={active===n.id?C.botanico:C.graysoft}/>
            </div>
            <span style={{textTransform:"uppercase",letterSpacing:".03em"}}>{n.l}</span>
          </button>
        ))}
        <button onClick={()=>setMasOpen(!masOpen)}
          style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,background:"none",border:"none",cursor:"pointer",padding:"8px 0 6px",color:enMas||masOpen?C.botanico:C.graysoft,fontSize:9,fontFamily:FB,fontWeight:enMas||masOpen?600:400,transition:".14s"}}>
          <div style={{width:30,height:30,borderRadius:9,background:enMas||masOpen?`${C.botanico}15`:"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Ic n="distribute" sz={17} c={enMas||masOpen?C.botanico:C.graysoft}/>
          </div>
          <span style={{textTransform:"uppercase",letterSpacing:".03em"}}>Más</span>
        </button>
      </div>
    </>
  );
};

// ─── DASHBOARD ───────────────────────────────────────────────────
const Dashboard=({S,nombre,go})=>{
  const rec=S.ingresos.filter(i=>i.estado==="recibido").reduce((s,i)=>s+i.monto,0);
  const gasto=S.gastos.reduce((s,g)=>s+g.monto,0);
  const cuotas=S.deudas.reduce((s,d)=>s+d.cuota,0);
  const fijos=S.gastos.filter(g=>g.tipo==="fijo").reduce((s,g)=>s+g.monto,0);
  const libre=rec-cuotas-fijos-gasto;
  const tdTotal=S.deudas.reduce((s,d)=>s+d.total,0);
  const tdPag=S.deudas.reduce((s,d)=>s+d.pagado,0);
  const ahTotal=S.ahorros.reduce((s,a)=>s+a.actual,0);
  const semCol=libre>500000?C.sage:libre>0?C.amber:C.rose;
  const semTxt=libre>500000?"Vas bien":libre>0?"Con cuidado":"Atención";
  const vacio=S.ingresos.length===0&&S.gastos.length===0&&S.deudas.length===0;

  return(
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      {/* Hero */}
      <div className="fu" style={{background:`linear-gradient(135deg,${C.botanico} 0%,${C.sage} 65%,${C.sageLight} 100%)`,borderRadius:20,padding:"28px 26px",color:C.cream,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-40,right:-40,width:180,height:180,background:"rgba(255,255,255,.05)",borderRadius:"50%"}}/>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8,opacity:.75}}>
          <Ic n="wallet" sz={13} c={C.cream}/>
          <span style={{fontSize:10,letterSpacing:".12em",textTransform:"uppercase"}}>
            {nombre ? `Hola, ${nombre}` : "Disponible real"}
          </span>
        </div>
        <div style={{fontFamily:FD,fontSize:38,fontWeight:500,letterSpacing:"-.02em",marginBottom:3}}>
          {fmt(Math.max(0,libre))}
        </div>
        <p style={{opacity:.65,fontSize:13}}>Puedes gastar esto sin riesgo</p>
        <div style={{display:"flex",gap:20,marginTop:20,flexWrap:"wrap"}}>
          {[{l:"Ingresos",v:fmt(rec)},{l:"Comprometido",v:fmt(cuotas+fijos),op:.7},{l:"Ahorrado",v:fmt(ahTotal),op:.7}].map(m=>(
            <div key={m.l} style={{opacity:m.op||1}}>
              <div style={{fontSize:9,letterSpacing:".1em",textTransform:"uppercase",opacity:.75,marginBottom:2}}>{m.l}</div>
              <div style={{fontFamily:FD,fontSize:18,fontWeight:500}}>{m.v}</div>
            </div>
          ))}
        </div>
      </div>

      {vacio?(
        <div className="card fu1" style={{textAlign:"center",padding:"40px 24px"}}>
          <div style={{fontFamily:FD,fontSize:20,marginBottom:10,color:C.charcoal}}>Tu app está lista</div>
          <p style={{fontSize:14,color:C.graysoft,lineHeight:1.7,marginBottom:24}}>
            Empieza registrando un ingreso o una deuda.<br/>Todo lo demás se calcula solo.
          </p>
          <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
            <button className="btn bp" onClick={()=>go("ingresos")}><Ic n="income" sz={14} c={C.cream}/>Agregar ingreso</button>
            <button className="btn bg" onClick={()=>go("deudas")}><Ic n="debt" sz={14}/>Agregar deuda</button>
          </div>
        </div>
      ):(
        <>
          <div className="g3 fu1">
            <div className="card" style={{borderTop:`3px solid ${semCol}`}}>
              <p className="lbl">Semáforo</p>
              <div style={{fontFamily:FD,fontSize:20,fontWeight:500,color:semCol,margin:"7px 0 3px"}}>{semTxt}</div>
              <p style={{fontSize:11,color:C.graysoft}}>{libre>0?`${fmt(libre)} libres`:"Revisa gastos"}</p>
            </div>
            <div className="card">
              <p className="lbl">Deuda pendiente</p>
              <div style={{fontFamily:FD,fontSize:20,fontWeight:500,margin:"7px 0 3px"}}>{fmt(tdTotal-tdPag)}</div>
              <p style={{fontSize:11,color:C.graysoft}}>{S.deudas.length} deudas</p>
            </div>
            <div className="card">
              <p className="lbl">Ahorrado</p>
              <div style={{fontFamily:FD,fontSize:20,fontWeight:500,color:C.botanico,margin:"7px 0 10px"}}>{fmt(ahTotal)}</div>
              <div className="pb"><div className="pf" style={{"--w":`${pct(tdPag,tdTotal||1)}%`,width:`${pct(tdPag,tdTotal||1)}%`,background:C.sage}}/></div>
            </div>
          </div>

          {S.deudas.length>0&&(
            <div className="card fu2">
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:14}}>
                <Ic n="bolt" sz={13} c={C.amber}/>
                <p className="lbl" style={{marginBottom:0}}>Próximos vencimientos</p>
              </div>
              {S.deudas.sort((a,b)=>new Date(a.venc)-new Date(b.venc)).slice(0,3).map(d=>(
                <div key={d.id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:11}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:d.color,flexShrink:0}}/>
                  <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500}}>{d.nombre}</div><div style={{fontSize:10,color:C.graysoft}}>{d.venc}</div></div>
                  <div style={{fontFamily:FM,fontSize:13,fontWeight:500}}>{fmt(d.cuota)}/mes</div>
                </div>
              ))}
            </div>
          )}

          <div className="ic fu3">
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
              <Ic n="sparkle" sz={13} c={C.sageLight}/>
              <span style={{fontSize:9,letterSpacing:".1em",textTransform:"uppercase",opacity:.8}}>Insight del mes</span>
            </div>
            <p style={{fontFamily:FD,fontSize:14,lineHeight:1.7}}>
              {rec===0
                ?"Registra tu primer ingreso para ver cómo va el mes."
                :cuotas/rec>0.4
                  ?`Tus cuotas consumen el ${Math.round((cuotas/rec)*100)}% de tus ingresos. Considera adelantar la deuda de mayor interés.`
                  :`Vas bien. Tus cuotas son el ${Math.round((cuotas/rec)*100)}% de tus ingresos. Sigue así.`
              }
            </p>
          </div>
        </>
      )}
    </div>
  );
};

// ─── INGRESOS ────────────────────────────────────────────────────
const Ingresos=({S,setS})=>{
  const [modal,setModal]=useState(false);
  const [nd,setNd]=useState({cliente:"",monto:"",fecha:new Date().toISOString().split("T")[0],estado:"recibido",categoria:"diseño"});
  const rec=S.ingresos.filter(i=>i.estado==="recibido").reduce((s,i)=>s+i.monto,0);
  const esp=S.ingresos.filter(i=>i.estado==="esperado").reduce((s,i)=>s+i.monto,0);
  const CATS=["diseño","desarrollo","consultoría","fotografía","marketing","redes","ventas","otro"];
  const CAT_IC={diseño:"sparkle",desarrollo:"bolt",consultoría:"graph",fotografía:"goal",marketing:"trend",redes:"trend",ventas:"income",otro:"income"};

  const agregar=()=>{
    if(!nd.cliente||!nd.monto)return;
    setS(p=>({...p,ingresos:[...p.ingresos,{id:Date.now(),...nd,monto:+nd.monto}]}));
    setNd({cliente:"",monto:"",fecha:new Date().toISOString().split("T")[0],estado:"recibido",categoria:"diseño"});
    setModal(false);
  };
  const eliminar=id=>setS(p=>({...p,ingresos:p.ingresos.filter(i=>i.id!==id)}));

  return(
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div className="fu" style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
        <div><h1 style={{fontFamily:FD,fontSize:23,fontWeight:500,marginBottom:3}}>Ingresos</h1>
          <p style={{fontSize:12,color:C.graysoft}}>Todo lo que entra, por mínimo que sea</p></div>
        <button className="btn bp" onClick={()=>setModal(true)}><Ic n="plus" sz={14} c={C.cream}/>Nuevo ingreso</button>
      </div>

      <div className="g2 fu1">
        <div className="card" style={{background:`linear-gradient(135deg,${C.sage}18,${C.sageLight}10)`,border:`1px solid ${C.sage}30`}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:7}}><Ic n="check" sz={12} c={C.sage}/><p className="lbl" style={{marginBottom:0}}>Recibido</p></div>
          <div style={{fontFamily:FD,fontSize:28,fontWeight:500,color:C.botanico,marginBottom:3}}>{fmt(rec)}</div>
          <p style={{fontSize:11,color:C.sage}}>{S.ingresos.filter(i=>i.estado==="recibido").length} pagos</p>
        </div>
        <div className="card" style={{background:`linear-gradient(135deg,${C.amber}18,${C.amberLight}10)`,border:`1px solid ${C.amber}30`}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:7}}><Ic n="bolt" sz={12} c={C.amber}/><p className="lbl" style={{marginBottom:0}}>Esperado</p></div>
          <div style={{fontFamily:FD,fontSize:28,fontWeight:500,color:C.amber,marginBottom:3}}>{fmt(esp)}</div>
          <p style={{fontSize:11,color:C.amber}}>{S.ingresos.filter(i=>i.estado==="esperado").length} pendientes</p>
        </div>
      </div>

      <div className="card fu2">
        {S.ingresos.length===0
          ?<Empty icon="income" text="Sin ingresos aún" sub="Registra cualquier pago que recibas, aunque sea pequeño"/>
          :(
            <>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:14}}><Ic n="income" sz={13} c={C.sage}/><p className="lbl" style={{marginBottom:0}}>Historial</p></div>
              {S.ingresos.map(i=>(
                <div key={i.id} style={{display:"flex",alignItems:"center",gap:11,padding:"12px 14px",background:C.cream,borderRadius:11,border:`1px solid ${C.graylight}`,marginBottom:8}}>
                  <div style={{width:32,height:32,borderRadius:9,background:`${C.sage}15`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <Ic n={CAT_IC[i.categoria]||"income"} sz={14} c={C.sage}/>
                  </div>
                  <div style={{flex:1}}><div style={{fontWeight:500,fontSize:13}}>{i.cliente}</div><div style={{fontSize:10,color:C.graysoft}}>{i.fecha} · {i.categoria}</div></div>
                  <div style={{textAlign:"right",marginRight:8}}>
                    <div style={{fontFamily:FM,fontSize:14,fontWeight:600}}>{fmt(i.monto)}</div>
                    <span className="tag" style={{background:i.estado==="recibido"?"#EEF2EB":"#FDF5EC",color:i.estado==="recibido"?C.sage:C.amber}}>{i.estado}</span>
                  </div>
                  <button className="btn bg" onClick={()=>eliminar(i.id)} style={{padding:6,borderRadius:8,flexShrink:0}}><Ic n="x" sz={12} c={C.rose}/></button>
                </div>
              ))}
            </>
          )
        }
      </div>

      {modal&&<Modal title="Nuevo ingreso" onClose={()=>setModal(false)}>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div><div className="lbl">Cliente o proyecto</div><input className="inp" placeholder="ej. Diseño logo para cliente" value={nd.cliente} onChange={e=>setNd(p=>({...p,cliente:e.target.value}))}/></div>
          <div><div className="lbl">Monto (COP)</div><input className="inp" type="number" placeholder="ej. 500000" value={nd.monto} onChange={e=>setNd(p=>({...p,monto:e.target.value}))}/></div>
          <div className="g2">
            <div><div className="lbl">Fecha</div><input className="inp" type="date" value={nd.fecha} onChange={e=>setNd(p=>({...p,fecha:e.target.value}))}/></div>
            <div><div className="lbl">Estado</div><select className="inp" value={nd.estado} onChange={e=>setNd(p=>({...p,estado:e.target.value}))}><option value="recibido">Recibido</option><option value="esperado">Esperado</option></select></div>
          </div>
          <div><div className="lbl">Categoría</div><select className="inp" value={nd.categoria} onChange={e=>setNd(p=>({...p,categoria:e.target.value}))}>{CATS.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
          <button className="btn bp" onClick={agregar} style={{width:"100%",justifyContent:"center"}}><Ic n="check" sz={14} c={C.cream}/>Registrar ingreso</button>
        </div>
      </Modal>}
    </div>
  );
};

// ─── GASTOS ──────────────────────────────────────────────────────
const Gastos=({S,setS})=>{
  const [modal,setModal]=useState(false);
  const [nd,setNd]=useState({descripcion:"",monto:"",categoria:"alimentación",tipo:"variable",fecha:new Date().toISOString().split("T")[0]});
  const total=S.gastos.reduce((s,g)=>s+g.monto,0);
  const CATS=["vivienda","alimentación","transporte","ocio","suscripciones","salud","educación","ropa","otro"];
  const CCOL=[C.sage,C.olive,C.amber,C.rose,C.sageLight,C.botanico,C.amberLight,C.graysoft];
  const CAT_IC={vivienda:"home",alimentación:"sparkle",transporte:"bolt",ocio:"goal",suscripciones:"refresh",salud:"shield",educación:"graph",ropa:"star",otro:"bolt"};
  const byCat=S.gastos.reduce((a,g)=>{a[g.categoria]=(a[g.categoria]||0)+g.monto;return a},{});

  const agregar=()=>{
    if(!nd.descripcion||!nd.monto)return;
    setS(p=>({...p,gastos:[...p.gastos,{id:Date.now(),...nd,monto:+nd.monto}]}));
    setNd({descripcion:"",monto:"",categoria:"alimentación",tipo:"variable",fecha:new Date().toISOString().split("T")[0]});setModal(false);
  };
  const eliminar=id=>setS(p=>({...p,gastos:p.gastos.filter(g=>g.id!==id)}));

  return(
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div className="fu" style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
        <div><h1 style={{fontFamily:FD,fontSize:23,fontWeight:500,marginBottom:3}}>Gastos</h1><p style={{fontSize:12,color:C.graysoft}}>¿A dónde va tu dinero realmente?</p></div>
        <button className="btn bp" onClick={()=>setModal(true)}><Ic n="plus" sz={14} c={C.cream}/>Nuevo gasto</button>
      </div>

      <div className="g2 fu1">
        <div className="card"><p className="lbl">Total gastado</p><div style={{fontFamily:FD,fontSize:24,fontWeight:500,marginTop:7}}>{fmt(total)}</div></div>
        <div className="card"><p className="lbl">Gastos fijos</p><div style={{fontFamily:FD,fontSize:24,fontWeight:500,color:C.sage,marginTop:7}}>{fmt(S.gastos.filter(g=>g.tipo==="fijo").reduce((s,g)=>s+g.monto,0))}</div></div>
      </div>

      {Object.keys(byCat).length>0&&(
        <div className="card fu2">
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:14}}><Ic n="graph" sz={13} c={C.sage}/><p className="lbl" style={{marginBottom:0}}>Por categoría</p></div>
          {Object.entries(byCat).sort((a,b)=>b[1]-a[1]).map(([cat,m],i)=>(
            <div key={cat} style={{marginBottom:13}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,alignItems:"center"}}>
                <div style={{display:"flex",alignItems:"center",gap:7}}>
                  <div style={{width:22,height:22,borderRadius:6,background:`${CCOL[i%CCOL.length]}18`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <Ic n={CAT_IC[cat]||"bolt"} sz={11} c={CCOL[i%CCOL.length]}/>
                  </div>
                  <span style={{fontSize:12}}>{cat}</span>
                </div>
                <span style={{fontFamily:FM,fontSize:12,fontWeight:500}}>{fmt(m)}</span>
              </div>
              <div className="pb"><div className="pf" style={{"--w":`${pct(m,total)}%`,width:`${pct(m,total)}%`,background:CCOL[i%CCOL.length]}}/></div>
            </div>
          ))}
        </div>
      )}

      <div className="card fu3">
        {S.gastos.length===0
          ?<Empty icon="expense" text="Sin gastos registrados" sub="Anota cada salida de dinero para tener claridad total"/>
          :(
            <>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:14}}><Ic n="expense" sz={13} c={C.amber}/><p className="lbl" style={{marginBottom:0}}>Todos los gastos</p></div>
              {S.gastos.map(g=>(
                <div key={g.id} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 13px",background:C.cream,borderRadius:10,border:`1px solid ${C.graylight}`,marginBottom:7}}>
                  <div style={{width:30,height:30,borderRadius:8,background:`${C.sage}14`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <Ic n={CAT_IC[g.categoria]||"bolt"} sz={13} c={C.sage}/>
                  </div>
                  <div style={{flex:1}}><div style={{fontWeight:500,fontSize:12}}>{g.descripcion}</div><div style={{fontSize:10,color:C.graysoft}}>{g.fecha} · {g.categoria}</div></div>
                  <span className="tag" style={{background:g.tipo==="fijo"?"#EEF2EB":C.beige,color:g.tipo==="fijo"?C.sage:C.graysoft}}>{g.tipo}</span>
                  <span style={{fontFamily:FM,fontWeight:600,fontSize:12,marginLeft:4}}>{fmt(g.monto)}</span>
                  <button className="btn bg" onClick={()=>eliminar(g.id)} style={{padding:6,borderRadius:8,flexShrink:0}}><Ic n="x" sz={12} c={C.rose}/></button>
                </div>
              ))}
            </>
          )
        }
      </div>

      {modal&&<Modal title="Nuevo gasto" onClose={()=>setModal(false)}>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div><div className="lbl">Descripción</div><input className="inp" placeholder="ej. Mercado semanal" value={nd.descripcion} onChange={e=>setNd(p=>({...p,descripcion:e.target.value}))}/></div>
          <div><div className="lbl">Monto (COP)</div><input className="inp" type="number" placeholder="ej. 80000" value={nd.monto} onChange={e=>setNd(p=>({...p,monto:e.target.value}))}/></div>
          <div className="g2">
            <div><div className="lbl">Fecha</div><input className="inp" type="date" value={nd.fecha} onChange={e=>setNd(p=>({...p,fecha:e.target.value}))}/></div>
            <div><div className="lbl">Tipo</div><select className="inp" value={nd.tipo} onChange={e=>setNd(p=>({...p,tipo:e.target.value}))}><option value="fijo">Fijo</option><option value="variable">Variable</option></select></div>
          </div>
          <div><div className="lbl">Categoría</div><select className="inp" value={nd.categoria} onChange={e=>setNd(p=>({...p,categoria:e.target.value}))}>{CATS.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
          <button className="btn bp" onClick={agregar} style={{width:"100%",justifyContent:"center"}}><Ic n="check" sz={14} c={C.cream}/>Registrar gasto</button>
        </div>
      </Modal>}
    </div>
  );
};

// ─── DEUDAS ──────────────────────────────────────────────────────
const Deudas=({S,setS})=>{
  const [modal,setModal]=useState(false);
  const [pago,setPago]=useState(null);
  const [sort,setSort]=useState("prioridad");
  const [pm,setPm]=useState("");
  const [nd,setNd]=useState({nombre:"",total:"",pagado:"",cuota:"",interes:"",venc:"",prioridad:"media"});

  const tPend=S.deudas.reduce((s,d)=>s+(d.total-d.pagado),0);
  const tPag=S.deudas.reduce((s,d)=>s+d.pagado,0);
  const tTotal=S.deudas.reduce((s,d)=>s+d.total,0);
  const COLS=[C.sage,C.olive,C.amber,C.rose,C.sageLight,C.botanico,C.amberLight];
  const PRI={alta:0,media:1,baja:2};
  const PRICOL={alta:C.rose,media:C.amber,baja:C.sage};
  const PRIBG={alta:"#FDF0EE",media:"#FDF5EC",baja:"#EEF2EB"};

  const sorted=[...S.deudas].sort((a,b)=>{
    if(sort==="prioridad")return PRI[a.prioridad]-PRI[b.prioridad];
    if(sort==="interes")return b.interes-a.interes;
    if(sort==="pendiente")return(a.total-a.pagado)-(b.total-b.pagado);
    return pct(b.pagado,b.total)-pct(a.pagado,a.total);
  });

  const registrar=()=>{
    const m=parseFloat(pm);if(!m||m<=0)return;
    setS(p=>({...p,deudas:p.deudas.map(d=>d.id===pago.id?{...d,pagado:Math.min(d.total,d.pagado+m)}:d)}));
    setPago(null);setPm("");
  };
  const agregar=()=>{
    if(!nd.nombre||!nd.total)return;
    setS(p=>({...p,deudas:[...p.deudas,{id:Date.now(),nombre:nd.nombre,total:+nd.total,pagado:+nd.pagado||0,cuota:+nd.cuota||0,interes:+nd.interes||0,venc:nd.venc||"2025-12-31",prioridad:nd.prioridad,color:COLS[p.deudas.length%COLS.length]}]}));
    setNd({nombre:"",total:"",pagado:"",cuota:"",interes:"",venc:"",prioridad:"media"});setModal(false);
  };
  const eliminar=id=>setS(p=>({...p,deudas:p.deudas.filter(d=>d.id!==id)}));

  return(
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div className="fu" style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
        <div><h1 style={{fontFamily:FD,fontSize:23,fontWeight:500,marginBottom:3}}>Mis Deudas</h1><p style={{fontSize:12,color:C.graysoft}}>Organiza, prioriza y salda cada compromiso</p></div>
        <button className="btn bp" onClick={()=>setModal(true)}><Ic n="plus" sz={14} c={C.cream}/>Nueva deuda</button>
      </div>

      {S.deudas.length>0&&(
        <div className="fu1" style={{background:`linear-gradient(135deg,${C.charcoal},#3A3A38)`,borderRadius:20,padding:"24px 26px",color:C.cream,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:-25,right:-25,width:130,height:130,background:"rgba(255,255,255,.04)",borderRadius:"50%"}}/>
          <div style={{display:"flex",alignItems:"center",gap:20,flexWrap:"wrap"}}>
            <Ring p={pct(tPag,tTotal||1)} col={C.sage} bg="rgba(255,255,255,.1)">
              <span style={{fontFamily:FM,fontSize:13,fontWeight:600,color:C.cream}}>{pct(tPag,tTotal||1)}%</span>
            </Ring>
            <div>
              <p style={{opacity:.6,fontSize:10,letterSpacing:".1em",textTransform:"uppercase",marginBottom:4}}>Total pendiente</p>
              <div style={{fontFamily:FD,fontSize:30,fontWeight:500,lineHeight:1}}>{fmt(tPend)}</div>
              <p style={{opacity:.55,fontSize:11,marginTop:3}}>de {fmt(tTotal)} total</p>
            </div>
            <div style={{marginLeft:"auto",textAlign:"right"}}>
              <div style={{opacity:.6,fontSize:10,letterSpacing:".08em",textTransform:"uppercase",marginBottom:3}}>Ya pagaste</div>
              <div style={{fontFamily:FD,fontSize:22,fontWeight:500,color:C.sageLight}}>{fmt(tPag)}</div>
            </div>
          </div>
        </div>
      )}

      {S.deudas.length>1&&(
        <div className="fu2" style={{display:"flex",gap:4,padding:4,background:C.beige,borderRadius:11,width:"fit-content"}}>
          {[{v:"prioridad",l:"Prioridad"},{v:"interes",l:"Interés"},{v:"pendiente",l:"Pendiente"},{v:"progreso",l:"Progreso"}].map(s=>(
            <button key={s.v} onClick={()=>setSort(s.v)}
              style={{padding:"6px 13px",borderRadius:8,border:"none",fontFamily:FB,fontSize:11,fontWeight:500,cursor:"pointer",transition:".13s",color:sort===s.v?C.charcoal:C.graysoft,background:sort===s.v?C.white:"transparent",boxShadow:sort===s.v?"0 1px 6px rgba(0,0,0,.08)":"none"}}>
              {s.l}
            </button>
          ))}
        </div>
      )}

      {S.deudas.length===0
        ?<div className="card fu2"><Empty icon="debt" text="Sin deudas registradas" sub="Agrega tus deudas para ver el progreso y prioridad de pago"/></div>
        :(
          <div className="fu3" style={{display:"flex",flexDirection:"column",gap:10}}>
            {sorted.map((d)=>{
              const pend=d.total-d.pagado;
              const pr=pct(d.pagado,d.total);
              const meses=d.cuota>0?Math.ceil(pend/d.cuota):"—";
              return(
                <div key={d.id} style={{background:C.white,borderRadius:16,border:`1px solid ${C.graylight}`,padding:"16px 20px",borderLeft:`3px solid ${d.color}`,transition:".17s"}}
                  onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 6px 18px rgba(0,0,0,.08)";e.currentTarget.style.transform="translateY(-1px)"}}
                  onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="none"}}>
                  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10,flexWrap:"wrap"}}>
                    <div style={{flex:1,minWidth:170}}>
                      <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:10,flexWrap:"wrap"}}>
                        <span style={{fontFamily:FD,fontSize:16,fontWeight:500}}>{d.nombre}</span>
                        <span className="tag" style={{background:PRIBG[d.prioridad],color:PRICOL[d.prioridad]}}>{d.prioridad}</span>
                        {d.interes>0&&<span className="tag" style={{background:"#FDF5EC",color:C.amber}}>{d.interes}% interés</span>}
                      </div>
                      <div className="pb" style={{marginBottom:7}}><div className="pf" style={{"--w":`${pr}%`,width:`${pr}%`,background:`linear-gradient(90deg,${d.color},${d.color}CC)`}}/></div>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:C.graysoft,marginBottom:10}}>
                        <span>{fmt(d.pagado)} pagado</span><span style={{color:C.charcoal,fontWeight:600}}>{pr}%</span>
                      </div>
                      <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
                        <div><span style={{fontSize:11,color:C.graysoft}}>Pendiente </span><span style={{fontFamily:FM,fontSize:12,fontWeight:500}}>{fmt(pend)}</span></div>
                        <div><span style={{fontSize:11,color:C.graysoft}}>Cuota </span><span style={{fontFamily:FM,fontSize:12,fontWeight:500}}>{fmt(d.cuota)}/mes</span></div>
                        <div><span style={{fontSize:11,color:C.graysoft}}>~{meses} meses</span></div>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
                      <button className="btn bp" onClick={()=>setPago(d)} style={{fontSize:11,padding:"7px 13px"}}><Ic n="check" sz={13} c={C.cream}/>Pagar</button>
                      <button className="btn bg" onClick={()=>eliminar(d.id)} style={{padding:7,borderRadius:8}}><Ic n="x" sz={12} c={C.rose}/></button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      }

      {S.deudas.length>0&&(
        <div className="ic fu4">
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:9}}><Ic n="sparkle" sz={13} c={C.sageLight}/><span style={{fontSize:9,letterSpacing:".1em",textTransform:"uppercase",opacity:.75}}>Estrategia recomendada</span></div>
          <p style={{fontFamily:FD,fontSize:15,lineHeight:1.65}}>
            Prioriza <strong style={{color:C.sageLight}}>{sorted[0]?.nombre}</strong>. Cuando llegue un proyecto grande, adelanta un pago extra.
          </p>
        </div>
      )}

      {pago&&(
        <Modal title={`Pago — ${pago.nombre}`} onClose={()=>{setPago(null);setPm("")}}>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{padding:"13px 15px",background:C.cream,borderRadius:11}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}><span style={{fontSize:11,color:C.graysoft}}>Progreso</span><span style={{fontSize:11,fontWeight:600}}>{pct(pago.pagado,pago.total)}%</span></div>
              <div className="pb"><div className="pf" style={{"--w":`${pct(pago.pagado,pago.total)}%`,width:`${pct(pago.pagado,pago.total)}%`,background:pago.color}}/></div>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:6,fontSize:10,color:C.graysoft}}>
                <span>{fmt(pago.pagado)} pagado</span><span>{fmt(pago.total-pago.pagado)} pendiente</span>
              </div>
            </div>
            <div><div className="lbl">Monto a pagar (COP)</div><input className="inp" type="number" placeholder={`Cuota: ${pago.cuota}`} value={pm} onChange={e=>setPm(e.target.value)}/></div>
            <div style={{display:"flex",gap:6}}>
              {[pago.cuota,Math.round(pago.cuota*1.5),pago.cuota*2].map(s=>(
                <button key={s} className="btn bg" style={{flex:1,fontSize:11,justifyContent:"center"}} onClick={()=>setPm(String(s))}>{fmt(s)}</button>
              ))}
            </div>
            <button className="btn bp" onClick={registrar} style={{width:"100%",justifyContent:"center"}}><Ic n="check" sz={14} c={C.cream}/>Confirmar pago</button>
          </div>
        </Modal>
      )}

      {modal&&(
        <Modal title="Nueva deuda" onClose={()=>setModal(false)}>
          <div style={{display:"flex",flexDirection:"column",gap:11}}>
            <div><div className="lbl">Nombre</div><input className="inp" placeholder="ej. Tarjeta Visa" value={nd.nombre} onChange={e=>setNd(p=>({...p,nombre:e.target.value}))}/></div>
            <div className="g2">
              <div><div className="lbl">Total (COP)</div><input className="inp" type="number" placeholder="0" value={nd.total} onChange={e=>setNd(p=>({...p,total:e.target.value}))}/></div>
              <div><div className="lbl">Ya pagado</div><input className="inp" type="number" placeholder="0" value={nd.pagado} onChange={e=>setNd(p=>({...p,pagado:e.target.value}))}/></div>
            </div>
            <div className="g2">
              <div><div className="lbl">Cuota/mes</div><input className="inp" type="number" placeholder="0" value={nd.cuota} onChange={e=>setNd(p=>({...p,cuota:e.target.value}))}/></div>
              <div><div className="lbl">Interés anual %</div><input className="inp" type="number" placeholder="0" value={nd.interes} onChange={e=>setNd(p=>({...p,interes:e.target.value}))}/></div>
            </div>
            <div className="g2">
              <div><div className="lbl">Vencimiento</div><input className="inp" type="date" value={nd.venc} onChange={e=>setNd(p=>({...p,venc:e.target.value}))}/></div>
              <div><div className="lbl">Prioridad</div><select className="inp" value={nd.prioridad} onChange={e=>setNd(p=>({...p,prioridad:e.target.value}))}><option value="alta">Alta</option><option value="media">Media</option><option value="baja">Baja</option></select></div>
            </div>
            <button className="btn bp" onClick={agregar} style={{width:"100%",justifyContent:"center",marginTop:4}}><Ic n="plus" sz={14} c={C.cream}/>Agregar deuda</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── AHORROS ─────────────────────────────────────────────────────
const Ahorros=({S,setS})=>{
  const [dep,setDep]=useState(null);const [m,setM]=useState("");
  const [editModal,setEditModal]=useState(null);
  const total=S.ahorros.reduce((s,a)=>s+a.actual,0);
  const metaT=S.ahorros.reduce((s,a)=>s+a.meta,0);
  const ICONS_A={1:"shield",2:"moon",3:"sparkle"};

  const depositar=()=>{
    const v=parseFloat(m);if(!v||v<=0)return;
    setS(p=>({...p,ahorros:p.ahorros.map(a=>a.id===dep.id?{...a,actual:Math.min(a.meta||999999999,a.actual+v)}:a)}));
    setDep(null);setM("");
  };

  return(
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div className="fu"><h1 style={{fontFamily:FD,fontSize:23,fontWeight:500,marginBottom:3}}>Ahorros</h1><p style={{fontSize:12,color:C.graysoft}}>Cada peso guardado es libertad futura</p></div>
      <div className="card fu1" style={{background:`linear-gradient(135deg,${C.sage}20,${C.botanico}12)`,border:`1px solid ${C.sage}30`}}>
        <div style={{display:"flex",alignItems:"center",gap:18}}>
          <Ring p={metaT>0?pct(total,metaT):0} col={C.sage}>
            <span style={{fontFamily:FM,fontSize:12,fontWeight:600,color:C.botanico}}>{metaT>0?pct(total,metaT):0}%</span>
          </Ring>
          <div>
            <p className="lbl">Total ahorrado</p>
            <div style={{fontFamily:FD,fontSize:28,fontWeight:500,color:C.botanico,margin:"5px 0 3px"}}>{fmt(total)}</div>
            {metaT>0&&<p style={{fontSize:11,color:C.sage}}>de {fmt(metaT)} en metas</p>}
          </div>
        </div>
      </div>
      <div className="g2 fu2">
        {S.ahorros.map((a,i)=>{
          const p=a.meta>0?pct(a.actual,a.meta):0;
          return(
            <div key={a.id} className="card" style={{borderTop:`3px solid ${a.color}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                <div>
                  <div style={{width:32,height:32,borderRadius:9,background:`${a.color}18`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:8}} className="flt">
                    <Ic n={ICONS_A[a.id]||"savings"} sz={15} c={a.color}/>
                  </div>
                  <div style={{fontFamily:FD,fontSize:14,fontWeight:500}}>{a.nombre}</div>
                </div>
                <span style={{fontFamily:FM,fontSize:11,color:C.graysoft}}>{p}%</span>
              </div>
              {a.meta>0&&<><div className="pb" style={{marginBottom:8}}><div className="pf" style={{"--w":`${p}%`,width:`${p}%`,background:a.color}}/></div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.graysoft,marginBottom:12}}>
                <span style={{fontFamily:FM}}>{fmt(a.actual)}</span><span>meta: {fmt(a.meta)}</span>
              </div></>}
              {a.meta===0&&<div style={{fontFamily:FD,fontSize:20,fontWeight:500,color:C.botanico,marginBottom:12}}>{fmt(a.actual)}</div>}
              <button className="btn bg" style={{width:"100%",justifyContent:"center",fontSize:11}} onClick={()=>setDep(a)}>
                <Ic n="plus" sz={12}/>Depositar
              </button>
            </div>
          );
        })}
      </div>
      {dep&&<Modal title={`Depositar — ${dep.nombre}`} onClose={()=>setDep(null)}>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{padding:"12px 14px",background:C.cream,borderRadius:10}}>
            <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:11,color:C.graysoft}}>Actual</span><span style={{fontFamily:FM}}>{fmt(dep.actual)}</span></div>
            {dep.meta>0&&<div style={{display:"flex",justifyContent:"space-between",marginTop:4}}><span style={{fontSize:11,color:C.graysoft}}>Falta</span><span style={{fontFamily:FM,color:dep.color}}>{fmt(dep.meta-dep.actual)}</span></div>}
          </div>
          <div><div className="lbl">Monto a depositar (COP)</div><input className="inp" type="number" placeholder="ej. 100000" value={m} onChange={e=>setM(e.target.value)}/></div>
          <button className="btn bp" onClick={depositar} style={{width:"100%",justifyContent:"center"}}><Ic n="check" sz={14} c={C.cream}/>Depositar</button>
        </div>
      </Modal>}
    </div>
  );
};

// ─── DISTRIBUCIÓN ────────────────────────────────────────────────
const Distribucion=({S})=>{
  const [monto,setMonto]=useState("");const [dist,setDist]=useState(null);
  const calcular=()=>{
    const m=parseFloat(monto);if(!m)return;
    const cuotas=Math.min(S.deudas.reduce((s,d)=>s+d.cuota,0),m*.3);
    const fijos=Math.min(S.gastos.filter(g=>g.tipo==="fijo").reduce((s,g)=>s+g.monto,0),m*.35);
    const ahorro=Math.round(m*.15);
    const colchon=Math.round(m*.10);
    const libre=Math.max(0,m-cuotas-fijos-ahorro-colchon);
    setDist([
      {l:"Gastos fijos",m:Math.round(fijos),p:pct(fijos,m),col:C.sage,ic:"lock",d:"Arriendo, servicios, suscripciones"},
      {l:"Deudas del mes",m:Math.round(cuotas),p:pct(cuotas,m),col:C.rose,ic:"shield",d:"Cuotas comprometidas"},
      {l:"Ahorro automático",m:ahorro,p:pct(ahorro,m),col:C.botanico,ic:"savings",d:"15% para metas y emergencias"},
      {l:"Colchón próximo mes",m:colchon,p:pct(colchon,m),col:C.olive,ic:"moon",d:"Por si no llega un cliente"},
      {l:"Dinero libre",m:Math.round(libre),p:pct(libre,m),col:C.amber,ic:"sparkle",d:"Esto sí es completamente tuyo"},
    ]);
  };
  return(
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div className="fu"><h1 style={{fontFamily:FD,fontSize:23,fontWeight:500,marginBottom:3}}>Distribución inteligente</h1><p style={{fontSize:12,color:C.graysoft}}>¿Llegó un pago? Aquí sabes exactamente qué hacer.</p></div>
      <div className="card fu1">
        <p style={{fontFamily:FD,fontSize:15,fontWeight:500,marginBottom:5}}>Ingresaste un pago de cliente</p>
        <p style={{fontSize:12,color:C.graysoft,marginBottom:14}}>Escribe el monto en pesos y la app lo divide automáticamente.</p>
        <div style={{display:"flex",gap:8}}>
          <input className="inp" type="number" placeholder="ej. 2000000" value={monto} onChange={e=>setMonto(e.target.value)} style={{fontSize:15,padding:"12px 14px"}}/>
          <button className="btn bp" onClick={calcular} style={{padding:"12px 18px",whiteSpace:"nowrap"}}><Ic n="arrow" sz={14} c={C.cream}/>Distribuir</button>
        </div>
      </div>
      {dist&&(
        <div className="fu" style={{display:"flex",flexDirection:"column",gap:10}}>
          <div className="ic"><p style={{fontSize:9,letterSpacing:".1em",textTransform:"uppercase",opacity:.7,marginBottom:6}}>Plan para</p><div style={{fontFamily:FD,fontSize:26,fontWeight:500}}>{fmt(parseFloat(monto))}</div></div>
          {dist.map((d,i)=>(
            <div key={i} className="card" style={{borderLeft:`3px solid ${d.col}`}}>
              <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:9}}>
                <div style={{width:34,height:34,borderRadius:9,background:`${d.col}18`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ic n={d.ic} sz={15} c={d.col}/></div>
                <div style={{flex:1}}><div style={{fontFamily:FD,fontSize:15,fontWeight:500}}>{d.l}</div><div style={{fontSize:11,color:C.graysoft}}>{d.d}</div></div>
                <div style={{textAlign:"right"}}><div style={{fontFamily:FM,fontSize:17,fontWeight:600,color:d.col}}>{fmt(d.m)}</div><div style={{fontSize:10,color:C.graysoft}}>{d.p}%</div></div>
              </div>
              <div className="pb"><div className="pf" style={{"--w":`${d.p}%`,width:`${d.p}%`,background:d.col}}/></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── METAS ───────────────────────────────────────────────────────
const Metas=({S,setS})=>{
  const [modal,setModal]=useState(false);
  const [nd,setNd]=useState({nombre:"",monto:"",actual:"0",deadline:""});
  const GCOLS=[C.sage,C.olive,C.amber,C.rose,C.sageLight];
  const agregar=()=>{
    if(!nd.nombre||!nd.monto)return;
    setS(p=>({...p,metas:[...p.metas,{id:Date.now(),...nd,monto:+nd.monto,actual:+nd.actual||0}]}));
    setNd({nombre:"",monto:"",actual:"0",deadline:""});setModal(false);
  };
  const eliminar=id=>setS(p=>({...p,metas:p.metas.filter(m=>m.id!==id)}));
  return(
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div className="fu" style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
        <div><h1 style={{fontFamily:FD,fontSize:23,fontWeight:500,marginBottom:3}}>Metas</h1><p style={{fontSize:12,color:C.graysoft}}>Tus sueños, convertidos en números concretos</p></div>
        <button className="btn bp" onClick={()=>setModal(true)}><Ic n="plus" sz={14} c={C.cream}/>Nueva meta</button>
      </div>
      {S.metas.length===0
        ?<div className="card fu1"><Empty icon="goal" text="Sin metas aún" sub="Crea tu primera meta: un viaje, equipo, fondo de emergencia..."/></div>
        :(
          <div className="g2 fu1">
            {S.metas.map((meta,i)=>{
              const p=pct(meta.actual,meta.monto);
              const col=GCOLS[i%GCOLS.length];
              return(
                <div key={meta.id} className="card" style={{position:"relative",overflow:"hidden",borderTop:`3px solid ${col}`}}>
                  <div style={{position:"absolute",top:-10,right:-10,width:60,height:60,borderRadius:"50%",background:`${col}0A`}}/>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                    <div style={{width:34,height:34,borderRadius:9,background:`${col}18`,display:"flex",alignItems:"center",justifyContent:"center"}} className="flt"><Ic n="goal" sz={15} c={col}/></div>
                    <button className="btn bg" onClick={()=>eliminar(meta.id)} style={{padding:5,borderRadius:7}}><Ic n="x" sz={11} c={C.rose}/></button>
                  </div>
                  <div style={{fontFamily:FD,fontSize:15,fontWeight:500,marginBottom:3}}>{meta.nombre}</div>
                  <div style={{fontFamily:FM,fontSize:20,fontWeight:600,color:C.botanico,marginBottom:12}}>{fmt(meta.actual)}</div>
                  <div className="pb" style={{marginBottom:7}}><div className="pf" style={{"--w":`${p}%`,width:`${p}%`,background:`linear-gradient(90deg,${col},${col}AA)`}}/></div>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:C.graysoft,marginBottom:8}}><span>{p}%</span><span>Meta: {fmt(meta.monto)}</span></div>
                  {meta.monto>meta.actual&&<div style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:col}}><Ic n="bolt" sz={11} c={col}/><span>~{Math.ceil((meta.monto-meta.actual)/300000)} meses a $300k/mes</span></div>}
                </div>
              );
            })}
          </div>
        )
      }
      {modal&&<Modal title="Nueva meta" onClose={()=>setModal(false)}>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div><div className="lbl">Nombre de la meta</div><input className="inp" placeholder="ej. Viaje a Europa" value={nd.nombre} onChange={e=>setNd(p=>({...p,nombre:e.target.value}))}/></div>
          <div className="g2">
            <div><div className="lbl">Objetivo (COP)</div><input className="inp" type="number" placeholder="ej. 5000000" value={nd.monto} onChange={e=>setNd(p=>({...p,monto:e.target.value}))}/></div>
            <div><div className="lbl">Ya tengo</div><input className="inp" type="number" placeholder="0" value={nd.actual} onChange={e=>setNd(p=>({...p,actual:e.target.value}))}/></div>
          </div>
          <div><div className="lbl">Fecha límite</div><input className="inp" type="date" value={nd.deadline} onChange={e=>setNd(p=>({...p,deadline:e.target.value}))}/></div>
          <button className="btn bp" onClick={agregar} style={{width:"100%",justifyContent:"center"}}><Ic n="check" sz={14} c={C.cream}/>Crear meta</button>
        </div>
      </Modal>}
    </div>
  );
};

// ─── ESTADÍSTICAS ────────────────────────────────────────────────
const Stats=({S})=>{
  const rec=S.ingresos.filter(i=>i.estado==="recibido").reduce((s,i)=>s+i.monto,0);
  const gasto=S.gastos.reduce((s,g)=>s+g.monto,0);
  const cuotas=S.deudas.reduce((s,d)=>s+d.cuota,0);
  const flujo=rec-gasto-cuotas;
  const rdeu=rec>0?Math.round((cuotas/rec)*100):0;
  const barras=[
    {l:"Ingresos",v:rec,col:C.sage,ic:"income"},
    {l:"Gastos",v:gasto,col:C.amber,ic:"expense"},
    {l:"Cuotas deuda",v:cuotas,col:C.rose,ic:"debt"},
    {l:"Flujo libre",v:Math.max(0,flujo),col:C.botanico,ic:"sparkle"},
  ];
  if(rec===0)return(
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div className="fu"><h1 style={{fontFamily:FD,fontSize:23,fontWeight:500,marginBottom:3}}>Estadísticas</h1></div>
      <div className="card fu1"><Empty icon="stats" text="Sin datos aún" sub="Registra ingresos y gastos para ver tu panorama financiero"/></div>
    </div>
  );
  return(
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div className="fu"><h1 style={{fontFamily:FD,fontSize:23,fontWeight:500,marginBottom:3}}>Estadísticas</h1><p style={{fontSize:12,color:C.graysoft}}>Tu panorama financiero completo</p></div>
      <div className="g2 fu1">
        <div className="card" style={{borderTop:`3px solid ${flujo>0?C.sage:C.rose}`}}>
          <p className="lbl">Flujo neto</p>
          <div style={{fontFamily:FD,fontSize:26,fontWeight:500,color:flujo>0?C.sage:C.rose,margin:"7px 0 3px"}}>{flujo>0?"+":""}{fmt(flujo)}</div>
          <p style={{fontSize:11,color:C.graysoft}}>ingresos menos egresos</p>
        </div>
        <div className="card">
          <p className="lbl">Ratio de deuda</p>
          <div style={{fontFamily:FD,fontSize:26,fontWeight:500,color:rdeu>40?C.rose:C.sage,margin:"7px 0 3px"}}>{rdeu}%</div>
          <p style={{fontSize:11,color:C.graysoft}}>de ingresos a cuotas</p>
        </div>
      </div>
      <div className="card fu2">
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:16}}><Ic n="stats" sz={13} c={C.sage}/><p className="lbl" style={{marginBottom:0}}>Distribución del dinero</p></div>
        {barras.map(b=>(
          <div key={b.l} style={{marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:7,alignItems:"center"}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:20,height:20,borderRadius:5,background:`${b.col}18`,display:"flex",alignItems:"center",justifyContent:"center"}}><Ic n={b.ic} sz={11} c={b.col}/></div>
                <span style={{fontSize:12,fontWeight:500}}>{b.l}</span>
              </div>
              <span style={{fontFamily:FM,fontSize:12}}>{fmt(b.v)}</span>
            </div>
            <div className="pb" style={{height:8}}><div className="pf" style={{"--w":`${pct(b.v,rec||1)}%`,width:`${pct(b.v,rec||1)}%`,background:b.col}}/></div>
          </div>
        ))}
      </div>
      <div className="card fu3" style={{background:`linear-gradient(135deg,${C.beige},${C.beigeWarm})`,border:`1px solid ${C.sand}`}}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:11}}><Ic n={flujo>0?"sparkle":"bolt"} sz={13} c={flujo>0?C.botanico:C.rose}/><p className="lbl" style={{marginBottom:0}}>Proyección</p></div>
        {flujo>0
          ?<><p style={{fontFamily:FD,fontSize:15,color:C.botanico,marginBottom:6}}>Terminarás el mes con +{fmt(flujo)}</p><p style={{fontSize:12,color:C.graysoft,lineHeight:1.65}}>A este ritmo podrías acumular {fmt(flujo*12)} en 12 meses.</p></>
          :<><p style={{fontFamily:FD,fontSize:15,color:C.rose,marginBottom:6}}>Déficit proyectado de {fmt(Math.abs(flujo))}</p><p style={{fontSize:12,color:C.graysoft,lineHeight:1.65}}>Necesitas más ingresos o reducir gastos variables este mes.</p></>
        }
      </div>
    </div>
  );
};

// ─── HÁBITOS ─────────────────────────────────────────────────────
const Habitos=()=>{
  const refs=["El dinero es una herramienta. Tú decides qué construyes con él.","Ahorrar no es restricción. Es elegir tu futuro con intención.","Cada deuda pagada es una cadena menos.","La riqueza se construye consistentemente, no de golpe.","Claridad financiera es un acto de cuidado propio."];
  const ref=refs[new Date().getDay()%refs.length];
  return(
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div className="fu"><h1 style={{fontFamily:FD,fontSize:23,fontWeight:500,marginBottom:3}}>Hábitos & Mentalidad</h1><p style={{fontSize:12,color:C.graysoft}}>Tu relación con el dinero se transforma despacio.</p></div>
      <div className="fu1" style={{background:`linear-gradient(135deg,${C.beigeWarm},${C.sandLight})`,border:`1px solid ${C.sand}`,borderRadius:18,padding:"24px 26px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:16,left:16,opacity:.1}}><Ic n="star" sz={40} c={C.botanico}/></div>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10,opacity:.6}}><Ic n="sparkle" sz={12} c={C.botanico}/><span style={{fontSize:9,letterSpacing:".1em",textTransform:"uppercase",color:C.botanico}}>Reflexión de hoy</span></div>
        <p style={{fontFamily:FD,fontSize:17,lineHeight:1.75,color:C.charcoal,fontStyle:"italic",paddingLeft:8}}>{ref}</p>
      </div>
      <div className="card fu2">
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:13}}><Ic n="trophy" sz={13} c={C.amber}/><p className="lbl" style={{marginBottom:0}}>Principios clave</p></div>
        {[
          {ic:"income",c:C.sage,t:"Registra todo lo que entra, por mínimo que sea"},
          {ic:"distribute",c:C.botanico,t:"Distribuye cada pago antes de gastarlo"},
          {ic:"debt",c:C.rose,t:"Paga primero la deuda de mayor interés"},
          {ic:"savings",c:C.olive,t:"Guarda siempre un colchón para meses sin clientes"},
        ].map((l,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:11,padding:"13px 15px",background:C.cream,borderRadius:11,border:`1px solid ${C.graylight}`,marginBottom:8}}>
            <div style={{width:30,height:30,borderRadius:8,background:`${l.c}18`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ic n={l.ic} sz={13} c={l.c}/></div>
            <span style={{fontSize:13,lineHeight:1.5}}>{l.t}</span>
          </div>
        ))}
      </div>
      <div className="card fu3" style={{border:`1px solid ${C.sand}`}}>
        <div style={{display:"flex",gap:13,alignItems:"flex-start"}}>
          <div style={{width:38,height:38,borderRadius:10,background:`${C.sage}20`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ic n="leaf" sz={17} c={C.sage}/></div>
          <div><p style={{fontWeight:600,fontSize:13,marginBottom:5}}>Tip especial para ti</p>
            <p style={{fontSize:12,color:C.graysoft,lineHeight:1.7}}>Con ingresos variables, guarda el 20% de cada pago antes de gastar. Tu yo del próximo mes te lo agradecerá cuando no llegue un cliente.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── CONFIGURACIÓN ───────────────────────────────────────────────
const Configuracion=({nombre,setNombre,resetApp})=>{
  const [confirm,setConfirm]=useState(false);
  const [n,setN]=useState(nombre);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div className="fu"><h1 style={{fontFamily:FD,fontSize:23,fontWeight:500,marginBottom:3}}>Configuración</h1><p style={{fontSize:12,color:C.graysoft}}>Tu espacio, tus reglas</p></div>
      <div className="card fu1">
        <p className="lbl" style={{marginBottom:14}}>Perfil</p>
        <div style={{marginBottom:12}}><div className="lbl">Tu nombre</div>
          <div style={{display:"flex",gap:8}}>
            <input className="inp" value={n} onChange={e=>setN(e.target.value)} placeholder="Tu nombre"/>
            <button className="btn bp" onClick={()=>setNombre(n)} style={{whiteSpace:"nowrap"}}><Ic n="check" sz={14} c={C.cream}/>Guardar</button>
          </div>
        </div>
        <div style={{padding:"12px 14px",background:C.beige,borderRadius:11,fontSize:12,color:C.graysoft,lineHeight:1.6}}>
          <strong style={{color:C.charcoal}}>Moneda:</strong> Peso colombiano (COP)<br/>
          <strong style={{color:C.charcoal}}>Datos:</strong> Guardados localmente en tu dispositivo
        </div>
      </div>
      <div className="card fu2" style={{border:`1px solid ${C.rose}33`}}>
        <p className="lbl" style={{marginBottom:10,color:C.rose}}>Zona de peligro</p>
        <p style={{fontSize:13,color:C.graysoft,lineHeight:1.6,marginBottom:14}}>Esto borrará todos tus datos: ingresos, gastos, deudas, ahorros y metas. No se puede deshacer.</p>
        {!confirm
          ?<button className="btn br" onClick={()=>setConfirm(true)}><Ic n="trash" sz={14} c={C.rose}/>Limpiar todos los datos</button>
          :(
            <div>
              <p style={{fontSize:13,fontWeight:600,color:C.rose,marginBottom:10}}>¿Estás segura? Esto no se puede deshacer.</p>
              <div style={{display:"flex",gap:8}}>
                <button className="btn br" onClick={()=>{resetApp();setConfirm(false);}}><Ic n="trash" sz={13} c={C.rose}/>Sí, borrar todo</button>
                <button className="btn bg" onClick={()=>setConfirm(false)}>Cancelar</button>
              </div>
            </div>
          )
        }
      </div>
      <div className="ic fu3">
        <p style={{fontSize:13,opacity:.85,lineHeight:1.7}}><strong>Flore Finanzas</strong> — Versión 2.0<br/>Diseñada para creativos con ingresos variables.<br/>Tu claridad financiera comienza hoy.</p>
      </div>
    </div>
  );
};

// ─── APP ROOT ─────────────────────────────────────────────────────
export default function FinanzasApp(){
  const [section,setSection]=useState("dashboard");
  const [col,setCol]=useState(false);
  const [S,setS]=useState(EMPTY);
  const [nombre,setNombreState]=useState("");
  const [onboarded,setOnboarded]=useState(false);
  const [loaded,setLoaded]=useState(false);

  // Cargar datos guardados
  useEffect(()=>{
    try{
      const saved=localStorage.getItem("flore_v4");
      if(saved){
        const data=JSON.parse(saved);
        setS(data.state||EMPTY);
        setNombreState(data.nombre||"");
        setOnboarded(data.onboarded||false);
      }
    }catch{}
    setLoaded(true);
  },[]);

  // Guardar cambios
  useEffect(()=>{
    if(!loaded)return;
    try{localStorage.setItem("flore_v4",JSON.stringify({state:S,nombre,onboarded}));}catch{}
  },[S,nombre,onboarded,loaded]);

  // Inject styles
  useEffect(()=>{
    const el=document.createElement("style");
    el.id="flore-styles";
    el.textContent=STYLE;
    document.head.appendChild(el);
    return()=>{try{document.head.removeChild(el);}catch{}};
  },[]);

  const setNombre=(n)=>{setNombreState(n);};
  const resetApp=()=>{setS(EMPTY);setNombreState("");setOnboarded(false);setSection("dashboard");};
  const finishOnboarding=(n)=>{setNombreState(n);setOnboarded(true);};

  if(!loaded)return null;
  if(!onboarded)return <Onboarding onDone={finishOnboarding}/>;

  const SCREENS={
    dashboard:<Dashboard S={S} nombre={nombre} go={setSection}/>,
    ingresos:<Ingresos S={S} setS={setS}/>,
    gastos:<Gastos S={S} setS={setS}/>,
    deudas:<Deudas S={S} setS={setS}/>,
    ahorros:<Ahorros S={S} setS={setS}/>,
    metas:<Metas S={S} setS={setS}/>,
    distribucion:<Distribucion S={S}/>,
    estadisticas:<Stats S={S}/>,
    habitos:<Habitos/>,
    configuracion:<Configuracion nombre={nombre} setNombre={setNombre} resetApp={resetApp}/>,
  };

  return(
    <div className="fr">
      <Sidebar active={section} go={s=>{setSection(s);}} col={col} setCol={setCol}/>
      <main style={{flex:1,overflow:"auto",padding:"26px 26px 90px",background:C.cream}} className="mp">
        <div style={{maxWidth:800,margin:"0 auto"}}>
          {SCREENS[section]||SCREENS.dashboard}
        </div>
      </main>
      <BottomNav active={section} go={setSection}/>
    </div>
  );
}