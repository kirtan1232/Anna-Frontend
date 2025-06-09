import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logoImage from "../../assets/images/logo.png";
import bgVideo from "../../assets/videos/music.mp4";

const RegisterPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Check if the user is already authenticated on component mount
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            // If a token exists, redirect to dashboard
            navigate("/dashboard");
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!name || !email || !password || !confirmPassword) {
            toast.error("All fields are required!", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        // Password and confirm password validation
        if (password !== confirmPassword) {
            toast.error("Passwords do not match!", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        setLoading(true); // Set loading state

        try {
            // Send POST request to the backend
            const response = await axios.post("http://localhost:3000/api/auth/register", {
                name,
                email,
                password,
                role: "user", // Default role is 'user'
            });

            // If successful, display success message and navigate to login
            if (response.status === 201) {
                toast.success("User registered successfully!", {
                    position: "top-right",
                    autoClose: 1500,
                });
                navigate("/login"); // Navigate immediately
            }
        } catch (err) {
            // Handle error response from backend
            const message = err.response?.data?.message || "Error registering user. Please try again.";
            toast.error(message, {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setLoading(false); // Stop loading state
        }
    };

    const handleSignInClick = () => {
        const token = localStorage.getItem("token");
        if (token) {
            // If a token exists, navigate to dashboard
            navigate("/dashboard");
        } else {
            // Otherwise, navigate to login
            navigate("/login");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative">
            {/* Background Video */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
            >
                <source src={bgVideo} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            {/* Overlay to maintain visibility of content */}
            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 z-10"></div>
            {/* Content */}
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
                        onClick={handleSignInClick} // Navigate based on auth state
                    >
                        SIGN IN
                    </button>
                </div>

                {/* Right Section - Registration Form */}
                <div className="w-[62%] p-8 flex flex-col justify-center items-center">
                    <h2 className="text-[1.8rem] font-bold text-blue-600 mb-12 text-center">Create Account</h2>

                    <form className="space-y-5 w-full flex flex-col items-center" onSubmit={handleSubmit}>
                        <div className="relative w-[65%]">
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="pl-10 py-2 border border-gray-300 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                            <FontAwesomeIcon
                                icon={faUser}
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            />
                        </div>

                        <div className="relative w-[65%]">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10 py-2 border border-gray-300 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                            <FontAwesomeIcon
                                icon={faEnvelope}
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            />
                        </div>

                        <div className="relative w-[65%]">
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10 py-2 border border-gray-300 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                            <FontAwesomeIcon
                                icon={faLock}
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            />
                        </div>

                        <div className="relative w-[65%]">
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="pl-10 py-2 border border-gray-300 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                            <FontAwesomeIcon
                                icon={faLock}
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            />
                        </div>

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-[#99CCFF] via-[#C6B7FE] to-[#766E98] text-white py-2 px-8 w-[180px] rounded-full font-semibold hover:shadow-md transition-all duration-200"
                                disabled={loading}
                            >
                                {loading ? "Registering..." : "Register Now"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;