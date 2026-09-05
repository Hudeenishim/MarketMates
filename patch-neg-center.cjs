const fs = require('fs');
let code = fs.readFileSync('src/views/NegotiationCenter.tsx', 'utf8');

// Imports
code = code.replace(
  /import { MessageCircle, CheckCircle, XCircle, ArrowRight, Mic, MicOff, Search } from 'lucide-react';/,
  `import { MessageCircle, CheckCircle, XCircle, ArrowRight, Mic, MicOff, Search, CreditCard } from 'lucide-react';\nimport { usePaystackPayment } from 'react-paystack';`
);

// Component logic
code = code.replace(
  /const \[searchQuery, setSearchQuery\] = useState\(''\);/,
  `const [searchQuery, setSearchQuery] = useState('');

  // Paystack Config
  const selectedNegForPayment = negotiations.find(n => n.id === selectedNegId);
  const paystackConfig = {
    reference: (new Date()).getTime().toString(),
    email: profile?.email || 'buyer@marketmates.com',
    amount: (selectedNegForPayment?.current_offer || 0) * 100, // Amount in pesewas
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_c3fbb39c5b4b1a4a6e5b51a0212f45cc339a0378', // Use dummy test key if missing
    currency: 'GHS'
  };
  const initializePayment = usePaystackPayment(paystackConfig);
  
  const handlePaymentSuccess = async (reference: any) => {
    if (!selectedNegId) return;
    if (demoMode && !user) {
      alert("Payment successful in demo mode! Reference: " + reference.reference);
      return;
    }
    try {
      await updateDoc(doc(db, 'negotiations', selectedNegId), {
        payment_status: 'paid',
        updated_at: Date.now()
      });
      alert('Payment successful!');
    } catch (e) {
      console.error(e);
    }
  };`
);

// Listed Price UI to show quantity
code = code.replace(
  /<div className="text-3xl sm:text-4xl font-bold text-slate-900">₵\{selectedNeg\.product\?\.price_ghs\}<\/div>/,
  `<div className="text-3xl sm:text-4xl font-bold text-slate-900">₵{(selectedNeg.product?.price_ghs || 0) * (selectedNeg.quantity || 1)}</div>
                <div className="text-xs text-slate-500 font-bold mt-1 text-right">
                  {selectedNeg.quantity || 1} {selectedNeg.product?.unit || 'unit'} at ₵{selectedNeg.product?.price_ghs}/each
                </div>`
);

// Accepted Status & Payment UI
code = code.replace(
  /\{selectedNeg\.status === 'accepted' && \(\s*<div className="mt-8 text-center">\s*<button\s*onClick=\{[^}]+\}\s*className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"\s*>\s*Arrange Delivery\s*<\/button>\s*<\/div>\s*\)\}/,
  `{selectedNeg.status === 'accepted' && (
                  <div className="mt-8 text-center flex flex-col gap-4 items-center">
                    {profile?.role === 'buyer' && selectedNeg.payment_status !== 'paid' && (
                      <button
                        onClick={() => {
                           if (demoMode && !user) {
                             alert("Paid via demo mode!");
                             return;
                           }
                           initializePayment({onSuccess: handlePaymentSuccess, onClose: () => console.log('closed')});
                        }}
                        className="px-6 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
                      >
                        <CreditCard className="w-5 h-5" /> Pay Now (₵{selectedNeg.current_offer})
                      </button>
                    )}
                    
                    {profile?.role === 'vendor' && selectedNeg.payment_status !== 'paid' && (
                       <div className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl">
                          Waiting for Buyer to Pay...
                       </div>
                    )}
                    
                    {selectedNeg.payment_status === 'paid' && (
                      <div className="px-6 py-3 bg-emerald-100 text-emerald-800 font-bold rounded-xl flex items-center justify-center gap-2">
                        <CheckCircle className="w-5 h-5" /> Paid Successfully
                      </div>
                    )}

                    <button
                      onClick={() => navigate('/deliveries?neg_id=' + selectedNeg.id)}
                      className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
                    >
                      Arrange Delivery
                    </button>
                  </div>
                )}`
);

fs.writeFileSync('src/views/NegotiationCenter.tsx', code);
console.log('patched NegCenter');
