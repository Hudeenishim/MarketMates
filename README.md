# MarketMates

A digital marketplace and logistics platform for market vendors and buyers in Ghana, featuring live negotiations and real-time delivery tracking.

## Tech Stack
- **Frontend Framework**: React 18 with TypeScript, built using Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database & Authentication**: Firebase (Firestore, Auth)
- **Maps & Routing**: Google Maps Platform (Maps JavaScript API, Places API, Routes API v2)
- **Voice Recognition**: Web Speech API (browser-native)
- **Charts**: Recharts

## Step-by-Step Flow

### 1. Authentication & Roles
- Users can log in using Firebase Authentication or select "Try Demo Mode" to bypass login.
- Three distinct roles are supported: **Vendor**, **Buyer**, and **Rider**.
- The app automatically routes users to their respective dashboard based on their role profile.

### 2. Vendor Flow (Product Management)
- Vendors navigate to their Dashboard where they can manage their inventory.
- They can add products manually or use the built-in **Voice Recognition** feature to quickly dictate product details.
- Vendors can also take pictures of their products using their device camera directly within the browser.

### 3. Buyer Flow (Shopping & Negotiation)
- Buyers browse the marketplace, which lists products available from various vendors.
- Selecting a product allows the buyer to initiate a **Negotiation**.
- In the Negotiation Center, buyers and vendors bargain on the price using interactive sliders until an agreement is reached.
- Once both parties accept the negotiated price, a **Delivery** record is generated.

### 4. Delivery Setup
- Both the Buyer and Vendor must set their exact physical locations for the delivery process.
- The Vendor sets the **Pickup Location**.
- The Buyer sets the **Dropoff Location**.
- These locations are selected via an interactive Google Map on the Delivery Dashboard.

### 5. Rider Flow (Fulfillment & Tracking)
- Riders log into their dedicated dashboard and broadcast their live location on the map.
- They can view all pending jobs around them.
- Upon clicking an available job, the Google Maps Routes API v2 calculates the exact driving path and provides a live ETA.
- The Rider clicks "Accept Job" to claim the delivery.
- As the Rider progresses, they update the status to "Picked Up" and finally "Delivered", completing the lifecycle.

## Running Locally

1. Copy `.env.example` to `.env` and fill in your Firebase and Google Maps API keys.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the local development server.
