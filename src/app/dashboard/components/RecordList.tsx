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
import { Plus, RefreshCw } from "lucide-react";
import { useState } from "react";
import CreateRecordDialog from "./CreateRecordDialog";
import { useRole } from "../hooks/useRole";

/**
 * RecordList orchestrates the dashboard page by fetching records via
 * RecordsContext, presenting summary counts, exposing a simple filter UI, and
 * handling selection to open the detail dialog.
 */
export default function RecordList() {
  const { totalCount, loading, error, refresh } = useRecords();
  const {
    filteredRecords,
    selectedRecord,
    setSelectedRecord,
    filter,
    setFilter,
  } = useRecordFilters();
  const {canCreate} = useRole()

  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false)

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
          <RecordFilter value={filter} onChange={setFilter} />
          <Button variant="ghost" onClick={() => refresh()} disabled={loading}>
            <RefreshCw className={loading ? "animate-spin" : ""}/>
          </Button>
          {canCreate && (
            <Button variant="secondary" onClick={() => setShowCreateDialog(true)}>
              <Plus />
              New Record
            </Button>
          )}
        </div>
      </div>
      {error && (
        <div 
          className="rounded-md border border-destructive/40 bg-destructive/5 p-3 space-y-2"
          data-testid="validation-error"
        >            
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
      {loading && (
        <p className="text-sm text-muted-foreground">Loading records...</p>
      )}

      <RecordSummary />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredRecords.map((record) => (
          <RecordCard
            key={record.id}
            record={record}
            onSelect={setSelectedRecord}
          />
        ))}
      </div>

      <RecordPagination />

      {showCreateDialog && (
        <CreateRecordDialog 
          onClose={() => setShowCreateDialog(false)}
        />
      )}

      {selectedRecord && (
        <RecordDetailDialog
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      )}
      {filteredRecords.length === 0 && !loading && !error && (
        <p className="text-sm text-muted-foreground">No records found.</p>
      )}

      <HistoryLog />
    </div>
  );
}
