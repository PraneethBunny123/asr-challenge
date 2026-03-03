"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {toast} from "sonner"

import type { RecordItem, RecordStatus } from "../types";
import { useRecords } from "../hooks/useRecords";
import { VersionConflictApiError } from "../api/apiService";

interface RecordDetailDialogProps {
  record: RecordItem;
  onClose: () => void;
}

/**
 * RecordDetailDialog allows reviewers to inspect a specimen’s details and
 * update its status and accompanying note in a focused modal flow. Review
 * actions are performed via the Status dropdown, while the note captures
 * rationale or extra context for the change.
 */
export default function RecordDetailDialog({
  record,
  onClose,
}: RecordDetailDialogProps) {
  const {updateRecord} = useRecords();

  const [status, setStatus] = useState<RecordStatus>(record.status);
  const [note, setNote] = useState<string>(record.note ?? "");
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * When a 409 is detected we store the server's authoritative record so the
   * reviewer can see what changed and decide whether to reapply their edits.
   */
  const [conflictRecord, setConflictRecord] = useState<RecordItem | null>(null);

  const statusOptions: RecordStatus[] = [
    "pending",
    "approved",
    "flagged",
    "needs_revision",
  ];

  const handleSave = async (versionOverrde?: number) => {
    if((status === "flagged" || status === "needs_revision") && note.trim() === "") {
      setError("Please provide a note when flagging or requesting revisions.");
      return;
    }

    setSaving(true);
    setError(null);
    setConflictRecord(null)

    try {
      await updateRecord(record.id, {status, note, version: versionOverrde ?? record.version});
      toast.success("Record updated successfully");
      onClose();
    } catch (err) {
      if (err instanceof VersionConflictApiError) {
        // Surface the server record so the reviewer can see what changed
        setConflictRecord(err.serverRecord);
        setError("This record was modified by another reviewer. " + "Review the current server version below and retry if you want to overwrite it.");
        toast.error("Version conflict: record was modified by another reviewer.");
      } else {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        toast.error(message);
      }
    } finally {
      setSaving(false);
    }
  }

  /**
   * Retry the save using the latest server version so the PATCH succeeds.
   * The reviewer's chosen status/note values are preserved.
   */
  const handleRetryWithServerVersion = () => {
    if (!conflictRecord) return;
    handleSave(conflictRecord.version);
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>

        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg tracking-tight">
            {record.name}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            {record.description}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <Select
              value={status} 
              onValueChange={(value) => setStatus(value as RecordStatus)}
            >
              <SelectTrigger 
                className="w-full"
                role="select-trigger"  
              >
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem 
                    key={option} 
                    value={option}
                    role={`select-item-${option}`}
                  >
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Reviewer note
            </label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note..."
              className="min-h-24"
              role="note-textarea"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Notes help other reviewers understand decisions.
            </p>
          </div>

          {error && (
            <div 
              className="rounded-md border border-destructive/40 bg-destructive/5 p-3 space-y-2"
              data-testid="validation-error"
            >            
              <p className="text-sm text-destructive">{error}</p>

              {conflictRecord && (
                <div className="text-xs text-muted-foreground space-y-1 border-t border-destructive/20 pt-2">
                  <p className="font-medium text-foreground">
                    Current server state:
                  </p>
                  <p>
                    Status:{" "}
                    <span className="font-medium">{conflictRecord.status}</span>
                  </p>
                  {conflictRecord.note && (
                    <p>Note: {conflictRecord.note}</p>
                  )}
                  <p className="text-muted-foreground">
                    Version: {conflictRecord.version}
                  </p>
                </div>
              )}
            </div>  
          )}
        </div>

        <DialogFooter className="mt-6 flex-col sm:flex-row gap-2">
          <Button 
            variant="secondary" 
            onClick={() => onClose() } 
            disabled={saving}
          >
            Close
          </Button>

          {/* Retry button appears only after a conflict */}
          {conflictRecord && (
            <Button
              variant="outline"
              onClick={handleRetryWithServerVersion}
              disabled={saving}
              data-testid="retry-button"
            >
              Overwrite & Save
            </Button>
          )}

          <Button 
            variant="default" 
            onClick={() => handleSave()}
            disabled={saving}
            role="save-button"
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}
