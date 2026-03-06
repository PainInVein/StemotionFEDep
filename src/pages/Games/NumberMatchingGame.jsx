import React from "react";

/* ─── Lời động viên ngẫu nhiên ──────────────────────────── */
const CHEERS_OK = [
  "Đúng rồi! Giỏi lắm!",
  "Tuyệt vời! Con thông minh quá!",
  "Chính xác! Làm tốt lắm!",
  "Hay quá! Đúng rồi nè!",
  "Xuất sắc! Chuẩn luôn!",
  "Woa! Con giỏi ghê!",
  "Đỉnh của chóp! Đúng rồi!",
  "Siêu lắm! Tiếp tục nha!",
  "Con tài lắm! Đúng rồi đó!",
  "Giỏi lắm con! Cô rất tự hào!",
];
const CHEERS_FAIL = [
  "Sai rồi! Đếm lại nha!",
  "Chưa đúng! Cố lên con!",
  "Ố ồ! Nhìn kỹ lại nào!",
  "Gần đúng rồi! Thử lại đi!",
  "Sai rồi! Không sao, thử tiếp nha!",
  "Hãy thử lại! Con làm được mà!",
  "Chưa đúng nè! Đếm cẩn thận hơn nhé!",
  "Ui! Sai rồi! Đừng lo!",
  "Sai mất rồi! Đếm lại nào!",
  "Chưa khớp! Thử một lần nữa!",
];
function randomPick(arr) { return arr[(Math.random() * arr.length) | 0]; }

/* ─── Simple TTS helper (Vietnamese) ─────────────────────── */
function speakVI(text) {
  if (!text) return;
  const str = String(text).slice(0, 200);

  // 1) ResponsiveVoice (giọng tự nhiên nhất)
  if (window.responsiveVoice) {
    window.responsiveVoice.cancel();
    window.responsiveVoice.speak(str, "Vietnamese Female", { rate: 0.9 });
    return;
  }

  // 2) Google TTS qua Vite proxy /api/tts (bypass CORS)
  const params = new URLSearchParams({ ie: "UTF-8", q: str, tl: "vi", client: "tw-ob", ttsspeed: "0.8" });
  fetch(`/api/tts?${params}`)
    .then(r => { if (!r.ok) throw new Error(r.status); return r.blob(); })
    .then(blob => {
      const blobUrl = URL.createObjectURL(blob);
      const audio = new Audio(blobUrl);
      audio.onended = () => URL.revokeObjectURL(blobUrl);
      audio.play().catch(() => speakWebSpeech(str));
    })
    .catch(() => speakWebSpeech(str));
}

function speakWebSpeech(str) {
  if (!window.speechSynthesis) return;
  const utt = new SpeechSynthesisUtterance(str);
  utt.lang = "vi-VN"; // trình duyệt tự chọn giọng
  utt.rate = 0.9;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utt);
}

/* ─── Utils ─────────────────────────────────────────────── */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ─── Animal sets ─────────────────────────────────────────── */
const ANIMAL_SETS = [
  { emoji: "🐥", name: "gà", card: "#FFFDE7", rim: "#F59E0B", rimDark: "#D97706", text: "#92400E", glow: "rgba(245,158,11,.5)" },
  { emoji: "🐷", name: "heo", card: "#FFF0F6", rim: "#EC4899", rimDark: "#DB2777", text: "#9D174D", glow: "rgba(236,72,153,.5)" },
  { emoji: "🐑", name: "cừu", card: "#EFF6FF", rim: "#3B82F6", rimDark: "#2563EB", text: "#1E3A8A", glow: "rgba(59,130,246,.5)" },
  { emoji: "🐸", name: "ếch", card: "#F0FDF4", rim: "#22C55E", rimDark: "#16A34A", text: "#14532D", glow: "rgba(34,197,94,.5)" },
  { emoji: "🐰", name: "thỏ", card: "#FAF5FF", rim: "#A855F7", rimDark: "#7C3AED", text: "#4C1D95", glow: "rgba(168,85,247,.5)" },
  { emoji: "🐮", name: "bò", card: "#FFFBEB", rim: "#F97316", rimDark: "#EA580C", text: "#7C2D12", glow: "rgba(249,115,22,.5)" },
];

