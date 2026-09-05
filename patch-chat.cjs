const fs = require('fs');
let code = fs.readFileSync('src/views/NegotiationCenter.tsx', 'utf8');

code = code.replace(
  /import \{ MessageCircle, CheckCircle, XCircle, ArrowRight, Mic, MicOff, Search, CreditCard \} from 'lucide-react';/,
  `import { MessageCircle, CheckCircle, XCircle, ArrowRight, Mic, MicOff, Search, CreditCard, Phone, Send } from 'lucide-react';`
);

// Replace header call button
code = code.replace(
  /<div className="flex items-center gap-3 text-slate-500 text-base sm:text-lg">([\s\S]*?)<\/div>\s*<\/div>\s*<div className="text-right flex flex-col justify-center">/,
  `<div className="flex items-center gap-3 text-slate-500 text-base sm:text-lg">
                  <span>Negotiating with {selectedNeg.otherPartyName}</span>
                  {selectedNeg.otherPartyPhone ? (
                    <a href={"tel:" + selectedNeg.otherPartyPhone} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 font-bold transition-colors text-sm shadow-md shadow-emerald-200">
                      <Phone className="w-4 h-4" />
                      Call {selectedNeg.otherPartyName?.split(' ')[0]}
                    </a>
                  ) : (
                    <button onClick={() => alert('This user has not provided a phone number.')} className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 text-slate-400 rounded-full font-bold transition-colors text-sm">
                      <Phone className="w-4 h-4" />
                      No Phone
                    </button>
                  )}
                </div>
              </div>
              <div className="text-right flex flex-col justify-center">`
);

// Redesign actions section
const oldActions = `{/* Actions (Only if Open & It's my turn) */}
                {selectedNeg.status === 'open' && selectedNeg.last_actor !== profile?.role && (
                  <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-[2rem] shadow-sm mt-8">
                    <h4 className="text-lg font-bold text-slate-900 mb-6 text-center">Your Response</h4>
                    
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                      <button 
                        onClick={() => handleAction('accept')}
                        className="flex-1 flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-semibold transition-colors shadow-sm text-sm"
                      >
                        <CheckCircle className="w-5 h-5" />
                        <span>Accept Offer</span>
                      </button>
                      <button 
                        onClick={() => handleAction('reject')}
                        className="flex-1 flex items-center justify-center space-x-2 bg-white border-2 border-red-100 text-red-600 hover:bg-red-50 py-3 rounded-xl font-semibold transition-colors text-sm"
                      >
                        <XCircle className="w-5 h-5" />
                        <span>Decline</span>
                      </button>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200"></div>
                      </div>
                      <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-400">
                        <span className="px-4 bg-white">Or Make Counter Offer</span>
                      </div>
                    </div>

                    <div className="mt-8">
                      <div className="mb-4">
                        <label className="text-slate-700 font-bold text-sm block mb-2">Your Counter Offer (₵)</label>
                        <input
                          type="number"
                          min={1}
                          value={counterOfferValue || ''}
                          onChange={(e) => setCounterOfferValue(Number(e.target.value))}
                          placeholder="Type your offer amount..."
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#10B981] outline-none text-sm font-bold text-slate-900 transition-all"
                        />
                      </div>
                      
                      <div className="relative mb-6">
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
                      </div>
                      <button 
                        onClick={() => handleAction('counter')}
                        className="w-full flex items-center justify-center space-x-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 py-3 rounded-xl font-semibold transition-colors text-sm"
                      >
                        <span>Send Counter Offer</span>
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}`;

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
                )}`;

// We need to replace it cleanly. I will split the file by a unique string.
const parts = code.split(oldActions);
if(parts.length === 2) {
  code = parts[0] + newActions + parts[1];
} else {
  console.error('Failed to replace oldActions', parts.length);
}

// Adjust padding and scrolling for the main content area so it looks like a chat app
code = code.replace(
  /<div className="flex-1 p-6 md:p-8 overflow-y-auto">/,
  `<div className="flex-1 p-6 md:p-8 overflow-y-auto bg-[#F9FAFB] flex flex-col justify-end">`
);

fs.writeFileSync('src/views/NegotiationCenter.tsx', code);
console.log('patched chat UI');
