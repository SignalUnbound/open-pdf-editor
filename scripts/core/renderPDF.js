// scripts/core/renderPDF.js

import { state } from '../state.js';

export async function renderPage(pageNum) {
  const page = state.renderedPages[pageNum - 1];
  const viewport = page.getViewport({ scale: state.renderScale });

  const canvas = document.getElementById('pdf-canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({ canvasContext: ctx, viewport }).promise;

  document.getElementById('page-info').textContent = `Page ${pageNum} of ${state.totalPages}`;
}
