import React, { useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState(null);

  useEffect(() => {
    if (user) {
      checkOnboardingStatus();
    } else {
      setLoading(false);
    }
  }, [user]);

  const checkOnboardingStatus = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("onboarding_completed")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error verificando onboarding:", error);
        setOnboardingCompleted(false);
      } else {
        setOnboardingCompleted(data?.onboarding_completed || false);
      }
    } catch (error) {
      console.error("Error inesperado:", error);
      setOnboardingCompleted(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent1"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (onboardingCompleted === false && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  if (onboardingCompleted === true && location.pathname === "/onboarding") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PrivateRoute;