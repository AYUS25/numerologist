const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

// Secondary Grid
code = code.replace(
  '<div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="secondary-numbers-grid">',
  `<motion.div 
    className="grid grid-cols-1 md:grid-cols-3 gap-6" 
    id="secondary-numbers-grid"
    variants={{
      hidden: { opacity: 0 },
      show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    }}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true }}
  >`
);
code = code.replace(
  /\{\s*secondaryCards\.map\(\(card\) => \{\s*const m = metrics\[card\.key\];\s*return \(\s*<div\s*key=\{card\.key\}\s*className="bg-dark-panel/g,
  `{secondaryCards.map((card) => {
    const m = metrics[card.key];
    return (
      <motion.div
        key={card.key}
        variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
        className="bg-dark-panel`
);
code = code.replace(
  /<\/div>\s*\);\s*\}\)\}\s*<\/div>\s*<\/div>\s*\{\/\* Deep Subconscious/g,
  `</motion.div>\n                    );\n                  })}\n                </motion.div>\n              </div>\n\n              {/* Deep Subconscious`
);

// Deep Grid
code = code.replace(
  '<div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="deep-numbers-grid">',
  `<motion.div 
    className="grid grid-cols-1 md:grid-cols-2 gap-6" 
    id="deep-numbers-grid"
    variants={{
      hidden: { opacity: 0 },
      show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    }}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true }}
  >`
);
code = code.replace(
  /\{\s*deepCards\.map\(\(card\) => \{\s*const m = metrics\[card\.key\];\s*return \(\s*<div\s*key=\{card\.key\}\s*className="bg-\[\#121212\]/g,
  `{deepCards.map((card) => {
    const m = metrics[card.key];
    return (
      <motion.div
        key={card.key}
        variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
        className="bg-[#121212]`
);

// Fix closing tags for Deep Grid
code = code.replace(
  /<\/div>\s*\);\s*\}\)\}\s*<\/div>\s*<\/div>\s*\{\/\* Planes of Expression/g,
  `</motion.div>\n                    );\n                  })}\n                </motion.div>\n              </div>\n\n              {/* Planes of Expression`
);

fs.writeFileSync('src/components/ReportView.tsx', code);
console.log("Patched Grids");
