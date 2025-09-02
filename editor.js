let pdfDoc = null;
let pdfBytes = null;
let canvas = document.getElementById("pdfCanvas");
let ctx = canvas.getContext("2d");
let currentPdfDoc = null;

document.getElementById("loadPdfBtn").addEventListener("click", async () => {
  const input = document.getElementById("pdfInput");
  const file = input.files[0];
  if (!file) return alert("No file selected");

  const arrayBuffer = await file.arrayBuffer();
  pdfBytes = arrayBuffer;
  pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
  renderFirstPage(pdfDoc);
});

async function renderFirstPage(pdfDoc) {
  const page = pdfDoc.getPages()[0];
  const { width, height } = page.getSize();

  canvas.width = width;
  canvas.height = height;

  // Draw white background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  // Render placeholder message on canvas
  ctx.fillStyle = "#999999";
  ctx.font = "20px sans-serif";
  ctx.fillText("PDF loaded. Changes will apply to saved file.", 40, 40);
}

document.getElementById("insertTextBtn").addEventListener("click", async () => {
  if (!pdfDoc) return alert("No PDF loaded.");
  
  const inputText = document.getElementById("textInput").value;
  if (!inputText) return alert("Please enter some text.");

  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  const { width, height } = firstPage.getSize();

  firstPage.drawText(inputText, {
    x: 50,
    y: height - 100,
    size: 18,
    color: PDFLib.rgb(0.2, 0.6, 1),
    font: await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica),
  });

  renderFirstPage(pdfDoc);
  alert("Text added to PDF! Click 'Download' to save.");
});

document.getElementById("downloadBtn").addEventListener("click", async () => {
  if (!pdfDoc) return alert("No PDF loaded.");

  const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
  
  const a = document.createElement("a");
  a.href = pdfDataUri;
  a.download = "edited.pdf";
  a.click();
});
