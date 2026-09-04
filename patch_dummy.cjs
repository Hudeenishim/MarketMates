const fs = require('fs');
let code = fs.readFileSync('src/lib/dummyData.ts', 'utf8');

code = code.replace(
  "stock_quantity: 10,",
  "stock_quantity: 10,\n    unit: 'bunches',"
);

code = code.replace(
  "stock_quantity: 10,",
  "stock_quantity: 10,\n    unit: 'pieces',"
);

code = code.replace(
  "stock_quantity: 10,",
  "stock_quantity: 10,\n    unit: 'baskets',"
);

fs.writeFileSync('src/lib/dummyData.ts', code);
