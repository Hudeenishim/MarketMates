import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Store, ShoppingBag, Eye, EyeOff, Motorbike } from 'lucide-react';
import { Logo } from '../components/Logo';

export const LoginView: React.FC = () => {
  const { user, profile, loading, setProfileRole } = useAuth();
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [roleSelection, setRoleSelection] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && profile) {
      navigate(profile.role === 'vendor' ? '/vendor' : '/buyer');
    } else if (user && !profile && !loading) {
      setRoleSelection(true);
    }
  }, [user, profile, loading, navigate]);

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      await signInWithPopup(auth, googleAuthProvider);
    } catch (err: any) {
      setError(err.message || 'Failed to login with Google.');
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      
      const cleanIdentifier = identifier.trim();
      if (!cleanIdentifier) {
        throw new Error('Email or Username is required.');
      }
      if (!password) {
        throw new Error('Password is required.');
      }
      if (isSignUp && password.length < 6) {
        throw new Error('Password must be at least 6 characters.');
      }
      if (!cleanIdentifier.includes('@') && cleanIdentifier.includes(' ')) {
        throw new Error('Username cannot contain spaces.');
      }

      const authEmail = cleanIdentifier.includes('@') 
        ? cleanIdentifier 
        : `${cleanIdentifier.toLowerCase()}@marketmates.local`;
        
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, authEmail, password);
      } else {
        await signInWithEmailAndPassword(auth, authEmail, password);
      }
    } catch (err: any) {
      let friendlyError = err.message || 'Authentication failed.';
      
      if (err.code === 'auth/email-already-in-use') {
        friendlyError = 'This username or email is already taken.';
      } else if (err.code === 'auth/invalid-email') {
        friendlyError = 'Please enter a valid email or username.';
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        friendlyError = 'Incorrect username/email or password.';
      } else if (err.code === 'auth/weak-password') {
        friendlyError = 'Password is too weak. Please use at least 6 characters.';
      } else if (err.code === 'auth/network-request-failed') {
        friendlyError = 'Network error. Please check your connection and try again.';
      }
      
      setError(friendlyError);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      const cleanIdentifier = identifier.trim();
      if (!cleanIdentifier) {
        throw new Error('Please enter your email address first.');
      }
      
      const authEmail = cleanIdentifier.includes('@') 
        ? cleanIdentifier 
        : `${cleanIdentifier.toLowerCase()}@marketmates.local`;

      await sendPasswordResetEmail(auth, authEmail);
      setResetSent(true);
    } catch (err: any) {
      let friendlyError = err.message || 'Failed to send reset email.';
      if (err.code === 'auth/user-not-found') {
        friendlyError = 'No account found with this email/username.';
      } else if (err.code === 'auth/invalid-email') {
        friendlyError = 'Please enter a valid email address.';
      }
      setError(friendlyError);
    }
  };

  const handleRoleSelect = async (role: 'vendor' | 'buyer' | 'rider') => {
    try {
      setError(null);
      await setProfileRole(role);
      navigate(role === 'vendor' ? '/vendor' : role === 'buyer' ? '/buyer' : '/rider');
    } catch (err: any) {
      setError('Failed to set role. Please try again.');
    }
  };

  if (loading) return null;

  if (roleSelection) {
    return (
      <div className="w-full min-h-full flex flex-col">
        <div className="flex-1 shrink-0 min-h-[2rem]"></div>
        <div className="w-full p-4 py-8">
          <div className="max-w-3xl w-full mx-auto bg-white rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-center p-6 sm:p-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 mb-2 sm:mb-3">Choose Your Path</h2>
        <p className="text-slate-500 text-center mb-6 sm:mb-10 text-base sm:text-lg">How will you be using MarketMates?</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <button
            onClick={() => handleRoleSelect('vendor')}
            className="flex flex-col items-center justify-center p-6 sm:p-8 border-2 border-transparent hover:border-emerald-100 bg-[#A7F3D0]/30 rounded-3xl transition-all hover:shadow-md"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#10B981]/20 rounded-2xl flex items-center justify-center mb-3 sm:mb-4">
              <Store className="w-7 h-7 sm:w-8 sm:h-8 text-[#10B981]" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-emerald-900 mb-1 sm:mb-2">I am a Vendor</span>
            <span className="text-emerald-700/70 text-sm font-medium">List products and manage deals</span>
          </button>
          
          <button
            onClick={() => handleRoleSelect('buyer')}
            className="flex flex-col items-center justify-center p-6 sm:p-8 border-2 border-transparent hover:border-blue-100 bg-blue-50 rounded-3xl transition-all hover:shadow-md"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-3 sm:mb-4">
              <ShoppingBag className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-blue-900 mb-1 sm:mb-2">I am a Buyer</span>
            <span className="text-blue-700/70 text-sm font-medium">Browse markets and make offers</span>
          </button>

          <button
            onClick={() => handleRoleSelect('rider')}
            className="flex flex-col items-center justify-center p-6 sm:p-8 border-2 border-transparent hover:border-violet-100 bg-violet-50 rounded-3xl transition-all hover:shadow-md"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-violet-100 rounded-2xl flex items-center justify-center mb-3 sm:mb-4">
              <Motorbike className="w-7 h-7 sm:w-8 sm:h-8 text-violet-600" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-violet-900 mb-1 sm:mb-2">I am a Rider</span>
            <span className="text-violet-700/70 text-sm font-medium">Accept and manage deliveries</span>
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-6 text-center">{error}</p>}
          </div>
        </div>
        <div className="flex-1 shrink-0 min-h-[2rem]"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-full flex flex-col">
      <div className="flex-1 shrink-0 min-h-[2rem]"></div>
      <div className="w-full p-4 py-8">
        <div className="max-w-4xl lg:max-w-5xl w-full mx-auto bg-white rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row overflow-hidden min-h-0 md:min-h-[600px]">
          
          {/* Left Form Side */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-white z-10 relative">
        <div className="flex justify-center mb-4 sm:mb-8 md:hidden">
          <Logo size="lg" variant="primary" />
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-bold text-center md:text-left text-slate-900 mb-1 sm:mb-2">
          {isForgotPassword ? 'Reset password' : isSignUp ? 'Create an account' : 'Welcome back'}
        </h2>
        <p className="text-slate-500 text-sm sm:text-base text-center md:text-left mb-5 sm:mb-8">
          {isForgotPassword ? 'Enter your email to receive a reset link' : isSignUp ? 'Join the digital marketplace' : 'Log in to your account'}
        </p>

        {error && (
          <div className="mb-4 sm:mb-6 p-3 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100">
            {error}
          </div>
        )}

        {isForgotPassword ? (
          resetSent ? (
            <div className="text-center md:text-left">
              <div className="mb-6 p-4 bg-emerald-50 text-emerald-800 text-sm rounded-xl border border-emerald-100 font-medium">
                A password reset link has been sent to your email.
              </div>
              <button
                onClick={() => {
                  setIsForgotPassword(false);
                  setResetSent(false);
                  setError(null);
                }}
                className="text-[#10B981] hover:text-emerald-700 font-bold hover:underline text-sm"
              >
                Back to login
              </button>
            </div>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-3 sm:space-y-5 mb-5 sm:mb-8">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Email address</label>
                <input
                  type="email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#10B981] outline-none transition-all text-sm font-medium bg-slate-50"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#10B981] hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors shadow-sm text-sm"
              >
                Send Reset Link
              </button>
              <div className="text-center md:text-left pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(false);
                    setError(null);
                  }}
                  className="text-slate-500 hover:text-slate-700 font-bold hover:underline text-sm"
                >
                  Back to login
                </button>
              </div>
            </form>
          )
        ) : (
          <>
            <form onSubmit={handleEmailAuth} className="space-y-3 sm:space-y-5 mb-5 sm:mb-8">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Email or Username</label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#10B981] outline-none transition-all text-sm font-medium bg-slate-50"
                  placeholder="you@example.com or username"
                  required
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-bold text-slate-700">Password</label>
                  {!isSignUp && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPassword(true);
                        setError(null);
                      }}
                      className="text-xs font-bold text-[#10B981] hover:text-emerald-700 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#10B981] outline-none transition-all text-sm font-medium bg-slate-50"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#10B981] hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors shadow-sm text-sm"
              >
                {isSignUp ? 'Sign Up' : 'Log In'}
              </button>
            </form>

            <div className="relative mb-5 sm:mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <span className="px-2 bg-white">Or continue with</span>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center space-x-2 py-3 sm:py-4 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-colors text-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Google</span>
            </button>

            <div className="mt-5 sm:mt-8 text-center md:text-left text-sm">
              <span className="text-slate-500 mr-2">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              </span>
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-[#10B981] hover:text-emerald-700 font-bold hover:underline"
              >
                {isSignUp ? 'Log in' : 'Sign up'}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Right Branding Side */}
      <div className="hidden md:flex w-1/2 bg-[#10B981] p-12 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10 flex flex-col h-full justify-center">
          <Logo size="xl" variant="glass" className="mb-10" />
          <h2 className="text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
            The Digital<br />Marketplace.
          </h2>
          <p className="text-emerald-50 text-lg leading-relaxed max-w-sm font-medium">
            Join thousands of verified vendors and buyers connecting to negotiate deals and trade products every day.
          </p>
        </div>

        {/* Abstract pattern / decoration */}
        <div className="absolute -bottom-32 -right-32 w-[30rem] h-[30rem] bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/4 -right-16 w-64 h-64 bg-emerald-400/40 rounded-full blur-3xl pointer-events-none"></div>
      </div>
      </div>
      <div className="flex-1 shrink-0 min-h-[2rem]"></div>
    </div>
    </div>
  );
};
