"use client";

import { useRecords } from "../hooks/useRecords";
import { useRecordFilters } from "../hooks/useRecordFilters";

import RecordCard from "./RecordCard";
import RecordDetailDialog from "./RecordDetailDialog";

import RecordFilter from "./RecordFilter";
import HistoryLog from "./HistoryLog";
import RecordSummary from "./RecordSummary";
import RecordPagination from "./RecordPagination";

import { Button } from "@/components/ui/button";


/**
 * RecordList orchestrates the interview page by fetching records via
 * RecordsContext, presenting summary counts, exposing a simple filter UI, and
 * handling selection to open the detail dialog.
 */
export default function RecordList() {
  const { totalCount, loading, error, refresh } = useRecords();
  const { filteredRecords, selectedRecord, setSelectedRecord, filter, setFilter } = useRecordFilters();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
            Records
          </h2>
          <p className="text-sm text-muted-foreground">
            {totalCount} total • {filteredRecords.length} showing
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* RecordFilter replaces the below inline select */}
          <RecordFilter value={filter} onChange={setFilter} />

          <Button variant="ghost" onClick={() => refresh()} disabled={loading}>
            Reload
          </Button>
        </div>
      </div>
      {error && <p className="text-sm text-destructive">Error: {error}</p>}
      {loading && (
        <p className="text-sm text-muted-foreground">Loading records...</p>
      )}

      {/* RecordSummary replaces the below inline summary */}
      <RecordSummary />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredRecords.map((record) => (
          <RecordCard key={record.id} record={record} onSelect={setSelectedRecord} />
        ))}
      </div>

      {/* RecordPagination replaces the below inline pagination */}
      <RecordPagination />

      {selectedRecord && <RecordDetailDialog record={selectedRecord} onClose={() => setSelectedRecord(null)} />}
      {filteredRecords.length === 0 && !loading && !error && (
        <p className="text-sm text-muted-foreground">No records found.</p>
      )}

      {/* HistoryLog replaces the below inline history */}
      <HistoryLog />
    </div>
  );
}
