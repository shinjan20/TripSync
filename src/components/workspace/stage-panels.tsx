"use client";

import {
  ACTIVITIES,
  CABS,
  DISRUPTION,
  FLAVOURS,
  MEMBERS,
  MONTH,
  ORIGINS,
  REPLANS,
  SEASONS,
  STAYS,
  TRANSIT,
  TRIP,
  YOU,
  inr,
} from "@/data/demo-trip";
import { activitySpend, fareFor } from "@/data/trip-machine";
import { useTrip } from "./trip-context";
import { Avatar, FacePile, GhostButton, Panel, PrimaryButton } from "./ui";

function leadVotes(votes: Record<string, string[]>) {
  return Math.max(...SEASONS.map((season) => votes[season.id]?.length ?? 0));
}

export function SeasonPanel() {
  const { state, dispatch } = useTrip();
  const lead = leadVotes(state.votes);
  const ready = lead >= 3;

  return (
    <Panel
      kicker="01 · Season"
      title="Pick the window before the wishlist"
      lede="Weather, crowds, and fares are scored together. A window locks only when at least three people are on it."
      action={
        <PrimaryButton
          disabled={!ready}
          onClick={() => dispatch({ type: "confirm-season" })}
        >
          {state.seasonConfirmed ? "Season locked" : "Confirm season"}
        </PrimaryButton>
      }
    >
      <div className="grid gap-3">
        {SEASONS.map((season) => {
          const voters = state.votes[season.id] ?? [];
          const mine = voters.includes(YOU);
          return (
            <article
              key={season.id}
              className={`rounded-2xl border bg-white p-4 ${
                season.recommended ? "border-[#0c6b62]" : "border-stone-200"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold">{season.title}</h3>
                    {season.recommended ? (
                      <span className="rounded-full bg-[#e7f4f2] px-2 py-0.5 text-[11px] font-semibold text-[#0c6b62]">
                        Best fit
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-stone-500">
                    {season.range} · {season.weather} · {season.crowd}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-semibold tracking-tight">{season.score}</p>
                  <p className="text-[11px] tracking-wide text-stone-400 uppercase">Fit score</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-stone-700">{season.cost}</p>
              <ul className="mt-3 grid gap-1 text-sm text-stone-600 sm:grid-cols-2">
                {season.pros.map((item) => (
                  <li key={item}>+ {item}</li>
                ))}
                {season.cons.map((item) => (
                  <li key={item} className="text-stone-500">
                    − {item}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <FacePile ids={voters} />
                <button
                  type="button"
                  onClick={() => dispatch({ type: "vote", windowId: season.id })}
                  className={`h-9 rounded-full px-4 text-sm font-semibold ${
                    mine ? "bg-[#0c6b62] text-white" : "bg-stone-100 text-stone-800"
                  }`}
                >
                  {mine ? "Your vote" : "Vote as Kabir"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </Panel>
  );
}

function dateKey(day: number) {
  return `2026-10-${String(day).padStart(2, "0")}`;
}

export function DatesPanel() {
  const { state, dispatch } = useTrip();
  const first = new Date(MONTH.year, MONTH.month, 1).getDay();
  const cells = [...Array(first).fill(null), ...Array.from({ length: 31 }, (_, index) => index + 1)];
  const core = [16, 17, 18, 19, 20].map(dateKey);
  const coreReady = core.every(
    (date) => MEMBERS.filter((member) => state.dates[member.id]?.includes(date)).length >= 3,
  );

  return (
    <Panel
      kicker="02 · Dates"
      title="October, with everyone's constraints"
      lede="Tap a day to change your availability. The suggested block is 16–20 Oct: full overlap, and a flight after Rohan's call."
      action={
        <PrimaryButton disabled={!coreReady} onClick={() => dispatch({ type: "approve-dates" })}>
          {state.datesApproved ? "Dates held" : "Hold these dates"}
        </PrimaryButton>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
        <div className="rounded-2xl border border-stone-200 bg-white p-4">
          <p className="mb-3 text-sm font-semibold">{MONTH.label}</p>
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold tracking-wide text-stone-400 uppercase">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-7 gap-1">
            {cells.map((day, index) => {
              if (!day) return <span key={`pad-${index}`} />;
              const key = dateKey(day);
              const available = MEMBERS.filter((member) => state.dates[member.id]?.includes(key));
              const mine = state.dates[YOU]?.includes(key);
              const hot = available.length === 4;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => dispatch({ type: "toggle-date", date: key })}
                  className={`flex h-14 flex-col items-center justify-center rounded-xl text-sm ${
                    hot ? "bg-[#e7f4f2] text-[#084841]" : "bg-stone-50 text-stone-700"
                  } ${mine ? "ring-2 ring-[#0c6b62]" : ""}`}
                >
                  <span className="font-semibold">{day}</span>
                  <span className="text-[10px] text-stone-500">{available.length}/4</span>
                </button>
              );
            })}
          </div>
        </div>
        <aside className="rounded-2xl border border-stone-200 bg-white p-4 text-sm">
          <p className="font-semibold">Why this block</p>
          <ul className="mt-3 space-y-2 text-stone-600">
            <li>All four people are free 16–20 Oct.</li>
            <li>Noon departure clears the 11:30 client call.</li>
            <li>Fares sit in the lower band for this route.</li>
          </ul>
          <p className="mt-4 text-xs leading-5 text-stone-500">
            A ring means you marked that day. Full colour means the whole group can travel.
          </p>
        </aside>
      </div>
    </Panel>
  );
}

export function RoutePanel() {
  const { state, dispatch } = useTrip();
  return (
    <Panel
      kicker="03 · Route"
      title="Four days, no backtracking"
      lede="This order keeps the lake, the waterfalls, the border, then the drive out. Move a day if the group wants a different rhythm."
      action={
        <PrimaryButton onClick={() => dispatch({ type: "approve-route" })}>
          {state.routeApproved ? "Route saved" : "Save day order"}
        </PrimaryButton>
      }
    >
      <ol className="grid gap-3">
        {state.days.map((day, index) => (
          <li key={day.id} className="flex gap-3 rounded-2xl border border-stone-200 bg-white p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#14221f] text-sm font-semibold text-white">
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold">{day.title}</h3>
                <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-600">
                  {day.tag}
                </span>
              </div>
              <p className="mt-1 text-sm text-stone-600">{day.summary}</p>
              <p className="mt-2 text-xs text-stone-500">
                {day.region} · {day.distanceKm} km · Stay: {day.stay}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <button
                type="button"
                aria-label={`Move day ${index + 1} earlier`}
                disabled={index === 0}
                onClick={() => dispatch({ type: "move-day", index, dir: -1 })}
                className="h-8 w-8 rounded-full border border-stone-200 text-sm disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                aria-label={`Move day ${index + 1} later`}
                disabled={index === state.days.length - 1}
                onClick={() => dispatch({ type: "move-day", index, dir: 1 })}
                className="h-8 w-8 rounded-full border border-stone-200 text-sm disabled:opacity-30"
              >
                ↓
              </button>
            </div>
          </li>
        ))}
      </ol>
    </Panel>
  );
}

export function ActivitiesPanel() {
  const { state, dispatch } = useTrip();
  const spend = activitySpend(state.picks);
  const over = spend > state.activityCeiling;
  const hub = state.days.find((day) => day.id === state.activeHub) ?? state.days[0];
  const options = ACTIVITIES.filter((item) => item.hub === hub.id);
  const everyDay = state.days.every((day) => (state.picks[day.id] ?? []).length > 0);

  return (
    <Panel
      kicker="04 · Days"
      title="Choose stops inside the ceiling"
      lede={`Activities are capped at ${inr(state.activityCeiling)} per person so one optional thrill does not blow the pool.`}
      action={
        <PrimaryButton
          disabled={!everyDay || over}
          onClick={() => dispatch({ type: "confirm-activities" })}
        >
          {state.activitiesConfirmed ? "Stops confirmed" : "Confirm stops"}
        </PrimaryButton>
      }
    >
      <div className="flex flex-wrap gap-2">
        {state.days.map((day, index) => (
          <button
            key={day.id}
            type="button"
            onClick={() => dispatch({ type: "set-hub", id: day.id })}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
              day.id === hub.id ? "bg-[#14221f] text-white" : "bg-white text-stone-700 ring-1 ring-stone-200"
            }`}
          >
            Day {index + 1}
          </button>
        ))}
      </div>
      <div className="rounded-2xl border border-stone-200 bg-white p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">{hub.region}</span>
          <span className={over ? "font-semibold text-amber-700" : "text-stone-500"}>
            {inr(spend)} / {inr(state.activityCeiling)}
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-stone-100">
          <div
            className={`h-full rounded-full ${over ? "bg-amber-500" : "bg-[#0c6b62]"}`}
            style={{ width: `${Math.min(100, (spend / state.activityCeiling) * 100)}%` }}
          />
        </div>
        {state.alert ? (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900">
            <p>{state.alert}</p>
            <button
              type="button"
              className="font-semibold underline"
              onClick={() => dispatch({ type: "raise-ceiling" })}
            >
              Raise to {inr(8000)}
            </button>
          </div>
        ) : null}
        <ul className="mt-4 grid gap-2">
          {options.map((item) => {
            const on = (state.picks[hub.id] ?? []).includes(item.id);
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => dispatch({ type: "toggle-activity", id: item.id })}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-3 text-left ${
                    on ? "border-[#0c6b62] bg-[#f3faf8]" : "border-stone-200"
                  }`}
                >
                  <span>
                    <span className="block text-sm font-semibold">{item.title}</span>
                    <span className="text-xs text-stone-500">
                      {item.kind} · {item.duration}
                      {item.vegSafe ? " · Vegetarian-safe" : ""}
                    </span>
                  </span>
                  <span className="text-sm font-semibold">{item.cost === 0 ? "Included" : inr(item.cost)}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </Panel>
  );
}

export function FoodPanel() {
  const { state, dispatch } = useTrip();
  const hasVeg = state.flavours.includes("thali");
  return (
    <Panel
      kicker="05 · Food"
      title="Meals that the whole group can eat"
      lede="Priya is vegetarian. A waterfall-day thali stays on the plan unless you replace it with another safe meal."
      action={
        <PrimaryButton disabled={!hasVeg} onClick={() => dispatch({ type: "confirm-food" })}>
          {state.foodConfirmed ? "Meals saved" : "Save meals"}
        </PrimaryButton>
      }
    >
      <ul className="grid gap-3 sm:grid-cols-2">
        {FLAVOURS.map((item) => {
          const on = state.flavours.includes(item.id);
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => dispatch({ type: "toggle-flavour", id: item.id })}
                className={`h-full w-full rounded-2xl border p-4 text-left ${
                  on ? "border-[#0c6b62] bg-white" : "border-stone-200 bg-white/70"
                }`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="font-semibold">{item.title}</span>
                  <span className="text-[11px] font-semibold tracking-wide text-stone-400 uppercase">
                    {on ? "On plan" : "Off"}
                  </span>
                </span>
                <span className="mt-1 block text-xs text-stone-500">{item.place}</span>
                <span className="mt-2 block text-sm leading-5 text-stone-600">{item.note}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

export function VaultPanel() {
  const { state, dispatch } = useTrip();
  const funded = MEMBERS.reduce((sum, member) => sum + member.deposit, 0);
  const target = MEMBERS.reduce((sum, member) => sum + member.target, 0);
  const all = MEMBERS.every((member) => state.authorized[member.id]);

  return (
    <Panel
      kicker="06 · Shared vault"
      title="One pool, scoped to this trip"
      lede="Each person aims for ₹25,000. Authorising lets the copilot pay for flights, stays, and activities without asking again. Skipped legs are never charged."
      action={
        <PrimaryButton disabled={all} onClick={() => dispatch({ type: "authorize-all" })}>
          {all ? "Pool authorised" : "Authorise the pool"}
        </PrimaryButton>
      }
    >
      <div className="rounded-2xl bg-[#14221f] p-4 text-white">
        <p className="text-xs tracking-[0.14em] text-white/60 uppercase">Available now</p>
        <p className="mt-1 text-3xl font-semibold tracking-tight">{inr(funded)}</p>
        <p className="mt-1 text-sm text-white/70">of {inr(target)} once everyone tops up</p>
        <button
          type="button"
          onClick={() => dispatch({ type: "nudge" })}
          className="mt-4 text-sm font-semibold text-[#9ddecf] underline"
        >
          Nudge the shortfalls
        </button>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {MEMBERS.map((member) => {
          const on = state.authorized[member.id];
          const short = member.target - member.deposit;
          return (
            <li key={member.id} className="rounded-2xl border border-stone-200 bg-white p-4">
              <div className="flex items-center gap-3">
                <Avatar name={member.name} />
                <div>
                  <p className="font-semibold">{member.name}</p>
                  <p className="text-xs text-stone-500">{member.role}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-stone-600">
                {inr(member.deposit)} in · {short > 0 ? `${inr(short)} still to add` : "Target met"}
              </p>
              <button
                type="button"
                disabled={on}
                onClick={() => dispatch({ type: "authorize", memberId: member.id })}
                className="mt-3 text-sm font-semibold text-[#0c6b62] disabled:text-stone-400"
              >
                {on ? "Authorised" : "Authorise this vault"}
              </button>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

export function TransitPanel() {
  const { state, dispatch } = useTrip();
  const fare = fareFor(state.origin, state.transit);
  const locked = state.transitStatus !== "open";

  return (
    <Panel
      kicker="07 · Transit"
      title="Flight, train, or road"
      lede="The group can leave from different cities. The fare below is per person from the city you pick. Skip this if tickets already exist."
      action={
        <div className="flex gap-2">
          <GhostButton disabled={locked} onClick={() => dispatch({ type: "skip-transit" })}>
            Skip
          </GhostButton>
          <PrimaryButton disabled={locked} onClick={() => dispatch({ type: "book-transit" })}>
            {state.transitStatus === "booked"
              ? state.transitRef
              : state.transitStatus === "skipped"
                ? "Skipped"
                : "Hold transit"}
          </PrimaryButton>
        </div>
      }
    >
      <div className="flex flex-wrap gap-2">
        {ORIGINS.map((origin) => (
          <button
            key={origin.code}
            type="button"
            disabled={locked}
            onClick={() => dispatch({ type: "origin", code: origin.code })}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
              state.origin === origin.code
                ? "bg-[#14221f] text-white"
                : "bg-white text-stone-700 ring-1 ring-stone-200"
            }`}
          >
            {origin.city}
          </button>
        ))}
      </div>
      <div className="grid gap-3">
        {TRANSIT.map((mode) => {
          const price = fareFor(state.origin, mode.id);
          const on = state.transit === mode.id;
          return (
            <button
              key={mode.id}
              type="button"
              disabled={locked}
              onClick={() => dispatch({ type: "transit", id: mode.id })}
              className={`rounded-2xl border p-4 text-left ${
                on ? "border-[#0c6b62] bg-white" : "border-stone-200 bg-white"
              }`}
            >
              <span className="flex items-start justify-between gap-3">
                <span>
                  <span className="block font-semibold">{mode.title}</span>
                  <span className="text-sm text-stone-500">{mode.duration}</span>
                </span>
                <span className="font-semibold">{inr(price)}</span>
              </span>
              <span className="mt-2 block text-sm text-stone-600">{mode.summary}</span>
            </button>
          );
        })}
      </div>
      <p className="text-sm text-stone-500">Selected fare {inr(fare)} per person. Group of four: {inr(fare * 4)}.</p>
    </Panel>
  );
}

