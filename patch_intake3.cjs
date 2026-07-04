const fs = require('fs');
let code = fs.readFileSync('src/components/IntakeForm.tsx', 'utf8');

const regex = /\s*<div>\s*<label className="block text-\[10px\] uppercase tracking-widest text-slate-400 mb-2 font-display">\s*Phone Number \(Optional\)\s*<\/label>\s*<div className="relative">\s*<span className="absolute left-4 top-1\/2 -translate-y-1\/2 text-slate-600">\s*<Phone className="w-4 h-4" \/>\s*<\/span>\s*<input\s*type="tel"\s*value=\{phoneNumber\}\s*onChange=\{\(e\) => setPhoneNumber\(e\.target\.value\)\}\s*placeholder="\+1 234 567 8900"\s*className="w-full bg-\[#171717\] border border-dark-border focus:border-gold-accent rounded-sm py-4\.5 pl-12 pr-4 text-white placeholder-\[#404040\] focus:outline-none transition-colors text-xs sm:text-sm font-mono uppercase"\s*id="input-phone"\s*\/>\s*<\/div>\s*<p className="mt-2\.5 text-\[10px\] text-\[#71717a\] font-sans leading-relaxed italic">\s*Analyzes your communication vibration and compatibility with your Life Path\.\s*<\/p>\s*<\/div>/g;

code = code.replace(regex, '');

fs.writeFileSync('src/components/IntakeForm.tsx', code);
