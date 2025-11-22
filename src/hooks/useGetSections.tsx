import type { MainSectionsResponse } from "@/types/types";
import { getRequest } from "@/lib/axiosApi";
import { useQuery } from "@tanstack/react-query";

export default function useGetSections() {
  const { isLoading, data, isError } = useQuery({
    queryKey: ["main-sectors"],
    queryFn: (): Promise<MainSectionsResponse> =>
      getRequest<MainSectionsResponse>("/IndicatorsApi/home"),
  });

  return { isLoading, data, isError };
}
