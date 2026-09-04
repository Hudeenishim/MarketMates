const fs = require('fs');
let code = fs.readFileSync('src/views/NegotiationCenter.tsx', 'utf8');

// Add import
if (!code.includes('useNavigate')) {
  code = code.replace(
    /import React, \{ useState, useEffect, useRef \} from 'react';/,
    `import React, { useState, useEffect, useRef } from 'react';\nimport { useNavigate } from 'react-router-dom';`
  );
}

// Add hook
if (!code.includes('const navigate = useNavigate();')) {
  code = code.replace(
    /export const NegotiationCenter: React\.FC = \(\) => \{/,
    `export const NegotiationCenter: React.FC = () => {\n  const navigate = useNavigate();`
  );
}

// Replace window.location.href
code = code.replace(
  /onClick=\{\(\) => window\.location\.href = '\/deliveries\?neg_id=' \+ selectedNeg\.id\}/,
  `onClick={() => navigate('/deliveries?neg_id=' + selectedNeg.id)}`
);

fs.writeFileSync('src/views/NegotiationCenter.tsx', code);
console.log("Patched Navigation");
