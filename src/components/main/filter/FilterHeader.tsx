import { useSearchParams } from "react-router";
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
import NextPrevComponent from "./NextPrevComponent";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function FilterHeader() {
  const { data: indicatorData, isLoading } = useGetFilterData();

  const [searchParams, setSearchParams] = useSearchParams();

  const mainView = searchParams.get("mainView") || "indicator";
  const chartType = searchParams.get("chartType") || "";
  const view = searchParams.get("view") || "chart";

  const handleParamChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    setSearchParams(params);
  };

  const handleDownloadPdf = async () => {
    const el = document.getElementById("printable-header");
    if (!el) return;

    const existingStyle = document.querySelector('style[data-print-style="true"]');
    if (existingStyle) existingStyle.remove();

    const style = document.createElement("style");
    style.setAttribute("data-print-style", "true");
    style.innerHTML = `
      #printable-header { display: block !important; visibility: visible !important; position: relative !important; width: 100% !important; background: white !important; }
      #printable-header .recharts-responsive-container { width: 100% !important; height: 430px !important; }
      #printable-header .recharts-wrapper { width: 100% !important; height: 430px !important; }
      #printable-header svg, #printable-header svg *, #printable-header .recharts-wrapper, #printable-header .recharts-wrapper * { display: block !important; visibility: visible !important; opacity: 1 !important; }
      #printable-header img { max-width: 100% !important; height: auto !important; }
    `;
    document.head.appendChild(style);

    const prevDisplay = (el as HTMLElement).style.display;
    const prevVisibility = (el as HTMLElement).style.visibility;
    const prevClass = (el as HTMLElement).className;

    (el as HTMLElement).style.display = "block";
    (el as HTMLElement).style.visibility = "visible";
    (el as HTMLElement).style.position = "relative";
    (el as HTMLElement).style.width = "100%";
    (el as HTMLElement).classList.remove("hidden");

    const containers = el.querySelectorAll(".recharts-responsive-container, .recharts-wrapper");
    containers.forEach((c) => {
      const hc = c as HTMLElement;
      hc.style.width = "100%";
      hc.style.height = "430px";
    });

    void (el as HTMLElement).offsetHeight;
    await new Promise((r) => setTimeout(r, 600));

    const canvas = await html2canvas(el as HTMLElement, {
      backgroundColor: "#ffffff",
      useCORS: true,
      scale: 2,
      imageTimeout: 2000,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("landscape", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const pxToMm = 0.264583;
    const contentWidthMm = canvas.width * pxToMm;
    const contentHeightMm = canvas.height * pxToMm;
    const margin = 5;
    const maxW = pageWidth - margin * 2;
    const maxH = pageHeight - margin * 2;
    const scale = Math.min(maxW / contentWidthMm, maxH / contentHeightMm);
    const renderW = contentWidthMm * scale;
    const renderH = contentHeightMm * scale;
    pdf.addImage(imgData, "PNG", margin, margin, renderW, renderH);
    pdf.save("indicator.pdf");

    (el as HTMLElement).style.display = prevDisplay;
    (el as HTMLElement).style.visibility = prevVisibility;
    (el as HTMLElement).className = prevClass;
    const styleToRemove = document.querySelector('style[data-print-style="true"]');
    if (styleToRemove) styleToRemove.remove();
  };

  const handlePrintHeader = () => {
    const el = document.getElementById("printable-header");
    const style = document.createElement("style");
    style.setAttribute("data-print-style", "true");
    style.innerHTML = `
      @media print {
        body * { visibility: hidden !important; }
        #printable-header, #printable-header * { visibility: visible !important; }
        #printable-header { display: block !important; position: absolute; left: 0; top: 0; width: 100%; }
      }
    `;
    document.head.appendChild(style);

    if (!el) {
      window.print();
      document.head.removeChild(style);
      return;
    }

    const previousDisplay = el.style.display;
    el.style.display = "block";
    window.print();
    el.style.display = previousDisplay;
    document.head.removeChild(style);
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
          {indicatorData?.data?.region?.length !== 0 &&
            !isLoading &&
            indicatorData?.data && (
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
                  params.delete("govs");
                  setSearchParams(params);
                }}
              />
            )}

          {indicatorData?.data?.govs?.length !== 0 &&
            !isLoading &&
            indicatorData?.data && (
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
                  params.delete("region");
                  setSearchParams(params);
                }}
              />
            )}

          {indicatorData?.data?.years?.length !== 0 &&
            !isLoading &&
            indicatorData?.data && (
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

          {indicatorData?.data?.subIndicators?.length !== 0 &&
            !isLoading &&
            indicatorData?.data && (
              <MultiOptionSelect
                placeholder="المؤشرات الفرعيه"
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
        </div>

        <div className="flex items-center gap-2">
          <button className="bg-[#DFF6E7] p-2" onClick={handleDownloadPdf}>
            <img src="/icons/pdf-02.svg" alt="pdf" />
          </button>
          
          <button className="bg-[#DFF6E7] p-2" onClick={handlePrintHeader}>
            <img src="/icons/Vector.svg" alt="excel" />
          </button>
        </div>
      </div>

      {mainView !== "indicator" && <NextPrevComponent />}
    </>
  );
}
