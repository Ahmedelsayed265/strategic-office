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

    await (document.fonts?.ready?.catch(() => undefined) ?? Promise.resolve());

    await new Promise<void>((resolve) => {
      const images = Array.from(el.querySelectorAll("img"));
      if (images.length === 0) {
        resolve();
        return;
      }
      let done = 0;
      const check = () => {
        done += 1;
        if (done >= images.length) resolve();
      };
      images.forEach((img) => {
        const himg = img as HTMLImageElement;
        if (himg.complete) check();
        else {
          himg.addEventListener("load", check);
          himg.addEventListener("error", check);
        }
      });
    });

    const style = document.createElement("style");
    style.setAttribute("data-print-style", "true");
    style.innerHTML = `
      #printable-header { display: block !important; visibility: visible !important; position: relative !important; width: 100% !important; background: white !important; overflow: visible !important; }
      #printable-header .recharts-responsive-container { width: 100% !important; height: 430px !important; }
      #printable-header .recharts-wrapper { width: 100% !important; height: 430px !important; }
      #printable-header svg, #printable-header svg *, #printable-header .recharts-wrapper, #printable-header .recharts-wrapper * { display: block !important; visibility: visible !important; opacity: 1 !important; }
      #printable-header img { max-width: 100% !important; height: auto !important; }
    `;
    document.head.appendChild(style);

    const prevDisplay = (el as HTMLElement).style.display;
    const prevVisibility = (el as HTMLElement).style.visibility;
    const prevOpacity = (el as HTMLElement).style.opacity;
    const prevPointerEvents = (el as HTMLElement).style.pointerEvents;
    const prevZIndex = (el as HTMLElement).style.zIndex;
    const prevPosition = (el as HTMLElement).style.position;
    const prevWidth = (el as HTMLElement).style.width;
    const prevClass = (el as HTMLElement).className;

    (el as HTMLElement).style.display = "block";
    (el as HTMLElement).style.visibility = "visible";
    (el as HTMLElement).style.opacity = "1";
    (el as HTMLElement).style.pointerEvents = "auto";
    (el as HTMLElement).style.zIndex = "0";
    (el as HTMLElement).style.position = "relative";
    (el as HTMLElement).style.width = "100%";
    (el as HTMLElement).classList.remove("hidden");

    const containers = el.querySelectorAll(".recharts-responsive-container, .recharts-wrapper");
    containers.forEach((c) => {
      const hc = c as HTMLElement;
      hc.style.width = "100%";
      hc.style.height = "430px";
    });

    const waitForChartsReady = async (root: HTMLElement) => {
      const start = Date.now();
      const timeoutMs = 4500;
      const pollMs = 120;
      while (Date.now() - start < timeoutMs) {
        const svgs = Array.from(
          root.querySelectorAll(
            ".recharts-wrapper svg, .recharts-responsive-container svg, svg.recharts-surface"
          )
        ) as SVGSVGElement[];
        if (svgs.length === 0) return;

        const allReady = svgs.every((svg) => {
          try {
            const bbox = svg.getBBox();
            const hasGraphics = svg.querySelectorAll("path, rect, circle, line, polyline, polygon").length > 0;
            return bbox.width > 10 && bbox.height > 10 && hasGraphics;
          } catch {
            return false;
          }
        });

        if (allReady) return;
        await new Promise((r) => setTimeout(r, pollMs));
      }
    };

    void (el as HTMLElement).offsetHeight;
    window.dispatchEvent(new Event("beforeprint"));
    window.dispatchEvent(new Event("resize"));
    await new Promise((r) => setTimeout(r, 900));

    await waitForChartsReady(el as HTMLElement);

    const forceSvgSize = (root: HTMLElement) => {
      const svgs = Array.from(
        root.querySelectorAll(
          ".recharts-wrapper svg, .recharts-responsive-container svg, svg.recharts-surface"
        )
      ) as SVGSVGElement[];
      svgs.forEach((svg) => {
        const host = (svg.closest(".recharts-wrapper") as HTMLElement | null) ?? (svg.parentElement as HTMLElement | null);
        if (!host) return;
        const w = Math.max(1, Math.floor(host.clientWidth));
        const h = Math.max(1, Math.floor(host.clientHeight));
        if (!svg.getAttribute("width") || svg.getAttribute("width") === "0") svg.setAttribute("width", String(w));
        if (!svg.getAttribute("height") || svg.getAttribute("height") === "0") svg.setAttribute("height", String(h));
        (svg as unknown as HTMLElement).style.width = `${w}px`;
        (svg as unknown as HTMLElement).style.height = `${h}px`;
      });
    };

    forceSvgSize(el as HTMLElement);
    await new Promise((r) => setTimeout(r, 150));

    const canvas = await html2canvas(el as HTMLElement, {
      backgroundColor: "#ffffff",
      useCORS: true,
      scrollX: 0,
      scrollY: 0,
      windowWidth: document.documentElement.scrollWidth,
      windowHeight: document.documentElement.scrollHeight,
      scale: 2,
      imageTimeout: 2000,
      onclone: (doc) => {
        doc.documentElement.setAttribute("dir", "rtl");
        (doc.body as HTMLBodyElement).style.fontFamily = '"Dubai", sans-serif';

        const s = doc.createElement("style");
        s.innerHTML = `
          html, body { background: #ffffff !important; }
          #printable-header { background: #ffffff !important; overflow: visible !important; }
          * { filter: none !important; mix-blend-mode: normal !important; }
          .pattern-overlay { background: #ffffff !important; }
          .pattern-overlay::before { content: none !important; display: none !important; }
          * { animation: none !important; transition: none !important; }
          * { text-rendering: geometricPrecision !important; }
          body { -webkit-font-smoothing: antialiased !important; }
          .print-header h5 { line-height: 1.3 !important; }
          .print-header h4 { line-height: 1.2 !important; }
          #printable-header .recharts-responsive-container { width: 100% !important; height: 430px !important; }
          #printable-header .recharts-wrapper { width: 100% !important; height: 430px !important; }
        `;
        doc.head.appendChild(s);
      },
    });

    window.dispatchEvent(new Event("afterprint"));

    const trimTrailingWhite = (source: HTMLCanvasElement) => {
      const sampleWidth = 240;
      const sampleHeight = Math.max(1, Math.round((source.height / source.width) * sampleWidth));
      const sample = document.createElement("canvas");
      sample.width = sampleWidth;
      sample.height = sampleHeight;
      const sctx = sample.getContext("2d");
      if (!sctx) return source;
      sctx.drawImage(source, 0, 0, sampleWidth, sampleHeight);
      const img = sctx.getImageData(0, 0, sampleWidth, sampleHeight).data;

      const isWhite = (i: number) => {
        const r = img[i];
        const g = img[i + 1];
        const b = img[i + 2];
        const a = img[i + 3];
        return a === 0 || (r > 250 && g > 250 && b > 250);
      };

      let lastNonWhiteRow = -1;
      for (let y = sampleHeight - 1; y >= 0; y -= 1) {
        let rowAllWhite = true;
        const rowStart = y * sampleWidth * 4;
        for (let x = 0; x < sampleWidth; x += 2) {
          const idx = rowStart + x * 4;
          if (!isWhite(idx)) {
            rowAllWhite = false;
            break;
          }
        }
        if (!rowAllWhite) {
          lastNonWhiteRow = y;
          break;
        }
      }

      if (lastNonWhiteRow < 0) return source;

      const effectiveHeight = Math.min(
        source.height,
        Math.max(1, Math.ceil(((lastNonWhiteRow + 1) / sampleHeight) * source.height) + 2)
      );

      if (effectiveHeight >= source.height) return source;

      const trimmed = document.createElement("canvas");
      trimmed.width = source.width;
      trimmed.height = effectiveHeight;
      const tctx = trimmed.getContext("2d");
      if (!tctx) return source;
      tctx.fillStyle = "#ffffff";
      tctx.fillRect(0, 0, trimmed.width, trimmed.height);
      tctx.drawImage(source, 0, 0);
      return trimmed;
    };

    const trimmedCanvas = trimTrailingWhite(canvas);

    const pdf = new jsPDF("landscape", "mm", "a4");
    const pageWidthMm = pdf.internal.pageSize.getWidth();
    const pageHeightMm = pdf.internal.pageSize.getHeight();
    const marginMm = 5;
    const contentWidthMm = pageWidthMm - marginMm * 2;
    const contentHeightMm = pageHeightMm - marginMm * 2;
    const pxToMm = 0.264583;

    const canvasWidthMm = trimmedCanvas.width * pxToMm;
    const scaleToFit = contentWidthMm / canvasWidthMm;
    const pageHeightPx = Math.floor((contentHeightMm / pxToMm) / scaleToFit);

    let pageIndex = 0;
    for (let y = 0; y < trimmedCanvas.height; y += pageHeightPx) {
      const sliceHeight = Math.min(pageHeightPx, trimmedCanvas.height - y);
      const sliceCanvas = document.createElement("canvas");
      sliceCanvas.width = trimmedCanvas.width;
      sliceCanvas.height = sliceHeight;
      const ctx = sliceCanvas.getContext("2d");
      if (!ctx) continue;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
      ctx.drawImage(trimmedCanvas, 0, y, trimmedCanvas.width, sliceHeight, 0, 0, trimmedCanvas.width, sliceHeight);

      const sample = ctx.getImageData(0, Math.max(0, sliceHeight - 1), Math.min(200, sliceCanvas.width), 1).data;
      const bottomRowAllWhite = (() => {
        for (let i = 0; i < sample.length; i += 4) {
          const r = sample[i];
          const g = sample[i + 1];
          const b = sample[i + 2];
          const a = sample[i + 3];
          if (!(a === 0 || (r > 250 && g > 250 && b > 250))) return false;
        }
        return true;
      })();
      if (sliceHeight < 50 && bottomRowAllWhite) continue;

      const imgData = sliceCanvas.toDataURL("image/png");
      const renderW = contentWidthMm;
      const renderH = sliceHeight * pxToMm * scaleToFit;

      if (pageIndex > 0) pdf.addPage();
      pdf.addImage(imgData, "PNG", marginMm, marginMm, renderW, renderH);
      pageIndex += 1;
    }

    pdf.save("indicator.pdf");

    (el as HTMLElement).style.display = prevDisplay;
    (el as HTMLElement).style.visibility = prevVisibility;
    (el as HTMLElement).style.opacity = prevOpacity;
    (el as HTMLElement).style.pointerEvents = prevPointerEvents;
    (el as HTMLElement).style.zIndex = prevZIndex;
    (el as HTMLElement).style.position = prevPosition;
    (el as HTMLElement).style.width = prevWidth;
    (el as HTMLElement).className = prevClass;
    const styleToRemove = document.querySelector('style[data-print-style="true"]');
    if (styleToRemove) styleToRemove.remove();
  };

  const handlePrintHeader = async () => {
    const el = document.getElementById("printable-header");
    if (!el) {
      window.print();
      return;
    }

    if (mainView === "map") {
      const style = document.createElement("style");
      style.setAttribute("data-print-style", "true");
      style.innerHTML = `
        @media print {
          @page { size: A4 portrait; margin: 0.5cm; }
          body > *:not(#printable-header) { display: none !important; }
          #printable-header {
            display: block !important;
            position: static !important;
            opacity: 1 !important;
            pointer-events: auto !important;
            z-index: 9999 !important;
            width: 100% !important;
            background: white !important;
          }
          #printable-header .leaflet-container { width: 100% !important; height: 430px !important; }
        }
      `;
      document.head.appendChild(style);

      const prevOpacity = (el as HTMLElement).style.opacity;
      const prevPointerEvents = (el as HTMLElement).style.pointerEvents;
      const prevZIndex = (el as HTMLElement).style.zIndex;

      (el as HTMLElement).style.opacity = "1";
      (el as HTMLElement).style.pointerEvents = "auto";
      (el as HTMLElement).style.zIndex = "0";

      void (el as HTMLElement).offsetHeight;
      window.dispatchEvent(new Event("resize"));
      await new Promise((r) => setTimeout(r, 600));

      window.print();

      (el as HTMLElement).style.opacity = prevOpacity;
      (el as HTMLElement).style.pointerEvents = prevPointerEvents;
      (el as HTMLElement).style.zIndex = prevZIndex;

      const styleToRemove = document.querySelector('style[data-print-style="true"]');
      if (styleToRemove) styleToRemove.remove();
      return;
    }

    await (document.fonts?.ready?.catch(() => undefined) ?? Promise.resolve());

    await new Promise<void>((resolve) => {
      const images = Array.from(el.querySelectorAll("img"));
      if (images.length === 0) {
        resolve();
        return;
      }
      let done = 0;
      const check = () => {
        done += 1;
        if (done >= images.length) resolve();
      };
      images.forEach((img) => {
        const himg = img as HTMLImageElement;
        if (himg.complete) check();
        else {
          himg.addEventListener("load", check);
          himg.addEventListener("error", check);
        }
      });
    });

    const prevOpacity = (el as HTMLElement).style.opacity;
    const prevPointerEvents = (el as HTMLElement).style.pointerEvents;
    const prevZIndex = (el as HTMLElement).style.zIndex;

    (el as HTMLElement).style.opacity = "1";
    (el as HTMLElement).style.pointerEvents = "auto";
    (el as HTMLElement).style.zIndex = "0";

    void (el as HTMLElement).offsetHeight;
    window.dispatchEvent(new Event("beforeprint"));
    window.dispatchEvent(new Event("resize"));
    await new Promise((r) => setTimeout(r, 900));

    const canvas = await html2canvas(el as HTMLElement, {
      backgroundColor: "#ffffff",
      useCORS: true,
      scrollX: 0,
      scrollY: 0,
      windowWidth: document.documentElement.scrollWidth,
      windowHeight: document.documentElement.scrollHeight,
      scale: 2,
      imageTimeout: 2000,
      onclone: (doc) => {
        doc.documentElement.setAttribute("dir", "rtl");
        (doc.body as HTMLBodyElement).style.fontFamily = '"Dubai", sans-serif';

        const style = doc.createElement("style");
        style.innerHTML = `
          html, body { background: #ffffff !important; }
          #printable-header { background: #ffffff !important; }
          /* Prevent black blocks caused by blend-modes/filters/pattern overlays in html2canvas */
          * { filter: none !important; mix-blend-mode: normal !important; }
          .pattern-overlay { background: #ffffff !important; }
          .pattern-overlay::before { content: none !important; display: none !important; }

          /* Prevent layout shift during capture */
          * { animation: none !important; transition: none !important; }

          * { text-rendering: geometricPrecision !important; }
          body { -webkit-font-smoothing: antialiased !important; }
          /* Keep typography stable without changing layout calculations for all children */
          .print-header h5 { line-height: 1.3 !important; }
          .print-header h4 { line-height: 1.2 !important; }
        `;
        doc.head.appendChild(style);
      },
    });

    window.dispatchEvent(new Event("afterprint"));

    (el as HTMLElement).style.opacity = prevOpacity;
    (el as HTMLElement).style.pointerEvents = prevPointerEvents;
    (el as HTMLElement).style.zIndex = prevZIndex;

    const pageWidthMm = 297;
    const pageHeightMm = 210;
    const marginMm = 5;
    const contentWidthMm = pageWidthMm - marginMm * 2;
    const contentHeightMm = pageHeightMm - marginMm * 2;
    const pxToMm = 0.264583;

    const canvasWidthMm = canvas.width * pxToMm;
    const scaleToFit = contentWidthMm / canvasWidthMm;
    const pageHeightPx = Math.floor((contentHeightMm / pxToMm) / scaleToFit);

    const slices: string[] = [];
    for (let y = 0; y < canvas.height; y += pageHeightPx) {
      const sliceHeight = Math.min(pageHeightPx, canvas.height - y);
      const sliceCanvas = document.createElement("canvas");
      sliceCanvas.width = canvas.width;
      sliceCanvas.height = sliceHeight;
      const ctx = sliceCanvas.getContext("2d");
      if (!ctx) continue;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
      ctx.drawImage(canvas, 0, y, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);
      slices.push(sliceCanvas.toDataURL("image/png"));
    }

    const win = window.open("", "_blank");
    if (!win) return;

    win.document.open();
    win.document.write(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Print</title>
    <style>
      @page { size: A4 portrait; margin: ${marginMm}mm; }
      html, body { margin: 0; padding: 0; background: #fff; }
      .page { width: 100%; page-break-after: always; }
      .page:last-child { page-break-after: auto; }
      img { width: 100%; height: auto; display: block; }
    </style>
  </head>
  <body>
    ${slices
      .map((src) => `<div class="page"><img src="${src}" /></div>`)
      .join("")}
  </body>
</html>`);
    win.document.close();

    win.onafterprint = () => {
      win.close();
    };

    try {
      const mql = win.matchMedia("print");
      const onChange = (e: MediaQueryListEvent) => {
        if (!e.matches) {
          win.close();
          mql.removeEventListener("change", onChange);
        }
      };
      mql.addEventListener("change", onChange);
    } catch {
      // ignore
    }

    await new Promise<void>((resolve) => {
      const images = Array.from(win.document.images);
      if (images.length === 0) {
        resolve();
        return;
      }
      let done = 0;
      const check = () => {
        done += 1;
        if (done >= images.length) resolve();
      };
      images.forEach((img) => {
        if ((img as HTMLImageElement).complete) check();
        else {
          img.addEventListener("load", check);
          img.addEventListener("error", check);
        }
      });
    });

    win.focus();
    win.print();

    // Fallback: if browser doesn't fire afterprint on cancel
    window.setTimeout(() => {
      try {
        if (!win.closed) win.close();
      } catch {
        // ignore
      }
    }, 15000);
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
