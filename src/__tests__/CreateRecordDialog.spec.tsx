import { screen, fireEvent, waitFor } from "@testing-library/react";
import CreateRecordDialog from "@/app/(main)/dashboard/components/CreateRecordDialog";
import { renderWithContext, mockCreate } from "./helpers/mockHooks";

const mockOnClose = vi.fn();

function renderDialog() {
  return renderWithContext(<CreateRecordDialog onClose={mockOnClose} />);
}

describe("CreateRecordDialog", () => {
  beforeEach(() => {
    mockCreate.mockReset();
    mockOnClose.mockReset();
  });

  it("renders name, description and note fields", () => {
    renderDialog();
    expect(screen.getByPlaceholderText(/specimen name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/description/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/note/i)).toBeInTheDocument();
  });

  it("shows validation error when name is too short", async () => {
    renderDialog();
    fireEvent.change(screen.getByPlaceholderText(/specimen name/i), {
      target: { value: "A" },
    });
    fireEvent.change(screen.getByPlaceholderText(/description/i), {
      target: { value: "Valid description here" },
    });
    fireEvent.click(screen.getByRole("create-record-button"));

    await waitFor(() => {
      expect(screen.getByRole("create-record-zod-error")).toBeInTheDocument();
    });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("shows validation error when description is too short", async () => {
    renderDialog();
    fireEvent.change(screen.getByPlaceholderText(/specimen name/i), {
      target: { value: "Valid Name" },
    });
    fireEvent.change(screen.getByPlaceholderText(/description/i), {
      target: { value: "Hi" },
    });
    fireEvent.click(screen.getByRole("create-record-button"));

    await waitFor(() => {
      expect(screen.getByRole("create-record-zod-error")).toBeInTheDocument();
    });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("calls createRecord with correct data including note", async () => {
    mockCreate.mockResolvedValue(undefined);
    renderDialog();

    fireEvent.change(screen.getByPlaceholderText(/specimen name/i), {
      target: { value: "Anopheles gambiae" },
    });
    fireEvent.change(screen.getByPlaceholderText(/description/i), {
      target: { value: "Collected near riverbank" },
    });
    fireEvent.change(screen.getByPlaceholderText(/note/i), {
      target: { value: "Needs PCR" },
    });
    fireEvent.click(screen.getByRole("create-record-button"));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith({
        name: "Anopheles gambiae",
        description: "Collected near riverbank",
        note: "Needs PCR",
      });
    });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("shows inline error and does not close on server failure", async () => {
    mockCreate.mockRejectedValue(new Error("Name and Description are required"));
    renderDialog();

    fireEvent.change(screen.getByPlaceholderText(/specimen name/i), {
      target: { value: "Anopheles" },
    });
    fireEvent.change(screen.getByPlaceholderText(/description/i), {
      target: { value: "         " },
    });
    fireEvent.click(screen.getByRole("create-record-button"));

    await waitFor(() => {
      expect(
        screen.getByText("Name and Description are required"),
      ).toBeInTheDocument();
    });
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("disables submit button while saving", async () => {
    mockCreate.mockReturnValue(new Promise(() => {}));
    renderDialog();

    fireEvent.change(screen.getByPlaceholderText(/specimen name/i), {
      target: { value: "Anopheles gambiae" },
    });
    fireEvent.change(screen.getByPlaceholderText(/description/i), {
      target: { value: "Collected near riverbank" },
    });
    fireEvent.click(screen.getByRole("create-record-button"));

    await waitFor(() => {
      expect(
        screen.getByRole("create-record-button"),
      ).toBeDisabled();
    });
  });

  it("calls onClose when Close button is clicked", () => {
    renderDialog();
    fireEvent.click(screen.getByRole("create-record-close-button"));
    expect(mockOnClose).toHaveBeenCalled();
  });
});