import type { PointrersResponse } from "@/types/types";
import { postRequest } from "@/lib/axiosApi";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";

export default function useGetPointers(enabled: boolean) {
  const [searchParams] = useSearchParams();
  const mainSectorId = searchParams.get("section");

  const { isLoading, data, isError } = useQuery({
    queryKey: ["pointers", mainSectorId],
    queryFn: (): Promise<PointrersResponse> =>
      postRequest<PointrersResponse>("/get-indicators-from-main-sector", {
        mainSectorId,
      }),
    enabled,
  });

  return { isLoading, data, isError };
}
