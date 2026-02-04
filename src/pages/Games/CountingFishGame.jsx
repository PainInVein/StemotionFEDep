import React from "react";

function cn(...xs) {
  return xs.filter(Boolean).join(" ");
}

function Card({ className, children }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_0_rgba(15,23,42,0.04)]",
        className
      )}
    >
      {children}
    </div>
  );
}

function FishIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M3 12c3.5-4.5 8.5-6.5 13-6 2 .2 3.7 1 5 2.2-.8 1-1.6 2-2.4 2.8.8.8 1.6 1.8 2.4 2.8-1.3 1.2-3 2-5 2.2-4.5.5-9.5-1.5-13-6z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="15.5" cy="10" r="1" fill="currentColor" />
    </svg>
  );
}

export default function CountingFishGame({
  game,
  config,
  onExit,
  onFinish,
  submitting,
  submitMsg,
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
    }, 600);
  };

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {game?.name || "Counting Fish"}
          </div>
          <div className="mt-1 text-lg font-extrabold text-slate-900">
            Đếm số cá và chọn đáp án
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {Math.min(idx + 1, totalQuestions)}/{totalQuestions}
          </div>
          <button
            onClick={onExit}
            type="button"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Quay lại
          </button>
        </div>
      </div>

      {!q ? (
        <div className="mt-6 text-sm text-slate-600">Không có câu hỏi trong configData.</div>
      ) : (
        <>
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="text-sm font-semibold text-slate-900">
              Có bao nhiêu con cá?
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {Array.from({ length: Number(q.fishCount) || 0 }).map((_, i) => (
                <FishIcon key={i} className="h-7 w-7 text-blue-600" />
              ))}
            </div>
          </div>

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
                    "rounded-2xl border px-4 py-4 text-center text-sm font-extrabold shadow-sm transition active:scale-[0.99]",
                    picked == null
                      ? "border-slate-200 bg-white hover:bg-slate-50"
                      : chosen
                        ? isCorrect
                          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                          : "border-rose-200 bg-rose-50 text-rose-800"
                        : isCorrect
                          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                          : "border-slate-200 bg-white opacity-60"
                  )}
                >
                  {a}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-slate-700">
              Đúng: <span className="font-semibold">{correct}</span>
            </div>

            {submitting ? (
              <div className="text-sm text-slate-600">Đang lưu kết quả…</div>
            ) : submitMsg ? (
              <div className="text-sm text-slate-700">{submitMsg}</div>
            ) : null}
          </div>
        </>
      )}
    </Card>
  );
}
