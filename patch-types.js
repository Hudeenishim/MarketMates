const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace(
  /payment_status\?: 'pending' \| 'paid';/,
  "payment_status?: 'pending' | 'paid';\n  payment_timing?: 'before_delivery' | 'on_delivery';"
);

code = code.replace(
  /export interface Delivery \{/,
  "export interface Delivery {\n  payment_timing?: 'before_delivery' | 'on_delivery';\n  payment_status?: 'pending' | 'paid';\n  amount?: number;"
);

fs.writeFileSync('src/types.ts', code);
