import { useMemo, useRef, useState } from "react";

/**
 * Props:
 * - lesson: backend lesson OR legacy lesson
 *    Backend: { lessonId, lessonName, estimatedTime, status, chapterName }
 *    Legacy:  { id, title, summary, duration, difficulty, status, type }
 * - courseImage?: string
 * - onComplete: (lessonId) => void
 */
export default function LessonView({ lesson, courseImage, onComplete }) {
  const quizRef = useRef(null);
  const contentRef = useRef(null);

  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // ✅ Normalize lesson shape (support both backend + legacy)
  const viewLesson = useMemo(() => {
    const id = lesson?.lessonId ?? lesson?.id ?? "";
    const title = lesson?.lessonName ?? lesson?.title ?? "Bài học";
    const summary = lesson?.summary ?? (lesson?.chapterName ? `Thuộc: ${lesson.chapterName}` : "");
    const duration = lesson?.estimatedTime ?? lesson?.duration ?? 0;
    const difficulty = lesson?.difficulty ?? "Cơ bản";

    return { id, title, summary, duration, difficulty, raw: lesson };
  }, [lesson]);

  // sample question (you can fetch per lesson)
  const question = useMemo(() => {
    // ví dụ special-case 1 lesson
    if (viewLesson.id === "area-perimeter") {
      return {
        text: "Hình chữ nhật có L=6 và W=3. Chu vi bằng bao nhiêu?",
        options: [
          { key: "A", label: "9" },
          { key: "B", label: "12" },
          { key: "C", label: "18" },
          { key: "D", label: "24" },
        ],
        correct: "C",
      };
    }

    return {
      text: `Câu hỏi nhanh về: ${viewLesson.title}`,
      options: [
        { key: "A", label: "Đáp án A" },
        { key: "B", label: "Đáp án B" },
        { key: "C", label: "Đáp án C" },
        { key: "D", label: "Đáp án D" },
      ],
      correct: "A",
    };
  }, [viewLesson.id, viewLesson.title]);

  const goToQuiz = () => {
    quizRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToTop = () => {
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = (optKey) => {
    setSelected(optKey);

    if (optKey === question.correct) {
      setFeedback("Chính xác! Bạn đã hoàn thành bài học.");
      setTimeout(() => {
        // ✅ return UUID lessonId (or legacy id)
        onComplete?.(viewLesson.id);
      }, 700);
    } else {
      setFeedback("Chưa đúng — thử lại nhé.");
    }
  };

  const primaryBtn =
    "inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800 active:bg-slate-900 transition";
  const ghostBtn =
    "inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50 active:bg-white transition";

  return (
    <div ref={contentRef} className="space-y-6 max-h-[75vh] overflow-y-auto">
      {/* Hero: title + short theory */}
      <div className="md:flex md:items-start md:gap-6">
        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-2">{viewLesson.title}</h3>
          <p className="text-sm text-slate-500 mb-4">{viewLesson.summary}</p>

          <div className="prose max-w-none text-sm mb-4">
            <p>
              Phần này trình bày lý thuyết ngắn gọn. Mô tả trực quan, ví dụ, và khái niệm chính để bạn nắm nhanh trước khi làm bài.
            </p>
            <p>
              (Bạn có thể thay nội dung tĩnh bằng markdown hoặc fetch nội dung chi tiết cho từng lesson từ backend.)
            </p>
          </div>

          <div className="flex gap-3">
            <button type="button" className={primaryBtn} onClick={goToQuiz}>
              Làm bài nhanh (Quiz)
            </button>

            <button type="button" className={ghostBtn} onClick={scrollToTop}>
              Quay lại đầu
            </button>
          </div>
        </div>

        <div className="w-48 mt-4 md:mt-0 flex-shrink-0">
          <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
            {courseImage ? (
              <img src={courseImage} alt="Illustration" className="w-full h-40 object-cover" />
            ) : (
              <div className="w-full h-40 flex items-center justify-center text-xs text-slate-400">No image</div>
            )}
          </div>

          <div className="text-xs text-slate-500 mt-2">
            {viewLesson.duration ? `${viewLesson.duration} phút` : "—"} • {viewLesson.difficulty}
          </div>
        </div>
      </div>

      {/* separator */}
      <div className="h-px bg-slate-100" />

      {/* Quiz area */}
      <div ref={quizRef} className="space-y-3">
        <div className="text-lg font-semibold">Câu hỏi nhanh</div>
        <div className="text-sm mb-2">{question.text}</div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {question.options.map((opt) => {
            const isSelected = selected === opt.key;
            const isCorrect = opt.key === question.correct;

            const base =
              "text-left p-3 rounded-lg border bg-white hover:shadow-sm transition flex gap-2";
            const selectedCls = isSelected
              ? isCorrect
                ? "border-green-500 bg-green-50"
                : "border-red-400 bg-red-50"
              : "border-slate-200";

            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => submit(opt.key)}
                className={`${base} ${selectedCls}`}
              >
                <div className="font-semibold">{opt.key}.</div>
                <div className="flex-1">{opt.label}</div>
              </button>
            );
          })}
        </div>

        {feedback && (
          <div className="text-sm mt-2">
            <div
              className={`inline-block px-3 py-2 rounded ${
                selected === question.correct
                  ? "bg-green-50 text-green-700"
                  : "bg-yellow-50 text-yellow-800"
              }`}
            >
              {feedback}
            </div>
          </div>
        )}
      </div>

      <div className="h-6" />
      <div className="text-xs text-slate-500">Kết thúc nội dung</div>
    </div>
  );
}
