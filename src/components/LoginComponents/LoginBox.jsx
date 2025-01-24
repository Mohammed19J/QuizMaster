import React from 'react';
import { useState, useEffect } from 'react';

// This component is a container for the login button
const LoginBox = ({ children, className }) => {
    const [isVisible, setIsVisible] = useState(false);
    // This useEffect hook is used to animate the login box when it is rendered
    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className={`relative transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            {/* Ambient Glow Container */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-blue-500/20 blur-3xl animate-glow-pulse rounded-full"></div>
                <div className="absolute inset-0 bg-purple-500/10 blur-3xl animate-glow-drift rounded-full"></div>
            </div>

            {/* Main Box */}
            <div className={`
                relative 
                bg-white/90 
                backdrop-blur-sm 
                rounded-xl 
                p-8 
                shadow-[0_0_50px_-12px_rgba(0,0,0,0.25)]
                transition-all 
                duration-500 
                hover:shadow-[0_0_50px_-6px_rgba(59,130,246,0.5)] 
                hover:scale-[1.1]
                ${className}
            `}>
                {children}
            </div>
        </div>
    );
};

export default LoginBox;