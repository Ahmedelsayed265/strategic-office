import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface RegionData {
  name: string;
  value: number;
  [key: string]: string | number;
}

const data: RegionData[] = [
  { name: "المنطقة الشرقية", value: 22000 },
  { name: "منطقة مكة المكرمة", value: 34000 },
  { name: "منطقة الرياض", value: 28000 },
  { name: "منطقة المدينة المنورة", value: 18000 },
];

const COLORS = ["#2F7ECC", "#7CCCCC", "#F8A23B", "#25935F"];

interface LabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  value: number;
}

const renderLabel = (props: LabelProps) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, value } = props;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={13}
      fontWeight="600"
    >
      {value.toLocaleString()}
    </text>
  );
};

export default function CircleView() {
  return (
    <div className="h-[430px] flex flex-col justify-center items-center p-2">
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 text-sm">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></span>
            <span>{entry.name}</span>
            <span className="text-gray-500">
              ({entry.value.toLocaleString()} ريال)
            </span>
          </div>
        ))}
      </div>

      {/* Full Pie Chart */}
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            innerRadius={0} // full pie (no hole)
            label={(props) => renderLabel(props as unknown as LabelProps)}
            labelLine={false}
            stroke="none"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip formatter={(value: number) => `${value.toLocaleString()} ريال`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
