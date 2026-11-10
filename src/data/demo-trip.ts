export type StageId =
  | "seasons"
  | "dates"
  | "route"
  | "activities"
  | "food"
  | "vault"
  | "transit"
  | "stays"
  | "fleet"
  | "locker"
  | "radar";

export interface Member {
  id: string;
  name: string;
  role: "Trip admin" | "Member";
  city: string;
  diet: string;
  constraint?: string;
  deposit: number;
  target: number;
}

export interface SeasonWindow {
  id: string;
  title: string;
  range: string;
  weather: string;
  crowd: string;
  cost: string;
  score: number;
  recommended?: boolean;
  pros: string[];
  cons: string[];
}

export interface MacroDay {
  id: string;
  title: string;
  region: string;
  summary: string;
  stay: string;
  distanceKm: number;
  tag: string;
}

export interface Activity {
  id: string;
  hub: string;
  title: string;
  cost: number;
  duration: string;
  kind: string;
  vegSafe: boolean;
}

export interface Flavour {
  id: string;
  title: string;
  place: string;
  note: string;
  vegSafe: boolean;
}

export interface TransitMode {
  id: "flight" | "train" | "car";
  title: string;
  duration: string;
  summary: string;
  pros: string[];
  cons: string[];
}

export interface HotelOption {
  id: string;
  name: string;
  area: string;
  pricePerNight: number;
  note: string;
}

export interface StayStop {
  id: string;
  place: string;
  nights: string;
  options: HotelOption[];
}

export interface CabOption {
  id: string;
  name: string;
  price: number;
  fit: string;
  driver: string;
}

export interface ReplanOption {
  id: string;
  title: string;
  tag: string;
  time: string;
  cost: number;
  detail: string;
}

export const TRIP = {
  code: "TS-8942",
  title: "Clouds, waterfalls, and living root bridges",
  destination: "Shillong & Cherrapunji",
  region: "Meghalaya",
  budgetMin: 22000,
  budgetMax: 34000,
  activityCeiling: 4500,
  datesLabel: "16–20 Oct 2026",
  duration: "5 days · 4 nights",
};

export const MEMBERS: Member[] = [
  {
    id: "kabir",
    name: "Kabir Roy",
    role: "Trip admin",
    city: "Delhi",
    diet: "No restriction",
    deposit: 22000,
    target: 25000,
  },
  {
    id: "priya",
    name: "Priya Menon",
    role: "Member",
    city: "Bengaluru",
    diet: "Vegetarian",
    constraint: "No hike longer than 6 km",
    deposit: 18000,
    target: 25000,
  },
  {
    id: "rohan",
    name: "Rohan Varma",
    role: "Member",
    city: "Delhi",
    diet: "No restriction",
    constraint: "Client call until 11:30 on departure day",
    deposit: 18000,
    target: 25000,
  },
  {
    id: "tanya",
    name: "Tanya Sen",
    role: "Member",
    city: "Kolkata",
    diet: "No restriction",
    deposit: 20000,
    target: 25000,
  },
];

export const YOU = "kabir";

export const SEASONS: SeasonWindow[] = [
  {
    id: "oct",
    title: "Mid-October cascades",
    range: "16–20 Oct 2026",
    weather: "21°C · light mist",
    crowd: "Moderate",
    cost: "₹24,000–₹30,000 / person",
    score: 92,
    recommended: true,
    pros: [
      "Waterfalls are at full volume",
      "Flights after noon clear Rohan’s morning call",
      "Lower fares than the winter peak",
    ],
    cons: ["Short passing showers"],
  },
  {
    id: "nov",
    title: "Clear winter water",
    range: "20–24 Nov 2026",
    weather: "16°C · dry and crisp",
    crowd: "High",
    cost: "₹28,000–₹36,000 / person",
    score: 74,
    pros: ["Umngot river is at its clearest", "Almost no rain risk"],
    cons: ["Hotels run about 25% higher", "Cave queues are longer"],
  },
  {
    id: "mar",
    title: "Spring ridges",
    range: "6–10 Mar 2027",
    weather: "18°C · dry",
    crowd: "Light",
    cost: "₹22,000–₹28,000 / person",
    score: 68,
    pros: ["Quieter roads", "Easier last-minute rooms"],
    cons: ["Waterfalls are thinner", "Less group overlap on dates"],
  },
];

export const INITIAL_VOTES: Record<string, string[]> = {
  oct: ["kabir", "priya", "tanya"],
  nov: ["rohan"],
  mar: [],
};

export const MONTH = { year: 2026, month: 9, label: "October 2026" };

export const INITIAL_DATES: Record<string, string[]> = {
  kabir: ["2026-10-16", "2026-10-17", "2026-10-18", "2026-10-19", "2026-10-20"],
  priya: ["2026-10-15", "2026-10-16", "2026-10-17", "2026-10-18", "2026-10-19", "2026-10-20"],
  rohan: ["2026-10-16", "2026-10-17", "2026-10-18", "2026-10-19", "2026-10-20", "2026-10-21"],
  tanya: ["2026-10-16", "2026-10-17", "2026-10-18", "2026-10-19", "2026-10-20"],
};

