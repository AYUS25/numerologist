const fs = require('fs');

let css = fs.readFileSync('src/index.css', 'utf8');

// Ensure background is pure black
css = css.replace(/--color-dark-bg: [^;]+;/, '--color-dark-bg: #000000;');
css = css.replace(/--color-dark-panel: [^;]+;/, '--color-dark-panel: rgba(15, 15, 15, 0.6);'); // Darker Apple-like panels

// Replace background image gradient to be very subtle blue instead of purple
css = css.replace(/background-image:[\s\S]*?scroll-behavior:/, `background-image: 
    radial-gradient(circle at 15% 50%, rgba(10, 132, 255, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 85% 30%, rgba(10, 132, 255, 0.02) 0%, transparent 40%),
    radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.01) 0%, transparent 50%);
  background-attachment: fixed;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  scroll-behavior:`);

fs.writeFileSync('src/index.css', css);
console.log("Patched index.css for Apple-like theme");
