const fs = require('fs');

function patchFile(filepath) {
  let code = fs.readFileSync(filepath, 'utf8');
  // replace exact string "if (demoMode) {" with "if (demoMode && !user) {"
  // but let's be careful about spaces
  code = code.replace(/if \(demoMode\) \{/g, 'if (demoMode && !user) {');
  
  // Also any ternary like demoMode ? ... : ...
  // Not going to touch those blindly, let's just do "if (demoMode) {"
  
  fs.writeFileSync(filepath, code);
  console.log('Patched', filepath);
}

patchFile('src/views/VendorDashboard.tsx');
patchFile('src/views/BuyerView.tsx');
patchFile('src/views/NegotiationCenter.tsx');
patchFile('src/views/DeliveryDashboard.tsx');

let authCode = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');
authCode = authCode.replace(/if \(demoMode\) \{/, 'if (demoMode && !currentUser) {');
authCode = authCode.replace(
  /setProfile\(\{ id: profileDoc\.id, \.\.\.data, full_name: fullName \} as Profile\);/,
  `const effectiveRole = demoMode ? demoRole : data.role;
            setProfile({ id: profileDoc.id, ...data, full_name: fullName, role: effectiveRole } as Profile);`
);
fs.writeFileSync('src/contexts/AuthContext.tsx', authCode);
console.log("Patched AuthContext");

