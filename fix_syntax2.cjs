const fs = require('fs');
let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');

code = code.replace(
  "const startCamera = async (mode: 'add' | 'edit' = 'add') => {\\n    setCameraMode(mode);",
  "const startCamera = async (mode: 'add' | 'edit' = 'add') => {\\n    setCameraMode(mode);"
);
// I can just replace that exact substring
code = code.replace("const startCamera = async (mode: 'add' | 'edit' = 'add') => {\\n    setCameraMode(mode);", "const startCamera = async (mode: 'add' | 'edit' = 'add') => {\\n    setCameraMode(mode);");

fs.writeFileSync('src/views/VendorDashboard.tsx', code);
