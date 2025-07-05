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

      setShowCompletionGif(true);
      completedSound.play().catch((error) => console.error("Error playing completed sound:", error));
      
      toast.success("Lesson completed successfully!", {
        position: "top-right",
        autoClose: 1500,
      });

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
    <div
      className={`bg-gradient-to-br min-h-screen flex flex-col ${
        theme === "light" ? "from-purple-100 to-blue-100" : "from-gray-900 to-gray-800"
      }`}
    >
      <div className="relative flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 flex justify-center items-start mt-4">
          <div className="bg-white bg-opacity-60 backdrop-blur-lg dark:bg-gray-800 dark:bg-opacity-80 rounded-3xl shadow-lg p-8 w-full max-w-7xl h-[85vh]">
            {quizzes.length > 0 ? (
              <div className="flex flex-col h-full">
                <header className="mb-6">
                  <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                    Lesson for {day} ({instrument.charAt(0).toUpperCase() + instrument.slice(1)})
                  </h2>
                </header>
                
                <div className="flex flex-col lg:flex-row gap-8 flex-grow overflow-y-auto">
                  {/* Left side - Image */}
                  <div className="flex-1 flex items-center justify-center p-4">
                    {quizzes[currentIndex].chordDiagram ? (
                      <img
                        src={`http://localhost:3000/uploads/${quizzes[currentIndex].chordDiagram}`}
                        alt="Quiz Diagram"
                        className="w-full h-full max-h-[500px] object-contain rounded-lg shadow-md"
                        onError={(e) => {
                          console.error("Error loading image:", e.target.src);
                          e.target.src = "/assets/images/placeholder.png";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full max-h-[500px] bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <p className="text-xl text-gray-500 dark:text-gray-400">No image available</p>
                      </div>
                    )}
                  </div>

                  {/* Right side - Question and options */}
                  <div className="flex-1 flex flex-col">
                    <div className="mb-4">
                      <span className="text-lg font-medium text-gray-600 dark:text-gray-400">
                        Question {currentIndex + 1} of {quizzes.length}
                      </span>
                      <h3 className="text-2xl font-semibold mt-4 mb-6 text-gray-800 dark:text-gray-200">
                        {quizzes[currentIndex].question}
                      </h3>

                      <ul className="space-y-6">
                        {quizzes[currentIndex].options.map((option, i) => {
                          const selectedAnswer = selectedAnswers[currentIndex];
                          const isSelected = selectedAnswer?.answer === option;
                          const isCorrectOption = selectedAnswer?.correct && isSelected;
                          const isIncorrectOption = selectedAnswer && !selectedAnswer.correct && isSelected;
                          return (
                            <li
                              key={i}
                              onClick={() => handleOptionClick(option, quizzes[currentIndex].correctAnswer)}
                              className={`p-5 rounded-lg cursor-pointer transition-all duration-150 border text-xl
                                ${
                                  isCorrectOption
                                    ? "bg-green-100 border-green-500 text-green-800 dark:bg-green-900 dark:border-green-600 dark:text-green-200"
                                    : isIncorrectOption
                                    ? "bg-red-100 border-red-500 text-red-800 dark:bg-red-900 dark:border-red-600 dark:text-red-200"
                                    : "bg-gray-50 border-gray-300 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600"
                                }`}
                            >
                              <span className="font-bold mr-3">{String.fromCharCode(65 + i)}:</span>
                              {option}
                            </li>
                          );
                        })}
                      </ul>

                      {feedbackMessage && (
                        <p
                          className={`text-xl font-semibold mt-6 ${
                            isCorrect ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {feedbackMessage}
                        </p>
                      )}
                    </div>

                    {/* Navigation buttons */}
                    <div className="flex justify-between items-center mt-auto pt-6">
                      <button
                        onClick={prevQuiz}
                        disabled={currentIndex === 0}
                        className="flex items-center px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 disabled:opacity-50 text-lg"
                      >
                        <ChevronLeft size={24} className="mr-2" />
                        Previous
                      </button>
                      
                      {currentIndex === quizzes.length - 1 ? (
                        <button
                          onClick={handleSubmit}
                          className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors text-lg"
                        >
                          Submit
                        </button>
                      ) : (
                        <button
                          onClick={nextQuiz}
                          disabled={currentIndex === quizzes.length - 1}
                          className="flex items-center px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 disabled:opacity-50 text-lg"
                        >
                          Next
                          <ChevronRight size={24} className="ml-2" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-xl text-center text-gray-500 dark:text-gray-400 py-16">
                  No quizzes available for this day and instrument.
                </p>
              </div>
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