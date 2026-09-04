const fs = require('fs');

let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');
if (code.includes('demoMode')) {
  console.log("Demo mode is present");
}

