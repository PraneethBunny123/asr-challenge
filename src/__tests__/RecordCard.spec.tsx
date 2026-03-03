import { render, screen } from "@testing-library/react";
import RecordCard from "@/app/dashboard/components/RecordCard";
import type { RecordItem } from "@/app/dashboard/types";

const sample: RecordItem = {
  id: "1",
  name: "Specimen A",
  description: "Collected near river bank",
  status: "pending",
  version: 1,
};

describe("RecordCard", () => {
  it("renders record name and badge", () => {
    const onSelect = vi.fn();
    render(<RecordCard record={sample} onSelect={onSelect} />);
    expect(screen.getByText("Specimen A")).toBeInTheDocument();
    expect(screen.getByText("pending")).toBeInTheDocument();
  });
});
