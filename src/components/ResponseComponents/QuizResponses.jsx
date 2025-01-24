import React, { useState } from "react";
import QuizResponsesPage from "./QuizResponsesPage";
import QuizResponsesTable from "./QuizResponsesTable";

// The QuizResponses component is a parent component that renders the QuizResponsesPage and QuizResponsesTable components
const QuizResponses = () => {
    // The selectedQuiz state is used to store the selected quiz
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    // The handleQuizSelect function is used to set the selected quiz
    const handleQuizSelect = (quiz) => {
        setSelectedQuiz(quiz); // Save the selected quiz to state
    };
    // The handleBack function is used to clear the selected quiz
    const handleBack = () => {
        setSelectedQuiz(null); // Clear the selected quiz to go back to the quiz list
    };
    // The QuizResponses component returns the QuizResponsesPage and QuizResponsesTable components
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-6">
                {selectedQuiz ? `Responses for: ${selectedQuiz.title || "Untitled Quiz"}` : ""}
            </h1>
            {!selectedQuiz ? (
                <QuizResponsesPage onQuizSelect={handleQuizSelect} /> 
            ) : (
                <div>
                <div className="flex items-center justify-center">
                    <button
                        onClick={handleBack}
                        className="mb-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-all duration-200"
                    >
                        Back to Responses
                    </button>
                </div>
                    <QuizResponsesTable quizId={selectedQuiz.quizId} />
                </div>
            )}
        </div>
    );
};

export default QuizResponses;