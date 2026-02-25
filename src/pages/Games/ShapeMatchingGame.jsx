import React from "react";

/* ═══════════════════════════════════════════════════════════════
   ShapeMatchingGame – Kid-app style (Gấu Discover inspired)
   Bảng gỗ + silhouette holes + 3D shapes bên dưới
   ═══════════════════════════════════════════════════════════════ */

/* ─── Lời động viên ngẫu nhiên ─────────────────────────────────── */
const CHEERS_CORRECT = [
  "Đúng rồi! Giỏi quá!",
  "Tuyệt vời! Con thật thông minh!",
  "Chính xác! Con làm tốt lắm!",
  "Hay quá! Đúng rồi nè!",
  "Xuất sắc! Chuẩn luôn!",
  "Woa! Con giỏi ghê!",
  "Đỉnh của chóp! Đúng rồi!",
  "Con tài lắm! Tiếp tục nha!",
  "Siêu lắm! Đúng rồi đó!",
  "Giỏi lắm con! Cô rất tự hào!",
];
const CHEERS_WRONG = [
  "Sai rồi! Thử lại nha!",
  "Chưa đúng! Cố lên con!",
  "Ố ồ! Nhìn kỹ lại nào!",
  "Gần đúng rồi! Thử lại đi!",
  "Sai rồi! Không sao, thử tiếp nha!",
  "Hãy thử lại! Con làm được mà!",
  "Chưa đúng nè! Cẩn thận hơn nhé!",
  "Ui! Sai rồi! Đừng lo, thử lại!",
  "Sai mất rồi! Nhìn lại hình nào!",
  "Chưa khớp! Thử một lần nữa!",
];
const CHEERS_ROUND = [
  "Tuyệt vời! Đi sang chặng mới nào!",
  "Hoàn hảo! Bước tiếp thôi!",
  "Xuất sắc! Chặng mới đây rồi!",
  "Giỏi quá! Cùng tiếp tục nha!",
  "Siêu tốt! Sẵn sàng chưa nào!",
];
function randomPick(arr) { return arr[(Math.random() * arr.length) | 0]; }

/* ─── TTS helper – đọc tiếng Việt qua Google TTS proxy ────────── */
function speakVietnamese(text) {
  if (!text) return;
  const str = String(text).slice(0, 200);

  // 1. ResponsiveVoice (nếu có)
  if (window.responsiveVoice) {
    window.responsiveVoice.cancel();
    window.responsiveVoice.speak(str, "Vietnamese Female", { rate: 0.9 });
    return;
  }

  // 2. Google TTS qua Vite proxy /api/tts (bypass CORS)
  const params = new URLSearchParams({ ie: "UTF-8", q: str, tl: "vi", client: "tw-ob", ttsspeed: "0.8" });
  fetch(`/api/tts?${params}`)
    .then(r => { if (!r.ok) throw new Error(r.status); return r.blob(); })
    .then(blob => {
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.onended = () => URL.revokeObjectURL(url);
      audio.play().catch(() => _speakWebFallback(str));
    })
    .catch(() => _speakWebFallback(str));
}

function _speakWebFallback(str) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(str);
  utt.lang = "vi-VN";
  utt.rate = 0.9;
  window.speechSynthesis.speak(utt);
}

/* ─── Clap / cheer sound via AudioContext ─────────────────────── */
function playClap() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    // 3 quick claps
    [0, 0.15, 0.3].forEach((t) => {
      const buf = ctx.createBuffer(1, ctx.sampleRate * 0.08, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 3);
      }
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.5, ctx.currentTime + t);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + t + 0.08);
      src.connect(gain).connect(ctx.destination);
      src.start(ctx.currentTime + t);
    });
  } catch (e) {
    console.warn("Clap sound error:", e);
  }
}

