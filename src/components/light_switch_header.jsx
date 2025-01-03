import { h } from "preact";
import { useState, useEffect } from "preact/hooks";

const LightSwitch = ({ className = "" }) => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Check initial theme
        const isDarkMode = document.documentElement.classList.contains('dark');
        setIsDark(isDarkMode);
    }, []);

    const toggleTheme = () => {
        const newDarkMode = !isDark;
        setIsDark(newDarkMode);
        
        // Toggle dark mode classes
        document.documentElement.classList.toggle('dark');
        
        // Apply theme
        if (newDarkMode) {
            document.body.classList.add('dark');
            document.body.classList.add('bg-gray-900');
            document.body.classList.add('text-white');
        } else {
            document.body.classList.remove('dark');
            document.body.classList.remove('bg-gray-900');
            document.body.classList.remove('text-white');
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${className}`}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
            <span className="text-xl">
                {isDark ? "☀️" : "🌙"}
            </span>
        </button>
    );
};


export default LightSwitch;