import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RecordDetailDialog from "@/app/(main)/dashboard/components/RecordDetailDialog";
import { RecordsContext } from "@/app/(main)/dashboard/context/RecordsContext";
import type { RecordItem } from "@/app/(main)/dashboard/types";
import {
  VersionConflictApiError,
  RecordNotFoundError,
} from "@/app/(main)/dashboard/api/apiService";
import { mockUpdate, renderWithContext, setupRoleMocks } from "./helpers/mockHooks";

vi.mock("@/app/(main)/dashboard/hooks/useRole");

const mockOnClose = vi.fn();

const sampleRecord: RecordItem = {
  id: "1",
  name: "Specimen A",
  description: "Collected near river bank",
  status: "pending",
  version: 1,
};

function renderDialog(record = sampleRecord) {
  return renderWithContext(
    <RecordDetailDialog record={record} onClose={mockOnClose} />,
  );
}

describe("RecordDetailDialog dialog flow", () => {
  beforeEach(() => {
    mockUpdate.mockReset();
    mockOnClose.mockReset();
  });

  it("blocks save when flagged without note", async () => {
    renderDialog()

    // Change status to "flagged"
    fireEvent.pointerDown(screen.getByRole("select-trigger"));
    fireEvent.click(screen.getByRole("select-item-flagged"));

    // empty note and attempt to save
    fireEvent.click(screen.getByRole("save-button"));

    // Ensure updateRecord and onClose were not called
    expect(mockUpdate).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();

    // Assert validation error
    expect(screen.getByTestId("validation-error")).toBeInTheDocument();
  });

  it("saves successfully when note is provided", async () => {
    mockUpdate.mockResolvedValue(undefined);
    renderDialog()

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
      expect(mockUpdate).toHaveBeenCalledWith("1", {
        status: "flagged",
        note: "Needs review",
        version: 1,
      });
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("passes the record version with the save payload", async () => {
    mockUpdate.mockResolvedValue(undefined);
    const recordV3: RecordItem = { ...sampleRecord, version: 3 };

    renderDialog(recordV3)

    fireEvent.change(screen.getByRole("note-textarea"), {
      target: { value: "Routine check" },
    });
    fireEvent.click(screen.getByRole("save-button"));

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith(
        "1",
        expect.objectContaining({ version: 3 }),
      );
    });
  });

  it("shows conflict message and Overwrite button on 409", async () => {
    const serverRecord: RecordItem = {
      ...sampleRecord,
      status: "approved",
      note: "Approved by another reviewer",
      version: 2,
    };
    mockUpdate.mockRejectedValue(new VersionConflictApiError(serverRecord));
    renderDialog()

    fireEvent.click(screen.getByRole("save-button"));

    await waitFor(() => {
      expect(screen.getByTestId("validation-error")).toBeInTheDocument();
    });

    // Conflict detail panel should show the server's status
    expect(screen.getByText("approved")).toBeInTheDocument();
    expect(screen.getByTestId("retry-button")).toBeInTheDocument();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("retries with server version when Overwrite is clicked", async () => {
    const serverRecord: RecordItem = {
      ...sampleRecord,
      status: "approved",
      version: 2,
    };
    // First call conflicts, second call succeeds
    mockUpdate
      .mockRejectedValueOnce(new VersionConflictApiError(serverRecord))
      .mockResolvedValueOnce(undefined);

    renderDialog()

    fireEvent.click(screen.getByRole("save-button"));

    await waitFor(() =>
      expect(screen.getByTestId("retry-button")).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByTestId("retry-button"));

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenLastCalledWith(
        "1",
        expect.objectContaining({ version: 2 }),
      );
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("closes and shows toast when record for 404 RecordNotFound Error is encountered", async () => {
    mockUpdate.mockRejectedValue(
      new RecordNotFoundError("Record not found or has been deleted"),
    );

    renderDialog()

    fireEvent.click(screen.getByRole("save-button"));

    await waitFor(() => {
      // Dialog should close automatically on 404
      expect(mockOnClose).toHaveBeenCalled();
    });

    // Validation error panel should NOT appear (it's a toast, dialog closes)
    expect(screen.queryByTestId("validation-error")).not.toBeInTheDocument();
  });

  it("shows permission error for viewer and does not update", async () => {
    setupRoleMocks(false, false);

    mockUpdate.mockRejectedValue(
      new Error(
        "You do not have permission to perform this action. Request access from Admin",
      ),
    );

    renderDialog()

    fireEvent.click(screen.getByRole("save-button"));

    await waitFor(() => {
      expect(screen.getByTestId("validation-error")).toBeInTheDocument();
    });

    expect(mockUpdate).toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
    expect(screen.getByText(/do not have permission/i)).toBeInTheDocument();
  });
});
