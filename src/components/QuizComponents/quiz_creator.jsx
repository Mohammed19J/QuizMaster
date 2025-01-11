import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import Button from "../GeneralComponents/button";
import QuestionForm from "./question_form";
import { ref, update, get } from "firebase/database";
import { database } from "../../firebase/firebase";
import { useUser } from "../../context/UserContext";

const QuizCreator = ({ initialQuiz = null, onClearSelection }) => {
  const [questions, setQuestions] = useState([]);
  const [quizTitle, setQuizTitle] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [quizLink, setQuizLink] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  // Load existing quiz data (if editing) or reset for a new quiz
  useEffect(() => {
    if (initialQuiz) {
      console.log("Initial Quiz Data:", initialQuiz);  // Debug log
      const mappedQuestions = (initialQuiz.questions || []).map(question => {
        console.log("Processing Question:", question);  // Debug log
        const mappedQuestion = { ...question };
        
        if (question.questionType === 'text') {
          mappedQuestion.textCorrectAnswer = question.correctAnswers?.[0] || '';
          mappedQuestion.correctAnswers = [];
        } else if (question.options && (question.questionType === 'multiple_choice' || question.questionType === 'checkboxes')) {
          mappedQuestion.correctAnswers = question.options
            .filter(option => {
              const isCorrect = question.correctAnswers?.includes(option.value);
              console.log(`Option ${option.value} correct? ${isCorrect}`);  // Debug log
              return isCorrect;
            })
            .map(option => option.id);
        }
        
        console.log("Mapped Question:", mappedQuestion);  // Debug log
        return mappedQuestion;
      });
  
      setQuestions(mappedQuestions);
      setQuizTitle(initialQuiz.title || "");
    } else {
      setQuestions([]);
      setQuizTitle("");
    }
  }, [initialQuiz]);

  // Add a new question object to the list
  const addNewQuestion = () => {
    const newQuestion = {
      id: `q_${Date.now()}`,
      questionText: "",
      questionType: "text",
      isRequired: false,
      grade: 0,
      options: [],
      correctAnswers: [], // For multiple_choice and checkboxes
      textCorrectAnswer: "",
      isConditional: false,
      condition: {},
      questionNumber: questions.length + 1,
    };
    setQuestions((prev) => [...prev, newQuestion]);
  };

  // Update one question in state
  const updateQuestion = (questionId, updatedQuestion) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId ? { ...updatedQuestion, id: questionId } : q
      )
    );
  };

  // Delete one question & re-number remaining
  const deleteQuestion = (questionId) => {
    setQuestions((prevQuestions) =>
      prevQuestions
        .filter((q) => q.id !== questionId)
        .map((q, index) => ({ ...q, questionNumber: index + 1 }))
    );
  };

  /**
   * processQuestionsForSave:
   *  - Convert each question’s in-memory correctAnswers (option IDs) into final form (option text or user input).
   *  - The result is what actually gets stored in the DB.
   */
  const processQuestionsForSave = (questions) => {
    return questions.map((question) => {
      const processedQuestion = { ...question };
  
      // For multiple_choice and checkboxes, convert option IDs to option values
      if (question.questionType === "multiple_choice" || question.questionType === "checkboxes") {
        processedQuestion.correctAnswers = question.correctAnswers
          .map(answerId => {
            const option = question.options.find(opt => opt.id === answerId);
            return option ? option.value : null;
          })
          .filter(value => value !== null); // Remove any null values
      } else if (question.questionType === "text") {
        // For text questions, store the textCorrectAnswer if non-empty
        processedQuestion.correctAnswers =
          question.textCorrectAnswer.trim() !== ""
            ? [question.textCorrectAnswer]
            : [];
      }
  
      return processedQuestion;
    });
  };

  const handleSaveQuiz = async () => {
    if (!user) {
      alert("Please log in to save your quiz.");
      return;
    }

    if (!quizTitle.trim()) {
      alert("Quiz title is required!");
      return;
    }

    if (questions.length === 0) {
      alert("Please add at least one question to save the quiz!");
      return;
    }

    // Basic validation
    const invalidQuestions = questions.some(
      (q) =>
        !q.questionText.trim() ||
        q.grade < 0 ||
        (q.questionType !== "text" && q.options.length === 0) ||
        (q.isConditional && (!q.condition.questionId || !q.condition.answer))
    );

    if (invalidQuestions) {
      alert(
        "Some questions are incomplete. Please ensure every question has a question text, valid grade (≥ 0), and correct configurations."
      );
      return;
    }

    try {
      setIsLoading(true);
      const quizId = initialQuiz?.quizId || `quiz_${Date.now()}`;
      const quizRef = ref(database, `quizzes/${quizId}`);
      const userStatsRef = ref(database, `users/${user.uid}`);
      const userQuizRef = ref(database, `users/${user.uid}/quizHistory/${quizId}`);

      // Transform question.correctAnswers from option IDs => final text for DB
      const processedQuestions = processQuestionsForSave(questions);

      const quizPayload = {
        quizId,
        title: quizTitle.trim(),
        creatorUid: user.uid,
        createdAt: initialQuiz?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        questions: processedQuestions,
      };

      // Save to "quizzes/:quizId"
      await update(quizRef, quizPayload);

      // Save to "users/:uid/quizHistory/:quizId"
      await update(userQuizRef, {
        ...quizPayload,
        responses: initialQuiz?.responses || 0,
      });

      // If brand new quiz => increment "quizzesCreated" stat
      if (!initialQuiz) {
        const userSnapshot = await get(userStatsRef);
        const quizzesCreated = userSnapshot.exists()
          ? userSnapshot.val().quizzesCreated || 0
          : 0;
        await update(userStatsRef, { quizzesCreated: quizzesCreated + 1 });
      }

      const generatedLink = `${window.location.origin}/quiz/${quizId}`;
      setQuizLink(generatedLink);
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save quiz. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Create a fresh copy of the current quiz
  const handleSaveAsNew = async () => {
    if (!user) {
      alert("Please log in to save your quiz.");
      return;
    }

    try {
      setIsLoading(true);
      const newQuizId = `quiz_${Date.now()}`;
      const quizRef = ref(database, `quizzes/${newQuizId}`);
      const userStatsRef = ref(database, `users/${user.uid}`);
      const userQuizRef = ref(database, `users/${user.uid}/quizHistory/${newQuizId}`);

      const userSnapshot = await get(userStatsRef);
      const quizzesCreated = userSnapshot.exists()
        ? userSnapshot.val().quizzesCreated || 0
        : 0;

      // Transform question.correctAnswers from IDs => final text
      const processedQuestions = processQuestionsForSave(questions);

      const quizPayload = {
        quizId: newQuizId,
        title: `${quizTitle.trim()} (Copy)`,
        creatorUid: user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        questions: processedQuestions,
        responses: 0,
      };

      await update(quizRef, quizPayload);
      await update(userQuizRef, quizPayload);
      await update(userStatsRef, { quizzesCreated: quizzesCreated + 1 });

      const generatedLink = `${window.location.origin}/quiz/${newQuizId}`;
      setQuizLink(generatedLink);
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save quiz. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Copy quiz link to clipboard
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(quizLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      alert("Failed to copy link. Please try copying manually.");
    }
  };

  // Close success popup
  const closePopup = () => {
    setShowSuccessPopup(false);
    if (onClearSelection) {
      onClearSelection();
    } else if (!initialQuiz) {
      // If brand-new quiz, reset form
      setQuestions([]);
      setQuizTitle("");
    }
  };

  return (
    <section className="flex flex-col items-center py-10 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
        {initialQuiz ? "Edit Quiz" : "Create New Quiz"}
      </h2>

      <div className="w-full max-w-4xl px-4">
        {/* Quiz Title */}
        <input
          type="text"
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
          placeholder="Enter quiz title"
          className="mb-6 w-full px-4 py-2 border rounded-md text-gray-700 dark:text-gray-200 dark:bg-gray-800"
        />

        {/* Render all questions */}
        {questions.map((question, index) => (
          <div key={question.id} className="mb-6">
            <QuestionForm
              questionId={question.id}
              questionNumber={index + 1}
              initialData={question}
              onUpdate={(updatedQuestion) => updateQuestion(question.id, updatedQuestion)}
              onDelete={() => deleteQuestion(question.id)}
              allQuestions={questions.filter((q) => q.id !== question.id)}
              /* 
                If question.correctAnswers is an array of option IDs, 
                your QuestionForm can show each option 
                with checked={correctAnswers.includes(option.id)} 
              */
            />
          </div>
        ))}

        {/* Buttons: Add Q, Save, etc. */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <Button
            text="Add Question"
            onClick={addNewQuestion}
            className="bg-blue-600 text-white font-bold px-6 py-2 rounded-md hover:bg-blue-500"
          />
          <Button
            text={isLoading ? "Saving..." : "Save Quiz"}
            onClick={handleSaveQuiz}
            disabled={isLoading}
            className={`bg-green-600 text-white font-bold px-6 py-2 rounded-md ${
              isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-500"
            }`}
          />

          {initialQuiz && (
            <Button
              text={isLoading ? "Saving..." : "Save as New Quiz"}
              onClick={handleSaveAsNew}
              disabled={isLoading}
              className={`bg-purple-600 text-white font-bold px-6 py-2 rounded-md ${
                isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-purple-500"
              }`}
            />
          )}

          {initialQuiz && onClearSelection && (
            <Button
              text="Back to Quiz History"
              onClick={onClearSelection}
              className="bg-gray-600 text-white font-bold px-6 py-2 rounded-md hover:bg-gray-500"
            />
          )}
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Quiz Saved Successfully!
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You can share your quiz using this link:
            </p>
            <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded mb-4 break-all">
              {quizLink}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={copyLink}
                className={`px-4 py-2 rounded transition-all ${
                  copySuccess
                    ? "bg-green-600 text-white"
                    : "bg-blue-600 text-white hover:bg-blue-500"
                }`}
              >
                {copySuccess ? "Copied!" : "Copy Link"}
              </button>
              <button
                onClick={closePopup}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default QuizCreator;
