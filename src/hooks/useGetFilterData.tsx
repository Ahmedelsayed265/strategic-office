import type { IndicatorDataResponse } from "@/types/types";
import { postRequest } from "@/lib/axiosApi";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";

export default function useGetFilterData() {
  const [searchParams] = useSearchParams();
  const indicatorId = searchParams.get("pointer");

  const { isLoading, data, isError } = useQuery({
    queryKey: ["filter-data", indicatorId],
    queryFn: (): Promise<IndicatorDataResponse> =>
      postRequest<IndicatorDataResponse>("/IndicatorsApi/get-indicator-data", {
        indicatorId,
      }),
    enabled: !!indicatorId,
  });

  return { isLoading, data, isError };
}
