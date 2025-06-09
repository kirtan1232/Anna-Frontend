import { Suspense, useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./components/protectedRoute.jsx";
import AddChord from "./core/private/addChord.jsx";
import AddLesson from "./core/private/addLesson.jsx";
import AddPracticeSession from "./core/private/addPracticeSessions.jsx";
import AdminDashboard from "./core/private/adminDashboard.jsx";
import ViewChords from "./core/private/viewChords.jsx"; // New component
import ViewLessons from "./core/private/viewLessons.jsx"; // New component
import ViewPracticeSessions from "./core/private/viewPracticeSessions.jsx"; // New component
import ChordAndLyricPage from "./core/public/chordAndLyric.jsx";
import Dashboard from "./core/public/dashboard.jsx";
import ForgetPassword from "./core/public/forgetPassword.jsx";
import Lesson from "./core/public/lesson.jsx";
import LessonDetails from "./core/public/lessonDetails.jsx";
import LikedSongs from "./core/public/likedSongs.jsx";
import LoginPage from "./core/public/loginpage.jsx";
import PracticeSession from "./core/public/practiceSessions.jsx";
import Profile from "./core/public/profile.jsx";
import RegisterPage from "./core/public/register.jsx";
import ResetPasswordPage from "./core/public/resetPassword.jsx";
import SessionDetails from "./core/public/sessionDetails.jsx";
import SongDetails from "./core/public/songDetails.jsx";
import TunerInst from "./core/public/tunerInst.jsx";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    setIsAuthenticated(!!token);
    setIsAdmin(role === "admin");
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  // Public Routes
  const publicRoutes = [
    { path: "/", element: <RegisterPage /> },
    {
      path: "/login",
      element: (
        <LoginPage
          setIsAuthenticated={setIsAuthenticated}
          setIsAdmin={setIsAdmin}
        />
      ),
    },
    { path: "/register", element: <RegisterPage /> },
    { path: "/dashboard", element: <Dashboard /> },
    { path: "/forgetPassword", element: <ForgetPassword /> },
    { path: "/resetPassword", element: <ResetPasswordPage /> },
    { path: "/lesson", element: <Lesson /> },
    { path: "/practiceSessions", element: <PracticeSession /> },
    { path: "/chords", element: <ChordAndLyricPage /> },
    { path: "/song/:songId", element: <SongDetails /> },
    { path: "/tuner", element: <TunerInst /> },
    { path: "/profile", element: <Profile /> },
    { path: "/session-details/:day/:instrument", element: <SessionDetails /> },
    { path: "/lesson-details/:day", element: <LessonDetails /> },
    { path: "/liked-songs", element: <LikedSongs /> },
    { path: "*", element: <>Page not found</> },
  ];

  // Private/Admin Routes
  const privateRoutes = [
    {
      path: "/admindash",
      element: (
        <ProtectedRoute
          isAdminRoute={true}
          isAuthenticated={isAuthenticated}
          isAdmin={isAdmin}
        >
          <AdminDashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "/addChord",
      element: (
        <ProtectedRoute
          isAdminRoute={true}
          isAuthenticated={isAuthenticated}
          isAdmin={isAdmin}
        >
          <AddChord />
        </ProtectedRoute>
      ),
    },
    {
      path: "/addPracticeSessions",
      element: (
        <ProtectedRoute
          isAdminRoute={true}
          isAuthenticated={isAuthenticated}
          isAdmin={isAdmin}
        >
          <AddPracticeSession />
        </ProtectedRoute>
      ),
    },
    {
      path: "/addLesson",
      element: (
        <ProtectedRoute
          isAdminRoute={true}
          isAuthenticated={isAuthenticated}
          isAdmin={isAdmin}
        >
          <AddLesson />
        </ProtectedRoute>
      ),
    },
    {
      path: "/viewChords",
      element: (
        <ProtectedRoute
          isAdminRoute={true}
          isAuthenticated={isAuthenticated}
          isAdmin={isAdmin}
        >
          <ViewChords />
        </ProtectedRoute>
      ),
    },
    {
      path: "/viewLessons",
      element: (
        <ProtectedRoute
          isAdminRoute={true}
          isAuthenticated={isAuthenticated}
          isAdmin={isAdmin}
        >
          <ViewLessons />
        </ProtectedRoute>
      ),
    },
    {
      path: "/viewPracticeSessions",
      element: (
        <ProtectedRoute
          isAdminRoute={true}
          isAuthenticated={isAuthenticated}
          isAdmin={isAdmin}
        >
          <ViewPracticeSessions />
        </ProtectedRoute>
      ),
    },
  ];

  const routes = [...publicRoutes, ...privateRoutes];
  const router = createBrowserRouter(routes);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
