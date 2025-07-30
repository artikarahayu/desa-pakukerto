import { Skeleton } from "@/components/ui/skeleton";

export function GaleriTableLoading() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-[150px]" />
        <Skeleton className="h-10 w-[150px]" />
      </div>
      
      <div className="border rounded-md">
        <div className="p-4 border-b">
          <div className="grid grid-cols-4 gap-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-[80px]" />
          </div>
        </div>
        
        <div className="p-4">
          {Array(5).fill(null).map((_, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 py-3">
              <div className="flex items-center">
                <Skeleton className="h-16 w-24 rounded-md" />
              </div>
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function GaleriFormLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-5 w-[100px]" />
        <Skeleton className="h-10 w-full" />
      </div>
      
      <div className="space-y-2">
        <Skeleton className="h-5 w-[100px]" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
      
      <div className="space-y-2">
        <Skeleton className="h-5 w-[100px]" />
        <Skeleton className="h-40 w-full rounded-md" />
      </div>
      
      <Skeleton className="h-10 w-[120px] ml-auto" />
    </div>
  );
}

export function GaleriPreviewLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-5 w-[150px]" />
      <Skeleton className="h-[200px] w-full rounded-md" />
    </div>
  );
}
