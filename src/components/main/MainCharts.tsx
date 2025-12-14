import { useSearchParams } from "react-router";
import { Card, CardContent, CardHeader } from "../ui/card";
import FilterHeader from "./filter/FilterHeader";

import PieView from "./charts/PieView";
import LinesView from "./charts/LinesView";
import ColsView from "./charts/ColsView";
import CircleView from "./charts/CircleView";

import Table from "./Table";
import MapView from "./gis-map/MapView";
import IndicatorDetails from "./IndicatorDetails";
import NextPrevComponent from "./filter/NextPrevComponent";
import useGetFilterData from "@/hooks/useGetFilterData";
import ViewToPrint from "./ViewToPrint";

export default function MainCharts() {
  const [searchParams] = useSearchParams();

  const mainView = searchParams.get("mainView") || "indicator";
  const chartType = searchParams.get("view") || "chart";
  const initialChartType = searchParams.get("chartType") || "cols";

  const { data } = useGetFilterData();

  return (
    <Card className="w-full">
      <CardHeader className="border-b border-[#F4F5F6] flex flex-col gap-3">
        <FilterHeader />
      </CardHeader>

      <CardContent className="p-2">
        {!data ? (
          <video
            src="/WhatsApp Video 2025-10-12 at 1.06.49 PM.mp4"
            playsInline
            autoPlay
            loop
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <>
            {chartType === "chart" && mainView === "indicator" && (
              <>
                {initialChartType === "pie" && <PieView />}
                {initialChartType === "lines" && <LinesView />}
                {initialChartType === "cols" && <ColsView />}
                {initialChartType === "circle" && <CircleView />}
              </>
            )}
            {mainView == "indicator" && <NextPrevComponent />}

            {chartType === "table" && mainView === "indicator" && <Table />}

            {mainView === "map" && <MapView />}

            {mainView === "metadata" && <IndicatorDetails />}
          </>
        )}
        <ViewToPrint />
      </CardContent>
    </Card>
  );
}
