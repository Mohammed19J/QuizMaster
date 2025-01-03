import { h } from "preact";
import { useState } from "preact/hooks";
import Button from "./button";
import QuestionForm from "./question_form";

const QuizCreator = () => {
    const [questions, setQuestions] = useState([]); // List of questions

    const addNewQuestion = () => {
        // Generate a unique ID for the new question
        const newQuestion = {
            id: Date.now(), // Unique ID using timestamp
            questionText: "",
            questionType: "text",
            isRequired: false,
            grade: 0,
            options: [],
            correctAnswers: [],
            textCorrectAnswer: "",
        };
        setQuestions([...questions, newQuestion]); // Add the new question
    };

    const updateQuestion = (id, updatedQuestion) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((q) => (q.id === id ? updatedQuestion : q))
        );
    };

    const deleteQuestion = (id) => {
        setQuestions((prevQuestions) => prevQuestions.filter((q) => q.id !== id));
    };

    return (
        <section className="flex flex-col items-center py-10 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
                Create Your Quiz
            </h2>

            {/* Render Question Forms */}
            {questions.map((question, index) => (
                <div key={question.id} className="w-full max-w-3xl mb-4">
                    <QuestionForm
                        questionId={question.id} // Pass the unique ID
                        questionNumber={index + 1} // Pass the question number
                        initialData={question} // Pass initial data for the form
                        onUpdate={(updatedQuestion) => updateQuestion(question.id, updatedQuestion)} // Handle updates
                        onDelete={() => deleteQuestion(question.id)} // Handle deletion
                    />
                </div>
            ))}

            {/* Button to Add a New Question */}
            <Button
                text="Add Question"
                onClick={addNewQuestion}
                className="bg-blue-600 text-white font-bold px-6 py-2 mt-4 rounded-md hover:bg-blue-500"
            />
            {/* Save Quiz Button */}
            <Button
                text="Save Quiz"
                onClick={() => console.log("Quiz saved:", questions)}
                className="bg-green-600 text-white font-bold px-6 py-2 mt-6 rounded-md hover:bg-green-500"
            />
        </section>
    );
};

export default QuizCreator;