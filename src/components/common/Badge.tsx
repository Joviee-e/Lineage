import React from "react";
import { FreshnessCategory, ParticipationMode, ReservationStatus, BatchStatus } from "../../lib/types";
import { CheckCircle2, Clock, AlertTriangle, ShieldAlert, XCircle, Store, FileSpreadsheet, Database } from "lucide-react";

export function FreshnessBadge({ category, className = "" }: { category: FreshnessCategory; className?: string }) {
  switch (category) {
    case "RECENTLY_CONFIRMED":
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 ${className}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Recently Confirmed
        </span>
      );
    case "NEEDS_CONFIRMATION":
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 ${className}`}>
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          Needs Confirmation
        </span>
      );
    case "RESTRICTED":
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200 ${className}`}>
          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
          Batch Restricted
        </span>
      );
    case "UNAVAILABLE":
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 ${className}`}>
          <XCircle className="w-3.5 h-3.5 text-slate-500" />
          Reported Unavailable
        </span>
      );
  }
}

export function ParticipationBadge({ mode, className = "" }: { mode: ParticipationMode; className?: string }) {
  switch (mode) {
    case "ONE_TAP_REQUEST":
      return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-sky-50 text-sky-800 border border-sky-200 ${className}`}>
          <Store className="w-3 h-3 text-sky-600" />
          One-Tap (Zero Ledger)
        </span>
      );
    case "CSV_IMPORT":
      return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-purple-50 text-purple-800 border border-purple-200 ${className}`}>
          <FileSpreadsheet className="w-3 h-3 text-purple-600" />
          CSV Periodic Import
        </span>
      );
    case "CONNECTED_LEDGER":
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 ${className}`}>
          <Database className="w-3 h-3 text-emerald-600" />
          Connected Ledger
        </span>
      );
  }
}

export function OrderStatusBadge({ status, className = "" }: { status: ReservationStatus; className?: string }) {
  const configs: Record<ReservationStatus, { label: string; color: string }> = {
    REQUEST_SUBMITTED: { label: "Request Submitted", color: "bg-slate-100 text-slate-700 border-slate-300" },
    AWAITING_CONFIRMATION: { label: "Awaiting Pharmacist", color: "bg-amber-50 text-amber-800 border-amber-200" },
    CONFIRMED: { label: "Stock Reserved", color: "bg-blue-50 text-blue-800 border-blue-200" },
    READY_FOR_COLLECTION: { label: "Ready for Pickup", color: "bg-emerald-100 text-emerald-900 border-emerald-300" },
    DELIVERY_REQUESTED: { label: "Delivery Queued", color: "bg-indigo-50 text-indigo-800 border-indigo-200" },
    DELIVERY_ASSIGNED: { label: "Rider Assigned", color: "bg-sky-50 text-sky-800 border-sky-200" },
    PICKED_UP: { label: "Picked Up by Courier", color: "bg-purple-50 text-purple-800 border-purple-200" },
    OUT_FOR_DELIVERY: { label: "Out for Delivery", color: "bg-amber-100 text-amber-900 border-amber-300" },
    COMPLETED: { label: "Completed & Verified", color: "bg-teal-50 text-teal-800 border-teal-300" },
    CANCELLED: { label: "Cancelled", color: "bg-rose-50 text-rose-700 border-rose-200" },
    REJECTED: { label: "Declined by Store", color: "bg-rose-50 text-rose-700 border-rose-200" },
    EXPIRED: { label: "Reservation Expired", color: "bg-slate-100 text-slate-600 border-slate-200" }
  };

  const conf = configs[status] || { label: status, color: "bg-slate-100 text-slate-700" };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${conf.color} ${className}`}>
      {conf.label}
    </span>
  );
}

export function BatchStatusBadge({ status, className = "" }: { status: BatchStatus; className?: string }) {
  if (status === "RESTRICTED_QUARANTINE") {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 animate-pulse ${className}`}>
        <AlertTriangle className="w-3 h-3 text-rose-600" />
        QUARANTINED
      </span>
    );
  }
  if (status === "EXPIRED") {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-300 ${className}`}>
        EXPIRED
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200 ${className}`}>
      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
      ACTIVE
    </span>
  );
}
