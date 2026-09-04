const fs = require('fs');
let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');

const target = "const autoImageUrl = newProductImageUrl.trim() || `https://loremflickr.com/500/500/${encodeURIComponent(newProductName.split(' ')[0] || newProductCategory)}/all`;";

const replacement = "const queryKeys = (newProductName + ' ' + newProductCategory).split(' ').filter(Boolean).join(',');\n    const autoImageUrl = newProductImageUrl.trim() || `https://loremflickr.com/500/500/${encodeURIComponent(queryKeys)}/all`;";

code = code.replace(target, replacement);

fs.writeFileSync('src/views/VendorDashboard.tsx', code);
