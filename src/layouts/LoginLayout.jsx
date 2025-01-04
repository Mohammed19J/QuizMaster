import { h } from "preact";
import { useState } from "preact/hooks";
import { useNavigate } from "react-router-dom";
import WelcomeMessage from "../components/WelcomeMessage";
import GoogleLoginButton from "../components/GoogleLoginButton";
import LoginBox from "../components/LoginBox";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, database} from "../firebase/firebase";
import { useUser } from "../context/UserContext";
import LightSwitch from "../components/light_switch_header";
import { ref, get, set } from "firebase/database";

const LoginLayout = () => {
    const { setUser } = useUser();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        setErrorMessage(null);
        setIsLoading(true);
    
        try {
            const result = await signInWithPopup(auth, googleProvider);
    
            const user = result.user;
    
            // Save user to global context
            setUser(user);
    
            // Check if the user exists in the Realtime Database
            const userRef = ref(database, `users/${user.uid}`);
            const snapshot = await get(userRef);
    
            if (!snapshot.exists()) {
                // If the user doesn't exist, create a new record
                await set(userRef, {
                    email: user.email,
                    displayName: user.displayName || "Anonymous",
                    photoURL: user.photoURL || "",
                    quizzesCreated: 0, // Initialize to 0
                    quizHistory: {}, // Empty object for quiz data
                    mostSubmittedQuizzes: {}, // Empty object for stats
                    participantResponses: {}, // Empty object for responses
                });
    
            } else {
                // If the user exists, retrieve their data
                const userData = snapshot.val();
                // Optionally, you can save this data in your global state
            }
    
            // Redirect to the dashboard
            navigate("/dashboard");
        } catch (error) {
            let message;
            switch (error.code) {
                case "auth/popup-closed-by-user":
                    message = "Login canceled - you closed the popup.";
                    break;
                case "auth/popup-blocked":
                    message = "Popup was blocked by your browser. Please allow popups and try again.";
                    break;
                default:
                    message = error.message || "An error occurred during login.";
            }
            setErrorMessage(message);
        } finally {
            setIsLoading(false);
        }
    };

    const closeErrorPopup = () => {
        setErrorMessage(null);
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 relative">
            {/* Light/Dark Mode Switch */}
            <LightSwitch className="absolute top-4 right-8" />
    
            {/* Login Box */}
            <LoginBox className="w-full max-w-sm text-center bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <WelcomeMessage
                    text="Welcome to QuizMaster"
                    className="text-2xl text-blue-600 dark:text-blue-400 mb-4 font-bold"
                />
    
                {isLoading ? (
                    <div className="w-full px-6 py-3 text-base font-bold text-blue-600 dark:text-blue-400">
                        Signing in...
                    </div>
                ) : (
                    <GoogleLoginButton
                        onClick={handleLogin}
                        className="w-full px-6 py-3 text-base font-bold text-white bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700 dark:hover:bg-blue-500 active:scale-95 transform transition-all duration-200"
                    />
                )}
            </LoginBox>
    
            {/* Error Popup */}
            {errorMessage && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md text-center">
                        <h2 className="text-lg font-bold text-red-600 dark:text-red-400 mb-4">
                            Error
                        </h2>
                        <p className="text-gray-800 dark:text-gray-200">{errorMessage}</p>
                        <button
                            onClick={closeErrorPopup}
                            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 dark:bg-red-400 transition-all"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
    
};

export default LoginLayout;
