const fs = require('fs');
let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');

const target = `          stock_status: true,
          audio_listing_url: '',`;

const replacement = `          stock_status: true,
          stock_quantity: Number(newProductStockQuantity) || 0,
          audio_listing_url: '',`;

code = code.replace(target, replacement);

fs.writeFileSync('src/views/VendorDashboard.tsx', code);
