import { useRecords } from './useRecords';

export function useRecordPagination() {
  const { page, limit, totalCount, setPage, loading } = useRecords();

  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  const hasPrev = page > 1;
  const hasNext = page * limit < totalCount;

  const goToPrev = () => {
    if (hasPrev && !loading) setPage(page - 1);
  };

  const goToNext = () => {
    if (hasNext && !loading) setPage(page + 1);
  };

  return { page, limit, totalCount, totalPages, hasPrev, hasNext, goToPrev, goToNext };
}