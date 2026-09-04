const fs = require('fs');
let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');

const exportSalesFunc = `
  const exportSalesToCSV = () => {
    if (salesData.length === 0) return;
    
    const headers = ['Date', 'Sales (GHS)'];
    const rows = salesData.map(d => [\`"\${d.name}"\`, d.sales]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', \`sales_trend_export_\${new Date().toISOString().split('T')[0]}.csv\`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
`;

code = code.replace(
  "  return (\n    <div className=\"flex flex-col md:flex-row gap-6",
  exportSalesFunc + "\n  return (\n    <div className=\"flex flex-col md:flex-row gap-6"
);

fs.writeFileSync('src/views/VendorDashboard.tsx', code);
