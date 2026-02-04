// src/services/education.service.js
import {
  getGradesApi,
  getSubjectsApi,
  getChaptersApi,
  getLessonsApi,
  getLessonContentsByLessonIdApi
} from "../api/education.api";

const unwrap = (res) => {
  // response bạn gửi: { message, isSuccess, result: { items, ... } }
  const data = res?.data;
  if (!data?.isSuccess) {
    throw new Error(data?.message || "API failed");
  }
  return data.result;
};

export const getGradesService = async (PageNumber = 1, PageSize = 50) => {
  const res = await getGradesApi({ PageNumber, PageSize });
  return unwrap(res);
};

export const getSubjectsService = async (PageNumber = 1, PageSize = 200) => {
  const res = await getSubjectsApi({ PageNumber, PageSize });
  return unwrap(res);
};

export const getChaptersService = async (PageNumber = 1, PageSize = 200) => {
  const res = await getChaptersApi({ PageNumber, PageSize });
  return unwrap(res);
};

export const getLessonsService = async (PageNumber = 1, PageSize = 2000) => {
  const res = await getLessonsApi({ PageNumber, PageSize });
  return unwrap(res);
};

export const getLessonContentsByLessonIdService = async (lessonId) => {
  const res = await getLessonContentsByLessonIdApi(lessonId);
  const contents = unwrap(res);

  // chuẩn hóa: chỉ lấy Active + sort theo orderIndex
  return (contents || [])
    .filter((x) => (x?.status || "").toLowerCase() === "active")
    .sort((a, b) => (a?.orderIndex ?? 0) - (b?.orderIndex ?? 0));
};