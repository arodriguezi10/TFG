import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import MainLayout from "./layouts/MainLayout";
import Profile from "./pages/Profile";
import PersonalSettings from "./pages/PersonalSettings";
import Checkout from "./pages/Checkout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoutes";
import Routines1 from "./pages/Routines1";
import Routines2 from "./pages/Routines2";
import Routines3 from "./pages/Routines3";
import Routines4 from "./pages/Routines4";
import CreateRoutines1 from "./pages/CreateRoutines1";
import CreateRoutines2 from "./pages/CreateRoutines2";
import CreateRoutines3 from "./pages/CreateRoutines3";
import ExerciseSearchElite from "./pages/ExerciseSearchElite";
import ExerciseSearchPro from "./pages/ExerciseSearchPro";
import ExerciseSearchFree from "./pages/ExerciseSearchFree";
import ConfigExerciseFree from "./pages/ConfigExerciseFree";
import ConfigExercisePro from "./pages/ConfigExercisePro";
import ConfigExerciseElite from "./pages/ConfigExerciseElite";
import Suscription from "./pages/Suscription";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/forgotPassword" element={<ForgotPassword />} />

          <Route path="/resetPassword" element={<ResetPassword />} />

          <Route path="/profile" element={<Profile />} />

          <Route path="/personalSettings" element={<PersonalSettings />} />

          <Route path="/suscription" element={<Suscription />} />

          <Route path="/checkout" element={<Checkout />} />

          <Route path="/routines1" element={<Routines1 />} />

          <Route path="/routines2" element={<Routines2 />} />

          <Route path="/routines3" element={<Routines3 />} />

          <Route path="/createRoutines1" element={<CreateRoutines1 />} />

          <Route path="/createRoutines2" element={<CreateRoutines2 />} />

          <Route path="/createRoutines3" element={<CreateRoutines3 />} />

          <Route
            path="/exerciseSearchElite"
            element={<ExerciseSearchElite />}
          />

          <Route path="/exerciseSearchPro" element={<ExerciseSearchPro />} />

          <Route path="/exerciseSearchFree" element={<ExerciseSearchFree />} />

          <Route path="/configExerciseFree" element={<ConfigExerciseFree />} />

          <Route path="/configExercisePro" element={<ConfigExercisePro />} />

          <Route
            path="/ConfigExerciseElite"
            element={<ConfigExerciseElite />}
          />

          <Route
            element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/routines4" element={<Routines4 />} />
            <Route path="/" element={<Home />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
