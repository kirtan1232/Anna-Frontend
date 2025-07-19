import {
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Headphones,
  HelpCircle,
  Mail,
  MessageCircle,
  Music,
  Phone,
  Search,
  Send,
  Settings,
  Shield,
  User,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../../components/footer.jsx";
import Sidebar from "../../components/sidebar.jsx";
import { useTheme } from "../../components/ThemeContext";

export default function Help() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("faq");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "general",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          setContactForm((prev) => ({
            ...prev,
            name: data.name || "",
            email: data.email || "",
          }));
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const faqData = [
    {
      id: 1,
      category: "general",
      icon: <HelpCircle className="w-5 h-5" />,
      question: t("What is Anna Music Learning Platform?"),
      answer: t(
        "Anna is an interactive music learning platform that helps you learn guitar, piano, and ukulele through structured lessons, interactive quizzes, and practical exercises."
      ),
    },
    {
      id: 2,
      category: "lessons",
      icon: <BookOpen className="w-5 h-5" />,
      question: t("How do the lessons work?"),
      answer: t(
        "Our lessons are structured in daily modules. Each day contains multiple quizzes and exercises. You must complete each day successfully before moving to the next one."
      ),
    },
    {
      id: 3,
      category: "lessons",
      icon: <Music className="w-5 h-5" />,
      question: t("What instruments can I learn?"),
      answer: t(
        "Currently, we offer lessons for Guitar, Piano, and Ukulele. Each instrument has its own structured curriculum with beginner to advanced levels."
      ),
    },
    {
      id: 4,
      category: "account",
      icon: <User className="w-5 h-5" />,
      question: t("How do I create an account?"),
      answer: t(
        'Click on the "Sign Up" button on the dashboard or login page. Fill in your details including name, email, and password to create your account.'
      ),
    },
    {
      id: 5,
      category: "account",
      icon: <Settings className="w-5 h-5" />,
      question: t("How can I change my profile information?"),
      answer: t(
        "Go to your profile page by clicking on your profile picture. There you can update your name, email, profile picture, and other personal information."
      ),
    },
    {
      id: 6,
      category: "technical",
      icon: <Settings className="w-5 h-5" />,
      question: t("The tuner is not working properly. What should I do?"),
      answer: t(
        "Make sure your microphone is enabled and working. Check your browser permissions for microphone access. Try refreshing the page or using a different browser."
      ),
    },
    {
      id: 7,
      category: "technical",
      icon: <Shield className="w-5 h-5" />,
      question: t("Is my data safe?"),
      answer: t(
        "Yes, we take data security seriously. All user data is encrypted and stored securely. We never share your personal information with third parties."
      ),
    },
    {
      id: 8,
      category: "billing",
      icon: <CreditCard className="w-5 h-5" />,
      question: t("Is Anna free to use?"),
      answer: t(
        "Anna offers both free and premium features. Basic lessons are free, while advanced features and premium content require a subscription."
      ),
    },
    {
      id: 9,
      category: "lessons",
      icon: <Music className="w-5 h-5" />,
      question: t("Can I skip ahead to advanced lessons?"),
      answer: t(
        "No, our learning path is designed to be progressive. You must complete each day in order to ensure you have the necessary foundation for advanced concepts."
      ),
    },
    {
      id: 10,
      category: "technical",
      icon: <Headphones className="w-5 h-5" />,
      question: t("What are the system requirements?"),
      answer: t(
        "Anna works on any modern web browser (Chrome, Firefox, Safari, Edge). For the best experience with audio features, we recommend using headphones or good speakers."
      ),
    },
  ];

  const categories = [
    {
      id: "all",
      name: t("All Questions"),
      icon: <HelpCircle className="w-4 h-4" />,
    },
    {
      id: "general",
      name: t("General"),
      icon: <HelpCircle className="w-4 h-4" />,
    },
    {
      id: "lessons",
      name: t("Lessons"),
      icon: <BookOpen className="w-4 h-4" />,
    },
    { id: "account", name: t("Account"), icon: <User className="w-4 h-4" /> },
    {
      id: "technical",
      name: t("Technical"),
      icon: <Settings className="w-4 h-4" />,
    },
    {
      id: "billing",
      name: t("Billing"),
      icon: <CreditCard className="w-4 h-4" />,
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredFAQs = faqData.filter((faq) => {
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success(
        t(
          "Your message has been sent successfully! We will get back to you soon."
        ),
        {
          position: "top-right",
          autoClose: 3000,
        }
      );

      setContactForm({
        name: userProfile?.name || "",
        email: userProfile?.email || "",
        subject: "",
        message: "",
        category: "general",
      });
    } catch (error) {
      toast.error(t("Failed to send message. Please try again."), {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({
      ...prev,
      [name]: value,
    }));
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
            {/* Header */}
            <header className="mb-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 mb-4">
                <HelpCircle className="text-white text-2xl" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                {t("Help & Support")}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">
                {t("Find answers to your questions or get in touch with us")}
              </p>
            </header>

            {/* Tab Navigation */}
            <div className="flex justify-center mb-8">
              <div className="flex bg-white/50 dark:bg-gray-700/50 rounded-2xl p-2 shadow-lg backdrop-blur-sm">
                <button
                  onClick={() => setActiveTab("faq")}
                  className={`flex items-center px-6 py-3 rounded-xl transition-all duration-300 ${
                    activeTab === "faq"
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      : "text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-600/50"
                  }`}
                >
                  <HelpCircle className="w-5 h-5 mr-2" />
                  <span className="font-semibold">{t("FAQ")}</span>
                </button>
                <button
                  onClick={() => setActiveTab("contact")}
                  className={`flex items-center px-6 py-3 rounded-xl transition-all duration-300 ${
                    activeTab === "contact"
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      : "text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-600/50"
                  }`}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  <span className="font-semibold">{t("Contact Support")}</span>
                </button>
              </div>
            </div>

            {/* FAQ Section */}
            {activeTab === "faq" && (
              <div className="space-y-6">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder={t("Search FAQs...")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-3">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center px-4 py-2 rounded-xl transition-all duration-300 ${
                        selectedCategory === category.id
                          ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      {category.icon}
                      <span className="ml-2 font-medium">{category.name}</span>
                    </button>
                  ))}
                </div>

                {/* FAQ List */}
                <div className="space-y-4">
                  {filteredFAQs.length === 0 ? (
                    <div className="text-center py-12">
                      <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-xl text-gray-500 dark:text-gray-400">
                        {t("No FAQs found matching your search.")}
                      </p>
                    </div>
                  ) : (
                    filteredFAQs.map((faq) => (
                      <div
                        key={faq.id}
                        className="bg-white/60 dark:bg-gray-700/60 rounded-2xl border border-gray-200 dark:border-gray-600 overflow-hidden transition-all duration-300 hover:shadow-lg"
                      >
                        <button
                          onClick={() => toggleFAQ(faq.id)}
                          className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-600/50 transition-colors duration-200"
                        >
                          <div className="flex items-center">
                            <div className="mr-4 text-purple-500">
                              {faq.icon}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                              {faq.question}
                            </h3>
                          </div>
                          {expandedFAQ === faq.id ? (
                            <ChevronUp className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          )}
                        </button>
                        {expandedFAQ === faq.id && (
                          <div className="px-6 pb-6">
                            <div className="pl-9 text-gray-600 dark:text-gray-300 leading-relaxed">
                              {faq.answer}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Contact Support Section */}
            {activeTab === "contact" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Contact Form */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
                    {t("Send us a message")}
                  </h2>

                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t("Name")}
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={contactForm.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800 dark:text-gray-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t("Email")}
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={contactForm.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800 dark:text-gray-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t("Category")}
                      </label>
                      <select
                        name="category"
                        value={contactForm.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800 dark:text-gray-200"
                      >
                        <option value="general">{t("General Question")}</option>
                        <option value="technical">
                          {t("Technical Issue")}
                        </option>
                        <option value="billing">{t("Billing Question")}</option>
                        <option value="lessons">{t("Lesson Help")}</option>
                        <option value="account">{t("Account Issue")}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t("Subject")}
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={contactForm.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800 dark:text-gray-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t("Message")}
                      </label>
                      <textarea
                        name="message"
                        value={contactForm.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800 dark:text-gray-200 resize-none"
                        placeholder={t(
                          "Please describe your question or issue in detail..."
                        )}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:hover:transform-none"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          {t("Sending...")}
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Send className="w-5 h-5 mr-2" />
                          {t("Send Message")}
                        </div>
                      )}
                    </button>
                  </form>
                </div>

                {/* Contact Information */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
                    {t("Other ways to reach us")}
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-start p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200 dark:border-blue-700">
                      <Mail className="w-6 h-6 text-blue-500 mr-4 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                          {t("Email Support")}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">
                          support@anna-music.com
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          {t("We typically respond within 24 hours")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl border border-green-200 dark:border-green-700">
                      <MessageCircle className="w-6 h-6 text-green-500 mr-4 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                          {t("Live Chat")}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">
                          {t("Available 9 AM - 6 PM (Mon-Fri)")}
                        </p>
                        <button
                          onClick={() =>
                            window.open(
                              "https://wa.me/9862242899?text=Hello! I need help with Anna Music Learning Platform.",
                              "_blank"
                            )
                          }
                          className="mt-3 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors flex items-center"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787" />
                          </svg>
                          {t("Start Chat")}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-start p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200 dark:border-purple-700">
                      <Phone className="w-6 h-6 text-purple-500 mr-4 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                          {t("Phone Support")}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">
                          +977 9862242899
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          {t("Available 9 AM - 6 PM (Mon-Fri)")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Tips */}
                  <div className="mt-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl border border-yellow-200 dark:border-yellow-700">
                    <h3 className="flex items-center font-semibold text-gray-800 dark:text-gray-200 mb-4">
                      <CheckCircle className="w-5 h-5 text-yellow-500 mr-2" />
                      {t("Quick Tips")}
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <li>
                        •{" "}
                        {t(
                          "Check our FAQ section first - most questions are answered there"
                        )}
                      </li>
                      <li>
                        •{" "}
                        {t(
                          "Include specific details about your issue for faster resolution"
                        )}
                      </li>
                      <li>
                        •{" "}
                        {t(
                          "Mention your browser and device type for technical issues"
                        )}
                      </li>
                      <li>• {t("Include screenshots if possible")}</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
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
    </div>
  );
}