/* ─── CSS animations ──────────────────────────────────────────── */
const CSS = `
  @keyframes bobY      { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  @keyframes pop       { 0%{transform:scale(.2);opacity:0} 65%{transform:scale(1.15)} 100%{transform:scale(1);opacity:1} }
  @keyframes wiggle    { 0%,100%{transform:rotate(-5deg)} 50%{transform:rotate(5deg)} }
  @keyframes spinSlow  { from{transform:rotate(0)} to{transform:rotate(360deg)} }
  @keyframes floatUp   { 0%{transform:translateY(0) scale(1);opacity:1} 100%{transform:translateY(-80px) scale(.3);opacity:0} }
  @keyframes pulse     { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
  @keyframes sway      { 0%,100%{transform:rotate(-4deg)} 50%{transform:rotate(4deg)} }
  @keyframes drift     { 0%,100%{transform:translateX(0)} 50%{transform:translateX(20px)} }
  @keyframes slideUp   { from{transform:translateY(40px);opacity:0} to{transform:translateY(0);opacity:1} }
  @keyframes snapIn    { 0%{transform:scale(0);opacity:0} 50%{transform:scale(1.3)} 100%{transform:scale(1);opacity:1} }
  @keyframes stars     { 0%{opacity:1;transform:translate(var(--sx),var(--sy)) scale(1)}
                         100%{opacity:0;transform:translate(calc(var(--sx)*3),calc(var(--sy)*3)) scale(0)} }
  @keyframes glowPulse { 0%,100%{box-shadow:0 0 0 0 rgba(250,204,21,.4)} 50%{box-shadow:0 0 0 12px rgba(250,204,21,0)} }
  @keyframes pinwheel  { from{transform:rotate(0)} to{transform:rotate(360deg)} }

  .bob    { animation: bobY 2.4s ease-in-out infinite; }
  .pop    { animation: pop .45s cubic-bezier(.34,1.56,.64,1) both; }
  .wiggle { animation: wiggle 1.6s ease-in-out infinite; }
  .pulse  { animation: pulse 2s ease-in-out infinite; }
  .sway   { animation: sway 2.8s ease-in-out infinite; }
  .drift  { animation: drift 8s ease-in-out infinite; }
  .slideUp{ animation: slideUp .5s ease both; }
  .snapIn { animation: snapIn .4s cubic-bezier(.34,1.56,.64,1) both; }
`;

/* ─── Shape SVG paths ─────────────────────────────────────────── */
const SHAPE_SVG = {
  circle: (sz) => <circle cx={sz / 2} cy={sz / 2} r={sz * .38} />,
  square: (sz) => <rect x={sz * .14} y={sz * .14} width={sz * .72} height={sz * .72} />,
  triangle: (sz) => <path d={`M${sz / 2} ${sz * .08}L${sz * .9} ${sz * .88}L${sz * .1} ${sz * .88}Z`} />,
  rectangle: (sz) => <rect x={sz * .08} y={sz * .24} width={sz * .84} height={sz * .52} />,
  pentagon: (sz) => { const c = sz / 2, r = sz * .38; const pts = Array.from({ length: 5 }, (_, i) => { const a = Math.PI * 2 / 5 * i - Math.PI / 2; return `${c + r * Math.cos(a)},${c + r * Math.sin(a)}` }); return <polygon points={pts.join(' ')} />; },
  star: (sz) => { const c = sz / 2, R = sz * .4, r2 = sz * .18; const pts = Array.from({ length: 10 }, (_, i) => { const a = Math.PI * 2 / 10 * i - Math.PI / 2, rad = i % 2 === 0 ? R : r2; return `${c + rad * Math.cos(a)},${c + rad * Math.sin(a)}` }); return <polygon points={pts.join(' ')} />; },
  diamond: (sz) => <polygon points={`${sz / 2},${sz * .06} ${sz * .92},${sz / 2} ${sz / 2},${sz * .94} ${sz * .08},${sz / 2}`} />,
  heart: (sz) => <path d={`M${sz / 2} ${sz * .82}C${sz * .08} ${sz * .54} ${sz * .06} ${sz * .2} ${sz * .28} ${sz * .15}C${sz * .42} ${sz * .1} ${sz / 2} ${sz * .22} ${sz / 2} ${sz * .22}C${sz / 2} ${sz * .22} ${sz * .58} ${sz * .1} ${sz * .72} ${sz * .15}C${sz * .94} ${sz * .2} ${sz * .92} ${sz * .54} ${sz / 2} ${sz * .82}Z`} />,
};

/* ─── Colour config per shape (3D-ish) ────────────────────────── */
const SHAPE_COLORS = [
  { fill: "#FBBF24", fillDark: "#D97706", stroke: "#92400E", glow: "rgba(251,191,36,.6)", silhouette: "rgba(160,140,100,.4)" },
  { fill: "#34D399", fillDark: "#059669", stroke: "#065F46", glow: "rgba(52,211,153,.6)", silhouette: "rgba(100,140,110,.4)" },
  { fill: "#F87171", fillDark: "#DC2626", stroke: "#7F1D1D", glow: "rgba(248,113,113,.6)", silhouette: "rgba(150,110,100,.4)" },
  { fill: "#60A5FA", fillDark: "#2563EB", stroke: "#1E3A8A", glow: "rgba(96,165,250,.6)", silhouette: "rgba(100,120,150,.4)" },
  { fill: "#A78BFA", fillDark: "#7C3AED", stroke: "#4C1D95", glow: "rgba(167,139,250,.6)", silhouette: "rgba(130,110,150,.4)" },
];

