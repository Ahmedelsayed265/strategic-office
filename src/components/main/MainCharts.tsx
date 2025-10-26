import { useSearchParams } from "react-router";
import { Card, CardContent, CardHeader } from "../ui/card";
import FilterHeader from "./FilterHeader";

// charts types
import PieView from "./charts/PieView";
import LinesView from "./charts/LinesView";
import ColsView from "./charts/ColsView";
import CircleView from "./charts/CircleView";

import Table from "./Table";
import GisMap from "./gis-map/GisMap";
import IndicatorDetails from "./IndicatorDetails";

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
    valueAvg: 28.15,
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
  {
    sector: "الأمن والسلامة",
    indicatorId: 322,
    indicator: "عدد الوفيات الناتجة عن الحوادث المروية",
    regionAreaId: 716,
    regonName: "منطقة جازان",
    govName1: null,
    govAreaId: null,
    migUnit: "حالة وفاه بحادث مروري/100000 نسمة",
    maxYear: 2022,
    minYear: 2016,
    valueAvg: 31.5,
  },
  {
    sector: "الأمن والسلامة",
    indicatorId: 322,
    indicator: "عدد الوفيات الناتجة عن الحوادث المروية",
    regionAreaId: 717,
    regonName: "منطقة عسير",
    govName1: null,
    govAreaId: null,
    migUnit: "حالة وفاه بحادث مروري/100000 نسمة",
    maxYear: 2022,
    minYear: 2016,
    valueAvg: 37.9,
  },
  {
    sector: "الأمن والسلامة",
    indicatorId: 322,
    indicator: "عدد الوفيات الناتجة عن الحوادث المروية",
    regionAreaId: 718,
    regonName: "منطقة نجران",
    govName1: null,
    govAreaId: null,
    migUnit: "حالة وفاه بحادث مروري/100000 نسمة",
    maxYear: 2022,
    minYear: 2016,
    valueAvg: 40.2,
  },
  {
    sector: "الأمن والسلامة",
    indicatorId: 322,
    indicator: "عدد الوفيات الناتجة عن الحوادث المروية",
    regionAreaId: 719,
    regonName: "منطقة الباحة",
    govName1: null,
    govAreaId: null,
    migUnit: "حالة وفاه بحادث مروري/100000 نسمة",
    maxYear: 2022,
    minYear: 2016,
    valueAvg: 33.7,
  },
];

export default function MainCharts() {
  const [searchParams] = useSearchParams();

  const mainView = searchParams.get("mainView") || "indicator";
  const chartType = searchParams.get("view") || "chart";
  const initialChartType = searchParams.get("chartType") || "cols";

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
          </>
        )}

        {chartType === "table" && mainView === "indicator" && <Table />}

        {mainView === "map" && (
          <div>
            <GisMap data={sampleData} />
          </div>
        )}
        {mainView === "metadata" && (
          <div>
            <IndicatorDetails/>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
