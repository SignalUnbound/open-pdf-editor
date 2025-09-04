import './core/loadPDF.js';
import { renderPage } from './core/renderPDF.js';
import { state } from './state.js';

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
