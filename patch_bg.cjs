const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

css = css.replace(
  'body { background-color: #f8fafc; color: #0f172a; }',
  `body {
  background-color: #f8fafc;
  background-image: radial-gradient(circle at 15% 50%, rgba(79, 70, 229, 0.06) 0%, transparent 50%),
                    radial-gradient(circle at 85% 30%, rgba(79, 70, 229, 0.04) 0%, transparent 40%);
  color: #0f172a;
}`
);

fs.writeFileSync('src/index.css', css);
