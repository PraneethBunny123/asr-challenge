"use client";

import { useRecords } from "@/app/(main)/dashboard/hooks/useRecords";
import { Button } from "./ui/button";
import { RefreshCw } from "lucide-react";

export default function MainSection() {
  const { refresh, loading } = useRecords();
  return (
    <div className="flex justify-between">
      <div>
        <h1 className="text-2xl font-bold mb-2">
          Review &amp; Annotation Task
        </h1>
        <p className="text-muted-foreground">
          Use this interface to review incoming records, adjust their status,
          and leave notes. The data is served by a mock API.
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => refresh()}
        disabled={loading}
      >
        <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
      </Button>
    </div>
  );
}
