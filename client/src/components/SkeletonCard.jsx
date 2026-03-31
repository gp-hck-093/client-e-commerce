export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
      {/* IMAGE SKELETON */}
      <div className="w-full h-64 bg-gray-200"></div>

      {/* CONTENT SKELETON */}
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded-full w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded-full w-1/2"></div>
        
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 bg-gray-200 rounded-full w-1/3"></div>
          <div className="h-8 bg-gray-200 rounded-full w-1/4"></div>
        </div>
      </div>
    </div>
  );
}