const SHAPE_NAMES = {
  circle: "Hình tròn", square: "Hình vuông", triangle: "Tam giác",
  rectangle: "Chữ nhật", pentagon: "Ngũ giác", star: "Ngôi sao",
  diamond: "Kim cương", heart: "Trái tim",
};

/* ─── Helpers ─────────────────────────────────────────────────── */
function shuffle(arr) {
  const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0;[a[i], a[j]] = [a[j], a[i]]; } return a;
}

function normalizeQuestion(q) {
  if (Array.isArray(q?.pairs) && q.pairs.length >= 2)
    return q.pairs.slice(0, 4).map((p, i) => ({ id: String(p.id ?? `p${i}`), shape: String(p.shape) }));
  const opts = Array.isArray(q?.options) ? q.options.map(String) : [];
  const uniq = Array.from(new Set([String(q?.targetShape ?? ""), ...opts].filter(Boolean))).slice(0, 4);
  if (uniq.length >= 2) return uniq.map((s, i) => ({ id: `p${i}`, shape: s }));
  return null;
}

/* ─── Pinwheel decoration ─────────────────────────────────────── */
function Pinwheel({ left, bottom, size = 50, speed = "3s" }) {
  const s = size;
  const colors = ["#F87171", "#60A5FA", "#34D399", "#FBBF24"];
  return (
    <div style={{ position: "absolute", left, bottom, width: s, pointerEvents: "none", zIndex: 3 }}>
      {/* Stick */}
      <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 4, height: s * 1.6, background: "linear-gradient(to bottom,#D97706,#92400E)", borderRadius: 4 }} />
      {/* Blades */}
      <div style={{ position: "relative", width: s, height: s, animation: `pinwheel ${speed} linear infinite` }}>
        {colors.map((c, i) => (
          <div key={i} style={{
            position: "absolute", top: "50%", left: "50%", width: s * .42, height: s * .42,
            background: `linear-gradient(135deg,${c},${c}88)`,
            borderRadius: i % 2 === 0 ? "0 50% 50% 0" : "50% 0 0 50%",
            transformOrigin: "0 0",
            transform: `rotate(${i * 90}deg)`,
            opacity: .9,
          }} />
        ))}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 8, height: 8, borderRadius: "50%", background: "#fff", border: "2px solid #D97706" }} />
      </div>
    </div>
  );
}

/* ─── Decorative crystals ─────────────────────────────────────── */
function Crystal({ left, bottom, color = "#C084FC", size = 24 }) {
  return (
    <div style={{ position: "absolute", left, bottom, pointerEvents: "none", zIndex: 2 }}>
      <svg width={size} height={size * 1.6} viewBox="0 0 24 38">
        <polygon points="12,0 22,14 18,38 6,38 2,14" fill={color} opacity=".8" />
        <polygon points="12,0 22,14 12,12" fill="rgba(255,255,255,.3)" />
      </svg>
    </div>
  );
}

/* ─── Cloud ───────────────────────────────────────────────────── */
function Cloud({ top, left, size = 90, delay = "0s" }) {
  return (
    <div className="drift" style={{ position: "absolute", top, left, animationDelay: delay, pointerEvents: "none", opacity: .85 }}>
      <div style={{ position: "relative", width: size, height: size * .4 }}>
        {[[.08, .05, .38, .42], [.28, -.14, .46, .5], [.62, -.06, .3, .32]].map(([lf, tf, wf, hf], j) => (
          <div key={j} style={{ position: "absolute", left: lf * size, top: tf * size, width: wf * size, height: hf * size, borderRadius: "50%", background: "rgba(255,255,255,.9)", boxShadow: "0 2px 8px rgba(0,0,0,.05)" }} />
        ))}
        <div style={{ width: "100%", height: size * .38, borderRadius: 999, background: "rgba(255,255,255,.88)" }} />
      </div>
    </div>
  );
}

/* ─── Stars decorations ───────────────────────────────────────── */
function FloatingStars() {
  return <>
    {["⭐", "✨", "🌟", "💫", "⭐", "✨", "🌟"].map((s, i) => (
      <div key={i} className="sway" style={{ position: "absolute", top: `${8 + i * 11}%`, left: `${5 + i * 13}%`, fontSize: 12 + i % 3 * 4, opacity: .6, pointerEvents: "none", animationDelay: `${i * .6}s`, userSelect: "none" }}>{s}</div>
    ))}
  </>;
}

