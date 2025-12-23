import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";
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
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    const element = document.getElementById("printable-content");
    
    const handleBeforePrint = () => {
      setIsPrinting(true);
      if (element) {
        element.classList.remove("hidden", "d-none");
        element.style.display = "block";
        element.style.visibility = "visible";
      }
    };
    
    const handleAfterPrint = () => {
      setIsPrinting(false);
      // Hide element again
      if (element) {
        element.classList.add("hidden");
      }
    };
    
    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);
    
    // Also listen to events on the element itself
    if (element) {
      element.addEventListener("beforeprint", handleBeforePrint);
      element.addEventListener("afterprint", handleAfterPrint);
    }
    
    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
      if (element) {
        element.removeEventListener("beforeprint", handleBeforePrint);
        element.removeEventListener("afterprint", handleAfterPrint);
      }
    };
  }, []);

  return (
    <div 
      id="printable-content" 
      className={isPrinting ? "" : "hidden"}
      style={{
        backgroundColor: "#ffffff",
        padding: "20px",
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100%",
        overflow: "visible",
        position: isPrinting ? "relative" : "absolute",
        left: isPrinting ? "auto" : "-9999px",
        top: isPrinting ? "auto" : "0",
        zIndex: isPrinting ? "9999" : "-1",
      }}
    >
      <div className="flex flex-col gap-4" style={{ width: "100%", overflow: "visible" }}>
        <div style={{ width: "100%", overflow: "visible" }}>
          <Header />
        </div>

        {mainView !== "map" && (
          <div style={{ width: "100%", overflow: "visible" }}>
            <IndicatorDetails />
          </div>
        )}

        {mainView !== "map" && (
          <div style={{ width: "100%", overflow: "visible", minHeight: "430px", position: "relative" }}>
            {initialChartType === "pie" && <PieView />}
            {initialChartType === "lines" && <LinesView />}
            {initialChartType === "cols" && <ColsView />}
            {initialChartType === "circle" && <CircleView />}
          </div>
        )}

        {mainView === "map" && (
          <div style={{ width: "100%", overflow: "visible" }}>
            <MapView />
          </div>
        )}
      </div>
    </div>
  );
}
