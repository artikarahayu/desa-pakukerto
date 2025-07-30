import { Skeleton } from "@/components/ui/skeleton";

export function BeritaTableLoading() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-[150px]" />
        <Skeleton className="h-10 w-[150px]" />
      </div>
      
      <div className="border rounded-md">
        <div className="p-4 border-b">
          <div className="grid grid-cols-5 gap-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-[80px]" />
          </div>
        </div>
        
        <div className="p-4">
          {Array(5).fill(null).map((_, index) => (
            <div key={index} className="grid grid-cols-5 gap-4 py-3">
              <div className="flex items-center">
                <Skeleton className="h-10 w-16 rounded-md" />
              </div>
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function BeritaFormLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-5 w-[100px]" />
        <Skeleton className="h-10 w-full" />
      </div>
      
      <div className="space-y-2">
        <Skeleton className="h-5 w-[100px]" />
        <Skeleton className="h-40 w-full rounded-md" />
      </div>
      
      <div className="space-y-2">
        <Skeleton className="h-5 w-[100px]" />
        <Skeleton className="h-64 w-full rounded-md" />
      </div>
      
      <Skeleton className="h-10 w-[120px]" />
    </div>
  );
}
