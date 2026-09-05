# MarketMates - Local Market Connect

MarketMates is a full-stack platform designed to bridge the gap between local market vendors and buyers, offering a seamless experience from product listing to delivery.

## Key Features

*   **Voice-Powered Listings**: Vendors can instantly list products by speaking into their device. Our integrated AI transcribes and formats the listing automatically.
*   **AI-Assisted Negotiation**: A chat-based negotiation system where buyers can haggle over prices. Vendors can automate their responses using our AI Assistant, ensuring 24/7 availability.
*   **Flexible Payment Options**: Once a deal is reached, buyers can choose to securely **Pay Now** via Paystack or select **Pay on Delivery**, ensuring trust and convenience for all parties.
*   **Live Delivery Tracking**: A dedicated dashboard for Riders to accept jobs. Buyers and Vendors can track the live location of the rider on an interactive map.

## End-to-End System Walkthrough

Follow these steps to experience the complete flow of MarketMates:

### 1. Vendor: Listing a Product
1. Log in as a **Vendor**.
2. Navigate to your **Dashboard**.
3. Click on the **Voice Listing** microphone button.
4. Speak naturally (e.g., "I have 5 baskets of fresh tomatoes for 50 cedis").
5. The AI will instantly generate a structured listing. Confirm and publish it.

### 2. Buyer: Discovery and Negotiation
1. Log in as a **Buyer**.
2. Browse the **Market Hubs** or use the search bar to find the vendor's tomatoes.
3. Click **Negotiate** on the product card.
4. Use the interactive chat interface to submit an offer or counter-offer.
5. The Vendor (or their AI Assistant) will review and Accept/Decline the offer.

### 3. Buyer: Payment and Checkout
1. Once the offer is **Accepted**, the Buyer is prompted to choose a payment method.
2. Select **Pay Now** to process the payment instantly via the integrated Paystack gateway, OR select **Pay on Delivery** to hand over cash later.
3. After confirming payment timing, the Buyer clicks **Arrange Delivery**.
4. The Buyer drops a pin on the interactive map to specify their exact delivery destination.

### 4. Rider: Order Fulfillment
1. Log in as a **Rider**.
2. Navigate to the **Delivery Dashboard** to view available, pending delivery requests.
3. Accept the new delivery job.
4. The Rider's dashboard will clearly indicate if the order is **Pre-Paid** or if they need to **Collect Cash** (and exactly how much) upon arrival.
5. As the Rider moves, their live location updates for both the Buyer and Vendor to track.
6. The Rider updates the status to **Picked Up** and finally **Delivered**.

## Technology Stack

*   **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons
*   **Backend / Database**: Firebase (Firestore, Authentication)
*   **Payments**: Paystack (react-paystack)
*   **Maps**: Google Maps Platform (@vis.gl/react-google-maps)
*   **AI Integration**: @google/genai (Gemini 2.5 Flash)

## Setup Instructions

1. Clone the repository and run \`npm install\`.
2. Configure your environment variables in \`.env\`:
   * \`GEMINI_API_KEY\`
   * \`VITE_GOOGLE_MAPS_API_KEY\`
   * \`VITE_PAYSTACK_PUBLIC_KEY\`
3. Run \`npm run dev\` to start the development server.
