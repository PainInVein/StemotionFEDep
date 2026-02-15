// src/stores/lessonProgressStore.js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Structure:
 * byUser[userKey][chapterKey] = {
 *   doingLessonId: string|null,
 *   completed: string[] // lessonIds
 * }
 */

export const useLessonProgressStore = create(
  persist(
    (set, get) => ({
      byUser: {},

      // Ensure path exists
      _ensure: (userKey, chapterKey) => {
        const st = get();
        const u = st.byUser[userKey] || {};
        const c = u[chapterKey] || { doingLessonId: null, completed: [] };
        return { u, c };
      },

      /**
       * RULE (the flow you want):
       * - When selecting a lesson:
       *   - If there was an old doingLessonId and it's different => move old doing to completed
       *   - Set new doingLessonId
       * - Do NOT mark current lesson complete when finishing LessonDetail.
       */
      setDoingLesson: (userKey, chapterKey, nextLessonId) => {
        set((state) => {
          const byUser = state.byUser || {};
          const u = byUser[userKey] || {};
          const c = u[chapterKey] || { doingLessonId: null, completed: [] };

          const prevDoing = c.doingLessonId;
          let completed = Array.isArray(c.completed) ? [...c.completed] : [];

          // If switching from one doing to another => previous doing becomes complete
          if (prevDoing && prevDoing !== nextLessonId && !completed.includes(prevDoing)) {
            completed.push(prevDoing);
          }

          const nextChapter = {
            ...c,
            doingLessonId: nextLessonId,
            completed,
          };

          return {
            byUser: {
              ...byUser,
              [userKey]: {
                ...u,
                [chapterKey]: nextChapter,
              },
            },
          };
        });
      },

      // Optional: if later you need a manual complete button
      markCompleted: (userKey, chapterKey, lessonId) => {
        set((state) => {
          const byUser = state.byUser || {};
          const u = byUser[userKey] || {};
          const c = u[chapterKey] || { doingLessonId: null, completed: [] };

          const completed = Array.isArray(c.completed) ? [...c.completed] : [];
          if (!completed.includes(lessonId)) completed.push(lessonId);

          return {
            byUser: {
              ...byUser,
              [userKey]: {
                ...u,
                [chapterKey]: {
                  ...c,
                  completed,
                },
              },
            },
          };
        });
      },

      // Optional reset
      clearChapter: (userKey, chapterKey) => {
        set((state) => {
          const byUser = { ...(state.byUser || {}) };
          const u = { ...(byUser[userKey] || {}) };
          delete u[chapterKey];
          byUser[userKey] = u;
          return { byUser };
        });
      },
    }),
    {
      name: "lesson-progress-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ byUser: state.byUser }),
    }
  )
);
