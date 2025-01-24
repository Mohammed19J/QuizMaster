import { h, Fragment } from "preact";
import { useState, useEffect } from "preact/hooks";
import { ref, get } from "firebase/database";
import { database } from "../../firebase/firebase";
import { useUser } from "../../context/UserContext";
import Chart from "chart.js/auto";
//Display the total number of quizzes created by the user and the top 10 most popular quizzes
const DashboardContent = () => {
    //Get the current user from the UserContext
    const { user } = useUser();
    //State variables to store the most submitted quizzes and the total number of quizzes created by the user
    const [mostSubmittedQuizzes, setMostSubmittedQuizzes] = useState({});
    const [totalQuizzes, setTotalQuizzes] = useState(0);
    //State variable to store the chart instance
    const [chartInstance, setChartInstance] = useState(null);
    //State variable to store the current theme
    const [isDark, setIsDark] = useState(
        document.documentElement.classList.contains("dark")
    );

    // Fetch data on mount 
    useEffect(() => {
        const fetchMostSubmitted = async () => {
            try {
                const snapshot = await get(
                    ref(database, `users/${user.uid}/mostSubmittedQuizzes`)
                );
                if (snapshot.exists()) {
                    setMostSubmittedQuizzes(snapshot.val());
                } else {
                    setMostSubmittedQuizzes({});
                }
            } catch (err) {
                console.error("Error fetching most submitted quizzes:", err);
                setMostSubmittedQuizzes({});
            }
        };
        //Fetch the total number of quizzes created by the user
        const fetchTotalQuizzes = async () => {
            try {
                const snapshot = await get(ref(database, `users/${user.uid}/quizzesCreated`));
                if (snapshot.exists()) {
                    setTotalQuizzes(snapshot.val());
                } else {
                    setTotalQuizzes(0);
                }
            } catch (err) {
                console.error("Error fetching total quizzes:", err);
                setTotalQuizzes(0);
            }
        };

        fetchMostSubmitted();
        fetchTotalQuizzes();
    }, [user?.uid]);
    //Update the chart with the most submitted quizzes
    useEffect(() => {
        const handleThemeChange = () => {
            setIsDark(document.documentElement.classList.contains("dark"));
        };

        window.addEventListener("theme-changed", handleThemeChange);
        return () => {
            window.removeEventListener("theme-changed", handleThemeChange);
        };
    }, []);
    //Update the chart with the most submitted quizzes
    const updateChart = () => {
        if (!mostSubmittedQuizzes || Object.keys(mostSubmittedQuizzes).length === 0) {
            return;
        }

        const sortedQuizzes = Object.entries(mostSubmittedQuizzes)
            .sort(([, countA], [, countB]) => countB - countA)
            .slice(0, 10);

        const top10Labels = sortedQuizzes.map(([quizName]) => {
            // Truncate long quiz names for mobile display
            return quizName.length > 15 ? quizName.substring(0, 12) + '...' : quizName;
        });
        const top10Data = sortedQuizzes.map(([, count]) => count);

        const ctx = document
            .getElementById("mostSubmittedChart")
            ?.getContext("2d");
        if (!ctx) return;
        //Define the colors for the chart based on the current theme
        const themeColors = {
            light: {
                backgroundColor: "rgba(59, 130, 246, 0.2)",
                borderColor: "rgb(59, 130, 246)",
                textColor: "rgb(31, 41, 55)",
                gridColor: "rgba(156, 163, 175, 0.2)",
                axisLabelColor: "rgb(31, 41, 55)",
            },
            dark: {
                backgroundColor: "rgba(96, 165, 250, 0.2)",
                borderColor: "rgb(96, 165, 250)",
                textColor: "rgb(229, 231, 235)",
                gridColor: "rgba(75, 85, 99, 0.2)",
                axisLabelColor: "rgb(229, 231, 235)",
            },
        };

        const colors = isDark ? themeColors.dark : themeColors.light;
        //Define the chart configuration
        const chartConfig = {
            type: "bar",
            data: {
                labels: top10Labels,
                datasets: [
                    {
                        label: "Submission Amount",
                        data: top10Data,
                        backgroundColor: colors.backgroundColor,
                        borderColor: colors.borderColor,
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        left: 10,
                        right: 10,
                        top: 0,
                        bottom: 0
                    }
                },
                plugins: {
                    legend: {
                        display: window.innerWidth > 768, // Only show legend on larger screens
                        labels: {
                            color: colors.textColor,
                            font: {
                                size: window.innerWidth < 768 ? 10 : 12,
                            },
                        },
                    },
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            title: function(tooltipItems) {
                                // Show full quiz name in tooltip
                                const index = tooltipItems[0].dataIndex;
                                return sortedQuizzes[index][0];
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: window.innerWidth > 768,
                            text: "Quiz Name",
                            color: colors.axisLabelColor,
                            font: {
                                size: 14,
                                weight: "bold",
                            },
                        },
                        ticks: {
                            color: colors.textColor,
                            font: {
                                size: window.innerWidth < 768 ? 8 : 11,
                            },
                            maxRotation: 45,
                            minRotation: 45
                        },
                        grid: {
                            display: false
                        },
                    },
                    y: {
                        title: {
                            display: window.innerWidth > 768,
                            text: "Submissions",
                            color: colors.axisLabelColor,
                            font: {
                                size: 14,
                                weight: "bold",
                            },
                        },
                        ticks: {
                            color: colors.textColor,
                            font: {
                                size: window.innerWidth < 768 ? 8 : 11,
                            },
                        },
                        grid: {
                            color: colors.gridColor,
                            drawBorder: false,
                        },
                    },
                },
            },
        };
        //Destroy the previous chart instance and create a new one
        if (chartInstance) {
            chartInstance.destroy();
        }
        //Create a new chart instance
        const newChart = new Chart(ctx, chartConfig);
        setChartInstance(newChart);
    };
    //Update the chart when the most submitted quizzes or the current theme changes
    useEffect(() => {
        updateChart();

        // Add resize handler
        const handleResize = () => {
            updateChart();
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [mostSubmittedQuizzes, isDark]);

    return (
        <>
            <div className="container mx-auto px-4 py-8 space-y-8">
                <div className="flex justify-center">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center w-full max-w-sm">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                            Total Quizzes Created
                        </h3>
                        <p className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">
                            {totalQuizzes || "0"}
                        </p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 text-center">
                        Most Popular Quizzes
                    </h3>
                    <div className="relative w-full h-64 sm:h-72 md:h-80 lg:h-96">
                        {mostSubmittedQuizzes && Object.keys(mostSubmittedQuizzes).length > 0 ? (
                            <canvas id="mostSubmittedChart"></canvas>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-gray-700 dark:text-gray-300">
                                    No submissions yet.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashboardContent;