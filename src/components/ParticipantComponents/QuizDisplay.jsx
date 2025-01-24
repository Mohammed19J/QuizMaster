import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ref, get, push, update } from "firebase/database";
import { database } from "../../firebase/firebase";
import WelcomeMessage from "../GeneralComponents/WelcomeMessage";
import LightSwitch from "../GeneralComponents/light_switch_header";
import { CheckCircle, XCircle } from "lucide-react";

// The QuizDisplay component is responsible for displaying the quiz to the participant
const QuizDisplay = () => {
  // The quizId is extracted from the URL
  const { quizId } = useParams();
  // The state variables are initialized
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userResponses, setUserResponses] = useState({});
  const [score, setScore] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [questionFeedback, setQuestionFeedback] = useState({});
  // The useEffect hook is used to fetch the quiz data from the database
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const quizRef = ref(database, `quizzes/${quizId}`);
        const snapshot = await get(quizRef);
        if (snapshot.exists()) {
          setQuiz(snapshot.val());
        } else {
          setError("Quiz not found.");
        }
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setError("Failed to load the quiz.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);
  // The handleAnswerChange function is used to update the user's responses
  const handleAnswerChange = (questionId, optionValue, isCheckbox) => {
    // The setUserResponses function is used to update the user's responses
    setUserResponses((prev) => {
      const updated = { ...prev };
      // If the question is a checkbox question, the user's response is updated accordingly
      if (isCheckbox) {
        // If the user's response is an array, it is used as is, otherwise it is initialized as an empty array
        const currentAnswers = Array.isArray(prev[questionId]) ? prev[questionId] : [];
        // If the user's response already includes the option value, it is removed
        if (currentAnswers.includes(optionValue)) {
          updated[questionId] = currentAnswers.filter((val) => val !== optionValue);
          // Otherwise, the option value is added to the user's response
        } else {
          updated[questionId] = [...currentAnswers, optionValue];
        }
        // If the question is not a checkbox question, the user's response is updated accordingly
      } else {
        updated[questionId] = optionValue;
      }
      return updated;
    });
  };
  // The checkShouldShow function is used to determine if a question should be displayed
  const checkShouldShow = (question) => {
    // If the question is not conditional, it should be displayed
    if (!question.isConditional) return true;
    // If the question is conditional, the condition is evaluated
    const conditionQuestionId = question.condition?.questionId;
    const expectedAnswer = question.condition?.answer;
    const userAnswer = userResponses[conditionQuestionId];

    // If the user hasn't answered the condition question yet
    if (!userAnswer) return false;

    // For checkbox questions, check if the expected answer is included in the array of answers
    if (Array.isArray(userAnswer)) {
      return userAnswer.includes(expectedAnswer);
    }

    // For multiple choice or text questions (single answer)
    return userAnswer === expectedAnswer;
  };
  // The evaluateAnswer function is used to evaluate the user's answer
  const evaluateAnswer = (question, userAnswer) => {
    // If the question is a survey question, it is marked as correct
    if (question.grade === 0) {
      return { correct: true, score: 0, feedback: "This was a survey question." };
    }
    // If the question is a checkbox question, the user's answer is evaluated
    if (question.questionType === "checkboxes" && Array.isArray(question.correctAnswers)) {
      const isCorrect =
        Array.isArray(userAnswer) &&
        // Check if the user's response has the same length as the correct answers
        userAnswer.length === question.correctAnswers.length &&
        // Check if all correct answers are included in the user's response
        userAnswer.every((ans) => question.correctAnswers.includes(ans));
        // The result of the evaluation is returned
      return {
        correct: isCorrect,
        score: isCorrect ? question.grade : 0,
        feedback: isCorrect
          ? "Perfect! You selected all the correct answers."
          : `The correct answers were: ${question.correctAnswers.join(", ")}`,
      };
      // If the question is a multiple choice question, the user's answer is evaluated
    } else if (question.questionType === "multiple_choice") {
      const isCorrect = question.correctAnswers?.includes(userAnswer);
      return {
        correct: isCorrect,
        score: isCorrect ? question.grade : 0,
        feedback: isCorrect
          ? "Correct! Well done."
          : `The correct answer was: ${question.correctAnswers[0]}`,
      };
      // If the question is a text question, the user's answer is evaluated
    } else if (question.questionType === "text") {
      const isCorrect = question.textCorrectAnswer === userAnswer;
      return {
        correct: isCorrect,
        score: isCorrect ? question.grade : 0,
        feedback: isCorrect
          ? "Perfect answer!"
          : `The correct answer was: ${question.textCorrectAnswer}`,
      };
    }
    // If the question is of an unknown type, an error message is returned
    return { correct: false, score: 0, feedback: "Unable to evaluate answer." };
  };
  // The handleSubmit function is used to submit the quiz
  const handleSubmit = async () => {
    // The user's responses are checked to ensure that all required questions have been answered
    const unansweredRequired = quiz.questions.some(
      (question) =>
        checkShouldShow(question) &&
        question.isRequired &&
        (!userResponses[question.id] ||
          (Array.isArray(userResponses[question.id]) && userResponses[question.id].length === 0))
    );
    // If there are unanswered required questions, an alert is displayed and the function is exited
    if (unansweredRequired) {
      alert("Please answer all required questions before submitting.");
      return;
    }
    // The total score and feedback for each question are initialized
    let totalScore = 0;
    const feedback = {};
    // The user's responses are evaluated for each question
    quiz.questions.forEach((question) => {
      if (checkShouldShow(question)) {
        const userAnswer = userResponses[question.id];
        const evaluation = evaluateAnswer(question, userAnswer);
        totalScore += evaluation.score;
        feedback[question.id] = evaluation;
      }
    });
    // The total score and feedback are updated
    setScore(totalScore);
    setQuestionFeedback(feedback);
    setIsSubmitted(true);
    // The user's responses are saved in the database
    const totalPossibleScore = quiz.questions.reduce((acc, curr) => acc + (curr.grade || 0), 0);
    // The response payload is initialized
    try {
      const responsePayload = {
        responses: userResponses,
        totalScore,
        maxPossibleScore: totalPossibleScore,
        submittedAt: new Date().toISOString(),
      };

      // Save response in 'responses/:quizId'
      const responsesRef = ref(database, `responses/${quizId}`);
      await push(responsesRef, responsePayload);

      // Increment the "responses" count for the quiz in the creator's quizHistory
      if (quiz.creatorUid) {
        const creatorQuizRef = ref(database, `users/${quiz.creatorUid}/quizHistory/${quizId}`);
        const snapshot = await get(creatorQuizRef);
        if (snapshot.exists()) {
          const currentData = snapshot.val();
          const currentResponses = currentData.responses || 0;
          await update(creatorQuizRef, {
            responses: currentResponses + 1,
          });
        }

        // Update mostSubmittedQuizzes for the creator
        const mostSubmittedQuizzesRef = ref(database, `users/${quiz.creatorUid}/mostSubmittedQuizzes`);
        const mostSubmittedSnapshot = await get(mostSubmittedQuizzesRef);

        let updatedQuizzes = {};
        if (mostSubmittedSnapshot.exists()) {
          updatedQuizzes = mostSubmittedSnapshot.val();
        }

        // Increment the count for this quiz or initialize it to 1
        if (updatedQuizzes[quiz.title]) {
          updatedQuizzes[quiz.title] += 1;
        } else {
          updatedQuizzes[quiz.title] = 1;
        }

        // Save the updated mostSubmittedQuizzes back to Firebase
        await update(mostSubmittedQuizzesRef, updatedQuizzes);
      }
    } catch (err) {
      console.error("Failed to save responses:", err);
    }
  };
  // The getQuestionBackground function is used to determine the background color of a question
  const getQuestionBackground = (question) => {
    if (!isSubmitted || question.grade === 0) return "";
    const feedback = questionFeedback[question.id];
    return feedback?.correct
      ? "bg-green-50 dark:bg-green-900/30"
      : "bg-red-50 dark:bg-red-900/30";
  };
  // The loading state is checked and the appropriate component is rendered
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  // The error state is checked and the appropriate component is rendered
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg">
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      </div>
    );
  }
  // The quiz state is checked and the appropriate component is rendered
  const totalPossibleScore =
    quiz?.questions?.reduce((acc, curr) => acc + (curr.grade || 0), 0) || 0;
  const scorePercentage = totalPossibleScore > 0 ? (score / totalPossibleScore) * 100 : 0;

  return (
    // The quiz is displayed to the participant
    <div className="w-full min-h-screen flex flex-col items-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">      <div className="w-full max-w-3xl">
        <LightSwitch className="absolute top-4 right-8" />
        <div className="text-center mb-8 mt-12 md:mt-8">
          <WelcomeMessage
            text="Welcome to QuizMaster"
            className="text-3xl text-blue-600 dark:text-blue-400 mb-4 font-bold"
        />
          <h2 className="text-xl text-gray-700 dark:text-gray-300 font-semibold">
            {quiz?.title}
          </h2>
        </div>

        <form
          className="space-y-8"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {quiz?.questions?.map((question) => {
            if (!checkShouldShow(question)) return null;
            const feedback = questionFeedback[question.id];

            return (
              <div
                key={question.id}
                className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl ${getQuestionBackground(
                  question
                )}`}
              >
                <h3 className="text-lg font-semibold mb-4 flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                    {question.questionNumber}
                  </span>
                  <span className="text-gray-800 dark:text-gray-200">
                    {question.questionText}
                    {question.isRequired && <span className="text-red-500 ml-2">*</span>}
                  </span>
                </h3>

                <div className="ml-11">
                  {question.options && question.options.length > 0 ? (
                    <div className="space-y-3">
                      {question.options.map((option) => (
                        <label
                          key={option.id}
                          className="flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <input
                            type={
                              question.questionType === "checkboxes"
                                ? "checkbox"
                                : "radio"
                            }
                            name={question.id}
                            value={option.value}
                            checked={
                              question.questionType === "checkboxes"
                                ? userResponses[question.id]?.includes(option.value)
                                : userResponses[question.id] === option.value
                            }
                            onChange={() =>
                              handleAnswerChange(
                                question.id,
                                option.value,
                                question.questionType === "checkboxes"
                              )
                            }
                            disabled={isSubmitted}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <span className="ml-3 text-gray-700 dark:text-gray-300">
                            {option.value}
                          </span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={userResponses[question.id] || ""}
                      onChange={(e) =>
                        handleAnswerChange(question.id, e.target.value, false)
                      }
                      disabled={isSubmitted}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-200 dark:bg-gray-700"
                      placeholder="Enter your answer..."
                    />
                  )}

                  {isSubmitted && question.grade > 0 && (
                    <div
                      className={`mt-4 p-4 rounded-lg flex items-start gap-3 ${
                        feedback?.correct
                          ? "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200"
                          : "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200"
                      }`}
                    >
                      {feedback?.correct ? (
                        <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                      ) : (
                        <XCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                      )}
                      <div>
                        <p className="font-semibold">
                          {feedback?.correct ? "Correct!" : "Incorrect"}
                        </p>
                        <p className="mt-1">{feedback?.feedback}</p>
                        <p className="mt-2 font-medium">
                          Points: {feedback?.score} / {question.grade}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <div className="sticky bottom-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
            {!isSubmitted ? (
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200"
              >
                Submit Quiz
              </button>
            ) : (
              <div className="text-center space-y-4">
                {totalPossibleScore > 0 ? (
                  <>
                    <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
                      Final Score
                    </p>
                    <div>
                      <p className="text-3xl font-bold text-blue-600">
                        {score}/{totalPossibleScore}
                      </p>
                      <p
                        className={`text-lg font-semibold mt-2 ${
                          scorePercentage >= 80
                            ? "text-green-500"
                            : scorePercentage >= 60
                            ? "text-yellow-500"
                            : "text-red-500"
                        }`}
                      >
                        {scorePercentage.toFixed(1)}%
                      </p>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      {scorePercentage >= 80
                        ? "Excellent work! 🌟"
                        : scorePercentage >= 60
                        ? "Good job! Keep practicing! 💪"
                        : "Keep studying and try again! 📚"}
                    </p>
                  </>
                ) : (
                  <div>
                    <p className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                      Thank you for your submission! 🎉
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      We appreciate your time and feedback.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizDisplay;