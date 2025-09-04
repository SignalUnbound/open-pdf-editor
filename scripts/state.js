// scripts/state.js

export const state = {
  pdfDoc: null,         // pdf-lib version for editing
  pdfBytes: null,       // raw bytes
  renderedPages: [],    // pdf.js version for display
  currentPage: 1,
  totalPages: 0,
  renderScale: 1.5,     // shared across modules
  placedTexts: []       // for text positioning
};
