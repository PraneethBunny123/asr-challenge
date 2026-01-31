'use client';

/*
 * RecordsContext is the single source of truth for all record data in this
 * interview exercise.  It encapsulates data fetching from the mock API,
 * exposes mutation functions for updating records, and maintains a simple
 * history log of status changes.
 */

import React, { createContext, useState, useEffect } from 'react';
import type { RecordItem, RecordStatus, RecordHistoryEntry } from '../types';

import { fetchRecords, updateRecord } from '../api/apiService';

export interface RecordsContextValue {
  records: RecordItem[];
  loading: boolean;
  error: string | null;
  /**
   * Update a record’s status and/or note. This function calls the mock API
   * and then updates local state. Errors are set on the context.
   */
  updateRecord: (id: string, updates: { status?: RecordStatus; note?: string }) => Promise<void>;
  /**
   * Refresh the list of records from the API. Useful after a mutation
   * or when you need the latest state.
   */
  refresh: () => Promise<void>;

  /**
   * A log of record updates performed during this session. Each entry
   * records the record id, previous and new status, optional note and a
   * timestamp. This can be used to build an audit log or to teach
   * candidates about derived state.
   */
  history: RecordHistoryEntry[];
  /**
   * Clears the history log.
   */
  clearHistory: () => void;
}

export const RecordsContext = createContext<RecordsContextValue | null>(null);

export function RecordsProvider({ children }: { children: React.ReactNode }) {
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [history, setHistory] = useState<RecordHistoryEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchRecords()
      setRecords(response);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  const update = async (
    id: string,
    updates: { status?: RecordStatus; note?: string }
  ) => {
    setError(null);

    try {
      const previousRecord = records.find((r) => r.id === id);
      const updatedRecord = await updateRecord(id, updates);
      
      setRecords((prev) => prev.map((r) => (r.id === updatedRecord.id ? updatedRecord : r)));

      if(previousRecord && updates.status && previousRecord.status !== updates.status) {
        const entry: RecordHistoryEntry = {
          id,
          previousStatus: previousRecord.status,
          newStatus: updates.status,
          note: updates.note,
          timestamp: new Date().toISOString(),
        }
        setHistory((prevHistory) => [entry, ...prevHistory]);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const clearHistory = () => {
    setHistory([]);
  }

  const value = {
    records,
    loading,
    error,
    updateRecord: update,
    refresh,
    history,
    clearHistory,
  };
  return <RecordsContext.Provider value={value}>{children}</RecordsContext.Provider>;
}

