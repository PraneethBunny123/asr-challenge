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

  const statusOptions: RecordStatus[] = [
    "pending",
    "approved",
    "flagged",
    "needs_revision",
  ];

  const handleSave = async () => {
    if((status === "flagged" || status === "needs_revision") && note.trim() === "") {
      setError("Please provide a note when flagging or requesting revisions.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await updateRecord(record.id, {status, note});
      toast.success("Record updated successfully");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      toast.error(error)
    } finally {
      setSaving(false);
    }
  }

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
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option} value={option}>
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
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Notes help other reviewers understand decisions.
            </p>
          </div>

          {error && <p className="text-sm text-destructive">Error: {error}</p>}
        </div>

        <DialogFooter className="mt-6">
          <Button 
            variant="secondary" 
            onClick={() => onClose() } 
            disabled={saving}
          >
            Close
          </Button>
          <Button 
            variant="default" 
            onClick={handleSave} 
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}
