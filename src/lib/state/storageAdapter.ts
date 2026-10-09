import {
  MedicineProduct,
  Pharmacy,
  Batch,
  InventoryRecord,
  AvailabilityRequest,
  Reservation,
  DeliveryJob,
  RestrictionEvent,
  AgentExecution,
  AuditEvent,
  DemoPersona
} from "../types";
import {
  SEEDED_PRODUCTS,
  SEEDED_PHARMACIES,
  SEEDED_BATCHES,
  SEEDED_INVENTORY,
  SEEDED_RESERVATIONS,
  SEEDED_DELIVERY_JOBS,
  SEEDED_AVAILABILITY_REQUESTS,
  SEEDED_AGENT_EXECUTIONS,
  SEEDED_AUDIT_EVENTS,
  DEMO_PERSONAS,
  DEMO_USER_LOCATION
} from "../data/seedData";

export interface LineageState {
  version: number;
  currentPersona: DemoPersona;
  userLocation: { label: string; lat: number; lng: number; address: string };
  products: MedicineProduct[];
  pharmacies: Pharmacy[];
  batches: Batch[];
  inventory: InventoryRecord[];
  availabilityRequests: AvailabilityRequest[];
  reservations: Reservation[];
  deliveryJobs: DeliveryJob[];
  restrictionEvents: RestrictionEvent[];
  agentExecutions: AgentExecution[];
  auditEvents: AuditEvent[];
  activeScenarioNotice: string | null;
}

const STORAGE_KEY = "lineage_app_state_v2";

export function getInitialDefaultState(): LineageState {
  return {
    version: 2,
    currentPersona: DEMO_PERSONAS[0], // Patient by default
    userLocation: DEMO_USER_LOCATION,
    products: JSON.parse(JSON.stringify(SEEDED_PRODUCTS)),
    pharmacies: JSON.parse(JSON.stringify(SEEDED_PHARMACIES)),
    batches: JSON.parse(JSON.stringify(SEEDED_BATCHES)),
    inventory: JSON.parse(JSON.stringify(SEEDED_INVENTORY)),
    availabilityRequests: JSON.parse(JSON.stringify(SEEDED_AVAILABILITY_REQUESTS)),
    reservations: JSON.parse(JSON.stringify(SEEDED_RESERVATIONS)),
    deliveryJobs: JSON.parse(JSON.stringify(SEEDED_DELIVERY_JOBS)),
    restrictionEvents: [],
    agentExecutions: JSON.parse(JSON.stringify(SEEDED_AGENT_EXECUTIONS)),
    auditEvents: JSON.parse(JSON.stringify(SEEDED_AUDIT_EVENTS)),
    activeScenarioNotice: null
  };
}

export function loadPersistedState(): LineageState {
  if (typeof window === "undefined") {
    return getInitialDefaultState();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getInitialDefaultState();
    const parsed = JSON.parse(raw);
    if (parsed.version !== 2) {
      localStorage.removeItem(STORAGE_KEY);
      return getInitialDefaultState();
    }
    return parsed;
  } catch (err) {
    console.warn("Could not parse persisted Lineage state, returning initial default.", err);
    return getInitialDefaultState();
  }
}

export function savePersistedState(state: LineageState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error("Failed to save Lineage state to localStorage", err);
  }
}

export function clearPersistedState(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error("Failed to clear Lineage state", err);
  }
}
