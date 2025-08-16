import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Browse", href: "/browse" },
  { name: "My List", href: "/my-list" },
  { name: "About", href: "/about" },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const location = useLocation();

  const isActiveLink = (href) => {
    return location.pathname === href;
  };

  return (
    <header className="bg-neutral-950/80 backdrop-blur border-b border-neutral-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-semibold tracking-tight text-white">
          <img src="/vite.svg" alt="Logo" className="h-7 w-7" />
          <span className="hidden sm:inline">VLMS</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`transition-colors px-2 py-1 rounded ${
                isActiveLink(link.href)
                  ? "text-white bg-neutral-800"
                  : "text-neutral-300 hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* User Avatar */}
        <div className="relative">
          <button
            onClick={() => setAvatarOpen((v) => !v)}
            className="focus:outline-none flex items-center justify-center w-9 h-9 rounded-full bg-neutral-800 hover:bg-neutral-700 transition-colors"
            aria-label="User menu"
          >
            <span className="text-lg text-white font-bold">U</span>
          </button>
          {avatarOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-neutral-900 text-white rounded-lg shadow-lg py-2 z-50 border border-neutral-700">
              <Link to="/profile" className="block px-4 py-2 hover:bg-neutral-800 transition-colors">Profile</Link>
              <Link to="/settings" className="block px-4 py-2 hover:bg-neutral-800 transition-colors">Settings</Link>
              <Link to="/login" className="block px-4 py-2 hover:bg-neutral-800 transition-colors">Logout</Link>
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
          <Link to="/profile" className="text-neutral-300 hover:text-white transition-colors px-2 py-2 rounded">Profile</Link>
          <Link to="/settings" className="text-neutral-300 hover:text-white transition-colors px-2 py-2 rounded">Settings</Link>
          <Link to="/login" className="text-neutral-300 hover:text-white transition-colors px-2 py-2 rounded">Logout</Link>
        </nav>
      )}
    </header>
  );
};

export default Header;


