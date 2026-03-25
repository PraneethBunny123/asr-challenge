import { screen, fireEvent, waitFor } from "@testing-library/react";
import { DeleteDialogIcon } from "@/app/(main)/dashboard/components/DeleteDialog";
import { renderWithContext, mockDelete, setupMocks } from "./helpers/mockHooks";
import { toast } from "sonner";

vi.mock("@/app/(main)/dashboard/hooks/useRecords");
vi.mock("@/app/(main)/dashboard/hooks/useRole");
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

function renderDeleteDialog(name = "Specimen A", id = "1") {
  return renderWithContext(<DeleteDialogIcon name={name} id={id} />);
}

describe("DeleteDialogIcon", () => {
  beforeEach(() => {
    mockDelete.mockReset();
    setupMocks();
  });

  it("opens delete dialog upon clicking the trash icon", () => {
    renderDeleteDialog();

    fireEvent.click(screen.getByRole("delete-icon"));
    
    expect(screen.getByText(/this will delete/i)).toBeInTheDocument();
    expect(screen.getByRole("delete-dialog-delete")).toBeInTheDocument();
    expect(screen.getByRole("delete-dialog-cancel")).toBeInTheDocument();
  });

  it("calls deleteRecord with correct id when confirmed", async () => {
    mockDelete.mockResolvedValue(undefined);
    renderDeleteDialog("Specimen A", "42");

    fireEvent.click(screen.getByRole("delete-icon"));
    await waitFor(() => screen.getByRole("delete-dialog-delete"));

    fireEvent.click(screen.getByRole("delete-dialog-delete"));

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledWith("42");
    });
  });

  it("disables trigger while deleting", async () => {
    mockDelete.mockReturnValue(new Promise(() => {}));
    renderDeleteDialog();

    fireEvent.click(screen.getByRole("delete-icon"));
    await waitFor(() => screen.getByRole("delete-dialog-delete"));
    fireEvent.click(screen.getByRole("delete-dialog-delete"));

    await waitFor(() => {
      expect(screen.getByRole("delete-icon")).toBeDisabled();
    });
  });

  it("permission for delete records", async () => {
    mockDelete.mockRejectedValue(
      new Error("You do not have permission to perform this action. Request access from Admin"),
    );

    renderDeleteDialog();

    fireEvent.click(screen.getByRole("delete-icon"));
    await waitFor(() => {
      expect(screen.getByRole("delete-dialog-delete")).toBeInTheDocument()
    });
    fireEvent.click(screen.getByRole("delete-dialog-delete"));

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringMatching(/do not have permission/i)
      );
    });
  })
});