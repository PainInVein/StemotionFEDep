// src/pages/CourseDetail.jsx
import { useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LessonView from "../../../components/common/LessonView"; // sửa path nếu khác

import { FaPlayCircle, FaStar, FaTrophy, FaLock } from "react-icons/fa";
import { FiCheckCircle, FiClock } from "react-icons/fi";

/* --- sample library (ReactJS) --- */
const COURSE_LIBRARY = [
  {
    title: "Lập trình trực quan cơ bản",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
    category: "Coding",
    description:
      "Bắt đầu với lập trình trực quan qua các bài học tương tác, kéo-thả dễ hiểu.",
    totalLessons: 12,
    totalExercises: 45,
    estimatedTime: "2-3 giờ",
    sections: [
      {
        id: "intro",
        title: "Giới thiệu",
        summary: "Tư duy thuật toán và công cụ.",
        lessons: [
          {
            id: "welcome",
            title: "Chào mừng đến với lập trình",
            summary: "Tìm hiểu về tư duy lập trình",
            duration: "5 phút",
            difficulty: "Dễ",
            status: "completed",
            type: "lesson",
          },
          {
            id: "visual-blocks",
            title: "Khối lệnh trực quan",
            summary: "Làm quen với giao diện kéo-thả",
            duration: "15 phút",
            difficulty: "Dễ",
            status: "current",
            type: "lesson",
          },
          {
            id: "variables-quiz",
            title: "Kiểm tra biến",
            summary: "Bài tập về biến và kiểu dữ liệu",
            duration: "10 phút",
            difficulty: "Trung bình",
            status: "locked",
            type: "quiz",
          },
        ],
      },
    ],
  },
];

const slugify = (text) =>
  (text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function CourseDetail() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();

  // giữ lại state nếu bạn muốn đánh dấu completed client-side
  const [completedMap, setCompletedMap] = useState({});
  const timelineRef = useRef(null);

  const course = useMemo(() => {
    const f = COURSE_LIBRARY.find((c) => slugify(c.title) === slug);
    return f ?? COURSE_LIBRARY[0];
  }, [slug]);

  const openLesson = (lesson) => {
    if (lesson.status === "locked") return;
    navigate(`/courses/${slug}/lesson/${lesson.id}`);
  };

  const markCompleted = (lessonId) => {
    setCompletedMap((p) => ({ ...p, [lessonId]: true }));
  };

  const getDerivedStatus = (lesson) =>
    completedMap[lesson.id] ? "completed" : lesson.status;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <section className="container mx-auto px-4 py-8">
        <nav className="text-sm text-slate-500 mb-6">
          <Link to="/courses" className="text-sky-600 hover:underline">
            Khóa học
          </Link>{" "}
          / <span className="font-medium text-slate-700">{course.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* main content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl shadow border border-slate-200 bg-white overflow-hidden">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-72 object-cover"
                loading="lazy"
              />
              <div className="p-6">
                <h1 className="text-3xl font-extrabold mb-1">{course.title}</h1>
                <p className="text-sm text-slate-500 mb-3">
                  {course.description}
                </p>

                <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <FaPlayCircle className="h-4 w-4" />
                    {course.totalLessons} bài học
                  </div>
                  <div className="flex items-center gap-2">
                    <FaStar className="h-4 w-4" />
                    {course.totalExercises} bài tập
                  </div>
                  <div className="flex items-center gap-2">
                    <FiClock className="h-4 w-4" />
                    {course.estimatedTime}
                  </div>
                </div>
              </div>
            </div>

            {/* sections + lessons list */}
            <div className="space-y-6">
              {course.sections.map((sec) => (
                <div key={sec.id} className="bg-white border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h2 className="font-semibold text-lg">{sec.title}</h2>
                      <p className="text-sm text-slate-500">{sec.summary}</p>
                    </div>
                    <div className="text-sm text-slate-500">
                      {sec.lessons.length} bài
                    </div>
                  </div>

                  <div className="space-y-2">
                    {sec.lessons.map((lesson) => {
                      const status = getDerivedStatus(lesson);
                      const locked = lesson.status === "locked";

                      return (
                        <div
                          key={lesson.id}
                          className={`p-3 rounded flex items-center justify-between transition ${
                            locked
                              ? "opacity-60 cursor-not-allowed"
                              : "cursor-pointer hover:bg-slate-50"
                          }`}
                          onClick={() => openLesson(lesson)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") openLesson(lesson);
                          }}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 flex items-center justify-center">
                              {status === "completed" ? (
                                <FiCheckCircle className="text-green-600 text-xl" />
                              ) : status === "current" ? (
                                <div className="h-3 w-3 rounded-full bg-sky-500 animate-pulse" />
                              ) : locked ? (
                                <FaLock className="text-slate-400" />
                              ) : (
                                <FaPlayCircle className="text-slate-400 text-xl" />
                              )}
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <div className="font-medium truncate">
                                  {lesson.title}
                                </div>
                                <div className="text-xs text-slate-500">
                                  • {lesson.duration}
                                </div>
                              </div>
                              <div className="text-xs text-slate-500 truncate">
                                {lesson.summary}
                              </div>
                            </div>
                          </div>

                          <div className="text-xs text-slate-500">
                            {lesson.type === "quiz" ? "Quiz" : lesson.type}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* (optional) render LessonView directly if you want inline view */}
            {/* <LessonView lesson={...} courseImage={course.image} onComplete={markCompleted} /> */}
          </div>

          {/* right timeline (sticky) */}
          <aside className="lg:col-span-1">
            <div
              ref={timelineRef}
              className="sticky top-24 bg-transparent p-4 rounded-xl"
            >
              <div className="bg-white border border-slate-200 rounded-xl p-4 mb-4">
                <div className="font-semibold mb-2">Theo dõi tiến độ</div>
                <div className="text-sm text-slate-500 mb-2">
                  Cuộn hoặc bấm 1 bài để xem chi tiết
                </div>

                <div className="divide-y">
                  {course.sections.flatMap((sec) =>
                    sec.lessons.map((lesson) => {
                      const status = getDerivedStatus(lesson);
                      const locked = lesson.status === "locked";

                      return (
                        <div
                          id={`tl-${lesson.id}`}
                          key={lesson.id}
                          className={`flex items-start gap-3 py-3 px-2 rounded transition ${
                            locked
                              ? "opacity-60 cursor-not-allowed"
                              : "cursor-pointer hover:bg-slate-50"
                          }`}
                          onClick={() => openLesson(lesson)}
                        >
                          <div className="flex flex-col items-center">
                            <div
                              className={`h-3 w-3 rounded-full ${
                                status === "completed"
                                  ? "bg-green-500"
                                  : status === "current"
                                  ? "bg-sky-500"
                                  : "bg-gray-300"
                              }`}
                            />
                            <div className="h-full w-[2px] bg-gray-200 mt-2" />
                          </div>

                          <div className="min-w-0">
                            <div className="text-sm font-medium truncate">
                              {lesson.title}
                            </div>
                            <div className="text-xs text-slate-500">
                              {lesson.duration} • {lesson.type}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="font-semibold mb-2">Thông tin</div>
                <div className="text-sm text-slate-500">
                  Thời gian ước tính: {course.estimatedTime}
                </div>

                <div className="mt-3">
                  <Link
                    to="/student-signup"
                    className="inline-flex w-full items-center justify-center text-center bg-sky-600 text-white px-3 py-2 rounded-md hover:bg-sky-700 transition"
                  >
                    Bắt đầu khóa học
                  </Link>
                </div>

                {/* optional: little badge */}
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  <FaTrophy /> Hoàn thành để nhận huy hiệu
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Modal removed: lessons navigate to full page */}
    </div>
  );
}
