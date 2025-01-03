import { h } from "preact";
import Button from "./button";
import LightSwitch from "./light_switch_header";

const Header = ({ className = "" }) => {
    return (
        <header
            className={`flex justify-between items-center px-8 py-4 border-b border-gray-300 bg-white dark:bg-gray-800 ${className}`}
        >
            {/* Title */}
            <h1 className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                QuizMaster
            </h1>
            {/* Navigation */}
            <nav className="flex items-center gap-8">
                <Button
                    text="Quiz Creator"
                    onClick={() => console.log("Quiz Creator clicked")}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                />
                <Button
                    text="Quiz Responses"
                    onClick={() => console.log("Quiz Responses clicked")}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                />
                <Button
                    text="Quiz History"
                    onClick={() => console.log("Quiz Responses clicked")}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                />
                <Button
                    text="Logout"
                    onClick={() => console.log("Logout clicked")}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                />
                {/* Light/Dark Mode Switch */}
                <LightSwitch />
            </nav>
        </header>
    );
};

export default Header;