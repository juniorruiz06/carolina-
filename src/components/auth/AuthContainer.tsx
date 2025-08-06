import { useState } from "react";
import { WelcomeScreen } from "./WelcomeScreen";
import { LoginScreen } from "./LoginScreen";
import { RegisterScreen } from "./RegisterScreen";
import { ForgotPasswordScreen } from "./ForgotPasswordScreen";

type AuthScreen = "welcome" | "login" | "register" | "forgot-password";

interface AuthContainerProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (name: string, email: string, password: string) => Promise<void>;
  onForgotPassword: (email: string) => Promise<void>;
}

export const AuthContainer = ({ onLogin, onRegister, onForgotPassword }: AuthContainerProps) => {
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>("welcome");

  const handleLogin = async (email: string, password: string) => {
    await onLogin(email, password);
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    await onRegister(name, email, password);
    // On successful registration, switch to login screen
    setCurrentScreen("login");
  };

  const handleForgotPassword = async (email: string) => {
    await onForgotPassword(email);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "welcome":
        return (
          <WelcomeScreen 
            onGetStarted={() => setCurrentScreen("login")}
          />
        );
      
      case "login":
        return (
          <LoginScreen
            onLogin={handleLogin}
            onForgotPassword={() => setCurrentScreen("forgot-password")}
            onSignUp={() => setCurrentScreen("register")}
            onBack={() => setCurrentScreen("welcome")}
          />
        );
      
      case "register":
        return (
          <RegisterScreen
            onRegister={handleRegister}
            onLogin={() => setCurrentScreen("login")}
            onBack={() => setCurrentScreen("welcome")}
          />
        );
      
      case "forgot-password":
        return (
          <ForgotPasswordScreen
            onResetPassword={handleForgotPassword}
            onBack={() => setCurrentScreen("login")}
          />
        );
      
      default:
        return (
          <WelcomeScreen 
            onGetStarted={() => setCurrentScreen("login")}
          />
        );
    }
  };

  return <>{renderScreen()}</>;
};