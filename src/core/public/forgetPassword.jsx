import { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bgImage from "../../assets/images/bg.jpg";
import logoImage from "../../assets/images/logo.png";

const ForgetPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!email) {
            toast.error("Please enter your email.", {
                position: "top-right",
                autoClose: 3000,
            });
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/api/auth/forgotPassword', { email });
            toast.success(response.data.msg, {
                position: "top-right",
                autoClose: 1500,
            });
        } catch (error) {
            console.error('Error:', error);
            const errorMsg = error.response?.data?.message || "Something went wrong. Please try again.";
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
                    Reset Your Password
                </h2>
                <form onSubmit={handleForgotPassword} className="w-full space-y-5">
                    <div className="relative">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 py-2 w-full border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
                            required
                        />
                        <FontAwesomeIcon
                            icon={faEnvelope}
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

export default ForgetPassword;