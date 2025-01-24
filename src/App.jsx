import { Routes, Route } from "react-router-dom";
import LoginLayout from "./layouts/LoginLayout";
import Dashboard from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/GeneralComponents/ProtectedRoute";
import QuizLayout from "./layouts/QuizLayout";

const App = () => {
    return (
        /*Re-route each route to render its corresponding component*/
        /*The ProtectedRoute component is a custom component that checks if the user is logged in before rendering the component*/
        /*Protected Route's goal is to stop anyone from entering the dashboard without logging in first*/
        /*The QuizLayout component is the layout that will be rendered when the user opens on a quiz, it will render the quiz based
        on the provided quizId from the quiz URL*/
        <Routes>
            <Route path="/" element={<LoginLayout />} />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route path="/quiz/:quizId" element={<QuizLayout />} />
        </Routes>
    );
};

export default App;
