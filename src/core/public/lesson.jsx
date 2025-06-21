import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar.jsx";
import { FaCheckCircle, FaLock } from "react-icons/fa";
import { useTheme } from "../../components/ThemeContext.jsx";
import Footer from "../../components/footer.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Lesson() {
  const { theme } = useTheme();
  const [quizzes, setQuizzes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Ukulele");
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);
  const [completedLessons, setCompletedLessons] = useState([]); // Changed to completedLessons
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/quiz/getquiz?instrument=${encodeURIComponent(selectedCategory.toLowerCase())}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch quizzes");
        }
        const data = await response.json();
        setQuizzes(data);
      } catch (error) {
        toast.error("Error fetching quizzes: " + error.message, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    };

    const fetchCompletedLessons = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/completed/getcompleted", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch completed lessons");
        }

        const data = await response.json();
        setCompletedLessons(data.completedLessons || []); // Changed to completedLessons
      } catch (error) {
        toast.error("Error fetching completed lessons: " + error.message, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    };

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

    fetchQuizzes();
    fetchCompletedLessons();
    fetchUserProfile();
  }, [selectedCategory]);

  const filteredQuizzes = quizzes.filter((quiz) => quiz.instrument.toLowerCase() === selectedCategory.toLowerCase());
  const uniqueDays = [...new Set(filteredQuizzes.map((quiz) => quiz.day))].sort((a, b) => {
    const dayA = parseInt(a.replace("Day ", ""));
    const dayB = parseInt(b.replace("Day ", ""));
    return dayA - dayB;
  });
  const totalDays = uniqueDays.length;
  const completedDaysCount = uniqueDays.filter((day) =>
    completedLessons.some(
      (lesson) => lesson.day === day && lesson.instrument.toLowerCase() === selectedCategory.toLowerCase()
    )
  ).length;
  const completionPercentage = totalDays > 0 ? (completedDaysCount / totalDays) * 100 : 0;

  const isDayAccessible = (day) => {
    if (!day || uniqueDays.length === 0) return false;
    if (day === uniqueDays[0]) return true; // First day is always accessible
    const currentIndex = uniqueDays.indexOf(day);
    if (currentIndex === -1) return false;
    const previousDay = uniqueDays[currentIndex - 1];
    return completedLessons.some(
      (lesson) => lesson.day === previousDay && lesson.instrument.toLowerCase() === selectedCategory.toLowerCase()
    );
  };

  const handleDayClick = (day) => {
    if (!isDayAccessible(day)) {
      toast.warn("Complete the previous task first.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    navigate(`/lesson/${selectedCategory.toLowerCase()}/${day}`);
  };

  const isDayWrong = (day) => {
    return incorrectAnswers.some(
      (answer) => answer.day === day && answer.instrument.toLowerCase() === selectedCategory.toLowerCase()
    );
  };

  const isDayCompleted = (day) => {
    return completedLessons.some(
      (lesson) => lesson.day === day && lesson.instrument.toLowerCase() === selectedCategory.toLowerCase()
    );
  };

  return (
    <div
      className={`bg-gradient-to-br min-h-screen flex flex-col ${
        theme === "light" ? "from-purple-100 to-blue-100" : "from-gray-900 to-gray-800"
      }`}
    >
      <div className="relative flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 flex justify-center items-start mt-4">
          <div className="bg-white bg-opacity-60 backdrop-blur-lg dark:bg-gray-800 dark:bg-opacity-80 rounded-3xl shadow-lg p-8 w-full max-w-7xl h-[85vh]">
            <header className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                Available {selectedCategory} Lessons
              </h2>
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

            <div className="overflow-y-auto flex-grow p-2 space-y-4">
              {uniqueDays.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">No days available for this category.</p>
              ) : (
                <div className="flex flex-wrap space-x-4">
                  {uniqueDays.map((day) => (
                    <div
                      key={day}
                      onClick={() => handleDayClick(day)}
                      className={`p-4 w-32 rounded-lg shadow-md cursor-pointer transition duration-200 relative ${
                        isDayWrong(day)
                          ? "bg-red-200 dark:bg-red-800 opacity-40"
                          : isDayAccessible(day)
                          ? "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                          : "bg-gray-200 dark:bg-gray-700 opacity-50 cursor-not-allowed"
                      }`}
                    >
                      <p className="text-center text-gray-800 dark:text-gray-200">{day}</p>
                      {isDayCompleted(day) && !isDayWrong(day) && (
                        <span className="absolute top-2 right-2 text-green-600 dark:text-green-400 ml-2">
                          <FaCheckCircle />
                        </span>
                      )}
                      {!isDayAccessible(day) && (
                        <span className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 ml-2">
                          <FaLock />
                        </span>
                      )}
                    </div>
                  ))}
                </div>
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