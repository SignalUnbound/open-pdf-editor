let pdfDoc = null;
let currentPageIndex = 0;
let originalPdfBytes = null;

const canvas = document.getElementById("pdfCanvas");
const ctx = canvas.getContext("2d");

// Load PDF and render first page
document.getElementById("pdfInput").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  originalPdfBytes = await file.arrayBuffer();
  pdfDoc = await PDFLib.PDFDocument.load(originalPdfBytes);

  await renderVisiblePage(originalPdfBytes, currentPageIndex);
});

// Render visible page to canvas (using PDF.js)
async function renderVisiblePage(bytes, pageIndex) {
  const loadingTask = pdfjsLib.getDocument({ data: bytes });
  const pdf = await loadingTask.promise;
  const page = await pdf.getPage(pageIndex + 1); // PDF.js uses 1-based index

  const viewport = page.getViewport({ scale: 1.5 });
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({
    canvasContext: ctx,
    viewport: viewport,
  }).promise;

  console.log("Rendered visible PDF page");
}

// Add text and refresh preview
document.getElementById("addTextBtn").addEventListener("click", async () => {
  if (!pdfDoc) return alert("Load a PDF first.");

  const text = prompt("Enter text:");
  if (!text) return;

  const page = pdfDoc.getPage(currentPageIndex);
  page.drawText(text, {
    x: 50,
    y: 500,
    size: 24,
    color: PDFLib.rgb(0, 1, 1),
  });

  const modifiedPdfBytes = await pdfDoc.save();
  await renderVisiblePage(modifiedPdfBytes, currentPageIndex);
});

// Save the modified PDF
document.getElementById("saveBtn").addEventListener("click", async () => {
  if (!pdfDoc) return alert("Nothing to save.");

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "edited.pdf";
  link.click();
});