/* ─── Global CSS ──────────────────────────────────────────── */
const CSS = `
  @keyframes bobY    { 0%,100%{transform:translateY(0)}   50%{transform:translateY(-9px)}  }
  @keyframes blink   { 0%,88%,100%{transform:scaleY(1)}   94%{transform:scaleY(.06)}        }
  @keyframes drift   { 0%,100%{transform:translateX(0)}   50%{transform:translateX(18px)}   }
  @keyframes pop     { 0%{transform:scale(.25);opacity:0} 65%{transform:scale(1.12)} 100%{transform:scale(1);opacity:1} }
  @keyframes slidein { from{transform:translateY(22px);opacity:0} to{transform:translateY(0);opacity:1} }
  @keyframes pulse   { 0%,100%{transform:scale(1)}  50%{transform:scale(1.1)}  }
  @keyframes spin    { from{transform:rotate(0)}  to{transform:rotate(360deg)} }
  @keyframes stars   { 0%{opacity:1;transform:translate(var(--sx),var(--sy)) scale(1)}
                       100%{opacity:0;transform:translate(calc(var(--sx)*3),calc(var(--sy)*3)) scale(0)} }
  @keyframes floatUp { 0%{transform:translateY(0) scale(1);opacity:1}
                       100%{transform:translateY(-60px) scale(.5);opacity:0} }
  @keyframes wink    { 0%,96%,100%{transform:scale(1,1)}  98%{transform:scale(1,.05)} }
  @keyframes sway    { 0%,100%{transform:rotate(-3deg)} 50%{transform:rotate(3deg)} }

  .bob    { animation: bobY   2.4s ease-in-out infinite; }
  .drift  { animation: drift  10s  ease-in-out infinite; }
  .pop    { animation: pop    .45s cubic-bezier(.34,1.56,.64,1) both; }
  .slidein{ animation: slidein .4s ease both; }
  .pulse  { animation: pulse  1.8s ease-in-out infinite; }
  .sway   { animation: sway   2.8s ease-in-out infinite; }
`;

/* ─── Background elements ─────────────────────────────────── */
function Cloud({ top, left, size = 100, delay = "0s" }) {
  const s = size / 100;
  return (
    <div className="drift absolute pointer-events-none select-none"
      style={{ top, left, animationDelay: delay }}>
      <div style={{ position: "relative", width: size, height: size * .35 }}>
        {[[.1, .1, .34, .34], [.24, -.12, .42, .42], [.58, -.06, .28, .28]].map(([lf, tf, wf, hf], i) => (
          <div key={i} style={{
            position: "absolute",
            left: lf * size, top: tf * size, width: wf * size, height: hf * size,
            borderRadius: "50%", background: "rgba(255,255,255,.92)", boxShadow: "0 2px 8px rgba(0,0,0,.05)"
          }} />
        ))}
        <div style={{ width: "100%", height: size * .35, borderRadius: 999, background: "rgba(255,255,255,.92)", boxShadow: "0 4px 14px rgba(0,0,0,.08)" }} />
      </div>
    </div>
  );
}

function Sun() {
  return (
    <div className="absolute pointer-events-none select-none" style={{ top: 16, right: 20 }}>
      <div style={{ position: "relative", width: 60, height: 60 }}>
        {/* Rays */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} style={{
            position: "absolute", top: "50%", left: "50%", width: 3, height: 20,
            background: "#FDE047", borderRadius: 4, opacity: .7,
            transformOrigin: "0 0",
            transform: `rotate(${i * 45}deg) translate(-1.5px,-38px)`,
            animation: `spin 12s linear infinite`
          }} />
        ))}
        {/* Core */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          background: "radial-gradient(circle,#FEF08A 30%,#FBBF24 100%)",
          boxShadow: "0 0 0 8px rgba(251,191,36,.25), 0 0 0 16px rgba(251,191,36,.1)"
        }} />
        <div style={{
          position: "absolute", top: 8, left: 8, width: 14, height: 10,
          borderRadius: "50%", background: "rgba(255,255,255,.45)", transform: "rotate(-30deg)"
        }} />
      </div>
    </div>
  );
}

