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

type CreateRecordValues = z.infer<typeof createRecordSchema>;

interface CreateRecordDialogProps {
  onClose: () => void;
}

export default function CreateRecordDialog({
  onClose,
}: CreateRecordDialogProps) {
  const form = useForm<CreateRecordValues>({
    resolver: zodResolver(createRecordSchema),
    defaultValues: { name: "", description: "", note: "" },
  });

  const onSubmit = async (data: CreateRecordValues) => {
    console.log(data);
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
            <Button variant="secondary" onClick={() => onClose()}>
              Close
            </Button>

            <Button variant="default">Create Record</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
