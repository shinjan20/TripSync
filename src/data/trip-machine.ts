import {
  ACTIVITIES,
  CAR_FARE,
  DISRUPTION,
  INITIAL_DATES,
  INITIAL_DAYS,
  INITIAL_FLAVOURS,
  INITIAL_PICKS,
  INITIAL_VOTES,
  MEMBERS,
  ORIGINS,
  SEASONS,
  STAGES,
  TRAIN_FARE,
  TRIP,
  YOU,
  type MacroDay,
  type StageId,
} from "./demo-trip";

export interface ChatMessage {
  id: string;
  from: "group" | "myra" | "you";
  author: string;
  text: string;
}

export interface TripState {
  screen: "home" | "plan";
  panel: "plan" | "chat";
  stage: StageId;
  votes: Record<string, string[]>;
  seasonConfirmed: boolean;
  dates: Record<string, string[]>;
  datesApproved: boolean;
  days: MacroDay[];
  routeApproved: boolean;
  picks: Record<string, string[]>;
  activeHub: string;
  activityCeiling: number;
  activitiesConfirmed: boolean;
  alert: string | null;
  flavours: string[];
  foodConfirmed: boolean;
  authorized: Record<string, boolean>;
  origin: string;
  transit: "flight" | "train" | "car";
  transitStatus: "open" | "booked" | "skipped";
  transitRef: string | null;
  hotels: Record<string, string>;
  hotelStay: string;
  hotelStatus: Record<string, "open" | "booked" | "skipped">;
  cab: string;
  cabStatus: "open" | "booked" | "skipped";
  cabRef: string | null;
  replan: string | null;
  cancelSimulated: boolean;
  messages: ChatMessage[];
  seq: number;
}

export type TripAction =
  | { type: "open" }
  | { type: "home" }
  | { type: "panel"; panel: "plan" | "chat" }
  | { type: "stage"; id: StageId }
  | { type: "vote"; windowId: string }
  | { type: "confirm-season" }
  | { type: "toggle-date"; date: string }
  | { type: "approve-dates" }
  | { type: "move-day"; index: number; dir: -1 | 1 }
  | { type: "approve-route" }
  | { type: "set-hub"; id: string }
  | { type: "toggle-activity"; id: string }
  | { type: "authorize-all" }
  | { type: "raise-ceiling" }
  | { type: "dismiss-alert" }
  | { type: "confirm-activities" }
  | { type: "toggle-flavour"; id: string }
  | { type: "confirm-food" }
  | { type: "authorize"; memberId: string }
  | { type: "nudge" }
  | { type: "origin"; code: string }
  | { type: "transit"; id: "flight" | "train" | "car" }
  | { type: "book-transit" }
  | { type: "skip-transit" }
  | { type: "hotel-stay"; id: string }
  | { type: "hotel"; id: string }
  | { type: "book-hotel" }
  | { type: "skip-hotel" }
  | { type: "cab"; id: string }
  | { type: "book-cab" }
  | { type: "skip-cab" }
  | { type: "replan"; id: string }
  | { type: "cancel-sim" }
  | { type: "send"; text: string };

const STAGE_ORDER: StageId[] = [
  "seasons",
  "dates",
  "route",
  "activities",
  "food",
  "vault",
  "transit",
  "stays",
  "fleet",
  "locker",
  "radar",
];

export function stageIndex(id: StageId) {
  return STAGE_ORDER.indexOf(id);
}

export function activitySpend(picks: Record<number, string[]>) {
  return Object.values(picks)
    .flat()
    .reduce((sum, id) => sum + (ACTIVITIES.find((item) => item.id === id)?.cost ?? 0), 0);
}

export function fareFor(origin: string, transit: TripState["transit"]) {
  if (transit === "train") return TRAIN_FARE;
  if (transit === "car") return CAR_FARE;
  return ORIGINS.find((item) => item.code === origin)?.flight ?? 0;
}

