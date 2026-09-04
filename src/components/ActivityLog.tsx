import React from 'react';
import { Negotiation, Actor } from '../types';
import { Activity, ArrowRight, CheckCircle, XCircle, Clock } from 'lucide-react';

interface RichNegotiation extends Negotiation {
  product?: { name: string };
  otherPartyName?: string;
}

interface ActivityLogProps {
  negotiations: RichNegotiation[];
  userRole?: Actor;
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ negotiations, userRole }) => {
  // Extract all events from all negotiations
  const allEvents = negotiations.flatMap((neg) => {
    const history = neg.negotiation_history || [];
    return history.map((event) => ({
      ...event,
      productName: neg.product?.name || 'Unknown Product',
      negId: neg.id,
      otherPartyName: neg.otherPartyName,
    }));
  });

  // Also include the final status if it's accepted/rejected as an event?
  // Let's stick to the negotiation_history events.
  const recentEvents = allEvents
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5); // Show top 5

  if (recentEvents.length === 0) {
    return (
      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-center">
        <Activity className="w-8 h-8 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500 text-sm font-medium">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
      <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
        <Activity className="w-5 h-5 text-emerald-500" />
        <h3 className="font-bold text-slate-900">Recent Activity</h3>
      </div>
      <div className="divide-y divide-slate-100 flex-1 overflow-y-auto">
        {recentEvents.map((event, idx) => {
          const isMe = event.actor === userRole;
          return (
            <div key={`${event.negId}-${idx}`} className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-4">
              <div className="mt-1">
                {isMe ? (
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {isMe ? 'You' : event.otherPartyName || 'The other party'} 
                  {event.offer !== null && event.offer !== undefined 
                    ? <span> offered <span className="font-bold">₵{event.offer}</span></span>
                    : <span> sent a message</span>}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  for {event.productName}
                </p>
              </div>
              <div className="text-[10px] font-bold text-slate-400 whitespace-nowrap">
                {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
