import { useSearchParams } from "react-router";
import { Card, CardContent, CardHeader } from "../ui/card";
import FilterHeader from "./FilterHeader";

// charts types
import PieView from "./charts/PieView";
import LinesView from "./charts/LinesView";
import ColsView from "./charts/ColsView";
import Table from "./Table";

export default function MainCharts() {
  const [searchParams] = useSearchParams();

  const initialView = searchParams.get("view") || "chart";
  const initialChartType = searchParams.get("chartType") || "lines";
  // const initialRegion = searchParams.get("region") || "";

  console.log(initialChartType);

  return (
    <Card className="w-full">
      <CardHeader className="border-b border-[#F4F5F6] flex flex-col gap-3">
        <FilterHeader />
      </CardHeader>

      <CardContent className="p-2">
        {initialView === "chart" && (
          <>
            {initialChartType === "pie" && <PieView />}
            {initialChartType === "lines" && <LinesView />}
            {initialChartType === "cols" && <ColsView />}
          </>
        )}

        {initialView === "table" && <Table />}
      </CardContent>
    </Card>
  );
}
