import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar.jsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "../../components/ThemeContext.jsx";
import Footer from "../../components/footer.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LessonDetails() {
  const { theme } = useTheme();
  const { day, instrument } = useParams();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [isCorrect, setIsCorrect] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [correctSound] = useState(new Audio("/src/assets/audio/true.mp3"));
  const [incorrectSound] = useState(new Audio("/src/assets/audio/false.mp3"));
  const [completedSound] = useState(new Audio("/src/assets/audio/completed.mp3"));
  const [showCompletionGif, setShowCompletionGif] = useState(false);

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
        console.error("Error fetching user profile:", error);
        toast.error("Error fetching user profile: " + error.message, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    };

    const fetchQuizzes = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/quiz/getquiz?day=${encodeURIComponent(day)}&instrument=${encodeURIComponent(
            instrument
          )}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch quizzes");
        }
        const data = await response.json();
        console.log("Fetched quiz data:", data);

        if (data.length > 0) {
          const allQuizzes = data.flatMap((quiz) => quiz.quizzes);
          setQuizzes(allQuizzes);
        } else {
          setQuizzes([]);
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
        toast.error("Error fetching quizzes: " + error.message, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    };

    fetchUserProfile();
    fetchQuizzes();
  }, [day, instrument]);

  const handleOptionClick = (option, correctAnswer) => {
    const correct = option === correctAnswer;
    setIsCorrect(correct);
    setFeedbackMessage(correct ? "Correct!" : "Incorrect answer!");

    // Play sound based on correctness
    if (correct) {
      correctSound.play().catch((error) => console.error("Error playing correct sound:", error));
    } else {
      incorrectSound.play().catch((error) => console.error("Error playing incorrect sound:", error));
    }

    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentIndex] = { answer: option, correct: correct };
    setSelectedAnswers(updatedAnswers);
  };

  const nextQuiz = () => {
    if (!selectedAnswers[currentIndex] || !selectedAnswers[currentIndex].correct) {
      toast.error("Please select the correct answer to go to the next question.", {
        position: "top-right",
        autoClose: 3000,
      });
      incorrectSound.play().catch((error) => console.error("Error playing incorrect sound:", error));
      return;
    }

    if (currentIndex < quizzes.length - 1) {
      setCurrentIndex(currentIndex + 1);
      resetState();
    }
  };

  const prevQuiz = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      resetState();
    }
  };

  const resetState = () => {
    setIsCorrect(null);
    setFeedbackMessage("");
  };

  const handleSubmit = async () => {
    const hasIncorrectAnswers = selectedAnswers.some((answer) => answer && !answer.correct);
    if (hasIncorrectAnswers || selectedAnswers.length < quizzes.length) {
      toast.error("Please answer all questions correctly before submitting.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/completed/addcompleted", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ day, instrument }),
      });

      if (!response.ok) {
        throw new Error("Failed to mark lesson as completed");
      }

      // Show GIF and play completed sound
      setShowCompletionGif(true);
      completedSound.play().catch((error) => console.error("Error playing completed sound:", error));
      
      toast.success("Lesson completed successfully!", {
        position: "top-right",
        autoClose: 1500,
      });

      // Hide GIF after 3 seconds
      setTimeout(() => {
        setShowCompletionGif(false);
        navigate("/lesson");
      }, 3500);
    } catch (error) {
      toast.error("Error marking lesson as completed: " + error.message, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className={`bg-gradient-to-br min-h-screen flex flex-col ${theme === 'light' ? 'from-purple-100 to-blue-100' : 'from-gray-900 to-gray-800'}`}>
      <div className="relative flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 flex justify-center items-start mt-4">
          <div className="bg-white bg-opacity-60 backdrop-blur-lg dark:bg-gray-800 dark:bg-opacity-80 rounded-3xl shadow-lg p-8 w-full max-w-7xl">
            {quizzes.length > 0 ? (
              <div className="flex flex-col h-full">
                <header className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                    Lesson for {day} ({instrument.charAt(0).toUpperCase() + instrument.slice(1)})
                  </h2>
                </header>
                <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Quiz {currentIndex + 1}: {quizzes[currentIndex].question}
                </h3>
                <div className="flex justify-center gap-4 mt-2">
                  {quizzes[currentIndex].chordDiagram ? (
                    <img
                      src={`http://localhost:3000/uploads/${quizzes[currentIndex].chordDiagram}`}
                      alt="Chord Diagram"
                      className="w-64 h-64 object-contain rounded shadow-md mx-auto"
                      onError={(e) => {
                        console.error("Error loading image:", e.target.src);
                        e.target.src = "/assets/images/placeholder.png";
                      }}
                    />
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 mb-4 text-center">No chord diagram available.</p>
                  )}
                </div>
                <ul className="space-y-2 mt-4">
                  {quizzes[currentIndex].options.map((option, i) => {
                    const selectedAnswer = selectedAnswers[currentIndex];
                    const isSelected = selectedAnswer?.answer === option;
                    const isCorrectOption = selectedAnswer?.correct && isSelected;
                    const isIncorrectOption = selectedAnswer && !selectedAnswer.correct && isSelected;
                    return (
                      <li
                        key={i}
                        onClick={() => handleOptionClick(option, quizzes[currentIndex].correctAnswer)}
                        className={`p-2 rounded-md cursor-pointer transition-all duration-150 
                          ${
                            isCorrectOption
                              ? "bg-green-500 opacity-70 text-white dark:bg-green-600"
                              : isIncorrectOption
                              ? "bg-red-500 opacity-70 text-white dark:bg-red-600"
                              : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                          }`}
                      >
                        {option}
                      </li>
                    );
                  })}
                </ul>
                {feedbackMessage && (
                  <p
                    className={`text-lg font-semibold mt-3 ${
                      isCorrect ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {feedbackMessage}
                  </p>
                )}
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={prevQuiz}
                    disabled={currentIndex === 0}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 disabled:opacity-50"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={nextQuiz}
                    disabled={currentIndex === quizzes.length - 1}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 disabled:opacity-50"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
                {currentIndex === quizzes.length - 1 && (
                  <button
                    onClick={handleSubmit}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
                  >
                    Submit
                  </button>
                )}
              </div>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400">No quizzes available for this day and instrument.</p>
            )}
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
        {showCompletionGif && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <img
              src="/src/assets/images/completed.gif"
              alt="Lesson Completed"
              className="w-auto h-auto object-contain"
            />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}