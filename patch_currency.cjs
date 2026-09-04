const fs = require('fs');
let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');

code = code.replace("DollarSign,", "Banknote,");
code = code.replace("<DollarSign className=", "<Banknote className=");

fs.writeFileSync('src/views/VendorDashboard.tsx', code);
