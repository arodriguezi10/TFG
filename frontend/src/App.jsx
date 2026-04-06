import React from "react";
import { BrowserRouter, Routes, Route} from "react-router-dom";

import {AuthProvider } from "./context/AuthContext"

 
import Login from "./pages/Login";
import Register from "./pages/Register";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Checkout from "./pages/Checkout";
import PrivateRoute from "./components/PrivateRoutes";


const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/checkout" element={<Checkout />} />
          </Route>
           
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
