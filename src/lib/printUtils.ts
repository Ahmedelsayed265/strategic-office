/**
 * Opens the print dialog for the printable content
 */
export function openPrintDialog(): void {
  const element = document.getElementById("printable-content");
  
  if (!element) {
    console.error("Element with id 'printable-content' not found");
    alert("لا يمكن العثور على المحتوى للطباعة");
    return;
  }

  // Show the printable content
  const originalDisplay = element.style.display;
  const originalVisibility = element.style.visibility;
  const originalClassName = element.className;
  
  // Remove hidden class and make visible
  element.classList.remove("hidden", "d-none");
  element.style.display = "block";
  element.style.visibility = "visible";
  element.style.position = "relative";
  element.style.zIndex = "9999";
  
  // Trigger beforeprint event
  window.dispatchEvent(new Event("beforeprint"));
  element.dispatchEvent(new Event("beforeprint"));
  
  // Wait a bit for content to render
  setTimeout(() => {
    // Open print dialog
    window.print();
    
    // After print dialog closes, restore original state
    const restoreState = () => {
      element.style.display = originalDisplay;
      element.style.visibility = originalVisibility;
      element.className = originalClassName;
      element.style.position = "";
      element.style.zIndex = "";
      
      // Trigger afterprint event
      window.dispatchEvent(new Event("afterprint"));
      element.dispatchEvent(new Event("afterprint"));
      
      window.removeEventListener("afterprint", restoreState);
    };
    
    window.addEventListener("afterprint", restoreState);
  }, 500);
}

