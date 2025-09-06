import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";
import { User } from "lucide-react"; 


const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const isActiveLink = (href) => {
    return location.pathname === href;
  };

  // Logout moved to Settings → Logout

  const getUserInitials = () => {
    if (user?.name) {
      // Google display name
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    if (user?.user_metadata?.FirstName && user?.user_metadata?.LastName) {
      return `${user.user_metadata.FirstName[0]}${user.user_metadata.LastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    if (user?.Email) {
      return user.Email[0].toUpperCase();
    }
    return "U";
  };

  return (
    <header className="bg-neutral-950/80 backdrop-blur border-b border-neutral-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-semibold tracking-tight text-white">
          <img src="./vlms_logo.png" alt="Logo" className="h-7 w-7" />
          <span className="hidden sm:inline">VLMS</span>
        </Link>
        {/* User Section */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setAvatarOpen((v) => !v)}
                className="focus:outline-none flex items-center gap-2 px-3 py-2 rounded-full bg-neutral-800 hover:bg-neutral-700 transition-colors"
                aria-label="User menu"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-sm text-white font-bold">{getUserInitials()}</span>
                </div>
                <span className="hidden sm:block text-white text-sm">
                  {user?.name || user?.user_metadata?.FirstName || 'User'}
                </span>
              </button>
              {avatarOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-neutral-900 text-white rounded-lg shadow-lg py-2 z-50 border border-neutral-700">
                  <div className="px-4 py-2 border-b border-neutral-700">
                    <p className="text-sm font-medium">{user?.name || `${user?.user_metadata?.FirstName || ''} ${user?.user_metadata?.LastName || ''}`.trim() || 'User'}</p>
                    <p className="text-xs text-neutral-400">{user?.email || user?.Email}</p>
                  </div>
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-800 transition-colors"
                    onClick={() => setAvatarOpen(false)}
                  >
                    <User size={16} />
                    Profile
                  </Link>
                  <Link 
                    to="/settings" 
                    className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-800 transition-colors"
                    onClick={() => setAvatarOpen(false)}
                  >
                    Settings
                  </Link>
                  {/* Logout action moved into Settings */}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-neutral-300 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
        {/* Hamburger Menu for Mobile */}
        <button
          className="md:hidden ml-2 focus:outline-none flex items-center justify-center w-9 h-9 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className="text-2xl">{menuOpen ? "×" : "≡"}</span>
        </button>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="md:hidden bg-neutral-950/95 px-4 pb-4 flex flex-col gap-2 border-t border-neutral-800">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`transition-colors px-2 py-2 rounded ${
                isActiveLink(link.href)
                  ? "text-white bg-neutral-800"
                  : "text-neutral-300 hover:text-white"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="text-neutral-300 hover:text-white transition-colors px-2 py-2 rounded">Profile</Link>
              <Link to="/settings" className="text-neutral-300 hover:text-white transition-colors px-2 py-2 rounded">Settings</Link>
              {/* Logout action moved into Settings */}
            </>
          ) : (
            <>
              <Link to="/login" className="text-neutral-300 hover:text-white transition-colors px-2 py-2 rounded">Login</Link>
              <Link to="/register" className="text-blue-400 hover:text-blue-300 transition-colors px-2 py-2 rounded">Sign Up</Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;


