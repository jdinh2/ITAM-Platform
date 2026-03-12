# ITAM Platform — v1.247 (Phase 1 + Phase 2)

## Extracted Modules

| Module | Phase | Contents |
|--------|-------|----------|
| `src/features/cases/domain.js` | 1 | `CLOSED_CASE_STATUSES`, `CASE_TRANSITIONS` (direct); `CASE_TYPES`, `CASE_STATUS`, `isAllowedTransition`, `transitionValidation` via `createCaseDomain(C)` |
| `src/features/cases/shipping.js` | 1 | `NULL_SHIP_*`, `getTracking`, `getShipAddress`, `mkAddress`, `mkShipLeg`, enum constants, `NULL_SHIPMENT`, `mockTrackingNumber` |
| `src/features/cases/actions.js` | 2 | Pure: `buildRefreshExecutionFields`, `buildReturnIntakeFields`, `isReturnIntakeCase`, `canProcessReturnReceived`, `canCompleteReturnIntake`. Stateful via `createCaseActions(deps)`: all workflow action helpers |

## Running

```bash
npm install && npm run dev
```
