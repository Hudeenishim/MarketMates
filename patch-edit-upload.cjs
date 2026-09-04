const fs = require('fs');

let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');

// Insert handleEditImageUpload
code = code.replace(
  /const handleImageUpload = \(e: React\.ChangeEvent<HTMLInputElement>\) => \{([\s\S]*?)\};\n/,
  `const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProductImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditProductImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };\n`
);

// Replace the Edit modal input
code = code.replace(
  /<input\n\s*type="text"\n\s*value=\{editProductImageUrl\}\n\s*onChange=\{\(e\) => setEditProductImageUrl\(e.target.value\)\}\n\s*className="pl-10 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium"\n\s*placeholder="Image URL or leave empty for AI generation"\n\s*\/>/,
  `<input
                        type="file"
                        accept="image/*"
                        onChange={handleEditImageUpload}
                        className="pl-10 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium text-slate-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                        title="Upload Image"
                      />`
);

fs.writeFileSync('src/views/VendorDashboard.tsx', code);
console.log("Patched edit image upload");
