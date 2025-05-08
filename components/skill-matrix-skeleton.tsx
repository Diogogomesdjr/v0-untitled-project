import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function SkillMatrixSkeleton() {
  return (
    <div className="container mx-auto py-6 px-4">
      <Card className="mb-6">
        <CardHeader>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </CardHeader>
      </Card>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-48" />
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        <Skeleton className="h-12 w-full mb-2" />
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-20 w-full mb-2" />
          ))}
      </div>
    </div>
  )
}
