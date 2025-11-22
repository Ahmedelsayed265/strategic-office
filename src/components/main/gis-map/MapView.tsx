import useGetGisData from "@/hooks/useGetGisData";
import GisMap from "./GisMap";

export default function MapView() {
  const { isLoading, data: gisData, isError } = useGetGisData();

  const transformedData =
    gisData?.data?.data?.map((item) => ({
      sector: item.sector,
      indicatorId: item.indicatorId,
      indicator: item.indicator,
      regionAreaId: item.regionAreaId,
      regonName: item.regonName,
      govName1: item.govName1,
      govAreaId: item.govAreaId,
      migUnit: item.migUnit,
      maxYear: item.year,
      minYear: item.year,
      valueAvg: item.valueAvg,
    })) || [];

  return (
    <>
      {isLoading && (
        <div className="flex items-center justify-center h-[430px]">
          <p>جاري تحميل البيانات...</p>
        </div>
      )}
      {isError && (
        <div className="flex items-center justify-center h-[430px]">
          <p className="text-red-500">حدث خطأ في تحميل البيانات</p>
        </div>
      )}
      {!isLoading && !isError && transformedData.length > 0 && (
        <GisMap data={transformedData} />
      )}
      {!isLoading && !isError && transformedData.length === 0 && (
        <div className="flex items-center justify-center h-[430px]">
          <p>لا توجد بيانات متاحة</p>
        </div>
      )}
    </>
  );
}
