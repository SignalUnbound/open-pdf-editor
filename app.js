console.log("PDF Editor booting...");

document.addEventListener("DOMContentLoaded", () => {
  console.log("Ready to add PDF features.");

  const input = document.getElementById("pdfInput");
  const button = document.getElementById("loadPdfBtn");
  const viewer = document.getElementById("pdfViewer");

  button.addEventListener("click", () => {
    const file = input.files[0];
    if (!file) {
      alert("Please select a PDF file.");
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = function () {
      const typedarray = new Uint8Array(this.result);

      pdfjsLib.getDocument(typedarray).promise.then(pdf => {
        viewer.innerHTML = ""; // Clear previous renders

        pdf.getPage(1).then(page => {
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          const viewport = page.getViewport({ scale: 1.5 });

          canvas.height = viewport.height;
          canvas.width = viewport.width;

          page.render({
            canvasContext: context,
            viewport: viewport
          });

          viewer.appendChild(canvas);
        });
      });
    };

    fileReader.readAsArrayBuffer(file);
  });
});
