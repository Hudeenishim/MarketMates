const fs = require('fs');
let code = fs.readFileSync('src/views/BuyerView.tsx', 'utf8');

const regex = /<select[\s\S]*?value={selectedCategory \|\| ''}[\s\S]*?<\/select>/;
const replacement = `<CustomSelect 
                value={selectedCategory || ''} 
                onChange={(val) => setSelectedCategory(val === '' ? null : val)} 
                options={[{value: '', label: 'All Categories'}, ...categories.map(c => ({value: c, label: c}))]}
                className="w-48"
              />`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/views/BuyerView.tsx', code);
