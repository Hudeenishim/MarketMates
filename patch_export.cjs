const fs = require('fs');
let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');

const exportFunc = `
  const exportInventoryToCSV = () => {
    if (products.length === 0) return;
    
    // Create CSV header
    const headers = ['Name', 'Category', 'Price (GHS)', 'Stock Quantity', 'Unit', 'In Stock'];
    
    // Create CSV rows
    const rows = products.map(p => [
      \`"\${p.name.replace(/"/g, '""')}"\`,
      \`"\${p.category}"\`,
      p.price_ghs,
      p.stock_quantity || 0,
      \`"\${p.unit || 'pcs'}"\`,
      p.stock_status ? 'Yes' : 'No'
    ]);
    
    // Combine header and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\\n');
    
    // Create a Blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', \`inventory_export_\${new Date().toISOString().split('T')[0]}.csv\`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
`;

code = code.replace(
  "  return (\n    <div className=\"flex flex-col md:flex-row",
  exportFunc + "\n  return (\n    <div className=\"flex flex-col md:flex-row"
);

fs.writeFileSync('src/views/VendorDashboard.tsx', code);
