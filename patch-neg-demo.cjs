const fs = require('fs');
let code = fs.readFileSync('src/views/NegotiationCenter.tsx', 'utf8');

code = code.replace(
  /if \(demoMode && !user\) \{\s*alert\("Selected Pay on Delivery in demo mode!"\);\s*return;\s*\}/,
  `if (demoMode && !user) {
      alert("Selected Pay on Delivery in demo mode!");
      setNegotiations(prev => prev.map(n => n.id === selectedNegId ? {...n, payment_timing: 'on_delivery'} : n));
      return;
    }`
);

code = code.replace(
  /if \(demoMode && !user\) \{\s*alert\("Payment successful in demo mode! Reference: " \+ reference\.reference\);\s*return;\s*\}/,
  `if (demoMode && !user) {
      alert("Payment successful in demo mode! Reference: " + reference.reference);
      setNegotiations(prev => prev.map(n => n.id === selectedNegId ? {...n, payment_status: 'paid', payment_timing: 'before_delivery'} : n));
      return;
    }`
);

fs.writeFileSync('src/views/NegotiationCenter.tsx', code);
console.log('patched demo logic in NegCenter');
