// Re-export the useRecords hook from the context. This hook provides
// convenient access to the records context from components. See
// `context/RecordsContext.tsx` for implementation details.

import { useContext } from "react";
import { RecordsContext } from "../context/RecordsContext";

export function useRecords() {
    const ctx = useContext(RecordsContext)
    if (!ctx) throw new Error('useRecords must be used within a RecordsProvider');
    return ctx;
}