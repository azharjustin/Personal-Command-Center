import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import Logo from '../components/ui/Logo';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/');
    } catch {
      // error is set in store
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-surface-50 dark:bg-surface-950 transition-colors duration-300">
      <div className="auth-card">
        {/* Logo & Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <Logo size="lg" className="mb-4" />
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight gradient-text">COMMAND CENTER</h1>
          <p className="text-sm font-medium text-surface-500 dark:text-surface-400 mt-1.5">
            Sign in to your productivity dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium text-center animate-shake">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="block text-sm font-semibold text-surface-700 dark:text-surface-300">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="custom-auth-input"
              placeholder="you@example.com"
              required
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-semibold text-surface-700 dark:text-surface-300">
                Password
              </label>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="custom-auth-input has-icon"
                placeholder="••••••••"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 p-1.5 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-1">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 sm:h-12 px-5 rounded-xl bg-gradient-to-r from-accent-600 to-purple-600 hover:from-accent-500 hover:to-purple-500 disabled:opacity-50 text-white font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-200 transform active:scale-[0.99] cursor-pointer flex items-center justify-center"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>

            <button
              type="button"
              onClick={() => {
                setEmail('test@example.com');
                setPassword('password123');
              }}
              className="w-full h-10 sm:h-11 px-4 rounded-xl border border-surface-200 dark:border-surface-700/80 hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-600 dark:text-surface-300 font-medium text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-center"
            >
              ⚡ Fill Demo Credentials
            </button>
          </div>

          <p className="text-center text-sm text-surface-500 dark:text-surface-400 pt-1">
            Don't have an account?{' '}
            <Link to="/register" className="text-accent-500 hover:text-accent-400 font-semibold underline-offset-4 hover:underline transition-colors">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
