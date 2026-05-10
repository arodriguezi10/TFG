import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { RoutineProvider } from "./context/RoutinesContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import MainLayout from "./layouts/MainLayout";
import Profile from "./pages/Profile";
import PersonalSettings from "./pages/PersonalSettings";
import Checkout from "./pages/Checkout";
import PaymentConfirmation from "./pages/PaymentConfirmation";
import SubscriptionDetails from "./pages/SubcriptionDetails";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoutes";
import Progression from "./pages/Progression";
import CreateProgression from "./pages/CreateProgression";
import Routines1 from "./pages/Routines1";
import EditRoutine from "./pages/EditRoutine";
import ExecuteRoutine from "./pages/ExecuteRoutine";
import WorkoutSumary from "./pages/WorkoutSumary";
import CreateRoutines1 from "./pages/CreateRoutines1";
import ExerciseSearchFree from "./pages/ExerciseSearchFree";
import CreatePersonalExercise from "./pages/CreatePersonalExercise";
import ConfigExerciseFree from "./pages/ConfigExerciseFree";
import Progress from "./pages/Progress";
import DailyRegister from "./pages/DailyRegister";
import Subscription from "./pages/Subscription";
import Onboarding from "./pages/Onboarding";
import Leaderboard from "./pages/Leaderboard";
import { CoachProvider } from "./context/CoachContext";
import CoachDashboard from "./pages/CoachDashboard";
import CoachSearch from "./pages/CoachSearch";
import CoachRequests from "./pages/CoachRequests";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CoachProvider>
        <RoutineProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route path="/resetPassword" element={<ResetPassword />} />

            <Route path="/onboarding" element={<PrivateRoute><Onboarding /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/personalSettings" element={<PrivateRoute><PersonalSettings /></PrivateRoute>} />
            <Route path="/subscription" element={<PrivateRoute><Subscription /></PrivateRoute>} />
            <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
            <Route path="/paymentConfirmation" element={<PrivateRoute><PaymentConfirmation /></PrivateRoute>} />
            <Route path="/subscriptionDetails" element={<PrivateRoute><SubscriptionDetails /></PrivateRoute>} />
            <Route path="/editRoutine/:id" element={<PrivateRoute><EditRoutine /></PrivateRoute>} />
            <Route path="/executeRoutine/:id" element={<PrivateRoute><ExecuteRoutine /></PrivateRoute>} />
            <Route path="/WorkoutSumary" element={<PrivateRoute><WorkoutSumary /></PrivateRoute>} />
            <Route path="/createRoutines1" element={<PrivateRoute><CreateRoutines1 /></PrivateRoute>} />
            <Route path="/exerciseSearchFree" element={<PrivateRoute><ExerciseSearchFree /></PrivateRoute>} />
            <Route path="/createPersonalExercise" element={<PrivateRoute><CreatePersonalExercise /></PrivateRoute>} />
            <Route path="/configExerciseFree" element={<PrivateRoute><ConfigExerciseFree /></PrivateRoute>} />
            <Route path="/progression" element={<PrivateRoute><Progression /></PrivateRoute>} />
            <Route path="/createProgression" element={<PrivateRoute><CreateProgression /></PrivateRoute>} />
            <Route path="/dailyRegister" element={<PrivateRoute><DailyRegister /></PrivateRoute>} />
            <Route path="/coach" element={<PrivateRoute><CoachDashboard /></PrivateRoute>} />
            <Route path="/coach/search" element={<PrivateRoute><CoachSearch /></PrivateRoute>} />
            <Route path="/coach/requests" element={<PrivateRoute><CoachRequests /></PrivateRoute>} />

            <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/routines1" element={<Routines1 />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
            </Route>
          </Routes>
        </RoutineProvider>
        </CoachProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;