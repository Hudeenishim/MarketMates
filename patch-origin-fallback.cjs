const fs = require('fs');
let code = fs.readFileSync('src/views/DeliveryDashboard.tsx', 'utf8');

code = code.replace(
  /selectedDelivery\.status === 'accepted' \? selectedDelivery\.current_rider_location :/g,
  `selectedDelivery.status === 'accepted' ? (selectedDelivery.current_rider_location || selectedDelivery.pickup_location) :`
);
code = code.replace(
  /selectedDelivery\.status === 'picked_up' \? selectedDelivery\.current_rider_location : null/g,
  `selectedDelivery.status === 'picked_up' ? (selectedDelivery.current_rider_location || selectedDelivery.pickup_location) : null`
);

fs.writeFileSync('src/views/DeliveryDashboard.tsx', code);
console.log('patched origin fallback');
