import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface InvestmentData {
  region: string;
  "2023": number;
  "2016": number;
  "2014": number;
  "2013": number;
}

const data: InvestmentData[] = [
  { region: "منطقة جازان", "2023": 13000, "2016": 0, "2014": 0, "2013": 0 },
  { region: "منطقة عسير", "2023": 24000, "2016": 0, "2014": 0, "2013": 0 },
  { region: "منطقة نجران", "2023": 12000, "2016": 0, "2014": 0, "2013": 0 },
  { region: "منطقة الباحة", "2023": 45000, "2016": 0, "2014": 0, "2013": 0 },
];

export default function InvestmentChartCard() {
  return (
    <Card className="w-full h-[420px]">
      <CardHeader className="border-b border-[#F4F5F6]">
        <CardTitle className="text-[#333] text-[16px] font-semibold">
          حجم الإستثمار بالريال (مليون ريال)
        </CardTitle>
      </CardHeader>

      <CardContent className="h-[340px] pt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="region" tick={{ fontSize: 12 }} />
            <YAxis
              tick={{ fontSize: 12 }}
              domain={[0, 50000]}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip
              formatter={(value: number) => `${value.toLocaleString()} ريال`}
            />
            <Legend verticalAlign="top" height={36} />
            <Bar dataKey="2023" fill="#7CCCCC" radius={[6, 6, 0, 0]} />
            <Bar dataKey="2016" fill="#2F7ECC" radius={[6, 6, 0, 0]} />
            <Bar dataKey="2014" fill="#F8A23B" radius={[6, 6, 0, 0]} />
            <Bar dataKey="2013" fill="#25935F" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
