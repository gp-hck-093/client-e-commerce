export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}) {
  return (
    <div className="flex justify-center items-center gap-4 mt-10">
      {/* PREV */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-xl border bg-white hover:bg-orange-50 disabled:opacity-40 transition"
      >
        ← Prev
      </button>

      {/* PAGE INFO */}
      <div className="px-5 py-2 rounded-xl bg-orange-500 text-white font-semibold shadow">
        Page {currentPage} of {totalPages}
      </div>

      {/* NEXT */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-xl border bg-white hover:bg-orange-50 disabled:opacity-40 transition"
      >
        Next →
      </button>
    </div>
  );
}
