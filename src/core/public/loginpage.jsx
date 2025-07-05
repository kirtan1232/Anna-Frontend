import { SignIn } from "@clerk/clerk-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <SignIn
        routing="path"
        path="/login"
        signUpUrl="/register"
        afterSignInUrl="/dashboard"
        afterSignUpUrl="/dashboard"
        redirectUrl="/dashboard"
        appearance={{
          elements: {
            formButtonPrimary:
              "bg-gradient-to-r from-[#99CCFF] via-[#C6B7FE] to-[#766E98] text-white py-2 px-8 rounded-full font-semibold hover:shadow-md transition-all duration-200",
            formFieldInput:
              "pl-10 py-2 border border-gray-300 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-blue-300",
            socialButtons: "space-y-3",
          },
        }}
        signInWithGoogle={true}
      />
      <ToastContainer />
    </div>
  );
};

export default LoginPage;