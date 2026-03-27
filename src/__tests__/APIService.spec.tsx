import { renderHook, act } from "@testing-library/react";
import { useRecords } from "@/app/(main)/dashboard/hooks/useRecords";
import * as api from "@/app/(main)/dashboard/api/apiService";
import type { RecordItem } from "@/app/(main)/dashboard/types";
import { VersionConflictApiError, RecordNotFoundError } from "@/app/(main)/dashboard/api/apiService";
import { RecordsProvider } from "@/app/(main)/dashboard/context/RecordsContext";

vi.mock("@/app/(main)/dashboard/api/apiService", async (importActual) => {
  const actual = await importActual<typeof import("@/app/(main)/dashboard/api/apiService")>();
  return {
    ...actual,              // real VersionConflictApiError, RecordNotFoundError, etc.
    fetchRecords: vi.fn(),  // mock only the functions we need to control
    updateRecord: vi.fn(),
    createRecord: vi.fn(),
    deleteRecord: vi.fn(),
  };
});

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

// Use this instead of makeWrapper() for all tests in this file
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <RecordsProvider>{children}</RecordsProvider>
);

describe("updateRecord", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(api, "fetchRecords").mockResolvedValue(pagedResponse);
  });

  it("updates record and appends history", async () => {
    vi.spyOn(api, "updateRecord").mockResolvedValue({...sampleRecords[0], status: "pending", version: 2});

    const { result } = renderHook(() => useRecords(), { wrapper });

    // wait for initial fetch
    await act(async () => {});

    // perform updateRecord inside act to ensure state updates are processed
    await act(async () => {
      await result.current.updateRecord("1", { status: "pending", version: 1 });
    });

    // verify record updated to pending and history appended
    expect(result.current.records[0].status).toBe("pending");
    expect(result.current.history).toHaveLength(1);

    // verify history entry details
    expect(result.current.history[0].previousStatus).toBe("approved");
    expect(result.current.history[0].newStatus).toBe("pending");
  });

  it("exposes pagination state with correct defaults", async () => {
    const { result } = renderHook(() => useRecords(), { wrapper });
    await act(async () => {});

    expect(result.current.page).toBe(1);
    expect(result.current.limit).toBe(6);
    expect(result.current.totalCount).toBe(1);
  });

  it("fetches the new page when setPage is called", async () => {
    const fetchSpy = vi.spyOn(api, "fetchRecords").mockResolvedValue(pagedResponse);

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

  it("does not append history when status is unchanged", async () => {
    vi.spyOn(api, "updateRecord").mockResolvedValue({
      ...sampleRecords[0],
      note: "Updated note only",
      version: 2,
    });
 
    const { result } = renderHook(() => useRecords(), { wrapper });
    await act(async () => {});
 
    await act(async () => {
      await result.current.updateRecord("1", {
        status: "approved",
        note: "Updated note only",
        version: 1,
      });
    });
 
    expect(result.current.history).toHaveLength(0);
  });

  it("applies optimistic update before the server responds", async () => { 
    let resolveUpdate!: (value: RecordItem) => void;
    vi.spyOn(api, "updateRecord").mockReturnValue(
      new Promise((res) => { resolveUpdate = res; }),
    );
 
    const { result } = renderHook(() => useRecords(), { wrapper });
    await act(async () => {});
 
    act(() => {
      result.current.updateRecord("1", { status: "pending", version: 1 });
    });
 
    // Optimistic — status visible immediately before server responds
    expect(result.current.records[0].status).toBe("pending");
 
    await act(async () => {
      resolveUpdate({ ...sampleRecords[0], status: "pending", version: 2 });
    });
 
    // Confirmed version applied after server responds
    expect(result.current.records[0].version).toBe(2);
  });

  it("rolls back and swaps in server record on version conflict", async () => { 
    const serverRecord: RecordItem = {
      ...sampleRecords[0],
      status: "flagged",
      version: 5,
    };

    vi.spyOn(api, "updateRecord").mockRejectedValue(
      new VersionConflictApiError(serverRecord),
    );
 
    const { result } = renderHook(() => useRecords(), { wrapper });
    
    await act(async () => {});
 
    let thrownError: unknown;
    await act(async () => {
      try {
        await result.current.updateRecord("1", { status: "pending", version: 1 });
      } catch (err) {
        thrownError = err;
      }
    });
 
    expect(thrownError).toBeInstanceOf(VersionConflictApiError);
    expect(result.current.records[0].status).toBe("flagged");
    expect(result.current.records[0].version).toBe(5);
    expect(result.current.history).toHaveLength(0);
  });

  it("removes record from list and re-throws on 404", async () => {
    vi.spyOn(api, "updateRecord").mockRejectedValue(
      new RecordNotFoundError("Record not found or has been deleted"),
    );
 
    const { result } = renderHook(() => useRecords(), { wrapper });
    await act(async () => {});
 
    let thrownError: unknown;
    await act(async () => {
      try {
        await result.current.updateRecord("1", { status: "pending", version: 1 });
      } catch (err) {
        thrownError = err;
      }
    });
 
    expect(thrownError).toBeInstanceOf(RecordNotFoundError);
    expect(result.current.records).toHaveLength(0);
    expect(result.current.totalCount).toBe(0);
  });
});

