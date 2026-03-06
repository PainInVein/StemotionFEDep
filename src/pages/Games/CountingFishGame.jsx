import React from "react";
import fishPng from "../../assets/fish.jpg";

function cn(...xs) {
  return xs.filter(Boolean).join(" ");
}

/**
 * ✅ CÁCH DÙNG ẢNH JPG/PNG (bạn chọn 1 trong 3):
 *
 * 1) Import file (khuyên dùng):
 *    import fishPng from "./clown-fish.png";
 *    <CountingFishGame fishImageSrc={fishPng} ... />
 *
 * 2) Dùng URL:
 *    <CountingFishGame fishImageSrc="https://.../clown-fish.jpg" ... />
 *
 * 3) Dùng base64:
 *    <CountingFishGame fishImageSrc="data:image/jpeg;base64,...." ... />
 */

function Card({ className, children }) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-slate-200/70 bg-white/80 shadow-[0_18px_60px_rgba(2,6,23,0.12)] backdrop-blur",
        className
      )}
    >
      {children}
    </div>
  );
}

function BubbleBackground() {
  const bubbles = React.useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 5,
        duration: 8 + Math.random() * 4,
        size: 10 + Math.random() * 26,
        opacity: 0.18 + Math.random() * 0.22,
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="absolute bottom-0 rounded-full bg-white blur-[0.5px]"
          style={{
            left: b.left,
            width: b.size,
            height: b.size,
            opacity: b.opacity,
            animation: `bubble ${b.duration}s linear ${b.delay}s infinite`,
          }}
        />
      ))}

      <style>{`
        @keyframes bubble {
          0%   { transform: translateY(0) scale(0.7); opacity: 0; }
          12%  { opacity: 0.5; }
          85%  { opacity: 0.25; }
          100% { transform: translateY(-120vh) scale(1.25); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function FishImg({ src, className }) {
  return (
    <img
      src={src}
      alt="fish"
      className={cn(
        "select-none object-contain drop-shadow-[0_10px_18px_rgba(0,0,0,0.18)]",
        className
      )}
      draggable={false}
      loading="eager"
    />
  );
}

export default function CountingFishGame({
  game,
  config,
  onExit,
  onFinish,
  fishImageSrc = fishPng,
}) {
  const questions = Array.isArray(config?.questions) ? config.questions : [];
  const totalQuestions = questions.length || 0;

  const [idx, setIdx] = React.useState(0);
  const [correct, setCorrect] = React.useState(0);
  const [picked, setPicked] = React.useState(null);
  const [done, setDone] = React.useState(false);

  const startAtRef = React.useRef(Date.now());
  const q = questions[idx];

  const pick = (val) => {
    if (!q || picked != null || done) return;

    setPicked(val);
    const isCorrect = Number(val) === Number(q.correctAnswer);
    if (isCorrect) setCorrect((x) => x + 1);

    setTimeout(() => {
      if (idx + 1 < totalQuestions) {
        setIdx((x) => x + 1);
        setPicked(null);
      } else {
        setDone(true);
        const playDurations = Math.floor((Date.now() - startAtRef.current) / 1000);
        onFinish?.({
          correctAnswers: isCorrect ? correct + 1 : correct,
          totalQuestions,
          playDurations,
        });
      }
    }, 650);
  };

  const fishCount = Number(q?.fishCount) || 0;

  return (
    <Card className="relative overflow-hidden p-5 sm:p-7">
      {/* Ocean-ish background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-cyan-100 via-sky-50 to-white" />
      <div className="absolute inset-0 -z-10 opacity-70 [background:radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.18)_0%,transparent_45%),radial-gradient(circle_at_80%_60%,rgba(16,185,129,0.14)_0%,transparent_50%)]" />
      <BubbleBackground />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            🐠 {game?.name || "Counting Fish"}
          </div>
          <div className="mt-1 text-xl font-extrabold text-slate-900 font-sans leading-tight">
            Đếm số cá và chọn đáp án
          </div>
          <div className="mt-1 text-sm font-semibold text-slate-600">
            Nhìn số cá bên dưới rồi chọn số đúng ✨
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-full bg-white/80 px-3 py-1 text-xs font-extrabold text-slate-700 ring-1 ring-slate-200">
            {Math.min(idx + 1, totalQuestions)}/{totalQuestions}
          </div>

          <button
            onClick={onExit}
            type="button"
            className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-extrabold text-white shadow-md hover:bg-slate-800 active:scale-[0.99]"
          >
            ⟵ Quay lại
          </button>
        </div>
      </div>

      {!q ? (
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white/70 p-5 text-sm font-semibold text-slate-700">
          Không có câu hỏi trong configData.
        </div>
      ) : (
        <>
          {/* Question box */}
          <div className="mt-6 rounded-3xl border border-slate-200 bg-white/70 p-5 shadow-[0_12px_30px_rgba(2,6,23,0.06)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-xl font-extrabold text-slate-900">Có bao nhiêu con cá?</div>
              <div className="rounded-full bg-gray-200 px-3 py-1 text-xl font-extrabold text-black font-sans flex items-center gap-1">
                🧮 <span>Đếm nhé!</span>
              </div>
            </div>

            {/* Fish grid */}
            <div className="mt-4 grid grid-cols-6 gap-2 sm:grid-cols-8 md:grid-cols-10">
              {Array.from({ length: fishCount }).map((_, i) => (
                <div
                  key={i}
                  className="grid place-items-center rounded-2xl bg-white/70 ring-1 ring-slate-200/70"
                >
                  {/* ✅ dùng ảnh cá JPG/PNG */}
                  <FishImg
                    src={
                      fishImageSrc ||
                      // fallback nếu bạn quên truyền src (hiện 1 icon đơn giản)
                      "data:image/svg+xml;utf8," +
                      encodeURIComponent(
                        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                            <path d="M3 12c3.5-4.5 8.5-6.5 13-6 2 .2 3.7 1 5 2.2-.8 1-1.6 2-2.4 2.8.8.8 1.6 1.8 2.4 2.8-1.3 1.2-3 2-5 2.2-4.5.5-9.5-1.5-13-6z" stroke="%230ea5e9" stroke-width="1.8" stroke-linejoin="round"/>
                            <circle cx="15.5" cy="10" r="1" fill="%230ea5e9"/>
                          </svg>`
                      )
                    }
                    className="h-14 w-14 sm:h-16 sm:w-16 md:h-[76px] md:w-[76px] lg:h-[88px] lg:w-[88px] rounded-2xl"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Answers */}
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {(q.answers || []).map((a) => {
              const chosen = picked != null && Number(picked) === Number(a);
              const isCorrect = picked != null && Number(a) === Number(q.correctAnswer);

              return (
                <button
                  key={a}
                  type="button"
                  disabled={picked != null || done}
                  onClick={() => pick(a)}
                  className={cn(
                    "relative rounded-3xl border px-4 py-4 text-center text-base font-extrabold shadow-sm transition active:scale-[0.99]",
                    picked == null
                      ? "border-slate-200 bg-white/80 hover:bg-white"
                      : chosen
                        ? isCorrect
                          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                          : "border-rose-200 bg-rose-50 text-rose-800"
                        : isCorrect
                          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                          : "border-slate-200 bg-white/60 text-slate-500"
                  )}
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    <span className="text-xl">🫧</span>
                    {a}
                  </span>

                  {picked != null && isCorrect && Number(a) === Number(q.correctAnswer) && (
                    <span className="absolute right-3 top-3 rounded-full bg-emerald-600 px-2 py-1 text-[11px] font-extrabold text-white">
                      Đáp án
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <div className="rounded-2xl bg-white/80 px-4 py-2 text-sm font-extrabold text-slate-800 ring-1 ring-slate-200">
              ✅ Đúng: <span className="text-emerald-700">{correct}</span>
            </div>


          </div>
        </>
      )}
    </Card>
  );
}
