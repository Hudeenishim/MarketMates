const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace(/}\n}\n/, '}\n');
fs.writeFileSync('src/types.ts', code);
