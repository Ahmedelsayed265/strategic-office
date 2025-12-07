import useGetFilterData from "@/hooks/useGetFilterData";
import PointerChart from "./PointerChart";

export default function Header() {
  const { data } = useGetFilterData();

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

      <PointerChart />

      <PointerChart />

      <div className="bg-white flex items-center flex-col">
        <div className="bg-[#03998d] text-white w-full py-2">
          <h5 className="text-center text-[20px]">
            معــــــــــــــــــــــــــــــدل التغيـــــــــــــــــــــــــر
          </h5>
        </div>

        <div className="flex items-center justify-center h-full p-4">
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center justify-center">
              <h4 className="text-[30px] font-bold text-[#019a8c]">25%</h4>
              <span className="bg-[#019a8c] text-white px-2 text-[22px]">
                إيجابى
              </span>
            </div>

            <img src="/images/up.svg" alt="" className="h-[80px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
