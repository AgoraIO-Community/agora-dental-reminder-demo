# Event Reminder Assistant Architecture

## Components

The browser uses Agora RTC for audio and RTM for transcript and Agent events. Next.js only signs credentials and starts/stops the managed Agent. No business session, data API, local file store or persistent application database is required. Native Node.js, Docker and a Next.js-compatible serverless deployment use the same conversation flow. Actual hosted voice acceptance remains a separate check.

## Session time limit

LandingPage enforces a ten-minute browser session deadline from successful startup. It reuses the manual stop flow, checks wall time every second and on focus/visibility changes, and retries failed stops every five seconds. Successful stop retains the transcript and shows a timeout notice; starting again resets the deadline. Effect cleanup removes the timer/listeners. This is not a server-side usage cap: closed pages, suspended devices and network failures can delay Agent shutdown.

The conversation header shows a small, muted countdown (10:00 left) immediately before the connection status. The last minute is highlighted, with an automatic-stop notice for screen readers. At the deadline the timer stays at 00:00 until stopping succeeds. Screen readers do not announce every tick.

## Start and stop

The page requests an RTC/RTM token and starts the managed Agent using requester_id and channel_name. RTM is ready before the RTC conversation component mounts. End conversation stops the Agent, logs out RTM and unmounts hook-owned media. No customer, shopping, follow-up or event session participates in startup.

## State

Scenario instructions and static public reference material are bundled with the app. Current-call transcript, activity and Inspector state live in browser memory. There is no business Map, writable result file, business API or application database.

## Ownership and invariants

LandingPage owns bootstrap and RTM. ConversationComponent owns RTC/toolkit subscriptions and uses the StrictMode guard. Preserve local-user UID normalization and interrupted turns. Token, invite and stop routes own privileged operations. lib/agent-tools.ts always returns an empty list.

## Deployment

The browser uses Agora RTC for audio and RTM for transcript and Agent events. Next.js only signs credentials and starts/stops the managed Agent. No business session, data API, local file store or persistent application database is required. Native Node.js, Docker and a Next.js-compatible serverless deployment use the same conversation flow. Actual hosted voice acceptance remains a separate check.

Supply NEXT_PUBLIC_AGORA_APP_ID at build and runtime and keep NEXT_AGORA_APP_CERTIFICATE server-only. No persistent volume is required. Synthetic verification does not prove real speech or hosted reachability.

## Usage FAQ ownership

`components/ScenarioFaq.tsx` owns static usage answers; `styles/faq.css` owns disclosure styling, scrolling and transitions. Its header trigger and content share a Radix Dialog root in `LandingPage`. Dialog handles focus trapping, Escape/backdrop dismissal and returning focus to the trigger. FAQ has no session or business API calls.


<a id="conversation-behavior"></a>

## Scenario behavior — 2026-11-18

Hear a fictional Boston dental appointment reminder and discuss attendance, cancellation or rescheduling intentions without changing clinic records.

### Conversation flow

Role-play a reminder and attendance-confirmation conversation about the one configured fictional dental checkup. The user starts the browser session; no outbound phone call has been placed. Open with a brief fictional-practice disclosure and ask permission to share the reminder. Do not assume the caller is a real patient or that a patient record was retrieved. If they say this is the wrong person, do not read further appointment details; apologize briefly and end the reminder. Respect refusal or a stop request.

After agreement, give the clinic name, routine checkup, exact supplied appointment date, local start/end time, time zone and fictional address. Ask whether the caller plans to attend. Answer schedule, location or preparation questions from the supplied reference before asking more intake questions. Each new conversation receives a fictional appointment on the following New York calendar day at 2 PM for 45 minutes. Keep that exact supplied date and time fixed throughout this conversation, including across midnight. Never roll the appointment forward yourself. If the date has passed, explain that the example appointment has passed rather than asking the caller to attend it. On the same date, do not infer whether it has started from the date alone.

Distinguish attendance intention from changes to a clinic appointment. Accept attending, not attending, undecided, cancellation requests or requests to reschedule. Clarify an ambiguous intention at most once, reuse corrections and summarize the latest response. Saying they will attend confirms only their intention in this conversation; nothing is saved or sent. A request to cancel or change the time is not a completed cancellation or booking. You may collect a preferred day or broad time window for a verbal request recap, but no alternative appointment slots are configured. Do not invent availability or say a new appointment was confirmed. Keep the original example time separate from a proposed preference. Repeat back a correction or requested change before finalizing the recap.

Explain only the listed general arrival guidance: arrive ten minutes early and prepare questions for clinic staff. Never invent fasting, medication changes, procedure-specific instructions, insurance coverage, fees or treatment advice. For a clinical preparation question, explain that the treating clinic must give the relevant instructions. For a caller describing severe symptoms or an emergency, stop the administrative flow and advise urgent professional help or emergency services as appropriate; do not diagnose or triage beyond that broad direction. Do not request a legal name, date of birth, patient ID, insurance details, symptoms or contact information for this fictional reminder.

If asked to send a reminder, update a calendar, notify the clinic or arrange a callback, explain the specific unavailable action and offer a concise verbal recap. Close with the original exact appointment time, the latest stated attendance intention and any requested change, clearly separating them and saying no clinic record, notification or calendar entry was changed. Do not pressure a hesitant caller or promise that a real clinic can retrieve this conversation.

### Capability boundary

This is one fictional dental appointment, not a patient record or evidence of an actual clinic visit. No patient lookup, appointment system, dialer, notification, calendar or external action is connected. Never claim an attendance response was saved, an appointment was changed or cancelled, or a message was sent. Do not disclose further details after a wrong-person response. Do not collect patient identifiers, medical history, insurance or payment information. Do not diagnose, invent clinical preparation rules or promise treatment outcomes. The caller may discuss preferences, but only the original configured appointment has a time.

### Source ownership

`lib/agent-config.ts` owns the workflow and greeting. `lib/presentation.ts` and `components/ScenarioFaq.tsx` own matching public copy. `lib/scenario-knowledge.ts` supplies fictional reference and business-local future dates without business lookups.

## Token lifetime compatibility

Browser RTC/RTM tokens and server-side Agent/REST tokens use the shared ten-minute `TOKEN_LIFETIME_SECONDS` duration. Token builders take durations, not Unix expiry timestamps. Keep the App Certificate and ConvoAI-capable REST tokens on the server.

The Agent start/stop routes explicitly mint tokens with `ConvoAITokenBuilder.buildToken` and pass the supported SDK `authToken` / session `token` options. This avoids the `agora-agents` 2.14.0 / `agora-token` 2.0.7 positional-argument mismatch: the SDK helper otherwise treats publisher role `1` as a one-second token lifetime. Do not patch installed dependencies or add blanket overrides. `verify:api` exercises the real SDK serialization with intercepted network transport, decodes and verifies actual signed tokens, and checks a 600-second lifetime for browser, REST start, Agent RTC/RTM and REST stop tokens. Revisit the explicit-token compatibility path only after an upstream SDK correction passes this regression and live acceptance.

## Lint dependency security compatibility

The registry audit reports GHSA-g3hv-75wg-m249 in minimatch 10.2.6, including the latest typescript-estree 8.72.2 dependency range. A parent-scoped pnpm override selects minimatch 11.0.1 only for `@typescript-eslint/typescript-estree>minimatch`; it does not replace unrelated consumers. Node.js 24 satisfies its runtime requirement, and the caller uses the retained CommonJS `minimatch` function with `dot: true`. Recheck and remove this compatibility override when the upstream dependency range includes a patched version. Run the complete verification suite and an official-registry audit after lockfile updates.
