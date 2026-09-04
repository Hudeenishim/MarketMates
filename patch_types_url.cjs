const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace(/declare module '\*\?url' \{[\s\S]*?\}/, '');

fs.writeFileSync('src/types.ts', code);
