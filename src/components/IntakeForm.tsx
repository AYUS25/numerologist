import { playTactileClick, playHoverTick } from '../audio';
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, User, Sparkles, AlertCircle, Clock, MapPin, Phone } from 'lucide-react';
import { NumerologyInput } from '../types';

interface IntakeFormProps {
  onSubmit: (data: NumerologyInput) => void;
  isLoading: boolean;
  initialValues?: NumerologyInput | null;
}

export default function IntakeForm({ onSubmit, isLoading, initialValues }: IntakeFormProps) {
  const [fullName, setFullName] = useState(initialValues?.fullName || '');
  const [dateOfBirth, setDateOfBirth] = useState(initialValues?.dateOfBirth || '');
  const [timeOfBirth, setTimeOfBirth] = useState(initialValues?.timeOfBirth || '');
  const [placeOfBirth, setPlaceOfBirth] = useState(initialValues?.placeOfBirth || '');
    const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Please enter your full birth name.');
      return;
    }
    if (!dateOfBirth) {
      setError('Please select your date of birth.');
      return;
    }

    onSubmit({
      fullName: fullName.trim(),
      dateOfBirth,
      timeOfBirth,
      placeOfBirth,
          });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto"
      id="intake-form-container"
    >
      <div className="text-center mb-10">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="inline-block p-4 bg-gold-accent/5 rounded-full border border-gold-accent/15 mb-6 animate-celestial-float"
        >
          <Sparkles className="w-8 h-8 text-gold-accent" />
        </motion.div>
        <h1 className="font-display text-3xl sm:text-4xl font-light tracking-[0.2em] text-white mb-4 uppercase">
          Numerologist AI Portal
        </h1>
        <p className="text-slate-400 font-sans text-xs sm:text-sm max-w-md mx-auto leading-relaxed uppercase tracking-wider">
          Enter your full birth name and birth date to generate your professional, master-level numerological blueprint.
        </p>
      </div>

      <div className="bg-dark-panel border border-dark-border p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-dark via-gold-accent to-gold-dark"></div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 bg-rose-950/20 border border-rose-900/30 rounded flex items-center gap-3 text-rose-300 text-xs"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-slate-400 mb-2 font-display">
              Full Birth Name
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="ALEXANDER JAMES MORGAN"
                className="w-full bg-[#171717] border border-dark-border focus:border-gold-accent rounded-sm py-4.5 pl-12 pr-4 text-white placeholder-[#404040] focus:outline-none transition-colors text-xs sm:text-sm font-mono uppercase"
                id="input-full-name"
              />
            </div>
            <p className="mt-2.5 text-[10px] text-[#71717a] font-sans leading-relaxed italic">
              <strong className="text-gold-accent font-bold not-italic">PRO TIP:</strong> Enter the name exactly as written on your official birth certificate, including middle names.
            </p>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-slate-400 mb-2 font-display">
              Date of Birth (Temporal Anchor)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600">
                <Calendar className="w-4 h-4" />
              </span>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full bg-[#171717] border border-dark-border focus:border-gold-accent rounded-sm py-4.5 pl-12 pr-4 text-white focus:outline-none transition-colors text-xs sm:text-sm font-mono"
                id="input-dob"
              />
            </div>
            <p className="mt-2.5 text-[10px] text-[#71717a] font-sans leading-relaxed italic">
              Used to calculate your core Life Path Number and current Personal Year cycle transition values.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-slate-400 mb-2 font-display">
                Time of Birth (Optional)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600">
                  <Clock className="w-4 h-4" />
                </span>
                <input
                  type="time"
                  value={timeOfBirth}
                  onChange={(e) => setTimeOfBirth(e.target.value)}
                  className="w-full bg-[#171717] border border-dark-border focus:border-gold-accent rounded-sm py-4.5 pl-12 pr-4 text-white focus:outline-none transition-colors text-xs sm:text-sm font-mono"
                  id="input-tob"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-slate-400 mb-2 font-display">
                Place of Birth (Optional)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600">
                  <MapPin className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={placeOfBirth}
                  onChange={(e) => setPlaceOfBirth(e.target.value)}
                  placeholder="CITY, COUNTRY"
                  className="w-full bg-[#171717] border border-dark-border focus:border-gold-accent rounded-sm py-4.5 pl-12 pr-4 text-white placeholder-[#404040] focus:outline-none transition-colors text-xs sm:text-sm font-mono uppercase"
                  id="input-pob"
                />
              </div>
            </div>
          </div>
          <p className="mt-[-10px] text-[10px] text-[#71717a] font-sans leading-relaxed italic">
            Provides deeper astrological correlations and secondary numerology timing matrices.
          </p>

          <button onMouseEnter={() => playHoverTick()} onTouchMove={() => playHoverTick()}  
            type="submit"
            disabled={isLoading}
            className="w-full bg-gold-dark hover:bg-gold-accent disabled:bg-slate-800 text-black font-display font-bold tracking-widest text-xs uppercase py-4 rounded-sm shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
            id="btn-calculate-blueprint"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Calculating Matrix...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-black" />
                <span>Calculate Sovereign Matrix</span>
              </>
            )}
          </button>
        </form>

        {/* Pythagoras Quote section */}
        <div className="mt-8 pt-6 border-t border-dark-border">
          <div className="p-4 border border-dashed border-[#404040] rounded-sm text-left">
            <p className="text-[10px] text-[#71717a] leading-relaxed italic">
              "Numbers are the highest degree of knowledge. It is knowledge itself."
              <br />
              <span className="not-italic font-bold text-gold-accent">— Plato</span>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
