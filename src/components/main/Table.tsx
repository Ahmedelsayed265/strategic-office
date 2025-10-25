const data = [
  { region: "الشرقية", year: "2024", value: 13000 },
  { region: "الباحة", year: "2023", value: 24000 },
  { region: "السعودية", year: "2022", value: 12000 },
  { region: "جازان", year: "2021", value: 45000 },
  { region: "القصيم", year: "2020", value: 13000 },
  { region: "المدينة", year: "2019", value: 24000 },
  { region: "جازان", year: "2018", value: 12000 },
  { region: "مكة المكرمة", year: "2017", value: 45000 },
  { region: "حائل", year: "2016", value: 12000 },
  { region: "نجران", year: "2015", value: 13000 },
  { region: "الجوف", year: "2014", value: 24000 },
  { region: "الحدود", year: "2013", value: 12000 },
  { region: "تبوك", year: "2013", value: 45000 },
];

export default function Table() {
  return (
    <div className="p-3 bg-white overflow-x-auto">
      <table className="w-full text-sm text-right border-collapse">
        <thead>
          <tr className="bg-[#F8F9FC] text-gray-700">
            <th className="p-3 font-semibold">السنة</th>
            <th className="p-3 font-semibold">المنطقة</th>
            <th className="p-3 font-semibold">قيمة المؤشر</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-gray-100 transition">
              <td className="p-3">{row.year}</td>
              <td className="p-3">{row.region}</td>
              <td className="p-3">{row.value.toLocaleString()} ريال</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
