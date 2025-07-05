import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar.jsx";
import { useTheme } from "../../components/ThemeContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Profile() {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [user, setUser] = useState({ name: "", email: "", profilePicture: "" });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.warn("No token found, redirecting to login.");
                    navigate("/login");
                    return;
                }

                const response = await fetch("http://localhost:3000/api/auth/profile", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Error fetching profile:", errorData);
                    throw new Error(errorData.message || "Failed to fetch profile");
                }

                const data = await response.json();
                setUser((prevUser) => ({
                    ...prevUser,
                    name: data.name || "",
                    email: data.email || "",
                    profilePicture: data.profilePicture ? `http://localhost:3000/${data.profilePicture}` : "",
                }));
                if (data.profilePicture) {
                    setImagePreview(`http://localhost:3000/${data.profilePicture}`);
                }
            } catch (error) {
                setError("Error fetching profile");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    useEffect(() => {
        if (image) {
            const objectUrl = URL.createObjectURL(image);
            setImagePreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [image]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError("");

        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        if (newPassword && newPassword !== confirmPassword) {
            setError("New passwords do not match!");
            return;
        }

        const formData = new FormData();
        formData.append("name", user.name);
        formData.append("email", user.email);
        if (newPassword) formData.append("newPassword", newPassword);
        if (image) formData.append("profilePicture", image);

        try {
            const response = await fetch("http://localhost:3000/api/auth/update-profile", {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update profile");
            }

            const data = await response.json();
            toast.success("Profile updated successfully!", {
                position: "top-right",
                autoClose: 500,
                onClose: () => navigate("/dashboard")
            });
            setUser((prevUser) => ({
                ...prevUser,
                name: data.name || "",
                email: data.email || "",
                profilePicture: data.profilePicture ? `http://localhost:3000/${data.profilePicture}` : "",
            }));
            setNewPassword("");
            setConfirmPassword("");
            setImage(null);
            setImagePreview(data.profilePicture ? `http://localhost:3000/${data.profilePicture}` : null);
        } catch (err) {
            setError(err.message || "Error updating profile");
        }
    };

    return (
        <div className={`min-h-screen flex ${theme === 'light' ? 'bg-gradient-to-br from-purple-100 to-blue-100' : 'bg-gradient-to-br from-gray-900 to-gray-800'}`}>
            <Sidebar />
            <main className="flex-1 p-6 flex flex-col items-center">
                <div className="bg-white bg-opacity-60 backdrop-blur-lg dark:bg-gray-800 dark:bg-opacity-80 rounded-3xl shadow-lg p-8 w-full max-w-3xl mt-6 h-auto">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 text-center mb-8">Profile</h2>

                    {loading ? (
                        <p className="mt-4 text-gray-600 dark:text-gray-400 text-center">Loading...</p>
                    ) : error ? (
                        <p className="mt-4 text-red-500 dark:text-red-400 text-center">{error}</p>
                    ) : (
                        <>
                            <div className="relative flex justify-center mb-8">
                                <div
                                    onClick={() => document.getElementById("fileInput").click()}
                                    className="w-32 h-32 rounded-full border-4 border-blue-500 dark:border-blue-600 cursor-pointer overflow-hidden"
                                >
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <img
                                            src="src/assets/images/profile.png"
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                                <input id="fileInput" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                            </div>

                            <form onSubmit={handleUpdate} className="w-full flex flex-col gap-6">
                                <div className="space-y-2">
                                    <label className="block text-gray-700 dark:text-gray-300 font-semibold">Name</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 rounded-lg bg-gray-200 dark:bg-gray-700 bg-opacity-70 dark:text-gray-200 text-left"
                                        value={user.name}
                                        onChange={(e) => setUser((prevUser) => ({ ...prevUser, name: e.target.value }))}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-gray-700 dark:text-gray-300 font-semibold">Email</label>
                                    <input
                                        type="email"
                                        className="w-full p-3 rounded-lg bg-gray-200 dark:bg-gray-700 bg-opacity-70 dark:text-gray-200 text-left"
                                        value={user.email}
                                        onChange={(e) => setUser((prevUser) => ({ ...prevUser, email: e.target.value }))}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-gray-700 dark:text-gray-300 font-semibold">New Password</label>
                                    <input
                                        type="password"
                                        className="w-full p-3 rounded-lg bg-gray-200 dark:bg-gray-700 bg-opacity-70 dark:text-gray-200 text-left"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-gray-700 dark:text-gray-300 font-semibold">Confirm New Password</label>
                                    <input
                                        type="password"
                                        className="w-full p-3 rounded-lg bg-gray-200 dark:bg-gray-700 bg-opacity-70 dark:text-gray-200 text-left"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>

                                <div className="flex justify-center mt-6">
                                    <button 
                                        type="submit" 
                                        className="w-48 py-3 px-6 rounded-lg text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 shadow-md transition-all duration-300 font-semibold"
                                    >
                                        Update Profile
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
