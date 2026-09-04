const fs = require('fs');
let code = fs.readFileSync('src/components/MapDirections.tsx', 'utf8');

code = code.replace(
  /map\?\.fitBounds\(bounds, \{ padding: 40 \}\);/g,
  `map?.fitBounds(bounds, 40);`
);

fs.writeFileSync('src/components/MapDirections.tsx', code);
console.log('Fixed padding type');