describe("createRecord", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(api, "fetchRecords").mockResolvedValue(pagedResponse);
  });
  
  it("calls refresh after successful create", async () => {
    const fetchSpy = vi
      .spyOn(api, "fetchRecords")
      .mockResolvedValue(pagedResponse);
    vi.spyOn(api, "createRecord").mockResolvedValue({
      id: "2",
      name: "Specimen B",
      description: "New specimen",
      status: "pending",
      version: 1,
    });
 
    const { result } = renderHook(() => useRecords(), { wrapper });
    await act(async () => {});
 
    const callsBefore = fetchSpy.mock.calls.length;
 
    await act(async () => {
      await result.current.createRecord({
        name: "Specimen B",
        description: "New specimen",
      });
    });
 
    expect(fetchSpy.mock.calls.length).toBeGreaterThan(callsBefore);
  });
 
  it("re-throws on create failure without changing records", async () => {
    vi.spyOn(api, "createRecord").mockRejectedValue(
      new Error("Name and Description are required"),
    );
 
    const { result } = renderHook(() => useRecords(), { wrapper });
    await act(async () => {});
 
    let thrownError: unknown;
    await act(async () => {
      try {
        await result.current.createRecord({ name: "", description: "" });
      } catch (err) {
        thrownError = err;
      }
    });
 
    expect(thrownError).toBeInstanceOf(Error);
    expect((thrownError as Error).message).toBe("Name and Description are required");
    expect(result.current.records).toHaveLength(1);
  });
});

describe("deleteRecord", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(api, "fetchRecords").mockResolvedValue(pagedResponse);
  });

  it("optimistically removes record on success", async () => {
    vi.spyOn(api, "deleteRecord").mockResolvedValue(undefined);
 
    const { result } = renderHook(() => useRecords(), { wrapper });
    await act(async () => {});
 
    await act(async () => {
      await result.current.deleteRecord("1");
    });
 
    expect(result.current.records).toHaveLength(0);
    expect(result.current.totalCount).toBe(0);
  });
 
  it("rolls back on generic delete failure", async () => {
    vi.spyOn(api, "deleteRecord").mockRejectedValue(
      new Error("Failed to delete record"),
    );
 
    const { result } = renderHook(() => useRecords(), { wrapper });
    await act(async () => {});
 
    let thrownError: unknown;
    await act(async () => {
      try {
        await result.current.deleteRecord("1");
      } catch (err) {
        thrownError = err;
      }
    });
 
    expect(thrownError).toBeInstanceOf(Error);
    expect(result.current.records).toHaveLength(1);
    expect(result.current.totalCount).toBe(1);
  });
 
  it("does NOT roll back when record was already deleted on server (404)", async () => {
    vi.spyOn(api, "deleteRecord").mockRejectedValue(
      new RecordNotFoundError("Record not found or already deleted"),
    );
 
    const { result } = renderHook(() => useRecords(), { wrapper });
    await act(async () => {});
 
    let thrownError: unknown;
    await act(async () => {
      try {
        await result.current.deleteRecord("1");
      } catch (err) {
        thrownError = err;
      }
    });
 
    expect(thrownError).toBeInstanceOf(RecordNotFoundError);
    // Optimistic removal stands
    expect(result.current.records).toHaveLength(0);
    expect(result.current.totalCount).toBe(0);
  });
 
  it("clears history when clearHistory is called", async () => {
    vi.spyOn(api, "updateRecord").mockResolvedValue({
      ...sampleRecords[0],
      status: "pending",
      version: 2,
    });
 
    const { result } = renderHook(() => useRecords(), { wrapper });
    await act(async () => {});
 
    await act(async () => {
      await result.current.updateRecord("1", { status: "pending", version: 1 });
    });
 
    expect(result.current.history).toHaveLength(1);
 
    act(() => { result.current.clearHistory(); });
 
    expect(result.current.history).toHaveLength(0);
  });
});