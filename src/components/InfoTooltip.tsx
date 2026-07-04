import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function InfoTooltip({ text }: { text: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="relative inline-block ml-2 align-middle z-50"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onClick={() => setIsOpen(!isOpen)}
    >
      <HelpCircle className="w-3.5 h-3.5 text-zinc-400 hover:text-blue-500 cursor-pointer transition-colors" />
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-zinc-900 border border-slate-700 text-zinc-300 text-[10px] p-3 rounded shadow-xl font-sans normal-case tracking-normal z-50"
          >
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-slate-700"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
