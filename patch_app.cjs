const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /<Routes>/,
  '<div className="flex-1 shrink-0 flex flex-col w-full">\n              <Routes>'
);

code = code.replace(
  /<\/Routes>/,
  '</Routes>\n            </div>'
);

fs.writeFileSync('src/App.tsx', code);
console.log("Updated App.tsx");
