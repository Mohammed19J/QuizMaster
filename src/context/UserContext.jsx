import { createContext } from "preact";
import { useState, useContext } from "preact/hooks";

// Create the UserContext
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const logout = () => {
        // Clear the user state
        setUser(null);
        // Clear local storage or cookies
        localStorage.removeItem("user");
    };

    return (
        <UserContext.Provider value={{ user, setUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use the UserContext
export const useUser = () => {
    return useContext(UserContext);
};
