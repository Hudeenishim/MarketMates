const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

code = code.replace(
  "const { user, profile, demoMode, setDemoMode } = useAuth();",
  "const { user, profile, demoMode, setDemoMode, setDemoRole } = useAuth();"
);

const newDemoRoleSelector = `          {demoMode && setDemoRole && (
            <select
              value={profile?.role || 'buyer'}
              onChange={(e) => setDemoRole(e.target.value as any)}
              className="px-2 py-1 bg-amber-50 border border-amber-200 rounded-md text-xs font-bold text-amber-800 outline-none"
            >
              <option value="vendor">Vendor</option>
              <option value="buyer">Buyer</option>
              <option value="rider">Rider</option>
            </select>
          )}`;

code = code.replace(
  "</button>",
  "</button>\n" + newDemoRoleSelector
);

fs.writeFileSync('src/components/Navbar.tsx', code);
console.log("Updated Navbar.tsx");