function GrassAndFlowers() {
  return (
    <>
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: 64, background: "linear-gradient(to bottom,#4ADE80,#16A34A)"
      }} />
      {/* Blades */}
      {Array.from({ length: 18 }).map((_, i) => (
        <div key={i} style={{
          position: "absolute", bottom: 56, left: `${i * 5.8 + 1}%`,
          width: 9, height: 22 + ((i * 7) % 14),
          background: "linear-gradient(to top,#15803D,#4ADE80)",
          borderRadius: "50% 50% 0 0",
          transform: `rotate(${i % 2 === 0 ? -12 : 12}deg)`,
        }} />
      ))}
      {/* Flowers */}
      {["8%", "25%", "58%", "82%", "94%"].map((l, i) => (
        <div key={i} className="sway absolute select-none pointer-events-none"
          style={{
            bottom: 58, left: l, fontSize: `${18 + i % 3 * 5}px`,
            animationDelay: `${i * 0.4}s`, lineHeight: 1
          }}>
          {["🌸", "🌼", "🌺", "💐", "🌻"][i]}
        </div>
      ))}
    </>
  );
}

/* ─── Cute CSS chick mascot ───────────────────────────────── */
function Mascot({ mood }) {
  const happy = mood === "happy";
  const sad = mood === "sad";

  return (
    <div className="bob select-none" style={{ position: "relative", width: 144, height: 150, flexShrink: 0 }}>

      {happy && <StarBurst />}

      {/* Shadow */}
      <div style={{
        position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: 80, height: 12, borderRadius: "50%", background: "rgba(0,0,0,.12)"
      }} />

      {/* Body */}
      <div style={{
        position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)",
        width: 96, height: 80,
        background: "linear-gradient(160deg,#FEF08A,#FDE047)",
        borderRadius: "50% 50% 44% 44%",
        border: "3.5px solid #EAB308",
        boxShadow: "0 8px 24px rgba(234,179,8,.35)"
      }}>
        {/* Belly spot */}
        <div style={{
          position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)",
          width: 48, height: 36, borderRadius: "50%",
          background: "rgba(255,255,255,.4)"
        }} />
      </div>

      {/* Left wing */}
      <div style={{
        position: "absolute", bottom: 24, left: 2, width: 38, height: 30,
        background: "linear-gradient(135deg,#FDE047,#FBBF24)",
        borderRadius: "50% 0 50% 50%", border: "3px solid #EAB308",
        transform: "rotate(-25deg)"
      }} />
      {/* Right wing */}
      <div style={{
        position: "absolute", bottom: 24, right: 2, width: 38, height: 30,
        background: "linear-gradient(135deg,#FBBF24,#FDE047)",
        borderRadius: "0 50% 50% 50%", border: "3px solid #EAB308",
        transform: "rotate(25deg)"
      }} />

      {/* Head */}
      <div style={{
        position: "absolute", top: 4, left: "50%", transform: "translateX(-50%)",
        width: 96, height: 96, borderRadius: "50%",
        background: "linear-gradient(160deg,#FEF08A,#FDE047)",
        border: "3.5px solid #EAB308",
        boxShadow: "0 6px 20px rgba(234,179,8,.3)"
      }}>

        {/* Eyes */}
        {[-20, 20].map((x, i) => (
          <div key={i} style={{
            position: "absolute", top: 30, left: `calc(50% + ${x}px - 12px)`,
            width: 24, height: 24, borderRadius: "50%", background: "#1C1917",
            display: "flex", alignItems: "flex-start", justifyContent: "center",
            paddingTop: 3,
            animation: sad ? undefined : "wink 5s ease-in-out infinite"
          }}>
            {/* Shine */}
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff", marginLeft: 3 }} />
            {sad && <div style={{ position: "absolute", bottom: 1, left: 2, right: 2, height: 2, borderRadius: 2, background: "#c4a000" }} />}
          </div>
        ))}

        {/* Cheeks */}
        {[-24, 24].map((x, i) => (
          <div key={i} style={{
            position: "absolute", top: 50, left: `calc(50% + ${x}px - 12px)`,
            width: 22, height: 14, borderRadius: "50%",
            background: "#FCA5A5", opacity: happy ? .9 : .6
          }} />
        ))}

        {/* Beak */}
        <div style={{
          position: "absolute", top: 50, left: "50%", transform: "translateX(-50%)",
          width: 20, height: 12, borderRadius: "0 0 10px 10px",
          background: "linear-gradient(180deg,#FB923C,#EA580C)",
          border: "2.5px solid #C2410C",
          boxShadow: "0 2px 6px rgba(194,65,12,.4)"
        }} />

        {/* Mouth */}
        {happy && (
          <div style={{
            position: "absolute", top: 60, left: "50%", transform: "translateX(-50%)",
            width: 24, height: 10, borderRadius: "0 0 14px 14px",
            borderBottom: "3.5px solid #C2410C",
            borderLeft: "3.5px solid #C2410C",
            borderRight: "3.5px solid #C2410C"
          }} />
        )}
        {sad && (
          <div style={{
            position: "absolute", top: 64, left: "50%", transform: "translateX(-50%)",
            width: 22, height: 8, borderRadius: "14px 14px 0 0",
            borderTop: "3.5px solid #C2410C",
            borderLeft: "3.5px solid #C2410C",
            borderRight: "3.5px solid #C2410C"
          }} />
        )}

        {/* Crest */}
        <div style={{
          position: "absolute", top: -18, left: "50%", transform: "translateX(-50%)",
          display: "flex", gap: 3, alignItems: "flex-end"
        }}>
          {[{ w: 11, h: 16, r: -18 }, { w: 14, h: 22, r: 0 }, { w: 11, h: 16, r: 18 }].map((c, i) => (
            <div key={i} style={{
              width: c.w, height: c.h,
              background: "linear-gradient(160deg,#FF6B6B,#DC2626)",
              borderRadius: "60% 60% 30% 30%",
              border: "2px solid #B91C1C",
              transform: `rotate(${c.r}deg)`
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Star burst on correct ───────────────────────────────── */
function StarBurst() {
  const stars = ["⭐", "✨", "🌟", "💛", "⭐", "✨"];
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {stars.map((s, i) => {
        const angle = (i / stars.length) * 360;
        const rad = angle * Math.PI / 180;
        const sx = Math.cos(rad) * 55;
        const sy = Math.sin(rad) * 55;
        return (
          <div key={i} style={{
            position: "absolute", top: "50%", left: "50%",
            fontSize: 20, lineHeight: 1, marginLeft: -10, marginTop: -10,
            "--sx": `${sx}px`, "--sy": `${sy}px`,
            animation: `stars .9s ease-out ${i * .08}s both`,
          }}>
            {s}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Bowl card ───────────────────────────────────────────── */
function BowlCard({ animals, animalSet, selected, correct, wrong, onClick, disabled, index }) {
  const n = animals.length;

  const borderC = wrong ? "#EF4444"
    : correct ? "#22C55E"
      : selected ? animalSet.rim
        : animalSet.rim + "99";
  const bgC = wrong ? "#FEF2F2"
    : correct ? "#F0FDF4"
      : animalSet.card;
  const shadowC = wrong ? "rgba(239,68,68,.45)"
    : correct ? "rgba(34,197,94,.45)"
      : animalSet.glow;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="pop relative flex flex-col items-center transition-all duration-200 active:scale-90"
      style={{
        animationDelay: `${index * 85}ms`,
        borderRadius: 28, padding: "14px 12px 8px",
        border: `3.5px solid ${borderC}`,
        background: bgC,
        boxShadow: selected
          ? `0 10px 32px ${shadowC}, 0 0 0 5px ${shadowC}`
          : `0 6px 18px ${shadowC}`,
        transform: selected ? "scale(1.07) translateY(-6px)" : correct ? "scale(1.04)" : "scale(1)",
        cursor: disabled ? "default" : "pointer",
        minWidth: 130,
      }}
    >
      {/* Feedback badge */}
      {(correct || wrong) && (
        <div className="pop absolute -top-3.5 -right-3.5 flex h-8 w-8 items-center justify-center rounded-full text-base font-bold text-white shadow-lg"
          style={{ background: correct ? "#22C55E" : "#EF4444", border: "2px solid #fff" }}>
          {correct ? "✓" : "✗"}
        </div>
      )}

      {/* Pasture tray */}
      <div style={{
        width: "100%", minHeight: 82,
        borderRadius: 18,
        background: `linear-gradient(160deg,rgba(255,255,255,.6),rgba(255,255,255,.2))`,
        border: `2px solid ${borderC}44`,
        boxShadow: `inset 0 2px 8px rgba(0,0,0,.06)`,
        display: "flex", flexWrap: "wrap",
        alignItems: "center", justifyContent: "center",
        gap: 3, padding: 8,
      }}>
        {animals.map((_, i) => (
          <span key={i} style={{
            fontSize: n > 7 ? 22 : n > 4 ? 26 : 30,
            lineHeight: 1,
            display: "inline-block",
            animation: `bobY ${1.6 + i * 0.18}s ease-in-out ${i * 140}ms infinite`,
          }}>
            {animalSet.emoji}
          </span>
        ))}
      </div>

      {/* Bowl rim */}
      <div style={{
        width: "86%", height: 16,
        borderRadius: "0 0 60px 60px",
        background: `linear-gradient(180deg,${animalSet.rim},${animalSet.rimDark})`,
        border: `2px solid ${animalSet.rimDark}`,
        marginTop: -1,
        boxShadow: `0 5px 12px ${shadowC}`,
      }} />

      {/* Count label */}
      <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}>
        <span style={{ fontWeight: 900, fontSize: 18, color: animalSet.rimDark }}>{n}</span>
        <span style={{ fontWeight: 700, fontSize: 13, color: animalSet.text }}>con</span>
        <span style={{ fontSize: 18 }}>{animalSet.emoji}</span>
      </div>
    </button>
  );
}

/* ─── Bottom instruction bar ──────────────────────────────── */
function InstructionBar({ targetNum, animalSet, answered, onNext }) {
  const [playing, setPlaying] = React.useState(false);

  const handleSpeak = () => {
    const txt = `Chọn chuồng có ${targetNum} con ${animalSet.name}`;
    setPlaying(true);
    speakVI(txt);
    // Reset playing state after 4 seconds (estimate)
    setTimeout(() => setPlaying(false), 4000);
  };

  return (
    <div className="slidein flex items-center gap-3 rounded-3xl bg-white px-5 py-3 shadow-2xl"
      style={{ border: `3px solid ${animalSet.rim}55` }}>

      {/* Speaker button – clickable! */}
      <button
        type="button"
        onClick={handleSpeak}
        title="Nghe câu hỏi"
        style={{
          flexShrink: 0, width: 48, height: 48, borderRadius: "50%", border: "none",
          background: playing
            ? "linear-gradient(135deg,#EF4444,#DC2626)"
            : "linear-gradient(135deg,#38BDF8,#0EA5E9)",
          boxShadow: playing
            ? "0 4px 14px rgba(239,68,68,.5)"
            : "0 4px 14px rgba(14,165,233,.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, cursor: "pointer",
          transition: "background .2s, box-shadow .2s",
        }}
      >
        {playing ? "⏹" : "🔊"}
      </button>

      {/* Instruction text */}
      <div style={{ flex: 1, fontSize: 17, fontWeight: 700, color: "#374151", display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
        Chọn chuồng có
        <span className="pulse" style={{
          fontWeight: 900, fontSize: 28, color: animalSet.rimDark,
          textShadow: `0 2px 10px ${animalSet.glow}`,
          display: "inline-block",
        }}>
          {targetNum}
        </span>
        con {animalSet.emoji}
      </div>

      {/* Next button */}
      {answered && (
        <button
          onClick={onNext}
          className="pop"
          style={{
            flexShrink: 0, borderRadius: 22, padding: "9px 22px",
            fontWeight: 900, fontSize: 15, color: "#fff", border: "none", cursor: "pointer",
            background: `linear-gradient(135deg,#22C55E,#16A34A)`,
            boxShadow: "0 5px 18px rgba(34,197,94,.5)",
          }}>
          XONG ✓
        </button>
      )}
    </div>
  );
}

/* ─── Toast ───────────────────────────────────────────────── */
function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className="pop" style={{
      position: "fixed", top: 24, left: "50%", transform: "translateX(-50%)",
      zIndex: 9999, pointerEvents: "none", userSelect: "none",
      borderRadius: 40, padding: "13px 30px",
      fontWeight: 900, fontSize: 18, color: "#fff",
      background: toast.ok
        ? "linear-gradient(135deg,#10B981,#059669)"
        : "linear-gradient(135deg,#EF4444,#DC2626)",
      boxShadow: toast.ok
        ? "0 10px 36px rgba(16,185,129,.6)"
        : "0 10px 36px rgba(239,68,68,.6)",
      whiteSpace: "nowrap",
    }}>
      {toast.text}
    </div>
  );
}

/* ─── Confetti ────────────────────────────────────────────── */
function Confetti() {
  const ps = React.useMemo(() => Array.from({ length: 24 }, (_, i) => ({
    id: i, e: ["🌟", "🎉", "✨", "⭐", "🎊", "💛", "🌈", "🍀", "🎈"][i % 9],
    l: `${(i * 4.2 + 2) % 95}%`, dur: `${.65 + (i % 5) * .2}s`, d: `${(i % 8) * .07}s`,
  })), []);
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: 24, pointerEvents: "none", zIndex: 40, userSelect: "none" }}>
      {ps.map(p => (
        <div key={p.id} style={{
          position: "absolute", top: 0, left: p.l, fontSize: 26,
          animation: `floatUp ${p.dur} ease-in ${p.d} infinite`
        }}>{p.e}</div>
      ))}
    </div>
  );
}

/* ─── Victory ─────────────────────────────────────────────── */
function VictoryOverlay({ correct, total, onReplay, onExit }) {
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 50,
      display: "flex", alignItems: "center", justifyContent: "center",
      borderRadius: 24, background: "rgba(0,0,0,.38)", backdropFilter: "blur(7px)"
    }}>
      <Confetti />
      <div className="pop" style={{
        position: "relative", zIndex: 60, margin: "0 16px",
        width: "100%", maxWidth: 300, textAlign: "center",
        borderRadius: 32, padding: "36px 24px",
        background: "linear-gradient(160deg,#FFFDE7,#FFF9C4)",
        border: "4px solid #FBBF24",
        boxShadow: "0 24px 64px rgba(0,0,0,.28)"
      }}>
        <div className="bob" style={{ fontSize: 72 }}>🏆</div>
        <h2 style={{ fontSize: 30, fontWeight: 900, color: "#B45309", margin: "12px 0 4px" }}>Xuất Sắc!</h2>
        <p style={{ fontWeight: 700, color: "#92400E", fontSize: 16 }}>
          Đúng <span style={{ color: "#16A34A", fontWeight: 900, fontSize: 20 }}>{correct}/{total}</span> câu! 🎉
        </p>
        <div style={{ fontSize: 38, margin: "16px 0", letterSpacing: 6 }}>🐥🐷🐑🐮</div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onReplay} style={{
            flex: 1, borderRadius: 22, padding: "13px 0", fontWeight: 900, fontSize: 15,
            color: "#fff", border: "none", cursor: "pointer",
            background: "linear-gradient(135deg,#22C55E,#16A34A)",
            boxShadow: "0 6px 24px rgba(34,197,94,.45)"
          }}>
            🔄 Chơi lại
          </button>
          <button onClick={onExit} style={{
            flex: 1, borderRadius: 22, padding: "13px 0", fontWeight: 900, fontSize: 15,
            color: "#374151", background: "#F9FAFB", border: "2.5px solid #E5E7EB",
            cursor: "pointer", boxShadow: "0 4px 14px rgba(0,0,0,.1)"
          }}>
            🏠 Về nhà
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN ───────────────────────────────────────────────── */
export default function NumberMatchingGame({ game, config, onExit, onFinish }) {
  const pairs = React.useMemo(() => Array.isArray(config?.pairs) ? config.pairs : [], [config]);
  const totalQuestions = pairs.length;
  const startAtRef = React.useRef(Date.now());

  const buildRounds = React.useCallback((pairList) => {
    const shuffled = shuffle(pairList);
    return shuffled.map((target, idx) => {
      const others = pairList.filter(p => p.number !== target.number);
      const distractors = shuffle(others).slice(0, 2);
      return {
        target,
        options: shuffle([target, ...distractors]),
        animalSet: ANIMAL_SETS[idx % ANIMAL_SETS.length],
      };
    });
  }, []);

  const [rounds, setRounds] = React.useState([]);
  const [roundIdx, setRoundIdx] = React.useState(0);
  const [picked, setPicked] = React.useState(null);
  const [correct, setCorrect] = React.useState(0);
  const [done, setDone] = React.useState(false);
  const [toast, setToast] = React.useState(null);
  const [mascotMood, setMascotMood] = React.useState("idle");

  const reset = React.useCallback(() => {
    if (!pairs.length) return;
    setRounds(buildRounds(pairs));
    setRoundIdx(0); setPicked(null); setCorrect(0);
    setDone(false); setToast(null); setMascotMood("idle");
    startAtRef.current = Date.now();
  }, [pairs, buildRounds]);

  React.useEffect(() => { reset(); }, [game?.gameId, reset]);

  // Auto-speak instruction when round changes
  React.useEffect(() => {
    const round = rounds[roundIdx];
    if (!round) return;
    const txt = `Chọn chuồng có ${round.target.number} con ${round.animalSet.name}`;
    const timer = setTimeout(() => speakVI(txt), 600);
    return () => clearTimeout(timer);
  }, [roundIdx, rounds]);

  const showToast = (text, ok) => {
    setToast({ text, ok });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 1400);
  };

  const onPick = (num) => {
    if (picked !== null || done) return;
    const round = rounds[roundIdx];
    const ok = Number(num) === Number(round?.target?.number);
    setPicked(num);
    setMascotMood(ok ? "happy" : "sad");
    if (ok) {
      const cheer = randomPick(CHEERS_OK);
      showToast(`🎉 ${cheer}`, true);
      setCorrect(c => c + 1);
      speakVI(cheer);
    } else {
      const cheer = randomPick(CHEERS_FAIL);
      showToast(`❌ ${cheer}`, false);
      speakVI(cheer);
    }
  };

  const onNext = () => {
    if (roundIdx + 1 >= rounds.length) {
      setDone(true);
      onFinish?.({
        correctAnswers: correct, totalQuestions,
        playDurations: Math.floor((Date.now() - startAtRef.current) / 1000)
      });
    } else {
      setRoundIdx(r => r + 1);
      setPicked(null);
      setMascotMood("idle");
    }
  };

  const round = rounds[roundIdx];

  return (
    <>
      <style>{CSS}</style>
      <Toast toast={toast} />

      <div style={{
        position: "relative", overflow: "hidden", borderRadius: 28, minHeight: 540,
        display: "flex", flexDirection: "column"
      }}>

        {/* ── Background ── */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(160deg,#FFE4B5 0%,#FFD580 45%,#FFBC4B 100%)"
        }} />
        <div style={{
          position: "absolute", inset: 0, opacity: .3,
          backgroundImage: `radial-gradient(ellipse at 15% 25%,rgba(255,255,255,.7) 0%,transparent 40%),
            radial-gradient(ellipse at 85% 65%,rgba(255,200,80,.5) 0%,transparent 40%)` }} />

        <Cloud top="6%" left="4%" size={110} delay="0s" />
        <Cloud top="10%" left="56%" size={85} delay="3.5s" />
        <Cloud top="4%" left="78%" size={70} delay="1.8s" />
        <Sun />
        <GrassAndFlowers />

        {/* ── Content ── */}
        <div style={{
          position: "relative", zIndex: 10, display: "flex", flexDirection: "column",
          flex: 1, gap: 16, padding: "16px 16px 0"
        }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(255,255,255,.75)",
                borderRadius: 22,
                padding: "8px 16px",
                fontWeight: 900,
                fontSize: 15,
                color: "#92400E",
                boxShadow: "0 4px 14px rgba(0,0,0,.12)",
                backdropFilter: "blur(6px)",
                fontFamily:
                  '"Noto Sans", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
              }}
            >🌾 <span>{game?.name || "Ghép Số Với Hình"}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {/* Progress dots */}
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                {Array.from({ length: totalQuestions }).map((_, i) => (
                  <div key={i} style={{
                    width: i === roundIdx ? 14 : 10,
                    height: i === roundIdx ? 14 : 10,
                    borderRadius: "50%",
                    background: i < roundIdx ? "#22C55E" : i === roundIdx ? "#F59E0B" : "rgba(255,255,255,.55)",
                    border: "2.5px solid rgba(255,255,255,.7)",
                    boxShadow: i === roundIdx ? "0 0 0 4px rgba(245,158,11,.4)" : "none",
                    transition: "all .3s",
                  }} />
                ))}
              </div>
              <button onClick={onExit} style={{
                borderRadius: 22, padding: "8px 18px", fontWeight: 800, fontSize: 14,
                color: "#374151", background: "rgba(255,255,255,.82)", border: "none",
                boxShadow: "0 4px 14px rgba(0,0,0,.14)", cursor: "pointer", backdropFilter: "blur(4px)"
              }}>
                ✕
              </button>
            </div>
          </div>

          {/* Scene */}
          {!round || !totalQuestions ? (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ borderRadius: 24, background: "rgba(255,255,255,.8)", padding: "28px 36px", textAlign: "center" }}>
                <div style={{ fontSize: 44 }}>🐾</div>
                <p style={{ fontWeight: 700 }}>Chưa có dữ liệu!</p>
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "nowrap", paddingBottom: 8 }}>

              {/* Left bowl(s) */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
                {round.options.slice(0, Math.ceil(round.options.length / 2)).map((opt, i) => (
                  <BowlCard
                    key={opt.number} index={i}
                    animals={Array.from({ length: Number(opt.number) || 0 })}
                    animalSet={round.animalSet}
                    selected={picked === opt.number}
                    correct={picked !== null && opt.number === round.target.number}
                    wrong={picked === opt.number && opt.number !== round.target.number}
                    onClick={() => onPick(opt.number)}
                    disabled={picked !== null}
                  />
                ))}
              </div>

              {/* Center mascot */}
              <Mascot mood={mascotMood} />

              {/* Right bowl(s) */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
                {round.options.slice(Math.ceil(round.options.length / 2)).map((opt, i) => (
                  <BowlCard
                    key={opt.number} index={i + 3}
                    animals={Array.from({ length: Number(opt.number) || 0 })}
                    animalSet={round.animalSet}
                    selected={picked === opt.number}
                    correct={picked !== null && opt.number === round.target.number}
                    wrong={picked === opt.number && opt.number !== round.target.number}
                    onClick={() => onPick(opt.number)}
                    disabled={picked !== null}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Green grass progress strip */}
          {totalQuestions > 0 && (
            <div style={{
              height: 8, borderRadius: 8, margin: "0 4px",
              background: "rgba(255,255,255,.3)", overflow: "hidden"
            }}>
              <div style={{
                height: "100%", borderRadius: 8, transition: "width .6s ease",
                width: `${roundIdx / totalQuestions * 100}%`,
                background: "linear-gradient(90deg,#4ADE80,#22C55E)",
                boxShadow: "0 2px 8px rgba(34,197,94,.5)"
              }} />
            </div>
          )}
        </div>

        {/* ── Instruction bar ── */}
        {round && !done && (
          <div style={{ position: "relative", zIndex: 10, padding: "12px 16px 16px" }}>
            <InstructionBar
              targetNum={round.target.number}
              animalSet={round.animalSet}
              answered={picked !== null}
              onNext={onNext}
            />
          </div>
        )}

        {done && <VictoryOverlay correct={correct} total={totalQuestions} onReplay={reset} onExit={onExit} />}
      </div>
    </>
  );
}
