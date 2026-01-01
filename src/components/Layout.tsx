import { Link, useLocation } from 'react-router-dom';
import { Home, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

function MatchIcon() {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className="w-6 h-6"
    >
      <rect x="4" y="8" width="20" height="24" rx="2" fill="url(#gradient1)" />
      <rect x="8" y="6" width="20" height="24" rx="2" fill="url(#gradient2)" />
      <rect x="12" y="4" width="20" height="24" rx="2" fill="url(#gradient3)" />
      <defs>
        <linearGradient id="gradient1" x1="4" y1="8" x2="24" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f97316" />
          <stop offset="1" stopColor="#ea580c" />
        </linearGradient>
        <linearGradient id="gradient2" x1="8" y1="6" x2="28" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ea580c" />
          <stop offset="1" stopColor="#dc2626" />
        </linearGradient>
        <linearGradient id="gradient3" x1="12" y1="4" x2="32" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#dc2626" />
          <stop offset="1" stopColor="#b91c1c" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center group-hover:bg-slate-50 transition-colors shadow-sm border border-slate-200">
                <MatchIcon />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                The Match Guy
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              {!isAuthPage && isAuthenticated && (
                <>
                  {!isHome && (
                    <Link
                      to="/"
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    >
                      <Home className="w-4 h-4" />
                      <span className="text-sm font-medium">Decks</span>
                    </Link>
                  )}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-600 hidden sm:block">{user?.email}</span>
                    <button
                      onClick={logout}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
