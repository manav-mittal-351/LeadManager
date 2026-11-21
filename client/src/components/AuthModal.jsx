import { useState } from 'react';
import { X, Lock, Mail, User, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function AuthModal({ isOpen, onClose, initialTab = 'login' }) {
  const [tab, setTab] = useState(initialTab);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register, demoLogin } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (tab === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setError('');
    setLoading(true);
    try {
      await demoLogin();
      onClose();
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {tab === 'login' ? 'Welcome Back' : 'Create an Account'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-lg bg-slate-100 p-1 mb-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setError('');
            }}
            className={`flex-1 py-1.5 rounded-md transition-all cursor-pointer ${
              tab === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setError('');
            }}
            className={`flex-1 py-1.5 rounded-md transition-all cursor-pointer ${
              tab === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="p-2.5 mb-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {tab === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sales Representative"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sales@merutech.com"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs rounded-lg shadow-sm shadow-indigo-200 transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>{tab === 'login' ? 'Sign In to Account' : 'Create Free Account'}</span>
            )}
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleDemo}
            disabled={loading}
            className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 text-indigo-700 font-semibold text-xs rounded-lg border border-indigo-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Demo Login (1-Click)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
