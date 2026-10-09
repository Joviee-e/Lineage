"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import {
  LineageState,
  loadPersistedState,
  savePersistedState,
  getInitialDefaultState,
  clearPersistedState
} from "./storageAdapter";
import {
  Role,
  DemoPersona,
  ReservationStatus,
  DeliveryJobStatus,
  AvailabilityStatus,
  BatchStatus,
  Reservation,
  DeliveryJob,
  AuditEvent,
  AgentExecution,
  RestrictionEvent,
  InventoryRecord,
  MedicineProduct,
  Pharmacy
} from "../types";
import { DEMO_PERSONAS } from "../data/seedData";

interface LineageContextType extends LineageState {
  isInitialized: boolean;
  switchPersona: (role: Role, pharmacyId?: string) => void;
  resetDemoData: () => void;
  setUserLocation: (loc: { label: string; lat: number; lng: number; address: string }) => void;
  setScenarioNotice: (notice: string | null) => void;
  
  // Patient Actions
  requestAvailability: (productId: string, pharmacyIds: string[]) => string;
  createReservation: (params: {
    patientName: string;
    patientPhone: string;
    pharmacyId: string;
    productId: string;
    batchId?: string;
    quantity: number;
    fulfillmentType: "PICKUP" | "DELIVERY";
    deliveryAddress?: string;
    deliveryNotes?: string;
    deliveryFee?: number;
  }) => Reservation;
  cancelReservation: (reservationId: string, reason: string) => void;

  // Pharmacy Actions
  respondToAvailability: (
    requestId: string,
    pharmacyId: string,
    status: "CONFIRMED_AVAILABLE" | "UNAVAILABLE" | "NEEDS_PHYSICAL_CHECK",
    price?: number,
    notes?: string
  ) => void;
  updateReservationStatus: (
    reservationId: string,
    newStatus: ReservationStatus,
    note?: string
  ) => void;
  updateInventoryItem: (inventoryId: string, updates: Partial<InventoryRecord>) => void;
  importCsvInventory: (
    pharmacyId: string,
    items: Array<{
      productId: string;
      quantity: number | null;
      sellingPrice?: number;
      batchNumber?: string;
      expiryDate?: string;
    }>
  ) => { importedCount: number; batchCreatedCount: number };
  
  // Delivery Actions
  updateDeliveryJobStatus: (jobId: string, newStatus: DeliveryJobStatus) => void;

  // Admin Actions
  triggerBatchRestriction: (
    batchId: string,
    reason: string,
    severity?: "CRITICAL_QUARANTINE" | "QUALITY_NOTICE"
  ) => RestrictionEvent | null;
  liftBatchRestriction: (batchId: string) => void;
  togglePharmacyActive: (pharmacyId: string) => void;
  addOrUpdateProductAlias: (productId: string, newAlias: string) => void;

  // AI & Audit Logging
  recordAgentExecution: (execution: Omit<AgentExecution, "id" | "timestamp">) => void;
  addAuditEvent: (event: Omit<AuditEvent, "id" | "timestamp">) => void;

  // Helpers
  getPharmacyById: (id: string) => Pharmacy | undefined;
  getProductById: (id: string) => MedicineProduct | undefined;
  getBatchById: (id: string) => import("../types").Batch | undefined;
}

const LineageContext = createContext<LineageContextType | undefined>(undefined);

