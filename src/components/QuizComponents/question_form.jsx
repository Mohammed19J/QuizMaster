import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import TextInput from "./text_input";
import SelectInput from "./select_input";
import CheckboxInput from "./checkbox_input";

// QuestionForm component
const QuestionForm = ({
  questionId,
  questionNumber,
  onUpdate,
  onDelete,
  initialData = {},
  allQuestions = [],
}) => {
    // The QuestionForm component is a form that allows the user to create a question for a quiz
    // The form contains fields for the question text, question type, options, correct answers, grade, and conditional logic
  const [questionText, setQuestionText] = useState(initialData.questionText || "");
  const [questionType, setQuestionType] = useState(initialData.questionType || "text");
  const [isRequired, setIsRequired] = useState(initialData.isRequired || false);
  const [grade, setGrade] = useState(initialData.grade || 0);
  const [options, setOptions] = useState(initialData.options || []);
  // Store correctAnswers as array of option IDs, consistent with your QuizCreator
  const [correctAnswers, setCorrectAnswers] = useState(initialData.correctAnswers || []);
  const [textCorrectAnswer, setTextCorrectAnswer] = useState(
    initialData.textCorrectAnswer || ""
  );
  const [isConditional, setIsConditional] = useState(initialData.isConditional || false);
  const [condition, setCondition] = useState(initialData.condition || {});

  // Whenever relevant states change, tell parent via onUpdate
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
    questionNumber,
  ]);

  // Toggle one ID in correctAnswers
  const toggleCorrectAnswer = (id) => {
    if (questionType === "multiple_choice") {
      // For multiple choice, allow only 1 correct answer
      setCorrectAnswers([id]);
    } else if (questionType === "checkboxes") {
      // For checkboxes, allow multiple
      setCorrectAnswers((prev) =>
        prev.includes(id)
          ? prev.filter((answerId) => answerId !== id)
          : [...prev, id]
      );
    }
  };

  // If questionType changes, reset certain fields (options or textCorrectAnswer) as needed
  const handleQuestionTypeChange = (e) => {
    const newType = e.target.value;
    setQuestionType(newType);
    
    // Reset answers when changing type
    if (newType === "text") {
      setCorrectAnswers([]);
      setOptions([]);
    } else {
      setTextCorrectAnswer("");
      if (options.length === 0) {
        // Add a default option if none exist
        addOption();
      }
    }
  };

  // Add a new option with a unique ID
  const addOption = () => {
    const newOptionId = Date.now().toString();  // Ensure ID is a string
    setOptions((prevOptions) => [...prevOptions, { id: newOptionId, value: "" }]);
  };

  // Update an existing option's text
  const updateOption = (id, value) => {
    setOptions((prevOptions) =>
      prevOptions.map((option) => (option.id === id ? { ...option, value } : option))
    );
    
    // If this option was marked as correct, update correctAnswers with new value
    if (correctAnswers.includes(id)) {
      setCorrectAnswers((prev) => [...prev]);
    }
  };

  // Delete an option + remove it from correctAnswers if necessary
  const deleteOption = (id) => {
    setOptions((prevOptions) => prevOptions.filter((option) => option.id !== id));
    setCorrectAnswers((prevAnswers) => prevAnswers.filter((answerId) => answerId !== id));
  };

  // Ensure grade is never negative
  const handleGradeChange = (value) => {
    const newGrade = Math.max(0, Number(value));
    setGrade(newGrade);
  };

  // Update conditional logic (which question + required answer)
  const updateCondition = (field, value) => {
    setCondition((prev) => ({ ...prev, [field]: value }));
  };

  // If user unchecks "isConditional," reset condition
  useEffect(() => {
    if (!isConditional) {
      setCondition({});
    }
  }, [isConditional]);
  // Log data when it changes
  useEffect(() => {
    console.log("QuestionForm received data:", {
      questionType,
      options,
      correctAnswers,
      initialData
    });
  }, [questionType, options, correctAnswers]);
  // Return the form
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
              d="M14.74 9l-.346 9m-4.788 0L9.26
                 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16
                 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0
                 01-2.244-2.077L4.772
                 5.79m14.456 0a48.108 48.108 0
                 00-3.478-.397m-12
                 .562c.34-.059.68-.114 1.022-.165m0
                 0a48.11 48.11 0
                 013.478-.397m7.5
                 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0
                 00-3.32 0c-1.18.037-2.09
                 1.022-2.09
                 2.201v.916m7.5
                 0a48.667 48.667
                 0 00-7.5
                 0"
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
        onChange={handleQuestionTypeChange}
        options={[
          { value: "text", label: "Text" },
          { value: "checkboxes", label: "Checkboxes" },
          { value: "multiple_choice", label: "Multiple-choice" },
        ]}
      />

      {/* Options if multiple_choice or checkboxes */}
      {(questionType === "multiple_choice" || questionType === "checkboxes") && (
        <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            Options
            </h4>
            {options.map((option, index) => {
              const isChecked = correctAnswers.includes(option.id);
              console.log(`Option ${option.id} checked? ${isChecked}`);  // Debug log
              return (
                <div key={option.id} className="flex items-center gap-2 mb-2">
                  {questionType === "multiple_choice" ? (
                    <input
                      type="radio"
                      name={`correct-answer-${questionId}`}
                      checked={isChecked}
                      onChange={() => toggleCorrectAnswer(option.id)}
                      className="form-radio text-blue-600"
                    />
                  ) : (
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleCorrectAnswer(option.id)}
                      className="form-checkbox text-blue-600"
                    />
                  )}

                  {/* Option text field */}
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
              );
            })}

            {/* Button to add a new option */}
            <button
            onClick={addOption}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-colors"
            >
            Add Option
            </button>
        </div>
        )}

      {/* Text input for correct answer if questionType===text */}
      {questionType === "text" && (
        <TextInput
          label="Correct Answer"
          placeholder="Enter the correct answer"
          value={textCorrectAnswer}
          onChange={(e) => setTextCorrectAnswer(e.target.value)}
        />
      )}

      {/* Required question? */}
      <CheckboxInput
        label="Required"
        checked={isRequired}
        onChange={(e) => setIsRequired(e.target.checked)}
      />

      {/* Conditional logic toggle */}
      <CheckboxInput
        label="Is this a conditional question?"
        checked={isConditional}
        onChange={(e) => setIsConditional(e.target.checked)}
      />

      {/* If conditional, choose question & answer that triggers this one */}
      {isConditional && (
        <div className="mt-4">
          <SelectInput
            label="Depends on Question"
            value={condition.questionId || ""}
            onChange={(e) => updateCondition("questionId", e.target.value)}
            options={allQuestions
              .filter((q) => q.questionNumber < questionNumber)
              .map((q) => ({
                value: q.id,
                label: `Question ${q.questionNumber}: ${
                  q.questionText || "Untitled"
                }`,
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

      {/* Grade for this question */}
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
