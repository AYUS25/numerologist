const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace systemError state with toast state
code = code.replace(
  "const [systemError, setSystemError] = useState('');",
  "const [toast, setToast] = useState<{message: string, type: 'error' | 'success'} | null>(null);\n\n  // Auto-hide toast\n  React.useEffect(() => {\n    if (toast) {\n      const timer = setTimeout(() => setToast(null), 5000);\n      return () => clearTimeout(timer);\n    }\n  }, [toast]);"
);

// Replace setSystemError calls
code = code.replace(/setSystemError\('Invalid profile JSON format\.'\);/g, "setToast({ message: 'Invalid profile JSON format.', type: 'error' });");
code = code.replace(/setSystemError\('Error parsing JSON file\.'\);/g, "setToast({ message: 'Error parsing JSON file.', type: 'error' });");
code = code.replace(/setSystemError\(''\);/g, "setToast(null);");
code = code.replace(/setSystemError\(err\.message \|\| 'Celestial mechanics failed\. Please re-enter\.'\);/g, "setToast({ message: err.message || 'Celestial mechanics failed. Please re-enter.', type: 'error' });");

// Add Toast component render near the end
const toastJSX = `
      {/* Premium Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm"
          >
            <div className="glass-panel backdrop-blur-2xl px-6 py-4 rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex items-center gap-3">
              <div className={\`w-2 h-2 rounded-full \${toast.type === 'error' ? 'bg-red-400' : 'bg-emerald-400'} shadow-[0_0_8px_currentColor]\`} />
              <p className="text-sm font-medium text-white/90 font-serif tracking-wide">{toast.message}</p>
              <button onClick={() => setToast(null)} className="ml-4 text-white/40 hover:text-white/80 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
`;
// Ensure X is imported
code = code.replace(
  "import { Download, Upload, Printer } from 'lucide-react';",
  "import { Download, Upload, Printer, X } from 'lucide-react';"
);

// Insert toastJSX before </main> or </App> container end
code = code.replace(
  "      </main>\n    </div>",
  toastJSX + "\n      </main>\n    </div>"
);

// Remove old systemError render
code = code.replace(
  /\{\s*systemError\s*&&\s*\(\s*<motion\.div[\s\S]*?<\/motion\.div>\s*\)\s*\}/,
  ""
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx with premium toast");
