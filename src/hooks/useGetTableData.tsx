import type { TableDataResponse } from "@/types/types";
import { postRequest } from "@/lib/axiosApi";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";

export default function useGetTableData() {
  const [searchParams] = useSearchParams();

  const view = searchParams.get("view");
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
    queryKey: ["table-data", payload],
    queryFn: (): Promise<TableDataResponse> =>
      postRequest<TableDataResponse>(
        "/IndicatorsApi/get-table-data",
        payload
      ),
    enabled: !!indicatorId && view == "table",
  });

  return { isLoading, data, isError };
}
