import React, { useEffect, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { message } from "antd";

import InteractiveLessonViewer from "../../../components/common/InteractiveLessonViewer";
import { useLessonProgressStore } from "../../../stores/lessonProgressStore";
import { updateLessonProgressApi } from "../../../services/api/studentProgress.service";
import { getPaymentService } from "../../../services/subscription/subscription.service";
import { getUserKey } from "../../../utils/getUserKey";

const extractUuidFromSlug = (slug = "") => {
  const maybe = String(slug || "").slice(-36);
  return /^[0-9a-fA-F-]{36}$/.test(maybe) ? maybe : "";
};

const extractShortIdFromSlug = (slug = "") => {
  const match = String(slug || "").match(/~([a-zA-Z0-9]{8})$/);
  return match ? match[1] : "";
};

const getStudentIdFromLocalStorage = () => {
  try {
    const userStr = localStorage.getItem("user");
    const u = userStr ? JSON.parse(userStr) : null;
    return u?.studentId || u?.id || null;
  } catch {
    return null;
  }
};

const getUserFromLocalStorage = () => {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

export default function LessonDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { subjectSlug, chapterSlug, lessonSlug = "" } = useParams();

  const state = location.state || {};
  const lessonId = state.lessonId || extractUuidFromSlug(lessonSlug) || extractShortIdFromSlug(lessonSlug);

  // ✅ Kiểm tra đang ở route trial không
  const isTrial = location.pathname.startsWith("/trial/");

  const userKey = useMemo(() => getUserKey(), []);

  const chapterIdFromSlug = useMemo(
    () => extractUuidFromSlug(chapterSlug),
    [chapterSlug]
  );
  const chapterKey = chapterIdFromSlug || chapterSlug || "unknown-chapter";

  const setDoingLesson = useLessonProgressStore((s) => s.setDoingLesson);
  const markLessonComplete = useLessonProgressStore((s) => s.markCompleted);

  // ✅ Vào trang lesson → set lesson này = DOING
  useEffect(() => {
    if (lessonId) setDoingLesson(userKey, chapterKey, lessonId);
  }, [userKey, chapterKey, lessonId, setDoingLesson]);

  const handleLessonComplete = async () => {
    // 1) Update local store trước để UI phản hồi nhanh
    if (lessonId) markLessonComplete(userKey, chapterKey, lessonId);

    // ✅ ============ TRIAL FLOW ============
    if (isTrial) {
      try {
        const user = getUserFromLocalStorage();
        const parentId = user?.parentId;

        if (parentId) {
          const hasPaid = await getPaymentService(parentId);

          if (hasPaid) {
            // Đã paid → vào khu vực học chính thức
            message.success("Tài khoản Premium! Tiếp tục học thôi 🎉");
            navigate("/courses", { replace: true });
          } else {
            // Chưa paid → mời nâng cấp
            message.info(
              "Bạn đã hoàn thành bài học thử! Nâng cấp Premium để mở khóa toàn bộ nội dung."
            );
            navigate("/subscription", { replace: true });
          }
        } else {
          // Chưa đăng nhập hoặc không có parentId
          message.info("Hoàn thành bài học thử! Đăng nhập và nâng cấp để tiếp tục.");
          navigate("/subscription", { replace: true });
        }
      } catch (err) {
        console.error("Check payment error:", err);
        // Lỗi kiểm tra payment → vẫn dẫn về subscription
        navigate("/subscription", { replace: true });
      }
      return; // ✅ Dừng ở đây, không chạy logic bên dưới
    }

    // ✅ ============ NORMAL LESSON FLOW ============
    try {
      const studentId = getStudentIdFromLocalStorage();

      if (studentId && lessonId) {
        await updateLessonProgressApi(studentId, lessonId, {
          completionPercentage: 100,
          isCompleted: true,
        });
        message.success("Chúc mừng! Bạn đã hoàn thành bài học.");
      }
    } catch (error) {
      const apiMessage =
        error?.response?.data?.message ||
        error?.response?.data?.title ||
        error?.message;

      console.error("Error updating progress:", {
        status: error?.response?.status,
        data: error?.response?.data,
        lessonId,
      });

      message.error(
        apiMessage
          ? `Không thể cập nhật tiến độ: ${apiMessage}`
          : "Không thể cập nhật tiến độ lên hệ thống."
      );
    } finally {
      if (subjectSlug && chapterSlug) {
        navigate(`/courses/${subjectSlug}/chapter/${chapterSlug}`, {
          state: {
            chapterName: state.chapterName,
            subjectName: state.subjectName,
            gradeLevel: state.gradeLevel,
            isTrial,
          },
        });
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