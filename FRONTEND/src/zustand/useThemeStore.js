import { create } from "zustand";

const useThemeStore = create((set) => ({
  isDark: localStorage.getItem("theme") === "dark", // Initial state from localStorage
  toggleTheme: () => {
    set((state) => {
      const newTheme = !state.isDark;
      localStorage.setItem("theme", newTheme ? "dark" : "light");

      // Update body class for global dark mode
      if (newTheme) {
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
      }

      return { isDark: newTheme };
    });
  },
}));

export default useThemeStore;
