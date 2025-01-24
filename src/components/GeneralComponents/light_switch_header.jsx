import { h } from "preact";
import { useState, useEffect } from "preact/hooks";

// LightSwitch component to toggle dark mode on and off
const LightSwitch = ({ className = "" }) => {
  const [isDark, setIsDark] = useState(false);
  // Check if dark mode is enabled on page load
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);
  // Toggle dark mode on button click
  const toggleTheme = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);

    // Toggle dark mode on <html>
    document.documentElement.classList.toggle("dark", newDarkMode);
    // Toggle dark mode on <body>
    if (newDarkMode) {
      document.body.classList.add("dark", "bg-gray-900", "text-white");
    } else {
      document.body.classList.remove("dark", "bg-gray-900", "text-white");
    }

    // Dispatch a custom event for theme change
    window.dispatchEvent(new CustomEvent("theme-changed"));
  };

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${className}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="text-xl">{isDark ? "☀️" : "🌙"}</span>
    </button>
  );
};

export default LightSwitch;
