import { PDFDocument, rgb, StandardFonts } from 'https://cdn.skypack.dev/pdf-lib';

let loadedPdfDoc = null;
let originalBytes = null;
let currentPageIndex = 0;

document.getElementById('editPdfBtn').addEventListener('click', async () => {
  const file = document.getElementById('pdfInput').files[0];
  if (!file) return alert('Please select a PDF first.');

  originalBytes = await file.arrayBuffer();
  loadedPdfDoc = await PDFDocument.load(originalBytes);

  currentPageIndex = 0;
  alert(`Loaded PDF with ${loadedPdfDoc.getPageCount()} pages.`);
});

document.getElementById('addTextBtn').addEventListener('click', async () => {
  if (!loadedPdfDoc) return alert('Load a PDF first.');

  const text = prompt('Enter text to add:');
  if (!text) return;

  const pages = loadedPdfDoc.getPages();
  const page = pages[currentPageIndex];
  const { width, height } = page.getSize();

  const font = await loadedPdfDoc.embedFont(StandardFonts.Helvetica);
  page.drawText(text, {
    x: 50,
    y: height - 100,
    size: 20,
    font: font,
    color: rgb(0.1, 0.6, 0.9),
  });

  alert(`Text added to page ${currentPageIndex + 1}.`);
});

document.getElementById('savePdfBtn').addEventListener('click', async () => {
  if (!loadedPdfDoc) return alert('Nothing to save.');

  const pdfBytes = await loadedPdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'edited.pdf';
  link.click();

  URL.revokeObjectURL(url);
});
import * as pdfjsLib from "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.mjs";

// Setup PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

async function renderPage(pdfData, pageNumber) {
  const loadingTask = pdfjsLib.getDocument({ data: pdfData });
  const pdf = await loadingTask.promise;
  const page = await pdf.getPage(pageNumber);

  const viewport = page.getViewport({ scale: 1.5 });
  const canvas = document.getElementById("pdfCanvas");
  const context = canvas.getContext("2d");

  canvas.height = viewport.height;
  canvas.width = viewport.width;

  const renderContext = {
    canvasContext: context,
    viewport: viewport,
  };

  await page.render(renderContext).promise;
}
