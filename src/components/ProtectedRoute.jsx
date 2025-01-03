import { h } from "preact";
import { useUser } from "../context/UserContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const { user } = useUser();

    if (!user) {
        // Redirect to login if not authenticated
        return <Navigate to="/" replace />;
    }

    // Render the children (protected content) if authenticated
    return children;
};

export default ProtectedRoute;
