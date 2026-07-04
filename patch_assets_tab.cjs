const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

// 1. Add AssetAnalyzer import
if (!code.includes('AssetAnalyzer')) {
  code = code.replace(
    "import LifecyclePhasesWidget from './LifecyclePhasesWidget';",
    "import LifecyclePhasesWidget from './LifecyclePhasesWidget';\nimport AssetAnalyzer from './AssetAnalyzer';"
  );
}

// 2. Add Home to lucide-react imports if missing
if (!code.includes('Home,')) {
  code = code.replace(
    "Moon, Globe,",
    "Moon, Globe, Home,"
  );
}

// 3. Update ActiveTab type
code = code.replace(
  "type ActiveTab = 'profile' | 'timeline' | 'karmic' | 'remedies' | 'optimizer' | 'compatibility' | 'forecast' | 'sectors' | 'analysis';",
  "type ActiveTab = 'profile' | 'timeline' | 'karmic' | 'remedies' | 'optimizer' | 'compatibility' | 'forecast' | 'sectors' | 'analysis' | 'assets';"
);

// 4. Add the tab button
code = code.replace(
  "{ id: 'analysis', label: 'Name & Phone Analysis', icon: User },",
  "{ id: 'analysis', label: 'Name & Phone Analysis', icon: User },\n          { id: 'assets', label: 'Material Assets', icon: Home },"
);

// 5. Add the tab content panel
const assetContent = `
          {/* Tab 8: Material Assets */}
          {activeTab === 'assets' && (
            <motion.div
              key="tab-assets"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AssetAnalyzer />
            </motion.div>
          )}
`;

code = code.replace(
  /\{activeTab === 'analysis' && \([\s\S]*?<\/motion\.div>\s*\)\}/,
  (match) => match + "\n" + assetContent
);

fs.writeFileSync('src/components/ReportView.tsx', code);
console.log('Added Assets tab');
