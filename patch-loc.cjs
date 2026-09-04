const fs = require('fs');
let code = fs.readFileSync('src/views/RiderDashboard.tsx', 'utf8');

code = code.replace(
  /const \[myLocation, setMyLocation\] = useState<\{lat: number, lng: number\} \| null>\(null\);/,
  `const [myLocation, setMyLocation] = useState<{lat: number, lng: number} | null>({ lat: 5.6037, lng: -0.1870 }); // Default Accra`
);

fs.writeFileSync('src/views/RiderDashboard.tsx', code);
console.log('patched myLocation default');
