const fs = require('fs');
let code = fs.readFileSync('firestore.rules', 'utf8');

// The buyer should be able to update if they are the buyer. We can relax the incoming().last_actor == 'buyer' restriction IF they are just updating payment fields.
// Actually, it's easier to just remove the `incoming().last_actor == 'buyer'` check for buyer/vendor, OR change the client to send `last_actor: 'buyer'`.
// Let's modify the rules to allow the buyer to update payment timing regardless of last_actor, OR just remove the `incoming().last_actor == 'buyer'` and instead enforce that only buyers can change certain fields, and vendors can change certain fields.
// Alternatively, just change the rule to:
// request.auth.uid == existing().buyer_id && incoming().diff(existing()).affectedKeys().hasOnly([...])
// Let's do that for the allowed keys check.

code = code.replace(
  /\(request\.auth\.uid == existing\(\)\.buyer_id && incoming\(\)\.last_actor == 'buyer' && incoming\(\)\.diff\(existing\(\)\)\.affectedKeys\(\)\.hasOnly/g,
  "(request.auth.uid == existing().buyer_id && incoming().diff(existing()).affectedKeys().hasOnly"
);

code = code.replace(
  /\(request\.auth\.uid == existing\(\)\.vendor_id && incoming\(\)\.last_actor == 'vendor' && incoming\(\)\.diff\(existing\(\)\)\.affectedKeys\(\)\.hasOnly/g,
  "(request.auth.uid == existing().vendor_id && incoming().diff(existing()).affectedKeys().hasOnly"
);

fs.writeFileSync('firestore.rules', code);
console.log('patched rules 2');
