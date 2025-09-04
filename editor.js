import { PDFDocument, rgb } from 'https://cdn.skypack.dev/pdf-lib';

let pdfDoc = null;
let pdfBytes = null;
let currentPage = 1;
let totalPages = 0;
let renderedPages = [];
const placedTexts = [];

const canvas = document.getElementById('pdf-canvas');
const ctx = canvas.getContext('2d');
const fileInput = document.getElementById('file-input');
const pageInfo = document.getElementById('page-info');
const xSlider = document.getElementById('text-x');
const ySlider = document.getElementById('text-y');
const xInput = document.getElementById('text-x-val');
const yInput = document.getElementById('text-y-val');
const textControls = document.getElementById('text-controls');
const overlayContainer = document.getElementById('overlay-container');

let overlay = null;
const renderScale = 1.5;

function updatePosition() {
  if (!overlay) return;
  const x = parseInt(xSlider.value);
  const y = parseInt(ySlider.value);
  const scaledX = x * renderScale;
  const scaledY = canvas.height - y * renderScale;
  overlay.style.left = `${scaledX}px`;
  overlay.style.top = `${scaledY}px`;
  xInput.value = x;
  yInput.value = y;
}

function syncSliders() {
  xSlider.value = xInput.value;
  ySlider.value = yInput.value;
  updatePosition();
}

xSlider.addEventListener('input', updatePosition);
ySlider.addEventListener('input', updatePosition);
xInput.addEventListener('input', syncSliders);
yInput.addEventListener('input', syncSliders);

const renderPage = async (num) => {
  const page = await renderedPages[num - 1];
  const viewport = page.getViewport({ scale: renderScale });
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({ canvasContext: ctx, viewport }).promise;
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
};

document.getElementById('prev-page').onclick = () => {
  if (currentPage > 1) {
    currentPage--;
    renderPage(currentPage);
  }
};

document.getElementById('next-page').onclick = () => {
  if (currentPage < totalPages) {
    currentPage++;
    renderPage(currentPage);
  }
};

fileInput.onchange = async () => {
  const file = fileInput.files[0];
  if (!file) return;
  pdfBytes = await file.arrayBuffer();
  pdfDoc = await PDFDocument.load(pdfBytes);

  const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
  const pdf = await loadingTask.promise;

  totalPages = pdf.numPages;
  renderedPages = [];
  for (let i = 1; i <= totalPages; i++) {
    renderedPages.push(await pdf.getPage(i));
  }

  currentPage = 1;
  renderPage(currentPage);
};

document.getElementById('add-text').onclick = () => {
  const input = prompt('Enter your text:');
  if (!input) return;

  overlay = document.createElement('div');
  overlay.className = 'text-overlay';
  overlay.textContent = input;
  overlay.style.color = document.getElementById('text-color').value;
  overlayContainer.innerHTML = '';
  overlayContainer.appendChild(overlay);

  textControls.style.display = 'block';
  updatePosition();
};

document.getElementById('confirm-text').onclick = () => {
  if (!overlay) return;

  const x = parseInt(xSlider.value);
  const y = parseInt(ySlider.value);
  const text = overlay.textContent;
  const color = window.getComputedStyle(overlay).color;

  placedTexts.push({ page: currentPage, x, y, text, color });

  const confirmedOverlay = overlay.cloneNode(true);
  document.getElementById('canvas-container').appendChild(confirmedOverlay);

  overlay = null;
  overlayContainer.innerHTML = '';
  textControls.style.display = 'none';
};

document.getElementById('save-pdf').onclick = async () => {
  if (!pdfDoc) return;

  for (const item of placedTexts) {
    const page = pdfDoc.getPages()[item.page - 1];
    const { width: pdfWidth, height: pdfHeight } = page.getSize();
    const [r, g, b] = item.color.match(/\d+/g).map(n => parseInt(n) / 255);

    const x = (item.x / canvas.width) * pdfWidth;
    const y = pdfHeight - (item.y / canvas.height) * pdfHeight;

    page.drawText(item.text, {
      x,
      y,
      size: 18,
      color: rgb(r, g, b)
    });
  }

  const modifiedBytes = await pdfDoc.save();
  const blob = new Blob([modifiedBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'edited.pdf';
  link.click();
};
