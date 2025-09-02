let pdfDoc = null;
let currentPage = null;
let canvas = document.getElementById("pdfCanvas");
let ctx = canvas.getContext("2d");
let fileBytes = null;

document.getElementById("pdfInput").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (file) {
    fileBytes = await file.arrayBuffer();
    pdfDoc = await PDFLib.PDFDocument.load(fileBytes);
    renderPage(0); // load first page
  }
});

async function renderPage(pageIndex) {
  const page = pdfDoc.getPage(pageIndex);
  currentPage = page;

  const viewport = {
    width: page.getWidth(),
    height: page.getHeight()
  };

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  // Clear canvas and render blank background
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#000";
  ctx.fillText("Page loaded. Click 'Add Text' to write.", 20, 40);
}

document.getElementById("addTextBtn").addEventListener("click", async () => {
  if (!currentPage) return alert("Load a PDF first!");

  const text = prompt("Enter text:");
  if (!text) return;

  currentPage.drawText(text, {
    x: 50,
    y: 500,
    size: 24,
    color: PDFLib.rgb(0, 1, 1),
  });

  renderPage(0); // refresh preview
});

document.getElementById("saveBtn").addEventListener("click", async () => {
  if (!pdfDoc) return alert("No PDF loaded.");

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "edited.pdf";
  link.click();
});
