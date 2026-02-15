import React from "react";

function cn(...xs) {
  return xs.filter(Boolean).join(" ");
}

function Card({ className, children }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 shadow-[0_18px_60px_rgba(2,6,23,0.12)] backdrop-blur",
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
        opacity: 0.16 + Math.random() * 0.22,
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
          0%   { transform: translateY(0) scale(0.8); opacity: 0; }
          12%  { opacity: 0.5; }
          85%  { opacity: 0.25; }
          100% { transform: translateY(-120vh) scale(1.2); opacity: 0; }
        }
      `}</style>
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

/**
 * ✅ GIẢI QUYẾT ẢNH KHÔNG HIỆN
 * BE trả "apple_1.png" (relative), nên <img src="apple_1.png"> thường sẽ 404.
 * Bạn cần ghép thêm baseUrl hoặc map sang assets local.
 *
 * Cách dùng:
 * <NumberMatchingGame assetBaseUrl="https://your-cdn.com/assets/" ... />
 * hoặc assetMap={{"apple_1.png": importedApplePng, ...}}
 */
function resolveImageSrc(imageUrl, assetBaseUrl, assetMap) {
  if (!imageUrl) return "";
  const raw = String(imageUrl);

  // data url (base64)
  if (raw.startsWith("data:image/")) return raw;

  // absolute url
  if (/^https?:\/\//i.test(raw)) return raw;

  // map local (ưu tiên)
  if (assetMap && assetMap[raw]) return assetMap[raw];

  // relative -> ghép baseUrl (CDN) hoặc /assets/
  const base =
    assetBaseUrl ??
    (typeof window !== "undefined" ? `${window.location.origin}/assets/` : "/assets/");

  const normalizedBase = base.endsWith("/") ? base : base + "/";
  return normalizedBase + raw.replace(/^\//, "");
}

function ImgWithFallback({ src, alt, className }) {
  const [failed, setFailed] = React.useState(false);

  if (!src || failed) {
    return (
      <div
        className={cn(
          "grid place-items-center bg-white/60 text-slate-500",
          className
        )}
      >
        <div className="text-center">
          <div className="text-3xl">🖼️</div>
          <div className="mt-1 text-xs font-semibold">Không tải được ảnh</div>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || ""}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

export default function NumberMatchingGame({
  game,
  config,
  onExit,
  onFinish,
  submitting,
  submitMsg,
  assetBaseUrl, // ✅ thêm: base url cho ảnh (VD: https://cdn.../images/)
  assetMap, // ✅ thêm: map ảnh local { "apple_1.png": importedPng, ... }
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
  const [toast, setToast] = React.useState(null);

  React.useEffect(() => {
    const nums = pairs.map((p) => p.number);
    setLeftNums(shuffle(nums));
    setRightPairs(shuffle(pairs));
    setSelectedNum(null);
    setSelectedRight(null);
    setCorrect(0);
    setDone(false);
    setToast(null);
  }, [game?.gameId]); // reset when change game

  const tryMatch = (num, right) => {
    if (done) return;

    const ok = Number(num) === Number(right?.number);

    if (ok) {
      setToast("✅ Chính xác!");
      window.clearTimeout(tryMatch._t);
      tryMatch._t = window.setTimeout(() => setToast(null), 900);

      setCorrect((x) => x + 1);
      setLeftNums((xs) => xs.filter((n) => n !== num));
      setRightPairs((xs) => xs.filter((p) => p.number !== right.number));
      setSelectedNum(null);
      setSelectedRight(null);

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
      setToast("❌ Sai rồi, thử lại nha!");
      window.clearTimeout(tryMatch._t);
      tryMatch._t = window.setTimeout(() => setToast(null), 900);

      // wrong -> clear after a beat
      window.clearTimeout(tryMatch._w);
      tryMatch._w = window.setTimeout(() => {
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

  const hintOn = !!config?.showHints;

  return (
    <Card className="p-5 sm:p-7">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-cyan-100 via-sky-50 to-white" />
      <div className="absolute inset-0 -z-10 opacity-70 [background:radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.18)_0%,transparent_45%),radial-gradient(circle_at_80%_60%,rgba(16,185,129,0.14)_0%,transparent_50%)]" />
      <BubbleBackground />

      {/* Header */}
      <div className="relative flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            🧩 {game?.name || "Number Matching"}
          </div>
          <div className="mt-1 text-xl font-extrabold text-slate-900">
            Ghép số với hình tương ứng
          </div>
          <div className="mt-1 text-sm font-semibold text-slate-600">
            Chạm <span className="font-extrabold">Số</span> → chạm{" "}
            <span className="font-extrabold">Hình</span> để ghép
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-full bg-white/80 px-3 py-1 text-xs font-extrabold text-slate-700 ring-1 ring-slate-200">
            ✅ {correct}/{totalQuestions}
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

      {totalQuestions === 0 ? (
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white/70 p-5 text-sm font-semibold text-slate-700">
          Không có pairs trong configData.
        </div>
      ) : (
        <div className="relative mt-6 grid gap-4 lg:grid-cols-2">
          {/* Left: numbers */}
          <div className="rounded-3xl border border-slate-200 bg-white/70 p-4 shadow-[0_12px_30px_rgba(2,6,23,0.06)]">
            <div className="flex items-center justify-between">
              <div className="text-sm font-extrabold text-slate-900">Số</div>
              <div className="text-xs font-semibold text-slate-500">Chọn 1 số</div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-3">
              {leftNums.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => onPickNum(n)}
                  disabled={done}
                  className={cn(
                    "rounded-3xl border px-4 py-6 text-center text-2xl font-extrabold shadow-sm transition active:scale-[0.99]",
                    selectedNum === n
                      ? "border-indigo-200 bg-indigo-50 text-indigo-800 ring-2 ring-indigo-100"
                      : "border-slate-200 bg-white/80 hover:bg-white"
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Right: images */}
          <div className="rounded-3xl border border-slate-200 bg-white/70 p-4 shadow-[0_12px_30px_rgba(2,6,23,0.06)]">
            <div className="flex items-center justify-between">
              <div className="text-sm font-extrabold text-slate-900">Hình</div>
              <div className="text-xs font-semibold text-slate-500">Chọn 1 hình</div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              {rightPairs.map((p) => {
                const selected = selectedRight?.number === p.number;
                const imgSrc = resolveImageSrc(p.imageUrl, assetBaseUrl, assetMap);

                return (
                  <button
                    key={p.number}
                    type="button"
                    onClick={() => onPickRight(p)}
                    disabled={done}
                    className={cn(
                      "group overflow-hidden rounded-3xl border bg-white/80 text-left shadow-sm transition active:scale-[0.99]",
                      selected
                        ? "border-indigo-200 ring-2 ring-indigo-100"
                        : "border-slate-200 hover:bg-white"
                    )}
                    title={String(p.imageUrl || "")}
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                      <ImgWithFallback
                        src={imgSrc}
                        alt=""
                        className="h-full w-full object-contain p-3"
                      />

                      {/* small badge */}
                      <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-1 text-[11px] font-extrabold text-slate-800 ring-1 ring-slate-200">
                        🖼️
                      </div>
                    </div>

                    <div className="p-3">
                      <div className="text-xs font-semibold text-slate-700">
                        {hintOn ? `Hint: ${p.number}` : "Chọn để ghép"}
                      </div>

                      {/* Debug line for “ảnh không hiện” */}
                      <div className="mt-1 truncate text-[11px] font-semibold text-slate-400">
                        src: {imgSrc || "(empty)"}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick help */}
            <div className="mt-3 rounded-2xl bg-white/70 p-3 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
              Nếu ảnh không hiện:{" "}
              <span className="text-slate-900">
                imageUrl của BE đang là “apple_1.png”
              </span>{" "}
              (relative) → hãy truyền{" "}
              <span className="text-slate-900">assetBaseUrl</span> hoặc{" "}
              <span className="text-slate-900">assetMap</span>.
            </div>
          </div>

          {/* Toast */}
          {toast && (
            <div className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2">
              <div className="rounded-full bg-slate-900/90 px-5 py-2 text-sm font-extrabold text-white shadow-xl">
                {toast}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        {done ? (
          <div className="text-sm font-extrabold text-emerald-700">🎉 Hoàn thành!</div>
        ) : (
          <div className="text-sm font-semibold text-slate-600">
            {selectedNum != null || selectedRight != null
              ? "Chọn thêm 1 bên để ghép."
              : "Chọn 1 số và 1 hình."}
          </div>
        )}

        {submitting ? (
          <div className="text-sm font-semibold text-slate-600">Đang lưu kết quả…</div>
        ) : submitMsg ? (
          <div className="text-sm font-semibold text-slate-700">{submitMsg}</div>
        ) : null}
      </div>
    </Card>
  );
}

/**
 * ✅ VÍ DỤ CÁCH TRUYỀN ẢNH CHO HIỆN
 *
 * (A) Nếu ảnh nằm ở CDN:
 * <NumberMatchingGame assetBaseUrl="https://cdn.yoursite.com/game-assets/" ... />
 * => src sẽ thành: https://cdn.../game-assets/apple_1.png
 *
 * (B) Nếu ảnh nằm trong public/assets/ (React/Vite):
 *  - Bỏ ảnh vào: public/assets/apple_1.png
 *  - Không cần truyền assetBaseUrl (mặc định /assets/)
 *
 * (C) Nếu muốn import local:
 * import apple1 from "./assets/apple_1.png";
 * ...
 * <NumberMatchingGame assetMap={{"apple_1.png": apple1}} ... />
 */
