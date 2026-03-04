import { useState, useEffect } from "react";
import Home from "./pages/Home.jsx";

/**
 * Root application component.
 * Manages the global dark-mode class on <html>.
 */
export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("darkMode");
    return stored === null ? true : stored === "true";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return <Home darkMode={darkMode} setDarkMode={setDarkMode} />;
}
