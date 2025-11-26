import { Card, CardContent, CardTitle } from "@/components/ui/card";
import useGetFilterData from "@/hooks/useGetFilterData";
import { Gauge, Link2, Calculator, ChartNoAxesCombined } from "lucide-react";

interface IndicatorDetail {
  label: string;
  value: string;
  icon: React.ReactNode;
}

export default function IndicatorDetails() {
  const { data } = useGetFilterData();
  const detailsContent = data?.data.indicatorCardDetails;

  const details: IndicatorDetail[] = [
    {
      label: "المؤشر",
      value: detailsContent?.sector || "",
      icon: <Gauge className="text-[#057731]" size={20} />,
    },
    {
      label: "المرجعية",
      value: detailsContent?.preferences || "",
      icon: <Link2 className="text-[#057731]" size={20} />,
    },
    {
      label: "طريقة الحساب",
      value: detailsContent?.calculateMethod || "",
      icon: <Calculator className="text-[#057731]" size={20} />,
    },
    {
      label: "وحدة القياس",
      value: data?.data.migUnit || "",
      icon: <ChartNoAxesCombined className="text-[#057731]" size={20} />,
    },
  ];

  return (
    <Card className="border-none shadow-none bg-transparent p-[20px]">
      <CardTitle>
        <div className="flex items-center gap-2 mb-3">
          <p className="w-[2px] h-6 bg-[#25935F] block " />
          <span className="text-gray-600 leading-relaxed">تعريف المؤشر : </span>
          <p className=" text-[18px]">{detailsContent?.definition}</p>
        </div>
      </CardTitle>

      <CardContent className="flex flex-col gap-3 p-0">
        {details.map((item, index) => (
          <div key={index}>
            <div className="bg-[#F8F9FB]  px-4 py-3 flex gap-4 items-center mt-2">
              <div className="flex items-center justify-center bg-white p-3 shadow-sm">
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
