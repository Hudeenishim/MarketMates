const fs = require('fs');
let code = fs.readFileSync('src/views/BuyerView.tsx', 'utf8');

// 1. Change default active tab
code = code.replace(
  "const [activeTab, setActiveTab] = useState<'map' | 'products'>('map');",
  "const [activeTab, setActiveTab] = useState<'products'>('products');"
);

// 2. Remove the Market Map tab button
const mapTabBtnRegex = /<button\s+onClick=\{\(\) => \{ setActiveTab\('map'\); setIsSidebarOpen\(false\); \}\}[\s\S]*?<\/button>/;
code = code.replace(mapTabBtnRegex, '');

// 3. Remove the entire map section
// It starts with `{activeTab === 'map' && (<>` and ends before `      {/* Product Feed */}` or similar.
const mapSectionRegex = /\{activeTab === 'map' && \(\<\>[\s\S]*?<\/div>\s*<\/>\)\}/;
code = code.replace(mapSectionRegex, '');

fs.writeFileSync('src/views/BuyerView.tsx', code);
