import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/footer.jsx";
import Sidebar from "../../components/sidebar.jsx";
import { useTheme } from "../../components/ThemeContext";

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const { theme } = useTheme();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isAuthenticatedLocal, setIsAuthenticatedLocal] = useState(
    !!localStorage.getItem("token")
  );

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ne" : "en";
    i18n.changeLanguage(newLang);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchUserProfile = async () => {
      if (!token) {
        setUserProfile(null);
        setIsAuthenticatedLocal(false);
        return;
      }
      try {
        const response = await fetch("http://localhost:3000/api/auth/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(t("Error") + ": Failed to fetch profile");
        }

        const data = await response.json();
        setUserProfile(data);
        setIsAuthenticatedLocal(true);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUserProfile(null);
        setIsAuthenticatedLocal(false);
        localStorage.removeItem("token"); // Clear invalid token
      }
    };

    fetchUserProfile();
  }, [t]);

  const handleNavigation = (path) => {
    if (!localStorage.getItem("token")) {
      setShowLoginPrompt(true);
    } else {
      navigate(path);
    }
  };

  const handleLoginConfirm = () => {
    setShowLoginPrompt(false);
    navigate("/login");
  };

  const handleLoginCancel = () => {
    setShowLoginPrompt(false);
  };

  return (
    <div
      className={`flex flex-col min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 dark:from-gray-900 dark:to-gray-800 ${
        i18n.language === "ne" ? "font-noto-sans" : ""
      }`}
    >
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 flex justify-center items-start mt-6">
          <div className="bg-white bg-opacity-60 backdrop-blur-lg dark:bg-gray-800 dark:bg-opacity-80 rounded-3xl shadow-lg p-8 w-full max-w-7xl h-[85vh]">
            <header className="mb-6 flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                {userProfile && userProfile.profilePicture ? (
                  <img
                    src={`http://localhost:3000/${userProfile.profilePicture}`}
                    alt="Profile"
                    className="w-16 h-16 rounded-full border border-gray-300 dark:border-gray-600 cursor-pointer"
                    onClick={() => handleNavigation("/profile")}
                  />
                ) : (
                  <img
                    src="src/assets/images/profile.png"
                    alt="Profile"
                    className="w-12 h-12 rounded-full border border-gray-300 dark:border-gray-600 cursor-pointer"
                    onClick={() => handleNavigation("/profile")}
                  />
                )}
                <h1 className="text-3xl font-bold text-gray-700 dark:text-gray-200">
                  {t("Hello")}, {userProfile ? userProfile.name : t("User")}
                </h1>
              </div>
              <button
                onClick={toggleLanguage}
                className="py-2 px-4 bg-gradient-to-r from-[#99CCFF] via-[#C6B7FE] to-[#766E98] text-white rounded hover:opacity-90 flex items-center space-x-2"
              >
                <img
                  src={
                    i18n.language === "en"
                      ? "src/assets/images/us-flag.PNG"
                      : "src/assets/images/nepal-flag.png"
                  }
                  alt={i18n.language === "en" ? "Nepal Flag" : "US Flag"}
                  className="w-6 h-4"
                />
                <span>{t("Change Language")}</span>
              </button>
            </header>

            <div className="relative mt-8 h-52 w-full rounded-l-3xl overflow-hidden bg-gradient-to-r from-purple-400 to-purple-500 dark:from-indigo-900 dark:to-indigo-700 text-white shadow-lg cursor-pointer transform hover:-translate-y-1 hover:scale-105 transition-all duration-300">
              <div className="overflow-hidden">
                <img
                  src="src/assets/images/untitled_design.png"
                  alt="Guitar and amplifier"
                  className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 flex flex-col justify-center items-start p-8 bg-black bg-opacity-50">
                <h2 className="text-xl font-bold">
                  {t("Have not tried the lessons yet?")}
                </h2>
                <p className="mt-2">{t("Dive into the world of music")}</p>
                <button
                  className="mt-4 py-2 px-4 rounded text-white bg-gradient-to-r from-[#99CCFF] via-[#C6B7FE] to-[#766E98] hover:from-purple-500 hover:to-purple-700 dark:hover:from-indigo-600 dark:hover:to-indigo-800 shadow-md"
                  onClick={() => handleNavigation("/lesson")}
                >
                  {t("Get Started")}
                </button>
              </div>
            </div>

            <div className="mt-12 flex gap-8">
              <div
                className="relative h-48 w-1/2 rounded-xl overflow-hidden bg-gradient-to-r from-blue-400 to-blue-500 dark:from-blue-900 dark:to-blue-700 text-white shadow-lg cursor-pointer transform hover:-translate-y-1 hover:scale-105 transition-all duration-300"
                onClick={() => handleNavigation("/chords")}
              >
                <div className="overflow-hidden">
                  <img
                    src="src/assets/images/guitar2.jpg"
                    alt="Play along song"
                    className="absolute top-0 left-0 w-full h-full object-cover object-center transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 flex flex-col justify-center items-start p-6 bg-black bg-opacity-50">
                  <h2 className="text-lg font-bold">
                    {t("Play along song with chords")}
                  </h2>
                </div>
              </div>

              <div
                className="relative h-48 w-1/2 rounded-xl overflow-hidden bg-gradient-to-r from-green-400 to-green-500 dark:from-green-900 dark:to-green-700 text-white shadow-lg cursor-pointer transform hover:-translate-y-1 hover:scale-105 transition-all duration-300"
                onClick={() => handleNavigation("/tuner")}
              >
                <div className="overflow-hidden">
                  <img
                    src="src/assets/images/pick.jpg"
                    alt="Tune your instrument"
                    className="absolute top-0 left-0 w-full h-full object-cover object-center transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 flex flex-col justify-center items-start p-6 bg-black bg-opacity-50">
                  <h2 className="text-lg font-bold">
                    {t("Tune your instruments easily")}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">
              {t("Please log in to continue")}
            </h3>
            <div className="flex justify-center space-x-4">
              <button
                className="py-2 px-4 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
                onClick={handleLoginCancel}
              >
                {t("Cancel")}
              </button>
              <button
                className="py-2 px-4 bg-gradient-to-r from-[#99CCFF] via-[#C6B7FE] to-[#766E98] text-white rounded hover:opacity-90"
                onClick={handleLoginConfirm}
              >
                {t("Sign Up")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
