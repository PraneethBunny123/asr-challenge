import { renderHook, act } from "@testing-library/react";
import { RecordsProvider } from "@/app/interview/context/RecordsContext";
import { useRecords } from "@/app/interview/hooks/useRecords";
import * as api from "@/app/interview/api/apiService";
import type { RecordItem } from "@/app/interview/types";
import { VersionConflictApiError } from "@/app/interview/api/apiService";
import React from "react";

vi.mock("@/app/interview/api/apiService");


const sampleRecords: RecordItem[] = [
  {
    id: "1",
    name: "Specimen A",
    description: "Collected near river bank",
    status: "approved",
    version: 1,
  },
];

const pagedResponse = { records: sampleRecords, totalCount: 1 };

describe("RecordsContext", () => {
  it("updates record and appends history", async () => {
    vi.spyOn(api, "fetchRecords").mockResolvedValue(pagedResponse);
    vi.spyOn(api, "updateRecord").mockResolvedValue({...sampleRecords[0], status: "pending", version: 2});

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RecordsProvider>{children}</RecordsProvider>
    );

    const { result } = renderHook(() => useRecords(), { wrapper });

    // wait for initial fetch
    await act(async () => {});

    // perform updateRecord inside act to ensure state updates are processed
    await act(async () => {
      await result.current.updateRecord("1", { status: "pending", version: 1 });
    });

    // verify record updated to pending and history appended
    expect(result.current.records[0].status).toBe("pending");
    expect(result.current.history.length).toBe(1);

    // verify history entry details
    expect(result.current.history[0].previousStatus).toBe("approved");
    expect(result.current.history[0].newStatus).toBe("pending");
  });

  it("exposes pagination state with correct defaults", async () => {
    vi.spyOn(api, "fetchRecords").mockResolvedValue(pagedResponse);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RecordsProvider>{children}</RecordsProvider>
    );

    const { result } = renderHook(() => useRecords(), { wrapper });
    await act(async () => {});

    expect(result.current.page).toBe(1);
    expect(result.current.limit).toBe(6);
    expect(result.current.totalCount).toBe(1);
  });

  it("fetches the new page when setPage is called", async () => {
    const fetchSpy = vi.spyOn(api, "fetchRecords").mockResolvedValue(pagedResponse);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RecordsProvider>{children}</RecordsProvider>
    );

    const { result } = renderHook(() => useRecords(), { wrapper });
    await act(async () => {});

    await act(async () => {
      result.current.setPage(2);
    });

    // Second call should be for page 2
    expect(fetchSpy).toHaveBeenLastCalledWith(2, 6);
    expect(result.current.page).toBe(2);
  });

  it("resets to page 1 when setLimit is called", async () => {
    const fetchSpy = vi.spyOn(api, "fetchRecords").mockResolvedValue(pagedResponse);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RecordsProvider>{children}</RecordsProvider>
    );

    const { result } = renderHook(() => useRecords(), { wrapper });
    await act(async () => {});

    // Advance to page 2 first
    await act(async () => {
      result.current.setPage(2);
    });

    // Changing limit should snap back to page 1
    await act(async () => {
      result.current.setLimit(10);
    });

    expect(result.current.page).toBe(1);
    expect(fetchSpy).toHaveBeenLastCalledWith(1, 10);
  });

  it.skip("rolls back optimistic update and re-throws on version conflict", async () => {
    vi.spyOn(api, "fetchRecords").mockResolvedValue(pagedResponse);

    const serverRecord: RecordItem = {
      ...sampleRecords[0],
      status: "flagged",
      version: 5,
    };

    vi.spyOn(api, "updateRecord").mockRejectedValue(
      new VersionConflictApiError(serverRecord)
    );

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RecordsProvider>{children}</RecordsProvider>
    );

    const { result } = renderHook(() => useRecords(), { wrapper });
    await act(async () => {});

    let thrownError: unknown;
    await act(async () => {
      try {
        await result.current.updateRecord("1", {
          status: "pending",
          version: 6,
        });
      } catch (err) {
        thrownError = err;
      }
    });

    // Should have re-thrown a VersionConflictApiError
    expect(thrownError).toBeInstanceOf(VersionConflictApiError);

    // Local record should reflect the server's authoritative state after rollback
    expect(result.current.records[0].status).toBe("flagged");
    expect(result.current.records[0].version).toBe(5);

    // No history entry should have been added
    expect(result.current.history.length).toBe(0);
  });
});
