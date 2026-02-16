// src/pages/Customer/LessonDetailPage/LessonDetail.jsx
import React, { useEffect, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { message } from "antd";

import InteractiveLessonViewer from "../../../components/common/InteractiveLessonViewer";
import { useLessonProgressStore } from "../../../stores/lessonProgressStore";
import { updateLessonProgressApi } from "../../../services/api/studentProgress.service";

const extractUuidFromSlug = (slug = "") => {
  const maybe = String(slug || "").slice(-36);
  return /^[0-9a-fA-F-]{36}$/.test(maybe) ? maybe : "";
};

export default function LessonDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { subjectSlug, chapterSlug, lessonSlug = "" } = useParams();

  const state = location.state || {};
  const lessonId = state.lessonId || extractUuidFromSlug(lessonSlug);

  // ✅ userKey theo redux (tuỳ field user bạn đang dùng)
  const reduxUser = useSelector((s) => s.user?.user);
  const userKey =
    reduxUser?.userId || reduxUser?.id || reduxUser?.email || "guest";

  // ✅ chapterKey để progress tách theo chapter (ưu tiên uuid nếu có)
  const chapterIdFromSlug = useMemo(
    () => extractUuidFromSlug(chapterSlug),
    [chapterSlug]
  );
  const chapterKey = chapterIdFromSlug || chapterSlug || "unknown-chapter";

  const setDoingLesson = useLessonProgressStore((s) => s.setDoingLesson);
  const markLessonComplete = useLessonProgressStore((s) => s.markCompleted);

  // ✅ Vào trang lesson => set lesson này = DOING
  useEffect(() => {
    if (lessonId) {
      setDoingLesson(userKey, chapterKey, lessonId);
    }
  }, [userKey, chapterKey, lessonId, setDoingLesson]);

  const handleLessonComplete = async () => {
    // 1) Update local store trước để UI phản hồi nhanh
    if (lessonId) {
      markLessonComplete(userKey, chapterKey, lessonId);
    }

    // 2) Update server (nếu có studentId)
    try {
      // Ưu tiên lấy studentId từ redux nếu có, fallback localStorage
      const studentIdFromRedux = reduxUser?.studentId;

      let studentId = studentIdFromRedux;
      if (!studentId) {
        const userStr = localStorage.getItem("user");
        const lsUser = userStr ? JSON.parse(userStr) : null;
        studentId = lsUser?.studentId;
      }

      if (studentId && lessonId) {
        await updateLessonProgressApi(studentId, lessonId, {
          completionPercentage: 100,
          isCompleted: true,
        });
        message.success("Chúc mừng! Bạn đã hoàn thành bài học.");
      }
    } catch (error) {
      const status = error?.response?.status;
      const apiMessage =
        error?.response?.data?.message ||
        error?.response?.data?.title ||
        error?.message;

      console.error("Error updating progress:", {
        status,
        data: error?.response?.data,
        lessonId,
      });

      // Không chặn navigate, nhưng hiển thị rõ lý do từ backend nếu có
      message.error(
        apiMessage
          ? `Không thể cập nhật tiến độ: ${apiMessage}`
          : "Không thể cập nhật tiến độ lên hệ thống."
      );
    } finally {
      // 3) Redirect
      if (subjectSlug && chapterSlug) {
        navigate(`/courses/${subjectSlug}/chapter/${chapterSlug}`);
      } else {
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
