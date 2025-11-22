import useGetPieChartData from "@/hooks/useGetPieChartData";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

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

export default function PieView() {
  const { data: pieChartData } = useGetPieChartData();

  // Transform the API data to the format expected by Recharts
  const chartData = pieChartData?.data?.data
    ? pieChartData.data.data.labels.map((label, index) => ({
        name: label,
        value: pieChartData.data.data.values[index],
      }))
    : [];

  const colors = pieChartData?.data?.data?.backgroundColors || [];

  if (!pieChartData) {
    return (
      <div className="h-[430px] flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="h-[430px] flex items-center justify-center">
        <div>No data available</div>
      </div>
    );
  }

  return (
    <div className="h-[430px] flex flex-col justify-center items-center p-2">
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 text-sm">
        {chartData.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: colors[index] || "#ccc" }}
            ></span>
            <span>{entry.name}</span>
            <span className="text-gray-500">
              ({entry.value.toLocaleString()} ريال)
            </span>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            innerRadius={40}
            label={(props) => renderLabel(props as unknown as LabelProps)}
            labelLine={false}
            stroke="none"
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index] || "#ccc"} />
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