export const INITIAL_DAYS: MacroDay[] = [
  {
    id: "shillong-in",
    title: "Arrive in the pine city",
    region: "Shillong & Umiam",
    summary: "Airport transfer, lake sunset, and a cafe evening.",
    stay: "Ri Kynjai",
    distanceKm: 100,
    tag: "Lakeside",
  },
  {
    id: "sohra",
    title: "Canyons and waterfalls",
    region: "Cherrapunji",
    summary: "Nohkalikai, Mawsmai caves, and a viewpoint lunch.",
    stay: "Polo Orchid",
    distanceKm: 54,
    tag: "Waterfalls",
  },
  {
    id: "dawki",
    title: "Crystal water and a village",
    region: "Dawki & Mawlynnong",
    summary: "Umngot boat, living root bridge, and a village walk.",
    stay: "Polo Orchid",
    distanceKm: 85,
    tag: "Border",
  },
  {
    id: "shillong-out",
    title: "Heritage, tea, and the drive back",
    region: "Shillong to Guwahati",
    summary: "Market souvenirs, a museum stop, and the airport run.",
    stay: "Departure day",
    distanceKm: 120,
    tag: "Return",
  },
];

export const ACTIVITIES: Activity[] = [
  { id: "umiam", hub: "shillong-in", title: "Sunset tea at Umiam Lake", cost: 400, duration: "1 hr", kind: "Scenic", vegSafe: true },
  { id: "dylan", hub: "shillong-in", title: "Dinner and folk music at Dylan's Cafe", cost: 750, duration: "2 hr", kind: "Evening", vegSafe: true },
  { id: "wards", hub: "shillong-in", title: "Ward's Lake evening stroll", cost: 150, duration: "45 min", kind: "Easy", vegSafe: true },
  { id: "nohkalikai", hub: "sohra", title: "Nohkalikai canyon viewpoint", cost: 200, duration: "1 hr", kind: "Scenic", vegSafe: true },
  { id: "mawsmai", hub: "sohra", title: "Mawsmai limestone caves", cost: 250, duration: "1.5 hr", kind: "Walk", vegSafe: true },
  { id: "zipline", hub: "sohra", title: "Mawkdok valley zipline", cost: 2500, duration: "2 hr", kind: "Adventure", vegSafe: true },
  { id: "orange", hub: "sohra", title: "Orange Roots vegetarian lunch", cost: 450, duration: "1 hr", kind: "Meal", vegSafe: true },
  { id: "boat", hub: "dawki", title: "Umngot clear-water boat", cost: 800, duration: "1.5 hr", kind: "Water", vegSafe: true },
  { id: "root", hub: "dawki", title: "Riwai living root bridge", cost: 200, duration: "1 hr", kind: "Walk", vegSafe: true },
  { id: "village", hub: "dawki", title: "Mawlynnong village walk", cost: 150, duration: "1 hr", kind: "Culture", vegSafe: true },
  { id: "kayak", hub: "dawki", title: "Shnongpdeng kayak", cost: 1800, duration: "2 hr", kind: "Adventure", vegSafe: true },
  { id: "bazaar", hub: "shillong-out", title: "Police Bazar tea and souvenirs", cost: 200, duration: "1.5 hr", kind: "Market", vegSafe: true },
  { id: "museum", hub: "shillong-out", title: "Don Bosco museum", cost: 300, duration: "1.5 hr", kind: "Culture", vegSafe: true },
  { id: "drive", hub: "shillong-out", title: "Pine-forest highway drive", cost: 0, duration: "3 hr", kind: "Transit", vegSafe: true },
];

export const INITIAL_PICKS: Record<string, string[]> = {
  "shillong-in": ["umiam", "dylan"],
  sohra: ["nohkalikai", "mawsmai", "orange"],
  dawki: ["boat", "root"],
  "shillong-out": ["bazaar", "museum"],
};

export const FLAVOURS: Flavour[] = [
  { id: "jadoh", title: "Khasi jadoh and sesame curry", place: "Shillong", note: "Local pork rice. Needs a separate vegetarian plate.", vegSafe: false },
  { id: "thali", title: "Orange Roots vegetarian thali", place: "Cherrapunji", note: "Safe for the whole group, including Priya.", vegSafe: true },
  { id: "cocoa", title: "Apple pie and hot cocoa", place: "Dylan's Cafe", note: "Evening anchor after the lake.", vegSafe: true },
  { id: "momos", title: "Police Bazar steamed momos", place: "Shillong", note: "Ask for the steamed vegetable batch.", vegSafe: true },
  { id: "lewduh", title: "Lewduh market walk", place: "Bara Bazar", note: "One of the oldest markets in the hills. Go before noon.", vegSafe: true },
  { id: "hightea", title: "Cafe Cherrapunjee high tea", place: "Sohra", note: "Fireplace stop between the falls and the caves.", vegSafe: true },
];

