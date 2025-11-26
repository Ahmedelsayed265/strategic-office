import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { updateSearchParams } from "@/updateParams";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import MultiOptionSelect from "../../shared/MultiOptionSelect";
import useGetFilterData from "@/hooks/useGetFilterData";
import useGetPointers from "@/hooks/useGetPointers";

export default function FilterHeader() {
  const { data: indicatorData, isLoading } = useGetFilterData();
  const { data: pointers } = useGetPointers();

  const [pointersIds, setPointersIds] = useState<number[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const mainView = searchParams.get("mainView") || "indicator";
  const chartType = searchParams.get("chartType") || "";
  const view = searchParams.get("view") || "chart";

  useEffect(() => {
    if (pointers?.data) {
      setPointersIds(pointers.data.map((p) => p.id));
    }
  }, [pointers]);

  const handleParamChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    setSearchParams(params);
  };

  const handlePrev = () => {
    const current = Number(searchParams.get("pointer")) || 0;
    const currentIndex = pointersIds.indexOf(current);
    const prevId = pointersIds[currentIndex - 1];
    if (prevId !== undefined) {
      updateSearchParams(
        setSearchParams,
        { pointer: prevId.toString() },
        "pointer"
      );
    }
  };

  const handleNext = () => {
    const current = Number(searchParams.get("pointer")) || 0;
    const currentIndex = pointersIds.indexOf(current);
    const nextId = pointersIds[currentIndex + 1];
    if (nextId !== undefined) {
      updateSearchParams(
        setSearchParams,
        { pointer: nextId.toString() },
        "pointer"
      );
    }
  };

  return (
    <>
      {/* طريقه العرض  [رسم بيانى - بيانات وصفيه - خريطة] ولو رسم بيانى عرض [جدول - ورسومات بيانية ] */}
      <div className="flex items-center justify-between">
        <div className="flex items-center bg-[#F8F9FC] p-1 ">
          {[
            { key: "indicator", label: "عرض المؤشر" },
            { key: "metadata", label: "بيانات وصفية" },
            { key: "map", label: "عرض علي الخريطة" },
          ].map((btn) => (
            <button
              key={btn.key}
              onClick={() =>
                updateSearchParams(
                  setSearchParams,
                  { mainView: btn.key },
                  "mainView"
                )
              }
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
              onValueChange={(val) =>
                updateSearchParams(setSearchParams, { view: val }, "view")
              }
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

      {/* مناطق - محافظات - سنوات - موشرات فرعية - نوع الرسم البيانى  */}
      <div className="flex items-center mt-4 justify-between">
        <div className="flex items-center gap-2">
          {indicatorData?.data?.region?.length !== 0 && !isLoading && indicatorData?.data && (
            <MultiOptionSelect
              paramKey="region"
              options={
                indicatorData?.data?.region?.map((reg) => ({
                  label: reg.name,
                  value: reg.id.toString(),
                })) || []
              }
              placeholder="المناطق"
              onChange={(key, values) => {
                const params = new URLSearchParams(searchParams);
                if (values.length === 0) params.delete(key);
                else params.set(key, values.join("-"));
                setSearchParams(params);
              }}
            />
          )}

          {indicatorData?.data?.govs?.length !== 0 && !isLoading && indicatorData?.data && (
            <MultiOptionSelect
              placeholder="المحافظات"
              paramKey="govs"
              options={
                indicatorData?.data?.govs?.map((gov) => ({
                  label: gov.name,
                  value: gov.id.toString(),
                })) || []
              }
              onChange={(key, values) => {
                const params = new URLSearchParams(searchParams);
                if (values.length === 0) params.delete(key);
                else params.set(key, values.join("-"));
                setSearchParams(params);
              }}
            />
          )}

          {indicatorData?.data?.years?.length !== 0 && !isLoading && indicatorData?.data && (
            <MultiOptionSelect
              placeholder="السنوات"
              paramKey="year"
              options={
                indicatorData?.data?.years?.map((y) => ({
                  label: y.name,
                  value: y.id.toString(),
                })) || []
              }
              onChange={(key, values) => {
                const params = new URLSearchParams(searchParams);
                if (values.length === 0) params.delete(key);
                else params.set(key, values.join("-"));
                setSearchParams(params);
              }}
            />
          )}

          {indicatorData?.data?.subIndicators?.length !== 0 && !isLoading && indicatorData?.data && (
            <MultiOptionSelect
              placeholder="المؤشر"
              paramKey="subIndicators"
              options={
                indicatorData?.data?.subIndicators?.map((ind) => ({
                  label: ind.name,
                  value: ind.id.toString(),
                })) || []
              }
              onChange={(key, values) => {
                const params = new URLSearchParams(searchParams);
                if (values.length === 0) params.delete(key);
                else params.set(key, values.join("-"));
                setSearchParams(params);
              }}
            />
          )}

          {mainView === "indicator" && view === "chart" && (
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
        </div>

        <div className="flex items-center gap-2">
          <button className="bg-[#DFF6E7] p-2">
            <img src="/icons/pdf-02.svg" alt="pdf" />
          </button>
          <button className="bg-[#DFF6E7] p-2">
            <img src="/icons/Vector.svg" alt="excel" />
          </button>
        </div>
      </div>

      <div
        className={`flex items-center mt-4 ${
          mainView === "metadata" ? "justify-end" : "justify-between"
        }`}
      >
        {mainView !== "metadata" && (
          <p className="text-[16px]">
            وحدة القياس :{" "}
            <b className="text-[#25935F]">{indicatorData?.data.migUnit}</b>
          </p>
        )}

        <div className="flex items-center gap-2">
          <button
            className="p-2 px-4 bg-gray-100"
            onClick={handlePrev}
            disabled={
              !searchParams.get("pointer") ||
              pointersIds.indexOf(Number(searchParams.get("pointer"))) <= 0
            }
          >
            السابق
          </button>
          <button
            className="p-2 px-4 bg-gray-100"
            onClick={handleNext}
            disabled={
              !searchParams.get("pointer") ||
              pointersIds.indexOf(Number(searchParams.get("pointer"))) ===
                pointersIds.length - 1
            }
          >
            التالى
          </button>
        </div>
      </div>
    </>
  );
}
