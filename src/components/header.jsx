import { h } from "preact";
import Button from "./button";
import LightSwitch from "./light_switch_header";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Header = ({ activeTab, onTabChange, className = "" }) => {
    const navItems = [
        { id: "dashboard", label: "Dashboard" },
        { id: "quizCreator", label: "Quiz Creator" },
        { id: "quizResponses", label: "Quiz Responses" },
        { id: "quizHistory", label: "Quiz History" },
    ];

    const { logout } = useUser(); // Get the logout function from context
    const navigate = useNavigate(); // Navigate function from react-router

    const handleLogout = () => {
        try {
            logout(); // Clear user data
            navigate("/"); // Navigate to the login page
        } catch (error) {
            console.error("Error logging you out:", error);
            alert("An error occurred while logging out. Please try again.");
        }
    };

    return (
        <header
            className={`flex justify-between items-center px-8 py-4 bg-white dark:bg-gray-900 shadow-md ${className}`}
        >
            {/* Title */}
            <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                QuizMaster
            </h1>
            {/* Navigation */}
            <nav className="flex items-center gap-6">
                {navItems.map((item) => (
                    <Button
                        key={item.id}
                        text={item.label}
                        onClick={() => onTabChange(item.id)}
                        className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                            activeTab === item.id
                                ? "bg-blue-600 text-white font-semibold shadow-lg"
                                : "text-gray-700 hover:bg-blue-50 dark:text-gray-300 dark:hover:bg-gray-800"
                        }`}
                    />
                ))}
                <Button
                    text="Logout"
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600 transition-all duration-200 shadow-md"
                />
                {/* Light/Dark Mode Switch */}
                <LightSwitch />
            </nav>
        </header>
    );
};

export default Header;