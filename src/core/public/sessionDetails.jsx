import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/sidebar.jsx";
import { FaCheckCircle } from "react-icons/fa";
import { useTheme } from "../../components/ThemeContext";
import Footer from "../../components/footer.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SessionDetails() {
  const { theme } = useTheme();
  const { day, instrument } = useParams();
  const [sessions, setSessions] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [canMarkComplete, setCanMarkComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();

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
        toast.error("Error fetching user profile: " + error.message, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    };

    const fetchSessions = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/sessions`);
        if (!response.ok) {
          throw new Error("Failed to fetch sessions");
        }
        const data = await response.json();
        const filtered = data.filter((session) => session.day === day && session.instrument === instrument);
        setSessions(filtered);
        if (filtered.length > 0) {
          setTimeLeft(filtered[0].duration * 60);
          fetchCompletionStatus();
        }
      } catch (error) {
        toast.error("Error fetching sessions: " + error.message, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    };

    const fetchCompletionStatus = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/completed-sessions/getcompleted", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch completion status");
        }
        const data = await response.json();
        const isCompleted = data.completedSessions.some(
          (s) => s.day === day && s.instrument === instrument
        );
        setCompleted(isCompleted);
      } catch (error) {
        toast.error("Error fetching completion status: " + error.message, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    };

    fetchUserProfile();
    fetchSessions();
  }, [day, instrument]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setCanMarkComplete(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return "";
    const match = url.match(/(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch\?v=|embed\/|v\/|.+\?v=))([^&\n]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : "";
  };

  const markAsComplete = async () => {
    if (!canMarkComplete) {
      toast.warn("Finish the practice first.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/completed-sessions/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ day, instrument }),
      });

      if (!response.ok) {
        throw new Error("Failed to mark session as complete");
      }

      const data = await response.json();
      setCompleted(!completed);
      toast.success("Session completion toggled!", {
        position: "top-right",
        autoClose: 1500,
      });
    } catch (error) {
      toast.error("Error marking session as complete: " + error.message, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className={`bg-gradient-to-br min-h-screen flex flex-col ${theme === 'light' ? 'from-purple-100 to-blue-100' : 'from-gray-900 to-gray-800'} fallback:bg-gray-900`}>
      <div className="relative flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 flex justify-center items-start mt-4">
          <div className="bg-white bg-opacity-60 backdrop-blur-lg dark:bg-gray-800 dark:bg-opacity-80 rounded-3xl shadow-lg p-8 w-full max-w-7xl h-[85vh] overflow-y-auto">
            <header className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                Sessions for {day} - {instrument}
              </h2>
            </header>
            <div className="space-y-4">
              {sessions.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">No sessions available.</p>
              ) : (
                sessions.map((session) => (
                  <div
                    key={session._id}
                    className="p-4 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                  >
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{session.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{session.description}</p>
                    <div className="mt-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Duration:</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400"> {session.duration} minutes</span>
                    </div>
                    <div className="mt-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Instructions:</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{session.instructions}</p>
                    </div>
                    {session.file && (
                      <div className="mt-4">
                        <iframe
                          src={getYouTubeEmbedUrl(session.file)}
                          frameBorder="0"
                          width="450"
                          height="210"
                          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title="Video Preview"
                          className="mt-2 rounded-md"
                        ></iframe>
                      </div>
                    )}
                    {completed ? (
                      <div className="mt-4 flex items-center text-green-600 dark:text-green-400">
                        <FaCheckCircle className="mr-2" />
                        <span>Session Completed</span>
                      </div>
                    ) : (
                      <button
                        onClick={markAsComplete}
                        disabled={!canMarkComplete}
                        className={`mt-4 text-white px-4 py-2 rounded-md transition-all duration-500 ${
                          canMarkComplete
                            ? "bg-gradient-to-r from-[#99CCFF] via-[#C6B7FE] to-[#766E98] hover:opacity-90 dark:from-blue-600 dark:via-purple-600 dark:to-indigo-600 dark:hover:opacity-90"
                            : "bg-blue-200 dark:bg-gray-600 cursor-not-allowed"
                        }`}
                      >
                        {canMarkComplete ? "Mark as Complete" : `Practice for ${timeLeft}s`}
                      </button>
                    )}
                  </div>
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