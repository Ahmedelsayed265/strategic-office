import html2canvas from "html2canvas";
// For jsPDF v2.x, use default import
import jsPDF from "jspdf";

/**
 * Exports the printable content to PDF
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

  // Show the printable content temporarily
  const originalDisplay = element.style.display;
  const originalVisibility = element.style.visibility;
  const originalPosition = element.style.position;
  const originalLeft = element.style.left;
  const originalTop = element.style.top;
  const originalWidth = element.style.width;
  const originalHeight = element.style.height;
  const originalZIndex = element.style.zIndex;
  
  // Store original parent and position for restoration
  const parent = element.parentElement;
  const nextSibling = element.nextSibling;
  
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
  const targetWidth = 794; // A4 width in pixels at 96 DPI
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
  
  // Ensure all child containers also have proper overflow and width
  const childContainers = clonedElement.querySelectorAll("div, svg");
  childContainers.forEach((container: Element) => {
    const htmlContainer = container as HTMLElement;
    if (htmlContainer.style) {
      // Don't override if it's a chart container with specific overflow
      if (!htmlContainer.classList.contains("recharts-wrapper")) {
        htmlContainer.style.overflow = "visible";
        // Ensure chart containers have full width
        if (htmlContainer.querySelector(".recharts-wrapper") || htmlContainer.querySelector("svg")) {
          htmlContainer.style.width = "100%";
          htmlContainer.style.maxWidth = "100%";
        }
      }
    }
  });
  
  // Fix recharts SVG overflow and width
  const rechartsWrappers = clonedElement.querySelectorAll(".recharts-wrapper");
  rechartsWrappers.forEach((wrapper: Element) => {
    const htmlWrapper = wrapper as HTMLElement;
    htmlWrapper.style.overflow = "visible";
    htmlWrapper.style.width = "100%";
    htmlWrapper.style.maxWidth = "100%";
  });
  
  // Fix SVG elements to ensure they're not clipped
  const svgElements = clonedElement.querySelectorAll("svg");
  svgElements.forEach((svg: Element) => {
    const htmlSvg = svg as SVGElement;
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
  });
  
  captureContainer.appendChild(clonedElement);

  // Wait for React to render the content in the clone
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  // Force a reflow to ensure content is rendered
  void clonedElement.offsetHeight;
  
  // Wait for charts and map to render
  await new Promise((resolve) => setTimeout(resolve, 2000));
  
  // Check if content exists
  const innerContent = clonedElement.querySelector("div > *");
  if (!innerContent) {
    console.warn("No inner content found, waiting more...");
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // Wait for map tiles to load if map is present
  const mapContainer = clonedElement.querySelector(".leaflet-container") as HTMLElement;
  if (mapContainer) {
    // Wait for map to initialize
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Try to access Leaflet map instance
    const leafletMap = (mapContainer as any)._leaflet_id;
    if (leafletMap && (window as any).L) {
      const L = (window as any).L;
      // Get all map instances
      const maps = L.Map ? Object.values(L.Map._instances || {}) : [];
      const map = maps.find((m: any) => m._container === mapContainer);
      
      if (map) {
        // Invalidate size to ensure map renders correctly
        map.invalidateSize();
        // Wait for tiles to load
        await new Promise((resolve) => setTimeout(resolve, 2000));
        
        // Check if tiles are loaded
        const tiles = mapContainer.querySelectorAll(".leaflet-tile-loaded");
        if (tiles.length === 0) {
          // Wait a bit more if no tiles loaded yet
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }
    } else {
      // Fallback: wait for tiles to appear
      let attempts = 0;
      while (attempts < 10 && mapContainer.querySelectorAll(".leaflet-tile-loaded").length === 0) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        attempts++;
      }
    }
  }
  
  // Wait for any SVG charts to render
  const svgElements = element.querySelectorAll("svg");
  if (svgElements.length > 0) {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  try {
    console.log("Capturing cloned element with html2canvas...");
    console.log("Cloned element dimensions:", {
      width: clonedElement.scrollWidth,
      height: clonedElement.scrollHeight,
      offsetWidth: clonedElement.offsetWidth,
      offsetHeight: clonedElement.offsetHeight,
    });
    
    // Ensure cloned element has dimensions and content
    if (clonedElement.scrollWidth === 0 || clonedElement.scrollHeight === 0) {
      console.warn("Cloned element has zero dimensions, waiting a bit more...");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Check again
      if (clonedElement.scrollWidth === 0 || clonedElement.scrollHeight === 0) {
        console.error("Cloned element still has zero dimensions after waiting");
        throw new Error("Element has no content to export");
      }
    }
    
    // Verify content exists
    const hasContent = clonedElement.querySelector("svg, canvas, img, table, .leaflet-container") || 
                       clonedElement.textContent?.trim().length > 0;
    if (!hasContent) {
      console.warn("No visible content found in cloned element, but proceeding anyway...");
    }
    
    // Get the actual content width including any overflow
    // Check all SVG elements and their containers
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
      maxSvgWidth + 40, // Add padding for margins
      800 // Minimum width
    );
    
    const contentHeight = Math.max(
      clonedElement.scrollHeight,
      clonedElement.offsetHeight
    );
    
    console.log("Content dimensions:", { 
      contentWidth, 
      contentHeight, 
      scrollWidth: clonedElement.scrollWidth,
      offsetWidth: clonedElement.offsetWidth,
      maxSvgWidth 
    });
    
    // Capture the cloned element (not the original to avoid visual glitch)
    const canvas = await html2canvas(clonedElement, {
      scale: 2,
      useCORS: true,
      logging: false, // Disable logging for production
      backgroundColor: "#ffffff",
      width: contentWidth || 800,
      height: contentHeight || 600,
      windowWidth: contentWidth || 800,
      windowHeight: contentHeight || 600,
      allowTaint: true, // Allow tainted canvas for better compatibility
      foreignObjectRendering: false, // Disable for better compatibility
      removeContainer: false,
      onclone: (clonedDoc, clonedElement) => {
        console.log("Cloning document for capture...");
        // Ensure all images in the cloned document are loaded
        const images = clonedDoc.querySelectorAll("img");
        images.forEach((img) => {
          if (!img.complete) {
            img.style.display = "none";
          }
        });
        // Remove hidden class from cloned element and make it visible
        const clonedPrintableContent = clonedDoc.getElementById("printable-content");
        if (clonedPrintableContent) {
          clonedPrintableContent.classList.remove("hidden", "d-none");
          clonedPrintableContent.style.display = "block";
          clonedPrintableContent.style.visibility = "visible";
          clonedPrintableContent.style.opacity = "1";
          clonedPrintableContent.style.position = "relative";
          clonedPrintableContent.style.zIndex = "1";
        }
        // Make sure all child elements are visible
        const allElements = clonedPrintableContent?.querySelectorAll("*");
        allElements?.forEach((el: Element) => {
          const htmlEl = el as HTMLElement;
          if (htmlEl.style) {
            if (htmlEl.style.display === "none") {
              htmlEl.style.display = "";
            }
            if (htmlEl.style.visibility === "hidden") {
              htmlEl.style.visibility = "visible";
            }
          }
        });
      },
    });
    
    console.log("Canvas created:", {
      width: canvas.width,
      height: canvas.height,
    });

    // Calculate PDF dimensions - scale to fit A4 width
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const pdf = new jsPDF("p", "mm", "a4");
    
    // If content is taller than one page, split into multiple pages
    const pageHeight = 297; // A4 height in mm
    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save the PDF
    console.log("Saving PDF...");
    pdf.save(`report-${new Date().toISOString().split("T")[0]}.pdf`);
    console.log("PDF exported successfully!");
  } catch (error) {
    console.error("Error generating PDF:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    alert(`حدث خطأ أثناء تصدير PDF: ${errorMessage}. يرجى المحاولة مرة أخرى.`);
    throw error; // Re-throw to be caught by the button handler
  } finally {
    // Clean up the cloned element and container (no visual glitch since it was hidden)
    if (captureContainer && captureContainer.parentNode) {
      captureContainer.parentNode.removeChild(captureContainer);
    }
    
    // Restore body overflow
    body.style.overflow = originalBodyOverflow;

    // Trigger afterprint event
    const afterPrintEvent = new Event("afterprint");
    window.dispatchEvent(afterPrintEvent);
    element.dispatchEvent(afterPrintEvent);
  }
}

