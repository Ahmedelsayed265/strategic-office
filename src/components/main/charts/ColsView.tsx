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

// Each region has a single year with its corresponding value
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

const YEAR_COLORS: Record<string, string> = {
  "2024": "#A066FF",
  "2023": "#3E9FFF",
  "2022": "#6EE7E7",
  "2021": "#FF3EB5",
  "2020": "#3EC7FF",
  "2019": "#FFC93E",
  "2018": "#FFB13E",
  "2017": "#FF7A3E",
  "2016": "#3EB9FF",
  "2015": "#6CC3FF",
  "2014": "#3E87FF",
  "2013": "#25935F",
};

export default function ColsView() {
  // Unique years for legend
  const years = [...new Set(data.map((item) => item.year))];

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

          {/* Custom Legend */}
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
                  paddingBottom: "12px"
                }}
              >
                {years.map((year) => (
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
                        backgroundColor: YEAR_COLORS[year] || "#ccc",
                      }}
                    />
                    <span>{year}</span>
                  </div>
                ))}
              </div>
            )}
          />

          <Bar
            dataKey="value"
            radius={[6, 6, 0, 0]}
            barSize={35}
            isAnimationActive={true}
            animationDuration={1000}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={YEAR_COLORS[entry.year] || "#ccc"}
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
