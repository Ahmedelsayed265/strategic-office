import { useSearchParams } from "react-router";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function FilterHeader() {
  const [searchParams, setSearchParams] = useSearchParams();

  const chartType = searchParams.get("chartType") || "";
  const region = searchParams.get("region") || "";
  const view = searchParams.get("view") || "chart";
  const mainView = searchParams.get("mainView") || "indicator";

  const handleParamChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    setSearchParams(params);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center bg-[#F8F9FC] p-1 rounded-md">
          {[
            { key: "indicator", label: "عرض المؤشر" },
            { key: "metadata", label: "بيانات وصفية" },
            { key: "map", label: "عرض علي الخريطة" },
          ].map((btn) => (
            <button
              key={btn.key}
              onClick={() => handleParamChange("mainView", btn.key)}
              className={`py-2 px-4 rounded-md transition-colors ${
                mainView === btn.key
                  ? "bg-[#25935F] text-white"
                  : "text-[#6C737F] hover:text-[#1F2A37]"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-6 bg-[#F8F9FC] py-3 px-6 rounded-md text-[#1F2A37]">
          <h6>طريقة العرض</h6>

          <RadioGroup
            value={view}
            onValueChange={(val) => handleParamChange("view", val)}
            className="flex flex-row gap-4"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="chart" id="chart" />
              <label htmlFor="chart" className="text-[#6C737F]">
                رسم بياني
              </label>
            </div>

            <div className="flex items-center gap-2">
              <RadioGroupItem value="table" id="table" />
              <label htmlFor="table" className="text-[#6C737F]">
                جدول
              </label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div
        className={`flex items-center mt-4 ${
          view === "chart" ? "justify-between" : "justify-end"
        }`}
      >
        {view === "chart" && (
          <div className="flex items-center gap-2">
            <Select
              value={chartType}
              onValueChange={(val) => handleParamChange("chartType", val)}
            >
              <SelectTrigger className="w-full px-4 !h-[40px] rounded-[8px] border-0 bg-[#F8F9FC]">
                <SelectValue placeholder="نوع الرسم البياني" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="cols">أعمدة</SelectItem>
                <SelectItem value="lines">خطي</SelectItem>
                <SelectItem value="pie">قرص</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={region}
              onValueChange={(val) => handleParamChange("region", val)}
            >
              <SelectTrigger className="w-full px-4 !h-[40px] rounded-[8px] border-0 bg-[#F8F9FC]">
                <SelectValue placeholder="النطاق العمراني" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="Jazan">منطقة جازان</SelectItem>
                <SelectItem value="Asir">منطقة عسير</SelectItem>
                <SelectItem value="Najran">منطقة نجران</SelectItem>
                <SelectItem value="Baha">منطقة الباحة</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button className="bg-[#DFF6E7] p-2 rounded-[8px]">
            <img src="/icons/pdf-02.svg" alt="pdf" />
          </button>
          <button className="bg-[#DFF6E7] p-2 rounded-[8px]">
            <img src="/icons/Vector.svg" alt="excel" />
          </button>
        </div>
      </div>
    </>
  );
}
