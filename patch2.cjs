const fs = require('fs');
let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');

// Icons
code = code.replace(
  "import { Mic, MicOff, Plus, Package, DollarSign, Tag, Bell, Search, Image as ImageIcon } from 'lucide-react';",
  "import { Mic, MicOff, Plus, Package, DollarSign, Tag, Bell, Search, Image as ImageIcon, Camera } from 'lucide-react';"
);

// State
code = code.replace(
  "const [isSearchRecording, setIsSearchRecording] = useState(false);",
  "const [isSearchRecording, setIsSearchRecording] = useState(false);\n  const [isPriceRecording, setIsPriceRecording] = useState(false);"
);

code = code.replace(
  "const searchRecognitionRef = useRef<any>(null);",
  "const searchRecognitionRef = useRef<any>(null);\n  const priceRecognitionRef = useRef<any>(null);"
);

// Speech Recognition Config
const priceSpeechSetup = `
      priceRecognitionRef.current = new SpeechRecognition();
      priceRecognitionRef.current.continuous = false;
      priceRecognitionRef.current.interimResults = false;
      priceRecognitionRef.current.lang = 'en-GH';

      priceRecognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
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

// toggle function
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

fs.writeFileSync('src/views/VendorDashboard.tsx', code);
