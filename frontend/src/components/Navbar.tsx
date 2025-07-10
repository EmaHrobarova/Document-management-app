import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = authService.isAuthenticated();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  // template from https://flowbite.com/docs/components/navbar/
  return (
      <nav className="bg-blue-500 text-white hover:text-blue-100 border-b border-blue-100 shadow-md rounded-2xl font-sans">
        <div className="flex flex-wrap items-center justify-between p-4">
            <div className="flex items-center space-x-6">
              <span className="self-center text-2xl font-extrabold drop-shadow-sm">
                Document App
              </span>
                {isLoggedIn && (
                    <span className="text-blue-100 text-lg font-bold">
                  Hi, {user?.name}
                </span>
                )}
            </div>
        <button
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="sr-only">Open main menu</span>
          <svg className="w-5 h-5" aria-hidden="true" fill="none" viewBox="0 0 17 14">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div className={`${menuOpen ? '' : 'hidden'} w-full md:block md:w-auto`} id="navbar-default">
          <ul className="flex flex-col md:flex-row md:space-x-6 p-4 md:p-0 mt-4 md:mt-0">
            <li>
              <Link
                to="/documents"
                className="block py-2 px-6 text-xl font-bold hover:text-blue-100 transition"
              >
                Documents
              </Link>
            </li>
            {isLoggedIn && (
              <>
                <li>
                  <Link
                    to="/documents/upload"
                    className="block py-2 px-6 text-xl font-bold hover:text-blue-100 transition"
                  >
                    Upload Document
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="block py-2 px-6 text-xl font-bold hover:text-blue-100 transition border-none focus:outline-none focus:ring-0"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
            {!isLoggedIn && (
              <>
                <li>
                  <Link
                    to="/login"
                    className="block py-2 px-6 text-blue-500 text-lg font-bold hover:text-blue-800 transition"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="block py-2 px-6 text-blue-500 text-lg font-bold hover:text-blue-800 transition"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;