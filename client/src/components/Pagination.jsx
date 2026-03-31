export default function Pagination({
  currentPage = 1,
  totalPages = 5,
  onPageChange,
}) {
  const pages = [...Array(totalPages)].map((_, i) => i + 1);

  return (
    <div className="flex justify-center items-center gap-2 mt-10">
      {/* PREV */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-40"
      >
        Prev
      </button>

      {/* NUMBERS */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 rounded-lg font-medium transition ${
            currentPage === page
              ? "bg-orange-500 text-white shadow"
              : "bg-white border hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}

      {/* NEXT */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
