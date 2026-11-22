import { useState } from 'react';
import { authApi } from '../services/api.js';

export default function AuthView({ onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      let res;
      if (mode === 'signup') {
        res = await authApi.signup({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
      } else {
        res = await authApi.login({
          email: formData.email,
          password: formData.password,
        });
      }

      if (res.token && res.user) {
        localStorage.setItem('lead_manager_token', res.token);
        onAuthSuccess(res.user);
      }
    } catch (err) {
      if (err.errors) {
        setErrors(err.errors);
      } else {
        setErrors({ general: err.message || 'Authentication failed' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* App Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900 text-white font-bold text-lg mb-3 shadow-xs">
            L
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Lead Manager
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {mode === 'login'
              ? 'Sign in to access your sales leads'
              : 'Create an account to start tracking leads'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
          {/* Mode Switch Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-lg mb-6 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrors({});
              }}
              className={`flex-1 py-1.5 rounded-md transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrors({});
              }}
              className={`flex-1 py-1.5 rounded-md transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Create Account
            </button>
          </div>

          {errors.general && (
            <div className="p-3 mb-4 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Sales Representative"
                  className={`w-full px-3 py-2 text-sm rounded-lg border outline-hidden transition-all ${
                    errors.name
                      ? 'border-rose-300 focus:border-rose-500 bg-rose-50/30'
                      : 'border-slate-200 focus:border-slate-900 bg-white'
                  }`}
                />
                {errors.name && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="sales@merutech.com"
                className={`w-full px-3 py-2 text-sm rounded-lg border outline-hidden transition-all ${
                  errors.email
                    ? 'border-rose-300 focus:border-rose-500 bg-rose-50/30'
                    : 'border-slate-200 focus:border-slate-900 bg-white'
                }`}
              />
              {errors.email && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="At least 6 characters"
                className={`w-full px-3 py-2 text-sm rounded-lg border outline-hidden transition-all ${
                  errors.password
                    ? 'border-rose-300 focus:border-rose-500 bg-rose-50/30'
                    : 'border-slate-200 focus:border-slate-900 bg-white'
                }`}
              />
              {errors.password && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-medium text-xs rounded-lg shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span>Loading...</span>
              ) : (
                <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Meru Technosoft Pvt. Ltd. — Screening Assignment
        </p>
      </div>
    </div>
  );
}
