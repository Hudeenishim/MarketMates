const fs = require('fs');
let code = fs.readFileSync('src/views/BuyerView.tsx', 'utf8');

// 1. Remove map imports
code = code.replace(/import \{ MapContainer, TileLayer, Marker, Popup, useMap \} from 'react-leaflet';\n/, '');
code = code.replace(/import 'leaflet\/dist\/leaflet.css';\n/, '');
code = code.replace(/import L from 'leaflet';\n/, '');

// 2. Remove default icon fix
const defaultIconRegex = /\/\/ Fix for Leaflet icon issues in React\nimport icon from 'leaflet\/dist\/images\/marker-icon.png\?url';\nimport iconShadow from 'leaflet\/dist\/images\/marker-shadow.png\?url';\nlet DefaultIcon = L.icon\(\{[\s\S]*?\}\);\nL.Marker.prototype.options.icon = DefaultIcon;\n/;
code = code.replace(defaultIconRegex, '');

// 3. Remove MapUpdater
const mapUpdaterRegex = /const MapUpdater: React.FC<\{ selectedMarket: string \| null; markets: Market\[\] \}> = \(\{ selectedMarket, markets \}\) => \{[\s\S]*?return null;\n\};\n/;
code = code.replace(mapUpdaterRegex, '');

// 4. Remove unused state
code = code.replace(/  const \[activeTab, setActiveTab\] = useState<'products'>\('products'\);\n/, '');
code = code.replace(/  const \[isSidebarOpen, setIsSidebarOpen\] = useState\(false\);\n/, '');

// 5. Replace render block up to Product Catalog
const returnRegex = /  return \(\n    <div className="flex flex-col md:flex-row gap-6 animate-in fade-in duration-500 min-h-\[80vh\] pb-32 relative">\n      \{\/\* Mobile Sidebar Toggle \*\/\}[\s\S]*?\{\/\* Product Catalog \*\/}\n/g;

code = code.replace(returnRegex, '  return (\n    <div className="animate-in fade-in duration-500 min-h-[80vh] pb-32 relative">\n      {/* Product Catalog */}\n');

// 6. Make sure to remove any remaining `</div>` that closed the sidebar flex container if any.
// Actually, earlier the structure was:
// <div className="flex flex-col md:flex-row ...">
//   <div className="md:hidden ...">...</div>
//   <div className="flex-col w-full md:w-64 ...">...</div>
//   <div className="flex-1 flex flex-col gap-6 min-w-0">
//      {/* Product Catalog */}
//      <div className="bg-white rounded-[2rem] ...">...</div>
//   </div>
// </div>
// Wait, the "flex-1 flex flex-col gap-6 min-w-0" was closing after Product Catalog?
