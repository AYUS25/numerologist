const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

// Find the life path chart block
const chartRegex = /\{\/\* Life Path Cycles \(9-Year Personal Year Cycle\) \*\/\}([\s\S]*?)<\/div>\n\s*\{\/\* Tab 3: Karmic Ledger \*\/\}/;
const match = code.match(chartRegex);

if (match) {
  const chartBlock = match[1] + '</div>\n';
  // Remove it from its current position
  code = code.replace(match[0], '{/* Tab 3: Karmic Ledger */}');
  
  // Insert it at the end of Tab 1 (profile), just before closing div of tab-profile
  const profileTabRegex = /(\{\/\* Detail Panel \*\/\}(?:[\s\S]*?))<\/motion\.div>\n\s*\)\}\n\n\s*\{\/\* Tab 2: Destiny Timeline/;
  code = code.replace(profileTabRegex, (m, p1) => {
    return p1 + '\n              {/* Life Path Cycles (9-Year Personal Year Cycle) */}' + chartBlock + '            </motion.div>\n          )}\n\n          {/* Tab 2: Destiny Timeline';
  });
  
  fs.writeFileSync('src/components/ReportView.tsx', code);
  console.log("Moved Life Path Chart to Profile tab");
} else {
  console.log("Could not find the chart block");
}
