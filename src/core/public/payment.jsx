import React, { useEffect, useState } from "react";
import { FaCoffee } from "react-icons/fa"; // For the coffee cup icon
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../../components/footer.jsx";
import Sidebar from "../../components/sidebar.jsx";
import { useTheme } from "../../components/ThemeContext";

const SupportPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userProfile, setUserProfile] = useState(null);
  const { theme } = useTheme();
  const [nameOrSocial, setNameOrSocial] = useState("");
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState(10); // Changed default amount to 10

  // Fetch user profile
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
      }
    };

    fetchUserProfile();
  }, []);

  // Check for payment status on component mount and location change
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const paymentStatus = searchParams.get("payment");

    if (paymentStatus === "failure") {
      toast.error("Payment failed. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      // Clear donation data from localStorage on failure
      localStorage.removeItem("pendingDonation");
      navigate("/dashboard", { replace: true });
    }
  }, [location, navigate]);

  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    if (!nameOrSocial.trim()) {
      toast.error("Please enter your name or social handle.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Store donation details in localStorage before initiating payment
    const donationData = {
      amount,
      nameOrSocial,
      message,
    };
    console.log("Storing donation data in localStorage:", donationData);
    localStorage.setItem("pendingDonation", JSON.stringify(donationData));

    try {
      const response = await fetch(`http://localhost:3000/api/esewa/donate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          nameOrSocial,
          message,
          success_url: `http://localhost:3000/api/esewa/success?redirect=/success`,
          failure_url: `http://localhost:3000/api/esewa/failure?redirect=/payment?payment=failure`,
        }),
      });
      const data = await response.json();
      if (data.message === "Donation Order Created Successfully") {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

        Object.keys(data.formData).forEach((key) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = data.formData[key];
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      } else {
        toast.error("Failed to initiate payment.", {
          position: "top-right",
          autoClose: 3000,
        });
        localStorage.removeItem("pendingDonation");
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      toast.error("Failed to initiate payment. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
      localStorage.removeItem("pendingDonation");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 flex justify-center items-center mt-6">
          <div className="bg-white bg-opacity-60 backdrop-blur-lg dark:bg-gray-800 dark:bg-opacity-80 rounded-3xl shadow-lg p-8 w-full max-w-6xl">
            <header className="mb-6 flex items-center space-x-4">
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
                  className="w-12 h-12 rounded-full border border-gray-300 dark:border-gray-600 cursor-pointer"
                  onClick={() => navigate("/profile")}
                />
              )}
              <h1 className="text-3xl font-bold text-gray-700 dark:text-gray-200">
                Hello, {userProfile ? userProfile.name : "User"}
              </h1>
            </header>

            <div className="mt-8 flex justify-center">
              <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg dark:bg-gray-800 p-6 flex">
                {/* Left Section - About */}
                <div className="w-1/2 pr-4">
                  <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
                    About Anna
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    I'm dedicated to making music more accessible for musicians
                    by uncovering the perfect chord progressions for your
                    favorite songs. Whether it's finding the chords to a classic
                    hit or a new release, I work hard to bring you the most
                    accurate and easy-to-follow chords paired with lyrics.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    I also offer a special song request feature, where you can
                    ask for your favorite song's chords, and I'll do my best to
                    post it for you. Your support on Anna helps me keep this
                    project going, ensuring I can continue creating valuable
                    content and fulfilling song requests.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Thank you for being part of this musical journey! Together,
                    we'll make every song a little easier to play, one chord at
                    a time.
                  </p>
                  <div className="mt-4 flex space-x-2">
                    <a
                      href="https://www.facebook.com/buymeacoffee"
                      className="text-blue-500 dark:text-blue-300 hover:underline"
                    >
                      Facebook
                    </a>
                    <a
                      href="https://www.instagram.com/buymeacoffee"
                      className="text-blue-500 dark:text-blue-300 hover:underline"
                    >
                      Instagram
                    </a>
                  </div>
                </div>

                {/* Right Section - Payment Form */}
                <div className="w-1/2 pl-4 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
                    Support Anna a coffee ☕
                  </h2>
                  <div className="flex items-center justify-center mb-4">
                    <FaCoffee className="text-2xl text-brown-600 mr-2" />
                    <span className="text-gray-600 dark:text-gray-400">x</span>
                    <button
                      type="button"
                      onClick={() => setAmount(10)}
                      className={`ml-2 px-3 py-1 rounded-full ${
                        amount === 10
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 dark:bg-gray-600"
                      }`}
                    >
                      10
                    </button>
                    <button
                      type="button"
                      onClick={() => setAmount(20)}
                      className={`ml-2 px-3 py-1 rounded-full ${
                        amount === 20
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 dark:bg-gray-600"
                      }`}
                    >
                      20
                    </button>
                    <button
                      type="button"
                      onClick={() => setAmount(30)}
                      className={`ml-2 px-3 py-1 rounded-full ${
                        amount === 30
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 dark:bg-gray-600"
                      }`}
                    >
                      30
                    </button>
                    <button
                      type="button"
                      onClick={() => setAmount(50)}
                      className={`ml-2 px-3 py-1 rounded-full ${
                        amount === 50
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 dark:bg-gray-600"
                      }`}
                    >
                      50
                    </button>
                  </div>
                  <form onSubmit={handleDonationSubmit} className="space-y-4">
                    <div>
                      <input
                        type="text"
                        value={nameOrSocial}
                        onChange={(e) => setNameOrSocial(e.target.value)}
                        placeholder="Name or @yoursocial"
                        className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Say something nice..."
                        className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                    >
                      Support Rs.{amount}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default SupportPayment;