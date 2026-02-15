import React from "react";

function cn(...xs) {
  return xs.filter(Boolean).join(" ");
}

function Card({ className, children }) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-slate-200/70 bg-white/80 shadow-[0_12px_40px_rgba(2,6,23,0.10)] backdrop-blur",
        className
      )}
    >
      {children}
    </div>
  );
}

const SHAPE_PATHS = {
  circle: (size = 56) => <circle cx={size / 2} cy={size / 2} r={size * 0.32} />,
  // ✅ no rounded corners
  square: (size = 56) => (
    <rect
      x={size * 0.18}
      y={size * 0.18}
      width={size * 0.64}
      height={size * 0.64}
      rx={0}
      ry={0}
    />
  ),
  triangle: (size = 56) => (
    <path
      d={`M ${size / 2} ${size * 0.14} L ${size * 0.84} ${size * 0.82} L ${size * 0.16} ${size * 0.82} Z`}
    />
  ),
  // ✅ no rounded corners
  rectangle: (size = 56) => (
    <rect
      x={size * 0.12}
      y={size * 0.26}
      width={size * 0.76}
      height={size * 0.48}
      rx={0}
      ry={0}
    />
  ),
};

const PALETTE = [
  { ring: "ring-violet-200/70", bg: "from-violet-100 to-violet-50", stroke: "#7c3aed" },
  { ring: "ring-emerald-200/70", bg: "from-emerald-100 to-emerald-50", stroke: "#059669" },
  { ring: "ring-rose-200/70", bg: "from-rose-100 to-rose-50", stroke: "#e11d48" },
  { ring: "ring-amber-200/70", bg: "from-amber-100 to-amber-50", stroke: "#d97706" },
  { ring: "ring-sky-200/70", bg: "from-sky-100 to-sky-50", stroke: "#0284c7" },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function normalizeQuestion(q) {
  if (Array.isArray(q?.pairs) && q.pairs.length >= 3) {
    return q.pairs.slice(0, 3).map((p, idx) => ({
      id: String(p.id ?? `p${idx}`),
      shape: String(p.shape),
    }));
  }

  const opts = Array.isArray(q?.options) ? q.options.map(String) : [];
  const uniq = Array.from(new Set([String(q?.targetShape ?? ""), ...opts].filter(Boolean)));
  const three = uniq.slice(0, 3);
  if (three.length >= 3) return three.map((s, idx) => ({ id: `p${idx}`, shape: s }));

  return null;
}

function ShapeToken({ shape, stroke = "#3b82f6", className, glow = true }) {
  const size = 56;
  const path = SHAPE_PATHS[shape] ? SHAPE_PATHS[shape](size) : SHAPE_PATHS.square(size);
  return (
    <div
      className={cn(
        "relative grid place-items-center rounded-3xl p-3",
        glow ? "shadow-[0_10px_24px_rgba(2,6,23,0.10)]" : "",
        className
      )}
      style={{
        filter: glow ? "drop-shadow(0 10px 16px rgba(0,0,0,0.12))" : undefined,
      }}
      aria-hidden="true"
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g fill="none" stroke={stroke} strokeWidth="5" strokeLinejoin="round">
          {path}
        </g>
      </svg>
    </div>
  );
}

function SparklesBg() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-violet-300/30 blur-3xl" />
      <div className="absolute -bottom-28 -right-24 h-72 w-72 rounded-full bg-sky-300/30 blur-3xl" />
      <div className="absolute left-1/2 top-10 h-56 w-56 -translate-x-1/2 rounded-full bg-emerald-300/20 blur-3xl" />
      <div className="absolute inset-0 [background:radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.07)_1px,transparent_0)] [background-size:18px_18px] opacity-40" />
    </div>
  );
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
  const [done, setDone] = React.useState(false);

  const [selectedTopId, setSelectedTopId] = React.useState(null);
  const [connections, setConnections] = React.useState([]);
  const [toast, setToast] = React.useState(null);

  const startAtRef = React.useRef(Date.now());
  const boardRef = React.useRef(null);
  const topRefs = React.useRef(new Map());
  const bottomRefs = React.useRef(new Map());

  const q = questions[idx];
  const pairs = normalizeQuestion(q);

  const { tops, bottoms } = React.useMemo(() => {
    if (!pairs) return { tops: [], bottoms: [] };

    const colors = shuffle(PALETTE).slice(0, 3);
    const base = pairs.slice(0, 3).map((p, i) => ({ ...p, color: colors[i] }));

    const bottom = base.map((p) => ({ id: p.id, shape: p.shape, color: p.color }));
    const top = shuffle(base).map((p) => ({ id: p.id, shape: p.shape, color: p.color }));
    return { tops: top, bottoms: bottom };
  }, [idx, q]);

  React.useEffect(() => {
    setSelectedTopId(null);
    setConnections([]);
    setToast(null);
  }, [idx]);

  const canInteract = !!pairs && !done;

  const usedTop = React.useMemo(() => new Set(connections.map((c) => c.topId)), [connections]);
  const usedBottom = React.useMemo(() => new Set(connections.map((c) => c.bottomId)), [connections]);

  const getPoint = React.useCallback((el) => {
    const board = boardRef.current;
    if (!board || !el) return null;
    const br = board.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return { x: r.left - br.left + r.width / 2, y: r.top - br.top + r.height / 2 };
  }, []);

  const connect = React.useCallback(
    (bottomId) => {
      if (!canInteract) return;
      if (!selectedTopId) return;
      if (usedBottom.has(bottomId)) return;
      if (usedTop.has(selectedTopId)) return;

      const ok = String(selectedTopId) === String(bottomId);
      const next = [...connections, { topId: selectedTopId, bottomId, ok }];

      setConnections(next);
      setSelectedTopId(null);

      setToast(ok ? "✅ Chính xác!" : "❌ Sai rồi, thử lại nha!");
      window.clearTimeout(connect._t);
      connect._t = window.setTimeout(() => setToast(null), 900);

      if (!ok) {
        const topId = selectedTopId;
        window.clearTimeout(connect._w);
        connect._w = window.setTimeout(() => {
          setConnections((xs) => xs.filter((c) => !(c.topId === topId && c.bottomId === bottomId)));
        }, 550);
        return;
      }

      const allMade = next.length >= 3;
      const allOk = allMade && next.every((c) => c.ok);
      if (allOk) {
        setCorrect((c) => c + 1);
        window.setTimeout(() => {
          if (idx + 1 < totalQuestions) setIdx((x) => x + 1);
          else {
            setDone(true);
            const playDurations = Math.floor((Date.now() - startAtRef.current) / 1000);
            onFinish?.({ correctAnswers: correct + 1, totalQuestions, playDurations });
          }
        }, 700);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [canInteract, selectedTopId, usedBottom, usedTop, connections, idx, totalQuestions, onFinish, correct]
  );

  const undoLast = () => {
    if (!connections.length || !canInteract) return;
    setConnections((xs) => xs.slice(0, -1));
    setSelectedTopId(null);
  };

  const [, force] = React.useState(0);
  React.useEffect(() => {
    const ro = new ResizeObserver(() => force((x) => x + 1));
    if (boardRef.current) ro.observe(boardRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <Card className="relative p-5 sm:p-7 overflow-hidden">
      <SparklesBg />

      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            ✨ {game?.name || "Shape Connect"}
          </div>
          <div className="mt-1 text-xl font-extrabold text-slate-900">Hãy nối hình cho đúng</div>
          <div className="mt-1 text-sm font-semibold text-slate-600">
            Chạm hình ở <span className="font-extrabold">trên</span> → chạm ô ở{" "}
            <span className="font-extrabold">dưới</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-full bg-white/80 backdrop-blur px-3 py-1 text-xs font-extrabold text-slate-700 ring-1 ring-slate-200">
            {Math.min(idx + 1, totalQuestions)}/{totalQuestions}
          </div>

          <button
            onClick={undoLast}
            type="button"
            disabled={!connections.length || !canInteract}
            className={cn(
              "rounded-2xl px-4 py-2 text-sm font-extrabold shadow-sm ring-1 transition",
              !connections.length || !canInteract
                ? "bg-white/60 text-slate-400 ring-slate-200"
                : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50 active:scale-[0.99]"
            )}
          >
            ↩️ Hoàn tác
          </button>

          <button
            onClick={onExit}
            type="button"
            className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-extrabold text-white shadow-md hover:bg-slate-800 active:scale-[0.99]"
          >
            ⟵ Quay lại
          </button>
        </div>
      </div>

      {!pairs ? (
        <div className="relative z-10 mt-6 rounded-3xl border border-slate-200 bg-white/70 p-5 text-sm text-slate-700">
          Không có câu hỏi hợp lệ trong configData.
        </div>
      ) : (
        <div className="relative z-10 mt-6">
          <div
            ref={boardRef}
            className={cn(
              "relative overflow-hidden rounded-3xl border border-slate-200 bg-white/70 p-4 sm:p-6",
              "shadow-[0_10px_30px_rgba(2,6,23,0.08)]"
            )}
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, rgba(124,58,237,0.08) 0%, transparent 45%), radial-gradient(circle at 80% 70%, rgba(14,165,233,0.08) 0%, transparent 45%)",
            }}
          >
            <svg className="pointer-events-none absolute inset-0 h-full w-full">
              {connections.map((c, i) => {
                const tEl = topRefs.current.get(c.topId);
                const bEl = bottomRefs.current.get(c.bottomId);
                const tp = getPoint(tEl);
                const bp = getPoint(bEl);
                if (!tp || !bp) return null;

                const midY = (tp.y + bp.y) / 2;
                const d = `M ${tp.x} ${tp.y} C ${tp.x} ${midY}, ${bp.x} ${midY}, ${bp.x} ${bp.y}`;

                return (
                  <path
                    key={`${c.topId}_${c.bottomId}_${i}`}
                    d={d}
                    fill="none"
                    stroke={c.ok ? "rgba(16,185,129,0.9)" : "rgba(244,63,94,0.9)"}
                    strokeWidth="6"
                    strokeLinecap="round"
                    style={{ filter: "drop-shadow(0 8px 12px rgba(2,6,23,0.10))" }}
                  />
                );
              })}
            </svg>

            <div className="flex items-center justify-between">
              <div className="text-sm font-extrabold text-slate-900">Hình ở trên</div>
              <div className="text-xs font-semibold text-slate-500">Chọn 1 hình để nối</div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-3">
              {tops.map((t) => {
                const picked = selectedTopId === t.id;
                const used = usedTop.has(t.id);

                return (
                  <button
                    key={t.id}
                    type="button"
                    disabled={!canInteract || used}
                    onClick={() => setSelectedTopId((cur) => (cur === t.id ? null : t.id))}
                    ref={(el) => {
                      if (!el) topRefs.current.delete(t.id);
                      else topRefs.current.set(t.id, el);
                    }}
                    className={cn(
                      "group rounded-3xl p-3 transition active:scale-[0.99] ring-1 bg-gradient-to-br",
                      t.color.bg,
                      t.color.ring,
                      used ? "opacity-45" : "hover:shadow-lg",
                      picked ? "ring-2 ring-slate-900 shadow-lg" : "ring-1"
                    )}
                    style={{ transform: picked ? "translateY(-2px)" : undefined }}
                  >
                    <div className="grid place-items-center">
                      <ShapeToken shape={t.shape} stroke={t.color.stroke} className="bg-white/70" />
                    </div>
                    <div className="mt-2 text-center text-xs font-extrabold text-slate-700">
                      {used ? "Đã nối" : picked ? "Đang chọn" : "Chạm"}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="my-5 h-px bg-slate-200/70" />

            <div className="flex items-center justify-between">
              <div className="text-sm font-extrabold text-slate-900">Ô ở dưới</div>
              <div className="text-xs font-semibold text-slate-500">Chạm ô để nối</div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-3">
              {bottoms.map((b) => {
                const used = usedBottom.has(b.id);
                const linked = connections.find((c) => c.bottomId === b.id);
                const ok = linked?.ok;

                return (
                  <button
                    key={b.id}
                    type="button"
                    disabled={!canInteract || used || !selectedTopId}
                    onClick={() => connect(b.id)}
                    ref={(el) => {
                      if (!el) bottomRefs.current.delete(b.id);
                      else bottomRefs.current.set(b.id, el);
                    }}
                    className={cn(
                      "relative rounded-3xl p-3 transition active:scale-[0.99] ring-1",
                      "bg-white/70 ring-slate-200",
                      selectedTopId && !used ? "hover:shadow-lg" : "",
                      used ? "opacity-60" : ""
                    )}
                  >
                    <div className="grid place-items-center">
                      <ShapeToken
                        shape={b.shape}
                        stroke={
                          ok
                            ? "rgba(16,185,129,0.95)"
                            : used
                            ? "rgba(244,63,94,0.95)"
                            : "rgba(100,116,139,0.7)"
                        }
                        className={cn(
                          "bg-white/60",
                          ok ? "ring-2 ring-emerald-200" : used ? "ring-2 ring-rose-200" : "ring-1 ring-slate-200"
                        )}
                        glow={false}
                      />
                    </div>

                    <div className="mt-2 text-center text-xs font-extrabold">
                      {used ? (
                        ok ? (
                          <span className="text-emerald-700">Đúng</span>
                        ) : (
                          <span className="text-rose-700">Sai</span>
                        )
                      ) : (
                        <span className={cn(selectedTopId ? "text-slate-700" : "text-slate-400")}>
                          {selectedTopId ? "Chạm để nối" : "Chọn hình trước"}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {toast && (
              <div className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2">
                <div className="rounded-full bg-slate-900/90 px-5 py-2 text-sm font-extrabold text-white shadow-xl">
                  {toast}
                </div>
              </div>
            )}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="rounded-2xl bg-white/80 px-4 py-2 text-sm font-extrabold text-slate-800 ring-1 ring-slate-200">
              Đúng: <span className="text-emerald-700">{correct}</span>
            </div>

            {submitting ? (
              <div className="text-sm font-semibold text-slate-600">Đang lưu kết quả…</div>
            ) : submitMsg ? (
              <div className="text-sm font-semibold text-slate-700">{submitMsg}</div>
            ) : (
              <div className="text-sm font-semibold text-slate-600">
                Đã nối đúng:{" "}
                <span className="text-slate-900">{connections.filter((c) => c.ok).length}/3</span>
              </div>
            )}
          </div>

          {done && (
            <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-center">
              <div className="text-2xl font-extrabold text-emerald-800">🎉 Hoàn thành!</div>
              <div className="mt-2 text-sm font-semibold text-emerald-700">Bạn đã xong tất cả câu hỏi.</div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
