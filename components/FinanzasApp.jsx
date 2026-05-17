"use client";

import { useState, useEffect, useCallback } from "react";

// ─── DESIGN TOKENS ───────────────────────────────────────────────
const COLORS = {
  sage: "#7C8C6E",
  sageLight: "#A3B38C",
  sageDark: "#5A6650",
  olive: "#6B7355",
  botanico: "#4A5240",
  beige: "#F5F0E8",
  beigeWarm: "#EDE6D6",
  sand: "#D4C5A9",
  sandLight: "#E8DECA",
  cream: "#FAF8F4",
  white: "#FFFFFF",
  graysoft: "#8A8A8A",
  graylight: "#E8E4DC",
  graymid: "#C4BFB4",
  charcoal: "#2C2C2A",
  ink: "#1A1A18",
  amber: "#C4893A",
  amberLight: "#E8B870",
  rose: "#C47A6B",
  roseLight: "#E8A898",
};

const FONTS = {
  display: "'Playfair Display', Georgia, serif",
  body: "'DM Sans', system-ui, sans-serif",
  mono: "'DM Mono', monospace",
};

// ─── INITIAL DATA ─────────────────────────────────────────────────
const INITIAL_STATE = {
  ingresos: [
    { id: 1, cliente: "Proyecto Branding Co.", monto: 1800, fecha: "2024-01-15", estado: "recibido", categoria: "diseño" },
    { id: 2, cliente: "Consultoría Digital", monto: 600, fecha: "2024-01-22", estado: "recibido", categoria: "consultoría" },
    { id: 3, cliente: "App Móvil XYZ", monto: 2400, fecha: "2024-02-05", estado: "esperado", categoria: "desarrollo" },
  ],
  gastos: [
    { id: 1, descripcion: "Arriendo", monto: 650, categoria: "vivienda", tipo: "fijo", fecha: "2024-01-01" },
    { id: 2, descripcion: "Spotify + Netflix", monto: 28, categoria: "suscripciones", tipo: "fijo", fecha: "2024-01-05" },
    { id: 3, descripcion: "Mercado", monto: 180, categoria: "alimentación", tipo: "variable", fecha: "2024-01-08" },
    { id: 4, descripcion: "Salida restaurant", monto: 65, categoria: "ocio", tipo: "variable", fecha: "2024-01-14" },
    { id: 5, descripcion: "Gasolina", monto: 90, categoria: "transporte", tipo: "variable", fecha: "2024-01-16" },
  ],
  deudas: [
    { id: 1, nombre: "Tarjeta Visa", total: 3200, pagado: 800, cuotaMensual: 200, interes: 24, vencimiento: "2024-03-15", prioridad: "alta", color: COLORS.rose },
    { id: 2, nombre: "Préstamo banco", total: 8000, pagado: 3200, cuotaMensual: 350, interes: 18, vencimiento: "2025-06-01", prioridad: "media", color: COLORS.amber },
    { id: 3, nombre: "Tarjeta Mastercard", total: 1500, pagado: 900, cuotaMensual: 150, interes: 28, vencimiento: "2024-02-20", prioridad: "alta", color: COLORS.rose },
    { id: 4, nombre: "Deuda familiar", total: 2000, pagado: 500, cuotaMensual: 100, interes: 0, vencimiento: "2024-12-01", prioridad: "baja", color: COLORS.sage },
    { id: 5, nombre: "Laptop financiada", total: 1200, pagado: 600, cuotaMensual: 100, interes: 12, vencimiento: "2024-08-01", prioridad: "media", color: COLORS.olive },
    { id: 6, nombre: "Carro cuota", total: 12000, pagado: 4000, cuotaMensual: 480, interes: 15, vencimiento: "2026-01-01", prioridad: "alta", color: COLORS.amber },
    { id: 7, nombre: "Estudio online", total: 800, pagado: 200, cuotaMensual: 80, interes: 0, vencimiento: "2024-10-01", prioridad: "baja", color: COLORS.sageLight },
  ],
  ahorros: [
    { id: 1, nombre: "Fondo emergencia", actual: 1200, meta: 5000, color: COLORS.sage, emoji: "🛡️" },
    { id: 2, nombre: "Colchón sin clientes", actual: 800, meta: 2400, color: COLORS.olive, emoji: "🌙" },
    { id: 3, nombre: "Equipo nuevo", actual: 350, meta: 1500, color: COLORS.sageLight, emoji: "💻" },
    { id: 4, nombre: "Viaje", actual: 200, meta: 3000, color: COLORS.amber, emoji: "✈️" },
  ],
  metas: [
    { id: 1, nombre: "Viaje Europa", monto: 3000, actual: 200, emoji: "✈️", deadline: "2024-12-01" },
    { id: 2, nombre: "Equipos creativos", monto: 1500, actual: 350, emoji: "🎨", deadline: "2024-08-01" },
    { id: 3, nombre: "Fondo emergencia 3 meses", monto: 5000, actual: 1200, emoji: "🛡️", deadline: "2025-01-01" },
  ],
  habitos: {
    streak: 14,
    sinGastosImpulsivos: 8,
    metasActivas: 3,
    mejorMes: "Noviembre",
    logros: [
      { texto: "Llevas 8 días sin gastos impulsivos", tipo: "positivo" },
      { texto: "Pagaste 3 deudas este trimestre", tipo: "logro" },
      { texto: "Tu fondo de emergencia creció un 12% este mes", tipo: "crecimiento" },
    ]
  }
};

// ─── UTILS ────────────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n * 1000).replace("COP", "$");
const fmtSimple = (n) => `$${n.toLocaleString("es-CO")}`;
const pct = (a, b) => Math.min(100, Math.round((a / b) * 100));

