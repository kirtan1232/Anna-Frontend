import { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logoImage from "../../assets/images/logo.png";

const ForgetPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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
            navigate("/login"); // Navigate to login after success
        } catch (error) {
            console.error('Error:', error);
            const errorMsg = error.response?.data?.msg;
            if (errorMsg === "This email does not exist.") {
                toast.error("This email does not exist in our system.", {
                    position: "top-right",
                    autoClose: 3000,
                });
            } else {
                toast.error(errorMsg || "Something went wrong. Please try again.", {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSignInClick = () => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/dashboard");
        } else {
            navigate("/login");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 dark:from-gray-900 dark:to-gray-800">
            <div className="relative bg-white bg-opacity-90 rounded-3xl shadow-md flex w-full max-w-5xl h-[490px] overflow-hidden z-20">
                {/* Left Section - Sign In Prompt */}
                <div
                    className="w-[40%] bg-gradient-to-r from-[#99CCFF] via-[#C6B7FE] to-[#766E98] text-white rounded-l-3xl flex flex-col items-center justify-center p-6"
                >
                    <img
                        src={logoImage}
                        alt="Anna Logo"
                        className="w-32 h-auto mb-6"
                    />
                    <button
                        className="px-6 py-2 border-2 border-white rounded-full text-white text-base font-semibold hover:bg-white hover:text-blue-500 transition-all duration-200 shadow-sm"
                        onClick={handleSignInClick}
                    >
                        SIGN IN
                    </button>
                </div>

                {/* Right Section - Forgot Password Form */}
                <div className="w-[62%] p-8 flex flex-col justify-center items-center">
                    <h2 className="text-[1.8rem] font-bold text-blue-600 mb-12 text-center">Reset Your Password</h2>
                    <form className="space-y-5 w-full flex flex-col items-center" onSubmit={handleForgotPassword}>
                        <div className="relative w-[65%]">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10 py-2 border border-gray-300 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                                required
                            />
                            <FontAwesomeIcon
                                icon={faEnvelope}
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            />
                        </div>
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-gradient-to-r from-[#99CCFF] via-[#C6B7FE] to-[#766E98] text-white py-2 px-8 w-[180px] rounded-full font-semibold hover:shadow-md transition-all duration-200"
                            >
                                {loading ? 'Processing...' : 'Reset Password'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgetPassword;