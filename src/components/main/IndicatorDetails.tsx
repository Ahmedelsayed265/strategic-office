import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Gauge, Link2, Calculator, ChartNoAxesCombined } from "lucide-react";

interface IndicatorDetail {
  label: string;
  value: string;
  icon: React.ReactNode;
}

export default function IndicatorDetails() {
  const details: IndicatorDetail[] = [
    {
      label: "المؤشر",
      value: "حجم الاستثمار الأجنبي بالمليون ريال",
      icon: <Gauge className="text-[#057731]" size={20} />,
    },
    {
      label: "المرجعية",
      value:
        "المصدر: وزارة الإستثمار تقرير الإستثمار الأجنبي المباشر للعام 2024م",
      icon: <Link2 className="text-[#057731]" size={20} />,
    },
    {
      label: "طريقة الحساب",
      value: "حجم الاستثمار الأجنبي بالمليون ريال",
      icon: <Calculator className="text-[#057731]" size={20} />,
    },
    {
      label: "وحدة القياس",
      value: "الريال",
      icon: <ChartNoAxesCombined  className="text-[#057731]" size={20} />,
    },
  ];
  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardTitle>
        <div className="flex items-center gap-2 p-4 border border-r-4 border-l-0 border-t-0 border-b-0 border-[#057731] rounded">
          <span className="text-gray-600   leading-relaxed">تعريف المؤشر : </span>
          <p className=" text-[18px]">حجم الاستثمار الأجنبي بالمليون ريال</p>
        </div>
      </CardTitle>
      <CardContent className="flex flex-col gap-4">
        {details.map((item, index) => (
          <div key={index}>
            <div className="bg-[#F8F9FB] rounded-xl px-4 py-3 flex gap-4 items-center mt-2">
              <div className="flex items-center justify-center bg-white rounded-lg p-2 shadow-sm">
                {item.icon}
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-gray-700">{item.label}</span>
                <p className=" text-[18px] ">{item.value}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
