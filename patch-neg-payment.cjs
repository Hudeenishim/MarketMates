const fs = require('fs');
let code = fs.readFileSync('src/views/NegotiationCenter.tsx', 'utf8');

// Replace imports to include Wallet
code = code.replace(
  /Search, CreditCard, Phone, Send/,
  "Search, CreditCard, Phone, Send, Wallet"
);

// Add handlePayOnDelivery logic
const handlePayOnDeliveryLogic = `
  const handlePayOnDelivery = async () => {
    if (!selectedNegId) return;
    if (demoMode && !user) {
      alert("Selected Pay on Delivery in demo mode!");
      return;
    }
    try {
      await updateDoc(doc(db, 'negotiations', selectedNegId), {
        payment_timing: 'on_delivery',
        updated_at: Date.now()
      });
      alert('Selected Pay on Delivery!');
    } catch (e) {
      console.error(e);
    }
  };
`;

code = code.replace(
  /const handlePaymentSuccess = async \(reference: any\) => \{/,
  handlePayOnDeliveryLogic + '\n  const handlePaymentSuccess = async (reference: any) => {'
);

// We need to make sure handlePaymentSuccess also sets payment_timing: 'before_delivery'
code = code.replace(
  /payment_status: 'paid',/,
  "payment_status: 'paid',\n        payment_timing: 'before_delivery',"
);

// Now replace the UI block for accepted deals
const oldAcceptedBlock = `{selectedNeg.status === 'accepted' && (
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
                )}`;

const newAcceptedBlock = `{selectedNeg.status === 'accepted' && (
                  <div className="mt-8 text-center flex flex-col gap-4 items-center w-full max-w-sm mx-auto">
                    {profile?.role === 'buyer' && selectedNeg.payment_status !== 'paid' && !selectedNeg.payment_timing && (
                      <div className="w-full flex flex-col gap-3">
                        <p className="text-sm font-bold text-slate-700 mb-2">Choose Payment Method:</p>
                        <button
                          onClick={() => {
                             if (demoMode && !user) {
                               alert("Paid via demo mode!");
                               return;
                             }
                             initializePayment({onSuccess: handlePaymentSuccess, onClose: () => console.log('closed')});
                          }}
                          className="w-full py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
                        >
                          <CreditCard className="w-5 h-5" /> Pay Now (₵{selectedNeg.current_offer})
                        </button>
                        <button
                          onClick={handlePayOnDelivery}
                          className="w-full py-3 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                        >
                          <Wallet className="w-5 h-5" /> Pay on Delivery
                        </button>
                      </div>
                    )}

                    {profile?.role === 'buyer' && selectedNeg.payment_timing === 'on_delivery' && selectedNeg.payment_status !== 'paid' && (
                      <div className="px-6 py-3 bg-amber-100 text-amber-800 font-bold rounded-xl flex items-center justify-center gap-2 w-full">
                        <Wallet className="w-5 h-5" /> Payment on Delivery Selected
                      </div>
                    )}
                    
                    {profile?.role === 'vendor' && selectedNeg.payment_status !== 'paid' && !selectedNeg.payment_timing && (
                       <div className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl w-full">
                          Waiting for Buyer to choose payment method...
                       </div>
                    )}

                    {profile?.role === 'vendor' && selectedNeg.payment_timing === 'on_delivery' && selectedNeg.payment_status !== 'paid' && (
                       <div className="px-6 py-3 bg-amber-100 text-amber-800 font-bold rounded-xl w-full">
                          Buyer selected Pay on Delivery.
                       </div>
                    )}
                    
                    {selectedNeg.payment_status === 'paid' && (
                      <div className="px-6 py-3 bg-emerald-100 text-emerald-800 font-bold rounded-xl flex items-center justify-center gap-2 w-full">
                        <CheckCircle className="w-5 h-5" /> Paid Successfully
                      </div>
                    )}

                    {((selectedNeg.payment_status === 'paid') || (selectedNeg.payment_timing === 'on_delivery')) && (
                      <button
                        onClick={() => navigate('/deliveries?neg_id=' + selectedNeg.id)}
                        className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200 mt-4"
                      >
                        Arrange Delivery
                      </button>
                    )}
                  </div>
                )}`;

code = code.replace(oldAcceptedBlock, newAcceptedBlock);
fs.writeFileSync('src/views/NegotiationCenter.tsx', code);
console.log('patched payment options');
