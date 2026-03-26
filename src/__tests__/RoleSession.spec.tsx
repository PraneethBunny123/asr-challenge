import { renderHook } from "@testing-library/react";
import { useRole } from "@/app/(main)/dashboard/hooks/useRole";
import { mockSession } from "./helpers/mockHooks";

vi.mock("@/lib/auth-client", () => ({
  useSession: vi.fn(),
}));

describe("useRole — viewer", () => {
  beforeEach(() => mockSession("viewer"));

  it("returns isViewer true", () => {
    const { result } = renderHook(() => useRole());
    expect(result.current.isViewer).toBe(true);
    expect(result.current.isReviewer).toBe(false);
    expect(result.current.isAdmin).toBe(false);
  });

  it("cannot create, update, or delete", () => {
    const { result } = renderHook(() => useRole());
    expect(result.current.canCreate).toBe(false);
    expect(result.current.canUpdate).toBe(false);
    expect(result.current.canDelete).toBe(false);
  });
});

describe("useRole — reviewer", () => {
  beforeEach(() => mockSession("reviewer"));

  it("returns isReviewer true", () => {
    const { result } = renderHook(() => useRole());
    expect(result.current.isReviewer).toBe(true);
    expect(result.current.isViewer).toBe(false);
    expect(result.current.isAdmin).toBe(false);
  });

  it("can create and update but not delete", () => {
    const { result } = renderHook(() => useRole());
    expect(result.current.canCreate).toBe(true);
    expect(result.current.canUpdate).toBe(true);
    expect(result.current.canDelete).toBe(false);
  });
});

describe("useRole — admin", () => {
  beforeEach(() => mockSession("admin"));

  it("returns isAdmin true", () => {
    const { result } = renderHook(() => useRole());
    expect(result.current.isAdmin).toBe(true);
    expect(result.current.isViewer).toBe(false);
    expect(result.current.isReviewer).toBe(false);
  });

  it("can create, update, and delete", () => {
    const { result } = renderHook(() => useRole());
    expect(result.current.canCreate).toBe(true);
    expect(result.current.canUpdate).toBe(true);
    expect(result.current.canDelete).toBe(true);
  });
});

describe("useRole — no session", () => {
  beforeEach(() => mockSession(null));

  it("defaults all permissions to false", () => {
    const { result } = renderHook(() => useRole());
    expect(result.current.canCreate).toBe(false);
    expect(result.current.canUpdate).toBe(false);
    expect(result.current.canDelete).toBe(false);
  });
});