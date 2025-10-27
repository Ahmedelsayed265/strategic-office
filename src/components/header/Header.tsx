import PointerChart from "./PointerChart";

export default function Header() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <div className="bg-[#019a8c] p-3 rounded-[12px] flex items-center justify-center ">
        <img src="/images/logo.svg" alt="logo" />
      </div>

      <div className="bg-white p-6 rounded-[12px] flex items-center ">
        <div className="flex flex-col gap-3">
          <p>
            القطاع : <b className="text-[#384250]">الإستثمار</b>
          </p>
          <p>
            المؤشر : <b className="text-[#25935F]">تطور معدل انتشار الإنترنت</b>
          </p>
          <p>
            وحدة القياس : <b className="text-[#25935F]">مليون ريال</b>
          </p>
        </div>
      </div>

      <PointerChart />

      <PointerChart />

      <div className="bg-white p-4 rounded-[12px] flex flex-col justify-between ">
        <h6 className="relative after:content-[''] after:absolute after:start-[-16px] after:top-0 after:h-full after:w-[2px] after:rounded-full after:bg-[#25935F]">
          معدل التغير : = <b className="text-[#25935F]">25%</b>
        </h6>

        <img src="/icons/rising.svg" alt="rising" className="h-[100px]" />
      </div>
    </div>
  );
}
