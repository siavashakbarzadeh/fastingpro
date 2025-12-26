"use client";

import { useMemo } from "react";

export type ReminderDomain = "fasting" | "dental" | "meds";

export interface SmartReminder {
  id: string;
  domain: ReminderDomain;
  title: string;
  message: string;
  ctaLabel?: string;
  targetRoute?: string;
}

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + (m || 0);
}

export function useSmartReminders(now?: Date) {
  const n = now ?? new Date();

  return useMemo(() => {
    const reminders: SmartReminder[] = [];

    // --- Mocked context (replace with real hooks later) ---
    // Typical bedtime
    const bedtimeMinutes = 23 * 60; // 23:00
    // Typical fasting start
    const fastingStartMinutes = 18 * 60; // 18:00
    // Mocked meds schedule
    const medsSchedule = [
      { id: "met-20", name: "Metformin", time: "20:00" },
      { id: "vitd-14", name: "Vitamin D", time: "14:00" },
    ];

    // Local checks (read from localStorage where available)
    let brushedTodayEvening = false;
    try {
      const raw = localStorage.getItem("brushing_summary");
      if (raw) {
        const parsed = JSON.parse(raw);
        brushedTodayEvening = !!parsed.brushedTonight;
      }
    } catch (e) {}

    let fastStartedToday = false;
    try {
      const raw = localStorage.getItem("fast_today_started");
      fastStartedToday = raw === "1" || raw === "true";
    } catch (e) {}

    // meds taken map
    let medsTaken: Record<string, boolean> = {};
    try {
      const raw = localStorage.getItem("meds_taken_today");
      medsTaken = raw ? JSON.parse(raw) : {};
    } catch (e) {}

    const nowMinutes = n.getHours() * 60 + n.getMinutes();

    function withinMinutes(targetMinutes: number, window = 30) {
      return Math.abs(targetMinutes - nowMinutes) <= window;
    }

    // Dental reminder: within 30 minutes before bedtime and not brushed
    if (withinMinutes(bedtimeMinutes, 30) && !brushedTodayEvening) {
      reminders.push({
        id: "rem-dental-evening",
        domain: "dental",
        title: "Evening brushing",
        message: "It's almost bedtime — don't forget to brush your teeth.",
        ctaLabel: "Open brushing",
        targetRoute: "/dental",
      });
    }

    // Fasting reminder: within 30 minutes before fasting start
    if (withinMinutes(fastingStartMinutes, 30) && !fastStartedToday) {
      reminders.push({
        id: "rem-fasting-soon",
        domain: "fasting",
        title: "Your fast starts soon",
        message: "Prepare to start your fast in about 30 minutes.",
        ctaLabel: "View fasting",
        targetRoute: "/fasting",
      });
    }

    // Medications reminders: check medsSchedule
    medsSchedule.forEach((m) => {
      const t = toMinutes(m.time);
      if (withinMinutes(t, 25) && !medsTaken[m.id]) {
        reminders.push({
          id: `rem-meds-${m.id}`,
          domain: "meds",
          title: `Time for ${m.name}`,
          message: `Take ${m.name} as scheduled at ${m.time}`,
          ctaLabel: "Open meds",
          targetRoute: "/medications",
        });
      }
    });

    return { reminders };
  }, [now]);
}
