const fs = require('fs');
let code = fs.readFileSync('src/views/NegotiationCenter.tsx', 'utf8');

code = code.replace(
  /<div className="text-lg font-bold">\s*₵\{event\.offer\}\s*<\/div>/g,
  `{event.offer !== null && event.offer !== undefined && (
                              <div className="text-lg font-bold">
                                ₵{event.offer}
                              </div>
                            )}`
);

// We need to add a "Send Message" button so they can just chat.
// Or maybe a chat input that has a send icon, separate from the Counter Offer.
// Let's replace the single chat input to have its own send button.
const inputRegex = /<div className="relative mb-6">[\s\S]*?<\/div>/;
code = code.replace(
  inputRegex,
  `<div className="relative mb-6">
                        <input
                          type="text"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Add a message (optional)"
                          className="w-full px-4 py-3 pr-20 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#10B981] outline-none text-sm transition-all"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                          <button
                            onClick={toggleRecording}
                            className={\`p-2 rounded-lg transition-colors \${
                              isRecording 
                                ? 'text-red-500 bg-red-50 animate-pulse' 
                                : 'text-slate-400 hover:text-[#10B981] hover:bg-emerald-50'
                            }\`}
                          >
                            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleAction('chat')}
                            disabled={!message.trim()}
                            className="p-2 rounded-lg bg-[#10B981] text-white hover:bg-[#059669] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>`
);

fs.writeFileSync('src/views/NegotiationCenter.tsx', code);
