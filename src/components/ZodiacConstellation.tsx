import React from 'react';
import { motion } from 'motion/react';

// Constellation paths
const zodiacPaths: Record<string, string> = {
  Aries: "M 20 80 L 40 40 L 60 40 L 80 80",
  Taurus: "M 20 20 L 50 80 L 80 20 M 30 20 A 20 20 0 0 1 70 20",
  Gemini: "M 30 20 L 30 80 M 70 20 L 70 80 M 20 20 L 80 20 M 20 80 L 80 80",
  Cancer: "M 40 40 A 10 10 0 1 1 40 60 A 10 10 0 1 1 40 40 M 60 60 A 10 10 0 1 1 60 80 A 10 10 0 1 1 60 60",
  Leo: "M 20 80 L 40 20 A 10 10 0 1 1 60 20 L 80 80",
  Virgo: "M 20 20 L 40 80 L 60 20 L 80 80 M 80 80 A 10 10 0 1 1 80 60",
  Libra: "M 20 60 L 80 60 M 30 60 A 20 20 0 0 1 70 60 L 80 80 L 20 80 Z",
  Scorpio: "M 20 20 L 40 80 L 60 20 L 80 80 M 80 80 L 90 60 L 100 70",
  Sagittarius: "M 20 80 L 80 20 M 50 20 L 80 20 L 80 50 M 40 60 L 60 80",
  Capricorn: "M 20 20 L 50 80 L 80 20 A 10 10 0 1 1 80 40 A 10 10 0 1 1 80 60",
  Aquarius: "M 20 40 L 30 20 L 40 40 L 50 20 L 60 40 L 70 20 L 80 40 M 20 80 L 30 60 L 40 80 L 50 60 L 60 80 L 70 60 L 80 80",
  Pisces: "M 30 20 L 30 80 M 70 20 L 70 80 M 30 50 L 70 50"
};

export const getZodiacSign = (dateString: string): string => {
  const date = new Date(dateString);
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
  return 'Pisces';
};

interface Props {
  dateOfBirth?: string;
  sign?: string;
}

export default function ZodiacConstellation({ dateOfBirth, sign: inputSign }: Props) {
  const sign = inputSign || (dateOfBirth ? getZodiacSign(dateOfBirth) : 'Aries');
  const path = zodiacPaths[sign] || zodiacPaths['Aries'];

  return (
    <div className="relative w-full h-full flex items-center justify-center min-h-[150px]">
      <svg viewBox="0 0 100 100" className="w-full h-full max-w-[200px] max-h-[200px] drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]">
        <motion.path
          d={path}
          fill="none"
          stroke="url(#constellation-gradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
        <defs>
          <linearGradient id="constellation-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute bottom-2 text-center w-full">
        <span className="text-[10px] font-bold tracking-[0.2em] text-blue-400 uppercase font-sans bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm border border-blue-500/20">{sign}</span>
      </div>
    </div>
  );
}
