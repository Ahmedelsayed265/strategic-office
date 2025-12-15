import useGetLineChartData from "@/hooks/useGetLineChartData";
import { useEffect, useState } from "react";
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

export default function LinesView() {
  const { data: lineData, isLoading } = useGetLineChartData();
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    const onBeforePrint = () => setIsPrinting(true);
    const onAfterPrint = () => setIsPrinting(false);
    window.addEventListener("beforeprint", onBeforePrint);
    window.addEventListener("afterprint", onAfterPrint);
    return () => {
      window.removeEventListener("beforeprint", onBeforePrint);
      window.removeEventListener("afterprint", onAfterPrint);
    };
  }, []);

  const transformData = () => {
    if (!lineData?.data?.data?.datasets?.length) return [];

    const { years, datasets } = lineData.data.data;

    return datasets.map((dataset) => {
      const dataPoint: { [key: string]: string | number } = {
        region: dataset.label,
      };

      years.forEach((year, index) => {
        dataPoint[year] = dataset.data[index] || 0;
      });

      return dataPoint;
    });
  };

  const chartData = transformData();
  const colors = lineData?.data?.data?.colors || [
    "#25935F",
    "#F8A23B",
    "#2F7ECC",
    "#7CCCCC",
  ];
  const years = lineData?.data?.data?.years || [];

  if (isLoading) {
    return (
      <div className="h-[430px] p-2 flex items-center justify-center">
        <div>جاري تحميل البيانات...</div>
      </div>
    );
  }

  if (!chartData.length) {
    return (
      <div className="h-[430px] p-2 flex items-center justify-center">
        <div>لا توجد بيانات متاحة</div>
      </div>
    );
  }

  return (
    <div className="h-[430px] p-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />

          <XAxis
            dataKey="region"
            tick={{ fontSize: 12 }}
            tickMargin={8}
            color="#f4f4f4"
          />

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
                {years.map((year, index) => (
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
                        backgroundColor: colors[index % colors.length],
                      }}
                    />
                    <span>{year}</span>
                  </div>
                ))}
              </div>
            )}
          />

          {years.map((year, index) => (
            <Line
              key={year}
              type="monotone"
              dataKey={year}
              stroke={colors[index % colors.length]}
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
              isAnimationActive={!isPrinting}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
