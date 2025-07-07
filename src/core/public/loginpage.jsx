import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logoImage from "../../assets/images/logo.png";
import loginSound from "../../assets/audio/intro.m4a";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// eslint-disable-next-line react/prop-types
const LoginPage = ({ setIsAuthenticated, setIsAdmin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Check if the token is already in localStorage on component mount
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            // If a token exists, set the headers for axios
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            // Redirect to dashboard for all users
            const role = localStorage.getItem("role");
            if (role) {
                setIsAuthenticated(true);
                setIsAdmin(role === "admin");
                navigate("/dashboard"); // Changed to always redirect to /dashboard
            }
        }
    }, [navigate, setIsAuthenticated, setIsAdmin]);

    const handleSignUpClick = () => {
        navigate("/register");
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error("Please fill in both fields.", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        if (loading) return; // Prevent multiple submissions

        setLoading(true); // Set loading state

        try {
            // Clear any existing Authorization header before login request
            delete axios.defaults.headers.common['Authorization'];

            const response = await axios.post(
                "http://localhost:3000/api/auth/login",
                { email, password }
            );

            const { token, role } = response.data;

            // Store token and role in localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("role", role);

            // Set Authorization header for future requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Update parent state
            setIsAuthenticated(true);
            setIsAdmin(role === "admin");

            // Play login success sound
            const audio = new Audio(loginSound);
            audio.play().catch((error) => {
                console.error("Error playing login sound:", error);
            });

            // Show success toast
            toast.success("Login successful!", {
                position: "top-right",
                autoClose: 1500,
            });

            // Navigate to dashboard for all users
            navigate("/dashboard"); // Changed to always redirect to /dashboard
        } catch (error) {
            console.error("Login error: ", error);
            if (error.response && error.response.status === 401) {
                toast.error("Invalid email or password.", {
                    position: "top-right",
                    autoClose: 3000,
                });
            } else {
                const errorMsg = error?.response?.data?.message || "Error logging in. Please try again.";
                toast.error(errorMsg, {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 dark:from-gray-900 dark:to-gray-800">
            {/* Content */}
            <div className="relative bg-white bg-opacity-90 rounded-3xl shadow-md flex w-full max-w-5xl h-[490px] overflow-hidden z-20">
                {/* Left Section - Login Form */}
                <div className="w-[62%] p-8 flex flex-col justify-center items-center">
                    <h2 className="text-[1.8rem] font-bold text-blue-600 mb-6 text-center">
                        Login to Anna.
                    </h2>
                    <form className="space-y-5 w-full flex flex-col items-center" onSubmit={handleLogin}>
                        <div className="relative w-[65%]">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10 py-2 border border-gray-300 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                                required
                            />
                            <FontAwesomeIcon
                                icon={faUser}
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
                                required
                            />
                            <FontAwesomeIcon
                                icon={faLock}
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            />
                        </div>
                        <div className="text-center mt-6">
                            <span
                                onClick={() => navigate("/forgetPassword")}
                                className="text-sm font-bold text-gray-600 hover:underline cursor-pointer"
                            >
                                Forgot your password?
                            </span>
                        </div>
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-[#99CCFF] via-[#C6B7FE] to-[#766E98] text-white py-2 px-8 w-[180px] rounded-full font-semibold hover:shadow-md transition-all duration-200"
                                disabled={loading}
                            >
                                {loading ? "Logging in..." : "Login Now"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right Section - Sign Up Prompt */}
                <div className="w-[40%] bg-gradient-to-r from-[#99CCFF] via-[#C6B7FE] to-[#766E98] text-white rounded-r-3xl flex flex-col items-center justify-center p-6">
                    <img
                        src={logoImage}
                        alt="Anna Logo"
                        className="w-32 h-auto mb-6"
                    />
                    <button
                        className="px-6 py-2 border-2 border-white rounded-full text-white text-base font-semibold hover:bg-white hover:text-blue-500 transition-all duration-200 shadow-sm"
                        onClick={handleSignUpClick}
                    >
                        SIGN UP
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;