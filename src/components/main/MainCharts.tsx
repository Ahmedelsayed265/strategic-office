import { useSearchParams } from "react-router";
import { Card, CardContent, CardHeader } from "../ui/card";
import FilterHeader from "./FilterHeader";

// charts types
import PieView from "./charts/PieView";
import LinesView from "./charts/LinesView";
import ColsView from "./charts/ColsView";

import Table from "./Table";
import GisMap from "./GisMap";

const sampleData = [
  {
    sector: "الأمن والسلامة",
    indicatorId: 322,
    indicator: "عدد الوفيات الناتجة عن الحوادث المروية",
    regionAreaId: 713,
    regonName: "منطقة الجوف",
    govName1: null,
    govAreaId: null,
    migUnit: "حالة وفاه بحادث مروري/100000 نسمة",
    maxYear: 2022,
    minYear: 2016,
    valueAvg: 28.149999999999995,
  },
  {
    sector: "الأمن والسلامة",
    indicatorId: 322,
    indicator: "عدد الوفيات الناتجة عن الحوادث المروية",
    regionAreaId: 714,
    regonName: "منطقة الحدود الشمالية",
    govName1: null,
    govAreaId: null,
    migUnit: "حالة وفاه بحادث مروري/100000 نسمة",
    maxYear: 2022,
    minYear: 2016,
    valueAvg: 35.2,
  },
  {
    sector: "الأمن والسلامة",
    indicatorId: 322,
    indicator: "عدد الوفيات الناتجة عن الحوادث المروية",
    regionAreaId: 715,
    regonName: "منطقة تبوك",
    govName1: null,
    govAreaId: null,
    migUnit: "حالة وفاه بحادث مروري/100000 نسمة",
    maxYear: 2022,
    minYear: 2016,
    valueAvg: 42.8,
  },
];

export default function MainCharts() {
  const [searchParams] = useSearchParams();

  const mainView = searchParams.get("mainView") || "indicator";
  const chartType = searchParams.get("view") || "chart";
  const initialChartType = searchParams.get("chartType") || "lines";

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
          </>
        )}

        {chartType === "table" && mainView === "indicator" && <Table />}

        {mainView === "map" && (
          <div>
            <GisMap data={sampleData} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
