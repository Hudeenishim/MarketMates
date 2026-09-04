const fs = require('fs');
let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');

const oldModal = `<div className="bg-black p-6 flex justify-between items-center pb-8">
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
          </div>`;

const newModal = `<div className="bg-black p-6 flex justify-between items-center pb-12 shrink-0">
            <button
              onClick={stopCamera}
              className="px-6 py-3 rounded-2xl bg-slate-800 text-white font-bold"
            >
              Cancel
            </button>
            <button
              onClick={capturePhoto}
              className="px-8 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold flex items-center gap-2"
            >
              <Camera className="w-5 h-5" />
              Capture
            </button>
            <div className="w-[100px] hidden sm:block" />
          </div>`;

code = code.replace(oldModal, newModal);
fs.writeFileSync('src/views/VendorDashboard.tsx', code);
