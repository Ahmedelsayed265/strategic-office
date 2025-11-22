import { useEffect, useState } from "react";
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
import useGetPointers from "@/hooks/useGetPointers";

export default function MainCharts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pointersIds, setPointersIds] = useState<number[]>([]);
  const { data: pointers } = useGetPointers();

  const mainView = searchParams.get("mainView") || "indicator";
  const chartType = searchParams.get("view") || "chart";
  const initialChartType = searchParams.get("chartType") || "cols";

  useEffect(() => {
    if (pointers?.data) {
      setPointersIds(pointers.data.map((p) => p.id));
    }
  }, [pointers]);

  const updatePointerParam = (newPointer: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pointer", String(newPointer));
    setSearchParams(params);
  };

  const handlePrev = () => {
    const current = Number(searchParams.get("pointer")) || 0;
    const currentIndex = pointersIds.indexOf(current);
    const prevId = pointersIds[currentIndex - 1];
    if (prevId !== undefined) {
      updatePointerParam(prevId);
    }
  };

  const handleNext = () => {
    const current = Number(searchParams.get("pointer")) || 0;
    const currentIndex = pointersIds.indexOf(current);
    const nextId = pointersIds[currentIndex + 1];
    if (nextId !== undefined) {
      updatePointerParam(nextId);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="border-b border-[#F4F5F6] flex flex-col gap-3">
        <FilterHeader />
      </CardHeader>

      <CardContent className="p-2">
        {chartType === "chart" && mainView === "indicator" && (
          <>
            {initialChartType === "pie" && <PieView />}
            {initialChartType === "lines" && <LinesView />}
            {initialChartType === "cols" && <ColsView />}
            {initialChartType === "circle" && <CircleView />}

            <div className="flex items-center justify-between mt-4">
              <p className="text-[16px]">
                وحدة القياس : <b className="text-[#25935F]">مليون ريال</b>
              </p>

              <div className="flex items-center gap-2">
                <button
                  className="p-2 px-4 bg-gray-100"
                  onClick={handlePrev}
                  disabled={
                    !searchParams.get("pointer") ||
                    pointersIds.indexOf(Number(searchParams.get("pointer"))) <=
                      0
                  }
                >
                  السابق
                </button>
                <button
                  className="p-2 px-4 bg-gray-100"
                  onClick={handleNext}
                  disabled={
                    !searchParams.get("pointer") ||
                    pointersIds.indexOf(Number(searchParams.get("pointer"))) ===
                      pointersIds.length - 1
                  }
                >
                  التالى
                </button>
              </div>
            </div>
          </>
        )}

        {chartType === "table" && mainView === "indicator" && <Table />}

        {mainView === "map" && <MapView />}

        {mainView === "metadata" && <IndicatorDetails />}
      </CardContent>
    </Card>
  );
}
