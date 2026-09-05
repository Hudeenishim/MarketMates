const fs = require('fs');
let code = fs.readFileSync('firestore.rules', 'utf8');

code = code.replace(
  /\['full_name', 'avatar_url', 'market_hub_id', 'updated_at', 'role'\]/g,
  "['full_name', 'avatar_url', 'market_hub_id', 'updated_at', 'role', 'phone_number']"
);

fs.writeFileSync('firestore.rules', code);
console.log('patched rules 3');
