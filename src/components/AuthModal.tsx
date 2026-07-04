import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, Eye, EyeOff, Sparkles, AlertCircle, CheckCircle, ArrowLeft, Send } from 'lucide-react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { playTactileClick, playHoverTick, playMechanicalDial } from '../audio';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (message: string) => void;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // States for enhanced feedback
  const [error, setError] = useState<{ message: string; resolution?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email) {
      setError({ message: 'Email address is required.', resolution: 'Please provide a valid email format (e.g. seeker@cosmos.com).' });
      return;
    }
    
    if (!isForgotPassword && !password) {
      setError({ message: 'Password is required.', resolution: 'Please type the password associated with this celestial alignment.' });
      return;
    }
    
    setIsLoading(true);
    playTactileClick();

    try {
      if (isForgotPassword) {
        // Send reset email
        await sendPasswordResetEmail(auth, email);
        setIsSuccess(true);
        setSuccessMessage('Reset link dispatched! Please inspect your mail terminal inbox.');
        onAuthSuccess('Password reset alignment email sent.');
        setTimeout(() => {
          setIsSuccess(false);
          setIsForgotPassword(false);
          setError(null);
        }, 3500);
      } else if (isSignUp) {
        // Create user
        await createUserWithEmailAndPassword(auth, email, password);
        setIsSuccess(true);
        setSuccessMessage('Sovereign Matrix Established Successfully!');
        onAuthSuccess('Sovereign account created successfully!');
        setTimeout(() => {
          onClose();
          setIsSuccess(false);
        }, 2200);
      } else {
        // Sign in
        await signInWithEmailAndPassword(auth, email, password);
        setIsSuccess(true);
        setSuccessMessage('Alignment Verified! Welcome back, seeker.');
        onAuthSuccess('Welcome back, seeker!');
        setTimeout(() => {
          onClose();
          setIsSuccess(false);
        }, 2000);
      }
    } catch (err: any) {
      console.error(err);
      let errMsg = err.message || 'Celestial sync failed.';
      let resolution = 'Check your connection or try again shortly.';
      
      if (err.code === 'auth/email-already-in-use') {
        errMsg = 'This email is already linked to another matrix.';
        resolution = 'Try signing in with this email, or register using a different terminal.';
      } else if (err.code === 'auth/invalid-credential') {
        errMsg = 'Invalid credentials. Password or email is incorrect.';
        resolution = 'Double check spelling, or click "Forgot Password" to trigger a reset transmission.';
      } else if (err.code === 'auth/weak-password') {
        errMsg = 'Password must be at least 6 characters.';
        resolution = 'Create a stronger password containing numbers, letters, and special glyphs.';
      } else if (err.code === 'auth/invalid-email') {
        errMsg = 'Please enter a valid email address.';
        resolution = 'Correct any typos or missing characters (e.g. "@" or ".").';
      } else if (err.code === 'auth/user-not-found') {
        errMsg = 'No registered seeker matches this email.';
        resolution = 'Click "Create Sovereign Account" below to register a brand new alignment.';
      }
      
      setError({ message: errMsg, resolution });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleMode = () => {
    playMechanicalDial();
    setIsSignUp(prev => !prev);
    setIsForgotPassword(false);
    setError(null);
  };

  const handleToggleForgotPassword = () => {
    playMechanicalDial();
    setIsForgotPassword(prev => !prev);
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-sm"
        />

        {/* Modal Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative bg-[#0d0d0d] border border-dark-border w-full max-w-md p-6 sm:p-8 shadow-2xl rounded-2xl overflow-hidden text-left"
          id="auth-modal-panel"
        >
          {/* Top golden border gradient */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-dark via-gold-accent to-gold-dark"></div>

          {/* Close button */}
          <button
            onClick={() => { playTactileClick(); onClose(); }}
            onMouseEnter={() => playHoverTick()}
            className="absolute top-4 right-4 p-1.5 hover:bg-white/5 text-zinc-500 hover:text-zinc-200 rounded-lg transition-all cursor-pointer border border-transparent hover:border-white/5"
            id="auth-close-btn"
          >
            <X className="w-4 h-4" />
          </button>

          {/* SUCCESS STATE ANIMATION OVERLAY */}
          <AnimatePresence>
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#0d0d0d]/95 z-50 flex flex-col items-center justify-center p-6 text-center"
              >
                {/* Micro-sparkles & success ring */}
                <div className="relative">
                  <motion.div
                    initial={{ scale: 0.7, rotate: -45, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                    className="w-16 h-16 rounded-full bg-gold-accent/10 border-2 border-gold-accent flex items-center justify-center text-gold-accent mb-4 shadow-[0_0_20px_rgba(212,163,89,0.2)]"
                  >
                    <CheckCircle className="w-8 h-8" />
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 rounded-full border border-gold-accent/30 pointer-events-none scale-110"
                  />
                </div>

                <motion.h3
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="font-display text-lg font-bold tracking-[0.1em] text-white uppercase"
                >
                  Matrix Aligned
                </motion.h3>
                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-zinc-300 font-sans text-xs mt-2 max-w-xs leading-relaxed"
                >
                  {successMessage}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header */}
          <div className="text-center mb-6 mt-2">
            <div className="inline-block p-3 bg-gold-accent/5 rounded-full border border-gold-accent/10 mb-3 animate-pulse">
              <Sparkles className="w-6 h-6 text-gold-accent" />
            </div>
            <h3 className="font-display text-xl font-light tracking-[0.15em] text-white uppercase">
              {isForgotPassword 
                ? 'Recall Alignment' 
                : isSignUp 
                  ? 'Establish Alignment' 
                  : 'Synchronize Matrix'
              }
            </h3>
            <p className="text-zinc-400 font-sans text-[11px] mt-1.5 leading-relaxed max-w-xs mx-auto">
              {isForgotPassword
                ? 'Transmit your digital identifier to restore access to your custom profiles.'
                : isSignUp 
                  ? 'Create a secure account to save and analyze readings for multiple seekers.'
                  : 'Sign in to access your saved readings and cosmic consultations.'
              }
            </p>
          </div>

          {/* Enhanced Error Alert with Clear Resolution Steps */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 bg-rose-950/20 border border-rose-900/30 rounded-xl flex flex-col gap-1.5 text-xs mb-5 shadow-sm"
            >
              <div className="flex items-start gap-2 text-rose-300">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="font-sans font-bold leading-tight">{error.message}</span>
              </div>
              {error.resolution && (
                <div className="pl-6 text-[10px] text-zinc-400 font-sans leading-relaxed border-l border-rose-500/10 ml-2">
                  <strong className="text-zinc-300">Resolution:</strong> {error.resolution}
                </div>
              )}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[9px] uppercase tracking-widest text-zinc-400 mb-1.5 font-display font-medium">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seeker@cosmos.com"
                  className="w-full bg-[#141414] border border-dark-border focus:border-gold-accent rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-[#404040] focus:outline-none transition-colors text-xs font-mono"
                  id="auth-email-input"
                />
              </div>
            </div>

            {!isForgotPassword && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[9px] uppercase tracking-widest text-zinc-400 font-display font-medium">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={handleToggleForgotPassword}
                    className="text-[9px] uppercase tracking-wider text-gold-accent/70 hover:text-white transition-colors cursor-pointer font-mono"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#141414] border border-dark-border focus:border-gold-accent rounded-xl py-3.5 pl-11 pr-11 text-white placeholder-[#404040] focus:outline-none transition-colors text-xs font-mono"
                    id="auth-password-input"
                  />
                  <button
                    type="button"
                    onClick={() => { playTactileClick(); setShowPassword(!showPassword); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gold-dark hover:bg-gold-accent disabled:bg-slate-850 text-black font-display font-bold tracking-widest text-xs uppercase py-3.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-2 hover:shadow-[0_0_15px_rgba(212,163,89,0.25)]"
              id="auth-submit-btn"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Transmitting...</span>
                </>
              ) : (
                <>
                  {isForgotPassword ? <Send className="w-3.5 h-3.5 text-black" /> : null}
                  <span>
                    {isForgotPassword 
                      ? 'Transmit Reset Link' 
                      : isSignUp 
                        ? 'Register Account' 
                        : 'Sign In Now'
                    }
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Toggle Switch or Back Button */}
          <div className="mt-5 text-center text-xs border-t border-white/5 pt-4">
            {isForgotPassword ? (
              <button
                type="button"
                onClick={handleToggleForgotPassword}
                className="inline-flex items-center gap-1 text-zinc-400 hover:text-gold-accent transition-all cursor-pointer font-sans"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Connection Portal</span>
              </button>
            ) : (
              <div>
                <span className="text-zinc-500 font-sans">
                  {isSignUp ? 'Already have an alignment?' : 'New to the celestial charts?'}
                </span>{' '}
                <button
                  type="button"
                  onClick={handleToggleMode}
                  className="text-gold-accent hover:text-white font-medium hover:underline transition-all cursor-pointer font-sans"
                  id="auth-toggle-mode-btn"
                >
                  {isSignUp ? 'Sign In' : 'Create Sovereign Account'}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
