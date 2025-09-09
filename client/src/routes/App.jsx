import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from '../context/AuthContext.jsx';
import Home from '../pages/user/Home';
import Login from '../pages/user/Login';
import Register from '../pages/user/Register';
import Profile from '../pages/user/Profile';
import Settings from '../pages/user/Settings';
import Watchlist from '../pages/user/Watchlist';
import VideoDetail from '../pages/user/VideoDetail';
import AdminRoute from '../components/AdminRoute.jsx';
import AdminDashboard from '../pages/admin/Dashboard.jsx';
import AdminUsers from '../pages/admin/Users.jsx';
import AdminVideos from '../pages/admin/Videos.jsx';
import AdminSettings from '../pages/admin/Settings.jsx';
import AdminLogin from '../pages/admin/Login.jsx';
import NotAuthorized from '../pages/NotAuthorized.jsx';

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
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/video/:id" element={<VideoDetail />} />
          <Route path="/not-authorized" element={<NotAuthorized />} />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/videos"
            element={
              <AdminRoute>
                <AdminVideos />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <AdminRoute>
                <AdminSettings />
              </AdminRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}