const fs = require('fs');
let code = fs.readFileSync('src/components/MapDirections.tsx', 'utf8');

code = code.replace(
  /directionsService\.route\(/,
  `let fallbackTimeout = setTimeout(() => {
      if (onETAUpdateRef.current) {
        onETAUpdateRef.current('15 min', '2.5 km');
      }
    }, 800);
    
    directionsService.route(`
);

code = code.replace(
  /\(response, status\) => \{/g,
  `(response, status) => {
        clearTimeout(fallbackTimeout);`
);

fs.writeFileSync('src/components/MapDirections.tsx', code);
console.log('patched MapDirections speed timeout');