/* ─── Grass & ground ──────────────────────────────────────────── */
function Ground() {
  return (
    <>
      {/* Hills */}
      <div style={{ position: "absolute", bottom: 50, left: "-5%", width: "45%", height: 80, borderRadius: "50% 50% 0 0", background: "linear-gradient(to bottom,#86EFAC,#22C55E)" }} />
      <div style={{ position: "absolute", bottom: 50, right: "-5%", width: "55%", height: 100, borderRadius: "50% 50% 0 0", background: "linear-gradient(to bottom,#4ADE80,#16A34A)" }} />
      {/* Main grass */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 60, background: "linear-gradient(to bottom,#22C55E,#15803D)" }} />
      {/* Grass blades */}
      {Array.from({ length: 22 }, (_, i) => (
        <div key={i} style={{ position: "absolute", bottom: 52, left: `${i * 4.6 + .5}%`, width: 12, height: 22 + (i * 9) % 18, background: `linear-gradient(to top,#15803D,${i % 3 === 0 ? "#86EFAC" : "#4ADE80"})`, borderRadius: "50% 50% 0 0", transform: `rotate(${i % 2 === 0 ? -10 : 10}deg)` }} />
      ))}
      {/* Bushes */}
      {[5, 30, 65, 88].map((l, i) => (
        <div key={i} style={{ position: "absolute", bottom: 48, left: `${l}%`, width: 40 + i * 8, height: 20 + i * 4, borderRadius: "50% 50% 20% 20%", background: "linear-gradient(to bottom,#4ADE80,#16A34A)", opacity: .8 }} />
      ))}
    </>
  );
}

/* ─── Flag bunting ────────────────────────────────────────────── */
function Bunting() {
  const flags = ["#F87171", "#FBBF24", "#34D399", "#60A5FA", "#A78BFA", "#F472B6", "#FBBF24", "#34D399"];
  return (
    <div style={{ position: "absolute", top: "15%", left: "8%", right: "8%", height: 40, pointerEvents: "none", zIndex: 4 }}>
      <svg width="100%" height="40" viewBox="0 0 600 40" preserveAspectRatio="none">
        <path d="M0,8 Q150,28 300,8 Q450,28 600,8" fill="none" stroke="#92400E" strokeWidth="2.5" opacity=".6" />
        {flags.map((c, i) => {
          const x = 30 + i * 77;
          return <polygon key={i} points={`${x},10 ${x + 14},10 ${x + 7},30`} fill={c} opacity=".75" />;
        })}
      </svg>
    </div>
  );
}

