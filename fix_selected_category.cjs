const fs = require('fs');
let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');

const targetStr = `{categories.length > 0 && (
              {categories.length > 0 && (
    <CustomSelect 
      value={selectedCategory || ''} 
      onChange={(val) => setSelectedCategory(val === '' ? null : val)} 
      options={[{value: '', label: 'All Categories'}, ...categories.map(c => ({value: c, label: c}))]}
      className="w-48"
    />
  )}
            )}`;

const replaceStr = `{categories.length > 0 && (
              <CustomSelect 
                value={selectedCategory || ''} 
                onChange={(val) => setSelectedCategory(val === '' ? null : val)} 
                options={[{value: '', label: 'All Categories'}, ...categories.map(c => ({value: c, label: c}))]}
                className="w-48"
              />
            )}`;

code = code.replace(targetStr, replaceStr);
fs.writeFileSync('src/views/VendorDashboard.tsx', code);
