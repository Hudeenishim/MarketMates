const fs = require('fs');
let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');

// Fix Voice Record Card internal form grid
code = code.replace(
  'className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"',
  'className="grid grid-cols-1 sm:grid-cols-2 gap-4"'
);

fs.writeFileSync('src/views/VendorDashboard.tsx', code);
console.log("Updated VendorDashboard.tsx");
