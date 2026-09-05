const fs = require('fs');
let code = fs.readFileSync('src/views/DeliveryDashboard.tsx', 'utf8');

code = code.replace(
  /const newDelivery: any = \{[\s\S]*?updated_at: Date.now\(\)\s*\};/,
  `const newDelivery: any = {
          negotiation_id: activeNegotiation.id,
          vendor_id: activeNegotiation.vendor_id,
          buyer_id: activeNegotiation.buyer_id,
          status: 'pending',
          payment_timing: activeNegotiation.payment_timing || 'before_delivery',
          payment_status: activeNegotiation.payment_status || 'pending',
          amount: (activeNegotiation.current_offer || 0) * (activeNegotiation.quantity || 1),
          created_at: Date.now(),
          updated_at: Date.now()
        };`
);

fs.writeFileSync('src/views/DeliveryDashboard.tsx', code);
