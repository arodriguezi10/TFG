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
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoutes";
import Routines1 from "./pages/Routines1";
import EditRoutine from "./pages/EditRoutine";
import ExecuteRoutine from "./pages/ExecuteRoutine";
import WorkoutSumary from "./pages/WorkoutSumary";
import Routines2 from "./pages/Routines2";
import Routines3 from "./pages/Routines3";
import Routines4 from "./pages/Routines4";
import CreateRoutines1 from "./pages/CreateRoutines1";
import CreateRoutines2 from "./pages/CreateRoutines2";
import CreateRoutines3 from "./pages/CreateRoutines3";
import ExerciseSearchElite from "./pages/ExerciseSearchElite";
import ExerciseSearchPro from "./pages/ExerciseSearchPro";
import ExerciseSearchFree from "./pages/ExerciseSearchFree";
import CreatePersonalExercise from "./pages/CreatePersonalExercise";
import ConfigExerciseFree from "./pages/ConfigExerciseFree";
import ConfigExercisePro from "./pages/ConfigExercisePro";
import ConfigExerciseElite from "./pages/ConfigExerciseElite";
import Subscription from "./pages/Subscription";
import Onboarding from "./pages/Onboarding";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RoutineProvider>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />

            <Route path="/forgotPassword" element={<ForgotPassword />} />

            <Route path="/resetPassword" element={<ResetPassword />} />

            <Route 
              path="/onboarding" 
              element={
                <PrivateRoute>
                  <Onboarding />
                </PrivateRoute>
              } 
            />

            <Route 
              path="/profile" 
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } 
            />

            <Route 
              path="/personalSettings" 
              element={
                <PrivateRoute>
                  <PersonalSettings />
                </PrivateRoute>
              } 
            />

            <Route 
              path="/subscription" 
              element={
                <PrivateRoute>
                  <Subscription />
                </PrivateRoute>
              } 
            />

            <Route 
              path="/checkout" 
              element={
                <PrivateRoute>
                  <Checkout />
                </PrivateRoute>
              } 
            />

            <Route 
              path="/paymentConfirmation" 
              element={
                <PrivateRoute>
                  <PaymentConfirmation />
                </PrivateRoute>
              } 
            />

            <Route 
              path="/editRoutine/:id" 
              element={
                <PrivateRoute>
                  <EditRoutine />
                </PrivateRoute>
              } 
            />

            <Route 
              path="/routines2" 
              element={
                <PrivateRoute>
                  <Routines2 />
                </PrivateRoute>
              } 
            />

            <Route 
              path="/executeRoutine/:id" 
              element={
                <PrivateRoute>
                  <ExecuteRoutine />
                </PrivateRoute>
              } 
            />

            <Route 
              path="/WorkoutSumary" 
              element={
                <PrivateRoute>
                  <WorkoutSumary />
                </PrivateRoute>
              } 
            />

            <Route 
              path="/routines3" 
              element={
                <PrivateRoute>
                  <Routines3 />
                </PrivateRoute>
              } 
            />

            <Route 
              path="/routines4" 
              element={
                <PrivateRoute>
                  <Routines4 />
                </PrivateRoute>
              } 
            />

            <Route 
              path="/createRoutines1" 
              element={
                <PrivateRoute>
                  <CreateRoutines1 />
                </PrivateRoute>
              } 
            />

            <Route 
              path="/createRoutines2" 
              element={
                <PrivateRoute>
                  <CreateRoutines2 />
                </PrivateRoute>
              } 
            />

            <Route 
              path="/createRoutines3" 
              element={
                <PrivateRoute>
                  <CreateRoutines3 />
                </PrivateRoute>
              } 
            />

            <Route 
              path="/exerciseSearchElite" 
              element={
                <PrivateRoute>
                  <ExerciseSearchElite />
                </PrivateRoute>
              } 
            />

            <Route 
              path="/exerciseSearchPro" 
              element={
                <PrivateRoute>
                  <ExerciseSearchPro />
                </PrivateRoute>
              } 
            />

            <Route 
              path="/exerciseSearchFree" 
              element={
                <PrivateRoute>
                  <ExerciseSearchFree />
                </PrivateRoute>
              } 
            />

            <Route 
              path="/createPersonalExercise" 
              element={
                <PrivateRoute>
                  <CreatePersonalExercise />
                </PrivateRoute>
              } 
            />

            <Route 
              path="/configExerciseFree" 
              element={
                <PrivateRoute>
                  <ConfigExerciseFree />
                </PrivateRoute>
              } 
            />

            <Route 
              path="/configExercisePro" 
              element={
                <PrivateRoute>
                  <ConfigExercisePro />
                </PrivateRoute>
              } 
            />

            <Route 
              path="/configExerciseElite" 
              element={
                <PrivateRoute>
                  <ConfigExerciseElite />
                </PrivateRoute>
              } 
            />

            <Route
              element={
                <PrivateRoute>
                  <MainLayout />
                </PrivateRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/routines1" element={<Routines1 />} />
              <Route path="/" element={<Home />} />
            </Route>
          </Routes>
        </RoutineProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;