import { render, screen, fireEvent } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react";
import { RecordsContext } from "@/app/interview/context/RecordsContext";
import { useRecordPagination } from "@/app/interview/hooks/useRecordPagination";
import RecordPagination from "@/app/interview/components/RecordPagination";
import React from "react";

function makeContext(overrides: Partial<React.ContextType<typeof RecordsContext>> = {}) {
  return {
    records: [],
    loading: false,
    error: null,
    page: 1,
    limit: 6,
    totalCount: 12,
    setPage: vi.fn(),
    setLimit: vi.fn(),
    updateRecord: vi.fn(),
    refresh: vi.fn(),
    history: [],
    clearHistory: vi.fn(),
    ...overrides,
  };
}

function renderWithContext(ctx: ReturnType<typeof makeContext>) {
  return render(
    <RecordsContext.Provider value={ctx}>
      <RecordPagination />
    </RecordsContext.Provider>
  );
}

describe("useRecordPagination", () => {
  it("computes hasPrev=false on first page", () => {
    const ctx = makeContext({ page: 1, limit: 6, totalCount: 12 });
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RecordsContext.Provider value={ctx}>
        {children}
      </RecordsContext.Provider>
    );

    const { result } = renderHook(() => useRecordPagination(), { wrapper });

    expect(result.current.hasPrev).toBe(false);
    expect(result.current.hasNext).toBe(true);
    expect(result.current.totalPages).toBe(2);
  });

  it("computes hasNext=false on last page", () => {
    const ctx = makeContext({ page: 2, limit: 6, totalCount: 12 });
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RecordsContext.Provider value={ctx}>
        {children}
      </RecordsContext.Provider>
    );

    const { result } = renderHook(() => useRecordPagination(), { wrapper });

    expect(result.current.hasNext).toBe(false);
    expect(result.current.hasPrev).toBe(true);
  });

  it("calls setPage with page - 1 on goToPrev", () => {
    const setPage = vi.fn();
    const ctx = makeContext({ page: 3, totalCount: 30, setPage });
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RecordsContext.Provider value={ctx}>{children}</RecordsContext.Provider>
    );
    const { result } = renderHook(() => useRecordPagination(), { wrapper });

    act(() => result.current.goToPrev());
    expect(setPage).toHaveBeenCalledWith(2);
  });

  it("calls setPage with page + 1 on goToNext", () => {
    const setPage = vi.fn();
    const ctx = makeContext({ page: 1, totalCount: 30, setPage });
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RecordsContext.Provider value={ctx}>
        {children}
      </RecordsContext.Provider>
    );

    const { result } = renderHook(() => useRecordPagination(), { wrapper });

    act(() => result.current.goToNext());
    expect(setPage).toHaveBeenCalledWith(2);
  });
});

describe("RecordPagination", () => {
  it("renders showing range and page counter", () => {
    renderWithContext(makeContext({ page: 1, limit: 6, totalCount: 12 }));

    expect(screen.getByText(/Showing 1-6 of 12/i)).toBeInTheDocument();
    expect(screen.getByText("1 / 2")).toBeInTheDocument();
  });

  it("disables Prev on page 1", () => {
    renderWithContext(makeContext({ page: 1, totalCount: 12 }));
    expect(screen.getByTestId("pagination-prev")).toBeDisabled();
  });

  it("disables Next on the last page", () => {
    renderWithContext(makeContext({ page: 2, limit: 6, totalCount: 12 }));
    expect(screen.getByTestId("pagination-next")).toBeDisabled();
  });

  it("calls setPage when Next is clicked", () => {
    const setPage = vi.fn();
    renderWithContext(makeContext({ page: 1, limit: 6, totalCount: 12, setPage }));

    fireEvent.click(screen.getByTestId("pagination-next"));
    expect(setPage).toHaveBeenCalledWith(2);
  });

  it("calls setPage when Prev is clicked", () => {
    const setPage = vi.fn();
    renderWithContext(makeContext({ page: 2, limit: 6, totalCount: 12, setPage }));

    fireEvent.click(screen.getByTestId("pagination-prev"));
    expect(setPage).toHaveBeenCalledWith(1);
  });

  it("renders nothing when totalCount is 0", () => {
    const { container } = renderWithContext(makeContext({ page: 1, limit: 6, totalCount: 0 }));
    expect(container.firstChild).toBeNull();
  });
});