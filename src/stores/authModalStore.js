import { create } from "zustand";

export const useAuthModalStore = create((set) => ({
  isLoginOpen: false,
  redirectTo: null,

  role: "student",

  openLogin: (redirectTo = null, role = "student") => set({ isLoginOpen: true, redirectTo, role }),
  closeLogin: () => set({ isLoginOpen: false }),

  clearRedirect: () => set({ redirectTo: null }),
}));
