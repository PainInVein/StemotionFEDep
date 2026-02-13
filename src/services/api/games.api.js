//src/services/api/games.api.js
import axiosClient from "../../utils/axiosClient";

export const getGamesByLessonId = (lessonId) => {
  if (!lessonId) throw new Error("lessonId is required");
  return axiosClient.get(`/api/Games/lesson/${lessonId}`);
};

export const submitGameResult = (payload) => {
  const { studentId, gameId, score, correctAnswers, totalQuestions, playDurations } = payload || {};

  if (!gameId) throw new Error("gameId is required");
  if (!studentId) throw new Error("studentId is required");

  return axiosClient.post("/api/GameResults", {
    studentId,
    gameId,
    score: Number(score) || 0,
    correctAnswers: Number(correctAnswers) || 0,
    totalQuestions: Number(totalQuestions) || 0,
    playDurations: Number(playDurations) || 0,
  });
};
