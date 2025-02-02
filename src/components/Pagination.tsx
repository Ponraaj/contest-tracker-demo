import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
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
      return [1, 2, 3, 4, "...", totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  return (
    <div className='flex items-center justify-center mt-8 pb-5'>
      {/* Previous Button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
          currentPage === 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-gray-800 text-white hover:bg-gray-700"
        }`}>
        Prev
      </button>

      {/* Page Numbers */}
      <div className='flex items-center space-x-2 mx-4'>
        {pageNumbers().map((page, index) =>
          page === "..." ? (
            <span key={index} className='px-4 py-2 text-gray-500 font-semibold'>
              ...
            </span>
          ) : (
            <button
              key={index}
              onClick={() => handlePageChange(page as number)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-blue-500 hover:text-white"
              }`}>
              {page}
            </button>
          )
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
          currentPage === totalPages
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-gray-800 text-white hover:bg-gray-700"
        }`}>
        Next
      </button>
    </div>
  );
};

export default Pagination;
