const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "import { NegotiationCenter } from './views/NegotiationCenter';",
  "import { NegotiationCenter } from './views/NegotiationCenter';\nimport { AboutView } from './views/AboutView';\nimport { CustomerServiceView } from './views/CustomerServiceView';"
);

const newRoutes = `              <Route path="/about" element={
                <ProtectedRoute>
                  <AboutView />
                </ProtectedRoute>
              } />
              <Route path="/support" element={
                <ProtectedRoute>
                  <CustomerServiceView />
                </ProtectedRoute>
              } />
              <Route path="/" element={<Navigate to="/login" replace />} />`;

code = code.replace(
  '<Route path="/" element={<Navigate to="/login" replace />} />',
  newRoutes
);

fs.writeFileSync('src/App.tsx', code);