// ─── STYLE HELPERS ────────────────────────────────────────────────
const injectGlobalStyles = () => {
  if (document.getElementById("finanzas-styles")) return;
  const style = document.createElement("style");
  style.id = "finanzas-styles";
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
    
    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    .finanzas-root {
      font-family: ${FONTS.body};
      background: ${COLORS.cream};
      color: ${COLORS.charcoal};
      min-height: 100vh;
      -webkit-font-smoothing: antialiased;
    }

    /* Scrollbar */
    .finanzas-root ::-webkit-scrollbar { width: 4px; }
    .finanzas-root ::-webkit-scrollbar-track { background: transparent; }
    .finanzas-root ::-webkit-scrollbar-thumb { background: ${COLORS.sand}; border-radius: 4px; }

    /* Animations */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulse-soft {
      0%,100% { opacity: 1; } 50% { opacity: 0.6; }
    }
    @keyframes fillBar {
      from { width: 0; } to { width: var(--target); }
    }
    @keyframes countUp {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes float {
      0%,100% { transform: translateY(0px); }
      50%      { transform: translateY(-4px); }
    }
    @keyframes ringFill {
      from { stroke-dashoffset: 220; }
      to   { stroke-dashoffset: var(--ring-target); }
    }

    .fade-up { animation: fadeUp 0.5s ease both; }
    .fade-up-1 { animation: fadeUp 0.5s 0.05s ease both; }
    .fade-up-2 { animation: fadeUp 0.5s 0.1s ease both; }
    .fade-up-3 { animation: fadeUp 0.5s 0.15s ease both; }
    .fade-up-4 { animation: fadeUp 0.5s 0.2s ease both; }
    .float { animation: float 3s ease-in-out infinite; }

    .card {
      background: ${COLORS.white};
      border-radius: 20px;
      border: 1px solid ${COLORS.graylight};
      padding: 24px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.04);
      transition: box-shadow 0.2s, transform 0.2s;
    }
    .card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.07); transform: translateY(-1px); }

    .card-glass {
      background: rgba(255,255,255,0.7);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-radius: 20px;
      border: 1px solid rgba(255,255,255,0.8);
      padding: 24px;
    }

    .btn {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 10px 20px;
      border-radius: 12px;
      border: none;
      cursor: pointer;
      font-family: ${FONTS.body};
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s;
    }
    .btn-primary {
      background: ${COLORS.botanico};
      color: ${COLORS.cream};
    }
    .btn-primary:hover { background: ${COLORS.sageDark}; transform: translateY(-1px); }
    .btn-ghost {
      background: transparent;
      color: ${COLORS.graysoft};
      border: 1px solid ${COLORS.graylight};
    }
    .btn-ghost:hover { background: ${COLORS.beige}; color: ${COLORS.charcoal}; }

    .input {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid ${COLORS.graylight};
      border-radius: 12px;
      font-family: ${FONTS.body};
      font-size: 14px;
      color: ${COLORS.charcoal};
      background: ${COLORS.cream};
      outline: none;
      transition: border 0.2s, box-shadow 0.2s;
    }
    .input:focus {
      border-color: ${COLORS.sage};
      box-shadow: 0 0 0 3px rgba(124,140,110,0.12);
    }

    .label {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: ${COLORS.graysoft};
      margin-bottom: 6px;
    }

    .progress-bar {
      height: 6px;
      background: ${COLORS.graylight};
      border-radius: 99px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      border-radius: 99px;
      animation: fillBar 1.2s cubic-bezier(0.34,1.56,0.64,1) both;
    }

    .tag {
      display: inline-flex;
      padding: 4px 10px;
      border-radius: 99px;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.04em;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.15s;
      font-size: 14px;
      font-weight: 400;
      color: ${COLORS.graysoft};
      border: none;
      background: none;
      width: 100%;
      text-align: left;
    }
    .nav-item:hover { background: ${COLORS.beige}; color: ${COLORS.charcoal}; }
    .nav-item.active {
      background: ${COLORS.botanico};
      color: ${COLORS.cream};
      font-weight: 500;
    }
    .nav-item.active .nav-icon { color: ${COLORS.cream}; }

    .section-title {
      font-family: ${FONTS.display};
      font-size: 26px;
      font-weight: 500;
      color: ${COLORS.charcoal};
      margin-bottom: 6px;
    }
    .section-subtitle {
      font-size: 14px;
      color: ${COLORS.graysoft};
      margin-bottom: 28px;
    }

    .modal-overlay {
      position: fixed; inset: 0;
      background: rgba(26,26,24,0.5);
      backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000;
      padding: 20px;
      animation: fadeUp 0.2s ease both;
    }
    .modal {
      background: ${COLORS.white};
      border-radius: 24px;
      padding: 32px;
      width: 100%;
      max-width: 480px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.15);
      animation: fadeUp 0.25s ease both;
    }

    .debt-card {
      background: ${COLORS.white};
      border-radius: 20px;
      border: 1px solid ${COLORS.graylight};
      padding: 20px 24px;
      transition: all 0.2s;
    }
    .debt-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.08); transform: translateY(-2px); }

    .amount-hero {
      font-family: ${FONTS.display};
      font-size: 48px;
      font-weight: 500;
      letter-spacing: -0.02em;
      color: ${COLORS.charcoal};
    }

    .metric-label {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: ${COLORS.graysoft};
    }

    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
    @media (max-width: 640px) {
      .grid-2, .grid-3 { grid-template-columns: 1fr; }
      .amount-hero { font-size: 36px; }
      .section-title { font-size: 22px; }
    }

    .insight-card {
      background: linear-gradient(135deg, ${COLORS.botanico}, ${COLORS.sageDark});
      color: ${COLORS.cream};
      border-radius: 20px;
      padding: 20px 24px;
    }

    .streak-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      background: ${COLORS.beige};
      border-radius: 99px;
      font-size: 13px;
      font-weight: 500;
      color: ${COLORS.botanico};
      border: 1px solid ${COLORS.sand};
    }

    select.input {
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 7L11 1' stroke='%238A8A8A' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 14px center;
      padding-right: 36px;
    }

    .tab {
      padding: 8px 18px;
      border-radius: 10px;
      border: none;
      font-family: ${FONTS.body};
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s;
      color: ${COLORS.graysoft};
      background: transparent;
    }
    .tab.active {
      background: ${COLORS.white};
      color: ${COLORS.charcoal};
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .semaforo-green { color: ${COLORS.sage}; }
    .semaforo-amber { color: ${COLORS.amber}; }
    .semaforo-red   { color: ${COLORS.rose}; }
  `;
  document.head.appendChild(style);
};

// ─── ICONS ────────────────────────────────────────────────────────
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const paths = {
    home: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
    income: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
    expense: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12",
    debt: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    savings: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z",
    goal: "M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3",
    distribute: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
    stats: "M18 20V10 M12 20V4 M6 20v-6",
    habits: "M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
    settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
    plus: "M12 5v14M5 12h14",
    chevron: "M9 18l6-6-6-6",
    arrow: "M5 12h14M12 5l7 7-7 7",
    check: "M20 6L9 17l-5-5",
    alert: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01",
    fire: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",
    leaf: "M2 22l10-10 M16 8c0 0-4 0-8 8 M2 8c0-4 4-6 8-6s8 2 8 6-2 6-4 8",
    x: "M18 6L6 18M6 6l12 12",
    wallet: "M21 12V7H5a2 2 0 0 1 0-4h14v4 M3 5v14a2 2 0 0 0 2 2h16v-5 M18 12a1 1 0 1 0 2 0 1 1 0 0 0-2 0",
    calendar: "M3 4h18v18H3z M16 2v4M8 2v4M3 10h18",
    trend: "M22 7l-9.5 9.5-5-5L1 17",
    moon: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      {paths[name]?.split(" M").map((d, i) => (
        <path key={i} d={i === 0 ? d : "M" + d} />
      ))}
    </svg>
  );
};

// ─── PROGRESS RING ─────────────────────────────────────────────────
const ProgressRing = ({ pct: p, size = 80, color = COLORS.sage, bg = COLORS.graylight, children }) => {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (p / 100) * circ;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={bg} strokeWidth={8} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color}
          strokeWidth={8} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.34,1.56,0.64,1)" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {children}
      </div>
    </div>
  );
};

// ─── MODAL ─────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children }) => (
  <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
    <div className="modal">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <h3 style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: 500 }}>{title}</h3>
        <button onClick={onClose} className="btn btn-ghost" style={{ padding: "8px", borderRadius: 10 }}>
          <Icon name="x" size={16} />
        </button>
      </div>
      {children}
    </div>
  </div>
);

// ─── SIDEBAR ────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "home" },
  { id: "ingresos", label: "Ingresos", icon: "income" },
  { id: "gastos", label: "Gastos", icon: "expense" },
  { id: "deudas", label: "Deudas", icon: "debt" },
  { id: "ahorros", label: "Ahorros", icon: "savings" },
  { id: "metas", label: "Metas", icon: "goal" },
  { id: "distribucion", label: "Distribución", icon: "distribute" },
  { id: "estadisticas", label: "Estadísticas", icon: "stats" },
  { id: "habitos", label: "Hábitos", icon: "habits" },
  { id: "configuracion", label: "Configuración", icon: "settings" },
];

const Sidebar = ({ active, onChange, collapsed, setCollapsed }) => (
  <div style={{
    width: collapsed ? 64 : 220,
    background: COLORS.white,
    borderRight: `1px solid ${COLORS.graylight}`,
    display: "flex",
    flexDirection: "column",
    padding: "24px 12px",
    transition: "width 0.3s ease",
    flexShrink: 0,
    overflowX: "hidden",
  }}>
    {/* Logo */}
    <div style={{ padding: "0 4px 28px", display: "flex", alignItems: "center", gap: 10, overflow: "hidden" }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: `linear-gradient(135deg, ${COLORS.botanico}, ${COLORS.sage})`,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
      }}>
        <Icon name="leaf" size={18} color={COLORS.cream} />
      </div>
      {!collapsed && (
        <div>
          <div style={{ fontFamily: FONTS.display, fontSize: 16, fontWeight: 600, color: COLORS.charcoal, lineHeight: 1.1 }}>Flore</div>
          <div style={{ fontSize: 10, color: COLORS.graysoft, letterSpacing: "0.06em" }}>finanzas</div>
        </div>
      )}
    </div>

    {/* Nav */}
    <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
      {NAV_ITEMS.map(item => (
        <button key={item.id}
          className={`nav-item ${active === item.id ? "active" : ""}`}
          onClick={() => onChange(item.id)}
          title={collapsed ? item.label : ""}
          style={{ justifyContent: collapsed ? "center" : "flex-start" }}>
          <span className="nav-icon" style={{ flexShrink: 0 }}>
            <Icon name={item.icon} size={17} />
          </span>
          {!collapsed && <span style={{ whiteSpace: "nowrap" }}>{item.label}</span>}
        </button>
      ))}
    </nav>

    {/* Collapse toggle */}
    <button onClick={() => setCollapsed(!collapsed)}
      className="btn btn-ghost"
      style={{ marginTop: 8, justifyContent: collapsed ? "center" : "flex-start", padding: "10px 14px" }}>
      <Icon name="chevron" size={16} style={{ transform: collapsed ? "rotate(0deg)" : "rotate(180deg)" }} />
      {!collapsed && <span style={{ fontSize: 13 }}>Colapsar</span>}
    </button>
  </div>
);

// ─── DASHBOARD ─────────────────────────────────────────────────────
const Dashboard = ({ state }) => {
  const totalIngresos = state.ingresos.filter(i => i.estado === "recibido").reduce((s, i) => s + i.monto, 0);
  const totalGastos = state.gastos.reduce((s, g) => s + g.monto, 0);
  const totalDeudas = state.deudas.reduce((s, d) => s + (d.total - d.pagado), 0);
  const totalAhorros = state.ahorros.reduce((s, a) => s + a.actual, 0);
  const cuotasMes = state.deudas.reduce((s, d) => s + d.cuotaMensual, 0);
  const gastoFijo = state.gastos.filter(g => g.tipo === "fijo").reduce((s, g) => s + g.monto, 0);
  const comprometido = cuotasMes + gastoFijo;
  const libre = totalIngresos - comprometido - totalGastos;
  const pctAhorro = pct(totalAhorros, 20000);

  const semaforoColor = libre > 500 ? COLORS.sage : libre > 0 ? COLORS.amber : COLORS.rose;
  const semaforoText = libre > 500 ? "Estás bien" : libre > 0 ? "Con cuidado" : "Atención";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${COLORS.botanico} 0%, ${COLORS.sage} 60%, ${COLORS.sageLight} 100%)`,
        borderRadius: 24,
        padding: "36px 32px",
        color: COLORS.cream,
        position: "relative",
        overflow: "hidden",
      }} className="fade-up">
        <div style={{
          position: "absolute", top: -40, right: -40,
          width: 200, height: 200,
          background: "rgba(255,255,255,0.06)",
          borderRadius: "50%"
        }} />
        <div style={{
          position: "absolute", bottom: -60, right: 80,
          width: 150, height: 150,
          background: "rgba(255,255,255,0.04)",
          borderRadius: "50%"
        }} />
        <p style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.7, marginBottom: 8 }}>
          Dinero disponible real
        </p>
        <div className="amount-hero" style={{ color: COLORS.cream, marginBottom: 4 }}>
          {fmtSimple(Math.max(0, libre))}
        </div>
        <p style={{ opacity: 0.7, fontSize: 14 }}>Puedes usar esto sin riesgo</p>

        <div style={{ display: "flex", gap: 24, marginTop: 28, flexWrap: "wrap" }}>
          {[
            { label: "Ingresos mes", val: fmtSimple(totalIngresos), op: 1 },
            { label: "Comprometido", val: fmtSimple(comprometido), op: 0.7 },
            { label: "Ahorros totales", val: fmtSimple(totalAhorros), op: 0.7 },
          ].map(m => (
            <div key={m.label} style={{ opacity: m.op }}>
              <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 2, opacity: 0.8 }}>{m.label}</div>
              <div style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: 500 }}>{m.val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Semáforo + métricas */}
      <div className="grid-3 fade-up-1">
        <div className="card" style={{ borderTop: `4px solid ${semaforoColor}` }}>
          <p className="metric-label">Semáforo de gasto</p>
          <div style={{ fontFamily: FONTS.display, fontSize: 28, fontWeight: 500, color: semaforoColor, margin: "8px 0 4px" }}>
            {semaforoText}
          </div>
          <p style={{ fontSize: 13, color: COLORS.graysoft }}>
            {libre > 0 ? `Te quedan ${fmtSimple(libre)} libres` : "Revisa tus gastos"}
          </p>
        </div>
        <div className="card">
          <p className="metric-label">Deuda total pendiente</p>
          <div style={{ fontFamily: FONTS.display, fontSize: 28, fontWeight: 500, color: COLORS.charcoal, margin: "8px 0 4px" }}>
            {fmtSimple(totalDeudas)}
          </div>
          <p style={{ fontSize: 13, color: COLORS.graysoft }}>{state.deudas.length} deudas activas</p>
        </div>
        <div className="card">
          <p className="metric-label">Progreso de ahorro</p>
          <div style={{ fontFamily: FONTS.display, fontSize: 28, fontWeight: 500, color: COLORS.botanico, margin: "8px 0 12px" }}>
            {pctAhorro}%
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ "--target": `${pctAhorro}%`, width: `${pctAhorro}%`, background: COLORS.sage }} />
          </div>
        </div>
      </div>

      {/* Insight + Próximas deudas */}
      <div className="grid-2 fade-up-2">
        <div className="insight-card">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Icon name="trend" size={16} color={COLORS.sageLight} />
            <span style={{ fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.8 }}>Insight del mes</span>
          </div>
          <p style={{ fontSize: 16, lineHeight: 1.6, fontFamily: FONTS.display, fontWeight: 400 }}>
            Tu mayor oportunidad está en reducir gastos de ocio un 20%. Podrías adicionar {fmtSimple(130)} más a deudas.
          </p>
          <div style={{ marginTop: 16, padding: "10px 14px", background: "rgba(255,255,255,0.12)", borderRadius: 12 }}>
            <p style={{ fontSize: 12, opacity: 0.9 }}>💡 Las cuotas de deudas toman el {Math.round((cuotasMes / totalIngresos) * 100)}% de tus ingresos</p>
          </div>
        </div>

        <div className="card">
          <p className="metric-label" style={{ marginBottom: 16 }}>Próximos vencimientos</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {state.deudas
              .sort((a, b) => new Date(a.vencimiento) - new Date(b.vencimiento))
              .slice(0, 3)
              .map(d => (
                <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{d.nombre}</div>
                    <div style={{ fontSize: 11, color: COLORS.graysoft }}>{d.vencimiento}</div>
                  </div>
                  <div style={{ fontFamily: FONTS.mono, fontSize: 13, color: COLORS.charcoal, fontWeight: 500 }}>
                    {fmtSimple(d.cuotaMensual)}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Hábitos rápidos */}
      <div className="card fade-up-3">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <p className="metric-label">Tus logros financieros</p>
          <div className="streak-badge">
            <Icon name="fire" size={14} color={COLORS.amber} />
            <span>{state.habitos.streak} días</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {state.habitos.logros.map((l, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 16px",
              background: COLORS.cream,
              borderRadius: 12,
              border: `1px solid ${COLORS.graylight}`
            }}>
              <span style={{ fontSize: 18 }}>
                {l.tipo === "positivo" ? "✨" : l.tipo === "logro" ? "🏆" : "📈"}
              </span>
              <span style={{ fontSize: 14, color: COLORS.charcoal }}>{l.texto}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── DEUDAS ────────────────────────────────────────────────────────
const Deudas = ({ state, setState }) => {
  const [showModal, setShowModal] = useState(false);
  const [showPago, setShowPago] = useState(null);
  const [sortBy, setSortBy] = useState("prioridad");
  const [pagando, setPagando] = useState({ monto: "" });
  const [nueva, setNueva] = useState({
    nombre: "", total: "", pagado: "", cuotaMensual: "",
    interes: "", vencimiento: "", prioridad: "media"
  });

  const totalPendiente = state.deudas.reduce((s, d) => s + (d.total - d.pagado), 0);
  const totalPagado = state.deudas.reduce((s, d) => s + d.pagado, 0);
  const totalDeuda = state.deudas.reduce((s, d) => s + d.total, 0);
  const pctGeneral = pct(totalPagado, totalDeuda);

  const colores = [COLORS.sage, COLORS.olive, COLORS.amber, COLORS.rose, COLORS.sageLight, COLORS.botanico, COLORS.amberLight];

  const sorted = [...state.deudas].sort((a, b) => {
    if (sortBy === "prioridad") {
      const p = { alta: 0, media: 1, baja: 2 };
      return p[a.prioridad] - p[b.prioridad];
    }
    if (sortBy === "interes") return b.interes - a.interes;
    if (sortBy === "pendiente") return (a.total - a.pagado) - (b.total - b.pagado);
    if (sortBy === "progreso") return pct(b.pagado, b.total) - pct(a.pagado, a.total);
    return 0;
  });

  const handlePago = () => {
    const monto = parseFloat(pagando.monto);
    if (!monto || monto <= 0) return;
    setState(prev => ({
      ...prev,
      deudas: prev.deudas.map(d =>
        d.id === showPago.id
          ? { ...d, pagado: Math.min(d.total, d.pagado + monto) }
          : d
      )
    }));
    setShowPago(null);
    setPagando({ monto: "" });
  };

  const handleAgregar = () => {
    if (!nueva.nombre || !nueva.total) return;
    const color = colores[state.deudas.length % colores.length];
    setState(prev => ({
      ...prev,
      deudas: [...prev.deudas, {
        id: Date.now(),
        nombre: nueva.nombre,
        total: parseFloat(nueva.total) || 0,
        pagado: parseFloat(nueva.pagado) || 0,
        cuotaMensual: parseFloat(nueva.cuotaMensual) || 0,
        interes: parseFloat(nueva.interes) || 0,
        vencimiento: nueva.vencimiento || "2025-12-31",
        prioridad: nueva.prioridad,
        color,
      }]
    }));
    setNueva({ nombre: "", total: "", pagado: "", cuotaMensual: "", interes: "", vencimiento: "", prioridad: "media" });
    setShowModal(false);
  };

  const handleEliminar = (id) => {
    setState(prev => ({ ...prev, deudas: prev.deudas.filter(d => d.id !== id) }));
  };

  const prioridadColor = { alta: COLORS.rose, media: COLORS.amber, baja: COLORS.sage };
  const prioridadBg = { alta: "#FDF0EE", media: "#FDF5EC", baja: "#EEF2EB" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div className="fade-up" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 className="section-title">Mis Deudas</h1>
          <p className="section-subtitle">Organiza, prioriza y salda cada compromiso</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Icon name="plus" size={16} color={COLORS.cream} />
          Nueva deuda
        </button>
      </div>

      {/* Resumen general */}
      <div className="fade-up-1" style={{
        background: `linear-gradient(135deg, ${COLORS.charcoal}, #3A3A38)`,
        borderRadius: 24, padding: "28px 32px", color: COLORS.cream,
        position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, background: "rgba(255,255,255,0.04)", borderRadius: "50%" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          <ProgressRing pct={pctGeneral} size={90} color={COLORS.sage} bg="rgba(255,255,255,0.1)">
            <span style={{ fontFamily: FONTS.mono, fontSize: 16, fontWeight: 600, color: COLORS.cream }}>{pctGeneral}%</span>
          </ProgressRing>
          <div>
            <p style={{ opacity: 0.6, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Progreso total de deudas</p>
            <div style={{ fontFamily: FONTS.display, fontSize: 38, fontWeight: 500, lineHeight: 1 }}>{fmtSimple(totalPendiente)}</div>
            <p style={{ opacity: 0.6, fontSize: 13, marginTop: 4 }}>pendiente de {fmtSimple(totalDeuda)} total</p>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div style={{ opacity: 0.6, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Ya pagaste</div>
            <div style={{ fontFamily: FONTS.display, fontSize: 28, fontWeight: 500, color: COLORS.sageLight }}>{fmtSimple(totalPagado)}</div>
          </div>
        </div>
      </div>

      {/* Sort */}
      <div className="fade-up-2" style={{ display: "flex", gap: 8, padding: "6px", background: COLORS.beige, borderRadius: 14, width: "fit-content" }}>
        {[
          { val: "prioridad", label: "Prioridad" },
          { val: "interes", label: "Interés" },
          { val: "pendiente", label: "Pendiente" },
          { val: "progreso", label: "Progreso" },
        ].map(s => (
          <button key={s.val} className={`tab ${sortBy === s.val ? "active" : ""}`} onClick={() => setSortBy(s.val)}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Tarjetas de deudas */}
      <div className="fade-up-3" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {sorted.map((d, i) => {
          const pendiente = d.total - d.pagado;
          const progreso = pct(d.pagado, d.total);
          const mesesRestantes = d.cuotaMensual > 0 ? Math.ceil(pendiente / d.cuotaMensual) : "—";
          return (
            <div key={d.id} className="debt-card" style={{ animationDelay: `${i * 0.05}s`, borderLeft: `4px solid ${d.color}` }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontFamily: FONTS.display, fontSize: 18, fontWeight: 500 }}>{d.nombre}</span>
                    <span className="tag" style={{
                      background: prioridadBg[d.prioridad],
                      color: prioridadColor[d.prioridad]
                    }}>
                      {d.prioridad}
                    </span>
                    {d.interes > 0 && (
                      <span className="tag" style={{ background: COLORS.beigeWarm, color: COLORS.amber }}>
                        {d.interes}% interés
                      </span>
                    )}
                  </div>

                  {/* Barra de progreso */}
                  <div style={{ marginBottom: 10 }}>
                    <div className="progress-bar" style={{ height: 8 }}>
                      <div className="progress-fill" style={{
                        "--target": `${progreso}%`, width: `${progreso}%`,
                        background: `linear-gradient(90deg, ${d.color}, ${d.color}CC)`
                      }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                      <span style={{ fontSize: 12, color: COLORS.graysoft }}>{fmtSimple(d.pagado)} pagado</span>
                      <span style={{ fontSize: 12, color: COLORS.charcoal, fontWeight: 500 }}>{progreso}%</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                    <div>
                      <span style={{ fontSize: 11, color: COLORS.graysoft }}>Pendiente </span>
                      <span style={{ fontSize: 14, fontFamily: FONTS.mono, fontWeight: 500 }}>{fmtSimple(pendiente)}</span>
                    </div>
                    <div>
                      <span style={{ fontSize: 11, color: COLORS.graysoft }}>Cuota </span>
                      <span style={{ fontSize: 14, fontFamily: FONTS.mono, fontWeight: 500 }}>{fmtSimple(d.cuotaMensual)}/mes</span>
                    </div>
                    <div>
                      <span style={{ fontSize: 11, color: COLORS.graysoft }}>~</span>
                      <span style={{ fontSize: 14, color: COLORS.charcoal }}>{mesesRestantes} meses restantes</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <button className="btn btn-primary" onClick={() => setShowPago(d)} style={{ fontSize: 13, padding: "8px 16px" }}>
                    Registrar pago
                  </button>
                  <button className="btn btn-ghost" onClick={() => handleEliminar(d.id)} style={{ padding: "8px", borderRadius: 10 }}>
                    <Icon name="x" size={14} color={COLORS.rose} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Estrategia sugerida */}
      <div className="insight-card fade-up-4">
        <p style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.7, marginBottom: 12 }}>
          🎯 Estrategia recomendada
        </p>
        <p style={{ fontFamily: FONTS.display, fontSize: 17, lineHeight: 1.6 }}>
          Prioriza la <strong style={{ color: COLORS.sageLight }}>{sorted[0]?.nombre}</strong> primero. Tiene el mayor impacto en tus finanzas.
          Considera adelantar pagos cuando tengas proyectos grandes.
        </p>
        <p style={{ marginTop: 12, opacity: 0.75, fontSize: 13 }}>
          Con {fmtSimple(state.deudas.reduce((s, d) => s + d.cuotaMensual, 0))} al mes, podrías estar libre de deudas en aprox. 3 años.
        </p>
      </div>

      {/* Modal registrar pago */}
      {showPago && (
        <Modal title={`Registrar pago — ${showPago.nombre}`} onClose={() => setShowPago(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ padding: "16px", background: COLORS.cream, borderRadius: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: COLORS.graysoft }}>Progreso actual</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{pct(showPago.pagado, showPago.total)}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{
                  "--target": `${pct(showPago.pagado, showPago.total)}%`,
                  width: `${pct(showPago.pagado, showPago.total)}%`,
                  background: showPago.color
                }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                <span style={{ fontSize: 12, color: COLORS.graysoft }}>{fmtSimple(showPago.pagado)} pagado</span>
                <span style={{ fontSize: 12, color: COLORS.charcoal }}>{fmtSimple(showPago.total - showPago.pagado)} pendiente</span>
              </div>
            </div>
            <div>
              <div className="label">Monto a pagar</div>
              <input className="input" type="number" placeholder={`Cuota sugerida: ${showPago.cuotaMensual}`}
                value={pagando.monto}
                onChange={e => setPagando({ monto: e.target.value })} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {[showPago.cuotaMensual, showPago.cuotaMensual * 1.5, showPago.cuotaMensual * 2].map(s => (
                <button key={s} className="btn btn-ghost" style={{ flex: 1, fontSize: 12 }}
                  onClick={() => setPagando({ monto: String(s) })}>
                  {fmtSimple(s)}
                </button>
              ))}
            </div>
            <button className="btn btn-primary" onClick={handlePago} style={{ width: "100%", justifyContent: "center" }}>
              <Icon name="check" size={16} color={COLORS.cream} />
              Confirmar pago
            </button>
          </div>
        </Modal>
      )}

      {/* Modal nueva deuda */}
      {showModal && (
        <Modal title="Nueva deuda" onClose={() => setShowModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <div className="label">Nombre de la deuda</div>
              <input className="input" placeholder="ej. Tarjeta Visa" value={nueva.nombre}
                onChange={e => setNueva(p => ({ ...p, nombre: e.target.value }))} />
            </div>
            <div className="grid-2">
              <div>
                <div className="label">Monto total</div>
                <input className="input" type="number" placeholder="0" value={nueva.total}
                  onChange={e => setNueva(p => ({ ...p, total: e.target.value }))} />
              </div>
              <div>
                <div className="label">Ya pagado</div>
                <input className="input" type="number" placeholder="0" value={nueva.pagado}
                  onChange={e => setNueva(p => ({ ...p, pagado: e.target.value }))} />
              </div>
            </div>
            <div className="grid-2">
              <div>
                <div className="label">Cuota mensual</div>
                <input className="input" type="number" placeholder="0" value={nueva.cuotaMensual}
                  onChange={e => setNueva(p => ({ ...p, cuotaMensual: e.target.value }))} />
              </div>
              <div>
                <div className="label">Interés anual (%)</div>
                <input className="input" type="number" placeholder="0" value={nueva.interes}
                  onChange={e => setNueva(p => ({ ...p, interes: e.target.value }))} />
              </div>
            </div>
            <div className="grid-2">
              <div>
                <div className="label">Vencimiento</div>
                <input className="input" type="date" value={nueva.vencimiento}
                  onChange={e => setNueva(p => ({ ...p, vencimiento: e.target.value }))} />
              </div>
              <div>
                <div className="label">Prioridad</div>
                <select className="input" value={nueva.prioridad}
                  onChange={e => setNueva(p => ({ ...p, prioridad: e.target.value }))}>
                  <option value="alta">Alta</option>
                  <option value="media">Media</option>
                  <option value="baja">Baja</option>
                </select>
              </div>
            </div>
            <button className="btn btn-primary" onClick={handleAgregar} style={{ width: "100%", justifyContent: "center", marginTop: 4 }}>
              <Icon name="plus" size={16} color={COLORS.cream} />
              Agregar deuda
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── INGRESOS ──────────────────────────────────────────────────────
const Ingresos = ({ state, setState }) => {
  const [showModal, setShowModal] = useState(false);
  const [nuevo, setNuevo] = useState({ cliente: "", monto: "", fecha: "", estado: "recibido", categoria: "diseño" });

  const recibidos = state.ingresos.filter(i => i.estado === "recibido").reduce((s, i) => s + i.monto, 0);
  const esperados = state.ingresos.filter(i => i.estado === "esperado").reduce((s, i) => s + i.monto, 0);

  const categorias = { diseño: "🎨", desarrollo: "💻", consultoría: "💬", fotografía: "📷", marketing: "📣", otro: "📦" };

  const handleAgregar = () => {
    if (!nuevo.cliente || !nuevo.monto) return;
    setState(prev => ({
      ...prev,
      ingresos: [...prev.ingresos, { id: Date.now(), ...nuevo, monto: parseFloat(nuevo.monto) }]
    }));
    setNuevo({ cliente: "", monto: "", fecha: "", estado: "recibido", categoria: "diseño" });
    setShowModal(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div className="fade-up" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 className="section-title">Ingresos</h1>
          <p className="section-subtitle">Tus entradas por proyectos y clientes</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Icon name="plus" size={16} color={COLORS.cream} /> Nuevo ingreso
        </button>
      </div>

      <div className="grid-2 fade-up-1">
        <div className="card" style={{ background: `linear-gradient(135deg, ${COLORS.sage}15, ${COLORS.sageLight}10)`, border: `1px solid ${COLORS.sage}30` }}>
          <p className="metric-label">Recibido este mes</p>
          <div style={{ fontFamily: FONTS.display, fontSize: 36, fontWeight: 500, color: COLORS.botanico, margin: "8px 0 4px" }}>{fmtSimple(recibidos)}</div>
          <p style={{ fontSize: 13, color: COLORS.sage }}>{state.ingresos.filter(i => i.estado === "recibido").length} pagos recibidos</p>
        </div>
        <div className="card" style={{ background: `linear-gradient(135deg, ${COLORS.amber}15, ${COLORS.amberLight}10)`, border: `1px solid ${COLORS.amber}30` }}>
          <p className="metric-label">Esperado próximo</p>
          <div style={{ fontFamily: FONTS.display, fontSize: 36, fontWeight: 500, color: COLORS.amber, margin: "8px 0 4px" }}>{fmtSimple(esperados)}</div>
          <p style={{ fontSize: 13, color: COLORS.amber }}>{state.ingresos.filter(i => i.estado === "esperado").length} pagos pendientes</p>
        </div>
      </div>

      <div className="card fade-up-2">
        <p className="metric-label" style={{ marginBottom: 16 }}>Historial de ingresos</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {state.ingresos.map(ingreso => (
            <div key={ingreso.id} style={{
              display: "flex", alignItems: "center", gap: 14, padding: "14px 16px",
              background: COLORS.cream, borderRadius: 14,
              border: `1px solid ${COLORS.graylight}`
            }}>
              <span style={{ fontSize: 22 }}>{categorias[ingreso.categoria] || "📦"}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 14 }}>{ingreso.cliente}</div>
                <div style={{ fontSize: 12, color: COLORS.graysoft }}>{ingreso.fecha} · {ingreso.categoria}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: FONTS.mono, fontSize: 16, fontWeight: 600, color: COLORS.charcoal }}>{fmtSimple(ingreso.monto)}</div>
                <span className="tag" style={{
                  background: ingreso.estado === "recibido" ? "#EEF2EB" : "#FDF5EC",
                  color: ingreso.estado === "recibido" ? COLORS.sage : COLORS.amber
                }}>{ingreso.estado}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <Modal title="Nuevo ingreso" onClose={() => setShowModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div><div className="label">Cliente / Proyecto</div>
              <input className="input" placeholder="ej. Branding Co." value={nuevo.cliente} onChange={e => setNuevo(p => ({ ...p, cliente: e.target.value }))} />
            </div>
            <div className="grid-2">
              <div><div className="label">Monto</div>
                <input className="input" type="number" placeholder="0" value={nuevo.monto} onChange={e => setNuevo(p => ({ ...p, monto: e.target.value }))} />
              </div>
              <div><div className="label">Fecha</div>
                <input className="input" type="date" value={nuevo.fecha} onChange={e => setNuevo(p => ({ ...p, fecha: e.target.value }))} />
              </div>
            </div>
            <div className="grid-2">
              <div><div className="label">Estado</div>
                <select className="input" value={nuevo.estado} onChange={e => setNuevo(p => ({ ...p, estado: e.target.value }))}>
                  <option value="recibido">Recibido</option>
                  <option value="esperado">Esperado</option>
                </select>
              </div>
              <div><div className="label">Categoría</div>
                <select className="input" value={nuevo.categoria} onChange={e => setNuevo(p => ({ ...p, categoria: e.target.value }))}>
                  {Object.keys(categorias).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <button className="btn btn-primary" onClick={handleAgregar} style={{ width: "100%", justifyContent: "center", marginTop: 4 }}>
              <Icon name="check" size={16} color={COLORS.cream} /> Registrar ingreso
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── GASTOS ────────────────────────────────────────────────────────
const Gastos = ({ state, setState }) => {
  const [showModal, setShowModal] = useState(false);
  const [nuevo, setNuevo] = useState({ descripcion: "", monto: "", categoria: "alimentación", tipo: "variable", fecha: new Date().toISOString().split("T")[0], nota: "" });

  const total = state.gastos.reduce((s, g) => s + g.monto, 0);
  const fijos = state.gastos.filter(g => g.tipo === "fijo").reduce((s, g) => s + g.monto, 0);
  const variables = total - fijos;

  const porCategoria = state.gastos.reduce((acc, g) => {
    acc[g.categoria] = (acc[g.categoria] || 0) + g.monto;
    return acc;
  }, {});

  const catEmojis = { vivienda: "🏠", alimentación: "🥗", transporte: "🚗", ocio: "🎭", suscripciones: "📱", salud: "💊", educación: "📚", otro: "📦" };
  const catColors = [COLORS.sage, COLORS.olive, COLORS.amber, COLORS.rose, COLORS.sageLight, COLORS.botanico, COLORS.amberLight, COLORS.graysoft];

  const handleAgregar = () => {
    if (!nuevo.descripcion || !nuevo.monto) return;
    setState(prev => ({
      ...prev,
      gastos: [...prev.gastos, { id: Date.now(), ...nuevo, monto: parseFloat(nuevo.monto) }]
    }));
    setNuevo({ descripcion: "", monto: "", categoria: "alimentación", tipo: "variable", fecha: new Date().toISOString().split("T")[0], nota: "" });
    setShowModal(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div className="fade-up" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 className="section-title">Gastos</h1>
          <p className="section-subtitle">¿A dónde va tu dinero realmente?</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Icon name="plus" size={16} color={COLORS.cream} /> Nuevo gasto
        </button>
      </div>

      <div className="grid-3 fade-up-1">
        {[
          { label: "Total gastado", val: fmtSimple(total), color: COLORS.charcoal },
          { label: "Gastos fijos", val: fmtSimple(fijos), color: COLORS.sage },
          { label: "Gastos variables", val: fmtSimple(variables), color: COLORS.amber },
        ].map(m => (
          <div key={m.label} className="card">
            <p className="metric-label">{m.label}</p>
            <div style={{ fontFamily: FONTS.display, fontSize: 28, fontWeight: 500, color: m.color, marginTop: 8 }}>{m.val}</div>
          </div>
        ))}
      </div>

      {/* Por categoría */}
      <div className="card fade-up-2">
        <p className="metric-label" style={{ marginBottom: 16 }}>Por categoría</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {Object.entries(porCategoria).sort((a, b) => b[1] - a[1]).map(([cat, monto], i) => (
            <div key={cat}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
                  <span>{catEmojis[cat] || "📦"}</span> {cat}
                </span>
                <span style={{ fontFamily: FONTS.mono, fontSize: 14, fontWeight: 500 }}>{fmtSimple(monto)}</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{
                  "--target": `${pct(monto, total)}%`, width: `${pct(monto, total)}%`,
                  background: catColors[i % catColors.length]
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lista */}
      <div className="card fade-up-3">
        <p className="metric-label" style={{ marginBottom: 16 }}>Todos los gastos</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {state.gastos.map(g => (
            <div key={g.id} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 16px", background: COLORS.cream,
              borderRadius: 12, border: `1px solid ${COLORS.graylight}`
            }}>
              <span style={{ fontSize: 20 }}>{catEmojis[g.categoria] || "📦"}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 14 }}>{g.descripcion}</div>
                <div style={{ fontSize: 12, color: COLORS.graysoft }}>{g.fecha} · {g.categoria}</div>
              </div>
              <span className="tag" style={{ background: g.tipo === "fijo" ? "#EEF2EB" : COLORS.beige, color: g.tipo === "fijo" ? COLORS.sage : COLORS.graysoft }}>
                {g.tipo}
              </span>
              <span style={{ fontFamily: FONTS.mono, fontWeight: 600, fontSize: 14 }}>{fmtSimple(g.monto)}</span>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <Modal title="Nuevo gasto" onClose={() => setShowModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div><div className="label">Descripción</div>
              <input className="input" placeholder="ej. Mercado semanal" value={nuevo.descripcion} onChange={e => setNuevo(p => ({ ...p, descripcion: e.target.value }))} />
            </div>
            <div className="grid-2">
              <div><div className="label">Monto</div>
                <input className="input" type="number" value={nuevo.monto} onChange={e => setNuevo(p => ({ ...p, monto: e.target.value }))} />
              </div>
              <div><div className="label">Fecha</div>
                <input className="input" type="date" value={nuevo.fecha} onChange={e => setNuevo(p => ({ ...p, fecha: e.target.value }))} />
              </div>
            </div>
            <div className="grid-2">
              <div><div className="label">Categoría</div>
                <select className="input" value={nuevo.categoria} onChange={e => setNuevo(p => ({ ...p, categoria: e.target.value }))}>
                  {Object.keys(catEmojis).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div><div className="label">Tipo</div>
                <select className="input" value={nuevo.tipo} onChange={e => setNuevo(p => ({ ...p, tipo: e.target.value }))}>
                  <option value="fijo">Fijo</option>
                  <option value="variable">Variable</option>
                </select>
              </div>
            </div>
            <button className="btn btn-primary" onClick={handleAgregar} style={{ width: "100%", justifyContent: "center" }}>
              <Icon name="check" size={16} color={COLORS.cream} /> Registrar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── AHORROS ───────────────────────────────────────────────────────
const Ahorros = ({ state, setState }) => {
  const [depositar, setDepositar] = useState(null);
  const [monto, setMonto] = useState("");
  const total = state.ahorros.reduce((s, a) => s + a.actual, 0);
  const metaTotal = state.ahorros.reduce((s, a) => s + a.meta, 0);

  const handleDepositar = () => {
    const m = parseFloat(monto);
    if (!m || m <= 0) return;
    setState(prev => ({
      ...prev,
      ahorros: prev.ahorros.map(a => a.id === depositar.id ? { ...a, actual: Math.min(a.meta, a.actual + m) } : a)
    }));
    setDepositar(null);
    setMonto("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div className="fade-up">
        <h1 className="section-title">Ahorros</h1>
        <p className="section-subtitle">Cada peso guardado es un paso hacia la libertad</p>
      </div>

      <div className="card fade-up-1" style={{ background: `linear-gradient(135deg, ${COLORS.sage}20, ${COLORS.botanico}15)`, border: `1px solid ${COLORS.sage}30` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <ProgressRing pct={pct(total, metaTotal)} size={80} color={COLORS.sage}>
            <span style={{ fontFamily: FONTS.mono, fontSize: 13, fontWeight: 600, color: COLORS.botanico }}>{pct(total, metaTotal)}%</span>
          </ProgressRing>
          <div>
            <p className="metric-label">Total ahorrado</p>
            <div style={{ fontFamily: FONTS.display, fontSize: 36, fontWeight: 500, color: COLORS.botanico, margin: "4px 0" }}>{fmtSimple(total)}</div>
            <p style={{ fontSize: 13, color: COLORS.sage }}>de {fmtSimple(metaTotal)} en metas totales</p>
          </div>
        </div>
      </div>

      <div className="grid-2 fade-up-2">
        {state.ahorros.map(a => {
          const p = pct(a.actual, a.meta);
          return (
            <div key={a.id} className="card" style={{ borderTop: `4px solid ${a.color}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <span style={{ fontSize: 24 }}>{a.emoji}</span>
                  <div style={{ fontFamily: FONTS.display, fontSize: 16, fontWeight: 500, marginTop: 4 }}>{a.nombre}</div>
                </div>
                <span style={{ fontFamily: FONTS.mono, fontSize: 13, color: COLORS.graysoft }}>{p}%</span>
              </div>
              <div className="progress-bar" style={{ marginBottom: 10 }}>
                <div className="progress-fill" style={{ "--target": `${p}%`, width: `${p}%`, background: a.color }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontFamily: FONTS.mono }}>{fmtSimple(a.actual)}</span>
                <span style={{ fontSize: 13, color: COLORS.graysoft }}>meta: {fmtSimple(a.meta)}</span>
              </div>
              <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "center", fontSize: 13 }}
                onClick={() => setDepositar(a)}>
                + Depositar
              </button>
            </div>
          );
        })}
      </div>

      {depositar && (
        <Modal title={`Depositar — ${depositar.emoji} ${depositar.nombre}`} onClose={() => setDepositar(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ padding: "14px 16px", background: COLORS.cream, borderRadius: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: COLORS.graysoft, fontSize: 13 }}>Actual</span>
                <span style={{ fontFamily: FONTS.mono }}>{fmtSimple(depositar.actual)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                <span style={{ color: COLORS.graysoft, fontSize: 13 }}>Falta</span>
                <span style={{ fontFamily: FONTS.mono, color: depositar.color }}>{fmtSimple(depositar.meta - depositar.actual)}</span>
              </div>
            </div>
            <div><div className="label">Monto a depositar</div>
              <input className="input" type="number" placeholder="0" value={monto} onChange={e => setMonto(e.target.value)} />
            </div>
            <button className="btn btn-primary" onClick={handleDepositar} style={{ width: "100%", justifyContent: "center" }}>
              <Icon name="check" size={16} color={COLORS.cream} /> Depositar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── DISTRIBUCIÓN ──────────────────────────────────────────────────
const Distribucion = ({ state }) => {
  const [monto, setMonto] = useState("");
  const [distribucion, setDistribucion] = useState(null);

  const calcular = () => {
    const m = parseFloat(monto);
    if (!m) return;
    const cuotas = state.deudas.reduce((s, d) => s + d.cuotaMensual, 0);
    const fijos = state.gastos.filter(g => g.tipo === "fijo").reduce((s, g) => s + g.monto, 0);
    const ahorro = Math.round(m * 0.15);
    const colchon = Math.round(m * 0.10);
    const deudas = Math.min(cuotas, m * 0.30);
    const gastosFijos = Math.min(fijos, m * 0.35);
    const libre = m - ahorro - colchon - deudas - gastosFijos;

    setDistribucion([
      { label: "Gastos fijos", monto: gastosFijos, pct: pct(gastosFijos, m), color: COLORS.sage, emoji: "🏠", desc: "Arriendo, servicios, suscripciones" },
      { label: "Deudas del mes", monto: deudas, pct: pct(deudas, m), color: COLORS.rose, emoji: "💳", desc: "Cuotas comprometidas este mes" },
      { label: "Ahorro automático", monto: ahorro, pct: pct(ahorro, m), color: COLORS.botanico, emoji: "🌱", desc: "15% para tus metas y emergencias" },
      { label: "Colchón próximo mes", monto: colchon, pct: pct(colchon, m), color: COLORS.olive, emoji: "🌙", desc: "Por si no llega un cliente pronto" },
      { label: "Dinero libre", monto: Math.max(0, libre), pct: Math.max(0, pct(libre, m)), color: COLORS.amber, emoji: "✨", desc: "Esto sí es tuyo para gastar" },
    ]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div className="fade-up">
        <h1 className="section-title">Distribución inteligente</h1>
        <p className="section-subtitle">Cuando entra dinero, ¿qué hacer con él?</p>
      </div>

      <div className="card fade-up-1">
        <p style={{ fontFamily: FONTS.display, fontSize: 18, marginBottom: 6 }}>Llegó un pago. ¿Cómo lo distribuyes?</p>
        <p style={{ fontSize: 14, color: COLORS.graysoft, marginBottom: 20 }}>Ingresa el monto recibido y te digo exactamente qué hacer con él.</p>
        <div style={{ display: "flex", gap: 12 }}>
          <input className="input" type="number" placeholder="¿Cuánto recibiste?" value={monto}
            onChange={e => setMonto(e.target.value)}
            style={{ fontSize: 18, padding: "14px 16px" }} />
          <button className="btn btn-primary" onClick={calcular} style={{ padding: "14px 24px", whiteSpace: "nowrap" }}>
            <Icon name="distribute" size={16} color={COLORS.cream} /> Distribuir
          </button>
        </div>
      </div>

      {distribucion && (
        <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="insight-card">
            <p style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.7, marginBottom: 8 }}>Plan para</p>
            <div style={{ fontFamily: FONTS.display, fontSize: 32, fontWeight: 500 }}>{fmtSimple(parseFloat(monto))}</div>
          </div>

          {distribucion.map((d, i) => (
            <div key={i} className="card" style={{ borderLeft: `4px solid ${d.color}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
                <span style={{ fontSize: 24 }}>{d.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: FONTS.display, fontSize: 17, fontWeight: 500 }}>{d.label}</div>
                  <div style={{ fontSize: 13, color: COLORS.graysoft }}>{d.desc}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: FONTS.mono, fontSize: 20, fontWeight: 600, color: d.color }}>{fmtSimple(d.monto)}</div>
                  <div style={{ fontSize: 12, color: COLORS.graysoft }}>{d.pct}%</div>
                </div>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ "--target": `${d.pct}%`, width: `${d.pct}%`, background: d.color }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── METAS ─────────────────────────────────────────────────────────
const Metas = ({ state, setState }) => {
  const [showModal, setShowModal] = useState(false);
  const [nueva, setNueva] = useState({ nombre: "", monto: "", actual: "0", emoji: "🎯", deadline: "" });

  const handleAgregar = () => {
    if (!nueva.nombre || !nueva.monto) return;
    setState(prev => ({
      ...prev,
      metas: [...prev.metas, { id: Date.now(), ...nueva, monto: parseFloat(nueva.monto), actual: parseFloat(nueva.actual) || 0 }]
    }));
    setNueva({ nombre: "", monto: "", actual: "0", emoji: "🎯", deadline: "" });
    setShowModal(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div className="fade-up" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 className="section-title">Metas financieras</h1>
          <p className="section-subtitle">Tus sueños, convertidos en números</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Icon name="plus" size={16} color={COLORS.cream} /> Nueva meta
        </button>
      </div>

      <div className="grid-2 fade-up-1">
        {state.metas.map(meta => {
          const p = pct(meta.actual, meta.monto);
          const falta = meta.monto - meta.actual;
          const mesesEstimados = Math.ceil(falta / 300);
          return (
            <div key={meta.id} className="card" style={{ position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -20, right: -20, fontSize: 80, opacity: 0.06 }}>{meta.emoji}</div>
              <div style={{ fontSize: 32, marginBottom: 8 }} className="float">{meta.emoji}</div>
              <div style={{ fontFamily: FONTS.display, fontSize: 18, fontWeight: 500, marginBottom: 4 }}>{meta.nombre}</div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 24, fontWeight: 600, color: COLORS.botanico, marginBottom: 16 }}>{fmtSimple(meta.actual)}</div>
              <div className="progress-bar" style={{ marginBottom: 8 }}>
                <div className="progress-fill" style={{ "--target": `${p}%`, width: `${p}%`, background: `linear-gradient(90deg, ${COLORS.sage}, ${COLORS.sageLight})` }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: COLORS.graysoft, marginBottom: 12 }}>
                <span>{p}% completado</span>
                <span>Meta: {fmtSimple(meta.monto)}</span>
              </div>
              <div style={{ fontSize: 13, color: COLORS.sage }}>
                📅 ~{mesesEstimados} meses guardando $300/mes
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <Modal title="Nueva meta" onClose={() => setShowModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="grid-2">
              <div><div className="label">Emoji</div>
                <input className="input" placeholder="🎯" value={nueva.emoji} onChange={e => setNueva(p => ({ ...p, emoji: e.target.value }))} />
              </div>
              <div><div className="label">Nombre de la meta</div>
                <input className="input" placeholder="ej. Viaje a Europa" value={nueva.nombre} onChange={e => setNueva(p => ({ ...p, nombre: e.target.value }))} />
              </div>
            </div>
            <div className="grid-2">
              <div><div className="label">Monto objetivo</div>
                <input className="input" type="number" value={nueva.monto} onChange={e => setNueva(p => ({ ...p, monto: e.target.value }))} />
              </div>
              <div><div className="label">Ya tengo</div>
                <input className="input" type="number" value={nueva.actual} onChange={e => setNueva(p => ({ ...p, actual: e.target.value }))} />
              </div>
            </div>
            <div><div className="label">Fecha límite</div>
              <input className="input" type="date" value={nueva.deadline} onChange={e => setNueva(p => ({ ...p, deadline: e.target.value }))} />
            </div>
            <button className="btn btn-primary" onClick={handleAgregar} style={{ width: "100%", justifyContent: "center" }}>
              <Icon name="check" size={16} color={COLORS.cream} /> Crear meta
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── HÁBITOS ───────────────────────────────────────────────────────
const Habitos = ({ state }) => {
  const reflexiones = [
    "El dinero es una herramienta. Tú decides qué construyes con él.",
    "Ahorrar no es restricción. Es elegir tu futuro con intención.",
    "Cada deuda pagada es una cadena menos.",
    "La riqueza no se construye de golpe. Se construye consistentemente.",
    "Tener claridad financiera es un acto de cuidado propio.",
  ];
  const reflexionHoy = reflexiones[new Date().getDay() % reflexiones.length];

  const metricas = [
    { label: "Días de racha", val: state.habitos.streak, emoji: "🔥", color: COLORS.amber },
    { label: "Días sin impulsivos", val: state.habitos.sinGastosImpulsivos, emoji: "✨", color: COLORS.sage },
    { label: "Metas activas", val: state.habitos.metasActivas, emoji: "🎯", color: COLORS.botanico },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div className="fade-up">
        <h1 className="section-title">Hábitos & Mentalidad</h1>
        <p className="section-subtitle">Tu relación con el dinero se transforma despacio, y eso está bien.</p>
      </div>

      {/* Reflexión */}
      <div className="fade-up-1" style={{
        background: `linear-gradient(135deg, ${COLORS.beigeWarm}, ${COLORS.sandLight})`,
        border: `1px solid ${COLORS.sand}`,
        borderRadius: 24, padding: "28px 32px",
        position: "relative", overflow: "hidden"
      }}>
        <div style={{ fontSize: 48, marginBottom: 12, opacity: 0.4 }}>"</div>
        <p style={{ fontFamily: FONTS.display, fontSize: 20, lineHeight: 1.7, color: COLORS.charcoal, fontStyle: "italic" }}>
          {reflexionHoy}
        </p>
        <p style={{ marginTop: 16, fontSize: 12, color: COLORS.graysoft, letterSpacing: "0.06em" }}>REFLEXIÓN DE HOY</p>
      </div>

      {/* Métricas de hábitos */}
      <div className="grid-3 fade-up-2">
        {metricas.map(m => (
          <div key={m.label} className="card" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 8 }} className="float">{m.emoji}</div>
            <div style={{ fontFamily: FONTS.display, fontSize: 32, fontWeight: 500, color: m.color }}>{m.val}</div>
            <p style={{ fontSize: 13, color: COLORS.graysoft, marginTop: 4 }}>{m.label}</p>
          </div>
        ))}
      </div>

      {/* Logros */}
      <div className="card fade-up-3">
        <p className="metric-label" style={{ marginBottom: 16 }}>Tus logros recientes</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {state.habitos.logros.map((l, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: "16px 18px",
              background: i === 0 ? `${COLORS.sage}15` : COLORS.cream,
              borderRadius: 14,
              border: `1px solid ${i === 0 ? COLORS.sage + "40" : COLORS.graylight}`
            }}>
              <span style={{ fontSize: 24 }}>
                {l.tipo === "positivo" ? "✨" : l.tipo === "logro" ? "🏆" : "📈"}
              </span>
              <span style={{ fontSize: 15, color: COLORS.charcoal, lineHeight: 1.5 }}>{l.texto}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tip financiero */}
      <div className="card fade-up-4" style={{ background: COLORS.cream, border: `1px solid ${COLORS.sand}` }}>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: `${COLORS.sage}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name="leaf" size={20} color={COLORS.sage} />
          </div>
          <div>
            <p style={{ fontWeight: 600, marginBottom: 6, fontSize: 15 }}>Tip de la semana</p>
            <p style={{ fontSize: 14, color: COLORS.graysoft, lineHeight: 1.7 }}>
              Con ingresos variables, guarda siempre el 20% de cada pago antes de gastar cualquier cosa.
              Tu yo del mes siguiente te lo agradecerá cuando no llegue un cliente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── ESTADÍSTICAS ──────────────────────────────────────────────────
const Estadisticas = ({ state }) => {
  const totalIngresos = state.ingresos.filter(i => i.estado === "recibido").reduce((s, i) => s + i.monto, 0);
  const totalGastos = state.gastos.reduce((s, g) => s + g.monto, 0);
  const totalDeudas = state.deudas.reduce((s, d) => s + (d.total - d.pagado), 0);
  const cuotasMes = state.deudas.reduce((s, d) => s + d.cuotaMensual, 0);

  const flujo = totalIngresos - totalGastos - cuotasMes;
  const ratioDeuda = Math.round((cuotasMes / totalIngresos) * 100);
  const ratioAhorro = Math.round((state.ahorros.reduce((s, a) => s + a.actual, 0) / totalIngresos) * 100);

  const barras = [
    { label: "Ingresos", val: totalIngresos, max: totalIngresos, color: COLORS.sage },
    { label: "Gastos", val: totalGastos, max: totalIngresos, color: COLORS.amber },
    { label: "Cuotas", val: cuotasMes, max: totalIngresos, color: COLORS.rose },
    { label: "Libre", val: Math.max(0, flujo), max: totalIngresos, color: COLORS.botanico },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div className="fade-up">
        <h1 className="section-title">Estadísticas</h1>
        <p className="section-subtitle">Una visión clara de tu panorama financiero</p>
      </div>

      <div className="grid-2 fade-up-1">
        <div className="card" style={{ borderTop: `4px solid ${flujo > 0 ? COLORS.sage : COLORS.rose}` }}>
          <p className="metric-label">Flujo neto del mes</p>
          <div style={{ fontFamily: FONTS.display, fontSize: 32, fontWeight: 500, color: flujo > 0 ? COLORS.sage : COLORS.rose, margin: "8px 0 4px" }}>
            {flujo > 0 ? "+" : ""}{fmtSimple(flujo)}
          </div>
          <p style={{ fontSize: 13, color: COLORS.graysoft }}>Ingresos menos todos los egresos</p>
        </div>
        <div className="card">
          <p className="metric-label">Ratio de deuda</p>
          <div style={{ fontFamily: FONTS.display, fontSize: 32, fontWeight: 500, color: ratioDeuda > 40 ? COLORS.rose : COLORS.sage, margin: "8px 0 4px" }}>
            {ratioDeuda}%
          </div>
          <p style={{ fontSize: 13, color: COLORS.graysoft }}>de ingresos comprometidos a deudas</p>
        </div>
      </div>

      <div className="card fade-up-2">
        <p className="metric-label" style={{ marginBottom: 20 }}>Distribución actual del dinero</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {barras.map(b => (
            <div key={b.label}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{b.label}</span>
                <span style={{ fontFamily: FONTS.mono, fontSize: 14 }}>{fmtSimple(b.val)}</span>
              </div>
              <div className="progress-bar" style={{ height: 10 }}>
                <div className="progress-fill" style={{ "--target": `${pct(b.val, b.max)}%`, width: `${pct(b.val, b.max)}%`, background: b.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card fade-up-3" style={{ background: `linear-gradient(135deg, ${COLORS.beige}, ${COLORS.beigeWarm})` }}>
        <p className="metric-label" style={{ marginBottom: 16 }}>Proyección si sigues así</p>
        {flujo > 0 ? (
          <>
            <p style={{ fontFamily: FONTS.display, fontSize: 18, color: COLORS.botanico, marginBottom: 8 }}>
              ✅ Terminarás el mes con superávit de {fmtSimple(flujo)}
            </p>
            <p style={{ fontSize: 14, color: COLORS.graysoft, lineHeight: 1.6 }}>
              Si mantienes este ritmo 12 meses, podrías acumular hasta {fmtSimple(flujo * 12)} adicionales.
              Considera destinar parte a adelantar deudas o incrementar ahorros.
            </p>
          </>
        ) : (
          <>
            <p style={{ fontFamily: FONTS.display, fontSize: 18, color: COLORS.rose, marginBottom: 8 }}>
              ⚠️ Déficit proyectado de {fmtSimple(Math.abs(flujo))}
            </p>
            <p style={{ fontSize: 14, color: COLORS.graysoft, lineHeight: 1.6 }}>
              Necesitas o conseguir un ingreso de al menos {fmtSimple(Math.abs(flujo))} más,
              o reducir gastos variables este mes. Revisa la sección de gastos.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

// ─── CONFIGURACIÓN ─────────────────────────────────────────────────
const Configuracion = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
    <div className="fade-up">
      <h1 className="section-title">Configuración</h1>
      <p className="section-subtitle">Tu espacio, tus reglas</p>
    </div>
    <div className="card fade-up-1">
      <p className="metric-label" style={{ marginBottom: 16 }}>Perfil financiero</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {[
          { label: "Nombre", placeholder: "Tu nombre" },
          { label: "Moneda", placeholder: "COP — Peso colombiano" },
          { label: "Meta de ahorro mensual (%)", placeholder: "15%" },
          { label: "Colchón de emergencia (meses)", placeholder: "3 meses" },
        ].map(f => (
          <div key={f.label}>
            <div className="label">{f.label}</div>
            <input className="input" placeholder={f.placeholder} />
          </div>
        ))}
      </div>
    </div>
    <div className="card fade-up-2">
      <p className="metric-label" style={{ marginBottom: 16 }}>Datos y privacidad</p>
      <p style={{ fontSize: 14, color: COLORS.graysoft, lineHeight: 1.7, marginBottom: 16 }}>
        Todos tus datos se guardan localmente en tu dispositivo. Esta versión no envía información a ningún servidor externo.
      </p>
      <button className="btn btn-ghost" style={{ fontSize: 13, color: COLORS.rose, borderColor: COLORS.rose + "40" }}>
        Limpiar todos los datos
      </button>
    </div>
    <div className="insight-card fade-up-3">
      <p style={{ fontSize: 14, opacity: 0.8, lineHeight: 1.7 }}>
        🌿 <strong>Flore Finanzas</strong> — Versión 1.0<br/>
        Diseñado para personas creativas con ingresos variables.<br/>
        Tu claridad financiera comienza hoy.
      </p>
    </div>
  </div>
);

// ─── APP ROOT ──────────────────────────────────────────────────────
export default function App() {
  const [section, setSection] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [state, setState] = useState(INITIAL_STATE);

  useEffect(() => { injectGlobalStyles(); }, []);

  // Persist to localStorage
  useEffect(() => {
    try { localStorage.setItem("flore_state", JSON.stringify(state)); } catch {}
  }, [state]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("flore_state");
      if (saved) setState(JSON.parse(saved));
    } catch {}
  }, []);

  const handleSection = (s) => { setSection(s); setMobileNav(false); };

  const renderSection = () => {
    const props = { state, setState };
    const sections = {
      dashboard: <Dashboard {...props} />,
      ingresos: <Ingresos {...props} />,
      gastos: <Gastos {...props} />,
      deudas: <Deudas {...props} />,
      ahorros: <Ahorros {...props} />,
      metas: <Metas {...props} />,
      distribucion: <Distribucion {...props} />,
      estadisticas: <Estadisticas {...props} />,
      habitos: <Habitos {...props} />,
      configuracion: <Configuracion />,
    };
    return sections[section] || sections.dashboard;
  };

  return (
    <div className="finanzas-root" style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar desktop */}
      <div style={{ display: "none", "@media(minWidth:768px)": { display: "block" } }}
        className="sidebar-desktop">
      </div>
      <Sidebar active={section} onChange={handleSection} collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main */}
      <main style={{
        flex: 1, overflow: "auto", padding: "32px",
        background: COLORS.cream,
        maxWidth: "100%",
      }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          {renderSection()}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <div style={{
        display: "none",
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: COLORS.white,
        borderTop: `1px solid ${COLORS.graylight}`,
        padding: "8px 0",
        zIndex: 100,
      }} className="mobile-nav">
        {NAV_ITEMS.slice(0, 5).map(item => (
          <button key={item.id} onClick={() => handleSection(item.id)}
            style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              background: "none", border: "none", cursor: "pointer", padding: "6px 0",
              color: section === item.id ? COLORS.botanico : COLORS.graysoft,
              fontSize: 10, fontFamily: FONTS.body,
            }}>
            <Icon name={item.icon} size={20} color={section === item.id ? COLORS.botanico : COLORS.graysoft} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}