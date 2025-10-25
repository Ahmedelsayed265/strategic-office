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
  region: string;
  year: string;
  value: number;
  color: string;
}

const data: InvestmentData[] = [
  { region: "منطقة جازان", year: "2023", value: 13000, color: "#7CCCCC" },
  { region: "منطقة عسير", year: "2016", value: 24000, color: "#2F7ECC" },
  { region: "منطقة نجران", year: "2014", value: 12000, color: "#F8A23B" },
  { region: "منطقة الباحة", year: "2013", value: 45000, color: "#25935F" },
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
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="region" tick={{ fontSize: 12 }} tickMargin={8} />
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
                    gap: "16px",
                    fontSize: "12px",
                    color: "#333",
                    marginTop: "8px",
                  }}
                >
                  {[
                    { year: "2023", color: "#7CCCCC" },
                    { year: "2016", color: "#2F7ECC" },
                    { year: "2014", color: "#F8A23B" },
                    { year: "2013", color: "#25935F" },
                  ].map((item) => (
                    <div
                      key={item.year}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          backgroundColor: item.color,
                        }}
                      />
                      <span>{item.year}</span>
                    </div>
                  ))}
                </div>
              )}
            />

            <Bar
              dataKey="value"
              radius={[6, 6, 0, 0]}
              isAnimationActive={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}

              <LabelList
                dataKey="value"
                position="top"
                content={(props) => {
                  const { x, y, value } = props;
                  return (
                    <text
                      x={x}
                      y={(Number(y) ?? 0) - 5}
                      fill="#333"
                      fontSize={12}
                      textAnchor="middle"
                    >
                      {value ? Number(value).toLocaleString() : ""}
                    </text>
                  );
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
