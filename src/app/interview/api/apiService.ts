import type { RecordItem, RecordStatus } from "../types";

// Fetches the list of records from the mock API.
export async function fetchRecords(): Promise<RecordItem[]> {
  const response = await fetch('/api/mock/records');
    if(!response.ok) {
      throw new Error(`Failed to fetch records`);
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
    throw new Error(`Failed to update record`);
  }

  return response.json();
}