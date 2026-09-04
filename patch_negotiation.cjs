const fs = require('fs');
let code = fs.readFileSync('src/views/NegotiationCenter.tsx', 'utf8');

// Update handleAction
code = code.replace(
  `} else if (action === 'counter') {`,
  `} else if (action === 'chat') {
        if (!message.trim()) return;
        await updateDoc(negRef, {
          updated_at: Date.now(),
          negotiation_history: arrayUnion({
            timestamp: Date.now(),
            actor: profile.role,
            offer: null, // Just a message
            message: message.trim()
          })
        });
        setMessage(''); // Clear message after sending
      } else if (action === 'counter') {`
);

// Update UI: Replace the counter slider with a numeric input
const sliderRegex = /<span className="text-slate-700 font-bold text-sm">Your Counter<\/span>[\s\S]*?<input\s+type="range"[\s\S]*?\/>/;
code = code.replace(
  sliderRegex,
  `<label className="text-slate-700 font-bold text-sm">Your Counter Offer (₵)</label>
                        <input
                          type="number"
                          min={1}
                          value={counterOfferValue || ''}
                          onChange={(e) => setCounterOfferValue(Number(e.target.value))}
                          placeholder="Type your offer amount..."
                          className="w-full mt-2 mb-6 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#10B981] outline-none text-sm font-bold text-slate-900 transition-all"
                        />`
);

// We should also allow sending just a message
// Wait, the action area should allow chatting.
// But first, let's look at the history display. What if offer is null?
fs.writeFileSync('src/views/NegotiationCenter.tsx', code);
