import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { message } from "antd";

import InteractiveLessonViewer from "../../../components/common/InteractiveLessonViewer";
import {
  updateLessonProgressApi,
  startLessonProgressApi,
} from "../../../services/api/studentProgress.api";
import { getPaymentService } from "../../../services/subscription/subscription.service";

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
  const lessonId =
    state.lessonId ||
    extractUuidFromSlug(lessonSlug) ||
    extractShortIdFromSlug(lessonSlug);

  const isTrial = location.pathname.startsWith("/trial/");

  useEffect(() => {
    const run = async () => {
      if (isTrial) return;

      const studentId = getStudentIdFromLocalStorage();
      if (!studentId || !lessonId) return;

      try {
        await startLessonProgressApi(studentId, lessonId);
      } catch (error) {
        console.error("Start lesson progress error:", error);
      }
    };

    run();
  }, [lessonId, isTrial]);

  const handleLessonComplete = async () => {
    // Trial flow
    if (isTrial) {
      try {
        const user = getUserFromLocalStorage();
        const parentId = user?.parentId;

        if (parentId) {
          const hasPaid = await getPaymentService(parentId);

          if (hasPaid) {
            message.success("Tài khoản Premium! Tiếp tục học thôi 🎉");

            if (subjectSlug && chapterSlug) {
              navigate(`/trial/courses/${subjectSlug}/chapter/${chapterSlug}`, {
                replace: true,
                state: {
                  chapterName: state.chapterName,
                  subjectName: state.subjectName,
                  gradeLevel: state.gradeLevel,
                  chapterId: state.chapterId,
                  subjectId: state.subjectId,
                  isTrial,
                },
              });
            } else {
              navigate("/courses", { replace: true });
            }
          } else {
            message.info(
              "Hoàn thành bài học thử! Đăng nhập và nâng cấp để tiếp tục."
            );
            navigate("/subscription", { replace: true });
          }
        } else {
          message.info(
            "Hoàn thành bài học thử! Đăng nhập và nâng cấp để tiếp tục."
          );
          navigate("/subscription", { replace: true });
        }
      } catch (err) {
        console.error("Check payment error:", err);
        navigate("/subscription", { replace: true });
      }

      return;
    }

    // Normal flow
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
          replace: true,
          state: {
            chapterName: state.chapterName,
            subjectName: state.subjectName,
            gradeLevel: state.gradeLevel,
            chapterId: state.chapterId,
            subjectId: state.subjectId,
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