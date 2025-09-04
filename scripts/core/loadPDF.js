import { state } from '../state.js';
import { renderPage } from './renderPDF.js';

document.getElementById('file-input').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  state.pdfBytes = await file.arrayBuffer();

  // Load with PDF-Lib (editing)
  state.pdfDoc = await window.PDFLib.PDFDocument.load(state.pdfBytes);

  // Load with PDF.js (rendering)
  const loadingTask = pdfjsLib.getDocument({ data: state.pdfBytes });
  const pdf = await loadingTask.promise;

  state.totalPages = pdf.numPages;
  state.renderedPages = [];

  for (let i = 1; i <= state.totalPages; i++) {
    const page = await pdf.getPage(i);
    state.renderedPages.push(page);
  }

  state.currentPage = 1;
  renderPage(state.currentPage);
});
