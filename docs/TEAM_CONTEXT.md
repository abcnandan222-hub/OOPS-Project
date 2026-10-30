# I-ITSM Team Context (CS F213 / MAC F212 OOP Project)

> Attach this file **together with the original project brief** at the start of every new chat.
> Keep it in the repo at `docs/TEAM_CONTEXT.md` and update it via pull request when a team decision changes.

## Note to the mentor reading this in a new chat
- Follow the TEACHING RULES in the project brief exactly (mentor, not code generator).
- **Phase 0 planning is already done** (below). Do not redo it. The person who opened this chat owns ONE slice; focus on that slice.
- The other two slices are being built in separate chats. Anything that crosses slices goes through the **Cross-slice contracts** section. If the student wants to change a contract, remind them to agree it with the other two and update this file.
- Keep a running decisions log for this slice. Tell the student when a decision belongs in the team log below.

## Project and deadlines
- System: Intelligent IT Service Management & Incident Resolution System (I-ITSM). Full requirements are in the project brief.
- **Code freeze: Sun 15 Nov 2026.** Feature freeze: Fri 13 Nov.
- Report, demo video and mock viva prep: 16–22 Nov. Final deadline: 22 Nov 2026.
- Team experience: basic Python and OOP. FastAPI, SQL and React are all new to everyone.
- Machines: one macOS, two Windows. Everything runs locally, no Docker.

## Team and ownership (vertical slices: each person does frontend, backend and DB for their slice)

### Slice 1: Abhinandan, Incident lifecycle & intelligence
- **Domain:** Incident, ITService, Category (data-driven), Resolution, Feedback.
- **Patterns:** State (one class per lifecycle state; invalid transitions raise InvalidStateTransitionError) and IncidentFactory.
- **Database:** tables for incidents, notes, services, categories, resolutions and feedback. The repository must map the stored status string back to a State object.
- **API:** report an incident, "my incidents" lists, incident detail, one endpoint per lifecycle action (including PENDING_INFO and reopen), feedback, and admin CRUD for services and categories.
- **Intelligence:** duplicate detection and correlation (TF-IDF + cosine similarity, configurable threshold, grouping by service within a time window), category suggestion (classifier + keyword fallback) and suggested resolutions. All sit behind swappable interfaces.
- **UI:** employee report form (live duplicate and category hints), my-incidents list, incident detail with timeline, and technician incident actions.

### Slice 2: Adi, Users, priority, assignment & SLA
- **Domain:** abstract User → Employee / Technician / Administrator, plus UserFactory.
- **Patterns:**
  - PriorityStrategy: weighted score and rule-based, including the affected_users ≥ 100 bump.
  - AssignmentStrategy: skill-based and load-based (round-robin optional), switchable by the admin at runtime.
- **SLA:** SLAPolicy, deadline calculation, and the APScheduler SLA monitor. It emits SlaWarning at 80% and SlaViolated past the deadline, **once only per incident**, not on every run.
- **Exceptions:** TechnicianUnavailable, WorkloadExceeded, MissingSlaConfiguration, InvalidLogin, Unauthorized.
- **Auth:** JWT login, bcrypt password hashing, and the RBAC dependencies used by every slice.
- **Database:** users with role inheritance mapping, skills (many-to-many with technicians), SLA policies, and a settings table for the active strategy.
- **UI:** login page, protected role routes, technician workload/queue, and admin screens for users, technicians, SLA policies and the strategy switcher.

### Slice 3: Shrey, Events, notifications, dashboard & reports
- **Patterns:**
  - Observer: DomainEvent hierarchy, EventBus, and subscribers for the audit log, notifications and WebSocket broadcast.
  - NotificationFactory: abstract Notification → InApp / Email.
  - Adapter: a simulated email gateway behind a Notifier interface.
- **Also owns:** notification-channel selection and AuditRecord.
- **Database:** audit records and notifications, plus the report aggregation queries.
- **API:** audit log viewing, notifications, the four reports (overview, technician workload, service analysis, SLA violations), advanced search/filter, and the JWT-authenticated WebSocket endpoint with a connection manager.
- **UI:** live admin dashboard (Recharts), real-time notification bell, report pages, audit log table and the search page.

