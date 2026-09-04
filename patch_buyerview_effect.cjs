const fs = require('fs');
let code = fs.readFileSync('src/views/BuyerView.tsx', 'utf8');

const useEffectRegex = /  useEffect\(\(\) => \{\n    \/\/ If a market is selected, find vendors in that market[\s\S]*?\}, \[selectedMarket, demoMode\]\);\n/;
code = code.replace(useEffectRegex, '');

fs.writeFileSync('src/views/BuyerView.tsx', code);
