export function Skeleton({ className = '', variant = 'rect' }: { className?: string; variant?: 'rect' | 'circle' | 'text' }) {
  const baseStyles = 'animate-pulse bg-gray-200 dark:bg-gray-700';
  
  const variants = {
    rect: 'rounded',
    circle: 'rounded-full',
    text: 'rounded h-4',
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`}></div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton variant="circle" className="w-12 h-12" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="w-3/4" />
          <Skeleton variant="text" className="w-1/2" />
        </div>
      </div>
      <Skeleton variant="rect" className="h-32 w-full" />
      <div className="space-y-2">
        <Skeleton variant="text" className="w-full" />
        <Skeleton variant="text" className="w-5/6" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
          <Skeleton variant="circle" className="w-10 h-10" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" className="w-2/3" />
            <Skeleton variant="text" className="w-1/3" />
          </div>
          <Skeleton variant="text" className="w-24" />
        </div>
      ))}
    </div>
  );
}
