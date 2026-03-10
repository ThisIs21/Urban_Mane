import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userRole = await login(email, password);
      
      // Redirect logic
      if (userRole === 'admin') navigate('/admin/dashboard');
      else if (userRole === 'owner') navigate('/owner/dashboard');
      else if (userRole === 'cashier') navigate('/cashier/dashboard');
      else if (userRole === 'barber') navigate('/barber/dashboard');
      else navigate('/');
    } catch (err) {
      console.error(err);
      setError('Email atau password salah.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans relative overflow-hidden"
         style={{ backgroundColor: 'var(--color-primary)' }}>
      
      {/* Background Decorative Orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full filter blur-3xl"
           style={{ backgroundColor: 'var(--color-gold)', opacity: 0.05 }}></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full filter blur-3xl"
           style={{ backgroundColor: 'var(--color-gold)', opacity: 0.05 }}></div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <svg className="w-16 h-16" viewBox="0 0 80 80" fill="none" style={{ color: 'var(--color-gold)' }}>
              <circle cx="40" cy="40" r="38" stroke="currentColor" strokeWidth="2"/>
              <path d="M25 55L40 25L55 55" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M30 48H50" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="40" cy="40" r="4" fill="currentColor"/>
            </svg>
          </div>
          <h1 className="text-4xl font-bold tracking-wide text-white" style={{ fontFamily: 'var(--font-display)' }}>URBAN MANE</h1>
          <p className="mt-2 text-sm tracking-widest uppercase" style={{ color: 'var(--color-muted)' }}>Management System</p>
        </div>

        {/* Card Form */}
        <div className="rounded-2xl shadow-2xl p-8 border"
             style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
          
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-white">Welcome Back</h2>
            <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>Please sign in to continue</p>
          </div>

          {error && (
            <div className="px-4 py-3 rounded-lg text-sm mb-4 text-center"
                 style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'var(--color-danger)', borderWidth: '1px', color: 'var(--color-danger)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email Input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-muted)' }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none transition-colors"
                style={{ backgroundColor: 'var(--color-primary)', border: '1px solid var(--color-border)' }}
                placeholder="admin@urbanmane.com"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-muted)' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none transition-colors"
                style={{ backgroundColor: 'var(--color-primary)', border: '1px solid var(--color-border)' }}
                placeholder="••••••••"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 shadow-lg"
              style={{ 
                color: 'black',
                backgroundColor: loading ? '#444' : 'var(--color-gold)',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-xs" style={{ color: 'var(--color-muted)' }}>
          © 2025 Urban Mane. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Login;