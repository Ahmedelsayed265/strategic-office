import useGetFilterData from "@/hooks/useGetFilterData";

export default function Header() {
  const { data } = useGetFilterData();

  const ifLogicReversed =
    Number(data?.data.indicatorCardDetails.postiveNegative) === -1;

  const averageChangeRate: number = Number(
    data?.data?.values?.averageChangeRate ?? 0
  );

  const minVal = Number(data?.data?.values?.averageMinIndVal ?? 0);
  const maxVal = Number(data?.data?.values?.averageMaxIndVal ?? 0);
  const range = maxVal - minVal;
  const sectionSize = range / 3;

  const negativeMax = minVal + sectionSize;
  const normalMax = minVal + sectionSize * 2;

  const getStatus = (value: number | null | undefined) => {
    if (value == null) return null;
    const val = Number(value);

    let status: string;
    if (val <= negativeMax) {
      status = "negative";
    } else if (val <= normalMax) {
      status = "normal";
    } else {
      status = "positive";
    }

    if (ifLogicReversed) {
      if (status === "negative") return "positive";
      if (status === "positive") return "negative";
    }

    return status;
  };

  const getStatusImage = (status: string | null) => {
    switch (status) {
      case "negative":
        return "/images/سلبي.svg";
      case "normal":
        return "/images/معتدل.svg";
      case "positive":
        return "/images/ايجابي.svg";
      default:
        return "";
    }
  };

  const getStatusText = (status: string | null) => {
    switch (status) {
      case "negative":
        return "سلبي";
      case "normal":
        return "معتدل";
      case "positive":
        return "إيجابي";
      default:
        return "";
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "negative":
        return "#FF9533";
      case "normal":
        return "#FFD919";
      case "positive":
        return "#99E63F";
      default:
        return "";
    }
  };

  const currentStatus = getStatus(data?.data?.values?.averageValue);
  const previousStatus = getStatus(data?.data?.values?.averageBeforeVal);

  // Determine change rate status (also reversed if needed)
  const getChangeRateStatus = () => {
    if (ifLogicReversed) {
      return averageChangeRate >= 0 ? "negative" : "positive";
    }
    return averageChangeRate <= 0 ? "negative" : "positive";
  };

  const changeRateStatus = getChangeRateStatus();

  return (
    <div className="print-header">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div className="bg-[#019a8c] p-3 flex items-center justify-center ">
          <img
            src="/images/logo.svg"
            alt="logo"
            className="h-[60px] object-contain"
          />
        </div>

        <div className="bg-white flex items-center flex-col min-h-[222px]">
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

        <div className="bg-white flex items-center flex-col relative min-h-[222px]">
          <div className="bg-[#03998d] text-white w-full py-2">
            <h5 className="text-center text-[20px]">
              قيمة المؤشر لمنطقة الباحة لعام{" "}
              {data?.data?.values?.lastYear ?? ""}
            </h5>
          </div>

          <div className="h-full flex items-center justify-center flex-col p-4 pb-[40px]">
            {currentStatus && (
              <img
                src={getStatusImage(currentStatus)}
                alt={getStatusText(currentStatus) || ""}
                className="h-[120px]"
              />
            )}

            {data?.data?.values?.averageValue != null && (
              <div className="text-[20px] font-bold flex flex-col items-center justify-center absolute bottom-[10px] left-1/2 transform -translate-x-1/2">
                <h4
                  style={{ color: getStatusColor(currentStatus) ?? undefined }}
                >
                  {Number(data.data.values.averageValue).toFixed(2)}
                </h4>
                <p
                  className="px-3 text-white"
                  style={{
                    backgroundColor: getStatusColor(currentStatus) ?? undefined,
                  }}
                >
                  {getStatusText(currentStatus)}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white flex items-center flex-col relative min-h-[222px]">
          <div className="bg-[#03998d] text-white w-full py-2">
            <h5 className="text-center text-[20px]">
              قيمة المؤشر لمنطقة الباحة لعام{" "}
              {data?.data?.values?.yearBefore ?? ""}
            </h5>
          </div>

          <div className="h-full flex items-center justify-center flex-col p-4 pb-[40px]">
            {previousStatus && (
              <img
                src={getStatusImage(previousStatus)}
                alt={getStatusText(previousStatus) || ""}
                className="h-[120px]"
              />
            )}

            {data?.data?.values?.averageBeforeVal != null && (
              <div className="text-[20px] font-bold flex flex-col items-center justify-center absolute bottom-[10px] left-1/2 transform -translate-x-1/2">
                <h4
                  style={{ color: getStatusColor(previousStatus) ?? undefined }}
                >
                  {Number(data.data.values.averageBeforeVal).toFixed(2)}
                </h4>
                <p
                  className="px-3 text-white"
                  style={{
                    backgroundColor:
                      getStatusColor(previousStatus) ?? undefined,
                  }}
                >
                  {getStatusText(previousStatus)}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white flex items-center flex-col min-h-[222px]">
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
                    changeRateStatus === "negative"
                      ? "text-[#e15f4b]"
                      : "text-[#019a8c]"
                  }`}
                >
                  {averageChangeRate.toFixed(2)}%
                </h4>
                <span
                  className={`${
                    changeRateStatus === "negative"
                      ? "bg-[#e15f4b]"
                      : "bg-[#019a8c]"
                  } text-white px-2 text-[22px] w-full text-center`}
                >
                  {changeRateStatus === "negative" ? "سلبي" : "إيجابى"}
                </span>
              </div>

              <img
                src={
                  changeRateStatus === "negative"
                    ? "/images/down.svg"
                    : "/images/up.svg"
                }
                alt=""
                className="h-[80px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
