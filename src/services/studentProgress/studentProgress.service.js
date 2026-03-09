import { getChapterProgressApi, getLessonProgressApi } from "../api/studentProgress.api";

export const getChapterProgressService = async (studentId, chapterId) => {
    const res = await getChapterProgressApi
    return data.result;
}

export const getLessonProgressService = async (studentId, lessonId) => {
  const res = await getLessonProgressApi(studentId, lessonId);
  const data = res.data;
  return data.result;
};

