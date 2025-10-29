import { useSearchParams } from "react-router";
import { ScrollArea } from "../ui/scroll-area";

const mockData = [
  { region: "منطقة عسير", year: "2024", value: "25000" },
  { region: "منطقة جازان", year: "2022", value: "25000" },
  { region: "منطقة نجران", year: "2022", value: "25000" },
  { region: "منطقة الباحة", year: "2025", value: "25000" },
];

export default function TableFilter() {
  const [searchParams] = useSearchParams();

  const selectedYear = searchParams.get("year") || "all";
  const selectedRegion = searchParams.get("region") || "all";

  const filteredData = mockData.filter((item) => {
    const matchYear =
      selectedYear === "all" || item.year === selectedYear;

    const matchRegion =
      selectedRegion === "all" || item.region === selectedRegion;

    return matchYear && matchRegion;
  });

  return (
    <div className="bg-white p-4 shadow-sm w-full">
      <h3 className="text-[#1F2A37] font-semibold mb-4 text-lg">
        بيانات المؤشر
      </h3>

      <ScrollArea className="h-[400px]">
        <table
          className="w-full text-right border-separate"
          style={{ borderSpacing: "0 12px" }}
        >
          <thead className="text-[#6C737F] text-sm">
            <tr className="bg-[#F3F4F6] ">
              <th className="py-3 px-4 ">النطاق الجغرافي</th>
              <th className="py-3 px-4">الأعوام</th>
              <th className="py-3 px-4 ">قيمة المؤشر</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row, index) => (
                <tr key={index} className="bg-[#ffffff] shadow-sm ">
                  <td className="py-4 px-4  text-[#374151]">
                    {row.region}
                  </td>
                  <td className="py-4 px-4 text-[#374151]">{row.year}</td>
                  <td className="py-4 px-4  font-semibold text-[#111928]">
                    {row.value}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={3}
                  className="text-center text-[#6C737F] py-4 font-medium"
                >
                  لا توجد بيانات مطابقة للفلترة
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </ScrollArea>
    </div>
  );
}
