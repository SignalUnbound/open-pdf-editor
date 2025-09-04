// scripts/main.js

console.log("🚀 Signal:Unbound PDF Editor initialized");

// You’ll import each module here as we build:
import './core/loadPDF.js';
import './core/renderPDF.js';
import './core/savePDF.js';

import './features/addText.js';
import './features/addImage.js';
import './features/addPage.js';
import './features/deletePage.js';

// scripts/main.js

console.log("🚀 Signal:Unbound PDF Editor initialized");

// Import modules
import './core/loadPDF.js';
import './core/renderPDF.js';
import './core/savePDF.js';

import './features/addText.js';
import './features/addImage.js';
import './features/addPage.js';
import './features/deletePage.js';

// Wire up navigation buttons
import { state } from './state.js';
import { renderPage } from './core/renderPDF.js';

document.getElementById('prev-page').addEventListener('click', () => {
  if (state.currentPage > 1) {
    state.currentPage--;
    renderPage(state.currentPage);
  }
});

document.getElementById('next-page').addEventListener('click', () => {
  if (state.currentPage < state.totalPages) {
    state.currentPage++;
    renderPage(state.currentPage);
  }
});
