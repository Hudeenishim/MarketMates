const fs = require('fs');
let code = fs.readFileSync('src/lib/dummyData.ts', 'utf8');

code = code.replace(
  "stock_quantity: 10,\n    audio_listing_url: '',\n    created_at: Date.now() - 200000,",
  "stock_quantity: 10,\n    unit: 'pieces',\n    audio_listing_url: '',\n    created_at: Date.now() - 200000,"
);

code = code.replace(
  "stock_quantity: 10,\n    audio_listing_url: '',\n    created_at: Date.now() - 300000,",
  "stock_quantity: 10,\n    unit: 'baskets',\n    audio_listing_url: '',\n    created_at: Date.now() - 300000,"
);

fs.writeFileSync('src/lib/dummyData.ts', code);
