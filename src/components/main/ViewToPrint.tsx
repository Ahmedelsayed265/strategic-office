import { useSearchParams } from "react-router";
import { createPortal } from "react-dom";
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

  const content = (
    <div
      id="printable-header"
      className="fixed left-0 top-0 w-full bg-white opacity-0 pointer-events-none -z-10"
    >
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

  if (typeof document === "undefined") return null;
  return createPortal(content, document.body);
}
