const fs = require('fs');
let code = fs.readFileSync('src/lib/dummyData.ts', 'utf8');
code = code.replace(/stock_status: true,/g, 'stock_status: true,\n    stock_quantity: 10,');
fs.writeFileSync('src/lib/dummyData.ts', code);
