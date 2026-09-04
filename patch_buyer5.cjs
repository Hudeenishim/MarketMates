const fs = require('fs');
let code = fs.readFileSync('src/views/BuyerView.tsx', 'utf8');

code = code.replace(
  'className="flex flex-col md:flex-row gap-6 animate-in fade-in duration-500 pb-4 mb-24 relative min-h-[80vh]"',
  'className="flex flex-col md:flex-row gap-6 animate-in fade-in duration-500 pb-32 relative min-h-[80vh]"'
);

fs.writeFileSync('src/views/BuyerView.tsx', code);
