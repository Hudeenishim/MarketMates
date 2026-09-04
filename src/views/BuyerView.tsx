import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, getDocs, addDoc } from 'firebase/firestore';
import { Product, Market, Profile, Negotiation } from '../types';
import { dummyProducts, dummyMarkets, dummyNegotiations, dummyProfiles } from '../lib/dummyData';
import { CustomSelect } from '../components/CustomSelect';
import { MapPin, Menu, X, Map, Package, Search, Navigation, Mic, MicOff, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


// Polyfill for SpeechRecognition
const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;


export const BuyerView: React.FC = () => {
  const { user, demoMode } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
    const [myNegotiations, setMyNegotiations] = useState<Negotiation[]>([]);
      const [vendorProfiles, setVendorProfiles] = useState<Record<string, Profile>>({});
  
  // Negotiation Modal State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [offerPrice, setOfferPrice] = useState<number>(0);
  const [offerMessage, setOfferMessage] = useState<string>('');
  const [isOfferRecording, setIsOfferRecording] = useState(false);
  const offerRecognitionRef = useRef<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const [isSearchRecording, setIsSearchRecording] = useState(false);
  const searchRecognitionRef = useRef<any>(null);

  const categories = Array.from(new Set(products.map(p => p.category)));

  useEffect(() => {
    if (SpeechRecognition) {
      searchRecognitionRef.current = new SpeechRecognition();
      offerRecognitionRef.current = new SpeechRecognition();
      offerRecognitionRef.current.continuous = false;
      offerRecognitionRef.current.interimResults = false;
      offerRecognitionRef.current.lang = 'en-GH';
      offerRecognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        const numMatch = text.match(/\d+/);
        if (numMatch && text.trim().length <= numMatch[0].length + 4) {
          setOfferPrice(Number(numMatch[0]));
        } else {
          setOfferMessage(prev => prev ? `${prev} ${text}` : text);
        }
      };
      offerRecognitionRef.current.onend = () => setIsOfferRecording(false);

      searchRecognitionRef.current.continuous = false;
      searchRecognitionRef.current.interimResults = false;
      searchRecognitionRef.current.lang = 'en-GH'; // Ghanaian English

      searchRecognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setSearchQuery(text);
      };

      searchRecognitionRef.current.onend = () => {
        setIsSearchRecording(false);
      };
    }
  }, []);

  const toggleOfferRecording = () => {
    if (isOfferRecording) {
      offerRecognitionRef.current?.stop();
      setIsOfferRecording(false);
    } else {
      offerRecognitionRef.current?.start();
      setIsOfferRecording(true);
    }
  };

  const toggleSearchRecording = () => {
    if (isSearchRecording) {
      searchRecognitionRef.current?.stop();
      setIsSearchRecording(false);
    } else {
      searchRecognitionRef.current?.start();
      setIsSearchRecording(true);
    }
  };

  useEffect(() => {
    if (demoMode && !user) {
            setProducts(dummyProducts);
      setMyNegotiations(dummyNegotiations.filter(n => n.buyer_id === 'b1'));
      setVendorProfiles(dummyProfiles);
      return;
    }

    if (!user) return;

    
    // Fetch Vendor Profiles
    getDocs(query(collection(db, 'profiles'), where('role', '==', 'vendor'))).then((snapshot) => {
      const profiles: Record<string, Profile> = {};
      snapshot.forEach(doc => {
        profiles[doc.id] = { id: doc.id, ...doc.data() } as Profile;
      });
      setVendorProfiles(profiles);
    });

    // Fetch Products (Initially all)
    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      const prods: Product[] = [];
      snapshot.forEach(doc => prods.push({ id: doc.id, ...doc.data() } as Product));
      setProducts(prods);
    });
    
    // Fetch my negotiations
    const negQ = query(collection(db, 'negotiations'), where('buyer_id', '==', user.uid));
    const unsubNegs = onSnapshot(negQ, (snapshot) => {
      const negs: Negotiation[] = [];
      snapshot.forEach(doc => negs.push({ id: doc.id, ...doc.data() } as Negotiation));
      setMyNegotiations(negs);
    });

    return () => {
      unsubProducts();
      unsubNegs();
    };
  }, [demoMode, user]);


  const filteredProducts = products.filter(p => {
        const matchesSearch = searchQuery 
      ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
    
    return matchesSearch && matchesCategory;
  });

  const handleStartNegotiation = (product: Product) => {
    setSelectedProduct(product);
    setOfferPrice(Math.floor(product.price_ghs * 0.8)); // Default 80% offer
    setOfferMessage('');
  };

  const submitOffer = async () => {
    if (!selectedProduct) return;

    if (demoMode && !user) {
      alert("Offer sent in Demo Mode!");
      setSelectedProduct(null);
      navigate('/negotiations');
      return;
    }

    if (!user) return;

    try {
      await addDoc(collection(db, 'negotiations'), {
        product_id: selectedProduct.id,
        buyer_id: user.uid,
        vendor_id: selectedProduct.vendor_id,
        current_offer: offerPrice,
        last_actor: 'buyer',
        status: 'open',
        created_at: Date.now(),
        updated_at: Date.now(),
        negotiation_history: [{
          timestamp: Date.now(),
          actor: 'buyer',
          offer: offerPrice,
          ...(offerMessage.trim() ? { message: offerMessage.trim() } : {})
        }]
      });
      setSelectedProduct(null);
      navigate('/negotiations');
    } catch (err) {
      console.error("Error creating negotiation", err);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 min-h-[80vh] pb-32 relative">
      {/* Product Catalog */}
      <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100 h-auto min-h-fit pb-12 flex-shrink-0 overflow-visible">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
          <h2 className="text-xl font-bold text-slate-900">
            All Available Products
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-10 py-2 w-full sm:w-64 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#10B981] outline-none transition-all text-sm font-medium bg-slate-50"
              />
              <button 
                onClick={toggleSearchRecording}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${
                  isSearchRecording ? 'bg-red-100 text-red-500 animate-pulse' : 'text-slate-400 hover:text-emerald-500 hover:bg-emerald-50'
                }`}
              >
                {isSearchRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>
            {categories.length > 0 && (
              <CustomSelect 
                value={selectedCategory || ''} 
                onChange={(val) => setSelectedCategory(val === '' ? null : val)} 
                options={[{value: '', label: 'All Categories'}, ...categories.map(c => ({value: c, label: c}))]}
                className="w-48"
              />
            )}
          </div>
        </div>

        <div className="pb-12 space-y-8">
          {filteredProducts.length === 0 ? (
            <div className="py-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium text-sm">No products found matching your search.</p>
            </div>
          ) : (
            (Object.entries(
              filteredProducts.reduce((acc, product) => {
                const cat = product.category || 'Other';
                if (!acc[cat]) acc[cat] = [];
                acc[cat].push(product);
                return acc;
              }, {} as Record<string, Product[]>)
            ) as [string, Product[]][]).sort(([a], [b]) => a.localeCompare(b)).map(([category, prods]) => (
              <div key={category} className="space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
                  <h3 className="text-lg font-bold text-slate-900">{category}</h3>
                  <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">{prods.length}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {prods.map(product => {
                    const activeNeg = myNegotiations.find(n => n.product_id === product.id);
                    return (
                      <div key={product.id} className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100/50 hover:shadow-md transition-all group flex flex-col relative">
                        {activeNeg && (
                          <div className="absolute top-2 right-2 z-10">
                            <span className={`text-[10px] uppercase font-bold px-3 py-1 rounded-full shadow-sm ${
                              activeNeg.status === 'accepted' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                              activeNeg.status === 'rejected' ? 'bg-red-100 text-red-700 border border-red-200' :
                              'bg-amber-100 text-amber-700 border border-amber-200'
                            }`}>
                              {activeNeg.status === 'open' ? 'In Progress' : activeNeg.status === 'accepted' ? 'Accepted' : 'Rejected'}
                            </span>
                          </div>
                        )}
                        <div className="h-40 bg-slate-200 rounded-2xl mb-3 overflow-hidden relative">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} referrerPolicy="no-referrer" className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">No Image</div>
                          )}
                          
                          {!product.stock_status && (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                              <span className="font-bold text-slate-800 bg-white px-4 py-2 rounded-full text-xs">Out of Stock</span>
                            </div>
                          )}
                          {product.stock_status && product.stock_quantity !== undefined && product.stock_quantity <= 5 && (
                            <div className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-1 rounded-lg text-[10px] font-bold shadow-sm">
                              Only {product.stock_quantity} {product.unit || 'pcs'} left
                            </div>
                          )}
                        </div>
                        <div className="flex-1 flex flex-col">
                          <span className="text-[10px] font-bold text-emerald-600 uppercase mb-1">{product.category}</span>
                          <h4 className="text-sm font-bold text-slate-900 mb-1 leading-tight">{product.name}</h4>
                          {vendorProfiles[product.vendor_id]?.rating && (
                            <div className="flex items-center gap-1 mb-2">
                              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                              <span className="text-xs font-bold text-slate-700">{vendorProfiles[product.vendor_id].rating}</span>
                              <span className="text-xs text-slate-400">({vendorProfiles[product.vendor_id].review_count || 0})</span>
                              <span className="text-xs text-slate-400 ml-1 truncate"> • {vendorProfiles[product.vendor_id].full_name}</span>
                            </div>
                          )}
                          <p className="text-xs text-slate-500 mb-4 line-clamp-2 flex-1">{product.description}</p>
                          
                          <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                            <div className="text-sm font-bold text-emerald-600">₵{product.price_ghs.toFixed(2)}</div>
                            <button
                              disabled={!product.stock_status}
                              onClick={() => activeNeg ? navigate('/negotiations') : handleStartNegotiation(product)}
                              className="px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-colors"
                            >
                              {activeNeg ? 'View Chat' : 'Negotiate'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Negotiation Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 md:p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Make an Offer</h3>
              <p className="text-slate-500 mb-6 text-sm">Negotiate price for {selectedProduct.name}</p>
              
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl mb-8 border border-slate-100">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Asking Price</div>
                  <div className="text-xl font-bold text-slate-900">₵{selectedProduct.price_ghs}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-emerald-600 mb-1">Your Offer</div>
                  <div className="text-3xl font-black text-[#10B981]">₵{offerPrice}</div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Type or slide to adjust your offer (₵)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={offerPrice || ''}
                    onChange={(e) => setOfferPrice(Number(e.target.value))}
                    className="w-full px-4 py-3 mb-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#10B981] outline-none text-sm font-bold text-slate-900 transition-all"
                    placeholder="Enter offer amount..."
                  />
                  <input 
                    type="range" 
                    min={Math.floor(selectedProduct.price_ghs * 0.3)} 
                    max={selectedProduct.price_ghs} 
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(Number(e.target.value))}
                    className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#10B981]"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-2 font-bold mb-6">
                    <span>₵{Math.floor(selectedProduct.price_ghs * 0.3)} (30%)</span>
                    <span>₵{selectedProduct.price_ghs} (Full)</span>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      value={offerMessage}
                      onChange={(e) => setOfferMessage(e.target.value)}
                      placeholder="Add a message or use voice..."
                      className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#10B981] outline-none text-sm transition-all"
                    />
                    <button
                      onClick={toggleOfferRecording}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors ${
                        isOfferRecording 
                          ? 'text-red-500 bg-red-50 animate-pulse' 
                          : 'text-slate-400 hover:text-[#10B981] hover:bg-emerald-50'
                      }`}
                      title="Speak your offer or message"
                    >
                      {isOfferRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 p-6 border-t border-slate-100 flex gap-4">
              <button 
                onClick={() => setSelectedProduct(null)}
                className="flex-1 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={submitOffer}
                className="flex-1 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200 text-sm"
              >
                Send Offer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
