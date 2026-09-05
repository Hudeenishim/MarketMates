export type Role = 'vendor' | 'buyer' | 'rider';

export interface Profile {
  id: string; // Document ID
  full_name: string;
  email: string;
  phone_number?: string;
  role: Role;
  market_hub_id: string;
  avatar_url: string;
  rating?: number;
  review_count?: number;
  created_at: number;
  updated_at: number;
}

export interface LocationData {
  lat: number;
  lng: number;
  address?: string;
}

export interface Delivery {
  payment_timing?: 'before_delivery' | 'on_delivery';
  payment_status?: 'pending' | 'paid';
  amount?: number;
  id: string;
  negotiation_id: string;
  vendor_id: string;
  buyer_id: string;
  rider_id?: string;
  status: 'pending' | 'accepted' | 'picked_up' | 'delivered';
  pickup_location: LocationData;
  delivery_location: LocationData;
  current_rider_location?: LocationData;
  created_at: number;
  updated_at: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string;
  category: string;
  price_ghs: number;
  vendor_id: string;
  stock_status: boolean;
  stock_quantity: number;
  unit?: string;
  audio_listing_url: string;
  created_at: number;
  updated_at: number;
}

export type NegotiationStatus = 'open' | 'accepted' | 'rejected';
export type Actor = 'buyer' | 'vendor';

export interface NegotiationEvent {
  timestamp: number;
  actor: Actor;
  offer?: number | null;
  message?: string;
}

export interface Negotiation {
  quantity?: number;
  payment_status?: 'pending' | 'paid';
  payment_timing?: 'before_delivery' | 'on_delivery';
  id: string;
  product_id: string;
  buyer_id: string;
  vendor_id: string;
  current_offer?: number | null;
  current_counter_offer?: number | null;
  last_actor: Actor;
  status: NegotiationStatus;
  created_at: number;
  updated_at: number;
  negotiation_history?: NegotiationEvent[];
}

export interface Market {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  main_categories: string[];
}



declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
