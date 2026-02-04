import { getGamesByLessonId, submitGameResult } from "../api/games.api";

/**
 * Unwrap helper:
 * - axiosClient có thể trả về response.data hoặc trả thẳng data
 * - BE trả: { isSuccess, message, result, errors }
 */
const unwrap = (res) => res?.data ?? res;

const assertSuccess = (payload) => {
  // nếu BE luôn có isSuccess
  if (payload?.isSuccess === false) {
    const msg =
      payload?.message ||
      (Array.isArray(payload?.errors) ? payload.errors.join(", ") : "") ||
      "Request failed";
    throw new Error(msg);
  }
};

export const getGamesByLessonIdService = async (lessonId) => {
  const res = await getGamesByLessonId(lessonId);
  const payload = unwrap(res);

  assertSuccess(payload);

  // BE: result: []
  return Array.isArray(payload?.result) ? payload.result : [];
};

export const submitGameResultService = async (payload) => {
  const res = await submitGameResult(payload);
  const data = unwrap(res);

  assertSuccess(data);

  // tuỳ BE có trả result hay không
  return data?.result ?? data;
};
