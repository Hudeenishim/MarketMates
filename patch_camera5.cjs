const fs = require('fs');
let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');

const oldInit = `      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } } 
        });
        activeStream = stream;`;

const newInit = `      try {
        let stream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } } 
          });
        } catch (e) {
          console.log("Environment camera failed, trying default camera");
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: true 
          });
        }
        activeStream = stream;`;

if (code.includes(oldInit)) {
  code = code.replace(oldInit, newInit);
}

fs.writeFileSync('src/views/VendorDashboard.tsx', code);