export function unlockedThrough(state: TripState) {
  const requirements = [
    true,
    state.seasonConfirmed,
    state.datesApproved,
    state.routeApproved,
    state.activitiesConfirmed,
    state.foodConfirmed,
    MEMBERS.every((member) => state.authorized[member.id]),
    state.transitStatus !== "open",
    Object.values(state.hotelStatus).every((status) => status !== "open"),
    state.cabStatus !== "open",
    state.cabStatus !== "open",
  ];
  let max = 0;
  for (let index = 0; index < requirements.length; index += 1) {
    if (!requirements[index]) break;
    max = index;
  }
  return max;
}

export function canOpen(state: TripState, id: StageId) {
  return stageIndex(id) <= unlockedThrough(state);
}

function say(state: TripState, text: string, author = "Myra"): TripState {
  return {
    ...state,
    seq: state.seq + 1,
    messages: [
      ...state.messages,
      { id: `m-${state.seq + 1}`, from: author === "You" ? "you" : "myra", author, text },
    ],
  };
}

function leadWindow(votes: Record<string, string[]>) {
  return [...SEASONS].sort(
    (a, b) => (votes[b.id]?.length ?? 0) - (votes[a.id]?.length ?? 0),
  )[0];
}

function replyTo(state: TripState, raw: string): TripState {
  const text = raw.trim();
  const withYou: TripState = {
    ...state,
    seq: state.seq + 1,
    messages: [
      ...state.messages,
      { id: `m-${state.seq + 1}`, from: "you", author: "You", text },
    ],
  };
  const lower = text.toLowerCase();

  const swap = lower.match(/swap\s+day\s+(\d)\s+(?:and|with)\s+day\s+(\d)/);
  if (swap) {
    const a = Number(swap[1]) - 1;
    const b = Number(swap[2]) - 1;
    if (
      a < 0 ||
      b < 0 ||
      a >= withYou.days.length ||
      b >= withYou.days.length ||
      a === b
    ) {
      return say(withYou, "I can swap days 1 to 4. Try “swap day 2 and day 3”.");
    }
    const swapped = withYou.days.slice();
    [swapped[a], swapped[b]] = [swapped[b], swapped[a]];
    return say(
      { ...withYou, days: swapped, routeApproved: false },
      `Swapped day ${swap[1]} and day ${swap[2]}. Drive legs and overnight bases moved with them. Confirm the route again before activities lock.`,
    );
  }

  const add = lower.match(/add\s+(.+?)(?:\s+on\s+day\s+(\d)|\s+for\s+day\s+(\d))?$/);
  if (add && (lower.includes("zipline") || lower.includes("kayak") || lower.includes("cave") || lower.includes("boat") || lower.includes("museum") || lower.includes("lake") || lower.includes("add "))) {
    const position = Number(add[2] || add[3] || 0);
    const hub = position
      ? withYou.days[position - 1]?.id
      : withYou.activeHub;
    const query = add[1].replace(/\b(the|on|for|day)\b/g, " ").replace(/\s+/g, " ").trim();
    const pool = ACTIVITIES.filter((item) => (hub ? item.hub === hub : true));
    const match = pool.find(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        query.split(" ").some((word) => word.length > 3 && item.title.toLowerCase().includes(word)),
    );
    if (!match || !hub) {
      return say(
        withYou,
        `I couldn't match “${query}” on that day. Open Days and pick from the list.`,
      );
    }
    const current = new Set(withYou.picks[match.hub] ?? []);
    current.add(match.id);
    const picks = { ...withYou.picks, [match.hub]: [...current] };
    const spend = activitySpend(picks);
    const over = spend > withYou.activityCeiling;
    const dayLabel = withYou.days.findIndex((day) => day.id === match.hub) + 1;
    return say(
      {
        ...withYou,
        picks,
        activeHub: match.hub,
        stage: canOpen(withYou, "activities") ? "activities" : withYou.stage,
        activitiesConfirmed: false,
        alert: over
          ? `Stops now total ₹${spend.toLocaleString("en-IN")}, above the ₹${withYou.activityCeiling.toLocaleString("en-IN")} ceiling.`
          : null,
      },
      over
        ? `Added ${match.title} on day ${dayLabel}. That pushes activities over the ceiling. Raise it or drop a stop.`
        : `Added ${match.title} on day ${dayLabel}. The stops moved with that day if you reorder the route.`,
    );
  }

  if (lower.includes("blocking") || lower.includes("next") || lower.includes("status")) {
    const openId = STAGE_ORDER[unlockedThrough(withYou)];
    const openLabel = STAGES.find((stage) => stage.id === openId)?.label ?? openId;
    return say(
      withYou,
      `The open step is ${openLabel}. Finish it to unlock the next one. Season votes currently lead with ${leadWindow(withYou.votes).title}.`,
    );
  }

  if (lower.includes("delay") || lower.includes("radar") || lower.includes("replan")) {
    return say(
      withYou,
      canOpen(withYou, "radar")
        ? `${DISRUPTION.title}. Three repairs are on the radar: shift the evening, fast-track a join, or take the shared shuttle.`
        : "The radar opens once the ground booking is confirmed or skipped. Until then I only watch the plan, I don't rewrite tickets.",
    );
  }

  return say(
    withYou,
    "I can swap days, add a listed stop, or tell you what is blocking the next step. Try “swap day 2 and day 3” or “add zipline on day 2”.",
  );
}

