import { Skeleton } from "@/components/ui/skeleton";

export function DemografiTableLoading() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-[200px]" />
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
              <Skeleton className="h-6 w-full" />
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

export function DemografiFormLoading() {
  return (
    <div className="space-y-8">
      {/* Basic Info */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-[150px]" />
        <div className="grid gap-4">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      
      {/* Data Global */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-[150px]" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      
      {/* Data Kelompok Umur */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-[180px]" />
        <div className="space-y-4">
          {Array(3).fill(null).map((_, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-md">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
          <Skeleton className="h-10 w-[120px]" />
        </div>
      </div>
      
      {/* Data Dusun */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-[150px]" />
        <div className="space-y-4">
          {Array(2).fill(null).map((_, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
          <Skeleton className="h-10 w-[120px]" />
        </div>
      </div>
      
      {/* Submit Button */}
      <div className="flex justify-end">
        <Skeleton className="h-10 w-[120px]" />
      </div>
    </div>
  );
}
