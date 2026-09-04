const fs = require('fs');
let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');

const target = "const autoImageUrl = newProductImageUrl.trim() || `https://image.pollinations.ai/prompt/${encodeURIComponent(newProductName + ' ' + newProductCategory + ' product high quality')}?width=500&height=500&nologo=true`;";

const replacement = "const autoImageUrl = newProductImageUrl.trim() || `https://loremflickr.com/500/500/${encodeURIComponent(newProductName.split(' ')[0] || newProductCategory)}/all`;";

code = code.replace(target, replacement);

fs.writeFileSync('src/views/VendorDashboard.tsx', code);
