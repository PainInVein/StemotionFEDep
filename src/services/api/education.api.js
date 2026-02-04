// src/api/education.api.js
import axiosClient from "../../utils/axiosClient";

export const getGradesApi = (params) =>
  axiosClient.get("/api/Grade", { params });

export const getSubjectsApi = (params) =>
  axiosClient.get("/api/Subject", { params });

export const getChaptersApi = (params) =>
  axiosClient.get("/api/Chapter", { params });

export const getLessonsApi = (params) =>
  axiosClient.get("/api/Lesson", { params });

export const getLessonContentsByLessonIdApi = (lessonId) => {
  if (!lessonId) throw new Error("lessonId is required");
  return axiosClient.get(`/api/LessonContent/lesson/${lessonId}`);
};
