export default function Navbar({ user, onLogout }) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo & Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
              L
            </div>
            <div>
              <span className="font-semibold text-sm text-slate-900">
                Lead Manager
              </span>
            </div>
          </div>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-3">
            {user && (
              <span className="text-xs text-slate-500 hidden sm:inline">
                {user.name} ({user.email})
              </span>
            )}
            <button
              onClick={onLogout}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-2.5 py-1.5 rounded-md border border-slate-200 transition-colors cursor-pointer"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
