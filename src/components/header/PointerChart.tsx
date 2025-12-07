export default function PointerChart() {
  return (
    <div className="bg-white flex items-center flex-col">
      <div className="bg-[#03998d] text-white w-full py-2">
        <h5 className="text-center text-[20px]">
          قيمة المؤشر لمنطقة الباحة لعام 2025
        </h5>
      </div>

      <div className="h-full flex items-center justify-center p-4">
        <img src="/images/circleChart.svg" alt="" className="h-[120px]" />
      </div>
    </div>
  );
}
