const fs = require('fs');
let code = fs.readFileSync('src/views/BuyerView.tsx', 'utf8');

code = code.replace(/import \{ MapContainer, TileLayer, Marker, Popup, useMap \} from 'react-leaflet';\n/, '');
code = code.replace(/import 'leaflet\/dist\/leaflet.css';\n/, '');
code = code.replace(/import L from 'leaflet';\n/, '');

const defaultIconRegex = /\/\/ Fix for Leaflet icon issues in React\nimport icon from 'leaflet\/dist\/images\/marker-icon.png\?url';\nimport iconShadow from 'leaflet\/dist\/images\/marker-shadow.png\?url';\nlet DefaultIcon = L.icon\(\{[\s\S]*?\}\);\nL.Marker.prototype.options.icon = DefaultIcon;\n/;
code = code.replace(defaultIconRegex, '');

const mapUpdaterRegex = /const MapUpdater: React\.FC<\{ selectedMarket: string \| null; markets: Market\[\] \}> = \(\{ selectedMarket, markets \}\) => \{[\s\S]*?return null;\n\};\n/;
code = code.replace(mapUpdaterRegex, '');

code = code.replace(/  const \[activeTab, setActiveTab\] = useState<'products'>\('products'\);\n/, '');
code = code.replace(/  const \[isSidebarOpen, setIsSidebarOpen\] = useState\(false\);\n/, '');

fs.writeFileSync('src/views/BuyerView.tsx', code);
