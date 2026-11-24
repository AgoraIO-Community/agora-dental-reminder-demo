import { getDemoDates } from './prompt-context';

// Fictional appointment reference only; no patient lookup or clinic writes.
export const SCENARIO_KNOWLEDGE = {
  "source": {
    "kind": "Fictional dental appointment reference",
    "revision": "2026-11-18",
    "scope": "One example generated at startup; not a patient record, real appointment or live clinic availability."
  },
  "timeZone": "America/New_York",
  "title": "Routine dental checkup",
  "clinic": "Agora Harbor Dental (fictional)",
  "location": "100 Example Harbor Lane, Boston, MA 02110 (fictional; not for navigation)",
  "demoSchedule": {
    "daysAhead": 1,
    "startHour": 14,
    "durationMinutes": 45,
    "description": "A fictional appointment on the following New York calendar day; fixed within the conversation."
  },
  "preparation": [
    "Arrive ten minutes before the example appointment",
    "Prepare questions to ask clinic staff"
  ],
  "unconfirmed": [
    "Real appointments and alternative slots",
    "Procedure-specific preparation",
    "Insurance coverage, costs and treatment"
  ],
  "responsePolicy": "Attendance is a conversational intention only. Cancellation and rescheduling preferences are recapped, never submitted or confirmed as clinic changes."
} as const;

export function getScenarioKnowledge(now = new Date()) {
  const { timeZone, demoSchedule } = SCENARIO_KNOWLEDGE;
  const date = getDemoDates(timeZone, now)[demoSchedule.daysAhead];
  // The fixed 2 PM New York appointment is after the U.S. early-morning DST transition.
  // Use the appointment date's offset, rather than today's offset, for its local start.
  const offset = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'longOffset' })
    .formatToParts(new Date(date + 'T12:00:00Z')).find(part => part.type === 'timeZoneName')!.value.replace('GMT', '');
  const startsAt = `${date}T${String(demoSchedule.startHour).padStart(2, '0')}:00:00${offset}`;
  const start = new Date(startsAt);
  const endsAt = new Date(start.getTime() + demoSchedule.durationMinutes * 60_000).toISOString();
  const localStartTimes = Object.fromEntries([
    'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
  ].map(zone => {
    const formatted = new Intl.DateTimeFormat('en-US', {
      timeZone: zone, year: 'numeric', month: 'long', day: 'numeric',
      hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
    }).format(start);
    const utcOffset = new Intl.DateTimeFormat('en-US', { timeZone: zone, timeZoneName: 'longOffset' })
      .formatToParts(start).find(part => part.type === 'timeZoneName')!.value.replace('GMT', 'UTC');
    return [zone, `${formatted} (${utcOffset})`];
  }));
  return { ...SCENARIO_KNOWLEDGE, session: {
    date, startsAt, endsAt, durationMinutes: demoSchedule.durationMinutes, timeZone, localStartTimes,
  } };
}
