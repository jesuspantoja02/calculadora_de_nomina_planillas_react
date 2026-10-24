# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary:** HR and payroll staff at small and medium businesses in Peru who run monthly payroll, issue pay slips (boletas), and need figures aligned with local labor rules—not only students rehearsing the same flows in class.

**Secondary:** Instructors and students in UTP’s *JavaScript Avanzado* course, who use the same codebase to study progression from browser-only logic to a maintainable full-stack system.

**Situation:** A single company context (configurable rates and company data), recurring pay cycles (including quincenal advance and fin de mes), employee registry, payment simulation, printable boletas, and a summary dashboard.

## Product Purpose

Provide credible payroll calculation and operational workflows for Peruvian nómina—employees, payment processing, boleta history, configuration of legal parameters, and dashboard totals—backed by a REST API and persistent storage so results are consistent and auditable beyond one browser.

**Success** means an HR user can register staff, process a payment with correct AFP/ONP, quinta categoría, gratificación, CTS, and related concepts (per the implemented rules), review history, print boletas, and adjust configuration when norms or company policy change—without treating the app as a toy demo.

## Positioning

Payroll **domain truth lives in a hexagonal backend** (`calculo-planilla.ts`, SQLite, Zod-validated API) shared across frontend generations; the React SPA is a thin, replaceable client that must not re-implement or drift from that source of truth. Neighboring “calculator” sites typically run rules only in the browser or omit full Peruvian concept coverage.

## Operating Context

- **Locale:** Spanish (Peru), currency PEN, formatting consistent with `es-PE`.
- **Workflows:** Empleados → Procesar pago (with live simulation via `POST /pagos/simular`) → Boletas → Dashboard → Configuración; aligned with routes in `frontend/src/routes.tsx`.
- **Development:** Monorepo `backend/` (Express 5, TypeScript, SQLite) + `frontend/` (React 19, Vite 8, React Router 7, Bootstrap 5.3). Root scripts: `npm run install:all`, `dev:backend`, `dev:frontend` (`http://localhost:5173` with API proxy to `:3000`).
- **Course lineage:** README documents Unidades 1–3; current tree is Unidad 3 (React). Earlier units remain in git history for comparison.
- **API contract:** `/api/v1` documented in `README.md` and `docs/nomina-api.postman_collection.json`.

## Capabilities and Constraints

**In scope (implemented):**

- Employee CRUD with filters (cargo, régimen, salary range).
- Payroll calculation and boleta emission; simulation without persist.
- Configuration of RMV, UIT, AFP rates, company data, and related parameters (October 2026 normative baseline in backend).
- Dashboard aggregates (totals, régimen distribution, min/max salary).
- Printable boleta UI; DNI masking on display.
- Input validation: Zod on API; `EntradaInput` + `shared/validators/formularios.ts` on client.

**Explicit constraints:**

- Single-tenant, no authentication or roles in the current build (listed as a future goal in README).
- SQLite file database (`backend/data/nomina.db`)—suitable for SMB/single-machine deployment, not multi-tenant SaaS without further work.
- Business rules are encoded for teaching and SMB use; **not** marketed as certified legal or tax advice.

**Roadmap (confirmed goals, not yet product truth):** JWT auth and protected routes, multi-company, PostgreSQL adapters, OpenAPI, CI with tests and audit, container or static deploy—per README “Próximos pasos”.

**Terminology (preserve):** AFP, ONP, boleta, quinta categoría, gratificación, CTS, EsSalud, RMV, UIT, adelanto quincenal, régimen.

## Brand Commitments

- Product naming in repo/docs: **Nómina — Gestión de Planillas** (`calculadora-de-nomina-planillas` / `nomina-web`).
- **Voice:** Professional Spanish for Peru; plain HR/payroll language, not gimmicky marketing.
- **Visual identity may evolve** (including experiments such as `.taste-skill/direction.json`); future surfaces must keep **product and legal terminology truth**, not a frozen palette from Unidad 1 unless the user later pins one.
- **Do not invent** customer logos, testimonials, compliance badges, or benchmark claims in UI or copy.

## Evidence on Hand

| Asset | Location |
| --- | --- |
| Product and architecture narrative | `README.md` |
| Course weeks 11–14 reference | `Java_Script_Avanzado_Semanas_11_al_14.md` (if present in repo) |
| API collection | `docs/nomina-api.postman_collection.json` |
| Payroll rules implementation | `backend/src/modules/planilla/domain/calculo-planilla.ts` |
| Backend tests | `backend/tests/calculo-planilla.test.ts`, `servicios.test.ts`, `validacion.test.ts` |
| Presentation guide (user context) | `Guia_Exposicion_Unidad_2.md` |

No real customer case studies, press, or third-party endorsements are on file—future marketing must not fabricate them.

## Product Principles

1. **Backend owns payroll math**—clients display and collect; they do not fork calculation logic.
2. **Credibility for HR**—labels, amounts, and flows should match what a Peruvian payroll clerk expects, even when the app is also a course artifact.
3. **Teach by structure**—hexagonal modules, clear routes, and documented API remain valuable; course goals and SMB usability are not mutually exclusive.
4. **Honest scope**—surface what is implemented (single company, no auth) and avoid implying certifications or customers that do not exist.
5. **Evolvable client**—frontend stack may change (Angular → React); preserve user journeys and API contracts unless the user explicitly changes product scope.

## Accessibility & Inclusion

No product-specific WCAG target was confirmed. Default expectation: Bootstrap-based forms and navigation remain keyboard-usable; boleta print styles should remain legible. Establish a formal standard (e.g. WCAG 2.1 AA) only if the user requests it.
