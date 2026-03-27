import { useRole } from "@/app/(main)/dashboard/hooks/useRole";
import { useRecords } from "@/app/(main)/dashboard/hooks/useRecords";
import { RecordsContext } from "@/app/(main)/dashboard/context/RecordsContext";
import { useSession } from "@/lib/auth-client";
import { render } from "@testing-library/react";

type OverridesContextValue = Partial<React.ContextType<typeof RecordsContext>>

export const mockDelete = vi.fn();
export const mockCreate = vi.fn();
export const mockUpdate = vi.fn();

export const baseContextValue = {
  records: [],
  loading: false,
  error: null,
  page: 1,
  limit: 6,
  totalCount: 12,
  setPage: vi.fn(),
  setLimit: vi.fn(),
  createRecord: mockCreate,
  updateRecord: mockUpdate,
  deleteRecord: mockDelete,
  refresh: vi.fn(),
  history: [],
  clearHistory: vi.fn(),
};

export function makeContext(
  overrides: OverridesContextValue = {},
) {
  return { ...baseContextValue, ...overrides };
}

export function renderWithContext(
  ui: React.ReactElement,
  contextValue: OverridesContextValue = {},
) {  return render(
    <RecordsContext.Provider value={makeContext(contextValue)}>
      {ui}
    </RecordsContext.Provider>
  );
}

export function makeWrapper(
  overrides: OverridesContextValue = {},
) {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <RecordsContext.Provider value={makeContext(overrides)}>
      {children}
    </RecordsContext.Provider>
  );

  wrapper.displayName = "RecordsTestWrapper";

  return wrapper
}

export function setupRoleMocks(admin = false, reviewer = false) {
  vi.mocked(useRole).mockReturnValue({
    role: admin ? "admin" : reviewer ? "reviewer" : "viewer",
    isViewer: !(admin || reviewer),
    isReviewer: reviewer,
    isAdmin: admin,
    canCreate: admin || reviewer,
    canUpdate: admin || reviewer,
    canDelete: admin,
  });
}

export function setupRecordsMocks(
  overrides: OverridesContextValue = {},
) {
  vi.mocked(useRecords).mockReturnValue(makeContext(overrides));
}

export function setupMocks(
  admin = false, 
  reviewer = false, 
  overrides: object = {}) {
  setupRoleMocks(admin, reviewer)
  setupRecordsMocks(overrides)
}

export function mockSession(role: string | null) {
  vi.mocked(useSession).mockReturnValue({
    data: role ? { user: { role } } : null,
    isPending: false,
    error: null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);
}