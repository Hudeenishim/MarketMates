const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace("-e declare module '*?url';", "");
fs.writeFileSync('src/types.ts', code);
