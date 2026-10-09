# LINEAGE — Find. Verify. Protect.
### AI-Powered Medicine Discovery, Inventory Intelligence & Traceability Platform

**LINEAGE** is a full-stack, end-to-end healthcare technology web application built for finding exact prescribed medicines, empowering independent community pharmacies through zero-friction one-tap participation, tracking live stock freshness, coordinating reservations, and enforcing batch-level pharmaceutical quarantine safety.

---

## 🌟 Core Product Differentiators

1. **Exact-Product Discovery First:** Deterministic matching prioritizes exact prescribed brands, strengths, and release formulations. Never silently substitutes another brand.
2. **Zero-Ledger Inclusion for Independent Pharmacies:** Smaller neighborhood chemists participate via mobile **one-tap confirmations** without purchasing electronic inventory software or barcode scanners.
3. **Availability Freshness Transparency:** Clearly distinguishes recently confirmed stock (<4 hours) from stale records (>4 hours) and quarantined batches.
4. **Accountable AI Automation Centre:** 6 specialized AI agents (Packaging OCR, Messy CSV Mapping, Availability Coordination, Inventory Telemetry, Batch Quarantine, Route Batching) bounded by non-negotiable clinical safety gates.
5. **Batch-Level Traceability & Reversible Quarantine:** Simulated regulatory quality advisory immediately suppresses affected lots across all dispensaries while keeping unaffected batches accessible.
6. **Reserve-and-Collect Default:** Built around the natural healthcare workflow, with cost-aware simulated delivery coordination.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on v22.20.0)
- npm 10+

### Installation & Launch
```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Run local development server
npm run dev

# 3. Open in browser
http://localhost:3000
```

### Production Build
```bash
npm run build
npm start
```

---

## 👥 Demo Personas (One-Click Role Switcher)

Switch personas anytime using the persistent **Demo Control Bar** at the top of the screen:

| Role | Persona Name | Title / Assignment | Default Starting Route |
| :--- | :--- | :--- | :--- |
| **Patient** | Sarah Jenkins | Patient / Caregiver | `/search` |
| **Pharmacist** | Dr. Marcus Vance, PharmD | Chief Pharmacist @ St. Jude Apothecary | `/pharmacy/dashboard` |
| **Delivery** | Leo Chen | Logistics Partner (Zone 4) | `/delivery/dashboard` |
| **Platform Admin** | Dr. Elena Rostova | Platform & Quality Director | `/admin/dashboard` |

---

## 🧪 Recommended Judge Demonstration Sequence

### Scenario A: Exact-Brand Discovery vs Alternative Substitution
1. Click **Run Scenario → Scenario A** in the top bar.
2. Observe search query `Augmentin 625 Duo`.
3. Note that **Augmentin 625 Duo Tablet** is highlighted as **Confirmed Exact Match**.
4. Note that **Moxikind-CV 625** (same active chemical ingredient Amoxicillin + Clavulanic Acid 625mg) is placed in the separate **Alternative Brand (Consult Pharmacist)** section and NEVER silently substituted.

### Scenario B: Stale Availability & One-Tap Ping
1. Click **Run Scenario → Scenario B**.
2. Notice **Apex Care 24/7** displays an amber **Needs Confirmation** badge (last confirmed 22 hours ago).
3. Click **Ping Dispensary (Fresh Check)**.
4. Notice immediate feedback banner and audit event logging.

### Scenario C: Blister Strip Photo Identification (AI OCR)
1. Click **Run Scenario → Scenario C** or open the **Scan Package Photo (AI OCR)** tab on `/search`.
2. Click any of the 4 preloaded interactive blister strip mockups (e.g. *Augmentin 625 Duo* or *Lipitor 20mg*).
3. Watch **Agent 1** extract typography and return a confidence rating (~96%).
4. Verify the mandatory **Human Confirmation Safety Gate** before querying live pharmacy stock.

### Scenario D: Reserve-and-Collect Counter Pickup
1. Click **Reserve & Collect** on St. Jude Apothecary for Augmentin 625 Duo.
2. Confirm the reservation to view the order tracking screen (`/orders/[id]`).
3. Note the secure counter verification PIN (e.g. `LIN-772`) and pickup bay allocation.
4. Switch role to **Pharmacist** (`/pharmacy/reservations`), enter `LIN-772` in the verification box, and watch the celebratory handoff completion!

### Scenario E: Delivery Coordination & Rider Simulation
1. Switch role to **Delivery Rider** (`/delivery/dashboard`).
2. Inspect active job `DEL-801` with route distance and payout.
3. Open `/delivery/jobs/DEL-801` to view the live simulated GPS courier tracker map.
4. Advance the delivery status from Store Pickup → Out for Delivery → Doorstep PIN verification.

