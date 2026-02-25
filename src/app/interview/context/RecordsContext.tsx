'use client';

/*
 * RecordsContext is the single source of truth for all record data in this
 * interview exercise.  It encapsulates data fetching from the mock API,
 * exposes mutation functions for updating records, and maintains a simple
 * history log of status changes.
 */

import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { RecordItem, RecordStatus, RecordHistoryEntry } from '../types';

import { fetchRecords, updateRecord, VersionConflictApiError } from '../api/apiService';

export interface RecordsContextValue {
  records: RecordItem[];
  loading: boolean;
  error: string | null;

  // pagination
  page: number;
  limit: number;
  totalCount: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  /**
   * Update a record’s status and/or note. This function calls the mock API
   * and then updates local state. Errors are set on the context.
   */
  updateRecord: (id: string, updates: { status?: RecordStatus; note?: string, version: number }) => Promise<void>;
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

  // pagination
  const [page, setPageState] = useState<number>(1);
  const [limit, setLimitState] = useState<number>(6);
  const [totalCount, setTotalCount] = useState<number>(0);
  
  const refresh = useCallback(async (targetPage?: number, targetLimit?: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchRecords(targetPage ?? page, targetLimit ?? limit)
      setRecords(response.records);
      setTotalCount(response.totalCount)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [page, limit])

  useEffect(() => {
    refresh();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  const setPage= (newPage: number) => {
    setPageState(newPage)
  }

  const setLimit = (newLimit: number) => {
    setLimitState(newLimit);
    setPageState(1); 
  };

  const update = async (
    id: string,
    updates: { status?: RecordStatus; note?: string, version: number }
  ) => {
    setError(null);

    const previousRecord = records.find((r) => r.id === id);
    if (!previousRecord) {
      throw new Error(`Record ${id} not found`);
    }

    // Apply optimistic update immediately
    const optimisticRecord: RecordItem = {
      ...previousRecord,
      ...updates,
      version: previousRecord.version, // keep old version until server confirms
    };
    setRecords((prev) => prev.map((r) => (r.id === id ? optimisticRecord : r)));
    
    try {
      const updatedRecord = await updateRecord(id, {...updates, previousStatus: previousRecord.status});
      setRecords((prev) => prev.map((r) => (r.id === updatedRecord.id ? updatedRecord : r)));

      if(updates.status && previousRecord.status !== updates.status) {
        const entry: RecordHistoryEntry = {
          id,
          previousStatus: previousRecord.status,
          newStatus: updates.status,
          note: updates.note,
          timestamp: new Date().toISOString(),
        }
        setHistory((prevHistory) => [entry, ...prevHistory]);
      }
    } catch (err) {
      // Rollback optimistic change
      setRecords((prev) => prev.map((r) => (r.id === id ? previousRecord : r)));

      if (err instanceof VersionConflictApiError) {
        // Swap in the authoritative server record so the UI reflects reality
        setRecords((prev) => prev.map((r) => (r.id === id ? err.serverRecord : r)));
        // Re-throw so the dialog can surface conflict UI
        throw err;
      }
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err
    }
  }

  const clearHistory = () => {
    setHistory([]);
  }

  const value = {
    records,
    loading,
    error,
    page,
    limit,
    totalCount,
    setPage,
    setLimit,
    updateRecord: update,
    refresh,
    history,
    clearHistory,
  };
  return <RecordsContext.Provider value={value}>{children}</RecordsContext.Provider>;
}

