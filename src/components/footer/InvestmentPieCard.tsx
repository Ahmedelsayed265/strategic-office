import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ForeignInvestmentData {
  name: string;
  value: number;
  [key: string]: string | number; 
}


const data: ForeignInvestmentData[] = [
  { name: "منطقة جازان", value: 45000 },
  { name: "منطقة عسير", value: 15000 },
  { name: "منطقة نجران", value: 24000 },
  { name: "منطقة الباحة", value: 12000 },
];

const COLORS = ["#7CCCCC", "#2F7ECC", "#F8A23B", "#25935F"];

export default function InvestmentPieCard() {
  return (
    <Card className="w-full h-[420px]">
      <CardHeader className="border-b border-[#F4F5F6]">
        <CardTitle className=" text-[#333] text-[16px] font-semibold">
          حجم الاستثمار الأجنبي بالريال (مليون ريال)
        </CardTitle>
      </CardHeader>

      <CardContent className="h-[340px] flex justify-center items-center p-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={120}
              innerRadius={0}
              labelLine={false}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) =>
                `${value.toLocaleString()} ريال`
              }
            />
            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              wrapperStyle={{ fontSize: "12px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
