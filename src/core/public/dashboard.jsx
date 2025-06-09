import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar.jsx';
import { useTheme } from '../../components/ThemeContext';
import Footer from '../../components/footer.jsx';

export default function Dashboard() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/auth/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setUserProfile(data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 flex justify-center items-start mt-6">
          <div className="bg-white bg-opacity-60 backdrop-blur-lg dark:bg-gray-800 dark:bg-opacity-80 rounded-3xl shadow-lg p-8 w-full max-w-7xl h-[85vh]">
            <header className="mb-6 flex items-center space-x-4">
              {userProfile && userProfile.profilePicture ? (
                <img
                  src={`http://localhost:3000/${userProfile.profilePicture}`}
                  alt="Profile"
                  className="w-16 h-16 rounded-full border border-gray-300 dark:border-gray-600 cursor-pointer"
                  onClick={() => navigate('/profile')}
                />
              ) : (
                <img
                  src="src/assets/images/profile.png"
                  alt="Profile"
                  className="w-12 h-12 rounded-full border border-gray-300 dark:border-gray-600 cursor-pointer"
                  onClick={() => navigate('/profile')}
                />
              )}
              <h1 className="text-3xl font-bold text-gray-700 dark:text-gray-200">
                Hello, {userProfile ? userProfile.name : 'User'}
              </h1>
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
                <h2 className="text-xl font-bold">Have not tried the lessons yet?</h2>
                <p className="mt-2">Dive into the world of music for free, learn different instruments at your own pace.</p>
                <button
                  className="mt-4 py-2 px-4 rounded text-white bg-gradient-to-r from-[#99CCFF] via-[#C6B7FE] to-[#766E98] hover:from-purple-500 hover:to-purple-700 dark:hover:from-indigo-600 dark:hover:to-indigo-800 shadow-md"
                  onClick={() => navigate('/lesson')}
                >
                  Get Started
                </button>
              </div>
            </div>

            <div className="mt-12 flex gap-8">
              <div
                className="relative h-48 w-1/2 rounded-xl overflow-hidden bg-gradient-to-r from-blue-400 to-blue-500 dark:from-blue-900 dark:to-blue-700 text-white shadow-lg cursor-pointer transform hover:-translate-y-1 hover:scale-105 transition-all duration-300"
                onClick={() => navigate('/chords')}
              >
                <div className="overflow-hidden">
                  <img
                    src="src/assets/images/guitar2.jpg"
                    alt="Play along song"
                    className="absolute top-0 left-0 w-full h-full object-cover object-center transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 flex flex-col justify-center items-start p-6 bg-black bg-opacity-50">
                  <h2 className="text-lg font-bold">Play along song with chords</h2>
                </div>
              </div>

              <div
                className="relative h-48 w-1/2 rounded-xl overflow-hidden bg-gradient-to-r from-green-400 to-green-500 dark:from-green-900 dark:to-green-700 text-white shadow-lg cursor-pointer transform hover:-translate-y-1 hover:scale-105 transition-all duration-300"
                onClick={() => navigate('/tuner')}
              >
                <div className="overflow-hidden">
                  <img
                    src="src/assets/images/pick.jpg"
                    alt="Tune your instrument"
                    className="absolute top-0 left-0 w-full h-full object-cover object-center transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 flex flex-col justify-center items-start p-6 bg-black bg-opacity-50">
                  <h2 className="text-lg font-bold">Tune your instruments easily</h2>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}