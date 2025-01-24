import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { UserProvider } from "./context/UserContext";
ReactDOM.createRoot(document.getElementById("app")).render(
    /*wrap the App component with the BrowserRouter to enable routing in the entire application
      wrap the App component with the UserProvider to enable the fetching of current user data
      using UserContext globaly in the entire application*/
    <BrowserRouter>
        <UserProvider>
            <App />
        </UserProvider>
    </BrowserRouter>
);
