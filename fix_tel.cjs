const fs = require('fs');

let nc = fs.readFileSync('src/views/NegotiationCenter.tsx', 'utf8');
nc = nc.replace(/<a href=\{`tel:\$\{selectedNeg.otherPartyPhone\}`\} className="(.*?)"/g, 
                '<a href={`tel:${selectedNeg.otherPartyPhone}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="$1"');
fs.writeFileSync('src/views/NegotiationCenter.tsx', nc);

let dd = fs.readFileSync('src/views/DeliveryDashboard.tsx', 'utf8');
dd = dd.replace(/<a href=\{"tel:" \+ d\.otherPartyPhone\} className="(.*?)"/g, 
                '<a href={"tel:" + d.otherPartyPhone} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="$1"');
dd = dd.replace(/<a href=\{"tel:" \+ d\.riderPhone\} className="(.*?)"/g, 
                '<a href={"tel:" + d.riderPhone} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="$1"');

dd = dd.replace(/<a href=\{"tel:" \+ selectedDelivery\.otherPartyPhone\} className="(.*?)"/g, 
                '<a href={"tel:" + selectedDelivery.otherPartyPhone} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="$1"');
dd = dd.replace(/<a href=\{"tel:" \+ selectedDelivery\.riderPhone\} className="(.*?)"/g, 
                '<a href={"tel:" + selectedDelivery.riderPhone} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="$1"');
fs.writeFileSync('src/views/DeliveryDashboard.tsx', dd);

console.log("Patched tel links");
