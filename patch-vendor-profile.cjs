const fs = require('fs');
let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');

code = code.replace(/const \{ user, demoMode \} = useAuth\(\);/, 'const { user, profile, demoMode } = useAuth();');

fs.writeFileSync('src/views/VendorDashboard.tsx', code);
console.log("Patched VendorDashboard profile");