export function initialState(): TripState {
  return {
    screen: "home",
    panel: "plan",
    stage: "seasons",
    votes: INITIAL_VOTES,
    seasonConfirmed: false,
    dates: INITIAL_DATES,
    datesApproved: false,
    days: INITIAL_DAYS,
    routeApproved: false,
    picks: INITIAL_PICKS,
    activeHub: "sohra",
    activityCeiling: TRIP.activityCeiling,
    activitiesConfirmed: false,
    alert: null,
    flavours: INITIAL_FLAVOURS,
    foodConfirmed: false,
    authorized: { kabir: false, priya: false, rohan: false, tanya: false },
    origin: "DEL",
    transit: "flight",
    transitStatus: "open",
    transitRef: null,
    hotels: { shillong: "rikynjai", sohra: "polo" },
    hotelStay: "shillong",
    hotelStatus: { shillong: "open", sohra: "open" },
    cab: "innova",
    cabStatus: "open",
    cabRef: null,
    replan: null,
    cancelSimulated: false,
    seq: 4,
    messages: [
      {
        id: "m-1",
        from: "group",
        author: "Kabir Roy",
        text: "Workspace is open for Meghalaya. First decision is when we go, not what we book.",
      },
      {
        id: "m-2",
        from: "group",
        author: "Priya Menon",
        text: "Mid-October. The falls should be full, and I need every meal to have a vegetarian option.",
      },
      {
        id: "m-3",
        from: "group",
        author: "Rohan Varma",
        text: "October works if we are not in the air before noon. I have a call until 11:30.",
      },
      {
        id: "m-4",
        from: "myra",
        author: "Myra",
        text: "Three windows are on the board. October leads 3–1. I will not lock dates until you confirm the season.",
      },
    ],
  };
}

