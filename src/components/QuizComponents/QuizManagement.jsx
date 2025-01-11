/** /src/components/QuizManagement.jsx **/
import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import QuizHistory from "./QuizHistory";
import QuizCreator from "./quiz_creator";

const QuizManagement = ({ initialView = "creator" }) => {
    const [view, setView] = useState(initialView);
    const [selectedQuiz, setSelectedQuiz] = useState(null);

    useEffect(() => {
        setView(initialView);
        if (initialView === "creator") {
            setSelectedQuiz(null);
        }
    }, [initialView]);

    const handleQuizSelect = (quiz) => {
        // When user clicks "Edit" in QuizHistory, we load that quiz
        setSelectedQuiz(quiz);
        setView("creator");
    };

    const handleClearSelection = () => {
        setSelectedQuiz(null);
        setView("history");
    };

    if (view === "creator") {
        return (
            <QuizCreator
                initialQuiz={selectedQuiz}
                onClearSelection={selectedQuiz ? handleClearSelection : null}
            />
        );
    }

    return <QuizHistory onQuizSelect={handleQuizSelect} />;
};

export default QuizManagement;
