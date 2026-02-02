import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getLessonContentsByLessonIdService } from "../../../services/education/education.service";
import GamesHub from "../../Games/GamesHub";

const extractUuidFromSlug = (slug = "") => {
  const maybe = slug.slice(-36);
  return /^[0-9a-fA-F-]{36}$/.test(maybe) ? maybe : "";
};

function useScrollProgress(containerRef) {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const el = containerRef?.current;
    if (!el) return;

    let rafId = null;

    const calc = () => {
      const scrollTop = el.scrollTop;
      const max = el.scrollHeight - el.clientHeight;
      const p = max <= 0 ? 0 : scrollTop / max;
      setProgress(Math.max(0, Math.min(1, p)));
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        calc();
      });
    };

    calc();
    el.addEventListener("scroll", onScroll, { passive: true });

    const ro = new ResizeObserver(() => calc());
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [containerRef]);

  return progress;
}

/* ---------- Tiny Icons (no deps) ---------- */
function XIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
function BoltIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M13 2L3 14h7l-1 8 12-14h-7l-1-6z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---------- UI Helpers ---------- */
function cn(...xs) {
  return xs.filter(Boolean).join(" ");
}

function Chip({ children, className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm",
        className
      )}
    >
      {children}
    </span>
  );
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

function Divider() {
  return <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />;
}

