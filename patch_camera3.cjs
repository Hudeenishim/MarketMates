const fs = require('fs');
let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');

// Add muted to video element
code = code.replace(
  '<video\\n              ref={videoRef}\\n              autoPlay\\n              playsInline\\n              className="w-full h-full object-cover"\\n            />',
  '<video\\n              ref={videoRef}\\n              autoPlay\\n              playsInline\\n              muted\\n              className="w-full h-full object-cover"\\n            />'
);

// Also let's just make it robust by adding muted directly
code = code.replace("<video", "<video muted");

// Update useEffect to explicitly play
const oldEffect = `  useEffect(() => {
    if (isCameraOpen && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isCameraOpen]);`;

const newEffect = `  useEffect(() => {
    if (isCameraOpen && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(e => console.error("Video play error:", e));
    }
  }, [isCameraOpen]);`;

if (code.includes(oldEffect)) {
    code = code.replace(oldEffect, newEffect);
}

fs.writeFileSync('src/views/VendorDashboard.tsx', code);
