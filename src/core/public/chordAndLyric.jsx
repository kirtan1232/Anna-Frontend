import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar.jsx";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useTheme } from "../../components/ThemeContext";
import Footer from "../../components/footer.jsx";

export default function ChordAndLyric() {
    const { theme } = useTheme();
    const [songs, setSongs] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("Ukulele");
    const [userProfile, setUserProfile] = useState(null);
    const [likedSongs, setLikedSongs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/songs/getsongs?instrument=${selectedCategory.toLowerCase()}`);
                setSongs(response.data.songs);
            } catch (error) {
                alert("Error fetching songs: " + error.message);
            }
        };

        fetchSongs();
    }, [selectedCategory]);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/auth/profile", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch profile");
                }

                const data = await response.json();
                setUserProfile(data);
            } catch (error) {
                alert("Error fetching user profile: " + error.message);
            }
        };

        const fetchLikedSongs = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/favorites/getfav", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        // No liked songs, which is fine for new users
                        console.log("No liked songs found for this user.");
                        setLikedSongs([]);
                        return;
                    }
                    throw new Error("Failed to fetch liked songs");
                }

                const data = await response.json();
                setLikedSongs(data.songIds.map(song => song._id.toString()));
            } catch (error) {
                alert("Error fetching liked songs: " + error.message);
            }
        };

        fetchUserProfile();
        fetchLikedSongs();
    }, []);

    const handleLikeSong = async (songId, e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const response = await fetch(`http://localhost:3000/api/favorites/songs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ songId }),
            });

            if (!response.ok) {
                throw new Error("Failed to toggle favorite");
            }

            const data = await response.json();
            const updatedSongIds = data.favorite.songIds.map(id => id.toString());
            setLikedSongs(updatedSongIds);
        } catch (error) {
            alert("Error toggling favorite: " + error.message);
        }
    };

    return (
        <div className={`bg-gradient-to-br min-h-screen flex flex-col ${theme === 'light' ? 'from-purple-100 to-blue-100' : 'from-gray-900 to-gray-800'}`}>
            <div className="relative flex flex-1">
                <Sidebar />
                <main className="flex-1 p-6 flex justify-center items-start mt-4">
                    <div className="bg-white bg-opacity-60 backdrop-blur-lg dark:bg-gray-800 dark:bg-opacity-80 rounded-3xl shadow-lg p-8 w-full max-w-7xl h-[85vh] overflow-y-auto">
                        <header className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Available {selectedCategory} Chords</h2>
                        </header>
                        <div className="flex justify-start space-x-8 mb-6">
                            {["Ukulele", "Guitar", "Piano"].map((category) => (
                                <span
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`${
                                        selectedCategory === category
                                            ? "text-blue-500 underline font-semibold"
                                            : "text-gray-700 dark:text-gray-300 cursor-pointer"
                                    } hover:text-blue-600 dark:hover:text-blue-400`}
                                >
                                    {category}
                                </span>
                            ))}
                        </div>
                        <div className="space-y-4">
                            {songs.length === 0 ? (
                                <p className="text-center text-gray-500 dark:text-gray-400">No lessons available in this category.</p>
                            ) : (
                                songs.map((song) => (
                                    <Link
                                        to={`/song/${song._id}`}
                                        key={song._id}
                                        className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md hover:bg-gray-200 dark:hover:bg-gray-600 flex justify-between items-center"
                                    >
                                        <span className="text-xl font-semibold text-gray-800 dark:text-gray-200 cursor-pointer">
                                            {song.songName}
                                        </span>
                                        <button
                                            onClick={(e) => handleLikeSong(song._id.toString(), e)}
                                            className="text-red-500 dark:text-red-400 ml-4"
                                        >
                                            {likedSongs.includes(song._id.toString()) ? <FaHeart /> : <FaRegHeart />}
                                        </button>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                </main>
                <div className="absolute top-4 right-4 bg-white bg-opacity-60 backdrop-blur-lg dark:bg-gray-800 dark:bg-opacity-80 rounded-full p-2">
                    {userProfile && userProfile.profilePicture ? (
                        <img
                            src={`http://localhost:3000/${userProfile.profilePicture}`}
                            alt="Profile"
                            className="w-16 h-16 rounded-full border border-gray-300 dark:border-gray-600 cursor-pointer"
                            onClick={() => navigate("/profile")}
                        />
                    ) : (
                        <img
                            src="src/assets/images/profile.png"
                            alt="Profile"
                            className="w-16 h-16 rounded-full border border-gray-300 dark:border-gray-600 cursor-pointer"
                            onClick={() => navigate("/profile")}
                        />
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}