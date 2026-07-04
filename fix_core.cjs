const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

// Fix core-numbers-grid closing tag
code = code.replace(
  '                  })}\n                </div>\n              </div>\n\n              {/* Detail Panel */}\n              <motion.div ',
  '                  })}\n                </motion.div>\n              </div>\n\n              {/* Detail Panel */}\n              <motion.div '
);

fs.writeFileSync('src/components/ReportView.tsx', code);
