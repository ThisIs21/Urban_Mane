import React, { useState } from 'react';
import './LoginPage.css';

const LoginPage = () => {
  const [passwordShown, setPasswordShown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      setTimeout(() => {
        setIsSubmitted(false);
      }, 2000);
    }, 1500);
  };

  return (
    <>
      {/* Background */}
      <div className="bg-pattern">
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
      </div>

      {/* Main Container */}
      <main className="relative z-10 min-h-screen flex items-center justify-center p-4 lg:p-0">
        <div className="w-full max-w-5xl flex flex-col lg:flex-row min-h-[700px] lg:min-h-[600px]">
          
          {/* Left Side - Branding */}
          <div className="image-side hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-zinc-900 to-black items-center justify-center">
            <div className="relative z-10 text-center p-12 animate-slide-in-left">
              {/* Logo Icon */}
              <div className="mb-8">
                <svg className="w-20 h-20 mx-auto" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="40" cy="40" r="38" stroke="url(#goldGradient)" strokeWidth="2"/>
                  <path d="M25 55L40 25L55 55" stroke="url(#goldGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M30 48H50" stroke="url(#goldGradient)" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="40" cy="40" r="4" fill="#d4af37"/>
                  <defs>
                    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f4e4a6"/>
                      <stop offset="50%" stopColor="#d4af37"/>
                      <stop offset="100%" stopColor="#a88c2a"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              
              <h1 className="font-display text-5xl font-bold text-white mb-4 tracking-wide">
                URBAN MANE
              </h1>
              
              <div className="decorative-line mx-auto mb-6"></div>
              
              <p className="text-lg text-gray-400 font-light tracking-widest uppercase">
                Premium Barbershop Experience
              </p>
              
              <p className="mt-8 text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
                Where classic craftsmanship meets contemporary style. Your signature look awaits.
              </p>
              
              {/* Decorative Elements */}
              <div className="mt-12 flex items-center justify-center gap-4">
                <span className="w-2 h-2 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full"></span>
                <span className="text-xs text-gray-500 tracking-widest uppercase">Est. 2024</span>
                <span className="w-2 h-2 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full"></span>
              </div>
            </div>
            
            {/* Bottom Accent */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-600/30 to-transparent"></div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
            <div className="login-card relative w-full max-w-md rounded-2xl p-8 lg:p-10">
              
              {/* Mobile Logo */}
              <div className="lg:hidden text-center mb-8 animate-fade-in-up delay-1">
                <div className="logo-container inline-block">
                  <svg className="w-12 h-12 mx-auto mb-3" viewBox="0 0 80 80" fill="none">
                    <circle cx="40" cy="40" r="38" stroke="#d4af37" strokeWidth="2"/>
                    <path d="M25 55L40 25L55 55" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M30 48H50" stroke="#d4af37" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="40" cy="40" r="4" fill="#d4af37"/>
                  </svg>
                  <h2 className="font-display text-2xl font-bold tracking-wide">URBAN MANE</h2>
                </div>
              </div>

              {/* Header */}
              <div className="text-center mb-8 animate-fade-in-up delay-2">
                <h2 className="font-display text-3xl font-semibold text-white mb-2">Welcome Back</h2>
                <p className="text-gray-500 text-sm">Sign in to continue your premium experience</p>
              </div>

              {/* Form */}
              <form id="loginForm" className="space-y-5" onSubmit={handleSubmit}>
                {/* Email */}
                <div className="animate-fade-in-up delay-3">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      id="email" 
                      name="email"
                      className="input-field w-full px-4 py-3.5 rounded-lg text-white pl-12"
                      placeholder="your@email.com"
                      required
                      aria-label="Email address"
                    />
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </div>
                </div>

                {/* Password */}
                <div className="animate-fade-in-up delay-4">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                  <div className="relative">
                    <input 
                      type={passwordShown ? "text" : "password"}
                      id="password" 
                      name="password"
                      className="input-field w-full px-4 py-3.5 rounded-lg text-white pl-12 pr-12"
                      placeholder="Enter your password"
                      required
                      aria-label="Password"
                    />
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                    <button type="button" className="password-toggle" id="togglePassword" aria-label="Toggle password visibility" onClick={togglePasswordVisibility}>
                        <svg className="w-5 h-5" id="eyeIcon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {passwordShown ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                            ) : (
                                <>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                </>
                            )}
                        </svg>
                    </button>
                  </div>
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between animate-fade-in-up delay-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="custom-checkbox" id="remember" name="remember"/>
                    <span className="text-sm text-gray-400">Remember me</span>
                  </label>
                  <a href="#" className="link-hover text-sm">Forgot password?</a>
                </div>

                {/* Submit Button */}
                <div className="animate-fade-in-up delay-6 pt-2">
                  <button 
                    type="submit" 
                    className="btn-primary w-full py-4 rounded-lg text-sm tracking-wider uppercase font-semibold"
                    disabled={isSubmitting || isSubmitted}
                  >
                    {isSubmitting ? (
                      <svg className="animate-spin h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : isSubmitted ? (
                      <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    ) : (
                      'Sign In'
                    )}
                  </button>
                </div>
              </form>

              {/* Divider */}
              <div className="divider my-8 animate-fade-in-up delay-6">
                <span className="text-xs text-gray-500 uppercase tracking-wider">or continue with</span>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-4 animate-fade-in-up delay-7">
                <button className="social-btn flex items-center justify-center gap-2 py-3 rounded-lg" aria-label="Continue with Google">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"/>
                    <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"/>
                    <path fill="#4A90E2" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"/>
                    <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"/>
                  </svg>
                  <span className="text-sm text-gray-300">Google</span>
                </button>
                <button className="social-btn flex items-center justify-center gap-2 py-3 rounded-lg" aria-label="Continue with Apple">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <span className="text-sm text-gray-300">Apple</span>
                </button>
              </div>

              {/* Sign Up Link */}
              <p className="text-center mt-8 text-sm text-gray-500 animate-fade-in-up delay-7">
                Don't have an account? 
                <a href="#" className="link-hover font-medium">Create one</a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default LoginPage;
