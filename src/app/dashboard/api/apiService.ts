import type { RecordItem, RecordStatus, PaginatedRecordsResponse, VersionConflictError, CreateRecordInput } from "../types";

// Custom error class to represent a version conflict response (409) from the API. 
export class VersionConflictApiError extends Error {
  readonly serverRecord: RecordItem;
  constructor(serverRecord: RecordItem) {
    super('version_conflict');
    this.name = 'VersionConflictApiError';
    this.serverRecord = serverRecord;
  }
}

// Custom error class to represent 404 responses from the API. updateRecord and deleteRecord throws 404
export class RecordNotFoundError extends Error {
  constructor(message = "Record not found or has been deleted") {
    super(message);
    this.name = "RecordNotFoundError";
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
  updates: { status?: RecordStatus; note?: string, version: number; previousStatus?: RecordStatus }
): Promise<RecordItem> {
  const response = await fetch('/api/mock/records', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...updates }),
  })

  if (response.status === 404) {
    const body = await response.json().catch(() => null);
    throw new RecordNotFoundError(body?.error);
  }

  if (response.status === 409) {
    const body: VersionConflictError = await response.json();
    throw new VersionConflictApiError(body.serverRecord);
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? `Failed to update record: ${response.statusText}`);
  }

  return response.json();
}

export async function createRecord(
  input: CreateRecordInput
): Promise<RecordItem> {
  const response = await fetch('/api/mock/records', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? `Failed to create record: ${response.statusText}`);
  }

  return response.json();
}

export async function deleteRecord(
  id: string
): Promise<void> {
  const response = await fetch('/api/mock/records', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({id}),
  })

  if (response.status === 404) {
    const body = await response.json().catch(() => null);
    throw new RecordNotFoundError(body?.error);
  }
  
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? `Failed to delete record: ${response.statusText}`);
  }
}