/** /src/components/QuizManagement.jsx **/
import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import QuizHistory from "./QuizHistory";
import QuizCreator from "./quiz_creator";

// This component is responsible for managing the view state of the QuizCreator and QuizHistory components
const QuizManagement = ({ initialView = "creator" }) => {
    // The initialView prop determines which component to show first
    const [view, setView] = useState(initialView);
    // The selectedQuiz state is used to pass the quiz data to the QuizCreator component
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    // When the initialView prop changes, we reset the view state and clear the selectedQuiz state
    useEffect(() => {
        setView(initialView);
        if (initialView === "creator") {
            setSelectedQuiz(null);
        }
    }, [initialView]);
    // When a quiz is selected in the QuizHistory component, we set the selectedQuiz state and change the view state to "creator"
    const handleQuizSelect = (quiz) => {
        // When user clicks "Edit" in QuizHistory, we load that quiz
        setSelectedQuiz(quiz);
        setView("creator");
    };
    // When the user clicks "Cancel" in QuizCreator, we clear the selectedQuiz state and change the view state to "history"
    const handleClearSelection = () => {
        setSelectedQuiz(null);
        setView("history");
    };
    // If the view state is "creator", we render the QuizCreator component with the selectedQuiz state
    if (view === "creator") {
        return (
            <QuizCreator
                initialQuiz={selectedQuiz}
                onClearSelection={selectedQuiz ? handleClearSelection : null}
            />
        );
    }
    // If the view state is "history", we render the QuizHistory component
    return <QuizHistory onQuizSelect={handleQuizSelect} />;
};

export default QuizManagement;
