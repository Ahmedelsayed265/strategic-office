import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    region: "منطقة جازان",
    "2013": 35000,
    "2014": 20000,
    "2016": 25000,
    "2023": 30000,
  },
  {
    region: "منطقة نجران",
    "2013": 15000,
    "2014": 27000,
    "2016": 32000,
    "2023": 20000,
  },
  {
    region: "منطقة عسير",
    "2013": 40000,
    "2014": 18000,
    "2016": 28000,
    "2023": 23000,
  },
  {
    region: "منطقة الباحة",
    "2013": 20000,
    "2014": 33000,
    "2016": 18000,
    "2023": 25000,
  },
];

const YEARS = ["2013", "2014", "2016", "2023"];
const COLORS = ["#25935F", "#F8A23B", "#2F7ECC", "#7CCCCC"];

export default function LinesView() {
  return (
    <div className="h-[430px] p-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />

          <XAxis dataKey="region" tick={{ fontSize: 12 }} tickMargin={8} color="#f4f4f4" />
          
          <YAxis
            orientation="right"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => value.toLocaleString()}
            tickLine={false}
            axisLine={false}
            dx={25}
            interval={0}
          />

          <Tooltip
            formatter={(value: number, name: string) => [
              `${value.toLocaleString()} ريال`,
              `السنة ${name}`,
            ]}
            labelFormatter={(label) => `المنطقة: ${label}`}
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
                {YEARS.map((year, index) => (
                  <div
                    key={year}
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
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    />
                    <span>{year}</span>
                  </div>
                ))}
              </div>
            )}
          />

          {YEARS.map((year, index) => (
            <Line
              key={year}
              type="monotone"
              dataKey={year}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
              isAnimationActive={true}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
