const fs = require('fs');
let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');

const imports = "import { CustomSelect } from '../components/CustomSelect';\n";
code = code.replace("import { Product, Negotiation } from '../types';", imports + "import { Product, Negotiation } from '../types';");

const options = `
const CATEGORY_OPTIONS = [
  { value: 'Vegetables', label: 'Vegetables' },
  { value: 'Fruits', label: 'Fruits' },
  { value: 'Meat & Poultry', label: 'Meat & Poultry' },
  { value: 'Dairy Products', label: 'Dairy Products' },
  { value: 'Grains & Cereals', label: 'Grains & Cereals' },
  { value: 'Spices & Herbs', label: 'Spices & Herbs' },
  { value: 'Fragrance', label: 'Fragrance' },
  { value: 'Textiles & Fabrics', label: 'Textiles & Fabrics' },
  { value: 'Household', label: 'Household' },
  { value: 'General', label: 'General' },
  { value: 'Other', label: 'Other' }
];

const UNIT_OPTIONS = [
  { value: 'pieces', label: 'pcs' },
  { value: 'cartons', label: 'cartons' },
  { value: 'boxes', label: 'boxes' },
  { value: 'bunches', label: 'bunches' },
  { value: 'kg', label: 'kg' },
  { value: 'liters', label: 'liters' },
  { value: 'bags', label: 'bags' },
  { value: 'baskets', label: 'baskets' }
];
`;
code = code.replace("export const VendorDashboard: React.FC = () => {", options + "\nexport const VendorDashboard: React.FC = () => {");

// Replace newProductCategory select
code = code.replace(
  /<select[\s\S]*?value={newProductCategory}[\s\S]*?<\/select>/,
  `<CustomSelect value={newProductCategory} onChange={setNewProductCategory} options={CATEGORY_OPTIONS} />`
);

// Replace newProductUnit select
code = code.replace(
  /<select[\s\S]*?value={newProductUnit}[\s\S]*?<\/select>/,
  `<CustomSelect value={newProductUnit} onChange={setNewProductUnit} options={UNIT_OPTIONS} className="w-32" />`
);

// Replace selectedCategory select
code = code.replace(
  /<select[\s\S]*?value={selectedCategory \|\| ''}[\s\S]*?<\/select>/,
  `{categories.length > 0 && (
    <CustomSelect 
      value={selectedCategory || ''} 
      onChange={(val) => setSelectedCategory(val === '' ? null : val)} 
      options={[{value: '', label: 'All Categories'}, ...categories.map(c => ({value: c, label: c}))]}
      className="w-48"
    />
  )}`
);
// Wait, the original code had the `{categories.length > 0 && (` wrapper. I need to handle that carefully.
// Actually, I'll just replace the select tag.
code = code.replace(
  /<select\n                value={selectedCategory[\s\S]*?<\/select>/,
  `<CustomSelect 
                value={selectedCategory || ''} 
                onChange={(val) => setSelectedCategory(val === '' ? null : val)} 
                options={[{value: '', label: 'All Categories'}, ...categories.map(c => ({value: c, label: c}))]}
                className="w-48"
              />`
);

// Replace editProductCategory select
code = code.replace(
  /<select[\s\S]*?value={editProductCategory}[\s\S]*?<\/select>/,
  `<CustomSelect value={editProductCategory} onChange={setEditProductCategory} options={CATEGORY_OPTIONS} />`
);

// Replace editProductUnit select
code = code.replace(
  /<select[\s\S]*?value={editProductUnit}[\s\S]*?<\/select>/,
  `<CustomSelect value={editProductUnit} onChange={setEditProductUnit} options={UNIT_OPTIONS} />`
);

fs.writeFileSync('src/views/VendorDashboard.tsx', code);
