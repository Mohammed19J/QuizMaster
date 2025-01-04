import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import Button from "./button";
import QuestionForm from "./question_form";
import { ref, update, get } from "firebase/database";
import { database } from "../firebase/firebase";
import { useUser } from "../context/UserContext";

const QuizCreator = ({ initialQuiz = null, onClearSelection }) => {
    const [questions, setQuestions] = useState([]);
    const [quizTitle, setQuizTitle] = useState("");
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [quizLink, setQuizLink] = useState("");
    const [copySuccess, setCopySuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useUser();

    useEffect(() => {
        if (initialQuiz) {
            setQuestions(initialQuiz.questions || []);
            setQuizTitle(initialQuiz.title || "");
        } else {
            setQuestions([]);
            setQuizTitle("");
        }
    }, [initialQuiz]);

    const addNewQuestion = () => {
        const newQuestion = {
            id: `q_${Date.now()}`,
            questionText: "",
            questionType: "text",
            isRequired: false,
            grade: 0,
            options: [],
            correctAnswers: [],
            textCorrectAnswer: "",
            isConditional: false,
            condition: {},
            questionNumber: questions.length + 1,
        };
        setQuestions([...questions, newQuestion]);
    };

    const updateQuestion = (questionId, updatedQuestion) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((q) => (q.id === questionId ? { ...updatedQuestion, id: questionId } : q))
        );
    };

    const deleteQuestion = (questionId) => {
        setQuestions((prevQuestions) =>
            prevQuestions
                .filter((q) => q.id !== questionId)
                .map((q, index) => ({ ...q, questionNumber: index + 1 }))
        );
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
    
        const invalidQuestions = questions.some(
            (q) =>
                !q.questionText.trim() ||
                q.grade < 0 ||
                (q.questionType !== "text" && q.options.length === 0) ||
                (q.isConditional && (!q.condition.questionId || !q.condition.answer))
        );
    
        if (invalidQuestions) {
            alert(
                "Some questions are incomplete. Please ensure every question has a title, valid grade (≥ 0), and correct configurations."
            );
            return;
        }
    
        try {
            setIsLoading(true);
            const quizId = initialQuiz?.quizId || `quiz_${Date.now()}`;
            const quizRef = ref(database, `quizzes/${quizId}`);
            const userStatsRef = ref(database, `users/${user.uid}`);
            const userQuizRef = ref(database, `users/${user.uid}/quizHistory/${quizId}`);
    
            const quizPayload = {
                quizId,
                title: quizTitle.trim(),
                creatorUid: user.uid,
                createdAt: initialQuiz?.createdAt || new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                questions,
            };
    
            await update(quizRef, quizPayload);
            await update(userQuizRef, { ...quizPayload, responses: initialQuiz?.responses || 0 });
    
            // Increment quizzesCreated only if this is a new quiz (not editing an existing one)
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

            const quizPayload = {
                quizId: newQuizId,
                title: `${quizTitle.trim()} (Copy)`,
                creatorUid: user.uid,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                questions,
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

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(quizLink);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            alert("Failed to copy link. Please try copying manually.");
        }
    };

    const closePopup = () => {
        setShowSuccessPopup(false);
        if (onClearSelection) {
            onClearSelection(); // Navigate back to history if editing from history
        } else if (!initialQuiz) {
            // Reset fields if creating a new quiz
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
                <input
                    type="text"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    placeholder="Enter quiz title"
                    className="mb-6 w-full px-4 py-2 border rounded-md text-gray-700 dark:text-gray-200 dark:bg-gray-800"
                />
                {questions.map((question, index) => (
                    <div key={question.id} className="mb-6">
                        <QuestionForm
                            questionId={question.id}
                            questionNumber={index + 1}
                            initialData={question}
                            onUpdate={(updatedQuestion) => updateQuestion(question.id, updatedQuestion)}
                            onDelete={() => deleteQuestion(question.id)}
                            allQuestions={questions.filter((q) => q.id !== question.id)}
                        />
                    </div>
                ))}
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