export const INITIAL_FLAVOURS = ["thali", "cocoa", "momos"];

export const ORIGINS = [
  { code: "DEL", city: "Delhi", flight: 8900 },
  { code: "BLR", city: "Bengaluru", flight: 7600 },
  { code: "BOM", city: "Mumbai", flight: 9400 },
  { code: "CCU", city: "Kolkata", flight: 4200 },
  { code: "HYD", city: "Hyderabad", flight: 8100 },
];

export const TRANSIT: TransitMode[] = [
  {
    id: "flight",
    title: "Direct flight",
    duration: "2h 25m",
    summary: "Leaves after noon, so Rohan’s 11:30 call still fits.",
    pros: ["Shortest travel day", "Seats held as a block"],
    cons: ["Highest fare of the three"],
  },
  {
    id: "train",
    title: "Overnight train",
    duration: "28h 15m",
    summary: "AC berths through North Bengal, meals included.",
    pros: ["Much cheaper", "No baggage cap"],
    cons: ["Uses a full extra day"],
  },
  {
    id: "car",
    title: "Chauffeured highway car",
    duration: "About 32h",
    summary: "NH27 with one overnight halt.",
    pros: ["Stop wherever the group wants", "Room for bags"],
    cons: ["Long drive", "Needs a motel night"],
  },
];

export const TRAIN_FARE = 3200;
export const CAR_FARE = 4600;

export const STAYS: StayStop[] = [
  {
    id: "shillong",
    place: "Shillong",
    nights: "Nights 1 and 2",
    options: [
      { id: "rikynjai", name: "Ri Kynjai", area: "Umiam Lake", pricePerNight: 8200, note: "Lake resort. Current group lean." },
      { id: "marriott", name: "Courtyard by Marriott", area: "Police Bazar", pricePerNight: 9100, note: "Central, easier if someone lands late." },
    ],
  },
  {
    id: "sohra",
    place: "Cherrapunji",
    nights: "Night 3",
    options: [
      { id: "polo", name: "Polo Orchid", area: "Sohra", pricePerNight: 7400, note: "Shortest hop to the waterfalls." },
      { id: "jiva", name: "Jiva Resort", area: "Sohra ridge", pricePerNight: 6900, note: "Quieter, farther from the caves." },
    ],
  },
];

export const CABS: CabOption[] = [
  {
    id: "innova",
    name: "Innova Crysta",
    price: 12800,
    fit: "Four people, four full bags, captain seats.",
    driver: "Biplab Sangma · hill routes",
  },
  {
    id: "urbania",
    name: "Urbania van",
    price: 16800,
    fit: "Extra standing room if the group adds a fifth.",
    driver: "Shared hill desk · larger boot",
  },
];

export const DISRUPTION = {
  title: "Outbound flight delayed 2.5 hours",
  detail: "Air-traffic hold at departure. Landing moves to 17:10. The 15:45 airport pickup is missed, Umiam sunset drops off the first evening, and hotel check-in slides to 20:00.",
  who: "Rohan Varma",
};

export const REPLANS: ReplanOption[] = [
  {
    id: "minimal",
    title: "Shift the evening",
    tag: "Keep every stop",
    time: "+2 hours",
    cost: 0,
    detail: "Move the airport pickup to 18:15, check in at 20:00, and park the lake sunset on the last morning.",
  },
  {
    id: "optimised",
    title: "Fast-track join",
    tag: "Suggested",
    time: "Saves 45 min",
    cost: 400,
    detail: "Send a direct sedan to the cafe so Rohan still makes dinner. Hotel check-in is already authorised.",
  },
  {
    id: "cheaper",
    title: "Shared shuttle",
    tag: "Lower cost",
    time: "+3.5 hours",
    cost: -300,
    detail: "Put Rohan on the scheduled shuttle and drop the private pickup. He meets the group at the hotel.",
  },
];

export const STAGES: { id: StageId; label: string; hint: string }[] = [
  { id: "seasons", label: "Season", hint: "Agree the window" },
  { id: "dates", label: "Dates", hint: "Overlap the calendars" },
  { id: "route", label: "Route", hint: "Order the days" },
  { id: "activities", label: "Days", hint: "Pick stops" },
  { id: "food", label: "Food", hint: "Slot meals" },
  { id: "vault", label: "Vault", hint: "Fund the pool" },
  { id: "transit", label: "Transit", hint: "How you get there" },
  { id: "stays", label: "Stays", hint: "Two bases" },
  { id: "fleet", label: "On the ground", hint: "Car and passes" },
  { id: "locker", label: "Locker", hint: "Tickets in one place" },
  { id: "radar", label: "Radar", hint: "If plans slip" },
];

export function inr(value: number) {
  const sign = value < 0 ? "−" : "";
  return (
    sign +
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Math.abs(value))
  );
}

export function memberById(id: string) {
  return MEMBERS.find((member) => member.id === id);
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
}
