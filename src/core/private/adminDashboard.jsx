import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/adminSidebar.jsx";
import { useTheme } from "../../components/ThemeContext";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [userProfile, setUserProfile] = useState(null);
    const [totalUsers, setTotalUsers] = useState(0);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [visitorsOnline, setVisitorsOnline] = useState(0); // Placeholder
    const [totalSongs, setTotalSongs] = useState(0);
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
                    throw new Error(`Failed to fetch profile: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                setUserProfile(data);
            } catch (error) {
                console.error("Error fetching user profile:", error.message);
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
                    throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                console.log("Users data:", data);
                setTotalUsers(Array.isArray(data) ? data.length : 0);
            } catch (error) {
                console.error("Error fetching total users:", error.message);
            } finally {
                setLoadingUsers(false);
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
                    throw new Error(`Failed to fetch songs: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                console.log("Songs data:", data);
                setTotalSongs(data.songs ? data.songs.length : data.length);
            } catch (error) {
                console.error("Error fetching total songs:", error.message);
            }
        };

        if (token) {
            fetchUserProfile();
            fetchTotalUsers();
            fetchTotalSongs();
        } else {
            console.error("No token found, redirecting to login");
            navigate("/login");
        }
    }, [navigate]);

    return (
        <div className={`h-screen bg-gradient-to-br from-purple-100 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex`}>
            <AdminSidebar />
            <main className="flex-1 p-6 flex justify-center items-start mt-6">
                <div className="bg-white bg-opacity-60 backdrop-blur-lg dark:bg-gray-800 dark:bg-opacity-80 rounded-3xl shadow-lg p-8 w-full max-w-7xl h-[85vh]">
                    <header className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">Admin Dashboard</h1>
                        <span className="text-gray-700 dark:text-gray-300">Hello, {userProfile ? userProfile.name : "Admin"}</span>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        {/* Total Users Card */}
                        <div className="relative h-40 rounded-xl overflow-hidden bg-gradient-to-r from-purple-400 to-purple-500 dark:from-indigo-900 dark:to-indigo-700 text-white shadow-lg transform hover:-translate-y-1 hover:scale-105 transition-all duration-300">
                            <div className="absolute inset-0 flex flex-col justify-center items-center p-4 bg-black bg-opacity-50">
                                <h2 className="text-lg font-bold">Total Users</h2>
                                <p className="text-3xl font-bold mt-2">{loadingUsers ? "Loading..." : totalUsers}</p>
                            </div>
                        </div>

                        {/* Visitors Online Card */}
                        <div className="relative h-40 rounded-xl overflow-hidden bg-gradient-to-r from-blue-400 to-blue-500 dark:from-blue-900 dark:to-blue-700 text-white shadow-lg transform hover:-translate-y-1 hover:scale-105 transition-all duration-300">
                            <div className="absolute inset-0 flex flex-col justify-center items-center p-4 bg-black bg-opacity-50">
                                <h2 className="text-lg font-bold">Visitors Online</h2>
                                <p className="text-3xl font-bold mt-2">{visitorsOnline}</p>
                            </div>
                        </div>

                        {/* Total Songs Card */}
                        <div className="relative h-40 rounded-xl overflow-hidden bg-gradient-to-r from-green-400 to-green-500 dark:from-green-900 dark:to-green-700 text-white shadow-lg transform hover:-translate-y-1 hover:scale-105 transition-all duration-300">
                            <div className="absolute inset-0 flex flex-col justify-center items-center p-4 bg-black bg-opacity-50">
                                <h2 className="text-lg font-bold">Total Songs</h2>
                                <p className="text-3xl font-bold mt-2">{totalSongs}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <aside className="w-36 bg-white bg-opacity-10 backdrop-blur-lg dark:bg-gray-900 dark:bg-opacity-50 p-2 flex flex-col items-center">
                {userProfile && userProfile.profilePicture ? (
                    <img
                        src={`http://localhost:3000/${userProfile.profilePicture}`}
                        alt="Profile"
                        className="w-16 h-16 rounded-full border border-gray-300 dark:border-gray-600 cursor-pointer mt-4"
                        onClick={() => navigate("/profile")}
                    />
                ) : (
                    <img
                        src="/assets/images/default-profile.png"
                        alt="Profile"
                        className="w-16 h-16 rounded-full border border-gray-300 dark:border-gray-600 cursor-pointer mt-4"
                        onClick={() => navigate("/profile")}
                    />
                )}
            </aside>
        </div>
    );
};

export default AdminDashboard;