const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

if (code.includes('</div></div>')) {
  console.log("Found </div></div>");
  code = code.replace(/<\/div><\/div>/g, '</div>');
  fs.writeFileSync('src/components/ReportView.tsx', code);
} else {
  console.log("Not found!");
}
