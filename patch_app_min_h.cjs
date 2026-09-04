const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '<main className="flex-1 max-w-[2000px] w-full mx-auto p-4 sm:p-6 lg:p-8 pb-4 md:pb-8 flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar">',
  '<main className="flex-1 min-h-0 max-w-[2000px] w-full mx-auto p-4 sm:p-6 lg:p-8 pb-32 md:pb-8 flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar">'
);

// We can remove the spacer div if we use pb-32, but let's just leave it or remove it. Let's just do pb-32.
// Actually, pb-32 on main gives padding inside the scroll container, which works well.
fs.writeFileSync('src/App.tsx', code);
