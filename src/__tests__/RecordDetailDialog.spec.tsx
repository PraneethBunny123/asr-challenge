import { render, screen, fireEvent, waitFor} from "@testing-library/react";
import RecordDetailDialog from "@/app/interview/components/RecordDetailDialog";
import { RecordsContext } from "@/app/interview/context/RecordsContext";
import type { RecordItem } from "@/app/interview/types";

const mockUpdate = vi.fn();
const mockOnClose = vi.fn();

const mockContextValue = {
  records: [],
  loading: false,
  error: null,
  updateRecord: mockUpdate,
  refresh: vi.fn(),
  history: [],
  clearHistory: vi.fn(),
};

const sampleRecord: RecordItem = {
  id: "1",
  name: "Specimen A",
  description: "Collected near river bank",
  status: "pending",
};

describe("RecordDetailDialog dialog flow", () => {
  beforeEach(() => {
    mockUpdate.mockReset();
    mockOnClose.mockReset();
  });

  it("blocks save when flagged without note", async () => {
   render(
      <RecordsContext.Provider value={mockContextValue}>
        <RecordDetailDialog record={sampleRecord} onClose={mockOnClose} />
      </RecordsContext.Provider>
    );

    // Change status to "flagged"
    fireEvent.pointerDown(screen.getByRole("select-trigger"));
    fireEvent.click(screen.getByRole("select-item-flagged"));

    // empty note and attempt to save
    fireEvent.click(screen.getByRole("save-button"));
   
    // Ensure updateRecord and onClose were not called
    expect(mockUpdate).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();

    // Assert validation error
    expect(
       screen.getByTestId("validation-error")
    ).toBeInTheDocument();
    
  });

  it("saves successfully when note is provided", async () => {
    render(
        <RecordsContext.Provider value={mockContextValue}>
          <RecordDetailDialog record={sampleRecord} onClose={mockOnClose} />
        </RecordsContext.Provider>
      );

    // Change status to "flagged"
    fireEvent.pointerDown(screen.getByRole("select-trigger"));
    fireEvent.click(await screen.findByRole("select-item-flagged"));

    // Provide a note
    fireEvent.change(screen.getByRole("note-textarea"), {
      target: { value: "Needs review" },
    });

    // Attempt to save
    fireEvent.click(screen.getByRole("save-button"));
    
    // Ensure updateRecord and onClose were called
    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled()
    });
  });

});



