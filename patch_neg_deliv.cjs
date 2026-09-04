const fs = require('fs');
let code = fs.readFileSync('src/views/NegotiationCenter.tsx', 'utf8');

// I will add a new check for "Deal Reached" to show "Request Delivery" if no delivery exists yet,
// but for simplicity, let's just make it a button "Setup Delivery" that navigates to the delivery page with the negotiation ID.
code = code.replace(
  /\{selectedNeg\.status === 'accepted' \? 'Deal Reached' :/g,
  `{selectedNeg.status === 'accepted' ? 'Deal Reached' :`
);

// We need a button to go to deliveries. We can add it inside the Current Status Card for accepted ones.
const acceptedStatusRegex = /<div className="text-emerald-700 text-sm font-medium">\s*Proposed by \{selectedNeg\.last_actor === profile\?\.role \? 'You' : selectedNeg\.otherPartyName\}\s*<\/div>\s*<\/div>/;

code = code.replace(acceptedStatusRegex, (match) => {
  return `${match}
                {selectedNeg.status === 'accepted' && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={() => window.location.href = '/deliveries?neg_id=' + selectedNeg.id}
                      className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
                    >
                      Arrange Delivery
                    </button>
                  </div>
                )}`;
});

fs.writeFileSync('src/views/NegotiationCenter.tsx', code);
