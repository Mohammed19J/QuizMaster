import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import QuizHistory from "./QuizHistory";
import QuizCreator from "./quiz_creator";

const QuizManagement = ({ initialView = "creator" }) => {
    const [view, setView] = useState(initialView);
    const [selectedQuiz, setSelectedQuiz] = useState(null);

    useEffect(() => {
        // Ensure proper view initialization when `initialView` changes
        setView(initialView);
        if (initialView === "creator") {
            setSelectedQuiz(null);
        }
    }, [initialView]);

    const handleQuizSelect = (quiz) => {
        setSelectedQuiz(quiz);
        setView("creator"); // Switch to the QuizCreator view when a quiz is selected
    };

    const handleClearSelection = () => {
        setSelectedQuiz(null);
        setView("history"); // Switch back to QuizHistory view
    };

    // Render QuizCreator for editing or creating quizzes
    if (view === "creator") {
        return (
            <QuizCreator
                initialQuiz={selectedQuiz} // Pass selected quiz for editing
                onClearSelection={selectedQuiz ? handleClearSelection : null} // Only provide back navigation for edits
            />
        );
    }

    // Render QuizHistory by default
    return <QuizHistory onQuizSelect={handleQuizSelect} />;
};

export default QuizManagement;