export function StaysPanel() {
  const { state, dispatch } = useTrip();
  const stay = STAYS.find((item) => item.id === state.hotelStay) ?? STAYS[0];
  const status = state.hotelStatus[stay.id];

  return (
    <Panel
      kicker="08 · Stays"
      title="Two bases, decided one at a time"
      lede="Shillong covers the lake nights. Cherrapunji covers the waterfall night. Book or skip each base on its own."
      action={
        <div className="flex gap-2">
          <GhostButton disabled={status !== "open"} onClick={() => dispatch({ type: "skip-hotel" })}>
            Skip this base
          </GhostButton>
          <PrimaryButton disabled={status !== "open"} onClick={() => dispatch({ type: "book-hotel" })}>
            {status === "booked" ? "Booked" : status === "skipped" ? "Skipped" : "Hold this stay"}
          </PrimaryButton>
        </div>
      }
    >
      <div className="flex gap-2">
        {STAYS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => dispatch({ type: "hotel-stay", id: item.id })}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
              item.id === stay.id ? "bg-[#14221f] text-white" : "bg-white ring-1 ring-stone-200"
            }`}
          >
            {item.place}
            <span className="ml-2 text-[11px] opacity-70">
              {state.hotelStatus[item.id] === "open" ? item.nights : state.hotelStatus[item.id]}
            </span>
          </button>
        ))}
      </div>
      <div className="grid gap-3">
        {stay.options.map((hotel) => {
          const on = state.hotels[stay.id] === hotel.id;
          return (
            <button
              key={hotel.id}
              type="button"
              disabled={status !== "open"}
              onClick={() => dispatch({ type: "hotel", id: hotel.id })}
              className={`rounded-2xl border p-4 text-left ${on ? "border-[#0c6b62] bg-white" : "border-stone-200 bg-white"}`}
            >
              <span className="flex justify-between gap-3">
                <span className="font-semibold">{hotel.name}</span>
                <span className="font-semibold">{inr(hotel.pricePerNight)} / night</span>
              </span>
              <span className="mt-1 block text-sm text-stone-500">{hotel.area}</span>
              <span className="mt-2 block text-sm text-stone-600">{hotel.note}</span>
            </button>
          );
        })}
      </div>
    </Panel>
  );
}

export function FleetPanel() {
  const { state, dispatch } = useTrip();
  const locked = state.cabStatus !== "open";
  return (
    <Panel
      kicker="09 · On the ground"
      title="A car that fits four people and the bags"
      lede="The hill car stays with the group for the whole loop. Skip it if someone is arranging a local driver."
      action={
        <div className="flex gap-2">
          <GhostButton disabled={locked} onClick={() => dispatch({ type: "skip-cab" })}>
            Skip
          </GhostButton>
          <PrimaryButton disabled={locked} onClick={() => dispatch({ type: "book-cab" })}>
            {state.cabStatus === "booked" ? state.cabRef : state.cabStatus === "skipped" ? "Skipped" : "Hold the car"}
          </PrimaryButton>
        </div>
      }
    >
      <div className="grid gap-3">
        {CABS.map((cab) => (
          <button
            key={cab.id}
            type="button"
            disabled={locked}
            onClick={() => dispatch({ type: "cab", id: cab.id })}
            className={`rounded-2xl border p-4 text-left ${
              state.cab === cab.id ? "border-[#0c6b62] bg-white" : "border-stone-200 bg-white"
            }`}
          >
            <span className="flex justify-between gap-3">
              <span className="font-semibold">{cab.name}</span>
              <span className="font-semibold">{inr(cab.price)}</span>
            </span>
            <span className="mt-1 block text-sm text-stone-600">{cab.fit}</span>
            <span className="mt-2 block text-xs text-stone-500">{cab.driver}</span>
          </button>
        ))}
      </div>
    </Panel>
  );
}

export function LockerPanel() {
  const { state, dispatch } = useTrip();
  const origin = ORIGINS.find((item) => item.code === state.origin);
  const transitLabel =
    state.transitStatus === "skipped"
      ? "Bring your own tickets"
      : `${TRANSIT.find((item) => item.id === state.transit)?.title} from ${origin?.city}`;

  return (
    <Panel
      kicker="10 · Locker"
      title="Everything the group needs in one place"
      lede="Passes, stay notes, the car, and the shared ledger. Print this page if someone wants a paper copy offline."
      action={
        <PrimaryButton onClick={() => window.print()}>Print itinerary</PrimaryButton>
      }
    >
      <div id="trip-print" className="grid gap-3">
        <article className="rounded-2xl border border-stone-200 bg-white p-4">
          <p className="text-xs font-semibold tracking-wide text-stone-400 uppercase">{TRIP.code}</p>
          <h3 className="mt-1 text-lg font-semibold">{TRIP.destination}</h3>
          <p className="text-sm text-stone-600">
            {TRIP.datesLabel} · {TRIP.duration}
          </p>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-stone-400">Transit</dt>
              <dd className="font-medium">{transitLabel}</dd>
              <dd className="text-stone-500">{state.transitRef ?? "No reference"}</dd>
            </div>
            {STAYS.map((stay) => {
              const hotel = stay.options.find((item) => item.id === state.hotels[stay.id]);
              const status = state.hotelStatus[stay.id];
              return (
                <div key={stay.id}>
                  <dt className="text-stone-400">{stay.place}</dt>
                  <dd className="font-medium">{status === "skipped" ? "Skipped" : hotel?.name}</dd>
                  <dd className="text-stone-500">{stay.nights}</dd>
                </div>
              );
            })}
            <div>
              <dt className="text-stone-400">Ground</dt>
              <dd className="font-medium">
                {state.cabStatus === "skipped"
                  ? "Skipped"
                  : CABS.find((cab) => cab.id === state.cab)?.name}
              </dd>
              <dd className="text-stone-500">{state.cabRef ?? "No reference"}</dd>
            </div>
          </dl>
        </article>
        <ol className="grid gap-2">
          {state.days.map((day, index) => (
            <li key={day.id} className="rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm">
              <span className="font-semibold">Day {index + 1}. {day.title}</span>
              <span className="mt-1 block text-stone-600">
                {(state.picks[day.id] ?? [])
                  .map((id) => ACTIVITIES.find((item) => item.id === id)?.title)
                  .filter(Boolean)
                  .join(" · ") || "No stops selected"}
              </span>
            </li>
          ))}
        </ol>
        <article className="rounded-2xl border border-stone-200 bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold">Cancellation drill</h3>
              <p className="mt-1 text-sm text-stone-600">
                Rohan paid about {inr(19850)}. Penalties would be {inr(3650)}. {inr(16200)} returns to his vault.
              </p>
            </div>
            <GhostButton
              disabled={state.cancelSimulated}
              onClick={() => dispatch({ type: "cancel-sim" })}
            >
              {state.cancelSimulated ? "Simulated" : "Run drill"}
            </GhostButton>
          </div>
        </article>
      </div>
    </Panel>
  );
}

export function RadarPanel() {
  const { state, dispatch } = useTrip();
  return (
    <Panel
      kicker="11 · Radar"
      title="The outbound flight slipped"
      lede={`${DISRUPTION.detail} This hits ${DISRUPTION.who}. Pick one repair. The others stay as a record.`}
    >
      <div className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-950">
        <p className="font-semibold">{DISRUPTION.title}</p>
        <p className="mt-1">{DISRUPTION.detail}</p>
      </div>
      <div className="grid gap-3">
        {REPLANS.map((option) => {
          const on = state.replan === option.id;
          return (
            <article
              key={option.id}
              className={`rounded-2xl border bg-white p-4 ${on ? "border-[#0c6b62]" : "border-stone-200"}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold">{option.title}</h3>
                  <p className="text-xs font-semibold tracking-wide text-[#0c6b62] uppercase">{option.tag}</p>
                </div>
                <p className="text-sm font-semibold">
                  {option.cost === 0 ? "No extra cost" : option.cost > 0 ? `+${inr(option.cost)}` : inr(option.cost)}
                </p>
              </div>
              <p className="mt-2 text-sm text-stone-600">{option.detail}</p>
              <p className="mt-1 text-xs text-stone-500">{option.time}</p>
              <button
                type="button"
                onClick={() => dispatch({ type: "replan", id: option.id })}
                className="mt-3 text-sm font-semibold text-[#0c6b62]"
              >
                {on ? "Applied" : "Apply this repair"}
              </button>
            </article>
          );
        })}
      </div>
    </Panel>
  );
}

export function StageBody() {
  const { state } = useTrip();
  switch (state.stage) {
    case "seasons":
      return <SeasonPanel />;
    case "dates":
      return <DatesPanel />;
    case "route":
      return <RoutePanel />;
    case "activities":
      return <ActivitiesPanel />;
    case "food":
      return <FoodPanel />;
    case "vault":
      return <VaultPanel />;
    case "transit":
      return <TransitPanel />;
    case "stays":
      return <StaysPanel />;
    case "fleet":
      return <FleetPanel />;
    case "locker":
      return <LockerPanel />;
    case "radar":
      return <RadarPanel />;
    default:
      return null;
  }
}
