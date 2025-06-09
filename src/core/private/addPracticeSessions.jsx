import React, { useState } from "react";
import AdminSidebar from "../../components/adminSidebar.jsx";
import axios from "axios";
import { useTheme } from "../../components/ThemeContext";

export default function AddPracticeSession() {
    const { theme } = useTheme(); // Get theme from context
    const [session, setSession] = useState({
        instrument: "Guitar",
        day: "Day 1",
        title: "",
        description: "",
        duration: "",
        instructions: "",
        mediaUrl: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [savedFile, setSavedFile] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSession({ ...session, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!session.title || !session.description || !session.duration || !session.instructions) {
            setError("Please fill in all required fields.");
            return;
        }
        if (session.duration <= 0) {
            setError("Duration must be greater than 0.");
            return;
        }

        setLoading(true);
        setError("");

        const formData = {
            instrument: session.instrument,
            day: session.day,
            title: session.title,
            description: session.description,
            duration: session.duration,
            instructions: session.instructions,
            mediaUrl: session.mediaUrl,
        };

        console.log("Form data being sent:", formData);

        try {
            const response = await axios.post("http://localhost:3000/api/sessions/", formData);
            console.log("Response from server:", response.data);

            if (response.status === 201) {
                setSuccess(`Practice session for ${session.instrument} - ${session.day} added successfully!`);
                setSavedFile(response.data.session.file);

                setSession({
                    instrument: "Guitar",
                    day: "Day 1",
                    title: "",
                    description: "",
                    duration: "",
                    instructions: "",
                    mediaUrl: "",
                });
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
            console.error("Error during submission:", err);
        } finally {
            setLoading(false);
        }
    };

    const getYouTubeEmbedUrl = (url) => {
        if (!url) return "";
        if (url.includes("youtu.be")) {
            return `https://www.youtube.com/embed/${url.split("youtu.be/")[1].split("?")[0]}`;
        }
        return url.replace("watch?v=", "embed/");
    };

    return (
        <div className="h-screen bg-gradient-to-br from-purple-100 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex">
            <AdminSidebar />
            <div className="flex justify-center items-center w-full">
                <div className="p-6 bg-white dark:bg-gray-800 dark:bg-opacity-80 rounded-lg shadow-md w-[65%] ml-[-5%] h-[90vh] flex flex-col">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Add a New Practice Session</h2>
                    <div className="overflow-y-auto flex-grow p-2">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block font-medium text-gray-700 dark:text-gray-300">Select Instrument</label>
                                <select
                                    name="instrument"
                                    value={session.instrument}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                                >
                                    <option value="Guitar">Guitar</option>
                                    <option value="Piano">Piano</option>
                                    <option value="Ukulele">Ukulele</option>
                                </select>
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 dark:text-gray-300">Select Practice Day</label>
                                <select
                                    name="day"
                                    value={session.day}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                                >
                                    <option value="Day 1">Day 1</option>
                                    <option value="Day 2">Day 2</option>
                                    <option value="Day 3">Day 3</option>
                                    <option value="Day 4">Day 4</option>
                                    <option value="Day 5">Day 5</option>
                                    <option value="Day 6">Day 6</option>
                                    <option value="Day 7">Day 7</option>
                                </select>
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 dark:text-gray-300">Session Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={session.title}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 dark:text-gray-300">Description</label>
                                <textarea
                                    name="description"
                                    value={session.description}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                                    rows="3"
                                    required
                                ></textarea>
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 dark:text-gray-300">Duration (in minutes)</label>
                                <input
                                    type="number"
                                    name="duration"
                                    value={session.duration}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                                    min="1"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 dark:text-gray-300">Instructions</label>
                                <textarea
                                    name="instructions"
                                    value={session.instructions}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                                    rows="5"
                                    placeholder="Write detailed instructions for the session..."
                                    required
                                ></textarea>
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 dark:text-gray-300">Enter YouTube URL</label>
                                <input
                                    type="url"
                                    name="mediaUrl"
                                    value={session.mediaUrl}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                                    placeholder="Paste YouTube URL here"
                                />
                            </div>
                            {error && <p className="text-red-500 dark:text-red-400">{error}</p>}
                            {success && (
                                <div className="text-green-500 dark:text-green-400">
                                    <p>{success}</p>
                                    {savedFile && (
                                        <div>
                                            <h3 className="text-gray-800 dark:text-gray-200">Video Preview:</h3>
                                            <iframe
                                                src={getYouTubeEmbedUrl(savedFile)}
                                                frameBorder="0"
                                                width="500"
                                                height="300"
                                                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                title="Video Preview"
                                            ></iframe>
                                        </div>
                                    )}
                                </div>
                            )}
                            <button
                                type="submit"
                                className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 w-full"
                                disabled={loading}
                            >
                                {loading ? "Submitting..." : "Add Practice Session"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}