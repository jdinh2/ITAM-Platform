# ITAM Platform

Enterprise IT Asset Management platform built with React + Vite.

## Modules

| Module | Status | Description |
|--------|--------|-------------|
| **Asset Registry** | ✅ Live | System of record for all IT assets. 14 sample assets, 9 statuses, 20 toggleable columns, sortable table, search, status filters, detail drawer with audit history. |
| **Refresh Operations** | ✅ Live | Command Center, Refresh Queue, Returns Queue, Technician Dashboard. 8 refresh cases across the full workflow lifecycle. |
| **Wave Planner** | ✅ Live | 22 office refresh waves from 2026 planning data. Quarterly breakdowns, progress tracking, risk/blocker alerts, inventory demand estimates, linked refresh cases. |
| **Inventory** | ✅ Live | 44 SKUs from AMS warehouse data. Stock overview with low-stock alerts, type filters, sortable table. Booking Request workflow with 7-status lifecycle, approval actions, and a new booking form. |
| **Procurement** | ✅ Live | 24 purchase orders from SHI Sell Thru Detail (978 source lines). Line-level detail, vendor spend breakdown, order status tracking, wave/inventory cross-links. |
| **Audit History** | 🔲 Planned | Placeholder |
| **Admin** | 🔲 Planned | Placeholder |

## Data Sources

- **Inventory**: `AMS_Available_Inventory_06-Mar-2026.csv` — warehouse stock with JSON-encoded quantities
- **Refresh Planning**: `2026_Refresh_Plan_Enhanced_v4.xlsx` — Location Summary sheet for wave data
- **Procurement**: `SHI_Sales_Jan_-_Feb.xlsx` — Sell Thru Detail with 978 line items grouped into POs
- **Procurement Summary**: `Amwins_IT_Procurement_Summary_FINAL.xlsx` — executive summary and anomaly flags

## Quick Start

```bash
npm install
npm run dev
```

Opens at `http://localhost:3000`.

## Architecture

Single-file React component (`src/App.jsx`) containing all modules. Each module is a self-contained function component rendered conditionally based on sidebar navigation state.

### Platform Shell
- Sidebar navigation with expandable sub-pages
- Context-aware header with breadcrumbs
- Toast notification system
- Shared design tokens, KPI cards, status chips, section headers

### Design Language
- **Fonts**: Geist + Geist Mono
- **Palette**: Warm neutral with surgical accent colors per status
- **Density**: Bloomberg-terminal-meets-Notion — dense information, zero noise
- **Pattern**: KPI cards → filter bar → sortable table → slide-out detail drawer

## Build

```bash
npm run build    # outputs to dist/
npm run preview  # preview production build
```

## License

Internal use only — Amwins Group IT.

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
