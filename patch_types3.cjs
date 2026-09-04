const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

// I'll just remove anything starting with `-e declare module '*?url';`
code = code.replace(/-e declare module '\*\?url';\n/, '');

fs.writeFileSync('src/types.ts', code);
