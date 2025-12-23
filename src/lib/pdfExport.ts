import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Exports the printable content to PDF with proper styling
 * @param elementId - The ID of the element to export (default: "printable-content")
 */
export async function exportToPDF(elementId: string = "printable-content"): Promise<void> {
  console.log("Starting PDF export...");
  const element = document.getElementById(elementId);

  if (!element) {
    const errorMsg = `Element with id "${elementId}" not found. Please ensure ViewToPrint component is rendered.`;
    console.error(errorMsg);
    alert(errorMsg);
    return;
  }

  console.log("Element found, starting export process...");

  // Remove hidden/d-none classes if present FIRST
  element.classList.remove("d-none", "hidden");

  // Trigger print events for charts (they listen to beforeprint) BEFORE making visible
  const beforePrintEvent = new Event("beforeprint");
  window.dispatchEvent(beforePrintEvent);
  element.dispatchEvent(new Event("beforeprint"));

  // Wait a bit for the event handlers to process
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Create a hidden clone for capture to avoid visual glitch
  const body = document.body;
  const originalBodyOverflow = body.style.overflow;

  // Create a hidden container that won't be visible but html2canvas can capture
  const captureContainer = document.createElement("div");
  captureContainer.style.position = "absolute";
  captureContainer.style.left = "-99999px";
  captureContainer.style.top = "0";
  captureContainer.style.width = "210mm";
  captureContainer.style.zIndex = "-1";
  captureContainer.style.visibility = "hidden";
  captureContainer.style.pointerEvents = "none";
  document.body.appendChild(captureContainer);

  // Clone the element for capture
  const clonedElement = element.cloneNode(true) as HTMLElement;
  clonedElement.id = "printable-content-clone";
  clonedElement.classList.remove("hidden", "d-none");
  clonedElement.style.display = "block";
  clonedElement.style.visibility = "visible";
  clonedElement.style.opacity = "1";
  clonedElement.style.position = "relative";
  
  // Set a fixed width that's wide enough for charts (A4 width at 96 DPI ≈ 794px)
  const targetWidth = 794;
  clonedElement.style.width = `${targetWidth}px`;
  clonedElement.style.maxWidth = `${targetWidth}px`;
  clonedElement.style.minWidth = `${targetWidth}px`;
  clonedElement.style.height = "auto";
  clonedElement.style.overflow = "visible";
  clonedElement.style.background = "#ffffff";
  clonedElement.style.padding = "20px";
  clonedElement.style.boxSizing = "border-box";

  // Set container width to match
  captureContainer.style.width = `${targetWidth}px`;
  captureContainer.style.minWidth = `${targetWidth}px`;
  captureContainer.style.maxWidth = `${targetWidth}px`;

  // ===== FIX HEADER CARDS CONTAINER AND LAYOUT =====
  // Find the header container - typically a flex or grid container with cards
  const headerContainers = clonedElement.querySelectorAll('[class*="flex"], [class*="grid"]');
  
  headerContainers.forEach((container: Element) => {
    const htmlContainer = container as HTMLElement;
    
    // Check if this container has multiple card-like children
    const children = Array.from(htmlContainer.children) as HTMLElement[];
    const hasCardChildren = children.some(child => 
      child.classList.toString().includes("bg-") || 
      child.style.backgroundColor
    );
    
    if (hasCardChildren && children.length >= 3) {
      // This is likely the header cards container
      console.log("Found header cards container, fixing layout...");
      
      // Force horizontal flex layout
      htmlContainer.style.display = "flex";
      htmlContainer.style.flexDirection = "row";
      htmlContainer.style.flexWrap = "nowrap";
      htmlContainer.style.gap = "8px";
      htmlContainer.style.alignItems = "stretch";
      htmlContainer.style.justifyContent = "flex-start";
      htmlContainer.style.width = "100%";
      htmlContainer.style.overflow = "visible";
      
      // Fix each card
      children.forEach((card, index) => {
        // Reset any problematic positioning
        card.style.position = "relative";
        card.style.float = "none";
        card.style.clear = "none";
        
        // Set flex properties for cards
        card.style.flex = "1 1 0";
        card.style.minWidth = "120px";
        card.style.maxWidth = "180px";
        card.style.padding = "10px";
        card.style.margin = "0";
        card.style.boxSizing = "border-box";
        card.style.display = "flex";
        card.style.flexDirection = "column";
        card.style.alignItems = "center";
        card.style.justifyContent = "center";
        card.style.textAlign = "center";
        
        // Fix all text elements inside cards
        const allTextElements = card.querySelectorAll("*");
        allTextElements.forEach((el: Element) => {
          const htmlEl = el as HTMLElement;
          const computedStyle = window.getComputedStyle(htmlEl);
          const currentFontSize = parseFloat(computedStyle.fontSize);
          
          // Reset any absolute positioning
          htmlEl.style.position = "relative";
          htmlEl.style.float = "none";
          
          // Reduce font size significantly
          if (currentFontSize > 0) {
            // More aggressive reduction
            htmlEl.style.fontSize = `${Math.max(currentFontSize * 0.5, 8)}px`;
            htmlEl.style.lineHeight = "1.2";
          }
          
          // Fix specific elements
          if (htmlEl.textContent) {
            const text = htmlEl.textContent.trim();
            
            // Large numbers with %
            if (text.includes("%") && text.length < 10) {
              htmlEl.style.fontSize = "16px";
              htmlEl.style.fontWeight = "700";
              htmlEl.style.marginBottom = "2px";
            }
            // Labels like "سلبي", "إيجابي"
            else if (text.length < 15 && !text.includes("2022") && !text.includes("المؤشر")) {
              htmlEl.style.fontSize = "9px";
              htmlEl.style.fontWeight = "500";
            }
            // Longer text (titles)
            else if (text.length > 15) {
              htmlEl.style.fontSize = "10px";
              htmlEl.style.fontWeight = "600";
              htmlEl.style.marginBottom = "3px";
            }
          }
          
          // Fix headings
          if (htmlEl.tagName.match(/^H[1-6]$/)) {
            htmlEl.style.fontSize = "11px";
            htmlEl.style.fontWeight = "600";
            htmlEl.style.marginBottom = "3px";
            htmlEl.style.marginTop = "0";
          }
          
          // Fix paragraphs and spans
          if (htmlEl.tagName === "P" || htmlEl.tagName === "SPAN") {
            if (currentFontSize > 14) {
              htmlEl.style.fontSize = "9px";
            }
          }
        });
        
        // Handle arrow icons or special elements
        const svgs = card.querySelectorAll("svg");
        svgs.forEach((svg: Element) => {
          const htmlSvg = svg as SVGElement;
          // Check if it's a small icon (not a gauge chart)
          const width = htmlSvg.getAttribute("width");
          const isSmallIcon = !width || parseInt(width) < 50;
          
          if (isSmallIcon) {
            htmlSvg.setAttribute("width", "20");
            htmlSvg.setAttribute("height", "20");
            htmlSvg.style.maxWidth = "20px";
            htmlSvg.style.maxHeight = "20px";
          }
        });
      });
    }
  });

  // ===== FIX INDICATOR DETAILS SECTION =====
  // Find sections with icon + text layout
  const detailSections = clonedElement.querySelectorAll('[class*="flex"]');
  detailSections.forEach((section: Element) => {
    const htmlSection = section as HTMLElement;
    
    // Look for rows with icon + text pattern
    const children = Array.from(htmlSection.children) as HTMLElement[];
    children.forEach((child) => {
      const img = child.querySelector("img");
      const svg = child.querySelector("svg");
      const icon = img || svg;
      
      // If this element has an icon, constrain it
      if (icon) {
        const htmlIcon = icon as HTMLElement;
        
        // Check if it's actually an icon (not a chart)
        const isChart = htmlIcon.classList.toString().includes("recharts") ||
                       htmlIcon.closest(".recharts-wrapper") ||
                       (svg && (svg as SVGElement).querySelector("[class*='recharts']"));
        
        if (!isChart) {
          // It's an icon, constrain it
          if (img) {
            htmlIcon.style.width = "18px";
            htmlIcon.style.height = "18px";
            htmlIcon.style.maxWidth = "18px";
            htmlIcon.style.maxHeight = "18px";
            htmlIcon.style.minWidth = "18px";
            htmlIcon.style.minHeight = "18px";
            htmlIcon.style.objectFit = "contain";
            htmlIcon.style.flex = "0 0 18px";
          } else if (svg) {
            (svg as SVGElement).setAttribute("width", "18");
            (svg as SVGElement).setAttribute("height", "18");
            htmlIcon.style.width = "18px";
            htmlIcon.style.height = "18px";
            htmlIcon.style.maxWidth = "18px";
            htmlIcon.style.maxHeight = "18px";
            htmlIcon.style.flex = "0 0 18px";
          }
          
          // Constrain the parent container too
          const parent = htmlIcon.parentElement;
          if (parent && parent !== htmlSection) {
            parent.style.flex = "0 0 auto";
            parent.style.maxWidth = "30px";
            parent.style.display = "flex";
            parent.style.alignItems = "center";
            parent.style.justifyContent = "center";
          }
        }
      }
    });
  });

  // Ensure all child containers have proper overflow
  const childContainers = clonedElement.querySelectorAll("div");
  childContainers.forEach((container: Element) => {
    const htmlContainer = container as HTMLElement;
    if (htmlContainer.style) {
      // Don't override if it's a chart container
      if (!htmlContainer.classList.contains("recharts-wrapper")) {
        htmlContainer.style.overflow = "visible";
        // Ensure chart containers have full width
        if (htmlContainer.querySelector(".recharts-wrapper") || 
            htmlContainer.querySelector("svg[class*='recharts']")) {
          htmlContainer.style.width = "100%";
          htmlContainer.style.maxWidth = "100%";
        }
      }
    }
  });

  // Fix recharts wrappers
  const rechartsWrappers = clonedElement.querySelectorAll(".recharts-wrapper");
  rechartsWrappers.forEach((wrapper: Element) => {
    const htmlWrapper = wrapper as HTMLElement;
    htmlWrapper.style.overflow = "visible";
    htmlWrapper.style.width = "100%";
    htmlWrapper.style.maxWidth = "100%";
  });

  // Fix chart SVG elements
  const svgElementsInClone = clonedElement.querySelectorAll("svg");
  svgElementsInClone.forEach((svg: Element) => {
    const htmlSvg = svg as SVGElement;
    const width = htmlSvg.getAttribute("width");
    const isChart = htmlSvg.classList.contains("recharts-surface") || 
                    htmlSvg.querySelector("[class*='recharts']") ||
                    (width && parseInt(width) > 100);
    
    // Only apply chart-specific styling to actual charts
    if (isChart) {
      htmlSvg.style.overflow = "visible";
      // Remove any clipPath that might be cutting content
      const clipPath = htmlSvg.querySelector("defs clipPath");
      if (clipPath) {
        clipPath.remove();
      }
      // Ensure SVG has proper width
      if (htmlSvg.getAttribute("width") && htmlSvg.getAttribute("width") !== "100%") {
        htmlSvg.setAttribute("width", "100%");
      }
    }
  });

  captureContainer.appendChild(clonedElement);

  // Wait for React to render
  await new Promise((resolve) => setTimeout(resolve, 500));
  void clonedElement.offsetHeight;
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Check if content exists
  const innerContent = clonedElement.querySelector("div > *");
  if (!innerContent) {
    console.warn("No inner content found, waiting more...");
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // Wait for map tiles if present
  const mapContainer = clonedElement.querySelector(".leaflet-container") as HTMLElement;
  if (mapContainer) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const leafletMap = (mapContainer as any)._leaflet_id;
    if (leafletMap && (window as any).L) {
      const L = (window as any).L;
      const maps = L.Map ? Object.values(L.Map._instances || {}) : [];
      const map = maps.find((m: any) => m._container === mapContainer);
      if (map) {
        map.invalidateSize();
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const tiles = mapContainer.querySelectorAll(".leaflet-tile-loaded");
        if (tiles.length === 0) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }
    } else {
      let attempts = 0;
      while (attempts < 10 && mapContainer.querySelectorAll(".leaflet-tile-loaded").length === 0) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        attempts++;
      }
    }
  }

  // Wait for SVG charts
  const svgElements = clonedElement.querySelectorAll("svg");
  if (svgElements.length > 0) {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  try {
    console.log("Capturing cloned element with html2canvas...");
    
    if (clonedElement.scrollWidth === 0 || clonedElement.scrollHeight === 0) {
      console.warn("Cloned element has zero dimensions, waiting...");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      if (clonedElement.scrollWidth === 0 || clonedElement.scrollHeight === 0) {
        throw new Error("Element has no content to export");
      }
    }

    const allSvgs = clonedElement.querySelectorAll("svg");
    let maxSvgWidth = 0;
    allSvgs.forEach((svg: Element) => {
      const htmlSvg = svg as SVGElement;
      const svgWidth = htmlSvg.getBoundingClientRect().width ||
                      parseFloat(htmlSvg.getAttribute("width") || "0") ||
                      htmlSvg.scrollWidth ||
                      htmlSvg.offsetWidth || 0;
      maxSvgWidth = Math.max(maxSvgWidth, svgWidth);
    });

    const contentWidth = Math.max(
      clonedElement.scrollWidth,
      clonedElement.offsetWidth,
      maxSvgWidth + 40,
      800
    );

    const contentHeight = Math.max(
      clonedElement.scrollHeight,
      clonedElement.offsetHeight
    );

    console.log("Content dimensions:", { contentWidth, contentHeight });

    // Capture with html2canvas
    const canvas = await html2canvas(clonedElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      width: contentWidth || 800,
      height: contentHeight || 600,
      windowWidth: contentWidth || 800,
      windowHeight: contentHeight || 600,
      allowTaint: true,
      foreignObjectRendering: false,
      removeContainer: false,
    });

    console.log("Canvas created:", { width: canvas.width, height: canvas.height });

    // Create PDF
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const pdf = new jsPDF("p", "mm", "a4");
    const pageHeight = 297;
    let heightLeft = imgHeight;
    let position = 0;

    // Add pages
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`report-${new Date().toISOString().split("T")[0]}.pdf`);
    console.log("PDF exported successfully!");
  } catch (error) {
    console.error("Error generating PDF:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    alert(`حدث خطأ أثناء تصدير PDF: ${errorMessage}. يرجى المحاولة مرة أخرى.`);
    throw error;
  } finally {
    // Clean up
    if (captureContainer && captureContainer.parentNode) {
      captureContainer.parentNode.removeChild(captureContainer);
    }
    body.style.overflow = originalBodyOverflow;
    const afterPrintEvent = new Event("afterprint");
    window.dispatchEvent(afterPrintEvent);
    element.dispatchEvent(afterPrintEvent);
  }
}