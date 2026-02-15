// //src/pages/Customer/LessonDetailPage/LessonDetail.jsx
// import React from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import InteractiveLessonViewer from "../../../components/common/InteractiveLessonViewer";

// const extractUuidFromSlug = (slug = "") => {
//   const maybe = slug.slice(-36);
//   return /^[0-9a-fA-F-]{36}$/.test(maybe) ? maybe : "";
// };

// /* ---------- Page ---------- */
// export default function LessonDetail() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { lessonSlug = "" } = useParams();

//   const state = location.state || {};
//   const lessonId = state.lessonId || extractUuidFromSlug(lessonSlug);

//   const handleLessonComplete = () => {
//     // Navigate back or show completion message
//     navigate(-1);
//   };

//   return (
//     <InteractiveLessonViewer
//       lessonId={lessonId}
//       lessonName={state.lessonName || "Bài học"}
//       onComplete={handleLessonComplete}
//     />
//   );
// }

// src/pages/Customer/LessonDetailPage/LessonDetail.jsx
import React, { useEffect, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import InteractiveLessonViewer from "../../../components/common/InteractiveLessonViewer";
import { useLessonProgressStore } from "../../../stores/lessonProgressStore";

const extractUuidFromSlug = (slug = "") => {
  const maybe = slug.slice(-36);
  return /^[0-9a-fA-F-]{36}$/.test(maybe) ? maybe : "";
};

export default function LessonDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lessonSlug = "", chapterSlug = "" } = useParams();

  const state = location.state || {};
  const lessonId = state.lessonId || extractUuidFromSlug(lessonSlug);

  // ✅ userKey theo redux (tuỳ field user bạn đang dùng)
  const reduxUser = useSelector((s) => s.user.user);
  const userKey = reduxUser?.userId || reduxUser?.id || reduxUser?.email || "guest";

  // ✅ chapterKey để progress tách theo chapter (ưu tiên uuid nếu có)
  const chapterIdFromSlug = useMemo(() => extractUuidFromSlug(chapterSlug), [chapterSlug]);
  const chapterKey = chapterIdFromSlug || chapterSlug || "unknown-chapter";

  const setDoingLesson = useLessonProgressStore((s) => s.setDoingLesson);
  const markLessonComplete = useLessonProgressStore((s) => s.markLessonComplete);

  // ✅ Vào trang lesson => set lesson này = DOING
  // Nếu đang có doing cũ => store sẽ tự đẩy doing cũ sang COMPLETE (như logic store mình gửi trước)
  useEffect(() => {
    if (lessonId) {
      setDoingLesson(userKey, chapterKey, lessonId);
    }
  }, [userKey, chapterKey, lessonId, setDoingLesson]);

  const handleLessonComplete = () => {

    navigate(-1);
  };

  return (
    <InteractiveLessonViewer
      lessonId={lessonId}
      lessonName={state.lessonName || "Bài học"}
      onComplete={handleLessonComplete}
    />
  );
}
