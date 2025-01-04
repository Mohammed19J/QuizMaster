import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import TextInput from "./text_input";
import SelectInput from "./select_input";
import CheckboxInput from "./checkbox_input";

const QuestionForm = ({
    questionId,
    questionNumber,
    onUpdate,
    onDelete,
    initialData = {},
    allQuestions = [],
}) => {
    const [questionText, setQuestionText] = useState(initialData.questionText || "");
    const [questionType, setQuestionType] = useState(initialData.questionType || "text");
    const [isRequired, setIsRequired] = useState(initialData.isRequired || false);
    const [grade, setGrade] = useState(initialData.grade || 0);
    const [options, setOptions] = useState(initialData.options || []);
    const [correctAnswers, setCorrectAnswers] = useState(initialData.correctAnswers || []);
    const [textCorrectAnswer, setTextCorrectAnswer] = useState(
        initialData.textCorrectAnswer || ""
    );
    const [isConditional, setIsConditional] = useState(initialData.isConditional || false);
    const [condition, setCondition] = useState(initialData.condition || {});

    // Sync state changes with parent
    useEffect(() => {
        const updatedData = {
            questionId,
            questionText,
            questionType,
            isRequired,
            grade,
            options,
            correctAnswers,
            textCorrectAnswer,
            isConditional,
            condition,
            questionNumber,
        };
        onUpdate(updatedData);
    }, [
        questionText,
        questionType,
        isRequired,
        grade,
        options,
        correctAnswers,
        textCorrectAnswer,
        isConditional,
        condition,
    ]);

    // Add a new option with a unique ID
    const addOption = () => {
        const newOptionId = Date.now();
        setOptions(prevOptions => [...prevOptions, { id: newOptionId, value: "" }]);
    };

    // Update an option
    const updateOption = (id, value) => {
        setOptions(prevOptions =>
            prevOptions.map(option => 
                option.id === id ? { ...option, value } : option
            )
        );
    };

    // Delete an option
    const deleteOption = (id) => {
        setOptions(prevOptions => prevOptions.filter(option => option.id !== id));
        setCorrectAnswers(prevAnswers => prevAnswers.filter(answer => answer !== id));
    };

    // Toggle correct answer
    const toggleCorrectAnswer = (id) => {
        if (questionType === "multiple_choice") {
            setCorrectAnswers([id]); // Single correct answer for multiple-choice
        } else if (questionType === "checkboxes") {
            setCorrectAnswers(prev =>
                prev.includes(id)
                    ? prev.filter(answer => answer !== id)
                    : [...prev, id]
            );
        }
    };

    // Update grade (prevent negative values)
    const handleGradeChange = (value) => {
        const newGrade = Math.max(0, Number(value));
        setGrade(newGrade);
    };

    // Update condition
    const updateCondition = (field, value) => {
        setCondition(prev => ({ ...prev, [field]: value }));
    };

    // Reset condition when isConditional is turned off
    useEffect(() => {
        if (!isConditional) {
            setCondition({});
        }
    }, [isConditional]);

    return (
        <div className="p-4 border rounded-md bg-gray-100 dark:bg-gray-700 shadow-md mb-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    Question {questionNumber}
                </h3>
                <button
                    onClick={() => onDelete(questionId)}
                    className="text-red-600 hover:text-red-800 transition-colors duration-200"
                    aria-label="Delete question"
                >
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
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                    </svg>
                </button>
            </div>

            {/* Question Text */}
            <TextInput
                label="Question Text"
                placeholder="Enter question text"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
            />

            {/* Question Type */}
            <SelectInput
                label="Question Type"
                value={questionType}
                onChange={(e) => {
                    setQuestionType(e.target.value);
                    setCorrectAnswers([]); // Reset answers when changing question type
                    setTextCorrectAnswer("");
                }}
                options={[
                    { value: "text", label: "Text" },
                    { value: "checkboxes", label: "Checkboxes" },
                    { value: "multiple_choice", label: "Multiple-choice" },
                ]}
            />

            {/* Options for Multiple Choice or Checkboxes */}
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
                                aria-label="Delete option"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={addOption}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-colors"
                    >
                        Add Option
                    </button>
                </div>
            )}

            {/* Text Answer */}
            {questionType === "text" && (
                <TextInput
                    label="Correct Answer"
                    placeholder="Enter the correct answer"
                    value={textCorrectAnswer}
                    onChange={(e) => setTextCorrectAnswer(e.target.value)}
                />
            )}

            {/* Required Checkbox */}
            <CheckboxInput
                label="Required"
                checked={isRequired}
                onChange={(e) => setIsRequired(e.target.checked)}
            />

            {/* Conditional Question */}
            <CheckboxInput
                label="Is this a conditional question?"
                checked={isConditional}
                onChange={(e) => setIsConditional(e.target.checked)}
            />
            
            {isConditional && (
                <div className="mt-4">
                    <SelectInput
                        label="Depends on Question"
                        value={condition.questionId || ""}
                        onChange={(e) => updateCondition("questionId", e.target.value)}
                        options={allQuestions
                            .filter(q => q.questionNumber < questionNumber) // Only show previous questions
                            .map(q => ({
                                value: q.id,
                                label: `Question ${q.questionNumber}: ${q.questionText || "Untitled"}`
                            }))}
                    />
                    {condition.questionId && (
                        <TextInput
                            label="Required Answer"
                            placeholder="Enter the answer that will trigger this question"
                            value={condition.answer || ""}
                            onChange={(e) => updateCondition("answer", e.target.value)}
                        />
                    )}
                </div>
            )}

            {/* Grade */}
            <TextInput
                label="Grade"
                type="number"
                value={grade}
                onChange={(e) => handleGradeChange(e.target.value)}
                min="0"
            />
        </div>
    );
};

export default QuestionForm;
