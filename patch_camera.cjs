const fs = require('fs');
let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');

// 1. Add state and refs for Camera
const stateInjection = `
  const [newProductImageUrl, setNewProductImageUrl] = useState('');
  
  // Camera State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      setIsCameraOpen(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please check permissions.");
    }
  };

  useEffect(() => {
    if (isCameraOpen && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isCameraOpen]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.8);
        setNewProductImageUrl(dataUrl);
        stopCamera();
      }
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);
`;

code = code.replace("const [newProductImageUrl, setNewProductImageUrl] = useState('');", stateInjection);

// 2. Replace the old camera input button
const oldButton = `<div className="relative w-14 shrink-0">
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Camera className="h-5 w-5 text-slate-600" />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageUpload}
                    className="w-full h-full opacity-0 cursor-pointer bg-slate-100 rounded-2xl border border-slate-200"
                    title="Take Photo"
                  />
                  <div className="absolute inset-0 border border-slate-200 rounded-2xl pointer-events-none bg-slate-50 hover:bg-slate-100 transition-colors -z-10"></div>
                </div>`;

const newButton = `<button
                  type="button"
                  onClick={startCamera}
                  className="relative w-14 shrink-0 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center transition-colors"
                  title="Take Photo"
                >
                  <Camera className="h-5 w-5 text-slate-600" />
                </button>`;

code = code.replace(oldButton, newButton);

// 3. Add the Camera Modal at the end of the file
const cameraModal = `
      {/* Camera Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="flex-1 relative bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>
          <div className="bg-black p-6 flex justify-between items-center pb-safe">
            <button
              onClick={stopCamera}
              className="px-6 py-3 rounded-2xl bg-slate-800 text-white font-bold"
            >
              Cancel
            </button>
            <button
              onClick={capturePhoto}
              className="w-16 h-16 rounded-full bg-white flex items-center justify-center border-4 border-slate-300"
            >
              <div className="w-12 h-12 rounded-full bg-slate-200" />
            </button>
            <div className="w-[100px]" /> {/* Spacer for centering */}
          </div>
        </div>
      )}
    </div>
  );
};`;

code = code.replace("    </div>\n  );\n};", cameraModal);

fs.writeFileSync('src/views/VendorDashboard.tsx', code);