export function reduceTrip(state: TripState, action: TripAction): TripState {
  switch (action.type) {
    case "open":
      return { ...state, screen: "plan" };
    case "home":
      return { ...state, screen: "home" };
    case "panel":
      return { ...state, panel: action.panel };
    case "stage":
      return canOpen(state, action.id) ? { ...state, stage: action.id, panel: "plan" } : state;
    case "vote": {
      const current = new Set(state.votes[action.windowId] ?? []);
      if (current.has(YOU)) current.delete(YOU);
      else current.add(YOU);
      const votes = { ...state.votes };
      for (const season of SEASONS) {
        votes[season.id] = (votes[season.id] ?? []).filter((id) => id !== YOU);
      }
      votes[action.windowId] = [...current];
      return { ...state, votes, seasonConfirmed: false };
    }
    case "confirm-season": {
      const lead = leadWindow(state.votes);
      if ((state.votes[lead.id] ?? []).length < 3) return state;
      return say(
        { ...state, seasonConfirmed: true, stage: "dates" },
        `Locked ${lead.title}. Next, mark the days everyone can actually travel.`,
      );
    }
    case "toggle-date": {
      const mine = new Set(state.dates[YOU] ?? []);
      if (mine.has(action.date)) mine.delete(action.date);
      else mine.add(action.date);
      return {
        ...state,
        dates: { ...state.dates, [YOU]: [...mine].sort() },
        datesApproved: false,
      };
    }
    case "approve-dates":
      return say(
        { ...state, datesApproved: true, stage: "route" },
        "Dates held for 16–20 Oct. The route is a suggestion until you confirm the day order.",
      );
    case "move-day": {
      const next = action.index + action.dir;
      if (next < 0 || next >= state.days.length) return state;
      const days = state.days.slice();
      [days[action.index], days[next]] = [days[next], days[action.index]];
      return { ...state, days, routeApproved: false };
    }
    case "approve-route":
      return say(
        { ...state, routeApproved: true, stage: "activities" },
        "Day order saved. Pick stops per day. I will flag anything over the activity ceiling.",
      );
    case "set-hub":
      return { ...state, activeHub: action.id };
    case "toggle-activity": {
      const activity = ACTIVITIES.find((item) => item.id === action.id);
      if (!activity) return state;
      const selected = new Set(state.picks[activity.hub] ?? []);
      if (selected.has(action.id)) selected.delete(action.id);
      else selected.add(action.id);
      const picks = { ...state.picks, [activity.hub]: [...selected] };
      const spend = activitySpend(picks);
      return {
        ...state,
        picks,
        activeHub: activity.hub,
        activitiesConfirmed: false,
        alert:
          spend > state.activityCeiling
            ? `Selected stops total ₹${spend.toLocaleString("en-IN")}, above the ₹${state.activityCeiling.toLocaleString("en-IN")} ceiling.`
            : null,
      };
    }
    case "raise-ceiling":
      return say(
        { ...state, activityCeiling: 8000, alert: null },
        "Activity ceiling raised to ₹8,000 per person. The group pool still has to cover it.",
      );
    case "dismiss-alert":
      return { ...state, alert: null };
    case "confirm-activities": {
      const missing = state.days.filter((day) => (state.picks[day.id] ?? []).length === 0);
      if (missing.length || activitySpend(state.picks) > state.activityCeiling) return state;
      return say(
        { ...state, activitiesConfirmed: true, stage: "food" },
        "Stops are in. Slot meals next so Priya is not left without a vegetarian option.",
      );
    }
    case "toggle-flavour": {
      const flavours = state.flavours.includes(action.id)
        ? state.flavours.filter((id) => id !== action.id)
        : [...state.flavours, action.id];
      return { ...state, flavours, foodConfirmed: false };
    }
    case "confirm-food":
      if (!state.flavours.includes("thali")) return state;
      return say(
        { ...state, foodConfirmed: true, stage: "vault" },
        "Meals slotted, with a vegetarian thali on the waterfall day. The shared vault is the next gate.",
      );
    case "authorize": {
      const authorized = { ...state.authorized, [action.memberId]: true };
      const all = MEMBERS.every((member) => authorized[member.id]);
      const next = { ...state, authorized, stage: all ? "transit" : state.stage };
      return all
        ? say(next, "Every vault is authorised. Transit is open: flight, train, or car. Skipping is allowed.")
        : next;
    }
    case "authorize-all": {
      const authorized = Object.fromEntries(MEMBERS.map((member) => [member.id, true]));
      return say(
        { ...state, authorized, stage: "transit" },
        "Group pool authorised for flights, stays, and activities. It expires with the trip, and it does not cover anything you skip.",
      );
    }
    case "nudge":
      return say(
        state,
        "Nudged Priya and Rohan. Their vaults are ₹7,000 short of the ₹25,000 target. Booking stays locked until every member authorises the pool.",
      );
    case "origin":
      return state.transitStatus === "open" ? { ...state, origin: action.code } : state;
    case "transit":
      return state.transitStatus === "open" ? { ...state, transit: action.id } : state;
    case "book-transit":
      if (!canOpen(state, "transit") || state.transitStatus !== "open") return state;
      return say(
        {
          ...state,
          transitStatus: "booked",
          transitRef: `TS-T${state.seq}`,
          stage: "stays",
        },
        `Transit held. Reference TS-T${state.seq}. Choose the two stay bases next, or skip either of them.`,
      );
    case "skip-transit":
      if (state.transitStatus !== "open") return state;
      return say(
        { ...state, transitStatus: "skipped", transitRef: null, stage: "stays" },
        "Transit skipped. The locker will show this leg as bring-your-own.",
      );
    case "hotel-stay":
      return { ...state, hotelStay: action.id };
    case "hotel":
      if (state.hotelStatus[state.hotelStay] !== "open") return state;
      return { ...state, hotels: { ...state.hotels, [state.hotelStay]: action.id } };
    case "book-hotel": {
      const id = state.hotelStay;
      if (state.hotelStatus[id] !== "open") return state;
      const hotelStatus = { ...state.hotelStatus, [id]: "booked" as const };
      const bothDone = Object.values(hotelStatus).every((status) => status !== "open");
      return say(
        { ...state, hotelStatus, stage: bothDone ? "fleet" : state.stage },
        bothDone
          ? "Both stays are decided. Book the hill car, or skip it."
          : "First base is held. Do the same for the second stop, or skip it.",
      );
    }
    case "skip-hotel": {
      const id = state.hotelStay;
      if (state.hotelStatus[id] !== "open") return state;
      const hotelStatus = { ...state.hotelStatus, [id]: "skipped" as const };
      const bothDone = Object.values(hotelStatus).every((status) => status !== "open");
      return say(
        { ...state, hotelStatus, stage: bothDone ? "fleet" : state.stage },
        bothDone
          ? "Stays are marked. Nothing was charged for a skipped base."
          : "That base was skipped. The other stop is still open.",
      );
    }
    case "cab":
      return state.cabStatus === "open" ? { ...state, cab: action.id } : state;
    case "book-cab":
      if (state.cabStatus !== "open") return state;
      return say(
        {
          ...state,
          cabStatus: "booked",
          cabRef: `TS-C${state.seq}`,
          stage: "locker",
        },
        `Car confirmed. Reference TS-C${state.seq}. Boarding passes, stay notes, and the ledger are in the locker.`,
      );
    case "skip-cab":
      if (state.cabStatus !== "open") return state;
      return say(
        { ...state, cabStatus: "skipped", stage: "locker" },
        "Ground transport skipped. The locker is open with whatever you did book.",
      );
    case "replan":
      return say(
        { ...state, replan: action.id },
        action.id === "optimised"
          ? "Fast-track join applied. Pickup retimed, dinner kept, ₹400 express ride added to the pool."
          : action.id === "cheaper"
            ? "Shared shuttle applied. Private pickup cancelled and ₹300 returned to the pool."
            : "Evening shift applied. Every stop stays on the trip, just later on day 1.",
      );
    case "cancel-sim":
      if (state.cancelSimulated) return state;
      return say(
        { ...state, cancelSimulated: true },
        "Cancellation drill for Rohan: ₹3,650 in penalties, ₹16,200 returned to his vault. No live charge was made.",
      );
    case "send":
      return replyTo(state, action.text);
    default:
      return state;
  }
}
