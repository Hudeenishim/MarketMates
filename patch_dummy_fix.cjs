const fs = require('fs');
let code = fs.readFileSync('src/lib/dummyData.ts', 'utf8');

code = code.replace(/unit: 'baskets',\n\s*unit: 'pieces',\n\s*unit: 'bunches',/g, "unit: 'bunches',");
fs.writeFileSync('src/lib/dummyData.ts', code);
