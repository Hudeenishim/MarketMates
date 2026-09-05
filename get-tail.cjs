const fs = require('fs');
let code = fs.readFileSync('src/views/NegotiationCenter.tsx', 'utf8');

const startIndex = code.indexOf('{/* Actions ');
const endIndex = code.indexOf('</>', startIndex);

if(startIndex > -1 && endIndex > -1) {
  const toReplace = code.substring(startIndex, endIndex);

const newActions = `{/* Sticky Footer Chat Actions */}
                {selectedNeg.status === 'open' && (
                  <div className="sticky bottom-0 bg-white border-t border-slate-100 p-4 sm:p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] rounded-b-[2rem] mt-auto">
                    {selectedNeg.last_actor !== profile?.role ? (
                      <div className="flex flex-col gap-4">
                        <div className="flex gap-2 mb-2">
                          <button 
                            onClick={() => handleAction('accept')}
                            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm shadow-emerald-200"
                          >
                            <CheckCircle className="w-5 h-5" /> Accept ₵{selectedNeg.current_offer}
                          </button>
                          <button 
                            onClick={() => handleAction('reject')}
                            className="flex-1 bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                          >
                            <XCircle className="w-5 h-5" /> Decline
                          </button>
                        </div>
                        <div className="relative">
                           <div className="absolute inset-0 flex items-center">
                             <div className="w-full border-t border-slate-200"></div>
                           </div>
                           <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-400">
                             <span className="px-4 bg-white">Or Counter Offer</span>
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="relative flex-shrink-0 w-28 sm:w-32">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₵</span>
                            <input
                              type="number"
                              min={1}
                              value={counterOfferValue || ''}
                              onChange={(e) => setCounterOfferValue(Number(e.target.value))}
                              className="w-full pl-8 pr-3 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#10B981] outline-none font-bold text-slate-900 bg-slate-50"
                              placeholder="Offer"
                            />
                          </div>
                          <div className="relative flex-1">
                            <input
                              type="text"
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              placeholder="Message..."
                              className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#10B981] outline-none text-sm bg-slate-50"
                              onKeyDown={(e) => { if(e.key === 'Enter') handleAction('counter'); }}
                            />
                            <button
                              onClick={toggleRecording}
                              className={\`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors \${
                                isRecording 
                                  ? 'text-red-500 bg-red-50 animate-pulse' 
                                  : 'text-slate-400 hover:text-[#10B981] hover:bg-emerald-50'
                              }\`}
                            >
                              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                            </button>
                          </div>
                          <button 
                            onClick={() => handleAction('counter')}
                            className="bg-slate-900 text-white p-3 rounded-xl hover:bg-slate-800 transition-colors shadow-md"
                          >
                            <Send className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <div className="text-center p-4 rounded-xl bg-amber-50 border border-amber-100">
                          <div className="text-amber-700 text-sm font-bold flex items-center justify-center gap-2">
                            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                            Waiting for {selectedNeg.otherPartyName} to respond...
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="relative flex-1">
                            <input
                              type="text"
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              placeholder="Send a follow-up message..."
                              className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#10B981] outline-none text-sm bg-slate-50"
                              onKeyDown={(e) => { if(e.key === 'Enter') handleAction('chat'); }}
                            />
                            <button
                              onClick={toggleRecording}
                              className={\`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors \${
                                isRecording 
                                  ? 'text-red-500 bg-red-50 animate-pulse' 
                                  : 'text-slate-400 hover:text-[#10B981] hover:bg-emerald-50'
                              }\`}
                            >
                              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                            </button>
                          </div>
                          <button 
                            onClick={() => handleAction('chat')}
                            disabled={!message.trim()}
                            className="bg-slate-900 text-white p-3 rounded-xl hover:bg-slate-800 transition-colors shadow-md disabled:opacity-50"
                          >
                            <Send className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
              </div>
            </div>
          `;

  code = code.substring(0, startIndex) + newActions + code.substring(endIndex);
  fs.writeFileSync('src/views/NegotiationCenter.tsx', code);
  console.log('Successfully patched chat footer');
} else {
  console.log('Could not find bounds', startIndex, endIndex);
}

