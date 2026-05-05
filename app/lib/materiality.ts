import type { Amendment } from "./types";

export const MATERIALITY_THRESHOLD = 0.05;

export function isMaterial(a: Amendment): boolean {
  if (a.totalContractValueOldCents === 0) return false;
  const delta = Math.abs(a.totalContractValueNewCents - a.totalContractValueOldCents);
  return delta / a.totalContractValueOldCents >= MATERIALITY_THRESHOLD;
}

export function materialityRatio(a: Amendment): number {
  if (a.totalContractValueOldCents === 0) return 0;
  const delta = Math.abs(a.totalContractValueNewCents - a.totalContractValueOldCents);
  return delta / a.totalContractValueOldCents;
}

export function tcvDeltaCents(a: Amendment): number {
  return a.totalContractValueNewCents - a.totalContractValueOldCents;
}

export function recogDeltaCents(a: Amendment): number {
  return a.recognizedToDateNewCents - a.recognizedToDateOldCents;
}
