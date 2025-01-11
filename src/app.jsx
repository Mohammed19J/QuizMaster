import { Routes, Route } from "react-router-dom";
import LoginLayout from "./layouts/LoginLayout";
import Dashboard from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/GeneralComponents/ProtectedRoute";
import QuizLayout from "./layouts/QuizLayout";

const App = () => {
    return (
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
