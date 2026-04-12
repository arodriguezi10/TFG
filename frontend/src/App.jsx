import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Checkout from "./pages/Checkout";
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


const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/routines1" element={<Routines1 />} />
          
          <Route path="/routines2" element={<Routines2 />} />

          <Route path="/routines3" element={<Routines3 />} />
          
          <Route path="/createRoutines1" element={<CreateRoutines1 />} />

          <Route path="/createRoutines2" element={<CreateRoutines2 />} />

          <Route path="/createRoutines3" element={<CreateRoutines3 />} />

          <Route path="/exerciseSearchElite" element={<ExerciseSearchElite />} />

          <Route path="/ExerciseSearchPro" element={<ExerciseSearchPro />} />

          <Route path="/ExerciseSearchFree" element={<ExerciseSearchFree />} />

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
            <Route path="/checkout" element={<Checkout />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
