document.getElementById("editPdfBtn").addEventListener("click", async () => {
  const input = document.getElementById("pdfInput");
  const status = document.getElementById("status");
  const file = input.files[0];

  if (!file || file.type !== "application/pdf") {
    status.textContent = "Please select a valid PDF file.";
    return;
  }

  status.textContent = "Loading PDF...";

  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);

  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  // Add embedded text
  const { width, height } = firstPage.getSize();
  firstPage.drawText("Edited with Signal:Unbound", {
    x: 50,
    y: height - 50,
    size: 18,
    color: PDFLib.rgb(0, 0.8, 1),
  });

  const editedPdfBytes = await pdfDoc.save();

  // Create downloadable link
  const blob = new Blob([editedPdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "edited.pdf";
  a.click();

  URL.revokeObjectURL(url);
  status.textContent = "PDF downloaded with new text.";
});
