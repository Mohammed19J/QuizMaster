import { h } from "preact";
import { useState } from "preact/hooks";
import Header from "../components/GeneralComponents/header";
import QuizManagement from "../components/QuizComponents/QuizManagement";
import DashboardContent from "../components/DashboardComponents/DashboardContent";
import QuizResponses from "../components/ResponseComponents/QuizResponses";
import ProfileImage from "../components/GeneralComponents/ProfileImage";
import { useUser } from "../context/UserContext";
//This is the dashboard layout that will be rendered when the user logs in
const DashboardLayout = ({ className = "" }) => {
    //Get the user data from the UserContext
    const { user } = useUser();
    //Extract the username and profile image from the user
    const username = user?.displayName || "User";
    const profileImage = user?.photoURL || "";
    //Set the active tab to the dashboard
    const [activeTab, setActiveTab] = useState("dashboard");
    //Render the content based on the active tab
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
                    name={username} // Pass the username to extract the initial for image if no photo is provided
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
