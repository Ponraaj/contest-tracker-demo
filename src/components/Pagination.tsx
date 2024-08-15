import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const range = (start: number, end: number) => {
    return Array.from({ length: end - start + 1 }, (_, i) => i + start);
  };

  const pageNumbers = () => {
    if (totalPages <= 5) {
      return range(1, totalPages);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5, '...'];
    }

    if (currentPage >= totalPages - 2) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  return (
    <div className="flex items-center justify-center space-x-4 mt-8 pb-5">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded border-[1px]  border-solid border-black ${currentPage === 1 ? 'bg-gray-200 text-gray-400' : 'bg-gray-200 text-black'} `}
      >
        Prev
      </button>

      {pageNumbers().map((page, index) =>
        page === '...' ? (
          <span key={index} className="px-4 py-2 text-black">...</span>
        ) : (
          <button
            key={index}
            onClick={() => handlePageChange(page as number)}
            className={`px-4 py-2 rounded border-solid border-[1px] border-black ${currentPage === page ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded border-solid border-[1px] border-black ${currentPage === totalPages ? 'bg-gray-200 text-gray-400' : 'bg-gray-200 text-black'}`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
