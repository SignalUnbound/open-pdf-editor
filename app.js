let pdfDoc = null;
let currentPage = 1;
let totalPages = 0;
let pdfViewer = document.getElementById("pdfViewer");

console.log("PDF Editor booting...");

document.addEventListener("DOMContentLoaded", () => {
  console.log("Ready to add PDF features.");

  document.getElementById("loadPdfBtn").addEventListener("click", () => {
    const fileInput = document.getElementById("pdfInput");
    const file = fileInput.files[0];

    if (file && file.type === "application/pdf") {
      const fileReader = new FileReader();
      fileReader.onload = function () {
        const typedarray = new Uint8Array(this.result);
        loadPDF(typedarray);
      };
      fileReader.readAsArrayBuffer(file);
    }
  });

  document.getElementById("prevPage").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderPage(currentPage);
    }
  });

  document.getElementById("nextPage").addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderPage(currentPage);
    }
  });
});

function loadPDF(data) {
  pdfjsLib.getDocument({ data: data }).promise.then((pdf) => {
    pdfDoc = pdf;
    totalPages = pdf.numPages;
    console.log(`PDF loaded with ${totalPages} pages.`); // ✅ add this

    document.getElementById("totalPages").textContent = totalPages;
    currentPage = 1;
    renderPage(currentPage);
  }).catch(err => {
    console.error("Error loading PDF:", err); // ✅ helpful logging
  });
}

function renderPage(num) {
  console.log(`Rendering page ${num}`); // ✅ new log line
  pdfDoc.getPage(num).then((page) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    const viewport = page.getViewport({ scale: 1.5 });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    page.render(renderContext).promise.then(() => {
      console.log(`Page ${num} rendered.`); // ✅ new log
      pdfViewer.innerHTML = ""; // Clear previous
      pdfViewer.appendChild(canvas);
      document.getElementById("currentPage").textContent = num;
    });
  });
}
