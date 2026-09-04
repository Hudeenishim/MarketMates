const fs = require('fs');
let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');
code = code.replace(/stock_quantityd\+\(stock_quantity\.stock_quantityd\+\)\?/g, '\\d+(\\.\\d+)?');
code = code.replace(/stock_quantityd\+/, '\\d+');
code = code.replace(/stock_quantitys\*/, '\\s*');
code = code.replace(/stock_quantitybstock_quantityw/, '\\b\\w');
fs.writeFileSync('src/views/VendorDashboard.tsx', code);
