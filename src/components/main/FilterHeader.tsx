import { useSearchParams } from "react-router";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import MultiOptionSelect from "../shared/MultiOptionSelect";

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
        <div className="flex items-center bg-[#F8F9FC] p-1 ">
          {[
            { key: "indicator", label: "عرض المؤشر" },
            { key: "metadata", label: "بيانات وصفية" },
            { key: "map", label: "عرض علي الخريطة" },
          ].map((btn) => (
            <button
              key={btn.key}
              onClick={() => {
                const params = new URLSearchParams();
                params.set("mainView", btn.key);
                setSearchParams(params);
              }}
              className={`py-2 px-4 transition-colors ${
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
          <div className="flex items-center gap-6 bg-[#F8F9FC] py-3 px-6  text-[#1F2A37]">
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
        {mainView === "metadata" && (
          <div className="flex items-center gap-2">
            <button className="bg-[#DFF6E7] p-2 ">
              <img src="/icons/pdf-02.svg" alt="pdf" />
            </button>
            <button className="bg-[#DFF6E7] p-2 ">
              <img src="/icons/Vector.svg" alt="excel" />
            </button>
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
                <SelectTrigger className="w-full px-4 !h-[40px] border-0 bg-[#F8F9FC]">
                  <SelectValue placeholder="نوع الرسم البياني" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem className="px-3" value="cols">
                    أعمدة
                  </SelectItem>
                  <SelectItem className="px-3" value="lines">
                    خطي
                  </SelectItem>
                  <SelectItem className="px-3" value="circle">
                    دائرى
                  </SelectItem>
                  <SelectItem className="px-3" value="pie">
                    قرص
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
            {mainView !== "metadata" && (
              <MultiOptionSelect
                paramKey="region"
                options={[
                  { label: "منطقة جازان", value: "Jazan" },
                  { label: "منطقة عسير", value: "Asir" },
                  { label: "منطقة نجران", value: "Najran" },
                  { label: "منطقة الباحة", value: "Baha" },
                ]}
                placeholder="النطاق العمراني"
                onChange={(key, values) => {
                  const params = new URLSearchParams(searchParams);
                  if (values.length === 0) params.delete(key);
                  else params.set(key, values.join(","));
                  setSearchParams(params);
                }}
              />
            )}
            {mainView === "map" && (
              <>
                <MultiOptionSelect
                  placeholder="المؤشر"
                  paramKey="indicator"
                  options={[
                    { label: "تطور معدل انتشار الإنترنت", value: "1" },
                    {
                      label: "مؤشرات نقل واستخدام تقنية المعلومات",
                      value: "2",
                    },
                    {
                      label:
                        "جودة الخدمات - سرعة الشبكات من خلال الشركات المشغلة Zain",
                      value: "3",
                    },
                    {
                      label: "نسبة الخدمات غير اللاسلكية في القطاع العام",
                      value: "4",
                    },
                  ]}
                  onChange={(key, values) => {
                    const params = new URLSearchParams(searchParams);
                    if (values.length === 0) params.delete(key);
                    else params.set(key, values.join(","));
                    setSearchParams(params);
                  }}
                />

                <MultiOptionSelect
                  placeholder="السنوات"
                  paramKey="year"
                  options={[
                    ...Array.from({ length: 12 }, (_, i) => ({
                      label: `${2025 - i}`,
                      value: `${2025 - i}`,
                    })),
                  ]}
                  onChange={(key, values) => {
                    const params = new URLSearchParams(searchParams);
                    if (values.length === 0) params.delete(key);
                    else params.set(key, values.join(","));
                    setSearchParams(params);
                  }}
                />
              </>
            )}
          </div>
        )}
        {mainView !== "metadata" && (
          <div className="flex items-center gap-2">
            <button className="bg-[#DFF6E7] p-2">
              <img src="/icons/pdf-02.svg" alt="pdf" />
            </button>
            <button className="bg-[#DFF6E7] p-2">
              <img src="/icons/Vector.svg" alt="excel" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
