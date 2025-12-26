export interface Insight {
  id: string;
  title: string;
  description: string;
  strength?: "weak" | "medium" | "strong";
  domainTags?: string[];
}

export function useInsights() {
  // Mocked daily arrays (7 days)
  const sleep = [7.5, 6.2, 8.0, 5.5, 7.2, 8.5, 6.9]; // hours
  const fastingCompleted = [1, 1, 0, 1, 1, 1, 0]; // 1 = completed fast
  const steps = [4000, 3000, 5500, 2000, 7000, 8500, 3500];
  const symptomsSeverity = [0, 1, 0, 2, 1, 0, 2]; // 0-3 scale

  const insights: Insight[] = [];

  // Insight 1: short sleep correlates with missed fasts
  const shortSleepDays = sleep.map((h, i) => ({ h, i })).filter(s => s.h < 6).map(s => s.i);
  const shortSleepMissRate = shortSleepDays.length
    ? (shortSleepDays.filter(i => fastingCompleted[i] === 0).length / shortSleepDays.length) * 100
    : 0;
  const overallMissRate = (fastingCompleted.filter(f => f === 0).length / fastingCompleted.length) * 100;

  if (shortSleepDays.length > 0) {
    insights.push({
      id: "ins-1",
      title: "Sleep & fasting",
      description: `On nights with <6h sleep, you missed ${Math.round(shortSleepMissRate)}% of fasts vs ${Math.round(overallMissRate)}% overall.`,
      strength: shortSleepMissRate > overallMissRate ? "medium" : "weak",
      domainTags: ["sleep", "fasting"],
    });
  }

  // Insight 2: symptoms reduce steps
  const highSymptomDays = symptomsSeverity.map((s, i) => ({ s, i })).filter(s => s.s >= 2).map(s => s.i);
  if (highSymptomDays.length > 0) {
    const avgStepsHigh = highSymptomDays.reduce((acc, idx) => acc + steps[idx], 0) / highSymptomDays.length;
    const avgStepsAll = steps.reduce((a, b) => a + b, 0) / steps.length;
    insights.push({
      id: "ins-2",
      title: "Symptoms & activity",
      description: `On higher-symptom days your steps average ${Math.round(avgStepsHigh)} vs ${Math.round(avgStepsAll)} overall.`,
      strength: "weak",
      domainTags: ["symptoms", "activity"],
    });
  }

  // Insight 3: positive trend if fasting completion high
  const completionRate = (fastingCompleted.filter(f => f === 1).length / fastingCompleted.length) * 100;
  if (completionRate > 60) {
    insights.push({
      id: "ins-3",
      title: "Good consistency",
      description: `You've completed ${Math.round(completionRate)}% of your recent fasts — nice consistency!`,
      strength: "strong",
      domainTags: ["fasting"],
    });
  }

  return { insights };
}
