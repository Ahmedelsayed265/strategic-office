interface ChangeRateCardProps {
  rate: number;
}

export default function ChangeRateCard({ rate }: ChangeRateCardProps) {
  const isPositive = rate > 0;
  const formattedRate = Math.abs(rate).toFixed(2);
  const arrowIcon = isPositive ? "/images/up.svg" : "/images/down.svg";
  const colorClass = isPositive ? "text-[#019a8c] bg-[#019a8c]" : "text-[#e15f4b] bg-[#e15f4b]";
  const label = isPositive ? "إيجابى" : "سلبي";

  return (
    <div className="bg-white flex items-center flex-col">
      <div className="bg-[#03998d] text-white w-full py-2">
        <h5 className="text-center text-[20px]">
          معــــــــــــــــــــــــــــــدل التغيـــــــــــــــــــــــــر
        </h5>
      </div>

      <div className="flex items-center justify-center h-full p-4">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center justify-center">
            <h4 className={`text-[30px] font-bold ${colorClass.split(' ')[0]}`}>
              {formattedRate}%
            </h4>
            <span className={`${colorClass.split(' ')[1]} text-white px-2 text-[22px] w-full text-center`}>
              {label}
            </span>
          </div>

          <img src={arrowIcon} alt="trend" className="h-[80px]" />
        </div>
      </div>
    </div>
  );
}