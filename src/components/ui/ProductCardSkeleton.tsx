import Skeleton from "./Skeleton";

export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
      <Skeleton className="aspect-[3/4] w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-5 w-24" />
      </div>
    </div>
  );
}
