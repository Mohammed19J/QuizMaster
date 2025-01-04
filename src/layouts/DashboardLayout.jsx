import { h } from "preact";
import { useState } from "preact/hooks";
import Header from "../components/header";
import QuizManagement from "../components/QuizManagement";
import DashboardContent from "../components/DashboardContent";
import QuizResponses from "../components/QuizResponses";
import ProfileImage from "../components/ProfileImage";
import { useUser } from "../context/UserContext";

const DashboardLayout = ({ className = "" }) => {
    const { user } = useUser();
    const username = user?.displayName || "User";
    const profileImage = user?.photoURL || ""; // This can be undefined or an empty string
    const [activeTab, setActiveTab] = useState("dashboard");

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return <DashboardContent />;
            case "quizCreator":
                return <QuizManagement initialView="creator" />;
            case "quizResponses":
                return <QuizResponses />;
            case "quizHistory":
                return <QuizManagement initialView="history" />;
            default:
                return <DashboardContent />;
        }
    };

    return (
        <div className={"h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white overflow-y-auto ${className}"}>
            {/* Header Section */}
            <Header 
                activeTab={activeTab} 
                onTabChange={setActiveTab}
                className="border-b border-gray-200 dark:border-gray-700"
            />
            
            {/* Welcome Section */}
            <div className="container mx-auto px-4 py-4 flex flex-col items-center text-center">
                <ProfileImage
                    src={profileImage}
                    alt={`${username}'s profile`}
                    size="60px"
                    name={username} // Pass the username to extract the initial
                />
                <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-4">
                    Welcome, {username}!
                </h1>
            </div>

            {/* Main Content Section */}
            <main className="container mx-auto px-2 sm:px-4 py-8">
                {renderContent()}
            </main>
        </div>
    );
};

export default DashboardLayout;
