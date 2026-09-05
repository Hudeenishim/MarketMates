const fs = require('fs');
let code = fs.readFileSync('src/components/TutorialOverlay.tsx', 'utf8');

code = code.replace(
  /title: 'Smart AI Negotiation',\n\s*subtitle: 'Our AI Assistant handles price haggling 24\/7 so you never miss a sale.',/g,
  "title: 'Negotiation & Payments',\n      subtitle: 'Haggle via chat and choose between Paystack or Pay on Delivery upon agreement.',"
);

fs.writeFileSync('src/components/TutorialOverlay.tsx', code);
