import { h } from "preact";
import { useState } from "preact/hooks";
import TextInput from "./text_input";
import SelectInput from "./select_input";
import CheckboxInput from "./checkbox_input";
import Button from "./button";

const QuestionForm = ({ questionId, questionNumber, onSave, onDelete }) => {
    const [questionText, setQuestionText] = useState("");
    const [questionType, setQuestionType] = useState("text");
    const [isRequired, setIsRequired] = useState(false);
    const [grade, setGrade] = useState(0);
    const [options, setOptions] = useState([]);
    const [correctAnswers, setCorrectAnswers] = useState([]); // For multiple-choice and checkboxes
    const [textCorrectAnswer, setTextCorrectAnswer] = useState(""); // For text questions

    const addOption = () => {
        setOptions((prevOptions) => [...prevOptions, { id: Date.now(), value: "" }]);
    };

    const updateOption = (id, value) => {
        setOptions((prevOptions) =>
            prevOptions.map((option) =>
                option.id === id ? { ...option, value } : option
            )
        );
    };

    const deleteOption = (id) => {
        setOptions((prevOptions) => prevOptions.filter((option) => option.id !== id));
        setCorrectAnswers((prevAnswers) => prevAnswers.filter((answer) => answer !== id)); // Remove deleted option from correctAnswers
    };

    const toggleCorrectAnswer = (id) => {
        if (questionType === "multiple_choice") {
            setCorrectAnswers([id]); // Only one correct answer for multiple-choice
        } else if (questionType === "checkboxes") {
            setCorrectAnswers((prev) =>
                prev.includes(id)
                    ? prev.filter((answer) => answer !== id) // Remove if already selected
                    : [...prev, id] // Add if not selected
            );
        }
    };

    const saveQuestion = () => {
        onSave({
            questionId,
            questionText,
            questionType,
            isRequired,
            grade,
            correctAnswers,
            textCorrectAnswer: questionType === "text" ? textCorrectAnswer : null,
            options,
        });
    };

    return (
        <div className="p-4 border rounded-md bg-gray-100 dark:bg-gray-700 shadow-md mb-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    Question {questionNumber}
                </h3>
                <button
                    onClick={() => onDelete(questionId)} // Pass the question ID to onDelete
                    className="text-red-600 hover:text-red-800 transition-colors duration-200"
                >
                    {/* Trash Bin Icon */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.562.395a48.11 48.11 0 00-3.478.397m14.456 0a48.108 48.108 0 00-3.478-.397m-12.562.395a48.11 48.11 0 00-3.478.397m14.456 0a48.108 48.108 0 00-3.478-.397m-12.562.395a48.11 48.11 0 00-3.478.397m14.456 0a48.108 48.108 0 00-3.478-.397m-12.562.395a48.11 48.11 0 00-3.478.397m14.456 0a48.108 48.108 0 00-3.478-.397m-12.562.395a48.11 48.11 0 00-3.478.397"
                        />
                    </svg>
                </button>
            </div>
            <TextInput
                label="Question Text"
                placeholder="Enter question text"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
            />
            <SelectInput
                label="Question Type"
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                options={[
                    { value: "text", label: "Text" },
                    { value: "checkboxes", label: "Checkboxes" },
                    { value: "multiple_choice", label: "Multiple-choice" },
                ]}
            />
            {(questionType === "multiple_choice" || questionType === "checkboxes") && (
                <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                        Options
                    </h4>
                    {options.map((option, index) => (
                        <div key={option.id} className="flex items-center gap-2 mb-2">
                            {questionType === "multiple_choice" ? (
                                <input
                                    type="radio"
                                    name={`correct-answer-${questionId}`}
                                    checked={correctAnswers.includes(option.id)}
                                    onChange={() => toggleCorrectAnswer(option.id)}
                                    className="form-radio text-blue-600"
                                />
                            ) : (
                                <input
                                    type="checkbox"
                                    checked={correctAnswers.includes(option.id)}
                                    onChange={() => toggleCorrectAnswer(option.id)}
                                    className="form-checkbox text-blue-600"
                                />
                            )}
                            <TextInput
                                value={option.value}
                                onChange={(e) => updateOption(option.id, e.target.value)}
                                placeholder={`Option ${index + 1}`}
                                className="flex-grow"
                            />
                            <button
                                onClick={() => deleteOption(option.id)}
                                className="text-red-600 hover:text-red-800 transition-colors duration-200"
                            >
                                X
                            </button>
                        </div>
                    ))}
                    <Button
                        text="Add Option"
                        onClick={addOption}
                        className="bg-gray-300 text-gray-700 hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                    />
                </div>
            )}
            {questionType === "text" && (
                <TextInput
                    label="Correct Answer"
                    placeholder="Enter the correct answer"
                    value={textCorrectAnswer}
                    onChange={(e) => setTextCorrectAnswer(e.target.value)}
                />
            )}
            <CheckboxInput
                label="Required"
                checked={isRequired}
                onChange={(e) => setIsRequired(e.target.checked)}
            />
            <TextInput
                label="Grade"
                type="number"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
            />
        </div>
    );
};

export default QuestionForm;