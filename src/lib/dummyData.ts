import { Product, Negotiation, Market } from '../types';

export const dummyProducts: Product[] = [
  {
    id: 'p1',
    name: 'Fresh Plantains',
    description: 'A bunch of fresh, large plantains directly from the farm.',
    image_url: 'https://images.unsplash.com/photo-1616421526435-060443a2902b?w=500&auto=format&fit=crop&q=60',
    category: 'Product',
    price_ghs: 50,
    vendor_id: 'v1',
    stock_status: true,
    stock_quantity: 10,
    unit: 'bunches',
    audio_listing_url: '',
    created_at: Date.now() - 100000,
    updated_at: Date.now(),
  },
  {
    id: 'p2',
    name: 'Yam Tubers',
    description: 'High-quality Pona yams, 3 large tubers.',
    image_url: 'https://images.unsplash.com/photo-1596483427382-747f4f6e1b7c?w=500&auto=format&fit=crop&q=60',
    category: 'Product',
    price_ghs: 120,
    vendor_id: 'v1',
    stock_status: true,
    stock_quantity: 10,
    unit: 'pieces',
    audio_listing_url: '',
    created_at: Date.now() - 200000,
    updated_at: Date.now(),
  },
  {
    id: 'p3',
    name: 'Tomatoes Basket',
    description: 'Medium basket of fresh red tomatoes.',
    image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=60',
    category: 'Vegetables',
    price_ghs: 250,
    vendor_id: 'v2',
    stock_status: true,
    stock_quantity: 10,
    unit: 'baskets',
    audio_listing_url: '',
    created_at: Date.now() - 300000,
    updated_at: Date.now(),
  }
];

export const dummyProfiles: Record<string, any> = {
  v1: {
    id: 'v1',
    full_name: 'Kwame Mensah',
    email: 'kwame@example.com',
    role: 'vendor',
    market_hub_id: 'm1',
    avatar_url: '',
    rating: 4.5,
    review_count: 12,
    created_at: Date.now(),
    updated_at: Date.now()
  },
  v2: {
    id: 'v2',
    full_name: 'Ama Serwaa',
    email: 'ama@example.com',
    role: 'vendor',
    market_hub_id: 'm2',
    avatar_url: '',
    rating: 4.8,
    review_count: 34,
    created_at: Date.now(),
    updated_at: Date.now()
  }
};
export const dummyMarkets: Market[] = [
  {
    id: 'm1',
    name: 'Makola Market',
    latitude: 5.5526,
    longitude: -0.2030,
    address: 'Accra Central',
    main_categories: ['Product', 'Textiles', 'General'],
  },
  {
    id: 'm2',
    name: 'Madina Market',
    latitude: 5.6667,
    longitude: -0.1667,
    address: 'Madina, Accra',
    main_categories: ['Product', 'Meat', 'Household'],
  }
];

export const dummyNegotiations: Negotiation[] = [
  {
    id: 'n1',
    product_id: 'p1',
    buyer_id: 'b1',
    vendor_id: 'v1',
    current_offer: 40,
    current_counter_offer: 45,
    last_actor: 'vendor',
    status: 'open',
    created_at: Date.now() - 50000,
    updated_at: Date.now() - 1000,
    negotiation_history: [
      { timestamp: Date.now() - 50000, actor: 'buyer', offer: 40 },
      { timestamp: Date.now() - 1000, actor: 'vendor', offer: 45 }
    ]
  }
];
