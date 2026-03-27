/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AuthForm from "@/components/AuthForm";
import { signIn, signUp } from "@/lib/auth-client";

vi.mock("@/lib/auth-client", () => ({
  signIn: { email: vi.fn() },
  signUp: { email: vi.fn() },
  useSession: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
  useSearchParams: () => ({ get: () => null }),
}));

const locationSpy = vi.spyOn(window, "location", "get");

let mockLocationHref = "";
beforeEach(() => {
  mockLocationHref = "";
  locationSpy.mockReturnValue({
    ...window.location,
    get href() {
      return mockLocationHref;
    },
    set href(value: string) {
      mockLocationHref = value;
    },
  } as Location);
});


function mockSignInSuccess() {
  vi.mocked(signIn.email).mockImplementation(async (_data, callbacks) => {
    callbacks?.onSuccess?.({} as any);
  });
}

function mockSignInError(message: string) {
  vi.mocked(signIn.email).mockImplementation(async (_data, callbacks) => {
    callbacks?.onError?.({ error: { message } } as any);
  });
}

function mockSignUpSuccess() {
  vi.mocked(signUp.email).mockImplementation(async (_data, callbacks) => {
    callbacks?.onSuccess?.({} as any);
  });
}
 
function mockSignUpError(message: string) {
  vi.mocked(signUp.email).mockImplementation(async (_data, callbacks) => {
    callbacks?.onError?.({ error: { message } } as any);
  });
}

function fillSignIn(email = "test@example.com", password = "password123") {
  fireEvent.change(screen.getByPlaceholderText(/enter.*email/i), {
    target: { value: email },
  });
  fireEvent.change(screen.getByPlaceholderText(/enter.*password/i), {
    target: { value: password },
  });
}
 
function fillSignUp(
  firstName = "Jane",
  lastName = "Smith",
  email = "jane@example.com",
  password = "securepassword",
) {
  fireEvent.change(screen.getByPlaceholderText(/first name/i), { target: { value: firstName } });
  fireEvent.change(screen.getByPlaceholderText(/last name/i), { target: { value: lastName } });
  fireEvent.change(screen.getByPlaceholderText(/enter.*email/i), { target: { value: email } });
  fireEvent.change(screen.getByPlaceholderText(/enter.*password/i), { target: { value: password } });
}

describe("AuthForm - sign-in", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
 
  it("renders email and password fields only", () => {
    render(<AuthForm type="sign-in" />);
    expect(screen.getByPlaceholderText(/enter.*email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter.*password/i)).toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/first name/i)).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/last name/i)).not.toBeInTheDocument();
  });
 
  it("shows validation error for invalid email", async () => {
    render(<AuthForm type="sign-in" />);
    fillSignIn("not-an-email", "password123");
    fireEvent.click(screen.getByRole("auth-form-submit"));
 
    await waitFor(() => {
      expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    });
    expect(signIn.email).not.toHaveBeenCalled();
  });
 
  it("shows validation error for password shorter than 8 characters", async () => {
    render(<AuthForm type="sign-in" />);
    fillSignIn("test@example.com", "short");
    fireEvent.click(screen.getByRole("auth-form-submit"));
 
    await waitFor(() => {
      expect(screen.getByText(/Too small/i)).toBeInTheDocument();
    });
    expect(signIn.email).not.toHaveBeenCalled();
  });
 
  it("calls signIn.email with correct credentials on valid submit", async () => {
    mockSignInSuccess();
    render(<AuthForm type="sign-in" />);
    fillSignIn();
    fireEvent.click(screen.getByRole("auth-form-submit"));
 
    await waitFor(() => {
      expect(signIn.email).toHaveBeenCalledWith(
        { email: "test@example.com", password: "password123" },
        expect.objectContaining({ onSuccess: expect.any(Function), onError: expect.any(Function) }),
      );
    });
  });
 
  it("redirects to /dashboard after successful sign-in", async () => {
    mockSignInSuccess();
    render(<AuthForm type="sign-in" />);
    fillSignIn();
    fireEvent.click(screen.getByRole("auth-form-submit"));
 
    await waitFor(() => {
      expect(mockLocationHref).toBe("/dashboard");
    });
  });
 
  it("shows server error message on failed sign-in", async () => {
    mockSignInError("Invalid email or password");
    render(<AuthForm type="sign-in" />);
    fillSignIn();
    fireEvent.click(screen.getByRole("auth-form-submit"));
 
    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    });
    expect(mockLocationHref).toBe("");
  });
 
  it("has a link to the sign-up page", () => {
    render(<AuthForm type="sign-in" />);
    expect(screen.getByRole("signIn-signUp-link")).toHaveAttribute("href", "/sign-up");
  });
});

describe("AuthForm — sign-up", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
 
  it("renders first name, last name, email and password fields", () => {
    render(<AuthForm type="sign-up" />);
    expect(screen.getByPlaceholderText(/first name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/last name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter.*email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter.*password/i)).toBeInTheDocument();
  });
 
  it("shows validation error when first name is too short", async () => {
    render(<AuthForm type="sign-up" />);
    fillSignUp("A"); 
    fireEvent.click(screen.getByRole("auth-form-submit"));
 
    await waitFor(() => {
      expect(screen.getByText(/Too small/i)).toBeInTheDocument();
    });
    expect(signUp.email).not.toHaveBeenCalled();
  });
 
  it("calls signUp.email with first + last name concatenated", async () => {
    mockSignUpSuccess();
    render(<AuthForm type="sign-up" />);
    fillSignUp();
    fireEvent.click(screen.getByRole("auth-form-submit"));
 
    await waitFor(() => {
      expect(signUp.email).toHaveBeenCalledWith(
        { email: "jane@example.com", password: "securepassword", name: "Jane Smith" },
        expect.objectContaining({ onSuccess: expect.any(Function), onError: expect.any(Function) }),
      );
    });
  });
 
  it("redirects to /dashboard after successful sign-up", async () => {
    mockSignUpSuccess();
    render(<AuthForm type="sign-up" />);
    fillSignUp();
    fireEvent.click(screen.getByRole("auth-form-submit"));
 
    await waitFor(() => {
      expect(mockLocationHref).toBe("/dashboard");
    });
  });
 
  it("shows server error when email already exists", async () => {
    mockSignUpError("User already exists. Use another email.");
    render(<AuthForm type="sign-up" />);
    fillSignUp("Jane", "Smith", "existing@example.com");
    fireEvent.click(screen.getByRole("auth-form-submit"));
 
    await waitFor(() => {
      expect(screen.getByText("User already exists. Use another email.")).toBeInTheDocument();
    });
    expect(mockLocationHref).toBe("");
  });
 
  it("has a link back to the sign-in page", () => {
    render(<AuthForm type="sign-up" />);
    expect(screen.getByRole("signIn-signUp-link")).toHaveAttribute("href", "/sign-in");
  });
});