const fs = require('fs');
let code = fs.readFileSync('src/views/BuyerView.tsx', 'utf8');

const returnStartIndex = code.indexOf('  return (\n    <div className="flex flex-col md:flex-row');
const catalogStartIndex = code.indexOf('      {/* Product Catalog */}');

if (returnStartIndex !== -1 && catalogStartIndex !== -1) {
  code = code.substring(0, returnStartIndex) + 
         '  return (\n    <div className="animate-in fade-in duration-500 min-h-[80vh] pb-32 relative">\n' + 
         code.substring(catalogStartIndex);
}

// Remove the extra closing div that was for flex-1 flex flex-col gap-6 min-w-0
// The file originally ended with:
//       </div>
//     </div>
//   );
// };
// Now it just needs one less </div> before </div> ); };
// Let's replace the ending:
code = code.replace(/      <\/div>\n    <\/div>\n  \);\n\};\n?$/, '    </div>\n  );\n};\n');

fs.writeFileSync('src/views/BuyerView.tsx', code);
