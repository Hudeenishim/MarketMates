import React, { useState, useEffect } from 'react';
import { Play, X, Mic, MessageSquare, Motorbike, Search, Store, Package, CheckCircle, Pause, Edit2, Trash2, PhoneCall } from 'lucide-react';

export const TutorialOverlay: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentScene, setCurrentScene] = useState(0);
  const [progress, setProgress] = useState(0);

  const scenes = [
    {
      id: 'voice',
      title: 'Voice-Powered Vending',
      subtitle: 'Vendors can list products instantly just by speaking—no typing required.',
      duration: 8000
    },
    {
      id: 'browse',
      title: 'Seamless Discovery',
      subtitle: 'Buyers can easily browse local markets and find fresh goods nearby.',
      duration: 6000
    },
    {
      id: 'negotiation',
      title: 'Negotiation & Payments',
      subtitle: 'Haggle via chat and choose between Paystack or Pay on Delivery upon agreement.',
      duration: 8000
    },
    {
      id: 'delivery',
      title: 'Real-Time Delivery',
      subtitle: 'Dedicated Rider dashboards with live map tracking from pickup to dropoff.',
      duration: 8000
    }
  ];

  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    let startTime = Date.now();
    let animationFrame: number;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const currentDuration = scenes[currentScene].duration;

      if (elapsed >= currentDuration) {
        if (currentScene < scenes.length - 1) {
          setCurrentScene(prev => prev + 1);
          setProgress(0);
          startTime = Date.now();
        } else {
          setIsPlaying(false); // End of video
          setProgress(100);
        }
      } else {
        setProgress((elapsed / currentDuration) * 100);
      }
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isOpen, isPlaying, currentScene]);

  const handleSeek = (index: number) => {
    setCurrentScene(index);
    setProgress(0);
    setIsPlaying(true);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-8">
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 hover:bg-slate-800 transition-transform hover:scale-105 border border-slate-700"
        >
          <Play className="w-5 h-5 text-emerald-400" fill="currentColor" />
          <span className="font-bold">Watch App Walkthrough</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
      <style dangerouslySetInnerHTML={{__html: customStyles}} />
      <div className="w-full max-w-6xl bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col h-[85vh] relative">
        
        {/* Close button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 z-10 p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-white transition-colors border border-slate-600 shadow-xl"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Video Canvas Split View */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-800">
          
          {/* Left Side: Explainer Text */}
          <div className="w-full md:w-5/12 p-12 flex flex-col justify-center border-r border-slate-700 bg-slate-900 z-10 relative shadow-2xl">
            {scenes.map((scene, idx) => (
              <div 
                key={scene.id}
                className={`absolute inset-0 p-12 flex flex-col justify-center transition-all duration-700 ease-in-out
                  ${idx === currentScene ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}
                `}
              >
                <div className="text-emerald-400 font-bold mb-4 tracking-wider uppercase text-sm">Step {idx + 1}</div>
                <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                  {scene.title}
                </h2>
                <p className="text-xl text-slate-400 leading-relaxed">
                  {scene.subtitle}
                </p>
              </div>
            ))}
          </div>

          {/* Right Side: App UI Simulator */}
          <div className="w-full md:w-7/12 bg-slate-800 flex items-center justify-center p-8 relative overflow-hidden">
             
             {/* Phone/Tablet Frame */}
             <div className="w-[340px] h-[650px] bg-white rounded-[3rem] shadow-2xl overflow-hidden border-[12px] border-slate-950 relative">
                {/* Dynamic Screen Content */}
                {currentScene === 0 && <SceneVoiceListing key="scene-0" />}
                {currentScene === 1 && <SceneBrowsing key="scene-1" />}
                {currentScene === 2 && <SceneNegotiation key="scene-2" />}
                {currentScene === 3 && <SceneDelivery key="scene-3" />}
             </div>

          </div>
        </div>

        {/* Video Controls */}
        <div className="bg-slate-950 p-6 border-t border-slate-700 shrink-0">
          {/* Progress Bar overall */}
          <div className="flex gap-2 mb-6">
            {scenes.map((scene, idx) => (
              <div 
                key={scene.id} 
                onClick={() => handleSeek(idx)}
                className="h-2 flex-1 bg-slate-800 rounded-full overflow-hidden cursor-pointer hover:h-3 transition-all"
              >
                <div 
                  className="h-full bg-emerald-500 transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                  style={{ 
                    width: idx < currentScene ? '100%' : idx === currentScene ? `${progress}%` : '0%' 
                  }}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between px-2">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-3 bg-white text-slate-900 rounded-full hover:bg-slate-200 transition-colors shadow-lg"
            >
              {isPlaying ? <Pause className="w-6 h-6" fill="currentColor" /> : <Play className="w-6 h-6" fill="currentColor" />}
            </button>
            <div className="text-slate-400 font-medium">
              Demo Walkthrough • {currentScene + 1} / {scenes.length}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// --- SIMULATED APP SCREENS ---

const SceneVoiceListing = () => (
  <div className="w-full h-full bg-[#F2F2F7] flex flex-col text-left font-sans">
    <div className="bg-slate-900 text-white p-4 flex justify-between items-center z-10 shadow-md shrink-0">
      <div className="font-bold text-lg">MarketMates</div>
      <div className="bg-slate-800 px-3 py-1 rounded-full text-xs font-bold text-slate-300">Vendor</div>
    </div>
    <div className="p-4 flex-1 flex flex-col gap-4">
      <h2 className="text-xl font-bold text-slate-800">Inventory</h2>
      
      {/* Voice Entry Card */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden shrink-0">
         <div className="flex items-center gap-4 mb-2">
           <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/30" style={{ animation: 'pulseClick 0.5s ease-out 1s forwards' }}>
              <Mic className="w-6 h-6" />
           </div>
           <div>
             <div className="font-bold text-slate-900">Voice Entry</div>
             <div className="text-xs text-slate-500">Tap to list items</div>
           </div>
         </div>
         
         {/* Recording overlay */}
         <div className="absolute inset-0 bg-white p-6 flex flex-col justify-center items-center opacity-0" style={{ animation: 'popIn 0.3s ease-out 1.5s forwards, fadeOut 0.3s ease-out 5s forwards' }}>
           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 relative">
             <div className="w-8 h-8 bg-red-500 rounded-full relative z-10" />
             <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-50" />
           </div>
           <div className="text-slate-700 font-medium text-center text-sm min-h-[40px] after:content-[''] after:animate-[typeText1_2.5s_steps(30,end)_2s_forwards]" />
         </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mt-2">
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <div className="w-full h-20 bg-orange-100 rounded-xl mb-2 flex items-center justify-center relative">
            <div className="absolute top-1 left-1 bg-white/90 p-1 rounded-full text-slate-500 shadow-sm"><Edit2 className="w-3 h-3" /></div>
            <div className="absolute top-1 right-1 bg-white/90 p-1 rounded-full text-slate-500 shadow-sm"><Trash2 className="w-3 h-3" /></div>
            <Store className="text-orange-400 w-6 h-6" />
          </div>
          <div className="font-bold text-sm text-slate-800">Organic Yams</div>
          <div className="text-slate-500 text-xs mt-auto">30 GHS</div>
        </div>
        
        {/* New Product that pops in */}
        <div className="bg-white p-3 rounded-2xl shadow-xl border-2 border-emerald-500 flex flex-col opacity-0" style={{ animation: 'popIn 0.4s ease-out 5.5s forwards' }}>
          <div className="w-full h-20 bg-red-50 rounded-xl mb-2 flex items-center justify-center relative">
            <div className="absolute top-1 left-1 bg-white/90 p-1 rounded-full text-emerald-600 shadow-sm"><Edit2 className="w-3 h-3" /></div>
            <div className="absolute top-1 right-1 bg-white/90 p-1 rounded-full text-red-500 shadow-sm"><Trash2 className="w-3 h-3" /></div>
            <Package className="w-6 h-6 text-red-500" />
          </div>
          <div className="font-bold text-sm text-slate-900 leading-tight">Fresh Tomatoes</div>
          <div className="text-emerald-600 font-bold text-sm mt-1">50 GHS</div>
        </div>
      </div>
    </div>
  </div>
);

const SceneBrowsing = () => (
  <div className="w-full h-full bg-[#F2F2F7] flex flex-col text-left font-sans">
    <div className="bg-slate-900 text-white p-4 flex justify-between items-center z-10 shadow-md shrink-0">
      <div className="font-bold text-lg">MarketMates</div>
      <div className="bg-slate-800 px-3 py-1 rounded-full text-xs font-bold text-slate-300">Buyer</div>
    </div>
    <div className="p-4 flex-1 flex flex-col gap-4">
      {/* Search bar */}
      <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-400 shrink-0" />
        <span className="text-slate-400 text-sm after:content-[''] after:animate-[typeText2_1s_steps(10,end)_0.5s_forwards]" />
      </div>
      
      <div className="grid grid-cols-2 gap-3 mt-2">
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex flex-col opacity-50">
          <div className="w-full h-24 bg-orange-100 rounded-xl mb-2" />
          <div className="font-bold text-sm text-slate-800">Organic Yams</div>
          <div className="text-slate-500 text-xs">30 GHS</div>
        </div>
        
        {/* Target product */}
        <div className="bg-white p-3 rounded-2xl shadow-md border-2 border-blue-500 flex flex-col relative" style={{ animation: 'pulseClick 0.4s ease-out 2s forwards' }}>
          <div className="w-full h-24 bg-red-50 rounded-xl mb-2 flex items-center justify-center">
             <Package className="w-8 h-8 text-red-500" />
          </div>
          <div className="font-bold text-sm text-slate-900">Fresh Tomatoes</div>
          <div className="text-emerald-600 font-bold text-xs mt-1">50 GHS</div>
          
          {/* Action button */}
          <div className="mt-3 bg-slate-900 text-white py-2 rounded-xl text-center font-bold text-xs shadow-lg" style={{ animation: 'pulseClick 0.3s ease-out 3.5s forwards' }}>
            Negotiate Price
          </div>
        </div>
      </div>
    </div>
  </div>
);

const SceneNegotiation = () => (
  <div className="w-full h-full bg-[#F2F2F7] flex flex-col text-left font-sans">
    <div className="bg-slate-900 text-white p-3 shadow-md flex justify-between items-center shrink-0 z-10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
          <MessageSquare className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="font-bold text-sm">AI Assistant</div>
          <div className="text-xs text-blue-300">Negotiating Tomatoes</div>
        </div>
      </div>
      <div className="bg-emerald-500/20 text-emerald-400 p-2 rounded-full">
        <PhoneCall className="w-4 h-4" />
      </div>
    </div>
    
    <div className="flex-1 p-4 flex flex-col gap-4 overflow-hidden relative bg-white">
      {/* Vendor start */}
      <div className="self-start max-w-[85%] opacity-0" style={{ animation: 'slideInLeft 0.4s ease-out 0.5s forwards' }}>
        <div className="bg-slate-100 text-slate-800 p-3 rounded-2xl rounded-tl-sm text-sm border border-slate-200">
          I have listed this for 50 GHS. What is your offer?
        </div>
      </div>
      
      {/* Buyer offer */}
      <div className="self-end max-w-[85%] opacity-0" style={{ animation: 'slideInRight 0.4s ease-out 1.5s forwards' }}>
        <div className="bg-blue-600 text-white p-3 rounded-2xl rounded-tr-sm text-sm shadow-md">
          I can pay 40 GHS today.
        </div>
      </div>
      
      {/* AI thinking */}
      <div className="self-start opacity-0 flex items-center gap-2" style={{ animation: 'popIn 0.2s ease-out 2.5s forwards, fadeOut 0.2s ease-out 3.8s forwards' }}>
        <div className="flex gap-1 bg-slate-100 p-3 rounded-full border border-slate-200">
          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>
      </div>
      
      {/* AI counter */}
      <div className="self-start max-w-[90%] opacity-0" style={{ animation: 'slideInLeft 0.4s ease-out 4s forwards' }}>
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-3 rounded-2xl rounded-tl-sm text-sm shadow-sm">
          <strong>AI Counter-offer: 45 GHS</strong><br/>
          <span className="opacity-80 mt-1 block">40 is a bit low for fresh stock. How about 45?</span>
        </div>
      </div>

      {/* Action Area */}
      <div className="absolute bottom-4 left-4 right-4 pt-4 opacity-0" style={{ animation: 'popIn 0.4s ease-out 5s forwards' }}>
         <div className="bg-slate-900 text-white text-center py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl" style={{ animation: 'pulseClick 0.4s ease-out 6s forwards, successBg 0.3s ease-out 6.4s forwards' }}>
           <CheckCircle className="w-5 h-5" />
           <span className="btn-text" style={{ animation: 'successText 0.1s ease-out 6.4s forwards' }}>Accept 45 GHS</span>
         </div>
      </div>
    </div>
  </div>
);

const SceneDelivery = () => (
  <div className="w-full h-full bg-[#F2F2F7] flex flex-col text-left font-sans">
    <div className="bg-slate-900 text-white p-4 flex justify-between items-center z-10 shadow-md shrink-0">
      <div className="font-bold text-lg">MarketMates</div>
      <div className="bg-slate-800 px-3 py-1 rounded-full text-xs font-bold text-slate-300">Delivery</div>
    </div>
    
    <div className="flex-1 flex relative bg-[#E5E3DF] overflow-hidden">
      {/* Mock Map Background (Grid/Streets) */}
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(#cbd5e1 2px, transparent 2px), linear-gradient(90deg, #cbd5e1 2px, transparent 2px)', backgroundSize: '40px 40px' }} />
      
      {/* Route Line SVG */}
      <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none" preserveAspectRatio="none">
         <path d="M 60,400 L 160,400 L 160,200 L 260,200" fill="none" stroke="#10B981" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" 
           className="opacity-0" style={{ strokeDasharray: '1000', strokeDashoffset: '1000', animation: 'drawPath 1.5s ease-out 1.5s forwards' }} 
         />
      </svg>

      {/* Store Marker */}
      <div className="absolute opacity-0 z-10" style={{ left: '60px', top: '400px', transform: 'translate(-50%, -50%)', animation: 'popIn 0.4s ease-out 0.5s forwards' }}>
        <div className="bg-blue-600 text-white p-3 rounded-full shadow-xl border-2 border-white">
          <Store className="w-6 h-6" />
        </div>
      </div>
      
      {/* Destination Marker */}
      <div className="absolute opacity-0 z-10" style={{ left: '260px', top: '200px', transform: 'translate(-50%, -50%)', animation: 'popIn 0.4s ease-out 1s forwards' }}>
        <div className="bg-rose-500 text-white p-3 rounded-full shadow-xl border-2 border-white">
          <Package className="w-6 h-6" />
        </div>
      </div>

      {/* Truck (Rider) animating along path */}
      <div className="absolute opacity-0 z-20" style={{ 
          transform: 'translate(-50%, -50%)', 
          animation: 'popIn 0.4s ease-out 2.5s forwards, moveTruck 4s linear 3s forwards' 
        }}>
        <div className="bg-slate-900 text-white p-3 rounded-full shadow-2xl border-4 border-emerald-400 relative">
          <Motorbike className="w-6 h-6" />
          <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-40" />
        </div>
      </div>

      {/* ETA Banner */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 opacity-0 z-30 w-[85%]" style={{ animation: 'popIn 0.5s ease-out 2.8s forwards' }}>
        <div className="bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center justify-center gap-3 border border-slate-700">
          <Motorbike className="w-6 h-6 text-emerald-400 animate-pulse shrink-0" />
          <div className="whitespace-nowrap flex items-baseline">
            <span className="text-emerald-400 font-extrabold text-xl">12 mins</span>
            <span className="text-slate-400 text-sm ml-2 font-medium">(3.5km)</span>
          </div>
        </div>
      </div>
      
      {/* Floating Status card */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 z-30 w-[85%]" style={{ animation: 'popIn 0.5s ease-out 1.2s forwards' }}>
        <div className="bg-white px-5 py-4 rounded-2xl shadow-2xl flex flex-col gap-2 border border-slate-200 w-full">
           <div>
             <div className="font-bold text-slate-900">Delivery in Progress</div>
             <div className="text-slate-500 text-sm">Rider is picking up your order</div>
           </div>
           <div className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 w-fit">
             <PhoneCall className="w-3 h-3" /> Call Rider
           </div>
        </div>
      </div>

    </div>
  </div>
);

// --- CSS KEYFRAMES ---

const customStyles = `
@keyframes popIn {
  0% { opacity: 0; transform: scale(0.8) translateY(20px); }
  50% { transform: scale(1.05) translateY(-5px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes slideInRight {
  0% { opacity: 0; transform: translateX(30px) scale(0.95); }
  100% { opacity: 1; transform: translateX(0) scale(1); }
}
@keyframes slideInLeft {
  0% { opacity: 0; transform: translateX(-30px) scale(0.95); }
  100% { opacity: 1; transform: translateX(0) scale(1); }
}
@keyframes fadeOut {
  0% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(0.9); }
}
@keyframes pulseClick {
  0% { transform: scale(1); }
  20% { transform: scale(0.9); box-shadow: 0 0 0 4px rgba(59,130,246,0.4); }
  100% { transform: scale(1); box-shadow: none; }
}
@keyframes typeText1 {
  0% { content: ""; }
  15% { content: "5 baskets"; }
  45% { content: "5 baskets of fresh tomatoes"; }
  100% { content: "5 baskets of fresh tomatoes for 50 GHS"; }
}
@keyframes typeText2 {
  0% { content: "Search p"; }
  100% { content: "Tomatoes"; color: #0f172a; }
}
@keyframes drawPath {
  0% { stroke-dashoffset: 1000; opacity: 1; }
  100% { stroke-dashoffset: 0; opacity: 1; }
}
@keyframes moveTruck {
  0% { left: 60px; top: 400px; opacity: 1; }
  33% { left: 160px; top: 400px; opacity: 1; }
  66% { left: 160px; top: 200px; opacity: 1; }
  100% { left: 260px; top: 200px; opacity: 1; }
}
@keyframes successBg {
  100% { background-color: #10B981; border-color: #059669; }
}
@keyframes successText {
  100% { content: "Deal Reached!"; }
}
`;
