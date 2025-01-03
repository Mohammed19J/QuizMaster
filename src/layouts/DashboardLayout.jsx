import { h } from "preact";
import Header from "../components/header";
import Questions from "../components/quiz_creator";
import ProfileImage from "../components/ProfileImage";
import { useUser } from "../context/UserContext";

const MainLayout = ({ children, className = "" }) => {
    const { user } = useUser();
    const username = user?.displayName || "User";
    const profileImage = user?.photoURL || "https://via.placeholder.com/150"; // Fallback image

    return (
        <div className={`min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white ${className}`}>
            {/* Header */}
            <Header />

            {/* Welcome Section */}
            <div className="container mx-auto px-4 py-4 flex flex-col items-center">
                <div className="flex items-center space-x-4">
                    <ProfileImage
                        src={profileImage}
                        alt={`${username}'s profile`}
                        size="60px"
                    />
                    <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        Welcome, {username}!
                    </h1>
                </div>
            </div>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <Questions />
            </main>
        </div>
    );
};

export default MainLayout;
