import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getLessonContentsByLessonIdService } from "../../../services/education/education.service";

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

  // ✅ scroll container ref
  const scrollRef = React.useRef(null);

  // ✅ progress theo scroll (0..1)
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

        setContents(data);
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

  return (
    // ✅ toàn bộ trang scroll trong container này
    <div ref={scrollRef} style={styles.shell}>
      {/* ✅ Top Bar sticky */}
      <div style={styles.topbar} className="border-b border-slate-200">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Back"
        >
          <i className="fa-solid fa-xmark h-5 w-5" aria-hidden="true" />
        </button>

        {/* ✅ Progress Bar theo scroll */}
        <div className="flex-1 mx-8">
          <div className="h-1 bg-gray-200 rounded-full">
            <div
              className="h-1 bg-blue-500 rounded-full transition-all duration-150"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{Math.round(progress * 100)}%</span>
          <i className="fa-solid fa-bolt text-green-500 h-4 w-4" aria-hidden="true" />
        </div>
      </div>

      {/* Nội dung */}
      <div style={styles.page}>
        <Hero title={state.lessonName || "Lesson"} desc={lessonId} />

        {loading && <div style={styles.section}>Đang tải nội dung...</div>}
        {!loading && error && <div style={{ ...styles.section, color: "crimson" }}>{error}</div>}

        {!loading && !error && (
          <>
            {contents.map((item) => {
              const type = (item?.contentType || "").toLowerCase();
              const title = `#${item?.orderIndex ?? ""} ${item?.contentType ?? ""}`.trim();

              if (type === "text") {
                return (
                  <SectionText
                    key={item.lessonContentId}
                    title={title}
                    content={item?.textContent || ""}
                  />
                );
              }

              if (type === "image") {
                return (
                  <SectionImage
                    key={item.lessonContentId}
                    title={title}
                    img={item?.mediaUrl || ""}
                    caption=""
                  />
                );
              }

              return (
                <SectionText
                  key={item.lessonContentId}
                  title={title}
                  content={item?.textContent || item?.formulaLatex || "Chưa hỗ trợ UI cho loại này."}
                />
              );
            })}

            {!showQuiz ? (
              <div style={{ ...styles.section, paddingTop: 0 }}>
                <button
                  onClick={() => setShowQuiz(true)}
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                >
                  Bắt đầu mini game
                </button>
              </div>
            ) : (
              <MiniGame />
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- Components ---------- */
function Hero({ title, desc }) {
  return (
    <div style={styles.hero}>
      <h1 style={styles.heroTitle}>{title}</h1>
      <p style={styles.heroDesc}>{desc}</p>
    </div>
  );
}

function SectionText({ title, content }) {
  return (
    <div style={styles.section}>
      <h2>{title}</h2>
      <p>{content}</p>
    </div>
  );
}

function SectionImage({ title, img, caption }) {
  return (
    <div style={styles.section}>
      <h2>{title}</h2>
      {img ? <img src={img} alt="" style={styles.image} /> : <p>(Không có ảnh)</p>}
      {caption ? <small>{caption}</small> : null}
    </div>
  );
}

function MiniGame() {
  const [answer, setAnswer] = React.useState(null);

  return (
    <div style={{ ...styles.section, ...styles.game }}>
      <h2>Mini Game</h2>
      <p>Thuật toán nào luôn chia bài toán thành các phần nhỏ?</p>

      <div style={styles.options}>
        <button onClick={() => setAnswer("wrong")}>Linear Search</button>
        <button onClick={() => setAnswer("correct")}>Divide and Conquer</button>
        <button onClick={() => setAnswer("wrong")}>Brute Force</button>
      </div>

      {answer === "correct" && <p style={styles.correct}>Đúng</p>}
      {answer === "wrong" && <p style={styles.wrong}>Sai</p>}
    </div>
  );
}

/* ---------- Styles ---------- */
const styles = {
  // ✅ full-height scroll container
  shell: {
    height: "100vh",
    overflowY: "auto",
    background: "white",
  },
  topbar: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    background: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 24px",
  },
  page: {
    maxWidth: 900,
    margin: "0 auto",
    paddingBottom: 80,
    fontFamily: "system-ui, sans-serif",
  },
  hero: { padding: "80px 20px", textAlign: "center", background: "#f5f7fb" },
  heroTitle: { fontSize: 42, marginBottom: 16 },
  heroDesc: { fontSize: 16, color: "#555", wordBreak: "break-word" },
  section: { padding: "60px 20px", lineHeight: 1.6 },
  image: { width: "100%", borderRadius: 12, marginTop: 20, marginBottom: 8 },
  game: { background: "#fafafa", borderRadius: 16 },
  options: { display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" },
  correct: { color: "green", marginTop: 12 },
  wrong: { color: "red", marginTop: 12 },
};
