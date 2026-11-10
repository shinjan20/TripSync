"use client";

import type { ReactNode } from "react";
import { initials, memberById } from "@/data/demo-trip";

const TONES = ["#0c6b62", "#b45309", "#1d4ed8", "#be185d"];

export function toneFor(name: string) {
  const index = Math.abs(name.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0));
  return TONES[index % TONES.length];
}

export function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  const box = size === "sm" ? "h-7 w-7 text-[10px]" : "h-9 w-9 text-xs";
  return (
    <span
      className={`${box} inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white`}
      style={{ background: toneFor(name) }}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}

export function FacePile({ ids }: { ids: string[] }) {
  if (ids.length === 0) {
    return <span className="text-xs text-stone-400">No votes yet</span>;
  }
  return (
    <span className="flex items-center">
      {ids.map((id) => {
        const member = memberById(id);
        return (
          <span key={id} className="-ml-1.5 first:ml-0" title={member?.name}>
            <Avatar name={member?.name ?? id} size="sm" />
          </span>
        );
      })}
    </span>
  );
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-11 items-center justify-center rounded-full bg-[#0c6b62] px-5 text-sm font-semibold text-white transition hover:bg-[#08564f] disabled:cursor-not-allowed disabled:bg-stone-300"
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-11 items-center justify-center rounded-full border border-stone-300 bg-white px-5 text-sm font-semibold text-stone-700 transition hover:border-stone-400 disabled:cursor-not-allowed disabled:text-stone-300"
    >
      {children}
    </button>
  );
}

export function Panel({
  kicker,
  title,
  lede,
  children,
  action,
}: {
  kicker: string;
  title: string;
  lede: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.16em] text-[#0c6b62] uppercase">{kicker}</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">{lede}</p>
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}
