const fs = require('fs');
let code = fs.readFileSync('src/components/IntakeForm.tsx', 'utf8');

code = code.replace(/<div className="space-y-2 relative">\s*<label className="block text-\[10px\] uppercase tracking-widest text-\[#a1a1aa\] mb-2 font-serif">\s*Phone Number \(Optional\)\s*<\/label>[\s\S]*?id="input-phone"[\s\S]*?<\/p>\s*<\/div>/, '');

fs.writeFileSync('src/components/IntakeForm.tsx', code);
