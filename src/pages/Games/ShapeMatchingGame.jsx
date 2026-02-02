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

function ShapePreview({ shape }) {
  const common = "h-16 w-16";
  if (shape === "circle")
    return <div className={cn(common, "rounded-full border-4 border-indigo-500")} />;
  if (shape === "square")
    return <div className={cn(common, "border-4 border-indigo-500")} />;
  if (shape === "triangle")
    return (
      <div className="h-0 w-0 border-l-[34px] border-r-[34px] border-b-[60px] border-l-transparent border-r-transparent border-b-indigo-500" />
    );
  if (shape === "rectangle")
    return <div className="h-12 w-20 border-4 border-indigo-500" />;
  return <div className={cn(common, "border-4 border-slate-300")} />;
}

export default function ShapeMatchingGame({
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
    const isCorrect = String(val) === String(q.targetShape);
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
            {game?.name || "Shape Matching"}
          </div>
          <div className="mt-1 text-lg font-extrabold text-slate-900">
            Chọn đúng hình mục tiêu
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
            <div className="text-sm font-semibold text-slate-900">Hình cần chọn:</div>
            <div className="mt-4 flex items-center gap-4">
              <ShapePreview shape={q.targetShape} />
              <div className="text-sm text-slate-700">
                Target: <span className="font-mono font-semibold">{q.targetShape}</span>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {(q.options || []).map((opt) => {
              const chosen = picked != null && String(picked) === String(opt);
              const isCorrect = picked != null && String(opt) === String(q.targetShape);

              return (
                <button
                  key={opt}
                  type="button"
                  disabled={picked != null || done}
                  onClick={() => pick(opt)}
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
                  {opt}
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
