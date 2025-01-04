import { h, Fragment } from "preact";
import { useState, useEffect } from "preact/hooks";
import { ref, get } from "firebase/database";
import { database } from "../firebase/firebase";
import { useUser } from "../context/UserContext";
import Chart from "chart.js/auto";

const DashboardContent = () => {
    const { user } = useUser();
    const [mostSubmittedQuizzes, setMostSubmittedQuizzes] = useState({});
    const [totalQuizzes, setTotalQuizzes] = useState(0);

    // Track Chart.js instance so we can destroy & re-init
    const [chartInstance, setChartInstance] = useState(null);

    // Track current dark mode so we can rebuild the chart with correct colors
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

    // Listen for "theme-changed" event from LightSwitch
    useEffect(() => {
        const handleThemeChange = () => {
            setIsDark(document.documentElement.classList.contains("dark"));
        };

        window.addEventListener("theme-changed", handleThemeChange);
        return () => {
            window.removeEventListener("theme-changed", handleThemeChange);
        };
    }, []);

    /**
     * Creates or re-creates the Chart.js instance with current theme colors.
     */
    const updateChart = () => {
        if (!mostSubmittedQuizzes || Object.keys(mostSubmittedQuizzes).length === 0) {
            // No submissions, do not render chart
            return;
        }

        // Process the data to get the top 10
        const sortedQuizzes = Object.entries(mostSubmittedQuizzes)
            .sort(([, countA], [, countB]) => countB - countA)
            .slice(0, 10);

        const top10Labels = sortedQuizzes.map(([quizName]) => quizName);
        const top10Data = sortedQuizzes.map(([, count]) => count);

        const ctx = document
            .getElementById("mostSubmittedChart")
            ?.getContext("2d");
        if (!ctx) return;

        // Theme-aware colors
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

        // Pick the color set based on dark/light
        const colors = isDark ? themeColors.dark : themeColors.light;

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
                plugins: {
                    legend: {
                        labels: {
                            color: colors.textColor,
                            font: {
                                size: 12,
                            },
                        },
                    },
                    title: {
                        display: true,
                        text: "",
                        color: colors.textColor,
                        font: {
                            size: 16,
                            weight: "bold",
                        },
                    },
                },
                scales: {
                    x: {
                        title: {
                            display: true,
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
                                size: 11,
                            },
                        },
                        grid: {
                            color: colors.gridColor,
                            drawBorder: false,
                        },
                    },
                    y: {
                        title: {
                            display: true,
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
                                size: 11,
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

        // Destroy any existing chart to avoid duplicates
        if (chartInstance) {
            chartInstance.destroy();
        }

        // Create a new chart with the updated config
        const newChart = new Chart(ctx, chartConfig);
        setChartInstance(newChart);
    };

    // Rebuild chart whenever data changes OR dark mode changes
    useEffect(() => {
        updateChart();
    }, [mostSubmittedQuizzes, isDark]);

    return (
        <Fragment>
            <div className="container mx-auto px-4 py-8 space-y-8">
                <div className="flex justify-center">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center max-w-sm">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                            Total Quizzes Created
                        </h3>
                        <p className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">
                            {totalQuizzes || "0"}
                        </p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 text-center">
                        Most Popular Quizzes
                    </h3>
                    <div className="relative w-full h-64">
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
        </Fragment>
    );
};

export default DashboardContent;
