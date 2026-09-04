const fs = require('fs');
const path = 'src/views/RiderDashboard.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  /if \(demoMode && !user\) \{\n\s*alert\('Status updated to ' \+ status \+ '! \(Demo Mode\)'\);\n\s*return;\n\s*\}/g,
  `if (demoMode && !user) {\n      alert('Status updated to ' + status + '! (Demo Mode)');\n      setSelectedDelivery(prev => prev ? { ...prev, status } : null);\n      return;\n    }`
);

fs.writeFileSync(path, code);
console.log("Patched RiderDashboard handleUpdateStatus");
