const fs = require('fs');

let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');

code = code.replace(
  /let finalImageUrl = newProductImageUrl;\n\s*if \(newProductImageUrl === ''\) \{\n\s*setIsGeneratingImage\(true\);\n\s*finalImageUrl = await generateImage\(newProductName\);\n\s*setIsGeneratingImage\(false\);\n\s*\}/,
  `let finalImageUrl = newProductImageUrl;`
);

code = code.replace(
  /let finalImageUrl = editProductImageUrl;\n\s*if \(editProductImageUrl === ''\) \{\n\s*setIsGeneratingImage\(true\);\n\s*finalImageUrl = await generateImage\(editProductName\);\n\s*setIsGeneratingImage\(false\);\n\s*\}/,
  `let finalImageUrl = editProductImageUrl;`
);

fs.writeFileSync('src/views/VendorDashboard.tsx', code);
console.log("Removed generateImage logic");
