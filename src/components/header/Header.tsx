import useGetFilterData from "@/hooks/useGetFilterData";

export default function Header() {
  const { data, isLoading } = useGetFilterData();
  const averageChangeRate = data?.data.values.averageChangeRate || 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <div className="bg-[#019a8c] p-3 flex items-center justify-center ">
        <img
          src="/images/logo.svg"
          alt="logo"
          className="h-[60px] object-contain"
        />
      </div>

      <div className="bg-white flex items-center flex-col">
        <div className="bg-[#03998d] text-white w-full py-2">
          <h5 className="text-center text-[20px]">
            إســــــــــــــــــــــــــــــم المؤشـــــــــــــــــــــــــر
          </h5>
        </div>
        <div className="flex items-center justify-center h-full p-4">
          <b className="text-[#25935F] text-center">
            {data?.data.indicatorNameAndUnit}
          </b>
        </div>
      </div>

      <div className="bg-white flex items-center flex-col">
        <div className="bg-[#03998d] text-white w-full py-2">
          <h5 className="text-center text-[20px]">
            قيمة المؤشر لمنطقة الباحة لعام {data?.data.values.yearBefore}
          </h5>
        </div>

        <div className="h-full flex items-center justify-center p-4">
          <img src="/images/circleChart.svg" alt="" className="h-[120px]" />
        </div>
      </div>

      <div className="bg-white flex items-center flex-col">
        <div className="bg-[#03998d] text-white w-full py-2">
          <h5 className="text-center text-[20px]">
            قيمة المؤشر لمنطقة الباحة لعام {data?.data.values.lastYear}
          </h5>
        </div>

        <div className="h-full flex items-center justify-center p-4">
          <img src="/images/circleChart.svg" alt="" className="h-[120px]" />
        </div>
      </div>

      <div className="bg-white flex items-center flex-col">
        <div className="bg-[#03998d] text-white w-full py-2">
          <h5 className="text-center text-[20px]">
            معــــــــــــــــــــــــــــــدل التغيـــــــــــــــــــــــــر
          </h5>
        </div>

        <div className="flex items-center justify-center h-full p-4">
          {!isLoading && (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center justify-center">
                <h4
                  className={`text-[30px] font-bold text-[#019a8c] ${
                    averageChangeRate <= 0 ? "text-[#e15f4b]" : ""
                  }`}
                >
                  {averageChangeRate}%
                </h4>
                <span
                  className={`${
                    averageChangeRate <= 0 ? "bg-[#e15f4b]" : "bg-[#019a8c]"
                  } text-white px-2 text-[22px] w-full text-center`}
                >
                  {averageChangeRate <= 0 ? "سلبي" : "إيجابى"}
                </span>
              </div>

              <img
                src={
                  averageChangeRate <= 0 ? "/images/down.svg" : "/images/up.svg"
                }
                alt=""
                className="h-[80px]"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
