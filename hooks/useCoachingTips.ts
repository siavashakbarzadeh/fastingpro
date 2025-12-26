"use client";

import { useEffect, useState } from "react";

export type TipDomain = "fasting" | "dental" | "meds";

export interface CoachingTip {
  id: string;
  domain: TipDomain;
  title: string;
  body: string;
  sourceLabel?: string;
}

const TIP_REGISTRY: Record<TipDomain, CoachingTip[]> = {
  fasting: [
    { id: "f1", domain: "fasting", title: "Start small", body: "If you're new, try 12–14h windows first and increase gradually.", sourceLabel: "Practical" },
    { id: "f2", domain: "fasting", title: "Stay hydrated", body: "Drink water before your fasting window to reduce hunger pangs.", sourceLabel: "Evidence" },
    { id: "f3", domain: "fasting", title: "Consistent schedule", body: "Keeping similar start times helps your body adapt faster.", sourceLabel: "Behavioral" },
  ],
  dental: [
    { id: "d1", domain: "dental", title: "Brush for 2 minutes", body: "Two minutes twice a day reduces plaque and cavities.", sourceLabel: "Dentist" },
    { id: "d2", domain: "dental", title: "Floss daily", body: "Flossing reaches areas a brush cannot and prevents gum disease.", sourceLabel: "Dentist" },
    { id: "d3", domain: "dental", title: "Don't rinse immediately", body: "Avoid rinsing with water right after brushing to keep fluoride working.", sourceLabel: "Dental tip" },
  ],
  meds: [
    { id: "m1", domain: "meds", title: "Set a routine", body: "Link medication to an existing habit (breakfast) to reduce misses.", sourceLabel: "Pharmacist" },
    { id: "m2", domain: "meds", title: "Keep a list", body: "Maintain an up-to-date meds list in the app for emergencies.", sourceLabel: "Practical" },
    { id: "m3", domain: "meds", title: "Check interactions", body: "Ask your clinician about major food/drug interactions (e.g., grapefruit).", sourceLabel: "Safety" },
  ],
};

export function useCoachingTips(domain: TipDomain) {
  const key = `coach_tip_index_${domain}`;
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setIndex(Number(raw) || 0);
    } catch (e) {}
  }, [key]);

  const tips = TIP_REGISTRY[domain] || [];
  const currentTip = tips.length ? tips[index % tips.length] : null;

  function nextTip() {
    setIndex((i) => {
      const next = (i + 1) % Math.max(1, tips.length);
      try {
        localStorage.setItem(key, String(next));
      } catch (e) {}
      return next;
    });
  }

  return { currentTip, nextTip };
}
