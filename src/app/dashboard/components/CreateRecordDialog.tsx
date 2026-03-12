"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FieldGroup, FieldSet } from "@/components/ui/field";
import { createRecordSchema } from "@/lib/utils";
import CreateInput from "@/components/CreateInput";
import { useRecords } from "../hooks/useRecords";
import { useState } from "react";
import { toast } from "sonner";

type CreateRecordValues = z.infer<typeof createRecordSchema>;

interface CreateRecordDialogProps {
  onClose: () => void;
}

export default function CreateRecordDialog({
  onClose,
}: CreateRecordDialogProps) {
  const {createRecord} = useRecords()
  const [saving, setSaving] = useState(false)

  const form = useForm<CreateRecordValues>({
    resolver: zodResolver(createRecordSchema),
    defaultValues: { name: "", description: "", note: "" },
  });

  const onSubmit = async (data: CreateRecordValues) => {
    setSaving(true)
    try {
      await createRecord(data)
      toast.success("Record created successfully")
      onClose()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create record";
      form.setError("root", { message });
      toast.error(message);
    } finally {
      setSaving(false)
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Record</DialogTitle>
          <DialogDescription>
            Add a new specimen record. It will start with a status of pending.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldSet>
            <FieldGroup>
              <CreateInput
                control={form.control}
                name="name"
                label="Speciman Name"
                placeholder="Enter speciman name"
                type="input"
              />
              <CreateInput
                control={form.control}
                name="description"
                label="Description"
                placeholder="Enter description"
              />
              <CreateInput
                control={form.control}
                name="note"
                label="Note"
                placeholder="Add a note..."
              />
            </FieldGroup>
          </FieldSet>

          {form.formState.errors.root && (
            <p className="mt-3 text-sm text-red-500" role="alert">
              {form.formState.errors.root.message}
            </p>
          )}

          <DialogFooter className="mt-6 flex-col sm:flex-row gap-2">
            <Button type="button" variant="secondary" onClick={() => onClose()} disabled={saving}>
              Close
            </Button>

            <Button type="submit" variant="default" disabled={saving}>{saving ? "Creating..." : "Create Record"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
