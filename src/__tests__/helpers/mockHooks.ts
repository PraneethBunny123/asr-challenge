import { useRole } from "@/app/(main)/dashboard/hooks/useRole";
import { useRecords } from "@/app/(main)/dashboard/hooks/useRecords";

export const mockDelete = vi.fn();
export const mockCreate = vi.fn();
export const mockUpdate = vi.fn();

export function setupRoleMocks(admin = false, reviewer = false) {
  vi.mocked(useRole).mockReturnValue({
    role: admin ? "admin" : reviewer ? "reviewer" : "viewer",
    isViewer: !(admin || reviewer),
    isReviewer: reviewer,
    isAdmin: admin,
    canCreate: admin,
    canUpdate: admin || reviewer,
    canDelete: admin,
  });
}

export function setupRecordsMocks(overrides = {}) {
  vi.mocked(useRecords).mockReturnValue({
    records: [],
    loading: false,
    error: null,
    page: 1,
    limit: 6,
    totalCount: 0,
    setPage: vi.fn(),
    setLimit: vi.fn(),
    createRecord: mockCreate,
    updateRecord: mockUpdate,
    deleteRecord: mockDelete,
    refresh: vi.fn(),
    history: [],
    clearHistory: vi.fn(),
    ...overrides,
  });
}

export function setupMocks(admin: boolean = false, reviewer: boolean = false, overrides: object = {}) {
  setupRoleMocks(admin, reviewer)
  setupRecordsMocks(overrides)
}