/* ─── Wooden board with silhouette holes ──────────────────────── */
function WoodenBoard({ pairs, colorMap, placed, selectedId, onSlotClick }) {
  const count = pairs.length;
  return (
    <div style={{
      position: "relative", zIndex: 10, margin: "0 auto",
      width: "92%", maxWidth: 560,
      borderRadius: 22,
      background: "linear-gradient(160deg,#DEB887,#D2A96A)",
      border: "6px solid #8B6914",
      boxShadow: "inset 0 4px 16px rgba(139,105,20,.3), 0 12px 40px rgba(0,0,0,.25), 0 2px 0 #A67C00",
      padding: "20px 16px 16px",
    }}>
      {/* Wood grain texture */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: 16, opacity: .15,
        backgroundImage: "repeating-linear-gradient(90deg,transparent,transparent 30px,rgba(139,105,20,.3) 30px,rgba(139,105,20,.3) 31px)",
      }} />
      {/* Board nails */}
      {[[8, 8], [8, "auto", 8, undefined], [undefined, 8, undefined, 8], [undefined, "auto", undefined, 8]].map((pos, i) => {
        const style = { position: "absolute", width: 10, height: 10, borderRadius: "50%", background: "radial-gradient(circle,#C0C0C0,#808080)", boxShadow: "inset 0 1px 2px rgba(255,255,255,.6), 0 1px 3px rgba(0,0,0,.3)" };
        if (i === 0) Object.assign(style, { top: 8, left: 8 });
        if (i === 1) Object.assign(style, { top: 8, right: 8 });
        if (i === 2) Object.assign(style, { bottom: 8, left: 8 });
        if (i === 3) Object.assign(style, { bottom: 8, right: 8 });
        return <div key={i} style={style} />;
      })}

      {/* Title plaque */}
      <div style={{ position: "absolute", top: -20, left: "50%", transform: "translateX(-50%)", zIndex: 15 }}>
        <div style={{
          background: "linear-gradient(135deg,#60A5FA,#3B82F6)",
          borderRadius: 30, padding: "8px 28px",
          border: "3px solid #1D4ED8",
          boxShadow: "0 6px 20px rgba(59,130,246,.5)",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{ fontSize: 20 }}>🎨</span>
          <span style={{ fontWeight: 900, fontSize: 16, color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,.3)" }}>NỐI HÌNH</span>
        </div>
      </div>

      {/* Shape silhouette slots */}
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${count},1fr)`,
        gap: 12, marginTop: 10, position: "relative", zIndex: 5,
      }}>
        {pairs.map((p, i) => {
          const isPlaced = placed.has(p.id);
          const color = colorMap[i];
          const shapeKey = (p.shape || "").toLowerCase();
          const pathFn = SHAPE_SVG[shapeKey] || SHAPE_SVG.square;
          const slotSize = count <= 3 ? 90 : 75;

          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSlotClick(p.id)}
              disabled={isPlaced}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: "100%", aspectRatio: "1",
                borderRadius: 18,
                background: isPlaced ? "transparent" : "rgba(180,160,120,.35)",
                border: isPlaced ? "none" : `3px dashed rgba(139,105,20,.4)`,
                boxShadow: isPlaced ? "none" : "inset 0 4px 12px rgba(0,0,0,.15)",
                cursor: isPlaced ? "default" : selectedId ? "pointer" : "default",
                transition: "all .25s",
                position: "relative",
                padding: 0,
                ...(selectedId && !isPlaced ? { animation: "glowPulse 1.5s infinite" } : {}),
              }}
            >
              {isPlaced ? (
                /* Placed shape — full color */
                <div className="snapIn" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width={slotSize} height={slotSize} viewBox={`0 0 ${slotSize} ${slotSize}`} style={{ filter: `drop-shadow(0 4px 8px ${color.glow})` }}>
                    <defs>
                      <linearGradient id={`g3d_${p.id}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={color.fill} />
                        <stop offset="100%" stopColor={color.fillDark} />
                      </linearGradient>
                    </defs>
                    <g fill={`url(#g3d_${p.id})`} stroke={color.stroke} strokeWidth={slotSize * .06} strokeLinejoin="round">
                      {pathFn(slotSize)}
                    </g>
                    {/* Shine highlight */}
                    <ellipse cx={slotSize * .38} cy={slotSize * .32} rx={slotSize * .12} ry={slotSize * .08} fill="rgba(255,255,255,.45)" transform={`rotate(-20 ${slotSize * .38} ${slotSize * .32})`} />
                  </svg>
                </div>
              ) : (
                /* Silhouette hole */
                <svg width={slotSize} height={slotSize} viewBox={`0 0 ${slotSize} ${slotSize}`} style={{ opacity: .5 }}>
                  <g fill={color.silhouette} stroke="rgba(139,105,20,.3)" strokeWidth={2} strokeLinejoin="round">
                    {pathFn(slotSize)}
                  </g>
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── 3D Shape piece (bottom tray) ────────────────────────────── */
function ShapePiece({ shape, color, selected, used, onClick, index }) {
  const shapeKey = (shape || "").toLowerCase();
  const pathFn = SHAPE_SVG[shapeKey] || SHAPE_SVG.square;
  const sz = 70;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={used}
      className="pop"
      style={{
        animationDelay: `${index * 100}ms`,
        border: "none", background: "transparent", cursor: used ? "default" : "pointer",
        padding: 0, position: "relative",
        transform: selected ? "scale(1.2) translateY(-14px)" : used ? "scale(.7)" : "scale(1)",
        opacity: used ? .3 : 1,
        transition: "transform .3s cubic-bezier(.34,1.56,.64,1), opacity .3s",
        filter: selected ? `drop-shadow(0 8px 20px ${color.glow})` : `drop-shadow(0 4px 10px rgba(0,0,0,.2))`,
      }}
    >
      <svg width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`}>
        <defs>
          <linearGradient id={`piece_${shapeKey}_${index}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={color.fill} />
            <stop offset="100%" stopColor={color.fillDark} />
          </linearGradient>
        </defs>
        <g fill={`url(#piece_${shapeKey}_${index})`} stroke={color.stroke} strokeWidth={sz * .07} strokeLinejoin="round">
          {pathFn(sz)}
        </g>
        {/* 3D shine */}
        <ellipse cx={sz * .36} cy={sz * .3} rx={sz * .1} ry={sz * .07} fill="rgba(255,255,255,.5)" transform={`rotate(-25 ${sz * .36} ${sz * .3})`} />
      </svg>

      {/* Selection ring */}
      {selected && (
        <div style={{
          position: "absolute", inset: -6, borderRadius: "50%",
          border: "3px solid #FBBF24",
          boxShadow: `0 0 0 4px rgba(251,191,36,.3)`,
          animation: "glowPulse 1.2s infinite",
        }} />
      )}
    </button>
  );
}

/* ─── Toast ───────────────────────────────────────────────────── */
function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className="pop" style={{
      position: "fixed", top: 24, left: "50%", transform: "translateX(-50%)",
      zIndex: 9999, borderRadius: 40, padding: "12px 28px",
      fontWeight: 900, fontSize: 17, color: "#fff",
      background: toast.ok ? "linear-gradient(135deg,#10B981,#059669)" : "linear-gradient(135deg,#EF4444,#DC2626)",
      boxShadow: toast.ok ? "0 10px 36px rgba(16,185,129,.6)" : "0 10px 36px rgba(239,68,68,.6)",
      pointerEvents: "none", userSelect: "none", whiteSpace: "nowrap",
    }}>
      {toast.text}
    </div>
  );
}

