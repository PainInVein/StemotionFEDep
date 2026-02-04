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

function DotRow({ count }) {
  const n = Math.max(0, Number(count) || 0);
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: n }).map((_, i) => (
        <span
          key={i}
          className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold"
        >
          •
        </span>
      ))}
    </div>
  );
}

export default function AdditionTo10Game({
  game,
  config,
  onExit,
  onFinish,
  submitting,
  submitMsg,
}) {
  const questions = Array.isArray(config?.questions) ? config.questions : [];
  const totalQuestions = questions.length;

  const [idx, setIdx] = React.useState(0);
  const [picked, setPicked] = React.useState(null);
  const [correct, setCorrect] = React.useState(0);
  const [done, setDone] = React.useState(false);

  const startAtRef = React.useRef(Date.now());
  const q = questions[idx];

  const pick = (ans) => {
    if (!q || picked != null || done) return;

    setPicked(ans);
    const isCorrect = Number(ans) === Number(q.correctAnswer);
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
    }, 550);
  };

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {game?.name || "Addition to 10"}
          </div>
          <div className="mt-1 text-lg font-extrabold text-slate-900">
            Làm phép cộng thật nhanh
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {Math.min(idx + 1, totalQuestions)}/{totalQuestions || 0}
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
          {/* Visual aids */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm font-semibold text-slate-900">
                {q.num1} + {q.num2} = ?
              </div>
              <div className="text-xs text-slate-600">
                Đúng: <span className="font-semibold">{correct}</span>
              </div>
            </div>

            {config?.showVisualAids ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white p-4 border border-slate-200">
                  <div className="text-xs font-semibold text-slate-600 mb-2">Nhóm 1</div>
                  <DotRow count={q.num1} />
                </div>
                <div className="rounded-2xl bg-white p-4 border border-slate-200">
                  <div className="text-xs font-semibold text-slate-600 mb-2">Nhóm 2</div>
                  <DotRow count={q.num2} />
                </div>
              </div>
            ) : null}
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
            {submitting ? (
              <div className="text-sm text-slate-600">Đang lưu kết quả…</div>
            ) : submitMsg ? (
              <div className="text-sm text-slate-700">{submitMsg}</div>
            ) : (
              <div className="text-sm text-slate-600">
                Chọn đáp án để tiếp tục.
              </div>
            )}
          </div>
        </>
      )}
    </Card>
  );
}
