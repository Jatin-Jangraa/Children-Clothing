import Skeleton from "./Skeleton";

export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-stone-200/70">
      <Skeleton className="aspect-[3/4] w-full rounded-none" />
      <div className="p-3.5 sm:p-4 space-y-2.5">
        <div className="flex justify-between items-center">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-8" />
        </div>
        <Skeleton className="h-4 w-full" />
        <div className="flex gap-2 items-center">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  );
}
