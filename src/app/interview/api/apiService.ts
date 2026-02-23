import type { RecordItem, RecordStatus, PaginatedRecordsResponse, VersionConflictError } from "../types";

// Custom error class to represent a version conflict response from the API. This allows us to throw a specific error type that can be caught and handled in the UI, providing access to the server's current record data for resolution.
export class VersionConflictApiError extends Error {
  readonly serverRecord: RecordItem;
  constructor(serverRecord: RecordItem) {
    super('version_conflict');
    this.name = 'VersionConflictApiError';
    this.serverRecord = serverRecord;
  }
}

// Fetches the list of records from the mock API.
export async function fetchRecords(
  page = 1,
  limit = 6,
): Promise<PaginatedRecordsResponse> {
  const response = await fetch(`/api/mock/records?page=${page}&limit=${limit}`);
    if(!response.ok) {
      throw new Error(`Failed to load records: ${response.statusText}`);
    }

  return response.json();
}

// Updates a record via the mock API.
export async function updateRecord(
  id: string,
  updates: { status?: RecordStatus; note?: string, version: number }
): Promise<RecordItem> {
  const response = await fetch('/api/mock/records', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...updates }),
  })

  if (response.status === 409) {
    const body: VersionConflictError = await response.json();
    throw new VersionConflictApiError(body.serverRecord);
  }

  if (!response.ok) {
    throw new Error(`Failed to update record: ${response.statusText}`);
  }

  return response.json();
}