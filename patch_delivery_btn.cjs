const fs = require('fs');

function patchFile(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  // Change the disabled state of the button
  code = code.replace(
    /disabled=\{\!markerPosition\}/g,
    `disabled={!markerPosition || (!selectedDelivery && !activeNegotiation)}`
  );

  // Maybe change the button text to make it clear?
  code = code.replace(
    /Save My Location/g,
    `{(!selectedDelivery && !activeNegotiation) ? 'Select a delivery first' : 'Save My Location'}`
  );

  // In handleSaveLocation, add an alert if not selected
  code = code.replace(
    `const handleSaveLocation = async () => {\n    if (!markerPosition || !profile) return;\n    \n    try {`,
    `const handleSaveLocation = async () => {\n    if (!markerPosition || !profile) return;\n    if (!selectedDelivery && !activeNegotiation) {\n      alert('Please select a delivery from the list first to update its location.');\n      return;\n    }\n    \n    try {`
  );

  fs.writeFileSync(filename, code);
}

patchFile('src/views/DeliveryDashboard.tsx');
