import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRecordPagination } from "../hooks/useRecordPagination";

/**
 * RecordPagination renders Prev / Next controls wired to the pagination state
 * in RecordsContext. Prev is disabled on page 1; Next is disabled when the
 * current page is the last page.
 */
export default function RecordPagination() {
  const { page, totalPages, totalCount, limit, hasPrev, hasNext, goToPrev, goToNext } = useRecordPagination();

  if (totalCount === 0) return null;

  const from = Math.min((page - 1) * limit + 1, totalCount);
  const to = Math.min(page * limit, totalCount);

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-between pt-4"
    >
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Showing {from}-{to} of {totalCount}
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPrev}
          disabled={!hasPrev}
          aria-label="Previous page"
          data-testid="pagination-prev"
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </Button>

        <span className="text-sm tabular-nums select-none px-1">
          {page} / {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={goToNext}
          disabled={!hasNext}
          aria-label="Next page"
          data-testid="pagination-next"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </nav>
  );
}