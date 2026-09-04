const fs = require('fs');
let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');

// Replace the startCamera and the useEffect
const oldLogic = `  const startCamera = async () => {
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
      videoRef.current.play().catch(e => console.error("Video play error:", e));
    }
  }, [isCameraOpen]);`;

const newLogic = `  const startCamera = async () => {
    setIsCameraOpen(true);
  };

  useEffect(() => {
    let activeStream: MediaStream | null = null;
    
    const initCamera = async () => {
      if (!isCameraOpen) return;
      
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } } 
        });
        activeStream = stream;
        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Could not access camera. Please check permissions or try a different device.");
        setIsCameraOpen(false);
      }
    };
    
    initCamera();
    
    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraOpen]);`;

code = code.replace(oldLogic, newLogic);

const oldVideo = `<video muted
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />`;

const newVideo = `<video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              onLoadedMetadata={() => {
                if (videoRef.current) {
                  videoRef.current.play().catch(e => console.error("Video play error:", e));
                }
              }}
              className="w-full h-full object-cover bg-slate-900"
            />`;

code = code.replace(oldVideo, newVideo);

fs.writeFileSync('src/views/VendorDashboard.tsx', code);
