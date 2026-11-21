import { Users, LogIn, LogOut, UserCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar({ onOpenAuthModal }) {
  const { user, isAuthenticated, logout, demoLogin } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">Lead Manager</span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Sales CRM
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Meru Technosoft Screening Assignment</p>
            </div>
          </div>

          {/* Right Section: Auth & Demo */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-sm font-semibold text-slate-800">{user.name}</span>
                  <span className="text-xs text-slate-500">{user.email}</span>
                </div>
                <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm border border-indigo-200">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-slate-200"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={demoLogin}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors shadow-xs"
                  title="Quick 1-click Demo Login"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Demo Login</span>
                </button>
                <button
                  onClick={() => onOpenAuthModal('login')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
