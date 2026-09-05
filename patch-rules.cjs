const fs = require('fs');
let code = fs.readFileSync('firestore.rules', 'utf8');

// Add new fields to the allowed update keys for negotiations
code = code.replace(
  /incoming\(\)\.diff\(existing\(\)\)\.affectedKeys\(\)\.hasOnly\(\['current_counter_offer', 'current_offer', 'last_actor', 'status', 'updated_at', 'negotiation_history'\]\)/g,
  "incoming().diff(existing()).affectedKeys().hasOnly(['current_counter_offer', 'current_offer', 'last_actor', 'status', 'updated_at', 'negotiation_history', 'payment_status', 'payment_timing', 'quantity'])"
);

// We should also allow status to be updated even if it's not open, because payment_timing is updated AFTER status is accepted!
// Currently: existing().status == 'open'
// We need to change that to allow 'accepted'
code = code.replace(
  /existing\(\)\.status == 'open' &&/,
  "(existing().status == 'open' || existing().status == 'accepted') &&"
);

fs.writeFileSync('firestore.rules', code);
console.log('patched rules');
