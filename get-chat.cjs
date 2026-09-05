const fs = require('fs');
let code = fs.readFileSync('src/views/NegotiationCenter.tsx', 'utf8');

const startIndex = code.indexOf('{/* Main Detail Area */}');
const endIndex = code.lastIndexOf('</div>\n    </div>\n  );\n};');
console.log('startIndex:', startIndex, 'endIndex:', endIndex);

