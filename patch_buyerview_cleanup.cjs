const fs = require('fs');
let code = fs.readFileSync('src/views/BuyerView.tsx', 'utf8');

code = code.replace(
  /\{selectedMarket[\s\S]*?: 'All Available Products'\}/,
  'All Available Products'
);

code = code.replace(/const \[selectedMarket, setSelectedMarket\] = useState<string \| null>\(null\);\n/, '');
code = code.replace(/const \[markets, setMarkets\] = useState<Market\[\]>\(\[\]\);\n/, '');
code = code.replace(/const \[vendorsInMarket, setVendorsInMarket\] = useState<string\[\]>\(\[\]\);\n/, '');

// Remove markets fetch
code = code.replace(/\/\/ Fetch Markets\n    getDocs\(collection\(db, 'markets'\)\)\.then\(\(snapshot\) => \{\n      const mrkts: Market\[\] = \[\];\n      snapshot\.forEach\(doc => mrkts\.push\(\{ id: doc\.id, \.\.\.doc\.data\(\) \} as Market\)\);\n      setMarkets\(mrkts\);\n    \}\);\n/, '');

// Remove dummy markets
code = code.replace(/setMarkets\(dummyMarkets\);\n/, '');

// Remove matchesMarket filter
code = code.replace(/const matchesMarket = selectedMarket \? vendorsInMarket\.includes\(p\.vendor_id\) : true;\n/, '');
code = code.replace(/return matchesMarket && matchesSearch && matchesCategory;/, 'return matchesSearch && matchesCategory;');


fs.writeFileSync('src/views/BuyerView.tsx', code);
