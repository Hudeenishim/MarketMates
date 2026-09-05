import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, getDoc, arrayUnion } from 'firebase/firestore';
import { Negotiation, Product, Profile } from '../types';
import { dummyNegotiations, dummyProducts } from '../lib/dummyData';
import { MessageCircle, CheckCircle, XCircle, ArrowRight, Mic, MicOff, Search, CreditCard, Phone, Send, Wallet } from 'lucide-react';
import { usePaystackPayment } from 'react-paystack';

import { ActivityLog } from '../components/ActivityLog';

// Polyfill for SpeechRecognition
const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;

interface RichNegotiation extends Negotiation {
  product?: Product;
  otherPartyName?: string;
  otherPartyPhone?: string;
}

export const NegotiationCenter: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, demoMode } = useAuth();
  const [negotiations, setNegotiations] = useState<RichNegotiation[]>([]);
  const [selectedNegId, setSelectedNegId] = useState<string | null>(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');

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
  
  
  const handlePayOnDelivery = async () => {
    if (!selectedNegId) return;
    if (demoMode && !user) {
      alert("Selected Pay on Delivery in demo mode!");
      setNegotiations(prev => prev.map(n => n.id === selectedNegId ? {...n, payment_timing: 'on_delivery'} : n));
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

  const handlePaymentSuccess = async (reference: any) => {
    if (!selectedNegId) return;
    if (demoMode && !user) {
      alert("Payment successful in demo mode! Reference: " + reference.reference);
      setNegotiations(prev => prev.map(n => n.id === selectedNegId ? {...n, payment_status: 'paid', payment_timing: 'before_delivery'} : n));
      return;
    }
    try {
      await updateDoc(doc(db, 'negotiations', selectedNegId), {
        payment_status: 'paid',
        payment_timing: 'before_delivery',
        updated_at: Date.now()
      });
      alert('Payment successful!');
    } catch (e) {
      console.error(e);
    }
  };

  // Slider state for counter-offers
  const [counterOfferValue, setCounterOfferValue] = useState<number>(0);
  const [message, setMessage] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-GH'; // Ghanaian English

      recognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setMessage(prev => prev ? `${prev} ${text}` : text);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  useEffect(() => {
    if (demoMode && !user) {
      const isVendor = profile.role === 'vendor';
      const dummyNegs = dummyNegotiations.filter(n => isVendor ? n.vendor_id === 'v1' : n.buyer_id === 'b1');
      const enriched = dummyNegs.map(n => ({
        ...n,
        product: dummyProducts.find(p => p.id === n.product_id),
        otherPartyName: isVendor ? 'Demo Buyer' : 'Demo Vendor',
        otherPartyPhone: '+233550000000'
      }));
      setNegotiations(enriched);
      if (enriched.length > 0) setSelectedNegId(enriched[0].id);
      return;
    }

    if (!user || !profile) return;

    const roleField = profile.role === 'vendor' ? 'vendor_id' : 'buyer_id';
    const q = query(collection(db, 'negotiations'), where(roleField, '==', user.uid));
    
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const negsPromises = snapshot.docs.map(async (nDoc) => {
        const data = nDoc.data() as Negotiation;
        const n: RichNegotiation = { id: nDoc.id, ...data };
        
        // Fetch product
        try {
          const pDoc = await getDoc(doc(db, 'products', data.product_id));
          if (pDoc.exists()) {
            n.product = { id: pDoc.id, ...pDoc.data() } as Product;
          }
          
          // Fetch other party name
          const otherId = profile.role === 'vendor' ? data.buyer_id : data.vendor_id;
          const userDoc = await getDoc(doc(db, 'profiles', otherId));
          if (userDoc.exists()) {
            n.otherPartyName = userDoc.data()?.full_name || 'Unknown User';
            n.otherPartyPhone = userDoc.data()?.phone_number || '';
          }
        } catch (err) {
          console.error("Error enriching negotiation", err);
        }
        
        return n;
      });

      const enrichedNegs = await Promise.all(negsPromises);
      // Sort by updated_at descending
      enrichedNegs.sort((a, b) => b.updated_at - a.updated_at);
      setNegotiations(enrichedNegs);
      
      if (enrichedNegs.length > 0 && !selectedNegId) {
        setSelectedNegId(enrichedNegs[0].id);
      }
    });

    return () => unsubscribe();
  }, [user, profile, demoMode]);

  const filteredNegotiations = negotiations.filter(neg => {
    const query = searchQuery.toLowerCase();
    const productName = neg.product?.name.toLowerCase() || '';
    const otherPartyName = neg.otherPartyName?.toLowerCase() || '';
    return productName.includes(query) || otherPartyName.includes(query);
  });

  const selectedNeg = negotiations.find(n => n.id === selectedNegId);

  useEffect(() => {
    if (selectedNeg && selectedNeg.product) {
       // Init slider to current offer or a default counter
       const baseOffer = selectedNeg.last_actor === profile?.role 
          ? (selectedNeg.current_counter_offer || selectedNeg.current_offer)
          : selectedNeg.current_offer;
       setCounterOfferValue(baseOffer);
    }
  }, [selectedNegId, selectedNeg]);


  const handleAction = async (action: 'accept' | 'reject' | 'counter' | 'chat') => {
    if (!selectedNeg || !profile) return;

    if (demoMode && !user) {
      alert(`Action ${action} taken in Demo Mode!`);
      return;
    }

    try {
      const negRef = doc(db, 'negotiations', selectedNeg.id);
      
      if (action === 'accept') {
        await updateDoc(negRef, { status: 'accepted', updated_at: Date.now(), last_actor: profile.role });
      } else if (action === 'reject') {
        await updateDoc(negRef, { status: 'rejected', updated_at: Date.now(), last_actor: profile.role });
      } else if (action === 'chat') {
        if (!message.trim()) return;
        await updateDoc(negRef, {
          updated_at: Date.now(),
          last_actor: profile.role,
          negotiation_history: arrayUnion({
            timestamp: Date.now(),
            actor: profile.role,
            offer: 0, // Using 0 for chat messages to satisfy firestore rules (offer is number)
            message: message.trim()
          })
        });
        setMessage(''); // Clear message after sending
      } else if (action === 'counter') {
        await updateDoc(negRef, {
          current_counter_offer: counterOfferValue,
          current_offer: counterOfferValue, // Simplification: we just update the active offer
          last_actor: profile.role,
          updated_at: Date.now(),
          negotiation_history: arrayUnion({
            timestamp: Date.now(),
            actor: profile.role,
            offer: counterOfferValue,
            ...(message.trim() ? { message: message.trim() } : {})
          })
        });
        setMessage(''); // Clear message after sending
      }
    } catch (err) {
      console.error("Error updating negotiation", err);
    }
  };

  if (negotiations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <MessageCircle className="w-10 h-10 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">No Active Negotiations</h2>
        <p className="text-slate-500 text-center max-w-md">
          {profile?.role === 'vendor' 
            ? "When buyers make an offer on your products, they will appear here." 
            : "When you make offers on products in the market, you can track them here."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full animate-in fade-in duration-500 overflow-hidden">
      
      {/* Left Column (Activity Log + Sidebar List) */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6 overflow-hidden">
        {/* Activity Log (Fixed Height or Flexible) */}
        <div className="flex-shrink-0 h-1/3 min-h-[250px]">
          <ActivityLog negotiations={negotiations} userRole={profile?.role} />
        </div>

        {/* Conversations Sidebar List */}
        <div className="flex-1 bg-white rounded-[2rem] shadow-sm border border-slate-100 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Conversations</h2>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search negotiations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 w-full rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#10B981] outline-none transition-all text-sm font-medium bg-white"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredNegotiations.length === 0 ? (
            <div className="text-center text-slate-500 py-4 text-sm">
              No negotiations found.
            </div>
          ) : (
            filteredNegotiations.map(neg => {
            const isMyTurn = neg.status === 'open' && neg.last_actor !== profile?.role;
            return (
              <button
                key={neg.id}
                onClick={() => setSelectedNegId(neg.id)}
                className={`w-full text-left p-4 rounded-2xl transition-all flex items-start gap-4 ${
                  selectedNegId === neg.id
                    ? 'bg-emerald-50 border-2 border-[#10B981] shadow-sm'
                    : 'bg-white border-2 border-transparent hover:bg-slate-50 hover:border-slate-200'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                  {neg.product?.image_url ? (
                    <img src={neg.product.image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">No img</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-slate-900 truncate pr-2">{neg.product?.name || 'Unknown Product'}</span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                      neg.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' :
                      neg.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {neg.status === 'open' ? 'In Progress' : neg.status === 'accepted' ? 'Accepted' : 'Rejected'}
                    </span>
                  </div>
                  <div className="text-sm text-slate-500 truncate">
                    {neg.otherPartyName}
                  </div>
                </div>
              </button>
            )
          }))}
        </div>
      </div>
      </div>

      {/* Main Detail Area */}
      <div className="w-full lg:w-2/3 bg-white rounded-[2rem] shadow-sm border border-slate-100 flex flex-col overflow-hidden">
        {selectedNeg ? (
          <>
            <div className="p-8 sm:p-10 border-b border-slate-100 flex justify-between items-center bg-white">
              <div className="flex flex-col justify-center">
                <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">{selectedNeg.product?.name}</h3>
                <div className="flex items-center gap-3 text-slate-500 text-base sm:text-lg">
                  <span>Negotiating with {selectedNeg.otherPartyName}</span>
                  {selectedNeg.otherPartyPhone ? (
                    <a href={"tel:" + selectedNeg.otherPartyPhone} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 font-bold transition-colors text-sm shadow-md shadow-emerald-200">
                      <Phone className="w-4 h-4" />
                      Call {selectedNeg.otherPartyName?.split(' ')[0]}
                    </a>
                  ) : (
                    <button onClick={() => alert('This user has not provided a phone number.')} className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 text-slate-400 rounded-full font-bold transition-colors text-sm">
                      <Phone className="w-4 h-4" />
                      No Phone
                    </button>
                  )}
                </div>
              </div>
              <div className="text-right flex flex-col justify-center">
                <div className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-1">Listed Price</div>
                <div className="text-3xl sm:text-4xl font-bold text-slate-900">₵{(selectedNeg.product?.price_ghs || 0) * (selectedNeg.quantity || 1)}</div>
                <div className="text-xs text-slate-500 font-bold mt-1 text-right">
                  {selectedNeg.quantity || 1} {selectedNeg.product?.unit || 'unit'} at ₵{selectedNeg.product?.price_ghs}/each
                </div>
              </div>
            </div>

            <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-[#F9FAFB] flex flex-col justify-end">
              
              <div className="max-w-xl mx-auto space-y-8">
                
                {/* History Timeline */}
                {selectedNeg.negotiation_history && selectedNeg.negotiation_history.length > 0 && (
                  <div className="space-y-4 mb-8">
                    {selectedNeg.negotiation_history.map((event, idx) => {
                      const isMe = event.actor === profile?.role;
                      return (
                        <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[75%] p-4 rounded-2xl ${isMe ? 'bg-slate-900 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'}`}>
                            <div className="flex justify-between items-baseline gap-4 mb-1">
                              <span className="text-xs font-bold opacity-75">{isMe ? 'You' : selectedNeg.otherPartyName}</span>
                              <span className="text-[10px] opacity-50">{new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            {event.offer !== null && event.offer !== undefined && (
                              <div className="text-lg font-bold">
                                ₵{event.offer}
                              </div>
                            )}
                            {event.message && (
                              <div className="text-sm mt-1 opacity-90 italic">
                                "{event.message}"
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Current Status Card */}
                <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[2rem] text-center shadow-sm">
                  <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-2">
                    {selectedNeg.status === 'accepted' ? 'Deal Reached' : 
                     selectedNeg.status === 'rejected' ? 'Deal Closed' : 
                     'Current Active Offer'}
                  </div>
                  <div className="text-5xl font-black text-[#10B981] mb-2">
                    ₵{selectedNeg.current_offer}
                  </div>
                  <div className="text-emerald-700 text-sm font-medium">
                    Proposed by {selectedNeg.last_actor === profile?.role ? 'You' : selectedNeg.otherPartyName}
                  </div>
                </div>
                {selectedNeg.status === 'accepted' && (
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
                )}

                {/* Sticky Footer Chat Actions */}
                {selectedNeg.status === 'open' && (
                  <div className="sticky bottom-0 bg-white border-t border-slate-100 p-4 sm:p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] rounded-b-[2rem] mt-auto">
                    {selectedNeg.last_actor !== profile?.role ? (
                      <div className="flex flex-col gap-4">
                        <div className="flex gap-2 mb-2">
                          <button 
                            onClick={() => handleAction('accept')}
                            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm shadow-emerald-200"
                          >
                            <CheckCircle className="w-5 h-5" /> Accept ₵{selectedNeg.current_offer}
                          </button>
                          <button 
                            onClick={() => handleAction('reject')}
                            className="flex-1 bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                          >
                            <XCircle className="w-5 h-5" /> Decline
                          </button>
                        </div>
                        <div className="relative">
                           <div className="absolute inset-0 flex items-center">
                             <div className="w-full border-t border-slate-200"></div>
                           </div>
                           <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-400">
                             <span className="px-4 bg-white">Or Counter Offer</span>
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="relative flex-shrink-0 w-28 sm:w-32">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₵</span>
                            <input
                              type="number"
                              min={1}
                              value={counterOfferValue || ''}
                              onChange={(e) => setCounterOfferValue(Number(e.target.value))}
                              className="w-full pl-8 pr-3 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#10B981] outline-none font-bold text-slate-900 bg-slate-50"
                              placeholder="Offer"
                            />
                          </div>
                          <div className="relative flex-1">
                            <input
                              type="text"
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              placeholder="Message..."
                              className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#10B981] outline-none text-sm bg-slate-50"
                              onKeyDown={(e) => { if(e.key === 'Enter') handleAction('counter'); }}
                            />
                            <button
                              onClick={toggleRecording}
                              className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors ${
                                isRecording 
                                  ? 'text-red-500 bg-red-50 animate-pulse' 
                                  : 'text-slate-400 hover:text-[#10B981] hover:bg-emerald-50'
                              }`}
                            >
                              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                            </button>
                          </div>
                          <button 
                            onClick={() => handleAction('counter')}
                            className="bg-slate-900 text-white p-3 rounded-xl hover:bg-slate-800 transition-colors shadow-md"
                          >
                            <Send className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <div className="text-center p-4 rounded-xl bg-amber-50 border border-amber-100">
                          <div className="text-amber-700 text-sm font-bold flex items-center justify-center gap-2">
                            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                            Waiting for {selectedNeg.otherPartyName} to respond...
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="relative flex-1">
                            <input
                              type="text"
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              placeholder="Send a follow-up message..."
                              className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#10B981] outline-none text-sm bg-slate-50"
                              onKeyDown={(e) => { if(e.key === 'Enter') handleAction('chat'); }}
                            />
                            <button
                              onClick={toggleRecording}
                              className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors ${
                                isRecording 
                                  ? 'text-red-500 bg-red-50 animate-pulse' 
                                  : 'text-slate-400 hover:text-[#10B981] hover:bg-emerald-50'
                              }`}
                            >
                              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                            </button>
                          </div>
                          <button 
                            onClick={() => handleAction('chat')}
                            disabled={!message.trim()}
                            className="bg-slate-900 text-white p-3 rounded-xl hover:bg-slate-800 transition-colors shadow-md disabled:opacity-50"
                          >
                            <Send className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500 p-8">
            Select a conversation from the list to view details
          </div>
        )}
      </div>

    </div>
  );
};
