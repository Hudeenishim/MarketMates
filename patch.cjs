const fs = require('fs');
let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');

// 1. Add State & Ref
code = code.replace(
  "const [isSearchRecording, setIsSearchRecording] = useState(false);",
  "const [isSearchRecording, setIsSearchRecording] = useState(false);\n  const [isPriceRecording, setIsPriceRecording] = useState(false);"
);

code = code.replace(
  "const searchRecognitionRef = useRef<any>(null);",
  "const searchRecognitionRef = useRef<any>(null);\n  const priceRecognitionRef = useRef<any>(null);"
);

// 2. Setup Speech Recognition
const priceSpeechSetup = `
      priceRecognitionRef.current = new SpeechRecognition();
      priceRecognitionRef.current.continuous = false;
      priceRecognitionRef.current.interimResults = false;
      priceRecognitionRef.current.lang = 'en-GH';

      priceRecognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        // Extract numbers
        const numbers = text.match(/\\d+(\\.\\d+)?/g);
        if (numbers) {
          setNewProductPrice(numbers[0]);
        }
      };

      priceRecognitionRef.current.onend = () => {
        setIsPriceRecording(false);
      };
`;

code = code.replace(
  "searchRecognitionRef.current.onend = () => {\n        setIsSearchRecording(false);\n      };\n    }",
  "searchRecognitionRef.current.onend = () => {\n        setIsSearchRecording(false);\n      };\n" + priceSpeechSetup + "    }"
);

// 3. Add toggle function
const togglePriceFunc = `
  const togglePriceRecording = () => {
    if (isPriceRecording) {
      priceRecognitionRef.current?.stop();
      setIsPriceRecording(false);
    } else {
      priceRecognitionRef.current?.start();
      setIsPriceRecording(true);
    }
  };
`;

code = code.replace(
  "const toggleSearchRecording = () => {",
  togglePriceFunc + "\n  const toggleSearchRecording = () => {"
);

// 4. Update Price Input UI
const oldPriceInput = `<input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={newProductPrice}
                onChange={(e) => setNewProductPrice(e.target.value)}
                className="pl-9 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium"
                required
              />`;

const newPriceInput = `<input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={newProductPrice}
                onChange={(e) => setNewProductPrice(e.target.value)}
                className="pl-9 pr-10 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium"
                required
              />
              <button
                type="button"
                onClick={togglePriceRecording}
                className={\`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors \${
                  isPriceRecording ? 'bg-red-100 text-red-500 animate-pulse' : 'text-slate-400 hover:text-emerald-500 hover:bg-emerald-50'
                }\`}
              >
                {isPriceRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>`;

code = code.replace(oldPriceInput, newPriceInput);

// 5. Update Image Input UI
// The user wants a camera to take photos directly from the app.
// I will change the image input section. 
const oldImageInput = `<input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="pl-10 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium"
              />`;

const newImageInput = `<div className="flex w-full gap-2 pl-10">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium"
                  title="Upload Image"
                />
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageUpload}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium"
                  title="Take Photo"
                  style={{ color: 'transparent' }}
                />
              </div>`;
              
const cameraIconImport = `import { Mic, MicOff, Plus, Package, DollarSign, Tag, Bell, Search, Image as ImageIcon, Camera } from 'lucide-react';`;

code = code.replace(
  "import { Mic, MicOff, Plus, Package, DollarSign, Tag, Bell, Search, Image as ImageIcon } from 'lucide-react';",
  cameraIconImport
);

fs.writeFileSync('src/views/VendorDashboard.tsx', code);
