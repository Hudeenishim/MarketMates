const fs = require('fs');
let code = fs.readFileSync('src/lib/dummyData.ts', 'utf8');

// replace all duplicate units and replace them properly
code = code.replace(/stock_quantity: 10,\n    unit: 'baskets',\n    unit: 'pieces',\n    unit: 'bunches',/g, "stock_quantity: 10,\n    unit: 'bunches',");
// I'll just rewrite dummyData entirely for products.
fs.writeFileSync('src/lib/dummyData.ts', code);
