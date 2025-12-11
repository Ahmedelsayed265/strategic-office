interface IndicatorValueCardProps {
  year: string;
  value: number;
  performanceLevel: "negative" | "moderate" | "positive";
  circleChartSection: number;
  label: string;
}

const PERFORMANCE_CONFIG = {
  negative: {
    image: "/images/سلبي.svg",
    color: "bg-[#e15f4b]",
    label: "سلبي",
  },
  moderate: {
    image: "/images/معتدل.svg",
    color: "bg-[#f5a623]",
    label: "معتدل",
  },
  positive: {
    image: "/images/ايجابي.svg",
    color: "bg-[#019a8c]",
    label: "إيجابي",
  },
} as const;

export default function IndicatorValueCard({
  year,
  value,
  performanceLevel,
  label,
}: IndicatorValueCardProps) {
  const config = PERFORMANCE_CONFIG[performanceLevel];
  const hasValue = value != null;

  if (!hasValue) {
    return (
      <div className="bg-white flex items-center flex-col">
        <div className="bg-[#03998d] text-white w-full py-2">
          <h5 className="text-center text-[20px]">
            {label} {year}
          </h5>
        </div>
        <div className="h-full flex items-center justify-center p-4">
          <p className="text-gray-500">لا توجد بيانات</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white flex items-center flex-col relative">
      <div className="bg-[#03998d] text-white w-full py-2">
        <h5 className="text-center text-[20px]">
          {label} {year}
        </h5>
      </div>

      <div className="h-full flex items-center justify-center flex-col p-4 pb-[40px]">
        <img src={config.image} alt={performanceLevel} className="h-[120px]" />

        <div className="text-[20px] font-bold flex flex-col items-center justify-center absolute bottom-[10px]">
          <h4>{value.toFixed(2)}</h4>
          <p className={`px-3 text-white ${config.color}`}>{config.label}</p>
        </div>
      </div>
    </div>
  );
}
