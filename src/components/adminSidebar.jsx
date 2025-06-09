import React, { useState } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { useTheme } from "../components/ThemeContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logoImage from "../assets/images/logo.png";

const AdminSidebar = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleLogoutClick = () => {
        setShowLogoutConfirm(true);
    };

    const handleConfirmLogout = async () => {
        try {
            await fetch("http://localhost:3000/api/auth/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            localStorage.removeItem("token");
            localStorage.removeItem("role");

            toast.success("Logged out successfully!", {
                position: "top-right",
                autoClose: 1500,
            });

            navigate("/login");
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Failed to logout. Please try again.", {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setShowLogoutConfirm(false);
        }
    };

    const handleCancelLogout = () => {
        setShowLogoutConfirm(false);
    };

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className="min-h-screen flex">
            <aside className={`bg-white dark:bg-gray-800 shadow-lg rounded-lg ml-4 mt-6 mb-7 relative transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
                <div className="relative p-4">
                    <div className="flex justify-center mb-2">
                        <button
                            onClick={toggleSidebar}
                            className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400"
                        >
                            <span className="material-icons-outlined">{isCollapsed ? 'menu_open' : 'menu'}</span>
                        </button>
                    </div>
                    <div className="flex justify-center">
                        <NavLink to="/admindash">
                            <img
                                src={logoImage}
                                alt="Anna Logo"
                                className={isCollapsed ? "w-12 h-auto" : "w-24 h-auto"}
                            />
                        </NavLink>
                    </div>
                </div>
                <nav className="mt-4">
                    <ul>
                        <li>
                            <Link
                                to="/admindash"
                                className="flex items-center p-4 text-gray-700 hover:bg-blue-100 dark:text-gray-200 dark:hover:bg-blue-900"
                            >
                                <span className="material-icons-outlined">home</span>
                                {!isCollapsed && <span className="ml-4">Home</span>}
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/addChord"
                                className="flex items-center p-4 text-gray-700 hover:bg-blue-100 dark:text-gray-200 dark:hover:bg-blue-900"
                            >
                                <span className="material-icons-outlined">queue_music</span>
                                {!isCollapsed && <span className="ml-4">Add Chord</span>}
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/addLesson"
                                className="flex items-center p-4 text-gray-700 hover:bg-blue-100 dark:text-gray-200 dark:hover:bg-blue-900"
                            >
                                <span className="material-icons-outlined">library_books</span>
                                {!isCollapsed && <span className="ml-4">Add Lesson</span>}
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/addPracticeSessions"
                                className="flex items-center p-4 text-gray-700 hover:bg-blue-100 dark:text-gray-200 dark:hover:bg-blue-900"
                            >
                                <span className="material-icons-outlined">playlist_add_check</span>
                                {!isCollapsed && <span className="ml-4">Add Practice Session</span>}
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/viewChords"
                                className="flex items-center p-4 text-gray-700 hover:bg-blue-100 dark:text-gray-200 dark:hover:bg-blue-900"
                            >
                                <span className="material-icons-outlined">visibility</span>
                                {!isCollapsed && <span className="ml-4">View Chords</span>}
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/viewLessons"
                                className="flex items-center p-4 text-gray-700 hover:bg-blue-100 dark:text-gray-200 dark:hover:bg-blue-900"
                            >
                                <span className="material-icons-outlined">visibility</span>
                                {!isCollapsed && <span className="ml-4">View Lessons</span>}
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/viewPracticeSessions"
                                className="flex items-center p-4 text-gray-700 hover:bg-blue-100 dark:text-gray-200 dark:hover:bg-blue-900"
                            >
                                <span className="material-icons-outlined">visibility</span>
                                {!isCollapsed && <span className="ml-4">View Practice Sessions</span>}
                            </Link>
                        </li>
                        <li>
                            <button
                                onClick={toggleTheme}
                                className="flex items-center p-4 text-gray-700 hover:bg-blue-100 dark:text-gray-200 dark:hover:bg-blue-900 w-full text-left"
                            >
                                <span className="material-icons-outlined">
                                    {theme === 'light' ? 'dark_mode' : 'light_mode'}
                                </span>
                                {!isCollapsed && <span className="ml-4">
                                    {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                                </span>}
                            </button>
                        </li>
                    </ul>
                </nav>
                <div className={`absolute bottom-12 ${isCollapsed ? 'left-4' : 'left-7'}`}>
                    <button
                        onClick={handleLogoutClick}
                        className="flex items-center text-red-600 hover:text-red-800 font-medium p-3 w-full rounded-md transition duration-200 ease-in-out hover:bg-red-100 dark:text-red-400 dark:hover:text-red-600 dark:hover:bg-red-900"
                    >
                        <span className="material-icons-outlined">logout</span>
                        {!isCollapsed && <span className="ml-3">Logout</span>}
                    </button>
                </div>
            </aside>

            {showLogoutConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">
                            Are you sure you want to logout?
                        </h3>
                        <div className="flex justify-center space-x-4">
                            <button
                                className="py-2 px-4 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
                                onClick={handleCancelLogout}
                            >
                                Cancel
                            </button>
                            <button
                                className="py-2 px-4 bg-gradient-to-r from-[#99CCFF] via-[#C6B7FE] to-[#766E98] text-white rounded hover:opacity-90"
                                onClick={handleConfirmLogout}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSidebar;