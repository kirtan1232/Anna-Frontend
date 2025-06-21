import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar.jsx";
import { FaCheckCircle, FaLock } from "react-icons/fa";
import { useTheme } from "../../components/ThemeContext";
import Footer from "../../components/footer.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PracticeSession() {
  const { theme } = useTheme();
  const [sessions, setSessions] = useState([]);
  const [completedSessions, setCompletedSessions] = useState([]);
  const [selectedInstrument, setSelectedInstrument] = useState("Guitar");
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);

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
        const response = await fetch("http://localhost:3000/api/sessions");
        if (!response.ok) {
          throw new Error("Failed to fetch sessions");
        }
        const data = await response.json();
        setSessions(data);
      } catch (error) {
        toast.error("Error fetching practice sessions: " + error.message, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    };

    const fetchCompletedSessions = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/completed-sessions/getcompleted", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch completed sessions");
        }
        const data = await response.json();
        setCompletedSessions(data.completedSessions || []);
      } catch (error) {
        toast.error("Error fetching completed sessions: " + error.message, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    };

    fetchUserProfile();
    fetchSessions();
    fetchCompletedSessions();
  }, []);

  const filteredSessions = sessions.filter((session) => session.instrument === selectedInstrument);
  const uniqueDays = [...new Set(filteredSessions.map((session) => session.day))].sort((a, b) => {
    const dayA = parseInt(a.replace("Day ", ""));
    const dayB = parseInt(b.replace("Day ", ""));
    return dayA - dayB;
  });
  const totalDays = uniqueDays.length;
  const completedDays = uniqueDays.filter((day) =>
    completedSessions.some((s) => s.day === day && s.instrument === selectedInstrument)
  ).length;
  const completionPercentage = totalDays > 0 ? (completedDays / totalDays) * 100 : 0;

  const isDayAccessible = (day) => {
    if (!day || uniqueDays.length === 0) return false;
    if (day === uniqueDays[0]) return true; // First day is always accessible
    const currentIndex = uniqueDays.indexOf(day);
    if (currentIndex === -1) return false;
    const previousDay = uniqueDays[currentIndex - 1];
    return completedSessions.some((s) => s.day === previousDay && s.instrument === selectedInstrument);
  };

  const handleDayClick = (day) => {
    if (!isDayAccessible(day)) {
      toast.warn("Complete the previous task first.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    navigate(`/session-details/${day}/${selectedInstrument}`);
  };

  const isDayCompleted = (day) => {
    return completedSessions.some((s) => s.day === day && s.instrument === selectedInstrument);
  };

  return (
    <div
      className={`flex flex-col min-h-screen ${
        theme === "light" ? "bg-gradient-to-br from-purple-100 to-blue-100" : "bg-gradient-to-br from-gray-900 to-gray-800"
      }`}
    >
      <div className="relative flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 flex justify-center items-start mt-4">
          <div className="bg-white bg-opacity-60 backdrop-blur-lg dark:bg-gray-800 dark:bg-opacity-80 rounded-3xl shadow-lg p-8 w-full max-w-7xl h-[85vh]">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
              Practice Sessions for {selectedInstrument}
            </h2>
            <div className="flex justify-start space-x-8 mb-6">
              {["Guitar", "Piano", "Ukulele"].map((instrument) => (
                <span
                  key={instrument}
                  onClick={() => setSelectedInstrument(instrument)}
                  className={`cursor-pointer ${
                    selectedInstrument === instrument
                      ? "text-blue-500 underline font-semibold"
                      : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                >
                  {instrument}
                </span>
              ))}
            </div>
            <div className="overflow-y-auto flex-grow p-2 space-y-4">
              {uniqueDays.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">No practice sessions available for this instrument.</p>
              ) : (
                uniqueDays.map((day) => {
                  const accessible = isDayAccessible(day);
                  const isCompleted = isDayCompleted(day);

                  return (
                    <div
                      key={day}
                      className={`p-4 bg-gray-100 rounded-lg shadow-md flex justify-between items-center transition duration-200 ${
                        accessible
                          ? "hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 cursor-pointer"
                          : "opacity-50 cursor-not-allowed dark:bg-gray-700"
                      }`}
                      onClick={() => handleDayClick(day)}
                    >
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{day}</h3>
                      {isCompleted && <FaCheckCircle className="text-green-600 dark:text-green-400 ml-2" />}
                      {!accessible && (
                        <span className="text-gray-500 dark:text-gray-400 ml-2">
                          <FaLock />
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
            <div className="mt-4">
              <div className="w-1/3 h-2.5 bg-gray-300 dark:bg-gray-600 rounded-full shadow-md">
                <div
                  className="h-full bg-gradient-to-r from-[#99CCFF] via-[#C6B7FE] to-[#766E98] dark:from-blue-600 dark:via-purple-600 dark:to-indigo-600 rounded-full"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              <p className="text-left text-sm font-medium mt-1 text-gray-700 dark:text-gray-300">
                {Math.round(completionPercentage)}% Completed
              </p>
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