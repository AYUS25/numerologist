const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

code = code.replace(
  /\{ id: 'analysis', label: 'Name & Phone Analysis', icon: User \},/,
  `{ id: 'name_analysis', label: 'Name Analysis', icon: User },`
);

code = code.replace(
  /\{ id: 'assets', label: 'Material Assets', icon: Home \},/,
  `{ id: 'lifestyle', label: 'Lifestyle Vibrations', icon: Home },`
);

code = code.replace(
  /\{activeTab === 'analysis' && \(/,
  `{activeTab === 'name_analysis' && (`
);

code = code.replace(
  /<DynamicPhoneAnalyzer initialPhone=\{report\.phoneAnalysis\?\.number \|\| ''\} lifePathNumber=\{report\.metrics\.lifePath\.number\} \/>\s*/,
  ``
);

code = code.replace(
  /\{activeTab === 'assets' && \(/,
  `{activeTab === 'lifestyle' && (`
);

code = code.replace(
  /<AssetAnalyzer lifePathNumber=\{report\.metrics\.lifePath\.number\} \/>/,
  `<AssetAnalyzer rootNumber={report.metrics.rootNumber} lifePathNumber={report.metrics.lifePath.number} />
              <div className="mt-8">
                <DynamicPhoneAnalyzer initialPhone={report.phoneAnalysis?.number || ''} rootNumber={report.metrics.rootNumber} lifePathNumber={report.metrics.lifePath.number} />
              </div>`
);

fs.writeFileSync('src/components/ReportView.tsx', code);
