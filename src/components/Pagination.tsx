interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex justify-center items-center py-4 space-x-2">
      {/* 첫 페이지 */}
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="px-2 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        </svg>
      </button>
      
      {/* 이전 페이지 */}
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="px-2 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* 페이지 번호들 */}
      {(() => {
        const startPage = Math.max(1, currentPage - 2)
        const endPage = Math.min(totalPages, currentPage + 2)
        const pages = []

        for (let i = startPage; i <= endPage; i++) {
          pages.push(
            <button
              key={i}
              onClick={() => onPageChange(i)}
              className={`px-3 py-1 rounded ${
                i === currentPage
                  ? 'text-[#AB43CE]'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {i}
            </button>
          )
        }
        return pages
      })()}

      {/* 다음 페이지 */}
      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-2 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* 마지막 페이지 */}
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="px-2 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}

export default Pagination 