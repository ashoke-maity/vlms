import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from '../context/AuthContext';
import Home from '../pages/user/Home';
import Login from '../pages/user/Login';
import Register from '../pages/user/Register';
import Profile from '../pages/user/Profile';
import Settings from '../pages/user/Settings';
import Browse from '../pages/user/Browse';
import MyList from '../pages/user/MyList';
import About from '../pages/user/About';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/my-list" element={<MyList />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}