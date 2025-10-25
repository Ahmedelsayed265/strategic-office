import { useSearchParams } from "react-router";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import MultiRegionSelect from "../shared/MultiRegionSelect";

export default function FilterHeader() {
  const [searchParams, setSearchParams] = useSearchParams();

  const chartType = searchParams.get("chartType") || "";
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

        {mainView === "indicator" && (
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
        )}
      </div>

      <div
        className={`flex items-center mt-4 ${
          view === "chart" ? "justify-between" : "justify-end"
        }`}
      >
        {view === "chart" && (
          <div className="flex items-center gap-2">
            {mainView === "indicator" && (
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
                  <SelectItem value="circle">دائرى</SelectItem>
                  <SelectItem value="pie">قرص</SelectItem>
                </SelectContent>
              </Select>
            )}

            <MultiRegionSelect />

            {mainView !== "indicator" && (
              <>
                <Select
                  value={chartType}
                  onValueChange={(val) => handleParamChange("indicator", val)}
                >
                  <SelectTrigger className="w-full px-4 !h-[40px] rounded-[8px] border-0 bg-[#F8F9FC]">
                    <SelectValue placeholder="المؤشر" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="1">تطور معدل انتشار الإنترنت</SelectItem>
                    <SelectItem value="2">
                      مؤشرات نقل واستخدام تقنية المعلومات والاتصالات
                    </SelectItem>
                    <SelectItem value="3">
                      جودة الخدمات - سرعة الشبكات من خلال الشركات المشغلة Zain
                    </SelectItem>
                    <SelectItem value="4">
                      نسبة الخدمات غير اللاسلكية في القطاع العام
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={chartType}
                  onValueChange={(val) => handleParamChange("year", val)}
                >
                  <SelectTrigger className="w-full px-4 !h-[40px] rounded-[8px] border-0 bg-[#F8F9FC]">
                    <SelectValue placeholder="السنوات" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                    <SelectItem value="2021">2021</SelectItem>
                    <SelectItem value="2020">2020</SelectItem>
                    <SelectItem value="2019">2019</SelectItem>
                    <SelectItem value="2018">2018</SelectItem>
                    <SelectItem value="2017">2017</SelectItem>
                    <SelectItem value="2016">2016</SelectItem>
                    <SelectItem value="2015">2015</SelectItem>
                    <SelectItem value="2014">2014</SelectItem>
                  </SelectContent>
                </Select>
              </>
            )}
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