## Shared foundation (built TOGETHER, in the team chat, before the slices diverge)
- Repo skeleton (backend and frontend folders), README draft, and `.env.example`.
- DB engine/session setup and Alembic initialisation.
- Abstract base Repository, the base custom exception, the consistent JSON error format and the exception handler.
- Frontend shell: Vite + TypeScript, Tailwind, React Router, TanStack Query, the API client and the three role layouts.
- **Reference feature: Category CRUD end to end** (table → repository → service → router → React page → tests). Every slice copies its structure.

## Cross-slice contracts
The interface designs are decided by the provider *with* the consumers. Signatures are not fixed here yet; record them once they are agreed.

| ID | Provider → Consumer | What | Due |
|---|---|---|---|
| C1 | Slice 2 → all | Current-user dependency and role guard. Fake version first, real JWT later | Fake by 27 Oct, real by ~6 Nov |
| C2 | Slice 3 → all | EventBus publish/subscribe interface and the domain event classes | 27 Oct |
| C3 | Slice 2 → Slice 1 | Priority calculation (used on CLASSIFY) | Domain version by 1 Nov |
| C4 | Slice 2 → Slice 1 | Assignment service (used on ASSIGN); raises TechnicianUnavailable / WorkloadExceeded | Domain version by 1 Nov |
| C5 | Slice 1 → Slices 2 & 3 | Incident domain object and read access (fields the SLA monitor and reports need) | 1 Nov |
| C6 | Slice 3 → Slice 1 | Audit records per incident, for the timeline | ~8 Nov |
| C7 | Shared | Base exception, error JSON format, base Repository, frontend API client | Shared foundation |

**Rule:** changing a contract requires agreement from all three members, and this table is updated via PR.

## Timeline
| Window | Everyone |
|---|---|
| 22–25 Oct | Install tools, learning ramp (FastAPI tutorial, SQLAlchemy 2.0 Unified Tutorial, react.dev Learn), repo created |
| 26 Oct – 1 Nov | Own slice: domain classes, patterns, exceptions, unit tests (Phase 1). Stubs C1 and C2 by 27 Oct. Shared foundation and Category reference feature together by 1 Nov. **Checkpoint 1 Nov** |
| 2–8 Nov | Own slice: ORM models, migrations, repositories, seed data, services, endpoints, API tests (Phases 2–3) |
| 9–12 Nov | Own slice: frontend screens. Slice 1 wires in ML; Slice 3 builds the WebSocket dashboard (Phases 4–5) |
| 13–15 Nov | Feature freeze 13 Nov. Integration, ≥15 documented test cases (≥5 per person), bug fixing (Phase 6) |
| 16–22 Nov | Report, diagrams, demo, mock viva (Phase 7), in the team chat |

**Trim list** (cut in this order if behind at a checkpoint):
1. Round-robin assignment.
2. Notification-channel strategy (reduce to minimal).
3. Vitest.
4. The incident-correlation half of duplicate detection.

## Team decisions log
- **D1:** Code complete by 15 Nov; 16–22 Nov for the report and demo. *Reason:* buffer, and the report needs working code.
- **D2:** Parallel development with interfaces agreed early. *Reason:* there is not enough time for a sequential build.
- **D3:** Vertical feature slices, each covering frontend, backend and DB, with ≥1 design pattern per person. *Reason:* full-stack learning for everyone; everyone can explain every layer in the viva.
- **D4:** About a 3-day learning ramp, plus a scope checkpoint on 1 Nov. *Reason:* the technologies are new to everyone.
- **D5:** Shared foundation and the Category CRUD reference feature are built together first. *Reason:* consistent structure across slices.
- **D6:** Every PR is reviewed by another member before merging. *Reason:* shared understanding, quality, meaningful commit history.
- **D7:** Slice 2 ships the fake current-user dependency and Slice 3 ships the EventBus interface and events by ~27 Oct. *Reason:* these are the blocking dependencies.
- **D8:** Slice 3 owns advanced search; Slice 1 owns the simple "my incidents" lists. *Reason:* avoids overlapping endpoints.
- **D9:** Each member mentors their slice in a separate chat; the shared foundation, integration and Phase 7 happen in the team chat; this file plus the brief is the shared source of truth. *Reason:* focused chats without losing team-level consistency.

## Open questions (resolve as a team)
- Is the 15–16 hours/week **per person** or in total?
- Tool installation status on each machine.
- Where SLA deadlines live: stored on the incident when it is prioritised (Slice 1 data, Slice 2 logic), or computed on the fly by the monitor?