export function LineageProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<LineageState>(getInitialDefaultState);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const loaded = loadPersistedState();
    setState(loaded);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      savePersistedState(state);
    }
  }, [state, isInitialized]);

  const switchPersona = (role: Role, pharmacyId?: string) => {
    const found = DEMO_PERSONAS.find(p => p.role === role);
    if (!found) return;
    const persona = { ...found, ...(pharmacyId ? { pharmacyId } : {}) };
    setState(prev => ({
      ...prev,
      currentPersona: persona
    }));
  };

  const resetDemoData = () => {
    clearPersistedState();
    const fresh = getInitialDefaultState();
    setState(fresh);
    savePersistedState(fresh);
  };

  const setUserLocation = (loc: { label: string; lat: number; lng: number; address: string }) => {
    setState(prev => ({ ...prev, userLocation: loc }));
  };

  const setScenarioNotice = (notice: string | null) => {
    setState(prev => ({ ...prev, activeScenarioNotice: notice }));
  };

  const addAuditEvent = (event: Omit<AuditEvent, "id" | "timestamp">) => {
    const newEvent: AuditEvent = {
      ...event,
      id: `aud-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString()
    };
    setState(prev => ({
      ...prev,
      auditEvents: [newEvent, ...prev.auditEvents]
    }));
  };

  const recordAgentExecution = (execution: Omit<AgentExecution, "id" | "timestamp">) => {
    const newExec: AgentExecution = {
      ...execution,
      id: `exec-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString()
    };
    setState(prev => ({
      ...prev,
      agentExecutions: [newExec, ...prev.agentExecutions]
    }));
  };

  const requestAvailability = (productId: string, pharmacyIds: string[]): string => {
    const reqId = `req-${Date.now().toString(36)}`;
    const newRequest = {
      id: reqId,
      patientId: state.currentPersona.role === "PATIENT" ? "patient-sarah" : "patient-anon",
      patientName: state.currentPersona.name,
      patientPhone: "+1 (555) 782-1920",
      productId,
      targetPharmacyIds: pharmacyIds,
      createdAt: new Date().toISOString(),
      status: "OPEN" as const,
      responses: []
    };

    setState(prev => ({
      ...prev,
      availabilityRequests: [newRequest, ...prev.availabilityRequests]
    }));

    addAuditEvent({
      action: "AVAILABILITY_BROADCAST",
      entityType: "PRODUCT",
      entityId: productId,
      actor: state.currentPersona.name,
      role: state.currentPersona.role,
      details: `Dispatched availability check to ${pharmacyIds.length} pharmacies.`
    });

    recordAgentExecution({
      agentId: "AGENT_3_AVAILABILITY",
      agentName: "Availability Coordination Agent",
      trigger: `Broadcast ping for product: ${productId}`,
      status: "SUCCESS",
      inputSummary: `Broadcast sent to ${pharmacyIds.length} nearby pharmacy dispensaries`,
      outputSummary: "Awaiting pharmacist one-tap confirmation pings.",
      confidenceScore: 99,
      auditNote: "Dispatched without disclosing patient identity to unrelated parties."
    });

    return reqId;
  };

  const respondToAvailability = (
    requestId: string,
    pharmacyId: string,
    status: "CONFIRMED_AVAILABLE" | "UNAVAILABLE" | "NEEDS_PHYSICAL_CHECK",
    price?: number,
    notes?: string
  ) => {
    setState(prev => {
      const updatedRequests = prev.availabilityRequests.map(req => {
        if (req.id !== requestId) return req;
        const filteredResponses = req.responses.filter(r => r.pharmacyId !== pharmacyId);
        return {
          ...req,
          responses: [
            ...filteredResponses,
            {
              pharmacyId,
              status,
              confirmedPrice: price,
              confirmedAt: new Date().toISOString(),
              notes
            }
          ]
        };
      });

      // Also update inventory record freshness
      const targetReq = prev.availabilityRequests.find(r => r.id === requestId);
      let updatedInventory = prev.inventory;
      if (targetReq) {
        updatedInventory = prev.inventory.map(inv => {
          if (inv.pharmacyId === pharmacyId && inv.productId === targetReq.productId) {
            return {
              ...inv,
              lastConfirmedAt: new Date().toISOString(),
              freshnessCategory: status === "CONFIRMED_AVAILABLE" ? "RECENTLY_CONFIRMED" : "UNAVAILABLE",
              availabilityStatus: status === "CONFIRMED_AVAILABLE" ? "AVAILABLE" : "OUT_OF_STOCK",
              sellingPrice: price !== undefined ? price : inv.sellingPrice,
              updateSource: "PATIENT_PING_CONFIRMED"
            };
          }
          return inv;
        });
      }

      return {
        ...prev,
        availabilityRequests: updatedRequests,
        inventory: updatedInventory
      };
    });

    const pharmacy = state.pharmacies.find(p => p.id === pharmacyId);
    addAuditEvent({
      action: "STOCK_CONFIRMATION_RESPONSE",
      entityType: "INVENTORY",
      entityId: requestId,
      actor: pharmacy ? pharmacy.pharmacistInCharge : "Pharmacist",
      role: "PHARMACIST",
      details: `One-tap response: ${status} ${price ? `($${price.toFixed(2)})` : ""}`
    });
  };

  const createReservation = (params: {
    patientName: string;
    patientPhone: string;
    pharmacyId: string;
    productId: string;
    batchId?: string;
    quantity: number;
    fulfillmentType: "PICKUP" | "DELIVERY";
    deliveryAddress?: string;
    deliveryNotes?: string;
    deliveryFee?: number;
  }): Reservation => {
    const reservationId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const verificationCode = `LIN-${Math.floor(100 + Math.random() * 900)}`;
    const product = state.products.find(p => p.id === params.productId);
    const unitPrice = product ? product.referencePrice : 15.00;

    let deliveryJobId: string | undefined;
    if (params.fulfillmentType === "DELIVERY") {
      deliveryJobId = `DEL-${Math.floor(100 + Math.random() * 900)}`;
    }

    const newReservation: Reservation = {
      id: reservationId,
      patientId: "patient-sarah",
      patientName: params.patientName,
      patientPhone: params.patientPhone,
      pharmacyId: params.pharmacyId,
      productId: params.productId,
      batchId: params.batchId,
      quantity: params.quantity,
      unitPrice,
      fulfillmentType: params.fulfillmentType,
      status: "REQUEST_SUBMITTED",
      deliveryAddress: params.deliveryAddress,
      deliveryNotes: params.deliveryNotes,
      deliveryFee: params.deliveryFee,
      deliveryJobId,
      verificationCode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statusHistory: [
        {
          status: "REQUEST_SUBMITTED",
          timestamp: new Date().toISOString(),
          note: `Reservation submitted (${params.fulfillmentType})`,
          actor: `${params.patientName} (Patient)`
        }
      ]
    };

    // Update state: Add reservation, hold stock (increment reservedQuantity), create delivery job if delivery
    setState(prev => {
      const updatedInventory = prev.inventory.map(inv => {
        if (inv.pharmacyId === params.pharmacyId && inv.productId === params.productId) {
          return {
            ...inv,
            reservedQuantity: inv.reservedQuantity + params.quantity
          };
        }
        return inv;
      });

      let updatedJobs = prev.deliveryJobs;
      if (params.fulfillmentType === "DELIVERY" && deliveryJobId) {
        const pharmacy = prev.pharmacies.find(p => p.id === params.pharmacyId);
        const newJob: DeliveryJob = {
          id: deliveryJobId,
          orderId: reservationId,
          pharmacyId: params.pharmacyId,
          patientName: params.patientName,
          patientPhone: params.patientPhone,
          pickupAddress: pharmacy ? pharmacy.address : "Pharmacy Dispensary",
          dropoffAddress: params.deliveryAddress || "Patient Delivery Address",
          distanceKm: 1.8,
          estimatedTimeMinutes: 20,
          payout: (params.deliveryFee || 3.50) + 1.00,
          status: "AVAILABLE",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        updatedJobs = [newJob, ...prev.deliveryJobs];
      }

      return {
        ...prev,
        reservations: [newReservation, ...prev.reservations],
        inventory: updatedInventory,
        deliveryJobs: updatedJobs
      };
    });

    addAuditEvent({
      action: "RESERVATION_CREATED",
      entityType: "RESERVATION",
      entityId: reservationId,
      actor: params.patientName,
      role: "PATIENT",
      details: `Created reservation for ${product?.brandName || "medicine"} (${params.fulfillmentType}). Stock held: ${params.quantity}.`
    });

    return newReservation;
  };

  const updateReservationStatus = (
    reservationId: string,
    newStatus: ReservationStatus,
    note?: string
  ) => {
    setState(prev => {
      let targetReservation: Reservation | undefined;
      const updatedReservations = prev.reservations.map(res => {
        if (res.id !== reservationId) return res;
        targetReservation = res;
        const newHistoryItem = {
          status: newStatus,
          timestamp: new Date().toISOString(),
          note: note || `Status updated to ${newStatus}`,
          actor: `${prev.currentPersona.name} (${prev.currentPersona.title})`
        };
        return {
          ...res,
          status: newStatus,
          updatedAt: new Date().toISOString(),
          statusHistory: [...res.statusHistory, newHistoryItem]
        };
      });

      // Handle inventory hold releases if completed or rejected/cancelled
      let updatedInventory = prev.inventory;
      if (targetReservation) {
        if (newStatus === "COMPLETED") {
          // Decrement physical quantity and release reserve
          updatedInventory = prev.inventory.map(inv => {
            if (inv.pharmacyId === targetReservation!.pharmacyId && inv.productId === targetReservation!.productId) {
              const newQty = inv.quantity !== null ? Math.max(0, inv.quantity - targetReservation!.quantity) : null;
              const newReserved = Math.max(0, inv.reservedQuantity - targetReservation!.quantity);
              return {
                ...inv,
                quantity: newQty,
                reservedQuantity: newReserved
              };
            }
            return inv;
          });
        } else if (newStatus === "CANCELLED" || newStatus === "REJECTED" || newStatus === "EXPIRED") {
          // Release reserved hold
          updatedInventory = prev.inventory.map(inv => {
            if (inv.pharmacyId === targetReservation!.pharmacyId && inv.productId === targetReservation!.productId) {
              return {
                ...inv,
                reservedQuantity: Math.max(0, inv.reservedQuantity - targetReservation!.quantity)
              };
            }
            return inv;
          });
        }
      }

      // If tied to delivery job, update delivery job
      let updatedJobs = prev.deliveryJobs;
      if (targetReservation && targetReservation.deliveryJobId) {
        if (newStatus === "COMPLETED") {
          updatedJobs = prev.deliveryJobs.map(j => 
            j.id === targetReservation!.deliveryJobId ? { ...j, status: "DELIVERED", updatedAt: new Date().toISOString() } : j
          );
        } else if (newStatus === "CANCELLED") {
          updatedJobs = prev.deliveryJobs.map(j => 
            j.id === targetReservation!.deliveryJobId ? { ...j, status: "CANCELLED", updatedAt: new Date().toISOString() } : j
          );
        }
      }

      return {
        ...prev,
        reservations: updatedReservations,
        inventory: updatedInventory,
        deliveryJobs: updatedJobs
      };
    });

    addAuditEvent({
      action: "ORDER_STATUS_CHANGED",
      entityType: "RESERVATION",
      entityId: reservationId,
      actor: state.currentPersona.name,
      role: state.currentPersona.role,
      details: `Order status moved to '${newStatus}'. ${note || ""}`
    });
  };

  const cancelReservation = (reservationId: string, reason: string) => {
    updateReservationStatus(reservationId, "CANCELLED", `Cancelled by user: ${reason}`);
  };

  const updateDeliveryJobStatus = (jobId: string, newStatus: DeliveryJobStatus) => {
    setState(prev => {
      let linkedOrderId: string | undefined;
      const updatedJobs = prev.deliveryJobs.map(job => {
        if (job.id !== jobId) return job;
        linkedOrderId = job.orderId;
        return {
          ...job,
          status: newStatus,
          riderName: prev.currentPersona.role === "DELIVERY" ? prev.currentPersona.name : job.riderName,
          updatedAt: new Date().toISOString()
        };
      });

      // Synchronize back with reservation
      let updatedReservations = prev.reservations;
      if (linkedOrderId) {
        let matchingReservationStatus: ReservationStatus | undefined;
        if (newStatus === "PICKED_UP") matchingReservationStatus = "PICKED_UP";
        else if (newStatus === "OUT_FOR_DELIVERY") matchingReservationStatus = "OUT_FOR_DELIVERY";
        else if (newStatus === "DELIVERED") matchingReservationStatus = "COMPLETED";

        if (matchingReservationStatus) {
          updatedReservations = prev.reservations.map(res => {
            if (res.id !== linkedOrderId) return res;
            return {
              ...res,
              status: matchingReservationStatus!,
              updatedAt: new Date().toISOString(),
              statusHistory: [
                ...res.statusHistory,
                {
                  status: matchingReservationStatus!,
                  timestamp: new Date().toISOString(),
                  note: `Delivery rider progressed job to ${newStatus}`,
                  actor: prev.currentPersona.name
                }
              ]
            };
          });
        }
      }

      return {
        ...prev,
        deliveryJobs: updatedJobs,
        reservations: updatedReservations
      };
    });

    addAuditEvent({
      action: "DELIVERY_STEP_UPDATED",
      entityType: "DELIVERY",
      entityId: jobId,
      actor: state.currentPersona.name,
      role: state.currentPersona.role,
      details: `Delivery job ${jobId} transitioned to ${newStatus}`
    });
  };

  const triggerBatchRestriction = (
    batchId: string,
    reason: string,
    severity: "CRITICAL_QUARANTINE" | "QUALITY_NOTICE" = "CRITICAL_QUARANTINE"
  ): RestrictionEvent | null => {
    const targetBatch = state.batches.find(b => b.id === batchId);
    if (!targetBatch) return null;

    const targetProduct = state.products.find(p => p.id === targetBatch.productId);
    const affectedInventory = state.inventory.filter(inv => inv.batchId === batchId);
    const affectedPharmacies = new Set(affectedInventory.map(i => i.pharmacyId));

    const newEvent: RestrictionEvent = {
      id: `rest-${Date.now().toString(36)}`,
      batchId: targetBatch.id,
      batchNumber: targetBatch.batchNumber,
      productId: targetBatch.productId,
      productName: targetProduct?.brandName || "Pharmaceutical Product",
      severity,
      reason,
      issuedBy: `${state.currentPersona.name} (${state.currentPersona.title})`,
      issuedAt: new Date().toISOString(),
      affectedPharmaciesCount: affectedPharmacies.size,
      affectedInventoryCount: affectedInventory.length,
      isActive: true
    };

    setState(prev => {
      // 1. Update batch status
      const updatedBatches = prev.batches.map(b => 
        b.id === batchId ? { ...b, status: "RESTRICTED_QUARANTINE" as BatchStatus, restrictionReason: reason, restrictedAt: new Date().toISOString(), restrictedBy: prev.currentPersona.name } : b
      );

      // 2. Quarantine inventory records
      const updatedInventory = prev.inventory.map(inv => {
        if (inv.batchId === batchId) {
          return {
            ...inv,
            availabilityStatus: "RESTRICTED" as AvailabilityStatus,
            freshnessCategory: "RESTRICTED" as const,
            lastUpdatedAt: new Date().toISOString()
          };
        }
        return inv;
      });

      return {
        ...prev,
        batches: updatedBatches,
        inventory: updatedInventory,
        restrictionEvents: [newEvent, ...prev.restrictionEvents]
      };
    });

    addAuditEvent({
      action: "BATCH_RESTRICTION_TRIGGERED",
      entityType: "RESTRICTION",
      entityId: targetBatch.batchNumber,
      actor: state.currentPersona.name,
      role: state.currentPersona.role,
      details: `[SIMULATED QUARANTINE] Batch ${targetBatch.batchNumber} quarantined: ${reason}. Affected ${affectedInventory.length} inventory records.`
    });

    recordAgentExecution({
      agentId: "AGENT_5_TRACEABILITY",
      agentName: "Traceability & Restriction Agent",
      trigger: `Restriction alert for Batch ${targetBatch.batchNumber}`,
      status: "SUCCESS",
      inputSummary: `Quarantine instruction executed by ${state.currentPersona.name}`,
      outputSummary: `Suppressed batch ${targetBatch.batchNumber} from active search across ${affectedPharmacies.size} pharmacies. Unaffected batches preserved.`,
      confidenceScore: 100,
      auditNote: "Deterministic quarantine isolation completed without human clinical overrides."
    });

    return newEvent;
  };

  const liftBatchRestriction = (batchId: string) => {
    setState(prev => {
      const updatedBatches = prev.batches.map(b => 
        b.id === batchId ? { ...b, status: "ACTIVE" as BatchStatus, restrictionReason: undefined } : b
      );

      const updatedInventory = prev.inventory.map(inv => {
        if (inv.batchId === batchId) {
          return {
            ...inv,
            availabilityStatus: "AVAILABLE" as AvailabilityStatus,
            freshnessCategory: "RECENTLY_CONFIRMED" as const,
            lastUpdatedAt: new Date().toISOString()
          };
        }
        return inv;
      });

      const updatedEvents = prev.restrictionEvents.map(e => 
        e.batchId === batchId ? { ...e, isActive: false, unrestrictedAt: new Date().toISOString() } : e
      );

      return {
        ...prev,
        batches: updatedBatches,
        inventory: updatedInventory,
        restrictionEvents: updatedEvents
      };
    });

    addAuditEvent({
      action: "BATCH_RESTRICTION_LIFTED",
      entityType: "RESTRICTION",
      entityId: batchId,
      actor: state.currentPersona.name,
      role: state.currentPersona.role,
      details: `Simulated quarantine lifted for batch ${batchId}. Inventory returned to regular supply.`
    });
  };

  const togglePharmacyActive = (pharmacyId: string) => {
    setState(prev => ({
      ...prev,
      pharmacies: prev.pharmacies.map(p => 
        p.id === pharmacyId ? { ...p, isActive: !p.isActive } : p
      )
    }));
  };

  const addOrUpdateProductAlias = (productId: string, newAlias: string) => {
    const trimmed = newAlias.trim();
    if (!trimmed) return;
    setState(prev => ({
      ...prev,
      products: prev.products.map(p => {
        if (p.id !== productId) return p;
        if (p.aliases.includes(trimmed)) return p;
        return { ...p, aliases: [...p.aliases, trimmed] };
      })
    }));
  };

  const updateInventoryItem = (inventoryId: string, updates: Partial<InventoryRecord>) => {
    setState(prev => ({
      ...prev,
      inventory: prev.inventory.map(inv => 
        inv.id === inventoryId ? { ...inv, ...updates, lastUpdatedAt: new Date().toISOString() } : inv
      )
    }));
  };

  const importCsvInventory = (
    pharmacyId: string,
    items: Array<{
      productId: string;
      quantity: number | null;
      sellingPrice?: number;
      batchNumber?: string;
      expiryDate?: string;
    }>
  ) => {
    let batchCreatedCount = 0;
    const newBatches: import("../types").Batch[] = [];
    const newRecords: InventoryRecord[] = [];

    items.forEach(item => {
      let batchId: string | undefined;
      if (item.batchNumber) {
        batchId = `batch-imp-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`;
        newBatches.push({
          id: batchId,
          productId: item.productId,
          batchNumber: item.batchNumber,
          manufacturer: "Imported Manufacturer",
          manufacturingDate: "2024-01",
          expiryDate: item.expiryDate || "2026-12",
          initialUnits: item.quantity || 100,
          status: "ACTIVE"
        });
        batchCreatedCount++;
      }

      newRecords.push({
        id: `inv-imp-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
        pharmacyId,
        productId: item.productId,
        batchId,
        quantity: item.quantity,
        reservedQuantity: 0,
        availabilityStatus: (item.quantity === 0) ? "OUT_OF_STOCK" : "AVAILABLE",
        sellingPrice: item.sellingPrice || 15.00,
        lastConfirmedAt: new Date().toISOString(),
        lastUpdatedAt: new Date().toISOString(),
        updateSource: "CSV_IMPORT",
        freshnessCategory: "RECENTLY_CONFIRMED",
        confidenceScore: 94
      });
    });

    setState(prev => ({
      ...prev,
      batches: [...prev.batches, ...newBatches],
      inventory: [...prev.inventory, ...newRecords]
    }));

    addAuditEvent({
      action: "CSV_INVENTORY_IMPORTED",
      entityType: "IMPORT",
      entityId: pharmacyId,
      actor: state.currentPersona.name,
      role: "PHARMACIST",
      details: `Imported ${items.length} inventory records and registered ${batchCreatedCount} batches.`
    });

    recordAgentExecution({
      agentId: "AGENT_2_IMPORT",
      agentName: "Inventory Mapping Agent",
      trigger: `Committed CSV batch for pharmacy ${pharmacyId}`,
      status: "SUCCESS",
      inputSummary: `Validated ${items.length} mapped items against canonical catalogue`,
      outputSummary: `Successfully inserted ${items.length} live records. Confidence: 94%`,
      confidenceScore: 94,
      auditNote: "Pharmacy ledger updated without exposing trade pricing or supplier contracts."
    });

    return { importedCount: items.length, batchCreatedCount };
  };

  const getPharmacyById = (id: string) => state.pharmacies.find(p => p.id === id);
  const getProductById = (id: string) => state.products.find(p => p.id === id);
  const getBatchById = (id: string) => state.batches.find(b => b.id === id);

  const value = useMemo(
    () => ({
      ...state,
      isInitialized,
      switchPersona,
      resetDemoData,
      setUserLocation,
      setScenarioNotice,
      requestAvailability,
      createReservation,
      cancelReservation,
      respondToAvailability,
      updateReservationStatus,
      updateInventoryItem,
      importCsvInventory,
      updateDeliveryJobStatus,
      triggerBatchRestriction,
      liftBatchRestriction,
      togglePharmacyActive,
      addOrUpdateProductAlias,
      recordAgentExecution,
      addAuditEvent,
      getPharmacyById,
      getProductById,
      getBatchById
    }),
    [state, isInitialized]
  );

  return <LineageContext.Provider value={value}>{children}</LineageContext.Provider>;
}

export function useLineage() {
  const context = useContext(LineageContext);
  if (!context) {
    throw new Error("useLineage must be used within a LineageProvider");
  }
  return context;
}
