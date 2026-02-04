import { create } from "zustand";

export const useAuthModalStore = create((set) => ({
  isLoginOpen: false,
  redirectTo: null,

  openLogin: (redirectTo = null) => set({ isLoginOpen: true, redirectTo }),
  closeLogin: () => set({ isLoginOpen: false }),

  clearRedirect: () => set({ redirectTo: null }),
}));
