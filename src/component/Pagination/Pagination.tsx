import React, { useMemo } from 'react';

const DOTS = '...';

const range = (start: number, end: number) => {
  let length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

interface UsePaginationProps {
  totalPages: number;
  currentPage: number;
  siblingCount?: number;
}

const usePagination = ({
  totalPages,
  currentPage,
  siblingCount = 1,
}: UsePaginationProps) => {
  const paginationRange = useMemo(() => {
   
    const totalPageNumbers = siblingCount + 5;
 if (totalPageNumbers >= totalPages) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPages
    );
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;
    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = range(1, leftItemCount);
      return [...leftRange, DOTS, totalPages];
    }
    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = range(
        totalPages - rightItemCount + 1,
        totalPages
      );
      return [firstPageIndex, DOTS, ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }

    // Default case (should be covered, but for safety)
    return range(1, totalPages);

  }, [totalPages, currentPage, siblingCount]);

  return paginationRange;
};


interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
  
    const paginationRange = usePagination({ currentPage, totalPages, siblingCount: 1 });
  
    // If there's only one page, or pagination range is somehow empty, don't render
    if (currentPage === 0 || (paginationRange && paginationRange.length < 2)) {
      return null;
    }
  
    const onFirst = () => onPageChange(1);
    const onLast = () => onPageChange(totalPages);
    const onNext = () => onPageChange(currentPage + 1);
    const onPrevious = () => onPageChange(currentPage - 1);
  
    return (
      <nav aria-label="Pagination" className="flex justify-center my-8 space-x-2 items-center">
        {/* First Page Button */}
        <button
          onClick={onFirst}
          disabled={currentPage === 1}
          className="px-3 py-2 rounded-lg bg-white text-gray-700 disabled:opacity-50 hover:bg-gray-200 shadow"
          aria-label="Go to first page"
        >
          &laquo;
        </button>
        {/* Previous Page Button */}
        <button
          onClick={onPrevious}
          disabled={currentPage === 1}
          className="px-3 py-2 rounded-lg bg-white text-gray-700 disabled:opacity-50 hover:bg-gray-200 shadow"
          aria-label="Go to previous page"
        >
          &lsaquo;
        </button>
  
        {/* Page Numbers */}
        {paginationRange?.map((pageNumber, index) => {
          // If it's a DOTS separator
          if (pageNumber === DOTS) {
            return (
              <span 
                key={`${DOTS}-${index}`} 
                className="px-4 py-2 text-gray-500"
                aria-hidden="true"
              >
                ...
              </span>
            );
          }
  
          // If it's a page number
          return (
            <button
              key={`page-${pageNumber}`}
              onClick={() => onPageChange(pageNumber as number)}
              className={`
                px-4 py-2 mx-1 rounded-full font-semibold transition
                ${currentPage === pageNumber 
                  ? 'bg-yellow-500 text-white shadow-lg' 
                  : 'bg-white text-gray-700 hover:bg-gray-200'
                }
              `}
              aria-label={currentPage === pageNumber ? `Current page, page ${pageNumber}` : `Go to page ${pageNumber}`}
              aria-current={currentPage === pageNumber ? 'page' : undefined}
            >
              {pageNumber}
            </button>
          );
        })}
        <button
          onClick={onNext}
          disabled={currentPage === totalPages}
          className="px-3 py-2 rounded-lg bg-white text-gray-700 disabled:opacity-50 hover:bg-gray-200 shadow"
          aria-label="Go to next page"
        >
          &rsaquo;
        </button>
        <button
          onClick={onLast}
          disabled={currentPage === totalPages}
          className="px-3 py-2 rounded-lg bg-white text-gray-700 disabled:opacity-50 hover:bg-gray-200 shadow"
          aria-label="Go to last page"
        >
          &raquo;
        </button>
      </nav>
    );
  };
export default Pagination;