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
      className={`flex flex-col min-h-screen ${
        theme === "light"
          ? "bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
          : "bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900"
      } ${i18n.language === "ne" ? "font-noto-sans" : ""}`}
    >
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-pink-200 dark:bg-pink-800 rounded-full opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="flex flex-1 relative z-10">
        <Sidebar />
        <main className="flex-1 p-6 flex justify-center items-start mt-6">
          <div className="bg-white/70 backdrop-blur-xl dark:bg-gray-800/80 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 w-full max-w-7xl h-[85vh] overflow-y-auto">
            {/* Enhanced Header */}
            <header className="mb-8 flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-6">
                <div className="relative group">
                  {userProfile && userProfile.profilePicture ? (
                    <img
                      src={`http://localhost:3000/${userProfile.profilePicture}`}
                      alt="Profile"
                      className="w-20 h-20 rounded-full border-4 border-gradient-to-r from-purple-400 to-blue-400 cursor-pointer transition-all duration-300 group-hover:scale-110 shadow-lg"
                      onClick={() => handleNavigation("/profile")}
                    />
                  ) : (
                    <img
                      src="src/assets/images/profile.png"
                      alt="Profile"
                      className="w-20 h-20 rounded-full border-4 border-gradient-to-r from-purple-400 to-blue-400 cursor-pointer transition-all duration-300 group-hover:scale-110 shadow-lg"
                      onClick={() => handleNavigation("/profile")}
                    />
                  )}
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                    {t("Hello")}, {userProfile ? userProfile.name : t("User")}!
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 mt-1 text-lg">
                    {t("Ready to learn something new?")}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleLanguage}
                className="group relative overflow-hidden py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center space-x-2">
                  <img
                    src={
                      i18n.language === "en"
                        ? "src/assets/images/us-flag.PNG"
                        : "src/assets/images/nepal-flag.png"
                    }
                    alt={i18n.language === "en" ? "Nepal Flag" : "US Flag"}
                    className="w-6 h-4 rounded-sm"
                  />
                  <span>{t("Change Language")}</span>
                </div>
              </button>
            </header>

            {/* Enhanced Main Feature Card */}
            <div className="relative mt-8 h-64 w-full rounded-2xl overflow-hidden bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 dark:from-indigo-800 dark:via-purple-800 dark:to-indigo-900 text-white shadow-2xl cursor-pointer transform hover:-translate-y-2 hover:scale-[1.02] transition-all duration-500 group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="overflow-hidden rounded-2xl">
                <img
                  src="src/assets/images/untitled_design.png"
                  alt="Guitar and amplifier"
                  className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 flex flex-col justify-center items-start p-10 bg-gradient-to-r from-black/70 via-black/50 to-transparent">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold leading-tight">
                    {t("Have not tried the lessons yet?")}
                  </h2>
                  <p className="text-xl text-gray-200 leading-relaxed">
                    {t("Dive into the world of music")}
                  </p>
                  <button
                    className="group/btn relative overflow-hidden py-3 px-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 mt-4"
                    onClick={() => handleNavigation("/lesson")}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative flex items-center space-x-2">
                      <span>{t("Get Started")}</span>
                      <svg className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Enhanced Feature Cards Grid */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div
                className="group relative h-56 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-600 dark:from-blue-700 dark:to-cyan-800 text-white shadow-2xl cursor-pointer transform hover:-translate-y-2 hover:scale-[1.02] transition-all duration-500"
                onClick={() => handleNavigation("/chords")}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="overflow-hidden rounded-2xl">
                  <img
                    src="src/assets/images/guitar2.jpg"
                    alt="Play along song"
                    className="absolute top-0 left-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h2 className="text-2xl font-bold mb-2 leading-tight">
                      {t("Play along song with chords")}
                    </h2>
                    <p className="text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                      {t("Practice with your favorite songs and improve your chord transitions")}
                    </p>
                  </div>
                  <div className="absolute top-6 right-6 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                </div>
              </div>

              <div
                className="group relative h-56 rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-700 dark:to-teal-800 text-white shadow-2xl cursor-pointer transform hover:-translate-y-2 hover:scale-[1.02] transition-all duration-500"
                onClick={() => handleNavigation("/tuner")}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="overflow-hidden rounded-2xl">
                  <img
                    src="src/assets/images/pick.jpg"
                    alt="Tune your instrument"
                    className="absolute top-0 left-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h2 className="text-2xl font-bold mb-2 leading-tight">
                      {t("Tune your instruments easily")}
                    </h2>
                    <p className="text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                      {t("Keep your guitar perfectly tuned with our precision tuner")}
                    </p>
                  </div>
                  <div className="absolute top-6 right-6 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats or Additional Features */}
          
          </div>
        </main>
      </div>
      <Footer />
      
      {/* Enhanced Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl border border-white/20 dark:border-gray-700/50 transform animate-in fade-in duration-300">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                {t("Please log in to continue")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t("Access exclusive features and track your progress")}
              </p>
            </div>
            <div className="flex justify-center space-x-4">
              <button
                className="flex-1 py-3 px-6 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 font-semibold transition-all duration-300 transform hover:-translate-y-1"
                onClick={handleLoginCancel}
              >
                {t("Cancel")}
              </button>
              <button
                className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
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