import { useState, useMemo } from "react";
import type { RecordItem } from "../types";
import { useRecords } from "./useRecords";

export function useRecordFilters() {
  const [selectedRecord, setSelectedRecord] = useState<RecordItem | null>(null);
  const [filter, setFilter] = useState<"all" | RecordItem["status"]>("all");

  const {records} = useRecords();

  const filteredRecords = useMemo(() => {
    return records
  }, [records])

  return {
    filteredRecords,
    selectedRecord,
    setSelectedRecord,
    filter,
    setFilter,
  }
}