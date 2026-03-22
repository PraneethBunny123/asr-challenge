import { useState, useMemo } from "react";
import type { RecordItem } from "../types";
import { useRecords } from "./useRecords";

export function useRecordFilters() {
  const [selectedRecord, setSelectedRecord] = useState<RecordItem | null>(null);
  const [filter, setFilter] = useState<"all" | RecordItem["status"]>("all");

  const {records} = useRecords();

  const filteredRecords = useMemo(() => {
    if (filter === "all") return records;
    return records.filter((r) => r.status === filter);
  }, [records, filter])

  return {
    filteredRecords,
    selectedRecord,
    setSelectedRecord,
    filter,
    setFilter,
  }
}