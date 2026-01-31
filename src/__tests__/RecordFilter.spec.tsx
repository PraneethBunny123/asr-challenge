import { render, screen, fireEvent } from "@testing-library/react";
import RecordFilter from "@/app/interview/components/RecordFilter";

describe("RecordFilter", () => {
  it("calls onChange with the selected value", async () => {
    const handleChange = vi.fn();

    render(<RecordFilter value="all" onChange={handleChange} />);

    fireEvent.pointerDown(screen.getByRole("select-filter-trigger"));
    
    fireEvent.click(await screen.findByText("flagged"));

    expect(handleChange).toHaveBeenCalledWith("flagged");
  });

});
