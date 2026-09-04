const fs = require('fs');
let code = fs.readFileSync('src/views/BuyerView.tsx', 'utf8');

// 1. Add state for offerMessage and isOfferRecording
code = code.replace(
  /const \[offerPrice, setOfferPrice\] = useState<number>\(0\);/,
  `const [offerPrice, setOfferPrice] = useState<number>(0);
  const [offerMessage, setOfferMessage] = useState<string>('');
  const [isOfferRecording, setIsOfferRecording] = useState(false);
  const offerRecognitionRef = useRef<any>(null);`
);

// 2. Add offerRecognitionRef setup inside useEffect
const useEffectStart = `  useEffect(() => {
    if (SpeechRecognition) {
      searchRecognitionRef.current = new SpeechRecognition();`;
const newUseEffectStart = `  useEffect(() => {
    if (SpeechRecognition) {
      searchRecognitionRef.current = new SpeechRecognition();
      offerRecognitionRef.current = new SpeechRecognition();
      offerRecognitionRef.current.continuous = false;
      offerRecognitionRef.current.interimResults = false;
      offerRecognitionRef.current.lang = 'en-GH';
      offerRecognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        const numMatch = text.match(/\\d+/);
        if (numMatch && text.trim().length <= numMatch[0].length + 4) {
          setOfferPrice(Number(numMatch[0]));
        } else {
          setOfferMessage(prev => prev ? \`\${prev} \${text}\` : text);
        }
      };
      offerRecognitionRef.current.onend = () => setIsOfferRecording(false);
`;
code = code.replace(useEffectStart, newUseEffectStart);

// 3. Add toggleOfferRecording function
const toggleSearchFunc = `  const toggleSearchRecording = () => {`;
const newToggleFunc = `  const toggleOfferRecording = () => {
    if (isOfferRecording) {
      offerRecognitionRef.current?.stop();
      setIsOfferRecording(false);
    } else {
      offerRecognitionRef.current?.start();
      setIsOfferRecording(true);
    }
  };

  const toggleSearchRecording = () => {`;
code = code.replace(toggleSearchFunc, newToggleFunc);

// 4. Update submitOffer to include the message
code = code.replace(
  /offer: offerPrice\n\s*\}\]\n\s*\}/,
  `offer: offerPrice,
          ...(offerMessage.trim() ? { message: offerMessage.trim() } : {})
        }]
      }`
);

// 5. Update handleStartNegotiation to clear message
code = code.replace(
  `setOfferPrice(Math.floor(product.price_ghs * 0.8)); // Default 80% offer`,
  `setOfferPrice(Math.floor(product.price_ghs * 0.8)); // Default 80% offer\n    setOfferMessage('');`
);

// 6. Update the Modal UI
const modalUiRegex = /<div className="space-y-6">[\s\S]*?<\/div>\s*<\/div>\s*<div className="bg-slate-50 p-6 border-t border-slate-100 flex gap-4">/;
const newModalUi = `<div className="space-y-6">
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
                      className={\`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors \${
                        isOfferRecording 
                          ? 'text-red-500 bg-red-50 animate-pulse' 
                          : 'text-slate-400 hover:text-[#10B981] hover:bg-emerald-50'
                      }\`}
                      title="Speak your offer or message"
                    >
                      {isOfferRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 p-6 border-t border-slate-100 flex gap-4">`;
code = code.replace(modalUiRegex, newModalUi);

fs.writeFileSync('src/views/BuyerView.tsx', code);
