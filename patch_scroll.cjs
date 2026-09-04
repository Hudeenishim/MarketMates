const fs = require('fs');
let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');

// Change outer div from overflow-hidden to overflow-y-auto
code = code.replace(
  'className="h-full flex flex-col gap-6 animate-in fade-in duration-500 overflow-hidden"',
  'className="h-full flex flex-col gap-6 animate-in fade-in duration-500 overflow-y-auto overflow-x-hidden pb-4"'
);

// We might want to remove overflow-hidden on the inventory panel so it expands or we can leave it as flex-1 if h-full still constrains it.
// If we change h-full to min-h-full, it will expand beyond the container if needed.
code = code.replace(
  'className="h-full flex flex-col gap-6 animate-in fade-in duration-500 overflow-y-auto overflow-x-hidden pb-4"',
  'className="flex flex-col gap-6 animate-in fade-in duration-500 overflow-y-auto overflow-x-hidden pb-4"'
);

fs.writeFileSync('src/views/VendorDashboard.tsx', code);
