import { fireEvent, render, screen } from "@testing-library/react";
import RecordCard from "@/app/(main)/dashboard/components/RecordCard";
import type { RecordItem } from "@/app/(main)/dashboard/types";
import { setupMocks } from "./helpers/mockHooks";

vi.mock("@/app/(main)/dashboard/hooks/useRole");
vi.mock("@/app/(main)/dashboard/hooks/useRecords");

const sample: RecordItem = {
  id: "1",
  name: "Specimen A",
  description: "Collected near river bank",
  status: "pending",
  version: 1,
};

describe("RecordCard", () => {
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
