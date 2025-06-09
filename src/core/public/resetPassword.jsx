import { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bgImage from "../../assets/images/bg.jpg";
import logoImage from "../../assets/images/logo.png";

const ResetPasswordPage = () => {
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Get token from URL
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        } else {
            toast.error("Invalid or missing token.", {
                position: "top-right",
                autoClose: 3000,
            });
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newPassword || !confirmPassword) {
            toast.error("Please fill in both password fields.", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match.", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        if (loading) return;

        setLoading(true);

        try {
            const response = await axios.post('http://localhost:3000/api/auth/reset-password', {
                token,
                newPassword,
            });
            toast.success(response.data.msg, {
                position: "top-right",
                autoClose: 1500,
            });
        } catch (error) {
            const errorMsg = error.response?.data?.msg || "Something went wrong. Please try again.";
            toast.error(errorMsg, {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImage})` }}
        >
            <div className="w-full max-w-md p-8 bg-white bg-opacity-90 rounded-3xl shadow-lg flex flex-col items-center">
                <img
                    src={logoImage}
                    alt="Anna Logo"
                    className="w-24 h-auto mb-6"
                />
                <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center tracking-wide">
                    Create New Password
                </h2>
                <form onSubmit={handleSubmit} className="w-full space-y-5">
                    <div className="relative">
                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="pl-10 py-2 w-full border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
                            required
                        />
                        <FontAwesomeIcon
                            icon={faLock}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                    </div>
                    <div className="relative">
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="pl-10 py-2 w-full border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
                            required
                        />
                        <FontAwesomeIcon
                            icon={faLock}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 px-4 bg-gradient-to-r from-[#99CCFF] via-[#C6B7FE] to-[#766E98] text-white font-semibold rounded-full hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {loading ? 'Processing...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;