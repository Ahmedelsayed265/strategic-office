import { useSearchParams } from "react-router";
import { Card, CardContent, CardHeader } from "../ui/card";
import FilterHeader from "./FilterHeader";

// charts types
import PieView from "./charts/PieView";
import LinesView from "./charts/LinesView";
import ColsView from "./charts/ColsView";

export default function MainCharts() {
  const [searchParams] = useSearchParams();

  const initialChartType = searchParams.get("chartType") || "pie";
  // const initialRegion = searchParams.get("region") || "";
  // const initialView = searchParams.get("view") || "chart";

  console.log(initialChartType);
  

  return (
    <Card className="w-full">
      <CardHeader className="border-b border-[#F4F5F6] flex flex-col gap-3">
        <FilterHeader />
      </CardHeader>

      <CardContent className="p-2">
        {initialChartType === "pie" && <PieView />}
        {initialChartType === "lines" && <LinesView />}
        {initialChartType === "cols" && <ColsView />}
      </CardContent>
    </Card>
  );
}
