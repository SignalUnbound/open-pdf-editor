// scripts/core/loadPDF.js

import { state } from '../state.js';
import { renderPage } from './renderPDF.js';

// Load and parse the PDF file
document.getElementById('file-input').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Load the file into memory
  state.pdfBytes = await file.arrayBuffer();

  // Load pdf-lib version for editing
  state.pdfDoc = await PDFLib.PDFDocument.load(state.pdfBytes);

  // Load pdf.js version for rendering
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
