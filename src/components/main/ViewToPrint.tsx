import { useSearchParams } from "react-router";
import Header from "../header/Header";
import IndicatorDetails from "./IndicatorDetails";
import PieView from "./charts/PieView";
import LinesView from "./charts/LinesView";
import ColsView from "./charts/ColsView";
import CircleView from "./charts/CircleView";
import MapView from "./gis-map/MapView";

export default function ViewToPrint() {
  const [searchParams] = useSearchParams();

  const mainView = searchParams.get("mainView") || "indicator";
  const initialChartType = searchParams.get("chartType") || "cols";
  

  return (
    <div id="printable-header" className="hidden">
      <div className="flex flex-col gap-4">
        <Header />

        {mainView !== "map" && <IndicatorDetails />}

        {mainView !== "map" && (
          <>
            {initialChartType === "pie" && <PieView />}
            {initialChartType === "lines" && <LinesView />}
            {initialChartType === "cols" && <ColsView />}
            {initialChartType === "circle" && <CircleView />}
          </>
        )}

         {mainView === "map" && <MapView />}
      </div>
    </div>
  );
}
