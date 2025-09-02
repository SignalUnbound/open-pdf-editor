let pdfDoc = null;
let originalPdfBytes = null;

document.getElementById('pdfInput').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const arrayBuffer = await file.arrayBuffer();
  originalPdfBytes = arrayBuffer;
  pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);

  const pdfArea = document.getElementById('pdfArea');
  pdfArea.innerHTML = '';

  const textBox = document.createElement('input');
  textBox.className = 'editable';
  textBox.placeholder = 'Type here...';
  textBox.style.top = '100px';
  textBox.style.left = '100px';
  textBox.style.position = 'absolute';

  pdfArea.style.position = 'relative';
  pdfArea.appendChild(textBox);
});

document.getElementById('saveBtn').addEventListener('click', async () => {
  if (!pdfDoc) return alert('Load a PDF first.');

  const textBox = document.querySelector('.editable');
  const page = pdfDoc.getPages()[0];
  const { width, height } = page.getSize();

  page.drawText(textBox.value, {
    x: 100,
    y: height - 100,
    size: 14,
    color: PDFLib.rgb(0, 1, 1)
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'edited.pdf';
  link.click();
});
