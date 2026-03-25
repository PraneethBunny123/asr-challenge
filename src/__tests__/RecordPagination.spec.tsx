import { screen, fireEvent } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react";
import { useRecordPagination } from "@/app/(main)/dashboard/hooks/useRecordPagination";
import RecordPagination from "@/app/(main)/dashboard/components/RecordPagination";
import { makeWrapper, renderWithContext } from "./helpers/mockHooks";


describe("useRecordPagination", () => {
  it("computes hasPrev=false on first page", () => {
    const wrapper = makeWrapper()
    const { result } = renderHook(() => useRecordPagination(), { wrapper });

    expect(result.current.hasPrev).toBe(false);
    expect(result.current.hasNext).toBe(true);
    expect(result.current.totalPages).toBe(2);
  });

  it("computes hasNext=false on last page", () => {
    const wrapper = makeWrapper({ page: 2 })
    const { result } = renderHook(() => useRecordPagination(), { wrapper });

    expect(result.current.hasNext).toBe(false);
    expect(result.current.hasPrev).toBe(true);
  });

  it("calls setPage with page - 1 on goToPrev", () => {
    const setPage = vi.fn()
    const wrapper = makeWrapper({ page: 3, totalCount: 30, setPage })
    const { result } = renderHook(() => useRecordPagination(), { wrapper });

    act(() => result.current.goToPrev());
    expect(setPage).toHaveBeenCalledWith(2);
  });

  it("calls setPage with page + 1 on goToNext", () => {
    const setPage = vi.fn()
    const wrapper = makeWrapper({ page: 1, setPage })
    const { result } = renderHook(() => useRecordPagination(), { wrapper });

    act(() => result.current.goToNext());
    expect(setPage).toHaveBeenCalledWith(2);
  });
});

describe("RecordPagination", () => {
  it("renders showing range and page counter", () => {
    renderWithContext(<RecordPagination />);

    expect(screen.getByText(/Showing 1-6 of 12/i)).toBeInTheDocument();
    expect(screen.getByText("1 / 2")).toBeInTheDocument();
  });

  it("disables Prev on page 1", () => {
    renderWithContext(<RecordPagination />, { page: 1 });
    expect(screen.getByTestId("pagination-prev")).toBeDisabled();
    expect(screen.getByTestId("pagination-next")).not.toBeDisabled();
  });

  it("disables Next on the last page", () => {
    renderWithContext(<RecordPagination />, { page: 2 });
    expect(screen.getByTestId("pagination-next")).toBeDisabled();
    expect(screen.getByTestId("pagination-prev")).not.toBeDisabled();
  });

  it("calls setPage when Next is clicked", () => {
    const setPage = vi.fn();
    renderWithContext(<RecordPagination />, { page: 1, setPage });

    fireEvent.click(screen.getByTestId("pagination-next"));
    expect(setPage).toHaveBeenCalledWith(2);
  });

  it("calls setPage when Prev is clicked", () => {
    const setPage = vi.fn();
    renderWithContext(<RecordPagination />, { page: 2, setPage });

    fireEvent.click(screen.getByTestId("pagination-prev"));
    expect(setPage).toHaveBeenCalledWith(1);
  });

  it("renders nothing when totalCount is 0", () => {
    const { container } = renderWithContext(<RecordPagination />, { totalCount: 0 });
    expect(container.firstChild).toBeNull();
  });

  it("shows correct range on middle page", () => {
    renderWithContext(<RecordPagination />, { page: 2, limit: 4, totalCount: 10 });
    expect(screen.getByText(/Showing 5-8 of 10/i)).toBeInTheDocument();
  });
});