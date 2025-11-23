'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8201/api';

const testAccounts = [
  { name: 'Backend Developer', email: 'backend@gauss.com', password: 'backend123', role: 'backend' },
  { name: 'Frontend Developer', email: 'frontend@gauss.com', password: 'frontend123', role: 'frontend' },
  { name: 'QA Engineer', email: 'qa@gauss.com', password: 'qa123', role: 'qa' },
  { name: 'UI/UX Designer', email: 'designer@gauss.com', password: 'designer123', role: 'designer' },
  { name: 'Project Manager', email: 'manager@gauss.com', password: 'manager123', role: 'manager' },
  { name: 'DevOps Engineer', email: 'devops@gauss.com', password: 'devops123', role: 'devops' },
  { name: 'Product Owner', email: 'product@gauss.com', password: 'product123', role: 'product' },
  { name: 'Admin', email: 'admin@gauss.com', password: 'admin123', role: 'admin' },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTestAccounts, setShowTestAccounts] = useState(false);

  // Signup state
  const [showSignup, setShowSignup] = useState(false);
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Store user data and token in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const fillTestAccount = (account: typeof testAccounts[0]) => {
    setEmail(account.email);
    setPassword(account.password);
    setShowTestAccounts(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupLoading(true);
    setSignupError('');

    // Validation
    if (signupData.password !== signupData.confirmPassword) {
      setSignupError('Passwords do not match');
      setSignupLoading(false);
      return;
    }

    if (signupData.password.length < 6) {
      setSignupError('Password must be at least 6 characters');
      setSignupLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: signupData.name,
          email: signupData.email,
          password: signupData.password,
          role: signupData.role,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Store user data and token, then redirect to dashboard
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        router.push('/dashboard');
        return;

        // Old code (kept as comment):
        // alert('Account created successfully! You can now log in.');
        // setShowSignup(false);
        // setEmail(signupData.email);
        setSignupData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'user',
        });
      } else {
        setSignupError(data.message || 'Registration failed');
      }
    } catch (err) {
      setSignupError('Failed to connect to server');
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Animated Background Tools */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Tool Icons */}
        <div className="floating-icon" style={{ left: '10%', animationDelay: '0s', animationDuration: '20s' }}>
          <div className="tool-icon">
            <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
            <span className="text-white text-xs font-mono">Git</span>
          </div>
        </div>

        <div className="floating-icon" style={{ left: '75%', top: '60%', animationDelay: '2s', animationDuration: '25s' }}>
          <div className="tool-icon">
            <svg className="w-16 h-16" viewBox="0 0 24 24" fill="white">
              <path d="M0 12v12h24V0H0v12zm19.54-.92c0 .42-.02.82-.05 1.17-.04.35-.1.66-.18.94-.07.27-.17.49-.28.67-.11.18-.25.31-.41.38-.17.07-.36.1-.58.1-.19 0-.36-.03-.51-.08a1.1 1.1 0 0 1-.38-.23c-.11-.1-.2-.22-.27-.36a2.3 2.3 0 0 1-.18-.49 3.6 3.6 0 0 1-.1-.6c-.02-.22-.03-.45-.03-.7V8.2c0-.23.01-.46.03-.67.02-.21.06-.4.11-.57.05-.17.12-.32.2-.45.09-.13.19-.23.32-.3.12-.08.27-.12.44-.12.2 0 .37.04.53.12.15.08.28.19.38.34.1.14.18.31.24.51.06.19.1.4.13.63.02.23.04.47.04.73v3.78zm-4.28 0c0 .36-.02.7-.05 1.02-.03.32-.09.6-.16.85-.08.25-.17.46-.29.64-.11.17-.25.3-.41.37-.16.07-.35.11-.56.11-.18 0-.35-.03-.49-.08a.94.94 0 0 1-.36-.23 1.3 1.3 0 0 1-.25-.35 2 2 0 0 1-.17-.47 3.3 3.3 0 0 1-.09-.58c-.02-.21-.03-.43-.03-.67V8.2c0-.22.01-.44.03-.64.02-.2.06-.38.11-.55.05-.16.11-.3.19-.43.08-.12.18-.22.3-.28.12-.07.26-.11.42-.11.19 0 .36.04.51.11.15.08.27.18.37.33.1.14.17.3.23.49.06.18.1.38.12.6.03.22.04.45.04.7v3.78z"/>
            </svg>
            <span className="text-white text-xs font-mono">VSCode</span>
          </div>
        </div>

        <div className="floating-icon" style={{ left: '20%', top: '70%', animationDelay: '4s', animationDuration: '22s' }}>
          <div className="tool-icon">
            <svg className="w-16 h-16" viewBox="0 0 24 24" fill="white">
              <path d="M23.834 8.101a13.912 13.912 0 0 1-13.643 11.72a10.105 10.105 0 0 1-1.994-.12a6.111 6.111 0 0 1-5.082-5.761a5.934 5.934 0 0 1 11.867-.084c.025.983-.401 1.846-1.277 1.871c-.936 0-1.374-.668-1.374-1.567v-2.5a1.531 1.531 0 0 0-1.52-1.533H8.715a3.648 3.648 0 1 0 2.695 6.08l.073-.11l.074.121a2.58 2.58 0 0 0 2.2 1.048a2.909 2.909 0 0 0 2.695-3.04a7.912 7.912 0 0 0-.217-1.933a7.404 7.404 0 0 0-14.64 1.603a7.497 7.497 0 0 0 7.308 7.405s.549.05 1.167.035a15.803 15.803 0 0 0 8.475-2.528c.036-.025.072.025.048.061a12.44 12.44 0 0 1-9.69 3.963a8.744 8.744 0 0 1-8.9-8.972a9.049 9.049 0 0 1 3.635-7.247a8.863 8.863 0 0 1 5.229-1.726h2.813a7.915 7.915 0 0 0 5.839-2.578a.11.11 0 0 1 .059-.034a.112.112 0 0 1 .12.053a.113.113 0 0 1 .015.067a7.934 7.934 0 0 1-1.227 3.549a.107.107 0 0 0-.014.06a.11.11 0 0 0 .073.095a.109.109 0 0 0 .062.004a8.505 8.505 0 0 0 5.913-4.876a.155.155 0 0 1 .055-.053a.15.15 0 0 1 .147 0a.153.153 0 0 1 .054.053A10.779 10.779 0 0 1 23.834 8.1zM8.895 11.628a2.188 2.188 0 1 0 2.188 2.188v-2.042a.158.158 0 0 0-.15-.15z"/>
            </svg>
            <span className="text-white text-xs font-mono">Cursor</span>
          </div>
        </div>

        <div className="floating-icon" style={{ left: '85%', top: '20%', animationDelay: '1s', animationDuration: '18s' }}>
          <div className="tool-icon">
            <svg className="w-16 h-16" viewBox="0 0 24 24" fill="white">
              <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.186.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.186.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.184-.186h-2.12a.186.186 0 00-.186.186v1.887c0 .102.084.185.186.185m0 2.715h2.119a.185.185 0 00.185-.185v-1.888a.185.185 0 00-.185-.185h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m15.12 0h2.119a.185.185 0 00.185-.185v-1.888a.185.185 0 00-.185-.185h-2.12a.185.185 0 00-.184.185v1.888c0 .102.084.185.185.185"/>
            </svg>
            <span className="text-white text-xs font-mono">Docker</span>
          </div>
        </div>

        <div className="floating-icon" style={{ left: '50%', top: '10%', animationDelay: '3s', animationDuration: '24s' }}>
          <div className="tool-icon">
            <svg className="w-16 h-16" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
            <span className="text-white text-xs font-mono">NPM</span>
          </div>
        </div>

        <div className="floating-icon" style={{ left: '30%', top: '30%', animationDelay: '5s', animationDuration: '21s' }}>
          <div className="tool-icon">
            <svg className="w-16 h-16" viewBox="0 0 24 24" fill="white">
              <path d="M21.59 11.59l-2.83-2.83-2.829 2.83 2.829 2.828 2.83-2.828zm-4.242-4.243L16 6l-4.592 4.592L8.59 7.772 6 10.362l6 6 9-9z"/>
            </svg>
            <span className="text-white text-xs font-mono">React</span>
          </div>
        </div>

        <div className="floating-icon" style={{ left: '65%', top: '45%', animationDelay: '2.5s', animationDuration: '19s' }}>
          <div className="tool-icon">
            <svg className="w-16 h-16" viewBox="0 0 24 24" fill="white">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span className="text-white text-xs font-mono">GitHub</span>
          </div>
        </div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Gauss
            </h1>
            <p className="text-gray-400 text-sm">Developer Tool Sharing Platform</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-400"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-400"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 text-indigo-600 border-gray-600 rounded focus:ring-indigo-500" />
                <span className="ml-2 text-gray-400">Remember me</span>
              </label>
              <a href="#" className="text-indigo-400 hover:text-indigo-300">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Test Accounts Dropdown */}
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setShowTestAccounts(!showTestAccounts)}
              className="w-full text-sm text-gray-400 hover:text-gray-300 flex items-center justify-center gap-2 py-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showTestAccounts ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
              </svg>
              {showTestAccounts ? 'Hide' : 'Show'} Test Accounts
            </button>

            {showTestAccounts && (
              <div className="mt-3 bg-gray-700 rounded-lg p-4 max-h-64 overflow-y-auto">
                <p className="text-xs text-gray-400 mb-3">Click an account to auto-fill the form:</p>
                <div className="space-y-2">
                  {testAccounts.map((account) => (
                    <button
                      key={account.email}
                      type="button"
                      onClick={() => fillTestAccount(account)}
                      className="w-full text-left p-3 bg-gray-800 hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-white">{account.name}</p>
                          <p className="text-xs text-gray-400 font-mono">{account.email}</p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded">
                          {account.role}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 font-mono">Password: {account.password}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => setShowSignup(true)}
              className="text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>

      {/* Signup Modal */}
      {showSignup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Create Account</h2>
              <button
                onClick={() => {
                  setShowSignup(false);
                  setSignupError('');
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSignup} className="space-y-4">
              {/* Error Message */}
              {signupError && (
                <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm">
                  {signupError}
                </div>
              )}

              {/* Name */}
              <div>
                <label htmlFor="signup-name" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  id="signup-name"
                  type="text"
                  required
                  value={signupData.name}
                  onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-400"
                  placeholder="John Doe"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  id="signup-email"
                  type="email"
                  required
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-400"
                  placeholder="your@email.com"
                />
              </div>

              {/* Role */}
              <div>
                <label htmlFor="signup-role" className="block text-sm font-medium text-gray-300 mb-2">
                  Role *
                </label>
                <select
                  id="signup-role"
                  value={signupData.role}
                  onChange={(e) => setSignupData({ ...signupData, role: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  <option value="user">User</option>
                  <option value="backend">Backend Developer</option>
                  <option value="frontend">Frontend Developer</option>
                  <option value="qa">QA Engineer</option>
                  <option value="designer">UI/UX Designer</option>
                  <option value="manager">Project Manager</option>
                  <option value="devops">DevOps Engineer</option>
                  <option value="product">Product Owner</option>
                </select>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="signup-password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password *
                </label>
                <input
                  id="signup-password"
                  type="password"
                  required
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-400"
                  placeholder="••••••••"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="signup-confirm-password" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password *
                </label>
                <input
                  id="signup-confirm-password"
                  type="password"
                  required
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-400"
                  placeholder="••••••••"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={signupLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {signupLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            {/* Login Link */}
            <p className="mt-4 text-center text-sm text-gray-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setShowSignup(false);
                  setSignupError('');
                }}
                className="text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        .floating-icon {
          position: absolute;
          animation: starfall linear infinite;
        }

        .tool-icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          opacity: 0.6;
          filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
        }

        @keyframes starfall {
          0% {
            transform: translate(-100vw, -100vh) scale(0.8) rotate(-10deg);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translate(100vw, 100vh) scale(1.2) rotate(10deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
