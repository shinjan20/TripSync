export type PersonaId = 'budget' | 'professional' | 'solo' | 'family';

export interface Persona {
  id: PersonaId;
  name: string;
  age: string;
  occupation: string;
  subtitle: string;
  tagline: string;
  avatar: string;
  badgeColor: string;
  budgetCap: number;
  currency: string;
  originDefault: string;
  motivations: string[];
  painPoints: string[];
  needs: string[];
  recommendedKeywords: string[];
  welcomeMessage: string;
}

export interface FlightDetails {
  airline: string;
  airlineCode: string;
  flightNumber: string;
  departureCity: string;
  departureAirport: string;
  arrivalCity: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: string;
  cabin: string;
  baggage: string;
}

export interface HotelDetails {
  name: string;
  stars: number;
  rating: number;
  reviewCount: number;
  area: string;
  image: string;
  roomType: string;
  perks: string[];
  verifiedBadge: boolean;
  trustScore: number;
}

export interface ActivityDetails {
  title: string;
  category: string;
  duration: string;
  timeSlot: string;
  highlight: string;
  image: string;
  badge?: string;
  includedItems: string[];
}

export interface BundlePricing {
  flightCost: number;
  hotelCost: number;
  activityCost: number;
  individualTotal: number;
  bundleDiscount: number;
  bundlePrice: number;
  taxesAndFees: number;
  totalPayable: number;
}

export interface TravelBundle {
  id: string;
  title: string;
  tagline: string;
  destination: string;
  stateCountry: string;
  category: 'beach' | 'mountain' | 'heritage' | 'adventure' | 'wellness' | 'workcation';
  durationNights: number;
  durationDays: number;
  coverImage: string;
  galleryImages: string[];
  personaMatchScores: Record<PersonaId, number>;
  whyRecommended: Record<PersonaId, string>;
  tags: string[];
  flight: FlightDetails;
  hotel: HotelDetails;
  activity: ActivityDetails;
  pricing: BundlePricing;
  departureDates: string[];
  essentialsList: { item: string; required: boolean; category: string }[];
  safetyTips: string[];
  offlineAvailable: boolean;
}

export interface UserPreferences {
  originCity: string;
  activePersona: PersonaId;
  phone: string;
  fullName: string;
  email: string;
  completedOnboarding: boolean;
  travelFrequency: string;
  budgetPreference: 'budget' | 'moderate' | 'luxury';
  travelVibes: string[];
}

export interface Booking {
  id: string;
  pnr: string;
  bundleId: string;
  bundleTitle: string;
  destination: string;
  travelDate: string;
  returnDate: string;
  passengers: { name: string; age: number; gender: string }[];
  contactEmail: string;
  contactPhone: string;
  totalPaid: number;
  paymentMethod: 'upi' | 'card' | 'paylater';
  paymentId: string;
  status: 'CONFIRMED' | 'ONGOING' | 'COMPLETED';
  bookedAt: string;
  flightNumber: string;
  hotelName: string;
  activityName: string;
  offlinePackDownloaded: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'reminder' | 'deal' | 'safety' | 'flight' | 'essentials';
  timestamp: string;
  read: boolean;
  actionText?: string;
  badge?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedAction?: {
    type: 'view_bundle' | 'switch_persona' | 'open_checklist' | 'filter_destination';
    bundleId?: string;
    personaId?: PersonaId;
    label: string;
  };
}

