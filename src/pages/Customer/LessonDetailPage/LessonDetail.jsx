// src/pages/LessonDetail.jsx
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const FALLBACK_LESSON = {
  id: "unknown",
  title: "Bài học",
  summary: "Nội dung sẽ sớm được cập nhật.",
  duration: "10 phút",
  type: "lesson",
};

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80";

export default function LessonDetail() {
  const { slug = "", lessonId = "" } = useParams();
  const navigate = useNavigate();

  const [completed, setCompleted] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  const lesson = useMemo(() => {
    switch (lessonId) {
      case "area-perimeter":
        return {
          id: lessonId,
          title: "Chu vi và diện tích",
          summary:
            "Chu vi là tổng độ dài các cạnh, diện tích là phần bề mặt bên trong hình.",
          duration: "14 phút",
          type: "lesson",
        };
      case "welcome":
        return {
          id: lessonId,
          title: "Chào mừng đến với lập trình",
          summary: "Các khái niệm khởi đầu về tư duy lập trình.",
          duration: "5 phút",
          type: "lesson",
        };
      default:
        return FALLBACK_LESSON;
    }
  }, [lessonId]);

  const quiz = useMemo(() => {
    if (lesson.id === "area-perimeter") {
      return {
        question: "Hình chữ nhật có L=6 và W=3. Chu vi bằng bao nhiêu?",
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
      question: "Chọn đáp án đúng nhất cho nội dung vừa học?",
      options: [
        { key: "A", label: "A" },
        { key: "B", label: "B" },
        { key: "C", label: "C" },
        { key: "D", label: "D" },
      ],
      correct: "A",
    };
  }, [lesson.id]);

  const primaryBtn =
    "inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3 text-lg font-medium text-white transition-all duration-300 hover:bg-blue-700 hover:scale-105 active:scale-100";
  const outlineBtn =
    "inline-flex h-16 w-full items-center justify-start rounded-lg border-2 border-slate-200 bg-white p-4 text-left transition-all duration-300 hover:border-blue-500 hover:bg-blue-50 hover:scale-105 active:scale-100";

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Back"
        >
          {/* FiX -> Font Awesome X */}
          <i className="fa-solid fa-xmark h-5 w-5" aria-hidden="true" />
        </button>

        {/* Progress Bar */}
        <div className="flex-1 mx-8">
          <div className="h-1 bg-gray-200 rounded-full">
            <div
              className="h-1 bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: showQuiz ? "100%" : "30%" }}
            />
          </div>
        </div>

        {/* Score/Energy indicator */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">1</span>
          {/* FiZap -> Font Awesome bolt */}
          <i
            className="fa-solid fa-bolt text-green-500 h-4 w-4"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="relative overflow-hidden">
          {/* Theory Section */}
          <div
            className={`transition-all duration-700 ease-in-out ${
              showQuiz
                ? "opacity-0 transform translate-x-[-100%] absolute inset-0"
                : "opacity-100 transform translate-x-0"
            }`}
          >
            <div className="text-center space-y-8">
              <h1 className="text-4xl font-bold text-gray-900">{lesson.title}</h1>

              <div className="space-y-6 text-left max-w-3xl mx-auto">
                <p className="text-lg text-gray-700 leading-relaxed">
                  {lesson.id === "area-perimeter" ? (
                    <>
                      Bạn có biết tại sao các tòa nhà cần có hệ thống thoát nước
                      không?
                      <br />
                      <br />
                      Chu vi và diện tích là hai khái niệm cơ bản trong hình học.
                      Chu vi là tổng độ dài các cạnh bao quanh một hình, còn diện
                      tích là phần bề mặt bên trong hình đó. Hiểu rõ hai khái
                      niệm này giúp chúng ta tính toán chính xác trong nhiều tình
                      huống thực tế.
                    </>
                  ) : (
                    <>
                      Chào mừng bạn đến với thế giới lập trình!
                      <br />
                      <br />
                      Lập trình không chỉ là viết code, mà còn là cách tư duy logic
                      để giải quyết vấn đề. Hãy bắt đầu với những khái niệm cơ bản
                      nhất để xây dựng nền tảng vững chắc.
                    </>
                  )}
                </p>
              </div>

              {/* Illustration */}
              <div className="max-w-2xl mx-auto">
                <img
                  src={HERO_IMAGE}
                  alt={lesson.title}
                  className="w-full h-64 object-cover rounded-lg shadow-lg"
                  loading="lazy"
                />
              </div>

              {/* Continue */}
              <div className="pt-8">
                <button
                  type="button"
                  onClick={() => setShowQuiz(true)}
                  className={primaryBtn}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>

          {/* Quiz Section */}
          <div
            className={`transition-all duration-700 ease-in-out ${
              showQuiz
                ? "opacity-100 transform translate-x-0"
                : "opacity-0 transform translate-x-[100%] absolute inset-0"
            }`}
          >
            <div className="text-center space-y-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Kiểm tra hiểu biết
              </h2>

              <div className="max-w-2xl mx-auto space-y-6">
                <p className="text-lg text-gray-700">{quiz.question}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {quiz.options.map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      className={outlineBtn}
                      onClick={() => {
                        if (opt.key === quiz.correct) {
                          setCompleted(true);
                          setTimeout(() => navigate(-1), 1000);
                        } else {
                          window.alert("Chưa đúng, thử lại nhé!");
                        }
                      }}
                    >
                      <span className="mr-3 font-bold text-lg">{opt.key}.</span>
                      <span className="text-base">{opt.label}</span>
                    </button>
                  ))}
                </div>

                {completed && (
                  <div className="text-sm">
                    <span className="inline-block rounded-md bg-green-50 px-3 py-2 text-green-700">
                      Chính xác! Đang quay lại bài học...
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 text-xs text-slate-400">
          slug: {slug || "(none)"} • lessonId: {lessonId || "(none)"}
        </div>
      </div>
    </div>
  );
}
