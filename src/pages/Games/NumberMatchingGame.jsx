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

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function NumberMatchingGame({
  game,
  config,
  onExit,
  onFinish,
  submitting,
  submitMsg,
}) {
  const pairs = Array.isArray(config?.pairs) ? config.pairs : [];
  const totalQuestions = pairs.length || 0;

  const startAtRef = React.useRef(Date.now());

  const [leftNums, setLeftNums] = React.useState([]);
  const [rightPairs, setRightPairs] = React.useState([]);
  const [selectedNum, setSelectedNum] = React.useState(null);
  const [selectedRight, setSelectedRight] = React.useState(null);

  const [correct, setCorrect] = React.useState(0);
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    const nums = pairs.map((p) => p.number);
    setLeftNums(shuffle(nums));
    setRightPairs(shuffle(pairs));
    setSelectedNum(null);
    setSelectedRight(null);
    setCorrect(0);
    setDone(false);
  }, [game?.gameId]); // reset when change game

  const tryMatch = (num, right) => {
    if (done) return;

    const ok = Number(num) === Number(right?.number);

    if (ok) {
      setCorrect((x) => x + 1);
      setLeftNums((xs) => xs.filter((n) => n !== num));
      setRightPairs((xs) => xs.filter((p) => p.number !== right.number));
      setSelectedNum(null);
      setSelectedRight(null);

      // finished
      if (leftNums.length === 1) {
        setDone(true);
        const playDurations = Math.floor((Date.now() - startAtRef.current) / 1000);
        onFinish?.({
          correctAnswers: correct + 1,
          totalQuestions,
          playDurations,
        });
      }
    } else {
      // wrong -> small shake-like effect by clearing after a beat
      setTimeout(() => {
        setSelectedNum(null);
        setSelectedRight(null);
      }, 450);
    }
  };

  const onPickNum = (num) => {
    if (done) return;
    setSelectedNum(num);
    if (selectedRight) tryMatch(num, selectedRight);
  };

  const onPickRight = (p) => {
    if (done) return;
    setSelectedRight(p);
    if (selectedNum != null) tryMatch(selectedNum, p);
  };

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {game?.name || "Number Matching"}
          </div>
          <div className="mt-1 text-lg font-extrabold text-slate-900">
            Ghép số với hình tương ứng
          </div>
          <div className="mt-1 text-xs text-slate-600">
            Chọn 1 số bên trái, rồi chọn hình bên phải (click-to-match).
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            Đúng: {correct}/{totalQuestions}
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

      {totalQuestions === 0 ? (
        <div className="mt-6 text-sm text-slate-600">Không có pairs trong configData.</div>
      ) : (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {/* Left: numbers */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm font-semibold text-slate-900">Số</div>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {leftNums.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => onPickNum(n)}
                  className={cn(
                    "rounded-2xl border px-4 py-5 text-center text-lg font-extrabold shadow-sm transition active:scale-[0.99]",
                    selectedNum === n
                      ? "border-indigo-200 bg-indigo-50 text-indigo-800"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Right: images */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm font-semibold text-slate-900">Hình</div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {rightPairs.map((p) => (
                <button
                  key={p.number}
                  type="button"
                  onClick={() => onPickRight(p)}
                  className={cn(
                    "overflow-hidden rounded-2xl border bg-white text-left shadow-sm transition active:scale-[0.99]",
                    selectedRight?.number === p.number
                      ? "border-indigo-200 ring-2 ring-indigo-100"
                      : "border-slate-200 hover:bg-slate-50"
                  )}
                >
                  <div className="aspect-[4/3] w-full bg-slate-100">
                    {/* imageUrl từ BE có thể là relative -> bạn tự handle baseUrl nếu cần */}
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : null}
                  </div>
                  <div className="p-3">
                    <div className="text-xs font-semibold text-slate-700">
                      (ẩn số)
                    </div>
                    {/* Nếu config showHints true thì hiển thị hint */}
                    {config?.showHints ? (
                      <div className="mt-1 text-xs text-slate-500">
                        Hint: {p.number}
                      </div>
                    ) : null}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        {done ? (
          <div className="text-sm font-semibold text-emerald-700">✅ Hoàn thành!</div>
        ) : (
          <div className="text-sm text-slate-600">
            {selectedNum != null || selectedRight != null
              ? "Chọn thêm 1 bên để ghép."
              : "Chọn 1 số và 1 hình."}
          </div>
        )}

        {submitting ? (
          <div className="text-sm text-slate-600">Đang lưu kết quả…</div>
        ) : submitMsg ? (
          <div className="text-sm text-slate-700">{submitMsg}</div>
        ) : null}
      </div>
    </Card>
  );
}
