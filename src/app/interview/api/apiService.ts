import type { RecordItem, RecordStatus, PaginatedRecordsResponse } from "../types";

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
  updates: { status?: RecordStatus; note?: string }
): Promise<RecordItem> {
  const response = await fetch('/api/mock/records', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...updates }),
  })

  if (!response.ok) {
    throw new Error(`Failed to update record: ${response.statusText}`);
  }

  return response.json();
}