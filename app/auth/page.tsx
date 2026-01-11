"use client";
import { useState } from "react";
import LoginPage from "@/components/LoginPage";
import SignupPage from "@/components/SignupPage";
import ForgotPasswordPage from "@/components/ForgotPasswordPage";

const AuthPage = () => {
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgotPassword'>('login');

  const switchToSignup = () => {
    setAuthMode('signup');
  };

  const switchToLogin = () => {
    setAuthMode('login');
  };

  const switchToForgotPassword = () => {
    setAuthMode('forgotPassword');
  };

  const handleLoginSuccess = () => {
    // This function can be expanded later
    console.log("Login successful!");
  };

  return (
    <div className="justify-center bg-gray-100">
      {authMode === 'login' ? (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          toggleAuthMode={switchToSignup}
          onForgotPassword={switchToForgotPassword}
        />
      ) : authMode === 'signup' ? (
        <SignupPage toggleAuthMode={switchToLogin} />
      ) : (
        <ForgotPasswordPage onBackToLogin={switchToLogin} />
      )}
    </div>
  );
};

export default AuthPage;
