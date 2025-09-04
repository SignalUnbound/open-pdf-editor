// scripts/core/loadPDF.js

import { state } from '../state.js';
import { renderPage } from './renderPDF.js';

// Load and parse the PDF file when selected
document.getElementById('file-input').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Load PDF bytes into memory
  state.pdfBytes = await file.arrayBuffer();

  // Load the PDF with pdf-lib for editing
  state.pdfDoc = await PDFLib.PDFDocument.load(state.pdfBytes);

  // Load the PDF with pdf.js for rendering
  const loadingTask = pdfjsLib.getDocument({ data: state.pdfBytes });
  const pdf = await loadingTask.promise;

  // Store pages for rendering
  state.totalPages = pdf.numPages;
  state.renderedPages = [];

  for (let i = 1; i <= state.totalPages; i++) {
    const page = await pdf.getPage(i);
    state.renderedPages.push(page);
  }

  // Start with the first page
  state.currentPage = 1;
  renderPage(state.currentPage);
  console.log('Total rendered pages:', state.renderedPages.length);
});
