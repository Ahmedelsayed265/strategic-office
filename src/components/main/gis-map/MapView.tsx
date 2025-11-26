import useGetGisData from "@/hooks/useGetGisData";
import GisMap from "./GisMap";

export default function MapView() {
  const { isLoading, data: gisData, isError } = useGetGisData();

  const points = gisData?.data?.data || [];
  const table = gisData?.data?.tableData || [];

  const transformedData =
    points.map((item) => ({
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
        <>
          {/* ====== الخريطة ====== */}
          <GisMap data={transformedData} />

          {/* ====== الجدول ====== */}
          <div className="mt-6 overflow-x-auto rounded-lg border">
            <table className="w-full border-collapse text-right">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3 border">النطاق الجغرافي</th>
                  <th className="p-3 border">الأعوام</th>
                  <th className="p-3 border">قيمة المؤشر</th>
                </tr>
              </thead>

              <tbody>
                {table.map((row) => (
                  <tr key={`${row.regionAreaId}-${row.yearId}`} className="even:bg-gray-50">
                    <td className="p-3 border">{row.regonName}</td>
                    <td className="p-3 border">{row.yearId}</td>
                    <td className="p-3 border">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!isLoading && !isError && transformedData.length === 0 && (
        <div className="flex items-center justify-center h-[430px]">
          <p>لا توجد بيانات متاحة</p>
        </div>
      )}
    </>
  );
}
