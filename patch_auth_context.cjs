const fs = require('fs');
let code = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

code = code.replace(
  "setProfileRole: (role: 'vendor' | 'buyer') => Promise<void>;",
  "setProfileRole: (role: 'vendor' | 'buyer' | 'rider') => Promise<void>;\n  setDemoRole?: (role: 'vendor' | 'buyer' | 'rider') => void;"
);

code = code.replace(
  "setProfileRole: async () => {},",
  "setProfileRole: async () => {},\n  setDemoRole: () => {},"
);

code = code.replace(
  "const [demoMode, setDemoMode] = useState(false);",
  "const [demoMode, setDemoMode] = useState(false);\n  const [demoRole, setDemoRole] = useState<'vendor' | 'buyer' | 'rider'>('buyer');"
);

// We need to update the useEffect and demoMode logic.
// Instead of replacing blindly, let's just write a custom script that replaces the useEffect.
