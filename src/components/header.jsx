import { h } from "preact";
import { useState } from "preact/hooks";
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

    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            className={`flex flex-wrap justify-between items-center px-6 py-4 bg-white dark:bg-gray-900 shadow-md ${className}`}
        >
            {/* Title */}
            <div className="flex justify-between items-center w-full lg:w-auto">
                <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    QuizMaster
                </h1>
                {/* Hamburger Menu */}
                <button
                    onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                    className="lg:hidden text-gray-700 dark:text-gray-300 focus:outline-none"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 6h16M4 12h16m-7 6h7"
                        ></path>
                    </svg>
                </button>
            </div>

            {/* Navigation */}
            <nav
                className={`${
                    isMobileMenuOpen ? "block" : "hidden"
                } lg:flex flex-col lg:flex-row lg:items-center lg:gap-6 w-full lg:w-auto mt-4 lg:mt-0`}
            >
                {navItems.map((item) => (
                    <Button
                        key={item.id}
                        text={item.label}
                        onClick={() => {
                            onTabChange(item.id);
                            setMobileMenuOpen(false); // Close menu on selection
                        }}
                        color="blue"
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
                    color="red"
                    className="px-4 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600 transition-all duration-200 shadow-md"
                />
                {/* Light/Dark Mode Switch */}
                <LightSwitch />
            </nav>
        </header>
    );
};

export default Header;
