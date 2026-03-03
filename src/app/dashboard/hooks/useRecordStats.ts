import type { RecordStatus } from "../types";
import { useRecords } from "./useRecords";

export function useRecordStats() {
  const {records} = useRecords();

  const statuses: RecordStatus[] = [
    "pending",
    "approved",
    "flagged",
    "needs_revision",
  ];

   const statusCounts = records.reduce(
    (acc, record) => {
      acc[record.status] = (acc[record.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<RecordStatus, number>,
  );

  return { 
    statuses, 
    statusCounts
  };
}