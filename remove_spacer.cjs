const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '{/* Mobile bottom nav spacer */}\\n            <div className="h-28 shrink-0 md:hidden"></div>',
  ''
);

fs.writeFileSync('src/App.tsx', code);
