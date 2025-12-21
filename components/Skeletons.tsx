import { Card, Skeleton } from "@nextui-org/react";

export function CardSkeleton() {
  return (
    <Card className="bg-gray-900/50 border border-gray-800">
      <div className="p-6 space-y-3">
        <Skeleton className="rounded-lg">
          <div className="h-24 rounded-lg bg-gray-800"></div>
        </Skeleton>
        <div className="space-y-2">
          <Skeleton className="w-3/5 rounded-lg">
            <div className="h-4 w-3/5 rounded-lg bg-gray-800"></div>
          </Skeleton>
          <Skeleton className="w-4/5 rounded-lg">
            <div className="h-4 w-4/5 rounded-lg bg-gray-800"></div>
          </Skeleton>
        </div>
      </div>
    </Card>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="rounded-lg">
          <div className="h-16 rounded-lg bg-gray-800"></div>
        </Skeleton>
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="w-1/4 rounded-lg">
        <div className="h-8 rounded-lg bg-gray-800"></div>
      </Skeleton>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <TableSkeleton />
    </div>
  );
}
