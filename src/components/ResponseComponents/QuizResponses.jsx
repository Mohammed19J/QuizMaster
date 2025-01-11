import React, { useState } from "react";
import QuizResponsesPage from "./QuizResponsesPage";
import QuizResponsesTable from "./QuizResponsesTable";

const QuizResponses = () => {
    const [selectedQuiz, setSelectedQuiz] = useState(null);

    const handleQuizSelect = (quiz) => {
        setSelectedQuiz(quiz); // Save the selected quiz to state
    };

    const handleBack = () => {
        setSelectedQuiz(null); // Clear the selected quiz to go back to the quiz list
    };

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