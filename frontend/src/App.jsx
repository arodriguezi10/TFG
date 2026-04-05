import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Checkout from "./pages/Checkout";


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/login" element={<Login/>}/>

        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;