/* ─── StarBurst on correct ────────────────────────────────────── */
function StarBurst({ x, y }) {
  const items = ["⭐", "✨", "🌟", "💛", "⭐", "✨", "🌟", "💫"];
  return (
    <div style={{ position: "absolute", left: x, top: y, pointerEvents: "none", zIndex: 30 }}>
      {items.map((s, i) => {
        const angle = (i / items.length) * 360, rad = angle * Math.PI / 180;
        return (
          <div key={i} style={{
            position: "absolute", fontSize: 16, lineHeight: 1,
            "--sx": `${Math.cos(rad) * 50}px`, "--sy": `${Math.sin(rad) * 50}px`,
            animation: `stars .8s ease-out ${i * .06}s both`,
          }}>{s}</div>
        );
      })}
    </div>
  );
}

/* ─── Confetti (victory) ──────────────────────────────────────── */
function Confetti() {
  const ps = React.useMemo(() => Array.from({ length: 30 }, (_, i) => ({
    id: i, e: ["🌟", "🎉", "✨", "⭐", "🎊", "💜", "🌈", "🍀", "🎈", "💛"][i % 10],
    l: `${(i * 3.4 + 1) % 96}%`, dur: `${.55 + (i % 5) * .2}s`, d: `${(i % 8) * .07}s`,
  })), []);
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: 28, pointerEvents: "none", zIndex: 40 }}>
      {ps.map(p => (
        <div key={p.id} style={{ position: "absolute", top: 0, left: p.l, fontSize: 24, animation: `floatUp ${p.dur} ease-in ${p.d} infinite` }}>{p.e}</div>
      ))}
    </div>
  );
}

