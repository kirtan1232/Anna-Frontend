import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/adminSidebar.jsx";
import { useTheme } from "../../components/ThemeContext";
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faBook, faMusic, faDonate } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from 'react-i18next';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [userProfile, setUserProfile] = useState(null);
    const [totalUsers, setTotalUsers] = useState(0);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [totalLessons, setTotalLessons] = useState(0);
    const [loadingLessons, setLoadingLessons] = useState(true);
    const [totalSongs, setTotalSongs] = useState(0);
    const [loadingSongs, setLoadingSongs] = useState(true);
    const [totalDonations, setTotalDonations] = useState(0);
    const [loadingDonations, setLoadingDonations] = useState(true);
    const [usersData, setUsersData] = useState([]);
    const [lessonsData, setLessonsData] = useState([]);
    const [songsData, setSongsData] = useState([]);
    const [supportData, setSupportData] = useState([]);
    const [error, setError] = useState(null);
    const { theme } = useTheme();

    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log("Token:", token ? "Present" : "Missing");

        const fetchUserProfile = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/auth/profile", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`${t('Error')}: Failed to fetch profile`);
                }

                const data = await response.json();
                console.log("User profile data:", data);
                setUserProfile(data);
            } catch (error) {
                console.error("Error fetching user profile:", error.message);
                setError(error.message);
            }
        };

        const fetchTotalUsers = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/auth/users", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`${t('Error')}: Failed to fetch users`);
                }

                const data = await response.json();
                console.log("Users data:", data);
                setUsersData(Array.isArray(data) ? data : []);
                setTotalUsers(Array.isArray(data) ? data.length : 0);
            } catch (error) {
                console.error("Error fetching total users:", error.message);
                setError(error.message);
            } finally {
                setLoadingUsers(false);
            }
        };

        const fetchTotalLessons = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/quiz/getAllQuizzes", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`${t('Error')}: Failed to fetch lessons`);
                }

                const data = await response.json();
                console.log("Lessons data:", data);
                setLessonsData(Array.isArray(data) ? data : []);
                setTotalLessons(Array.isArray(data) ? data.length : 0);
            } catch (error) {
                console.error("Error fetching total lessons:", error.message);
                setError(error.message);
            } finally {
                setLoadingLessons(false);
            }
        };

        const fetchTotalSongs = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/songs/getsongs", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`${t('Error')}: Failed to fetch songs`);
                }

                const data = await response.json();
                console.log("Songs data:", data);
                const songsArray = data.songs ? data.songs : Array.isArray(data) ? data : [];
                setSongsData(songsArray);
                setTotalSongs(songsArray.length);
            } catch (error) {
                console.error("Error fetching total songs:", error.message);
                setError(error.message);
            } finally {
                setLoadingSongs(false);
            }
        };

        const fetchTotalDonations = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/support", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`${t('Error')}: Failed to fetch support records`);
                }

                const data = await response.json();
                console.log("Support data:", data);
                const supportRecords = Array.isArray(data.supportRecords) ? data.supportRecords : [];
                setSupportData(supportRecords);
                const total = supportRecords.reduce((sum, record) => sum + (record.amount || 0), 0);
                setTotalDonations(total);
            } catch (error) {
                console.error("Error fetching total donations:", error.message);
                setError(error.message);
            } finally {
                setLoadingDonations(false);
            }
        };

        if (token) {
            fetchUserProfile();
            fetchTotalUsers();
            fetchTotalLessons();
            fetchTotalSongs();
            fetchTotalDonations();
        } else {
            console.error("No token found, redirecting to login");
            setError(`${t('Error')}: ${t('No token found, please log in again')}`);
            navigate("/login");
        }
    }, [navigate, t]);

    const processLineChartData = () => {
        const isValidDate = (dateStr) => {
            if (!dateStr) return false;
            const date = new Date(dateStr);
            return !isNaN(date.getTime());
        };

        const allDates = [
            ...usersData
                .filter(item => isValidDate(item.createdAt))
                .map(item => new Date(item.createdAt).toISOString().split('T')[0]),
            ...lessonsData
                .filter(item => isValidDate(item.createdAt))
                .map(item => new Date(item.createdAt).toISOString().split('T')[0]),
            ...songsData
                .filter(item => isValidDate(item.createdAt))
                .map(item => new Date(item.createdAt).toISOString().split('T')[0]),
        ].sort();

        const uniqueDates = [...new Set(allDates)];

        const usersCounts = uniqueDates.map(date => {
            return usersData.filter(item => {
                if (!isValidDate(item.createdAt)) return false;
                const itemDate = new Date(item.createdAt).toISOString().split('T')[0];
                return itemDate <= date;
            }).length;
        });

        const lessonsCounts = uniqueDates.map(date => {
            return lessonsData.filter(item => {
                if (!isValidDate(item.createdAt)) return false;
                const itemDate = new Date(item.createdAt).toISOString().split('T')[0];
                return itemDate <= date;
            }).length;
        });

        const songsCounts = uniqueDates.map(date => {
            return songsData.filter(item => {
                if (!isValidDate(item.createdAt)) return false;
                const itemDate = new Date(item.createdAt).toISOString().split('T')[0];
                return itemDate <= date;
            }).length;
        });

        return {
            labels: uniqueDates,
            datasets: [
                {
                    label: t('Total Users'),
                    data: usersCounts,
                    borderColor: theme === 'dark' ? 'rgba(99, 102, 241, 1)' : 'rgba(167, 139, 250, 1)',
                    backgroundColor: theme === 'dark' ? 'rgba(99, 102, 241, 0.4)' : 'rgba(167, 139, 250, 0.4)',
                    fill: true,
                    tension: 0.4,
                },
                {
                    label: t('Total Lessons'),
                    data: lessonsCounts,
                    borderColor: theme === 'dark' ? 'rgba(234, 88, 12, 1)' : 'rgba(251, 146, 60, 1)',
                    backgroundColor: theme === 'dark' ? 'rgba(234, 88, 12, 0.4)' : 'rgba(251, 146, 60, 0.4)',
                    fill: true,
                    tension: 0.4,
                },
                {
                    label: t('Total Songs'),
                    data: songsCounts,
                    borderColor: theme === 'dark' ? 'rgba(6, 95, 70, 1)' : 'rgba(16, 185, 129, 1)',
                    backgroundColor: theme === 'dark' ? 'rgba(6, 95, 70, 0.4)' : 'rgba(16, 185, 129, 0.4)',
                    fill: true,
                    tension: 0.4,
                },
            ],
        };
    };

    const doughnutChartData = {
        labels: [t('Total Users'), t('Total Lessons'), t('Total Songs')],
        datasets: [
            {
                label: t('Metrics'),
                data: [totalUsers, totalLessons, totalSongs],
                backgroundColor: theme === 'dark' ? 
                    ['rgba(99, 102, 241, 0.7)', 'rgba(234, 88, 12, 0.7)', 'rgba(6, 95, 70, 0.7)'] :
                    ['rgba(167, 139, 250, 0.7)', 'rgba(251, 146, 60, 0.7)', 'rgba(16, 185, 129, 0.7)'],
                borderColor: theme === 'dark' ?
                    ['rgba(99, 102, 241, 1)', 'rgba(234, 88, 12, 1)', 'rgba(6, 95, 70, 1)'] :
                    ['rgba(167, 139, 250, 1)', 'rgba(251, 146, 60, 1)', 'rgba(16, 185, 129, 1)'],
                borderWidth: 1,
            },
        ],
    };

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    color: theme === 'dark' ? '#e5e7eb' : '#374151',
                },
            },
            title: {
                display: true,
                text: t('Cumulative Metrics Over Time'),
                color: theme === 'dark' ? '#e5e7eb' : '#374151',
                font: { size: 16 },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: theme === 'dark' ? '#e5e7eb' : '#374151',
                },
                grid: {
                    color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                },
            },
            x: {
                ticks: {
                    color: theme === 'dark' ? '#e5e7eb' : '#374151',
                    maxRotation: 45,
                    minRotation: 45,
                },
                grid: {
                    display: false,
                },
            },
        },
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
            legend: {
                display: true,
                position: 'right',
                labels: {
                    color: theme === 'dark' ? '#e5e7eb' : '#374151',
                },
            },
            title: {
                display: true,
                text: t('Dashboard Metrics (Donut)'),
                color: theme === 'dark' ? '#e5e7eb' : '#374151',
                font: { size: 16 },
            },
        },
    };

    return (
        <div className={`min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex flex-col md:flex-row overflow-hidden ${i18n.language === 'ne' ? 'font-noto-sans' : ''}`}>
            <AdminSidebar />
            <main className="flex-1 p-4 md:p-6 flex justify-center items-start mt-4 md:mt-6">
                <div className="bg-white bg-opacity-60 backdrop-blur-lg dark:bg-gray-800 dark:bg-opacity-80 rounded-3xl shadow-lg p-4 md:p-8 w-full max-w-[95vw] md:max-w-[90vw] max-h-[90vh] overflow-y-auto">
                    <header className="flex flex-col md:flex-row justify-between items-center mb-4 md:mb-6">
                        <h1 className="text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-200">{t('Admin Dashboard')}</h1>
                        <span className="text-gray-700 dark:text-gray-300 text-sm md:text-base mt-2 md:mt-0">{t('Hello')}, {userProfile ? userProfile.name : t('Admin')}</span>
                    </header>

                    {error && (
                        <div className="mb-4 md:mb-6 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
                            {t('Error')}: {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-6 md:mt-8">
                        <div className="relative h-40 rounded-xl overflow-hidden bg-gradient-to-r from-purple-300 to-purple-400 dark:from-indigo-900 dark:to-indigo-700 text-white shadow-lg transform hover:-translate-y-1 hover:scale-105 transition-all duration-300">
                            <div className="absolute inset-0 flex flex-col justify-center items-center p-4 bg-black bg-opacity-50">
                                <FontAwesomeIcon icon={faUsers} className="text-3xl mb-2" />
                                <h2 className="text-base md:text-lg font-bold">{t('Total Users')}</h2>
                                <p className="text-2xl md:text-3xl font-bold mt-2">{loadingUsers ? t('Loading') : totalUsers}</p>
                            </div>
                        </div>

                        <div className="relative h-40 rounded-xl overflow-hidden bg-gradient-to-r from-orange-300 to-orange-400 dark:from-orange-900 dark:to-orange-700 text-white shadow-lg transform hover:-translate-y-1 hover:scale-105 transition-all duration-300">
                            <div className="absolute inset-0 flex flex-col justify-center items-center p-4 bg-black bg-opacity-50">
                                <FontAwesomeIcon icon={faBook} className="text-3xl mb-2" />
                                <h2 className="text-base md:text-lg font-bold">{t('Total Lessons')}</h2>
                                <p className="text-2xl md:text-3xl font-bold mt-2">{loadingLessons ? t('Loading') : totalLessons}</p>
                            </div>
                        </div>

                        <div className="relative h-40 rounded-xl overflow-hidden bg-gradient-to-r from-green-300 to-green-400 dark:from-green-900 dark:to-green-700 text-white shadow-lg transform hover:-translate-y-1 hover:scale-105 transition-all duration-300">
                            <div className="absolute inset-0 flex flex-col justify-center items-center p-4 bg-black bg-opacity-50">
                                <FontAwesomeIcon icon={faMusic} className="text-3xl mb-2" />
                                <h2 className="text-base md:text-lg font-bold">{t('Total Songs')}</h2>
                                <p className="text-2xl md:text-3xl font-bold mt-2">{loadingSongs ? t('Loading') : totalSongs}</p>
                            </div>
                        </div>

                        <div className="relative h-40 rounded-xl overflow-hidden bg-gradient-to-r from-pink-300 to-pink-400 dark:from-pink-900 dark:to-pink-700 text-white shadow-lg transform hover:-translate-y-1 hover:scale-105 transition-all duration-300">
                            <div className="absolute inset-0 flex flex-col justify-center items-center p-4 bg-black bg-opacity-50">
                                <FontAwesomeIcon icon={faDonate} className="text-3xl mb-2" />
                                <h2 className="text-base md:text-lg font-bold">{t('Total Donations')}</h2>
                                <p className="text-2xl md:text-3xl font-bold mt-2">{loadingDonations ? t('Loading') : `${t('Rs')} ${totalDonations}`}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="bg-white bg-opacity-60 backdrop-blur-lg dark:bg-gray-800 dark:bg-opacity-80 rounded-3xl shadow-lg p-4 h-80 md:h-96">
                            {usersData.length > 0 || lessonsData.length > 0 || songsData.length > 0 ? (
                                <Line data={processLineChartData()} options={lineOptions} />
                            ) : (
                                <p className="text-center text-gray-700 dark:text-gray-300">{t('No data available for line chart')}</p>
                            )}
                        </div>
                        <div className="bg-white bg-opacity-60 backdrop-blur-lg dark:bg-gray-800 dark:bg-opacity-80 rounded-3xl shadow-lg p-4 h-80 md:h-96">
                            <Doughnut data={doughnutChartData} options={doughnutOptions} />
                        </div>
                    </div>

                    <div className="mt-6 md:mt-8 bg-white bg-opacity-60 backdrop-blur-lg dark:bg-gray-800 dark:bg-opacity-80 rounded-3xl shadow-lg p-4 h-80 md:h-96">
                        <Calendar />
                    </div>
                </div>
            </main>

            <aside className="w-full md:w-36 bg-white bg-opacity-10 backdrop-blur-lg dark:bg-gray-900 dark:bg-opacity-50 p-2 flex flex-row md:flex-col items-center justify-between md:justify-start">
                {userProfile && userProfile.profilePicture ? (
                    <img
                        src={`http://localhost:3000/${userProfile.profilePicture}`}
                        alt="Profile"
                        className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-gray-300 dark:border-gray-600 cursor-pointer mt-0 md:mt-4"
                        onClick={() => navigate("/profile")}
                    />
                ) : (
                    <img
                        src="/assets/images/default-profile.png"
                        alt="Profile"
                        className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-gray-300 dark:border-gray-600 cursor-pointer mt-0 md:mt-4"
                        onClick={() => navigate("/profile")}
                    />
                )}
            </aside>
        </div>
    );
};

export default AdminDashboard;