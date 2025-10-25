import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

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

export default function PieView() {
  return (
    <div className="h-[430px] flex flex-col justify-center items-center p-2">
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 text-sm">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></span>
            <span>{entry.name}</span>
            <span className="text-gray-500">
              ({entry.value.toLocaleString()} $)
            </span>
          </div>
        ))}
      </div>

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
            stroke="none"
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip
            formatter={(value: number) => `${value.toLocaleString()} ريال`}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
