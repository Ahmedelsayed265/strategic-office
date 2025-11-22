import type { GisIndicatorValuesResponse } from "@/types/types";
import { postRequest } from "@/lib/axiosApi";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";

export default function useGetGisData() {
  const [searchParams] = useSearchParams();

  const mainView = searchParams.get("mainView");
  const indicatorId = searchParams.get("pointer");
  const years = searchParams.get("year")?.split("-");
  const subIndicators = searchParams.get("subIndicators")?.split("-");
  const regions = searchParams.get("region")?.split("-");
  const govs = searchParams.get("govs")?.split("-");

  const payload: Record<string, string[] | string | null> = {
    indicatorId: indicatorId,
  };

  if (years?.length) payload.years = years;
  if (subIndicators?.length) payload.subIndicators = subIndicators;
  if (regions?.length) payload.regions = regions;
  if (govs?.length) payload.govs = govs;

  const { isLoading, data, isError } = useQuery({
    queryKey: ["gis-data", payload],
    queryFn: (): Promise<GisIndicatorValuesResponse> =>
      postRequest<GisIndicatorValuesResponse>(
        "/IndicatorsApi/get-gis-data",
        payload
      ),
    enabled: !!indicatorId && mainView == "map",
  });

  return { isLoading, data, isError };
}
