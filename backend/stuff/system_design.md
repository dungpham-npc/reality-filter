Scope (v0)
In scope:

One complete minimal user flow: Hazard Warning → Phase 1 (comfort bait coding task) → Phase 2 (hidden failure) → Phase 3 (reveal) → Fork (Exit or Continue).
Exactly one coding task in Phase 1.
Simple unlock of 3–5 curated readings/lenses after failure or exit.
Anonymous user progress tracking (session-based + optional lightweight persistence).
Basic diagnostic logging/metrics for the creator (you) only.
Stark, no-frills UI that matches the blunt tone.

Out of scope (explicitly excluded for v0):

Multiple tasks or progressive difficulty.
Any community, social, gamification, leaderboards, progress bars, scores.
Real user accounts, auth, or emails.
AI assistance.
Production deployment (Docker optional but not required; run locally or on a cheap VPS).
Full online judge with arbitrary code execution in Java (too complex and risky for solo v0).

Success definition for your build: You can walk through the full flow yourself, it reliably creates the intended discomfort/clarity, and most simulated "users" (or real early testers) would quit early.
Functional Requirements
Core Flow

Entrance (Hazard Warning)
Static page with blunt warning text (copy directly from the doc).
Single prominent "I Understand and Want to Proceed" button → irreversible (no back button works after this; use session flag).

Phase 1: Comfort Bait
Present one simple, reasonable-looking task in JavaScript (runs client-side in browser via Monaco or Ace editor).
Example task (strong fit for the philosophy):
"Implement a basic Bank Account class with deposit, withdraw, transfer, and getBalance methods. Support multiple accounts."

Runnable environment: Code editor + "Run Tests" button that executes happy-path tests in the browser (single-threaded, small numbers).
Naïve solution looks clean and passes visible tests.

Phase 2: Hidden Constraint / Invariant
After "passing" visible tests, offer a "Simulate Production / High Load" button.
This runs a client-side simulation (multiple rapid async operations via Promise.all + setTimeout or Web Workers) that exposes the hidden failure (e.g., race condition in transfer → lost updates or negative balances, or floating-point precision if you choose money-as-number).
Show non-dramatic but clear failure logs/output: "Balance is incorrect under concurrent transfers" or "Money disappeared."

Phase 3: Reveal
Clean explanation page:
What assumption was violated (e.g., "You assumed operations were atomic").
Which invariant was broken (e.g., "Conservation of money" or "No lost updates under concurrency").
How the computer did exactly what the code said.

No judgment, no "gotcha."

Fork: Exit or Continue
Two clear, prominent buttons.
Exit: Shows a short "What the field is actually about" summary + unlocks the reading layer.
Continue: Unlocks a deeper conceptual task or directly into readings (keep minimal — maybe just readings for v0).


Reading Layer (unlocked after failure/exit)

4–5 static pages or accordions with the exact artifacts mentioned (Ousterhout excerpts, Google SE book chapters, postmortems, Dijkstra, etc.).
Framed strictly as "lenses" with the exact language from the doc ("If this resonates, you might belong here").

Metrics (diagnostic only)

Time spent per phase.
Whether user submitted code immediately vs. asked questions (if you add a clarification box).
Quit point (which phase).
Simple in-memory or DB log (visible only to you at /admin/metrics — password-protected or localhost-only).

Non-Functional Requirements

Simplicity first: Everything must be buildable and understandable by one person in a reasonable time.
Tone: Stark, serious, slightly uncomfortable (dark/gray color scheme, minimal styling, direct language).
Performance: Instant feedback for code execution (client-side JS).
Accessibility: Basic (readable fonts, good contrast) — not a priority beyond usability.
Maintainability: Clean, well-commented code. Easy to add one more task later.
Reliability: No critical bugs in the flow. Code execution is sandboxed by nature (browser).
No false promises: UI and text must never imply this is a course, bootcamp, or credential.

Architecture
Monolithic Spring Boot application (classic layered):

Presentation Layer: Thymeleaf templates (server-rendered) + embedded JS editor (Ace.js or Monaco via WebJars/CDN) + vanilla JS or Alpine.js for interactivity.
Application Layer: Spring MVC controllers managing flow state.
Domain Layer: Simple POJOs for UserSession (progress, phase, logs), Task definitions, Reading content.
Infrastructure: H2 embedded database (or even just in-memory Map for ultra-minimal) for optional persistence of sessions/metrics.
Client-side: All code execution and load simulation happens in the browser (JavaScript).

Flow is mostly state-machine driven via session attributes (or a simple UserProgress entity tied to a UUID cookie).
High-Level Design Decisions

Why JavaScript for coding tasks?
Browser execution = zero backend sandboxing complexity, instant feedback, safe, and still perfectly valid for exposing modeling failures (concurrency, floating point, state, time, etc.). It keeps the project simple while honoring "runnable environment" and "coding is necessary but dangerous." You can switch to Java snippets in v1 if desired.
State management: Session + optional DB row per anonymous user (UUID in cookie).
Readings: Stored as Markdown files in src/main/resources/readings/ and rendered with a simple Markdown parser (e.g., CommonMark) or just static HTML pages.
UI flow: Wizard-style with "Next" disabled until actions complete. Clear "I want to quit" button always visible.
Failure simulation: Hard-coded client-side JS that demonstrates the specific invariant violation for your chosen task.

Tech Stack (Comfortable & Minimal)

Backend: Spring Boot 3.x (Java 21 or 17)
Web: Spring Web + Thymeleaf
Database: H2 (embedded, file mode optional)
Build: Maven (or Gradle if you prefer)
Frontend extras:
Ace.js or Monaco Editor (via CDN or WebJars)
Minimal JS (vanilla or Alpine.js — no heavy React)
Tailwind or plain CSS (keep styling minimal)

Other: Lombok, Spring Data JPA (optional for metrics), CommonMark for Markdown.

Dependencies to add (keep pom.xml tiny):

spring-boot-starter-web
spring-boot-starter-thymeleaf
spring-boot-starter-data-jpa
com.h2database:h2
Lombok
Ace.js / Monaco (static)

Constraints

Solo developer → everything must be doable in one codebase without deep expertise in security or distributed systems.
No external services (no Docker for execution, no third-party judge APIs, no AI).
No production security (basic session security is enough; run behind auth if public).
Time-boxed: Aim for a working flow in days/weeks, not months.
Ethical: All text must follow the "never humiliate" rule exactly.

Invariants (What Must Never Break in This System)

User agency — Quitting is always easy, respected, and framed positively.
No illusions — The system never claims to teach syntax, prepare for jobs, or certify anything.
Failure belongs to the model — Any bug in the task must be traceable to the user's modeling, never to the platform itself.
Flow integrity — Users cannot skip phases or see reveals without experiencing the failure.
Scarcity is emergent — No artificial gates; difficulty and discomfort do the filtering.
Creator visibility only — Metrics are private; users never see scores or comparisons.