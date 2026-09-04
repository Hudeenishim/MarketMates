const fs = require('fs');
let code = fs.readFileSync('src/views/BuyerView.tsx', 'utf8');

const returnRegex = /  return \([\s\S]*?\{\/\* Product Catalog \*\/\}/;

code = code.replace(returnRegex, '  return (\n    <div className="animate-in fade-in duration-500 min-h-[80vh] pb-32 relative">\n      {/* Product Catalog */}');

// Also remove the extra closing </div> that wrapped the flex-1 flex flex-col min-w-0
// Wait, the structure was:
// <div flex flex-col md:flex-row>
//   <div flex-1 flex flex-col min-w-0>
//     {/* Product Catalog */}
//     <div> ... </div>
//     {/* Modal */}
//   </div>
// </div>
// If I replaced everything up to {/* Product Catalog */} with just `<div animate-in ...>`, then I only have one wrapper instead of two.
// Let's check how many </div> are at the end.
