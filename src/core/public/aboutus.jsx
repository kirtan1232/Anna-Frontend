import {
  Award,
  BookOpen,
  Clock,
  Globe,
  Guitar,
  Headphones,
  Heart,
  Music,
  Shield,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/footer.jsx";
import Sidebar from "../../components/sidebar.jsx";
import { useTheme } from "../../components/ThemeContext";

export default function About() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [activeSection, setActiveSection] = useState("story");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch("http://localhost:3000/api/auth/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserProfile(data);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const stats = [
    {
      icon: <Users className="w-8 h-8" />,
      number: "10,000+",
      label: t("Students Worldwide"),
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      number: "500+",
      label: t("Lessons Available"),
    },
    {
      icon: <Music className="w-8 h-8" />,
      number: "3",
      label: t("Instruments Supported"),
    },
    {
      icon: <Award className="w-8 h-8" />,
      number: "95%",
      label: t("Success Rate"),
    },
  ];

  const features = [
    {
      icon: <Guitar className="w-12 h-12" />,
      title: t("Multi-Instrument Learning"),
      description: t(
        "Learn Guitar, Piano, and Ukulele with structured lessons designed for all skill levels."
      ),
    },
    {
      icon: <Target className="w-12 h-12" />,
      title: t("Progressive Learning Path"),
      description: t(
        "Follow a carefully crafted curriculum that builds your skills step by step."
      ),
    },
    {
      icon: <Headphones className="w-12 h-12" />,
      title: t("Interactive Practice"),
      description: t(
        "Practice with our built-in tuner and play along with chord progressions."
      ),
    },
    {
      icon: <Globe className="w-12 h-12" />,
      title: t("Accessible Anywhere"),
      description: t(
        "Learn from anywhere with our web-based platform that works on all devices."
      ),
    },
    {
      icon: <Clock className="w-12 h-12" />,
      title: t("Learn at Your Pace"),
      description: t(
        "Progress through lessons at your own speed with no time pressure."
      ),
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: t("Secure & Private"),
      description: t(
        "Your learning progress and personal data are protected with industry-standard security."
      ),
    },
  ];

  const team = [
    {
      name: "Kirtan Shrestha",
      role: t("Founder & Lead Developer"),
      image: "src/assets/images/profile.png",
      description: t(
        "Passionate about music education and technology, bringing innovative solutions to music learning."
      ),
      specialties: [
        t("Full-Stack Development"),
        t("Music Education"),
        t("UX Design"),
      ],
    },
    {
      name: "Anna",
      role: t("AI Music Assistant"),
      image: "src/assets/images/logo.png",
      description: t(
        "Our AI-powered learning companion that guides students through their musical journey."
      ),
      specialties: [
        t("Adaptive Learning"),
        t("Progress Tracking"),
        t("Personalized Recommendations"),
      ],
    },
  ];

  const milestones = [
    {
      year: "2024",
      title: t("Platform Launch"),
      description: t(
        "Anna Music Learning Platform officially launched with Guitar lessons."
      ),
    },
    {
      year: "2024",
      title: t("Multi-Instrument Support"),
      description: t(
        "Added Piano and Ukulele lessons to expand learning opportunities."
      ),
    },
    {
      year: "2024",
      title: t("Interactive Features"),
      description: t("Introduced tuner, chord library, and practice sessions."),
    },
    {
      year: "2024",
      title: t("Global Reach"),
      description: t("Reached students from over 50 countries worldwide."),
    },
  ];

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
            {/* Header */}
            <header className="mb-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 mb-6">
                <Heart className="text-white text-2xl" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent mb-4">
                {t("About Anna")}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                {t(
                  "Empowering music lovers worldwide to learn, practice, and master their favorite instruments through innovative technology and personalized learning experiences."
                )}
              </p>
            </header>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap justify-center mb-12 gap-2">
              {[
                {
                  id: "story",
                  label: t("Our Story"),
                  icon: <BookOpen className="w-4 h-4" />,
                },
                {
                  id: "mission",
                  label: t("Mission & Vision"),
                  icon: <Target className="w-4 h-4" />,
                },
                {
                  id: "features",
                  label: t("Features"),
                  icon: <Star className="w-4 h-4" />,
                },
                {
                  id: "team",
                  label: t("Team"),
                  icon: <Users className="w-4 h-4" />,
                },
                {
                  id: "journey",
                  label: t("Journey"),
                  icon: <TrendingUp className="w-4 h-4" />,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`flex items-center px-6 py-3 rounded-xl transition-all duration-300 ${
                    activeSection === tab.id
                      ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg transform scale-105"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {tab.icon}
                  <span className="ml-2 font-medium">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Our Story Section */}
            {activeSection === "story" && (
              <div className="space-y-8 animate-fadeIn">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 flex items-center">
                      <Sparkles className="w-8 h-8 text-purple-500 mr-3" />
                      {t("How It All Began")}
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                      {t(
                        "Anna was born from a simple belief: everyone deserves access to quality music education. Founded by Kirtan Shrestha, a passionate developer and music enthusiast, the platform combines cutting-edge technology with proven teaching methodologies."
                      )}
                    </p>
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                      {t(
                        "We noticed that traditional music education was often expensive, time-consuming, and not accessible to everyone. That's when we decided to create a platform that would democratize music learning and make it available to anyone, anywhere, at any time."
                      )}
                    </p>
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-2xl border border-purple-200 dark:border-purple-700">
                      <blockquote className="text-lg italic text-gray-700 dark:text-gray-300">
                        "
                        {t(
                          "Music has the power to transform lives. Our mission is to make that transformation accessible to everyone."
                        )}
                        "
                      </blockquote>
                      <cite className="text-purple-600 dark:text-purple-400 font-semibold mt-2 block">
                        - Kirtan Shrestha, {t("Founder")}
                      </cite>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                      <img
                        src="src/assets/images/untitled_design.png"
                        alt="Music Learning"
                        className="w-full h-auto rounded-2xl shadow-lg"
                      />
                    </div>
                    <div className="absolute -bottom-4 -right-4 bg-yellow-400 rounded-full p-4 shadow-lg animate-bounce">
                      <Music className="w-8 h-8 text-yellow-800" />
                    </div>
                  </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className="text-center p-6 bg-white/60 dark:bg-gray-700/60 rounded-2xl border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
                    >
                      <div className="flex justify-center text-purple-500 mb-4">
                        {stat.icon}
                      </div>
                      <div className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                        {stat.number}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mission & Vision Section */}
            {activeSection === "mission" && (
              <div className="space-y-12 animate-fadeIn">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Mission */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-3xl border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center mb-6">
                      <div className="bg-blue-500 rounded-full p-3 mr-4">
                        <Target className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                        {t("Our Mission")}
                      </h2>
                    </div>
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                      {t(
                        "To democratize music education by providing accessible, engaging, and effective online learning experiences that empower individuals to discover and develop their musical talents."
                      )}
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-center text-gray-600 dark:text-gray-400">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        {t("Make music education accessible to everyone")}
                      </li>
                      <li className="flex items-center text-gray-600 dark:text-gray-400">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        {t("Provide personalized learning experiences")}
                      </li>
                      <li className="flex items-center text-gray-600 dark:text-gray-400">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        {t("Foster a global community of music learners")}
                      </li>
                    </ul>
                  </div>

                  {/* Vision */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-8 rounded-3xl border border-purple-200 dark:border-purple-700">
                    <div className="flex items-center mb-6">
                      <div className="bg-purple-500 rounded-full p-3 mr-4">
                        <Globe className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                        {t("Our Vision")}
                      </h2>
                    </div>
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                      {t(
                        "To become the world's leading platform for online music education, inspiring millions to unlock their musical potential and bring more music into the world."
                      )}
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-center text-gray-600 dark:text-gray-400">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                        {t("Global reach with local relevance")}
                      </li>
                      <li className="flex items-center text-gray-600 dark:text-gray-400">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                        {t("Innovative learning technologies")}
                      </li>
                      <li className="flex items-center text-gray-600 dark:text-gray-400">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                        {t("Sustainable music education ecosystem")}
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Values */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-8 rounded-3xl border border-yellow-200 dark:border-yellow-700">
                  <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 text-center mb-8 flex items-center justify-center">
                    <Heart className="w-8 h-8 text-yellow-500 mr-3" />
                    {t("Our Values")}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="bg-yellow-500 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <Shield className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                        {t("Excellence")}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {t(
                          "We strive for the highest quality in everything we do."
                        )}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="bg-yellow-500 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                        {t("Community")}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {t("We believe in the power of learning together.")}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="bg-yellow-500 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                        {t("Innovation")}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {t(
                          "We continuously evolve to better serve our learners."
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Features Section */}
            {activeSection === "features" && (
              <div className="space-y-8 animate-fadeIn">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 text-center mb-12">
                  {t("What Makes Anna Special")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="bg-white/60 dark:bg-gray-700/60 p-8 rounded-3xl border border-gray-200 dark:border-gray-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
                    >
                      <div className="text-purple-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Team Section */}
            {activeSection === "team" && (
              <div className="space-y-12 animate-fadeIn">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 text-center mb-12">
                  {t("Meet Our Team")}
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {team.map((member, index) => (
                    <div
                      key={index}
                      className="bg-white/60 dark:bg-gray-700/60 p-8 rounded-3xl border border-gray-200 dark:border-gray-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                    >
                      <div className="flex items-center mb-6">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-20 h-20 rounded-full border-4 border-purple-500 mr-6"
                        />
                        <div>
                          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                            {member.name}
                          </h3>
                          <p className="text-purple-600 dark:text-purple-400 font-semibold">
                            {member.role}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                        {member.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {member.specialties.map((specialty, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Journey Section */}
            {activeSection === "journey" && (
              <div className="space-y-8 animate-fadeIn">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 text-center mb-12">
                  {t("Our Journey")}
                </h2>
                <div className="space-y-8">
                  {milestones.map((milestone, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-8 ${
                        index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                      }`}
                    >
                      <div className="flex-1">
                        <div
                          className={`bg-gradient-to-r ${
                            index % 2 === 0
                              ? "from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20"
                              : "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20"
                          } p-8 rounded-3xl border ${
                            index % 2 === 0
                              ? "border-blue-200 dark:border-blue-700"
                              : "border-purple-200 dark:border-purple-700"
                          }`}
                        >
                          <div className="flex items-center mb-4">
                            <div
                              className={`bg-gradient-to-r ${
                                index % 2 === 0
                                  ? "from-blue-500 to-purple-500"
                                  : "from-purple-500 to-pink-500"
                              } text-white px-4 py-2 rounded-full font-bold text-lg mr-4`}
                            >
                              {milestone.year}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                              {milestone.title}
                            </h3>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            {milestone.description}
                          </p>
                        </div>
                      </div>
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <div className="w-8 h-8 bg-white rounded-full"></div>
                      </div>
                      <div className="flex-1"></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Call to Action */}
            <div className="mt-16 text-center bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl p-12 text-white">
              <h2 className="text-3xl font-bold mb-4">
                {t("Ready to Start Your Musical Journey?")}
              </h2>
              <p className="text-xl mb-8 opacity-90">
                {t(
                  "Join thousands of students who are already learning with Anna"
                )}
              </p>
              <button
                onClick={() => navigate("/lesson")}
                className="bg-white text-purple-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {t("Start Learning Now")}
              </button>
            </div>
          </div>
        </main>

        {/* Profile Picture */}
        <div className="absolute top-4 right-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-full p-1">
              {userProfile && userProfile.profilePicture ? (
                <img
                  src={`http://localhost:3000/${userProfile.profilePicture}`}
                  alt="Profile"
                  className="w-16 h-16 rounded-full border-2 border-white dark:border-gray-600 cursor-pointer hover:scale-110 transition-transform duration-300"
                  onClick={() => navigate("/profile")}
                />
              ) : (
                <img
                  src="src/assets/images/profile.png"
                  alt="Profile"
                  className="w-16 h-16 rounded-full border-2 border-white dark:border-gray-600 cursor-pointer hover:scale-110 transition-transform duration-300"
                  onClick={() => navigate("/profile")}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
