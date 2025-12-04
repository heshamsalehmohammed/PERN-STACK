import { Skeleton } from "@/components/ui/skeleton"

export default function FormSkeleton() {
  return (
    <div className="w-full max-w-md space-y-6 p-4">
      {/* Form header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
      </div>

      {/* Form fields */}
      <div className="space-y-4">
        {/* Field 1 */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>


        {/* Dropdown field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* Checkbox or toggle */}
        <div className="flex items-center space-x-2">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>

      {/* Form actions */}
      <div className="flex justify-start space-x-2 pt-4">
        <Skeleton className="h-10 w-24 rounded-md" />
      </div>
    </div>
  )
}
