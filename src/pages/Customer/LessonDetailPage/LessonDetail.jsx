import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import InteractiveLessonViewer from "../../../components/common/InteractiveLessonViewer";

const extractUuidFromSlug = (slug = "") => {
  const maybe = slug.slice(-36);
  return /^[0-9a-fA-F-]{36}$/.test(maybe) ? maybe : "";
};

/* ---------- Page ---------- */
export default function LessonDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lessonSlug = "" } = useParams();

  const state = location.state || {};
  const lessonId = state.lessonId || extractUuidFromSlug(lessonSlug);

  const handleLessonComplete = () => {
    // Navigate back or show completion message
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
