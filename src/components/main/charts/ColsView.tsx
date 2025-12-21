import useGetBarChartData from "@/hooks/useGetBarChartData";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts";

export default function ColsView() {
  const { data: barChartData, isLoading, isError } = useGetBarChartData();
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

  const isSingleDataset = barChartData?.data?.data?.datasets?.length === 1;

  // **Global number formatter**
  const formatNumber = (value: number) => {
    if (value === null || value === undefined) return "";
    const num = Number(value);
    if (isNaN(num)) return "";
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const transformData = () => {
    if (
      !barChartData?.data?.data?.xLabels?.length ||
      !barChartData?.data?.data?.datasets?.length
    ) {
      return [];
    }

    const { xLabels, datasets } = barChartData.data.data;

    if (isSingleDataset) {
      return xLabels.map((region, index) => ({
        region: region,
        value: datasets[0].values[index] || 0,
      }));
    } else {
      return xLabels.map((year, yearIndex) => {
        const dataPoint: { [key: string]: string | number } = {
          year: year,
        };

        datasets.forEach((dataset) => {
          dataPoint[dataset.name] = dataset.values[yearIndex] || 0;
        });

        return dataPoint;
      });
    }
  };

  const chartData = transformData();
  const apiColors = barChartData?.data?.data?.colors || [];

  const getDataKeys = () => {
    if (isSingleDataset) {
      return ["value"];
    } else {
      return (
        barChartData?.data?.data?.datasets?.map((dataset) => dataset.name) || []
      );
    }
  };

  const dataKeys = getDataKeys();
  const xAxisKey = isSingleDataset ? "region" : "year";

  const getBarColor = (index: number) => {
    return apiColors[index] || `hsl(${index * 30}, 70%, 50%)`;
  };

  const maxValue =
    chartData.length > 0
      ? Math.max(
          ...chartData.flatMap((item) =>
            dataKeys.map(
              (key) => Number((item as Record<string, unknown>)[key]) || 0
            )
          )
        ) * 1.1
      : 100;

  if (isLoading) {
    return (
      <div className="h-[430px] p-2 flex items-center justify-center">
        <div>جاري تحميل البيانات...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-[430px] p-2 flex items-center justify-center">
        <div>حدث خطأ في تحميل البيانات</div>
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
    <div className="h-[430px] p-2" style={{ width: "100%", overflow: "visible", minWidth: "100%" }}>
      <ResponsiveContainer width="100%" height="100%" style={{ width: "100%", overflow: "visible" }}>
        <BarChart
          data={chartData}
          margin={{
            top: 30,
            right: 40,
            left: 10,
            bottom: isSingleDataset ? 60 : 30,
          }}
          barCategoryGap={isSingleDataset ? "20%" : "10%"}
          barGap={2}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />

          <XAxis
            dataKey={xAxisKey}
            tick={{ fontSize: 12 }}
            tickMargin={8}
            interval={0}
            angle={45}
            textAnchor={isSingleDataset ? "end" : "middle"}
            height={isSingleDataset ? 80 : 40}
          />

          <YAxis
            orientation="right"
            tick={{ fontSize: 12 }}
            domain={[0, maxValue]}
            tickFormatter={(value) => formatNumber(value)}
            tickLine={false}
            axisLine={false}
            dx={25}
          />

          <Tooltip
            formatter={(value: number) => formatNumber(value)}
            labelFormatter={(label) =>
              isSingleDataset ? `المنطقة: ${label}` : `السنة: ${label}`
            }
          />

          {/* Legend for multiple datasets */}
          {!isSingleDataset && (
            <Legend
              verticalAlign="top"
              align="center"
              height={80}
              content={() => (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    gap: "12px",
                    fontSize: "11px",
                    color: "#333",
                    paddingBottom: "12px",
                    maxHeight: "60px",
                    overflowY: "auto",
                  }}
                >
                  {dataKeys.map((key, index) => (
                    <div
                      key={key}
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
                          backgroundColor: getBarColor(index),
                        }}
                      />
                      <span
                        style={{
                          maxWidth: "120px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {key}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            />
          )}

          {/* Single dataset */}
          {isSingleDataset ? (
            <Bar
              dataKey="value"
              name={barChartData?.data?.data?.datasets?.[0]?.name || "القيمة"}
              radius={[6, 6, 0, 0]}
              barSize={35}
              isAnimationActive={!isPrinting}
              animationDuration={1000}
              animationEasing="ease-out"
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(index)} />
              ))}

              <LabelList
                dataKey="value"
                position="top"
                formatter={(value) => formatNumber(Number(value))}
                fontSize={11}
                fill="#333"
              />
            </Bar>
          ) : (
            /* Multi datasets */
            dataKeys.map((key, keyIndex) => (
              <Bar
                key={key}
                dataKey={key}
                name={key}
                fill={getBarColor(keyIndex)}
                radius={[6, 6, 0, 0]}
                barSize={20}
                isAnimationActive={!isPrinting}
                animationDuration={1000}
                animationEasing="ease-out"
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${keyIndex}-${index}`}
                    fill={getBarColor(keyIndex)}
                  />
                ))}

                {keyIndex === 0 && (
                  <LabelList
                    dataKey={key}
                    position="top"
                    content={({ x, y, value, index }) => {
                      if (index === chartData.length - 1) {
                        return (
                          <text
                            x={x}
                            y={Number(y) - 5}
                            fill="#333"
                            fontSize={10}
                            textAnchor="middle"
                          >
                            {value ? formatNumber(Number(value)) : ""}
                          </text>
                        );
                      }
                      return null;
                    }}
                  />
                )}
              </Bar>
            ))
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
