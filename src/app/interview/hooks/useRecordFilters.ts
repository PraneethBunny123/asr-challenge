import { useRecords } from "./useRecords";
import { useState, useMemo } from "react";
import type { RecordItem } from "../types";

export function useRecordFilters() {
  const { records } = useRecords();

  const [selectedRecord, setSelectedRecord] = useState<RecordItem | null>(null);
  const [filter, setFilter] = useState<"all" | RecordItem["status"]>("all");

  const counts = useMemo(() => {
    const map: Record<RecordItem["status"], number> = {
      pending: 0,
      approved: 0,
      flagged: 0,
      needs_revision: 0,
    }

    records.forEach((item) => {
      map[item.status]++;
    });

    return map;
  }, [records]);

  return {
    counts,
    selectedRecord,
    setSelectedRecord,
    filter,
    setFilter,
  }
}