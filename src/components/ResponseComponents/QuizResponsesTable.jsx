import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ResponseTableComponents/card';
import { Badge } from '../ResponseTableComponents/badge';
import { Button } from '../ResponseTableComponents/button';
import { ArrowUpDown, FileSpreadsheet, ChevronRight, Users, Brain, Clock } from 'lucide-react';
import { ref, get } from 'firebase/database';
import { database } from '../../firebase/firebase';
import ExcelJS from 'exceljs';

// QuizResponsesTable component
const QuizResponsesTable = ({ quizId, onBack }) => {
  // State variables
  const [responses, setResponses] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'submittedAt', direction: 'desc' });
  const [calculatedMaxScore, setCalculatedMaxScore] = useState(0);
  // Fetch quiz data & responses
  useEffect(() => {
    if (!quizId) return;
    // Fetch quiz data & responses
    const fetchQuizData = async () => {
      try {
        setLoading(true);

        // Fetch quiz questions & compute max possible score
        const quizRef = ref(database, `quizzes/${quizId}`);
        const quizSnapshot = await get(quizRef);
        // If quiz doesn't exist, set error and return
        if (quizSnapshot.exists()) {
          const quizData = quizSnapshot.val();
          setQuestions(quizData.questions || []);

          // Fallback max score from quiz data
          if (quizData.questions && Array.isArray(quizData.questions)) {
            const totalMaxScore = quizData.questions.reduce((acc, question) => {
              // Use grade or maxScore
              return acc + (question.grade || question.maxScore || 0);
            }, 0);
            setCalculatedMaxScore(totalMaxScore);
          } else {
            setCalculatedMaxScore(0);
          }
        }

        // Fetch responses
        const responsesRef = ref(database, `responses/${quizId}`);
        const responsesSnapshot = await get(responsesRef);

        if (responsesSnapshot.exists()) {
          const responsesData = responsesSnapshot.val();
          const formattedResponses = Object.entries(responsesData).map(([id, data]) => ({
            ...data,
            id, // Keep the response ID
          }));
          setResponses(formattedResponses);
        } else {
          setResponses([]);
        }
      } catch (err) {
        console.error("Error fetching quiz data:", err);
        setError("Failed to fetch quiz data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [quizId]);
  // Helper function to get the value of a response option
  const getOptionValue = (question, responseValue) => {
    if (!responseValue) return "-";
  
    // For a checkbox question, responseValue should be an array of selected .value items
    if (question.questionType === 'checkboxes') {
      const selectedOptions = question.options?.filter(opt =>
        Array.isArray(responseValue) && responseValue.includes(opt.value)
      );
  
      // If user has no selected options, just return the raw data or "-"
      if (!selectedOptions || selectedOptions.length === 0) {
        return Array.isArray(responseValue) && responseValue.length
          ? responseValue.join(', ')
          : "-";
      }
  
      // Render selected options in a square container
      return (
        <div className="flex flex-wrap gap-2">
          {selectedOptions.map((opt) => (
            <Badge
              key={opt.id}
              variant="outline"
              className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 w-20 h-20 flex items-center justify-center text-center p-2 border border-gray-300"
              style={{
                borderRadius: 0, // Ensures no rounding for square shape
              }}
            >
              {opt.value}
            </Badge>
          ))}
        </div>
      );
      
    }
  
    // For multiple_choice or text
    const matchedOption = question.options?.find(opt => opt.value === responseValue);
    return matchedOption ? matchedOption.value : responseValue;
  };
  // Export responses to Excel
  const handleDownloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Responses");

    // Table headers
    const headers = [
      ...questions.map(q => q.questionText || `Question ${q.questionNumber}`),
      "Submitted At",
      "Score"
    ];
    worksheet.addRow(headers);

    // One row per response
    responses.forEach(response => {
      const rowData = [
        ...questions.map(q => {
          const userAnswer = response.responses?.[q.id];
          // Convert to plain text for Excel
          if (q.questionType === 'checkboxes' && Array.isArray(userAnswer)) {
            return userAnswer.join(', ');
          }
          return userAnswer || "-";
        }),
        new Date(response.submittedAt).toLocaleString(),
        // If maxScore===0 => "Not Graded"; else "totalScore / maxScore"
        (() => {
          const maxScore = response.maxPossibleScore ?? calculatedMaxScore;
          if (maxScore === 0) {
            return "Not Graded";
          } else {
            return `${response.totalScore || 0}/${maxScore}`;
          }
        })()
      ];
      worksheet.addRow(rowData);
    });

    // Style headers
    worksheet.getRow(1).font = { bold: true };

    // Auto-fit column widths
    worksheet.columns.forEach(column => {
      let maxLength = 15;
      column.eachCell({ includeEmpty: true }, cell => {
        const cellValue = cell.value ? cell.value.toString() : '';
        maxLength = Math.max(maxLength, cellValue.length + 2);
      });
      column.width = maxLength;
    });

    // Export the Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `quiz_responses_${quizId}.xlsx`;
    link.click();
  };

  // Some helper stats
  const statsCards = [
    {
      title: "Total Responses",
      value: responses.length,
      icon: <Users className="h-4 w-4" />,
      color: "bg-blue-500"
    },
    {
      title: "Average Score",
      value: responses.length
        ? (() => {
            const validResponses = responses.filter(
              r => (r.maxPossibleScore ?? calculatedMaxScore) > 0
            );
            if (!validResponses.length) return "Not Graded";

            const sumPercentage = validResponses.reduce((acc, r) => {
              const maxScore = r.maxPossibleScore ?? calculatedMaxScore;
              return acc + (100 * (r.totalScore || 0) / maxScore);
            }, 0);
            return (sumPercentage / validResponses.length).toFixed(1) + "%";
          })()
        : "N/A",
      icon: <Brain className="h-4 w-4" />,
      color: "bg-green-500"
    },
    {
      title: "Latest Response",
      value: responses.length
        ? new Date(
            Math.max(...responses.map(r => new Date(r.submittedAt).getTime()))
          ).toLocaleString()
        : "N/A",
      icon: <Clock className="h-4 w-4" />,
      color: "bg-purple-500"
    }
  ];

  // Sorting logic
  const handleSort = key => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc'
        ? 'desc'
        : 'asc'
    });
  };
  // Sort responses based on sortConfig
  const sortedResponses = [...responses].sort((a, b) => {
    if (sortConfig.key === 'submittedAt') {
      return sortConfig.direction === 'asc'
        ? new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
        : new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
    }
    // Sort by totalScore
    if (sortConfig.key === 'totalScore') {
      return sortConfig.direction === 'asc'
        ? (a.totalScore || 0) - (b.totalScore || 0)
        : (b.totalScore || 0) - (a.totalScore || 0);
    }
    return 0;
  });
  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  // Error state
  if (error) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent className="pt-6 flex justify-center">
          <p className="text-red-500 text-center">{error}</p>
        </CardContent>
      </Card>
    );
  }
  // Main render
  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Top Section: Back Button & Maybe a Title */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        {onBack && (
          <Button
            onClick={onBack}
            className="bg-gray-600 hover:bg-gray-700 flex items-center justify-center"
          >
            <ChevronRight className="mr-2 h-4 w-4 transform rotate-180" />
            Back
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statsCards.map((stat, index) => (
          <Card key={index} className="transition-all duration-200 hover:shadow-lg">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
              <div className="mb-2">
                <div className={`${stat.color} p-3 rounded-full text-white flex items-center justify-center`}>
                  {stat.icon}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold mt-1">
                  {stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Export Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleDownloadExcel}
          className="bg-green-600 hover:bg-green-700 flex items-center justify-center"
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export to Excel
        </Button>
      </div>

      {/* Responses Table */}
      {responses.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium">No responses yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Responses will appear here once students complete the quiz.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="p-0">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    {questions.map(q => (
                      <th
                        key={q.id}
                        className="px-6 py-4 text-left font-semibold text-gray-700 dark:text-gray-200"
                      >
                        {q.questionText || `Question ${q.questionNumber}`}
                      </th>
                    ))}
                    <th className="px-6 py-4 text-left">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('submittedAt')}
                        className="font-semibold text-gray-700 dark:text-gray-200 hover:text-gray-900 flex items-center"
                      >
                        Submitted At
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('totalScore')}
                        className="font-semibold text-gray-700 dark:text-gray-200 hover:text-gray-900 flex items-center"
                      >
                        Score
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedResponses.map((response, idx) => {
                    const maxScore = response.maxPossibleScore ?? calculatedMaxScore;
                    return (
                      <tr
                        key={idx}
                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        {questions.map(q => (
                          <td
                            key={q.id}
                            className="px-6 py-4 align-top text-left whitespace-pre-wrap break-words"
                          >
                            {getOptionValue(q, response.responses?.[q.id])}
                          </td>
                        ))}
                        <td className="px-6 py-4 text-left text-gray-500">
                          {new Date(response.submittedAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-left">
                          {maxScore === 0 ? (
                            <Badge className="bg-gray-200 text-gray-800">
                              Not Graded
                            </Badge>
                          ) : (
                            <Badge
                              className={
                                (response.totalScore / maxScore) * 100 >= 80
                                  ? "bg-green-100 text-green-800"
                                  : (response.totalScore / maxScore) * 100 >= 60
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }
                            >
                              {`${response.totalScore || 0}/${maxScore}`}
                            </Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuizResponsesTable;