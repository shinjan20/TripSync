"use client";

import { createContext, useContext, useMemo, useReducer, type Dispatch, type ReactNode } from "react";
import { initialState, reduceTrip, type TripAction, type TripState } from "@/data/trip-machine";

const TripContext = createContext<{
  state: TripState;
  dispatch: Dispatch<TripAction>;
} | null>(null);

export function TripProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reduceTrip, undefined, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTrip() {
  const value = useContext(TripContext);
  if (!value) throw new Error("useTrip must be used inside TripProvider");
  return value;
}
