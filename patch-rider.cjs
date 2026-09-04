const fs = require('fs');
const path = 'src/views/RiderDashboard.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/if \(demoMode\) return; \/\/ Skip DB update in demo mode/g, 'if (demoMode && !user) return; // Skip DB update in demo mode');

code = code.replace(/if \(demoMode\) \{\n\s*alert\('Delivery accepted! \(Demo Mode\)'\);\n\s*setSelectedDelivery\(null\);\n\s*return;\n\s*\}/g, `if (demoMode && !user) {\n      alert('Delivery accepted! (Demo Mode)');\n      setSelectedDelivery(null);\n      return;\n    }`);

code = code.replace(/if \(demoMode\) \{\n\s*alert\('Status updated to ' \+ status \+ '! \(Demo Mode\)'\);\n\s*return;\n\s*\}/g, `if (demoMode && !user) {\n      alert('Status updated to ' + status + '! (Demo Mode)');\n      return;\n    }`);

fs.writeFileSync(path, code);
console.log("Patched RiderDashboard");
