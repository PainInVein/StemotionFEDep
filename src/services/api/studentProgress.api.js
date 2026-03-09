import axiosClient from "../../utils/axiosClient";

export const getParentStudentsApi = (parentId) => {
    return axiosClient.get(`/api/StudentProgress/parent/${parentId}/students`);
};

export const getStudentOverviewApi = (studentId) => {
    return axiosClient.get(`/api/StudentProgress/student/${studentId}/overview`);
};

export const getRecentActivitiesApi = (studentId, limit = 5) => {
    return axiosClient.get(`/api/StudentProgress/student/${studentId}/recent-activities?limit=${limit}`);
};

export const getPerformanceInsightsApi = (studentId) => {
    return axiosClient.get(`/api/StudentProgress/student/${studentId}/insights`);
};

export const getStudyTimeStatisticsApi = (studentId, startDate, endDate) => {
    return axiosClient.get(`/api/StudentProgress/student/${studentId}/study-time`, {
        params: { startDate, endDate },
    });
};

export const getLessonProgressApi = (studentId, lessonId) => {
  return axiosClient.get(
    `/api/StudentProgress/lesson/${lessonId}/student/${studentId}`
  );
};


export const updateLessonProgressApi = (studentId, lessonId, data) => {
    return axiosClient.put(`/api/StudentProgress/lesson/${lessonId}/student/${studentId}`, data);
};

export const startLessonProgressApi = (studentId, lessonId) => {
  return axiosClient.post(
    `/api/StudentProgress/lesson/${lessonId}/student/${studentId}/start`
  );
};

export const getChapterProgressApi = (studentId, chapterId) => {
  return axiosClient.get(
    `/api/StudentProgress/chapter/${chapterId}/student/${studentId}`
  );
};

export const getSubjectProgressApi = (studentId, subjectId) => {
  return axiosClient.get(
    `/api/StudentProgress/subject/${subjectId}/student/${studentId}`
  );
};