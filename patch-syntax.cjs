const fs = require('fs');
let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');

code = code.replace(/  const handleEditImageUpload = \(e: React\.ChangeEvent<HTMLInputElement>\) => \{([\s\S]*?)  \};\n      reader\.readAsDataURL\(file\);\n    \}\n  \};/,
`  const handleEditImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditProductImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };`);

fs.writeFileSync('src/views/VendorDashboard.tsx', code);
console.log("Fixed syntax error");