/* ---------- Page ---------- */
export default function LessonDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lessonSlug = "" } = useParams();

  const state = location.state || {};
  const lessonId = state.lessonId || extractUuidFromSlug(lessonSlug);

  const [showQuiz, setShowQuiz] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [contents, setContents] = React.useState([]);

  const scrollRef = React.useRef(null);
  const progress = useScrollProgress(scrollRef);

  React.useEffect(() => {
    let alive = true;

    const run = async () => {
      try {
        setLoading(true);
        setError("");

        if (!lessonId) throw new Error("Không tìm thấy lessonId trong URL");

        const data = await getLessonContentsByLessonIdService(lessonId);
        if (!alive) return;

        setContents(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!alive) return;
        setError(e?.message || "Load failed");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    };

    run();
    return () => {
      alive = false;
    };
  }, [lessonId]);

  const percent = Math.round(progress * 100);

  return (
    <div
      ref={scrollRef}
      className="h-screen overflow-y-auto bg-slate-50 text-slate-900"
    >
      {/* Sticky Topbar (Brilliant-ish) */}
      <div className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3 sm:px-6">
          <button
            onClick={() => navigate(-1)}
            className="group inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition hover:bg-slate-50 active:scale-[0.98]"
            aria-label="Back"
            type="button"
          >
            <XIcon className="h-5 w-5 text-slate-700 transition group-hover:text-slate-900" />
          </button>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="truncate text-sm font-semibold text-slate-800">
                {state.lessonName || "Lesson"}
              </div>
              <div className="ml-3 flex items-center gap-2">
                <Chip className="bg-white/60">
                  <span className="tabular-nums">{percent}%</span>
                </Chip>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <BoltIcon className="h-4 w-4" />
                </span>
              </div>
            </div>

            {/* progress bar */}
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200/70">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 transition-[width] duration-150"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 pb-24 pt-6 sm:px-6">
        <Hero title={state.lessonName || "Lesson"} desc={lessonId} />

        <div className="mt-8 space-y-6">
          {loading && (
            <Card className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 w-40 rounded bg-slate-200" />
                <div className="h-3 w-full rounded bg-slate-200" />
                <div className="h-3 w-5/6 rounded bg-slate-200" />
                <div className="h-3 w-3/4 rounded bg-slate-200" />
              </div>
              <div className="mt-4 text-sm text-slate-600">Đang tải nội dung…</div>
            </Card>
          )}

          {!loading && error && (
            <Card className="border-rose-200 bg-rose-50/60 p-6">
              <div className="text-sm font-semibold text-rose-700">Có lỗi</div>
              <div className="mt-1 text-sm text-rose-700/90">{error}</div>
            </Card>
          )}

          {!loading && !error && (
            <>
              {contents.map((item, idx) => {
                const type = (item?.contentType || "").toLowerCase();
                const title = `#${item?.orderIndex ?? idx + 1} ${item?.contentType ?? ""}`.trim();

                if (type === "text") {
                  return (
                    <SectionText
                      key={item.lessonContentId || `${idx}-text`}
                      title={title}
                      content={item?.textContent || ""}
                    />
                  );
                }

                if (type === "image") {
                  return (
                    <SectionImage
                      key={item.lessonContentId || `${idx}-img`}
                      title={title}
                      img={item?.mediaUrl || ""}
                      caption={item?.caption || ""}
                    />
                  );
                }

                return (
                  <SectionText
                    key={item.lessonContentId || `${idx}-fallback`}
                    title={title}
                    content={item?.textContent || item?.formulaLatex || "Chưa hỗ trợ UI cho loại này."}
                    tone="muted"
                  />
                );
              })}

              <Divider />

              {!showQuiz ? (
                <div className="flex justify-center pt-2">
                  <button
                    onClick={() => setShowQuiz(true)}
                    className="group inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.99]"
                    type="button"
                  >
                    <span>Bắt đầu mini game</span>
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                      {/* icon giữ nguyên */}
                      <BoltIcon className="h-4 w-4 text-white" />
                    </span>
                  </button>
                </div>
              ) : (
                <GamesHub lessonId={lessonId} onClose={() => setShowQuiz(false)} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Components ---------- */
function Hero({ title, desc }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-8 shadow-sm sm:p-10">
      {/* gradient blobs */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-violet-200/40 blur-3xl" />

      <div className="relative">
        <div className="flex flex-wrap items-center gap-2">
          <Chip className="bg-white/70">Learning</Chip>
          <Chip className="bg-white/70">Interactive</Chip>
          <Chip className="bg-white/70">Progress-based</Chip>
        </div>

        <h1 className="mt-4 text-balance text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {title}
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
          {desc}
        </p>
      </div>
    </div>
  );
}

function SectionText({ title, content, tone = "normal" }) {
  return (
    <Card className="p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium",
            tone === "muted"
              ? "bg-slate-100 text-slate-600"
              : "bg-blue-50 text-blue-700"
          )}
        >
          {tone === "muted" ? "Info" : "Reading"}
        </span>
      </div>

      <div className="mt-4">
        {/* prose-like without needing @tailwindcss/typography */}
        <p className="whitespace-pre-wrap text-[15px] leading-7 text-slate-700">
          {content}
        </p>
      </div>
    </Card>
  );
}

function SectionImage({ title, img, caption }) {
  return (
    <Card className="overflow-hidden">
      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm font-semibold text-slate-900">{title}</div>
          <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
            Visual
          </span>
        </div>

        <div className="mt-5">
          {img ? (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
              <img
                src={img}
                alt=""
                className="h-auto w-full object-cover"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-600">
              (Không có ảnh)
            </div>
          )}

          {caption ? (
            <div className="mt-3 text-sm text-slate-600">{caption}</div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

function MiniGame() {
  const [answer, setAnswer] = React.useState(null);

  const options = [
    { key: "A", value: "wrong", label: "Linear Search" },
    { key: "B", value: "correct", label: "Divide and Conquer" },
    { key: "C", value: "wrong", label: "Brute Force" },
  ];

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Mini Game
          </div>
          <h2 className="mt-1 text-xl font-extrabold text-slate-900">
            Chọn đáp án đúng
          </h2>
        </div>
        <Chip className="bg-white/70">1 câu hỏi</Chip>
      </div>

      <p className="mt-4 text-[15px] leading-7 text-slate-700">
        Thuật toán nào luôn chia bài toán thành các phần nhỏ?
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {options.map((opt) => {
          const selected = answer && (answer === opt.value);
          const isCorrect = opt.value === "correct";

          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => setAnswer(opt.value)}
              className={cn(
                "group rounded-2xl border px-4 py-4 text-left shadow-sm transition active:scale-[0.99]",
                answer == null
                  ? "border-slate-200 bg-white hover:bg-slate-50"
                  : selected
                    ? isCorrect
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-rose-200 bg-rose-50"
                    : "border-slate-200 bg-white opacity-70"
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",
                    answer == null
                      ? "bg-slate-100 text-slate-700 group-hover:bg-slate-200"
                      : selected
                        ? isCorrect
                          ? "bg-emerald-600 text-white"
                          : "bg-rose-600 text-white"
                        : "bg-slate-100 text-slate-700"
                  )}
                >
                  {opt.key}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    {opt.label}
                  </div>
                  <div className="mt-1 text-xs text-slate-600">
                    {opt.key === "B" ? "Chiến lược chia để trị" : "Một lựa chọn"}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {answer === "correct" && (
        <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          ✅ Đúng! Divide and Conquer chia bài toán thành các phần nhỏ hơn.
        </div>
      )}

      {answer === "wrong" && (
        <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          ❌ Sai rồi. Gợi ý: nghĩ về “chia để trị”.
        </div>
      )}
    </Card>
  );
}
