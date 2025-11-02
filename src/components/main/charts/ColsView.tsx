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

const data = [
  { region: "الشرقية", year: "2024", value: 13000 },
  { region: "الباحة", year: "2023", value: 24000 },
  { region: "السعودية", year: "2022", value: 12000 },
  { region: "جازان", year: "2021", value: 45000 },
  { region: "القصيم", year: "2020", value: 13000 },
  { region: "المدينة", year: "2019", value: 24000 },
  { region: "جازان", year: "2018", value: 12000 },
  { region: "مكة المكرمة", year: "2017", value: 45000 },
  { region: "حائل", year: "2016", value: 12000 },
  { region: "نجران", year: "2015", value: 13000 },
  { region: "الجوف", year: "2014", value: 24000 },
  { region: "الحدود", year: "2013", value: 12000 },
  { region: "تبوك", year: "2013", value: 45000 },
];

const REGION_COLORS: Record<string, string> = {
  الشرقية: "#ded3b3",
  الباحة: "#019a8c",
  السعودية: "#594a44",
  جازان: "#ded3b3",
  القصيم: "#ded3b3",
  المدينة: "#ded3b3",
  "مكة المكرمة": "#ded3b3",
  حائل: "#ded3b3",
  نجران: "#ded3b3",
  الجوف: "#ded3b3",
  الحدود: "#ded3b3",
  تبوك: "#ded3b3",
};

export default function ColsView() {
  const regions = [...new Set(data.map((item) => item.region))];

  return (
    <div className="h-[430px] p-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 30, right: 20, left: 10, bottom: 30 }}
          barCategoryGap="40%"
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="region" tick={{ fontSize: 12 }} tickMargin={8} />
          <YAxis
            orientation="right"
            tick={{ fontSize: 12 }}
            domain={[0, 45000]}
            tickFormatter={(value) => value.toLocaleString()}
            tickLine={false}
            axisLine={false}
            dx={25}
          />
          <Tooltip
            formatter={(value: number, _name, props) => [
              `${value.toLocaleString()} ريال`,
              `السنة ${props.payload.year}`,
            ]}
            labelFormatter={(label) => `المنطقة: ${label}`}
          />

          {/* مفتاح المناطق */}
          <Legend
            verticalAlign="top"
            align="center"
            height={40}
            content={() => (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  gap: "12px",
                  fontSize: "12px",
                  color: "#333",
                  paddingBottom: "12px",
                }}
              >
                {regions.map((region) => (
                  <div
                    key={region}
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
                        backgroundColor: REGION_COLORS[region] || "#ccc",
                      }}
                    />
                    <span>{region}</span>
                  </div>
                ))}
              </div>
            )}
          />

          <Bar
            dataKey="value"
            radius={[6, 6, 0, 0]}
            barSize={35}
            isAnimationActive
            animationDuration={1000}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={REGION_COLORS[entry.region] || "#ccc"}
              />
            ))}

            <LabelList
              dataKey="value"
              position="top"
              content={({ x, y, value }) => (
                <text
                  x={x}
                  y={Number(y) - 5}
                  fill="#333"
                  fontSize={11}
                  textAnchor="middle"
                >
                  {value ? Number(value).toLocaleString() : ""}
                </text>
              )}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
