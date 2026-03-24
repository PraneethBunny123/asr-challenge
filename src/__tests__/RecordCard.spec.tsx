import { fireEvent, render, screen } from "@testing-library/react";
import RecordCard from "@/app/(main)/dashboard/components/RecordCard";
import type { RecordItem } from "@/app/(main)/dashboard/types";
import { useRole } from "@/app/(main)/dashboard/hooks/useRole";
import { useRecords } from "@/app/(main)/dashboard/hooks/useRecords";

vi.mock("@/app/(main)/dashboard/hooks/useRole");
vi.mock("@/app/(main)/dashboard/hooks/useRecords");

const sample: RecordItem = {
  id: "1",
  name: "Specimen A",
  description: "Collected near river bank",
  status: "pending",
  version: 1,
};

const mockDeleteRecord = vi.fn();

function setupMocks(admin = false, reviewer = false) {
  vi.mocked(useRole).mockReturnValue({
    role: admin ? "admin" : reviewer ? "reviewer" : "viewer",
    isViewer: !(admin || reviewer),
    isReviewer: reviewer,
    isAdmin: admin,
    canCreate: admin,
    canUpdate: admin || reviewer,
    canDelete: admin,
  });

  vi.mocked(useRecords).mockReturnValue({
    records: [],
    loading: false,
    error: null,
    page: 1,
    limit: 6,
    totalCount: 0,
    setPage: vi.fn(),
    setLimit: vi.fn(),
    createRecord: vi.fn(),
    updateRecord: vi.fn(),
    deleteRecord: mockDeleteRecord,
    refresh: vi.fn(),
    history: [],
    clearHistory: vi.fn(),
  });
}

describe("RecordCard", () => {
  beforeEach(() => {
    mockDeleteRecord.mockReset();
  });

  it("renders record name and badge", () => {
    setupMocks();
    const onSelect = vi.fn();
    render(<RecordCard record={sample} onSelect={onSelect} />);

    expect(screen.getByText("Specimen A")).toBeInTheDocument();
    expect(screen.getByText("pending")).toBeInTheDocument();
  });

  it("calls onSelect when Review button is clicked", () => {
    setupMocks();
    const onSelect = vi.fn();
    render(<RecordCard record={sample} onSelect={onSelect} />);
    fireEvent.click(screen.getByText("Review"));
    expect(onSelect).toHaveBeenCalledWith(sample);
  });

  it("shows delete button for admin", () => {
    setupMocks(true);
    render(<RecordCard record={sample} onSelect={vi.fn()} />);
    expect(screen.getByRole("delete-icon")).toBeInTheDocument();
  });

  it("does not show delete button for reviewer", () => {
    setupMocks(false, true);
    render(<RecordCard record={sample} onSelect={vi.fn()} />);
    expect(screen.queryByRole("delete-icon")).not.toBeInTheDocument();
  });

  it("does not show delete button for viewer", () => {
    setupMocks();
    render(<RecordCard record={sample} onSelect={vi.fn()} />);
    expect(screen.queryByRole("delete-icon")).not.toBeInTheDocument();
  });

  it("renders note when present", () => {
    setupMocks();
    const recordWithNote = { ...sample, note: "Needs review" };
    render(<RecordCard record={recordWithNote} onSelect={vi.fn()} />);
    expect(screen.getByText(/Needs review/)).toBeInTheDocument();
  });
});
