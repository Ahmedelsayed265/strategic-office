import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts";

interface InvestmentData {
  id: number;
  region: string;
  value: number;
  color: string;
}

const data: InvestmentData[] = [
  { id: 1, region: "العقيق", value: 13000, color: "#7CCCCC" },
  { id: 2, region: "الحجرة", value: 24000, color: "#2F7ECC" },
  { id: 3, region: "القرى", value: 12000, color: "#F8A23B" },
  { id: 4, region: "المخواة", value: 45000, color: "#25935F" },
  { id: 5, region: "المندق", value: 32000, color: "#7C4DFF" },
  { id: 6, region: "بلجرشي", value: 18000, color: "#FF5722" },
  { id: 7, region: "بنى حسن", value: 27000, color: "#009688" },
  { id: 10, region: "غامد الزناد", value: 21000, color: "#FFC107" },
  { id: 11, region: "قلوة", value: 36000, color: "#9C27B0" },
  { id: 12, region: "الباحة", value: 42000, color: "#E91E63" },
];

export default function InvestmentChartCard() {
  return (
    <Card className="w-full h-[420px]">
      <CardHeader className="border-b border-[#F4F5F6]">
        <CardTitle className="text-[#333] text-[16px] font-semibold">
          حجم الإستثمار بالريال (مليون ريال)
        </CardTitle>
      </CardHeader>

      <CardContent className="h-[340px] p-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
            barSize={30}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="region"
              tick={{ fontSize: 10 }}
              tickMargin={8}
              interval={0}
              height={60}
              textAnchor="end"
            />
            <YAxis
              orientation="right"
              tick={{ fontSize: 12 }}
              domain={[0, 45000]}
              tickCount={10}
              tickFormatter={(value) => value.toLocaleString()}
              tickLine={false}
              axisLine={false}
              dx={25}
              interval={0}
            />

            <Legend
              verticalAlign="top"
              align="center"
              height={50}
              content={() => (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    gap: "12px",
                    fontSize: "11px",
                    color: "#333",
                    marginTop: "8px",
                  }}
                >
                  {data.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: item.color,
                        }}
                      />
                      <span>
                        {item.region} (ID: {item.id})
                      </span>
                    </div>
                  ))}
                </div>
              )}
            />

            <Bar
              dataKey="value"
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}

              <LabelList
                dataKey="value"
                position="top"
                content={({ x, y, value }) => (
                  <text
                    x={x}
                    y={Number(y) - 5}
                    fill="#333"
                    fontSize={12}
                    textAnchor="middle"
                  >
                    {value ? Number(value).toLocaleString() : ""}
                  </text>
                )}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