/* ─── Victory overlay ─────────────────────────────────────────── */
function VictoryOverlay({ correct, total, onReplay, onExit }) {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 28, background: "rgba(0,0,0,.45)", backdropFilter: "blur(8px)" }}>
      <Confetti />
      <div className="pop" style={{ position: "relative", zIndex: 60, margin: "0 16px", width: "100%", maxWidth: 300, textAlign: "center", borderRadius: 32, padding: "36px 24px", background: "linear-gradient(160deg,#FEF3C7,#FFFDE7)", border: "4px solid #F59E0B", boxShadow: "0 24px 64px rgba(0,0,0,.3)" }}>
        <div className="bob" style={{ fontSize: 72 }}>🏆</div>
        <h2 style={{ fontSize: 28, fontWeight: 900, color: "#B45309", margin: "10px 0 4px" }}>Giỏi Lắm! 🎉</h2>
        <p style={{ fontWeight: 700, color: "#92400E", fontSize: 15 }}>
          Đúng <span style={{ color: "#10B981", fontWeight: 900, fontSize: 22 }}>{correct}/{total}</span> câu!
        </p>
        <div style={{ fontSize: 36, margin: "14px 0", letterSpacing: 6 }}>🎨🌟🌈🎊</div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onReplay} style={{ flex: 1, borderRadius: 22, padding: "12px", fontWeight: 900, fontSize: 15, color: "#fff", border: "none", cursor: "pointer", background: "linear-gradient(135deg,#22C55E,#16A34A)", boxShadow: "0 6px 24px rgba(34,197,94,.45)" }}>🔄 Chơi lại</button>
          <button onClick={onExit} style={{ flex: 1, borderRadius: 22, padding: "12px", fontWeight: 900, fontSize: 15, color: "#374151", background: "#F9FAFB", border: "2.5px solid #E5E7EB", cursor: "pointer", boxShadow: "0 4px 14px rgba(0,0,0,.1)" }}>🏠 Về nhà</button>
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═════════════════════════════════════════════════════════════════ */
export default function ShapeMatchingGame({ game, config, onExit, onFinish }) {
  const questions = Array.isArray(config?.questions) ? config.questions : [];
  const totalQuestions = questions.length || 0;

  const [idx, setIdx] = React.useState(0);
  const [correct, setCorrect] = React.useState(0);
  const [done, setDone] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState(null);
  const [placed, setPlaced] = React.useState(new Set());
  const [toast, setToast] = React.useState(null);
  const [bursts, setBursts] = React.useState([]);
  const startAtRef = React.useRef(Date.now());

  const q = questions[idx];
  const pairs = normalizeQuestion(q);

  // Assign colours & shuffle bottom pieces
  const { colorMap, bottomPieces } = React.useMemo(() => {
    if (!pairs) return { colorMap: [], bottomPieces: [] };
    const cm = pairs.map((_, i) => SHAPE_COLORS[i % SHAPE_COLORS.length]);
    const bp = shuffle(pairs.map((p, i) => ({ ...p, colorIdx: i })));
    return { colorMap: cm, bottomPieces: bp };
  }, [idx, q]);

  // Reset on round change
  React.useEffect(() => { setSelectedId(null); setPlaced(new Set()); setToast(null); setBursts([]); }, [idx]);

  const showToast = (text, ok) => {
    setToast({ text, ok });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 1200);
  };

  // Select a shape piece from bottom
  const onSelectPiece = (id) => {
    if (placed.has(id)) return;
    setSelectedId(cur => cur === id ? null : id);
  };

  // Click a slot on the board
  const onSlotClick = (slotId) => {
    if (!selectedId || placed.has(slotId)) return;
    const ok = String(selectedId) === String(slotId);

    if (ok) {
      const newPlaced = new Set(placed);
      newPlaced.add(slotId);
      setPlaced(newPlaced);
      setSelectedId(null);
      const cheerOk = randomPick(CHEERS_CORRECT);
      showToast(`🎉 ${cheerOk}`, true);
      setBursts(bs => [...bs, { id: Date.now(), slotId }]);

      // 🔊 Audio động viên + vỗ tay
      speakVietnamese(cheerOk);
      playClap();

      // Check if all placed → chuyển chặng mới
      if (pairs && newPlaced.size >= pairs.length) {
        const newCorrect = correct + 1;
        setCorrect(newCorrect);
        setTimeout(() => {
          // 🔊 Hoàn thành chặng
          const roundCheer = randomPick(CHEERS_ROUND);
          speakVietnamese(roundCheer);
          setTimeout(() => {
            if (idx + 1 < totalQuestions) {
              setIdx(x => x + 1);
            } else {
              setDone(true);
              onFinish?.({ correctAnswers: newCorrect, totalQuestions, playDurations: Math.floor((Date.now() - startAtRef.current) / 1000) });
            }
          }, 1200);
        }, 1000);
      }
    } else {
      const cheerWrong = randomPick(CHEERS_WRONG);
      showToast(`❌ ${cheerWrong}`, false);
      setSelectedId(null);
      // 🔊 Audio an ủi
      speakVietnamese(cheerWrong);
    }
  };

  const reset = () => {
    setIdx(0); setCorrect(0); setDone(false); setSelectedId(null);
    setPlaced(new Set()); setToast(null); setBursts([]);
    startAtRef.current = Date.now();
  };

  return (
    <>
      <style>{CSS}</style>
      <Toast toast={toast} />

      <div style={{ position: "relative", overflow: "hidden", borderRadius: 28, minHeight: 600, display: "flex", flexDirection: "column" }}>

        {/* ─── Sky gradient background ─── */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #7B2D8E 0%, #9B59B6 12%, #6B9BD2 30%, #87CEEB 50%, #87CEEB 65%, #22C55E 100%)" }} />
        {/* Atmosphere glow */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 75% 10%,rgba(255,200,50,.15) 0%,transparent 50%)" }} />

        {/* Decorations */}
        <Cloud top="4%" left="5%" size={100} delay="0s" />
        <Cloud top="8%" left="55%" size={75} delay="3s" />
        <Cloud top="3%" left="80%" size={60} delay="1.5s" />
        <FloatingStars />
        <Bunting />
        <Ground />

        {/* Pinwheels */}
        <Pinwheel left="4%" bottom={70} size={32} speed="2.5s" />
        <Pinwheel left="88%" bottom={80} size={40} speed="3.5s" />
        <Pinwheel left="48%" bottom={65} size={26} speed="2s" />

        {/* Crystals */}
        <Crystal left="12%" bottom={62} color="#C084FC" size={18} />
        <Crystal left="78%" bottom={58} color="#F472B6" size={22} />
        <Crystal left="35%" bottom={55} color="#67E8F9" size={16} />
        <Crystal left="62%" bottom={62} color="#C084FC" size={20} />

        {/* ─── Content ─── */}
        <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", flex: 1, padding: "14px 14px 0" }}>

          {/* Header bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.85)", borderRadius: 22, padding: "7px 16px", fontWeight: 900, fontSize: 14, color: "#6D28D9", boxShadow: "0 4px 14px rgba(0,0,0,.15)", backdropFilter: "blur(6px)" }}>
              🔮 {game?.name || "Ghép Hình Vui Vẻ"}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {/* Progress */}
              <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                {Array.from({ length: totalQuestions }).map((_, i) => (
                  <div key={i} style={{ width: i === idx ? 14 : 10, height: i === idx ? 14 : 10, borderRadius: "50%", background: i < idx ? "#22C55E" : i === idx ? "#FBBF24" : "rgba(255,255,255,.5)", border: "2.5px solid rgba(255,255,255,.8)", boxShadow: i === idx ? "0 0 0 4px rgba(251,191,36,.4)" : "none", transition: "all .3s" }} />
                ))}
              </div>
              <button onClick={onExit} style={{ width: 38, height: 38, borderRadius: 12, fontWeight: 900, fontSize: 18, color: "#fff", background: "linear-gradient(135deg,#A855F7,#7C3AED)", border: "2px solid #6D28D9", boxShadow: "0 4px 14px rgba(124,58,237,.5)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                ✕
              </button>
            </div>
          </div>

          {!pairs ? (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ background: "rgba(255,255,255,.9)", borderRadius: 24, padding: "28px 36px", textAlign: "center" }}>
                <div style={{ fontSize: 44 }}>🔮</div>
                <p style={{ fontWeight: 700, color: "#374151" }}>Chưa có dữ liệu!</p>
              </div>
            </div>
          ) : (
            <>
              {/* Wooden board */}
              <div style={{ flex: 0, marginTop: 16, marginBottom: 12 }}>
                <WoodenBoard
                  pairs={pairs}
                  colorMap={colorMap}
                  placed={placed}
                  selectedId={selectedId}
                  onSlotClick={onSlotClick}
                />
              </div>

              {/* Instruction hint */}
              <div className="slideUp" style={{ textAlign: "center", margin: "4px 0 8px" }}>
                <span style={{ background: "rgba(255,255,255,.85)", borderRadius: 20, padding: "6px 18px", fontWeight: 800, fontSize: 13, color: "#374151", boxShadow: "0 3px 10px rgba(0,0,0,.1)" }}>
                  {selectedId
                    ? "👆 Bây giờ bấm vào ô bóng phù hợp trên bảng!"
                    : "👇 Chọn một hình bên dưới rồi ghép vào bảng!"}
                </span>
              </div>

              {/* Bottom tray (dark) with 3D shape pieces */}
              <div style={{
                position: "relative", zIndex: 10,
                margin: "auto 8px 80px",
                borderRadius: 24,
                background: "linear-gradient(160deg,rgba(15,23,42,.85),rgba(30,41,59,.9))",
                border: "3px solid rgba(100,116,139,.4)",
                boxShadow: "0 -4px 20px rgba(0,0,0,.2), inset 0 2px 10px rgba(0,0,0,.3)",
                padding: "16px 12px",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "wrap",
                backdropFilter: "blur(8px)",
              }}>
                {/* Sparkle dots */}
                {[10, 25, 45, 65, 85].map((l, i) => (
                  <div key={i} style={{ position: "absolute", top: `${20 + i * 12}%`, left: `${l}%`, width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,.4)", animation: `pulse ${2 + i * .3}s ease-in-out infinite` }} />
                ))}

                {bottomPieces.map((p, i) => (
                  <ShapePiece
                    key={p.id}
                    shape={p.shape}
                    color={colorMap[p.colorIdx]}
                    selected={selectedId === p.id}
                    used={placed.has(p.id)}
                    onClick={() => onSelectPiece(p.id)}
                    index={i}
                  />
                ))}
              </div>

              {/* Score badge */}
              <div style={{
                position: "absolute", bottom: 14, left: 14, zIndex: 15,
                background: "rgba(255,255,255,.9)", borderRadius: 20, padding: "6px 14px",
                fontWeight: 900, fontSize: 13, color: "#374151",
                boxShadow: "0 4px 14px rgba(0,0,0,.15)",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                ✅ Đúng: <span style={{ color: "#10B981", fontSize: 16 }}>{correct}</span>
              </div>

              {/* Placed counter */}
              <div style={{
                position: "absolute", bottom: 14, right: 14, zIndex: 15,
                background: "rgba(255,255,255,.9)", borderRadius: 20, padding: "6px 14px",
                fontWeight: 900, fontSize: 13, color: "#374151",
                boxShadow: "0 4px 14px rgba(0,0,0,.15)",
              }}>
                🧩 {placed.size}/{pairs.length}
              </div>
            </>
          )}
        </div>

        {done && <VictoryOverlay correct={correct} total={totalQuestions} onReplay={reset} onExit={onExit} />}
      </div>
    </>
  );
}
