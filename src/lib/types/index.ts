export type Role = "PATIENT" | "PHARMACIST" | "DELIVERY" | "ADMIN";

export type ParticipationMode = "ONE_TAP_REQUEST" | "CSV_IMPORT" | "CONNECTED_LEDGER";

export type VerificationStatus = "VERIFIED" | "PENDING_AUDIT";

export type FreshnessCategory =
  | "RECENTLY_CONFIRMED"  // Confirmed within freshness window (<4 hours)
  | "NEEDS_CONFIRMATION"   // Older than freshness window (stale)
  | "UNAVAILABLE"          // Confirmed out of stock
  | "RESTRICTED";          // Batch-level quarantine or administrative block

export type AvailabilityStatus =
  | "AVAILABLE"
  | "LOW_STOCK"
  | "OUT_OF_STOCK"
  | "NEEDS_CONFIRMATION"
  | "RESTRICTED";

export type FulfillmentType = "PICKUP" | "DELIVERY";

export type ReservationStatus =
  | "REQUEST_SUBMITTED"
  | "AWAITING_CONFIRMATION"
  | "CONFIRMED"
  | "READY_FOR_COLLECTION"
  | "DELIVERY_REQUESTED"
  | "DELIVERY_ASSIGNED"
  | "PICKED_UP"

  | "OUT_FOR_DELIVERY"
  | "COMPLETED"
  | "CANCELLED"
  | "REJECTED"
  | "EXPIRED";

export type DeliveryJobStatus =
  | "AVAILABLE"
  | "ASSIGNED"
  | "EN_ROUTE_PICKUP"
  | "PICKED_UP"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export type BatchStatus = "ACTIVE" | "RESTRICTED_QUARANTINE" | "EXPIRED";

export interface MedicineProduct {
  id: string;
  brandName: string;
  genericName: string;
  strength: string; // e.g. "625 mg"
  dosageForm: "Tablet" | "Capsule" | "Syrup" | "Suspension" | "Injection" | "Inhaler" | "Cream" | "Drops";
  releaseFormulation: "Immediate Release" | "Sustained Release" | "Extended Release" | "Dual Release" | "Standard";
  manufacturer: string;
  marketer: string;
  packaging: string; // e.g. "Strip of 10 tablets"
  atcCode: string;
  barcode: string;
  aliases: string[];
  description: string;
  category: "Antibiotic" | "Cardiovascular" | "Antidiabetic" | "Analgesic" | "Respiratory" | "Gastrointestinal";
  prescriptionRequired: boolean;
  storageCondition: string;
  referencePrice: number;
}

export interface Pharmacy {
  id: string;
  name: string;
  licenseNumber: string;
  pharmacistInCharge: string;
  phone: string;
  email: string;
  address: string;
  locality: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  operatingHours: string;
  isOpen: boolean;
  participationMode: ParticipationMode;
  verificationStatus: VerificationStatus;
  fulfillmentMethods: FulfillmentType[];
  rating: number;
  reviewsCount: number;
  responseTimeAvgMinutes: number;
  deliveryRadiusKm: number;
  deliveryFeeBase: number;
  isActive: boolean;
}

export interface Batch {
  id: string;
  productId: string;
  batchNumber: string;
  manufacturer: string;
  manufacturingDate: string; // YYYY-MM
  expiryDate: string;        // YYYY-MM
  initialUnits: number;
  status: BatchStatus;
  restrictionReason?: string;
  restrictedAt?: string;
  restrictedBy?: string;
}

export interface InventoryRecord {
  id: string;
  pharmacyId: string;
  productId: string;
  batchId?: string;
  quantity: number | null; // null represents unquantified low-friction inventory
  reservedQuantity: number;
  availabilityStatus: AvailabilityStatus;
  sellingPrice: number;
  lastConfirmedAt: string; // ISO
  lastUpdatedAt: string;
  updateSource: "MANUAL_ONE_TAP" | "CSV_IMPORT" | "API_SYNC" | "PATIENT_PING_CONFIRMED";
  freshnessCategory: FreshnessCategory;
  confidenceScore: number; // 0 - 100
}

export interface PharmacyResponse {
  pharmacyId: string;
  status: "CONFIRMED_AVAILABLE" | "UNAVAILABLE" | "NEEDS_PHYSICAL_CHECK";
  confirmedPrice?: number;
  confirmedAt: string;
  notes?: string;
  availableQuantityEstimate?: string;
}

export interface AvailabilityRequest {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  productId: string;
  targetPharmacyIds: string[];
  createdAt: string;
  status: "OPEN" | "FULFILLED" | "EXPIRED";
  responses: PharmacyResponse[];
}

export interface StatusHistoryItem {
  status: ReservationStatus;
  timestamp: string;
  note: string;
  actor: string;
}

export interface Reservation {
  id: string; // e.g. "ORD-9428"
  patientId: string;
  patientName: string;
  patientPhone: string;
  pharmacyId: string;
  productId: string;
  batchId?: string;
  quantity: number;
  unitPrice: number;
  fulfillmentType: FulfillmentType;
  status: ReservationStatus;
  deliveryAddress?: string;
  deliveryNotes?: string;
  deliveryFee?: number;
  deliveryJobId?: string;
  verificationCode: string; // e.g. "LIN-772"
  createdAt: string;
  updatedAt: string;
  statusHistory: StatusHistoryItem[];
}

export interface DeliveryJob {
  id: string;
  orderId: string;
  pharmacyId: string;
  patientName: string;
  patientPhone: string;
  pickupAddress: string;
  dropoffAddress: string;
  distanceKm: number;
  estimatedTimeMinutes: number;
  payout: number;
  status: DeliveryJobStatus;
  riderName?: string;
  riderPhone?: string;
  currentLocation?: { lat: number; lng: number };
  batchGroupId?: string; // For grouped batching
  createdAt: string;
  updatedAt: string;
}

export interface RestrictionEvent {
  id: string;
  batchId: string;
  batchNumber: string;
  productId: string;
  productName: string;
  severity: "CRITICAL_QUARANTINE" | "QUALITY_NOTICE";
  reason: string;
  issuedBy: string;
  issuedAt: string;
  affectedPharmaciesCount: number;
  affectedInventoryCount: number;
  isActive: boolean;
  unrestrictedAt?: string;
}

export interface AgentExecution {
  id: string;
  agentId:
  | "AGENT_1_OCR"
  | "AGENT_2_IMPORT"
  | "AGENT_3_AVAILABILITY"
  | "AGENT_4_INTELLIGENCE"
  | "AGENT_5_TRACEABILITY"
  | "AGENT_6_FULFILLMENT";
  agentName: string;
  trigger: string;
  timestamp: string;
  status: "SUCCESS" | "NEEDS_HUMAN_APPROVAL" | "WARNING" | "RUNNING";
  inputSummary: string;
  outputSummary: string;
  confidenceScore?: number;
  auditNote: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  action: string;
  entityType: "PRODUCT" | "INVENTORY" | "RESERVATION" | "RESTRICTION" | "IMPORT" | "AGENT" | "DELIVERY";
  entityId: string;
  actor: string;
  role: Role | "SYSTEM_AGENT";
  details: string;
}

export interface DemoPersona {
  role: Role;
  name: string;
  title: string;
  subtitle: string;
  pharmacyId?: string; // if role === 'PHARMACIST'
  avatarColor: string;
}

export interface MatchResult {
  exactMatch: boolean;
  matchReason: string;
  product: MedicineProduct;
  differenceType?: "BRAND_ONLY" | "STRENGTH_MISMATCH" | "FORMULATION_MISMATCH" | "NONE";
}
