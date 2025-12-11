import useGetFilterData from "@/hooks/useGetFilterData";

export default function Header() {
  const { data } = useGetFilterData();

  const averageChangeRate: number = Number(
    data?.data?.values?.averageChangeRate ?? 0
  );

  const circleChartSection: number =
    (Number(data?.data?.values?.averageMaxIndVal ?? 0) -
      Number(data?.data?.values?.averageMinIndVal ?? 0)) /
    3;

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
            {data?.data?.indicatorNameAndUnit ?? ""}
          </b>
        </div>
      </div>

      <div className="bg-white flex items-center flex-col relative">
        <div className="bg-[#03998d] text-white w-full py-2">
          <h5 className="text-center text-[20px]">
            قيمة المؤشر لمنطقة الباحة لعام {data?.data?.values?.lastYear ?? ""}
          </h5>
        </div>

        <div className="h-full flex items-center justify-center flex-col p-4 pb-[40px]">
          {data?.data?.values?.averageValue != null &&
            Number(data.data.values.averageValue) <= circleChartSection && (
              <img src="/images/سلبي.svg" alt="" className="h-[120px]" />
            )}
          {data?.data?.values?.averageValue != null &&
            Number(data.data.values.averageValue) <= circleChartSection * 2 &&
            Number(data.data.values.averageValue) > circleChartSection && (
              <img src="/images/معتدل.svg" alt="" className="h-[120px]" />
            )}
          {data?.data?.values?.averageValue != null &&
            Number(data.data.values.averageValue) > circleChartSection * 2 &&
            Number(data.data.values.averageValue) <= circleChartSection * 3 && (
              <img src="/images/ايجابي.svg" alt="" className="h-[120px]" />
            )}

          {data?.data?.values?.averageValue != null && (
            <div className="text-[20px] font-bold flex flex-col items-center justify-center absolute bottom-[10px]">
              <h4>{Number(data.data.values.averageValue).toFixed(2)}</h4>
              <p className={`px-3 text-white ${
                Number(data.data.values.averageBeforeVal) <= circleChartSection
                  ? "bg-[#e15f4b]"
                  : Number(data.data.values.averageBeforeVal) <=
                    circleChartSection * 2
                  ? "bg-[#f5a623]"
                  : "bg-[#019a8c]"
              }`}>
                {Number(data.data.values.averageValue) <= circleChartSection
                  ? " سلبي"
                  : Number(data.data.values.averageValue) <=
                    circleChartSection * 2
                  ? " معتدل"
                  : " إيجابي"}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white flex items-center flex-col relative">
        <div className="bg-[#03998d] text-white w-full py-2">
          <h5 className="text-center text-[20px]">
            قيمة المؤشر لمنطقة الباحة لعام{" "}
            {data?.data?.values?.yearBefore ?? ""}
          </h5>
        </div>

        <div className="h-full flex items-center justify-center flex-col p-4 pb-[40px]">
          {data?.data?.values?.averageBeforeVal != null &&
            Number(data.data.values.averageBeforeVal) <= circleChartSection && (
              <img src="/images/سلبي.svg" alt="" className="h-[120px]" />
            )}
          {data?.data?.values?.averageBeforeVal != null &&
            Number(data.data.values.averageBeforeVal) <=
              circleChartSection * 2 &&
            Number(data.data.values.averageBeforeVal) > circleChartSection && (
              <img src="/images/معتدل.svg" alt="" className="h-[120px]" />
            )}
          {data?.data?.values?.averageBeforeVal != null &&
            Number(data.data.values.averageBeforeVal) >
              circleChartSection * 2 &&
            Number(data.data.values.averageBeforeVal) <=
              circleChartSection * 3 && (
              <img src="/images/ايجابي.svg" alt="" className="h-[120px]" />
            )}

          {data?.data?.values?.averageBeforeVal != null && (
            <div className="text-[20px] font-bold flex flex-col items-center justify-center absolute bottom-[10px]">
              <h4>{Number(data.data.values.averageBeforeVal).toFixed(2)}</h4>
              <p className={`px-3 text-white ${
                Number(data.data.values.averageBeforeVal) <= circleChartSection
                  ? "bg-[#e15f4b]"
                  : Number(data.data.values.averageBeforeVal) <=
                    circleChartSection * 2
                  ? "bg-[#f5a623]"
                  : "bg-[#019a8c]"
              }`}>
                {Number(data.data.values.averageBeforeVal) <= circleChartSection
                  ? " سلبي"
                  : Number(data.data.values.averageBeforeVal) <=
                    circleChartSection * 2
                  ? " معتدل"
                  : " إيجابي"}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white flex items-center flex-col">
        <div className="bg-[#03998d] text-white w-full py-2">
          <h5 className="text-center text-[20px]">
            معــــــــــــــــــــــــــــــدل التغيـــــــــــــــــــــــــر
          </h5>
        </div>

        <div className="flex items-center justify-center h-full p-4">
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center justify-center">
              <h4
                className={`text-[30px] font-bold ${
                  averageChangeRate <= 0 ? "text-[#e15f4b]" : "text-[#019a8c]"
                }`}
              >
                {averageChangeRate.toFixed(2)}%
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
        </div>
      </div>
    </div>
  );
}