### Scenario F: Batch Restriction & Quarantine Simulation
1. Switch role to **Platform Admin** (`/admin/restrictions`).
2. Select Batch `BAT-AUG-2024-881` and click **Trigger Simulated Batch Quarantine**.
3. Confirm the modal.
4. Notice that:
   - Stock at St. Jude and Apex Care tied to Lot 881 is immediately suppressed from search.
   - Beacon Health's stock of Augmentin under Lot `BAT-AUG-2024-912` remains completely safe and available!
   - Pharmacy dashboards receive a high-priority advisory banner.
5. Click **Lift Simulated Quarantine** to verify complete reversibility.

### Scenario G: Messy CSV Inventory Ingestion
1. Switch role to **Pharmacist** and navigate to `/pharmacy/import`.
2. Click **Load Sample Messy CSV**.
3. Notice **Agent 2** auto-detects inconsistent headers (`LOT_NUMBER`, `ON_HAND_STOCK`, `EXP_DT`).
4. Review confidence scores in Step 3 and commit items directly into the live dispensary inventory.

### Scenario H: Zero-Ledger Independent Pharmacy Mode
1. Switch role to **Pharmacist** and select **Greenfield Family Pharmacy**.
2. Notice that Greenfield operates with **Zero Digital Ledger** (`quantity: null`).
3. It confirms incoming pings in 1 second via one-tap buttons without tracking complex electronic stock sheets.

---

## 🗺️ Application Architecture

```
src/
├── app/
│   ├── page.tsx                           # Public landing page with principles & hero demo
│   ├── search/page.tsx                    # Patient medicine discovery, exact match & map
│   ├── medicine/[id]/page.tsx             # Canonical product specs & batch history
│   ├── pharmacies/page.tsx                # Dispensary network directory & leaflet map
│   ├── requests/page.tsx                  # Patient availability pings & responses
│   ├── reservations/page.tsx              # Patient orders list & status badges
│   ├── orders/[id]/page.tsx               # Order tracker, verification PIN & GPS map
│   ├── profile/page.tsx                   # Patient locality preferences
│   ├── pharmacy/
│   │   ├── dashboard/page.tsx             # Dispensary rapid response terminal
│   │   ├── requests/page.tsx              # Counter ping queue with one-tap cards
│   │   ├── inventory/page.tsx             # Live stock ledger & freshness status
│   │   ├── reservations/page.tsx          # Counter pickup bay & PIN verification
│   │   ├── batches/page.tsx               # Batch shelf-life & quarantine alerts
│   │   ├── import/page.tsx                # Messy CSV import wizard (4-step)
│   │   ├── analytics/page.tsx             # Response speed & conversion metrics (Recharts)
│   │   └── onboard/page.tsx               # 3-minute low-friction onboarding
│   ├── delivery/
│   │   ├── dashboard/page.tsx             # Delivery pool & batching recommendations
│   │   └── jobs/[id]/page.tsx             # Rider job execution & doorstep check
│   └── admin/
│       ├── dashboard/page.tsx             # Platform overview & weekly telemetry
│       ├── pharmacies/page.tsx            # Pharmacy network activation controls
│       ├── products/page.tsx              # Canonical catalogue & alias governance
│       ├── restrictions/page.tsx          # Batch quarantine simulation engine
│       ├── agents/page.tsx                # AI Agent Centre (6 transparent agents)
│       └── audit/page.tsx                 # Immutable audit trail
├── components/
│   ├── common/                            # Logo, Navbar, Footer, DemoControlBar, Badges
│   ├── patient/                           # SearchBar, ExactMatchCard, ImageOcrUploader, Modal
│   ├── pharmacy/                          # OneTapResponseCard
│   ├── map/                               # InteractivePharmacyMap, DeliveryTrackerMap
│   └── admin/                             # AgentCard
└── lib/
    ├── data/seedData.ts                   # Seeded canonical products, pharmacies, batches
    ├── state/                             # LineageContext & localStorage persistent store
    ├── types/                             # Domain TypeScript contracts
    └── utils/                             # matchingEngine, ocrEngine, csvParser
```

---

## 🛡️ Trust & Safety Disclaimer
*LINEAGE is an interactive software demonstration developed for hackathon evaluation. Seeded pharmaceuticals, batch numbers, pharmacy coordinates, stock levels, and recall simulations are illustrative demonstration assets and do not constitute clinical guidance or official regulatory actions.*
