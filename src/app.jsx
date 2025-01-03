import { Routes, Route } from "react-router-dom";
import LoginLayout from "./layouts/LoginLayout";
import Dashboard from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

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
        </Routes>
    );
};

export default App;
