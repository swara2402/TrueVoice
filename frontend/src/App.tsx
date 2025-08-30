import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { LoginPage } from './components/LoginPage';
import { HomePage } from './components/HomePage';
import { CreateBlogPage } from './components/CreateBlogPage';
import { AdminDashboard } from './components/AdminDashboard';
import { Toaster } from './components/ui/sonner';

type Page = 'home' | 'login' | 'signup' | 'create' | 'admin';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = (username: string, isAdminUser: boolean = false) => {
    setIsLoggedIn(true);
    setIsAdmin(isAdminUser);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setCurrentPage('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
      case 'signup':
        return <LoginPage mode={currentPage} onLogin={handleLogin} onSwitchMode={(mode) => setCurrentPage(mode)} />;
      case 'create':
        return isLoggedIn ? <CreateBlogPage /> : <LoginPage mode="login" onLogin={handleLogin} onSwitchMode={(mode) => setCurrentPage(mode)} />;
      case 'admin':
        return isAdmin ? <AdminDashboard /> : <HomePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar 
        currentPage={currentPage} 
        onNavigate={setCurrentPage}
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        onLogout={handleLogout}
      />
      <main>
        {renderPage()}
      </main>
      <Toaster />
    </div>
  );
}