import React from 'react';
import { Button } from './ui/button';

type Page = 'home' | 'login' | 'signup' | 'create' | 'admin';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isLoggedIn: boolean;
  isAdmin: boolean;
  onLogout: () => void;
}

export function Navbar({ currentPage, onNavigate, isLoggedIn, isAdmin, onLogout }: NavbarProps) {
  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={() => onNavigate('home')}
              className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              TrueVoice
            </button>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => onNavigate('home')}
              className={`hover:text-indigo-600 transition-colors ${
                currentPage === 'home' ? 'text-indigo-600' : 'text-gray-700'
              }`}
            >
              Home
            </button>
            
            {isLoggedIn && (
              <button
                onClick={() => onNavigate('create')}
                className={`hover:text-indigo-600 transition-colors ${
                  currentPage === 'create' ? 'text-indigo-600' : 'text-gray-700'
                }`}
              >
                Create Blog
              </button>
            )}
            
            {isAdmin && (
              <button
                onClick={() => onNavigate('admin')}
                className={`hover:text-indigo-600 transition-colors ${
                  currentPage === 'admin' ? 'text-indigo-600' : 'text-gray-700'
                }`}
              >
                Admin
              </button>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <Button
                onClick={onLogout}
                variant="outline"
                className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
              >
                Logout
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => onNavigate('login')}
                  variant="ghost"
                  className="text-gray-700 hover:text-indigo-600"
                >
                  Login
                </Button>
                <Button
                  onClick={() => onNavigate('signup')}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => onNavigate('home')}
              className={`text-sm hover:text-indigo-600 transition-colors ${
                currentPage === 'home' ? 'text-indigo-600' : 'text-gray-700'
              }`}
            >
              Home
            </button>
            
            {isLoggedIn && (
              <button
                onClick={() => onNavigate('create')}
                className={`text-sm hover:text-indigo-600 transition-colors ${
                  currentPage === 'create' ? 'text-indigo-600' : 'text-gray-700'
                }`}
              >
                Create Blog
              </button>
            )}
            
            {isAdmin && (
              <button
                onClick={() => onNavigate('admin')}
                className={`text-sm hover:text-indigo-600 transition-colors ${
                  currentPage === 'admin' ? 'text-indigo-600' : 'text-gray-700'
                }`}
              >
                Admin
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}