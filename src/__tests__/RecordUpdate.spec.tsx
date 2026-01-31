import { renderHook, act } from "@testing-library/react";
import { RecordsProvider } from "@/app/interview/context/RecordsContext";
import { useRecords } from "@/app/interview/hooks/useRecords";
import * as api from "@/app/interview/api/apiService";
import type { RecordItem } from "@/app/interview/types";
import React from "react";

vi.mock("@/app/interview/api/apiService");


const sampleRecords: RecordItem[] = [
  {
    id: "1",
    name: "Specimen A",
    description: "Collected near river bank",
    status: "approved",
  },
];

describe("RecordsContext", () => {
  it("updates record and appends history", async () => {
    vi.spyOn(api, "fetchRecords").mockResolvedValue(sampleRecords);
    vi.spyOn(api, "updateRecord").mockResolvedValue({...sampleRecords[0], status: "pending"});

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RecordsProvider>{children}</RecordsProvider>
    );

    const { result } = renderHook(() => useRecords(), { wrapper });

    // wait for initial fetch
    await act(async () => {});

    // perform updateRecord inside act to ensure state updates are processed
    await act(async () => {
      await result.current.updateRecord("1", { status: "pending" });
    });

    // verify record updated to pending and history appended
    expect(result.current.records[0].status).toBe("pending");
    expect(result.current.history.length).toBe(1);

    // verify history entry details
    expect(result.current.history[0].previousStatus).toBe("approved");
    expect(result.current.history[0].newStatus).toBe("pending");
  });
});
