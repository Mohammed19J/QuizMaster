import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import { ref, get } from "firebase/database";
import { database } from "../../firebase/firebase";
import { useUser } from "../../context/UserContext";

const QuizResponsesPage = ({ onQuizSelect }) => {
    const { user } = useUser();
    const [quizHistory, setQuizHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user?.uid) return;

        const fetchQuizHistory = async () => {
            try {
                setLoading(true);
                const userQuizRef = ref(database, `users/${user.uid}/quizHistory`);
                const snapshot = await get(userQuizRef);

                if (snapshot.exists()) {
                    const quizzes = snapshot.val();
                    const formattedQuizzes = Object.entries(quizzes)
                        .map(([quizId, data]) => ({
                            quizId,
                            ...data,
                        }))
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setQuizHistory(formattedQuizzes);
                } else {
                    setQuizHistory([]);
                }
            } catch (err) {
                console.error("Error fetching quiz history:", err);
                setError("Failed to fetch quiz responses. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchQuizHistory();
    }, [user?.uid]);

    if (!user) return <p className="text-center">Please log in to view your quiz responses.</p>;
    if (loading) return <p className="text-gray-600 dark:text-gray-300 text-center">Loading quiz responses...</p>;
    if (error) return <p className="text-red-500 text-center">{error}</p>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white text-center">
                Quiz Responses
            </h2>
            {quizHistory.length === 0 ? (
                <p className="text-gray-700 dark:text-gray-300 text-center">
                    No responses found. Create a quiz and collect responses to see them here!
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {quizHistory.map((quiz) => (
                        <div
                            key={quiz.quizId}
                            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700"
                        >
                            <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                                {quiz.title || "Untitled Quiz"}
                            </h3>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Created: {new Date(quiz.createdAt).toLocaleDateString()}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Questions: {quiz.questions?.length || 0}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Responses: {quiz.responses || 0}
                                </p>
                            </div>
                            <div className="mt-4 flex justify-center items-center">
                                <button
                                    onClick={() => onQuizSelect(quiz)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all duration-200"
                                >
                                    Show Response
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default QuizResponsesPage;
