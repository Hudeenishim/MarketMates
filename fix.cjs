const fs = require('fs');
let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');

const lines = code.split('\n');
const newLines = [];
let i = 0;
while (i < lines.length) {
  if (lines[i].includes('reader.readAsDataURL(file);') && lines[i+1] && lines[i+1].includes('    }') && lines[i+2] && lines[i+2].includes('  };') && lines[i+3] && lines[i+3].includes('  const handleAddProduct')) {
    // skip the duplicate
    i += 3;
  } else {
    newLines.push(lines[i]);
    i++;
  }
}

fs.writeFileSync('src/views/VendorDashboard.tsx', newLines.join('\n'));
console.log("Fixed manually");
