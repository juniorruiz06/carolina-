import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { useMobile } from "@/hooks/useMobile";
import { AuthContainer } from "@/components/auth/AuthContainer";
import { Dashboard } from "@/pages/Dashboard";
import { MobileDashboard } from "@/pages/MobileDashboard";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user, loading, signIn, signUp, resetPassword } = useAuth();
  const { isMobile } = useMobile();

  // Debug logging
  console.log('AppRoutes: Loading:', loading);
  console.log('AppRoutes: User:', user);
  console.log('AppRoutes: isMobile:', isMobile);

  if (loading) {
    console.log('AppRoutes: Showing loading spinner');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    console.log('AppRoutes: No user, showing auth container');
    const handleLogin = async (email: string, password: string) => {
      await signIn(email, password);
    };

    const handleRegister = async (name: string, email: string, password: string) => {
      await signUp(email, password, name);
    };

    const handleForgotPassword = async (email: string) => {
      await resetPassword(email);
    };

    return (
      <AuthContainer 
        onLogin={handleLogin}
        onRegister={handleRegister}
        onForgotPassword={handleForgotPassword}
      />
    );
  }

  // Render appropriate dashboard based on device type
  console.log('AppRoutes: User authenticated, rendering dashboard');
  console.log('AppRoutes: Rendering', isMobile ? 'MobileDashboard' : 'Dashboard');
  // Force mobile dashboard for testing
  return <MobileDashboard />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<AppRoutes />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
