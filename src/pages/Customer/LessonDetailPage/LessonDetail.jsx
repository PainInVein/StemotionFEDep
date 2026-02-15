import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import InteractiveLessonViewer from "../../../components/common/InteractiveLessonViewer";

const extractUuidFromSlug = (slug = "") => {
  const maybe = slug.slice(-36);
  return /^[0-9a-fA-F-]{36}$/.test(maybe) ? maybe : "";
};

import { updateLessonProgressApi } from "../../../services/api/studentProgress.service";
import { message } from "antd";

/* ---------- Page ---------- */
export default function LessonDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  // Extract params from URL if available (defined in router)
  const { subjectSlug, chapterSlug, lessonSlug } = useParams();

  const state = location.state || {};
  const lessonId = state.lessonId || extractUuidFromSlug(lessonSlug);

  const handleLessonComplete = async () => {
    try {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      const studentId = user?.studentId;

      if (studentId && lessonId) {
        await updateLessonProgressApi(studentId, lessonId, {
          completionPercentage: 100,
          isCompleted: true
        });
        message.success("Chúc mừng! Bạn đã hoàn thành bài học.");
      }
    } catch (error) {
      console.error("Error updating progress:", error);
    } finally {
      // Redirect logic
      if (subjectSlug && chapterSlug) {
        // If we have slugs in URL, go back to chapter view (CourseDetail)
        navigate(`/courses/${subjectSlug}/chapter/${chapterSlug}`);
      } else {
        // Fallback
        navigate(-1);
      }
    }
  };

  return (
    <InteractiveLessonViewer
      lessonId={lessonId}
      lessonName={state.lessonName || "Bài học"}
      onComplete={handleLessonComplete}
    />
  );
}
