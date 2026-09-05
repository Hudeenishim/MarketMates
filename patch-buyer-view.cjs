const fs = require('fs');
let code = fs.readFileSync('src/views/BuyerView.tsx', 'utf8');

// Add quantity state
code = code.replace(
  /const \[offerPrice, setOfferPrice\] = useState<number>\(0\);/,
  `const [offerPrice, setOfferPrice] = useState<number>(0);\n  const [quantity, setQuantity] = useState<number>(1);`
);

// Reset quantity when starting negotiation
code = code.replace(
  /setOfferPrice\(Math\.floor\(product\.price_ghs \* 0\.8\)\); \/\/ Default 80% offer/,
  `setOfferPrice(Math.floor(product.price_ghs * 0.8)); // Default 80% offer for 1 unit\n    setQuantity(1);`
);

// Update submitOffer to include quantity
code = code.replace(
  /current_offer: offerPrice,/,
  `current_offer: offerPrice,\n        quantity: quantity,`
);

// Replace the asking price UI block
code = code.replace(
  /<div>\s*<div className="text-\[10px\] uppercase font-bold text-slate-400 mb-1">Asking Price<\/div>\s*<div className="text-xl font-bold text-slate-900">₵\{selectedProduct\.price_ghs\}<\/div>\s*<\/div>/,
  `<div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Asking Price (Total)</div>
                  <div className="text-xl font-bold text-slate-900">₵{(selectedProduct.price_ghs * quantity).toFixed(2)}</div>
                  <div className="text-xs text-slate-500 font-bold mt-1">₵{selectedProduct.price_ghs} / {selectedProduct.unit || 'unit'}</div>
                </div>`
);

// Add quantity selector UI just above the offer slider
code = code.replace(
  /<div>\s*<label className="block text-sm font-bold text-slate-700 mb-2">\s*Type or slide to adjust your offer \(₵\)\s*<\/label>/,
  `<div className="mb-6 flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <label className="text-sm font-bold text-slate-700">Quantity Required:</label>
                  <div className="flex items-center gap-4">
                    <button onClick={() => { setQuantity(Math.max(1, quantity - 1)); setOfferPrice(Math.floor(selectedProduct.price_ghs * Math.max(1, quantity - 1) * 0.8)); }} className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-full font-bold text-slate-700">-</button>
                    <span className="font-bold text-lg text-slate-900">{quantity}</span>
                    <button onClick={() => { setQuantity(Math.min(selectedProduct.stock_quantity || 999, quantity + 1)); setOfferPrice(Math.floor(selectedProduct.price_ghs * Math.min(selectedProduct.stock_quantity || 999, quantity + 1) * 0.8)); }} className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-full font-bold text-slate-700">+</button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Type or slide to adjust your total offer (₵)
                  </label>`
);

// Fix the range min/max dynamically based on quantity
code = code.replace(
  /min=\{Math\.floor\(selectedProduct\.price_ghs \* 0\.3\)\}/g,
  `min={Math.floor(selectedProduct.price_ghs * quantity * 0.3)}`
);
code = code.replace(
  /max=\{selectedProduct\.price_ghs\}/g,
  `max={selectedProduct.price_ghs * quantity}`
);
code = code.replace(
  /<span>₵\{Math\.floor\(selectedProduct\.price_ghs \* 0\.3\)\} \(30\%\)<\/span>/g,
  `<span>₵{Math.floor(selectedProduct.price_ghs * quantity * 0.3)} (30%)</span>`
);
code = code.replace(
  /<span>₵\{selectedProduct\.price_ghs\} \(Full\)<\/span>/g,
  `<span>₵{selectedProduct.price_ghs * quantity} (Full)</span>`
);

fs.writeFileSync('src/views/BuyerView.tsx', code);
console.log('patched BuyerView.tsx');
