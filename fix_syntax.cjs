const fs = require('fs');
let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');

code = code.replace(
  "const startCamera = async (mode: 'add' | 'edit' = 'add') => {\\n    setCameraMode(mode);",
  "const startCamera = async (mode: 'add' | 'edit' = 'add') => {\\n    setCameraMode(mode);" // wait this might insert another slash n
);
// let's do a regex replacement for literal backslash n
code = code.replace(/\\n/g, '\\n');
fs.writeFileSync('src/views/VendorDashboard.tsx', code);
