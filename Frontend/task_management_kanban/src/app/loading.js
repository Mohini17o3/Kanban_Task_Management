import { Skeleton } from "@/components/ui/skeleton";

export default function Loading () {
    return (
        <div className="flex flex-col items-center justify-center space-y-3 ">
        <p className="text-4xl text-white"> LOADING ... </p>
        <Skeleton className="[125px] w-[250px] rounded-xl bg-gray-500" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px] bg-gray-500" />
          <Skeleton className="h-4 w-[200px] bg-gray-500" />
        </div>
      </div>    )
}