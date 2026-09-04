import { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export const useNegotiationNotifications = () => {
  const { user, profile, demoMode } = useAuth();
  const initialLoadRef = useRef(true);

  // Request permission on mount
  useEffect(() => {
    if (!('Notification' in window)) return;
    
    // Only ask if we haven't asked yet
    if (Notification.permission === 'default') {
      Notification.requestPermission().catch(console.warn);
    }
  }, []);

  useEffect(() => {
    // If not authenticated or in demo mode, do nothing
    if ((!user || !profile) && !demoMode) return;
    
    // Reset initial load tracking when user/demo state changes
    initialLoadRef.current = true;
    
    let q;

    if (demoMode) {
       // Demo mode: we could listen to a mock mechanism, 
       // but since demo mode doesn't write to firestore in the same way for background notifications easily,
       // we might just skip background push notifications for demo mode, or mock it.
       // We'll just exit for demo mode since actual background listening implies real backend changes.
       return;
    } else if (user && profile) {
       const roleField = profile.role === 'vendor' ? 'vendor_id' : 'buyer_id';
       q = query(
         collection(db, 'negotiations'),
         where(roleField, '==', user.uid)
       );
    }

    if (!q) return;

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (initialLoadRef.current) {
        initialLoadRef.current = false;
        return;
      }

      snapshot.docChanges().forEach((change) => {
        const data = change.doc.data();
        
        // We only care if the OTHER party acted. If we are the last_actor, we triggered it.
        if (data.last_actor !== profile?.role) {
          
          // Check if app is in background
          if (document.hidden) {
             if (change.type === 'modified') {
               let title = 'Negotiation Update';
               let body = 'You have a new update on a negotiation.';

               if (data.status === 'accepted') {
                 title = 'Deal Reached!';
                 body = `Your offer of ₵${data.current_offer} was accepted.`;
               } else if (data.status === 'rejected') {
                 title = 'Deal Closed';
                 body = `The negotiation was declined.`;
               } else if (data.status === 'open') {
                 title = 'New Counter-Offer';
                 body = `You received a new counter-offer of ₵${data.current_offer}.`;
               }

               if (Notification.permission === 'granted') {
                 new Notification(title, { body });
               }
             }
             
             if (change.type === 'added') {
               if (Notification.permission === 'granted') {
                 new Notification('New Offer Received', {
                   body: `Someone opened a new negotiation for ₵${data.current_offer}.`
                 });
               }
             }
          }
        }
      });
    });

    return () => unsubscribe();
  }, [user, profile, demoMode]);
};
