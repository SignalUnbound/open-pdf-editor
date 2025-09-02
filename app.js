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

document.getElementById("jumpPageBtn").addEventListener("click", () => {
  const input = document.getElementById("pageJumpInput");
  const pageNum = parseInt(input.value);

  if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
    currentPage = pageNum;
    renderPage(currentPage);
  } else {
    alert("Invalid page number.");
  }
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
      console.log(`Page ${num} rendered.`);
      pdfViewer.innerHTML = "";
      pdfViewer.appendChild(canvas);
      document.getElementById("currentPage").textContent = num;

      // ✅ These two are essential:
    // resizeAnnotationCanvas(canvas.width, canvas.height);
     loadAnnotations();
    });
  });
}

    page.render(renderContext).promise.then(() => {
      console.log(`Page ${num} rendered.`); // ✅ new log
      pdfViewer.innerHTML = ""; // Clear previous

// Wrap PDF canvas and annotation layer together
const wrapper = document.createElement("div");
wrapper.style.position = "relative";
wrapper.style.display = "inline-block";

// Style annotationCanvas
annotationCanvas.width = canvas.width;
annotationCanvas.height = canvas.height;
annotationCanvas.style.position = "absolute";
annotationCanvas.style.left = 0;
annotationCanvas.style.top = 0;
annotationCanvas.style.pointerEvents = "auto"; // let tools work

// Append both
wrapper.appendChild(canvas);
wrapper.appendChild(annotationCanvas);
pdfViewer.appendChild(wrapper);

// Update page number display
document.getElementById("currentPage").textContent = num;
      document.getElementById("currentPage").textContent = num;
    });
  });
}

const annotationCanvas = document.getElementById("annotationLayer");
const annotationCtx = annotationCanvas.getContext("2d");
let drawing = false;
let currentTool = null;

// Resize canvas to match viewer
function resizeAnnotationCanvas(width, height) {
  annotationCanvas.width = width;
  annotationCanvas.height = height;
}

// Drawing events
annotationCanvas.addEventListener("mousedown", (e) => {
  if (currentTool === "draw") {
    drawing = true;
    annotationCtx.beginPath();
    annotationCtx.moveTo(e.offsetX, e.offsetY);
  }
});

annotationCanvas.addEventListener("mousemove", (e) => {
  if (drawing && currentTool === "draw") {
    annotationCtx.lineTo(e.offsetX, e.offsetY);
    annotationCtx.strokeStyle = "#ffcc00";
    annotationCtx.lineWidth = 2;
    annotationCtx.stroke();
  }
});

annotationCanvas.addEventListener("mouseup", () => {
  if (currentTool === "draw") {
    drawing = false;
  }
});

// Text tool
annotationCanvas.addEventListener("click", (e) => {
  if (currentTool === "text") {
    const text = prompt("Enter text:");
    if (text) {
      annotationCtx.font = "16px Orbitron";
      annotationCtx.fillStyle = "#00ccff";
      annotationCtx.fillText(text, e.offsetX, e.offsetY);
    }
  }
});

// Tool button logic
document.getElementById("drawBtn").addEventListener("click", () => {
  currentTool = "draw";
});

document.getElementById("textBtn").addEventListener("click", () => {
  currentTool = "text";
});

document.getElementById("saveBtn").addEventListener("click", () => {
  alert("Save button clicked"); // test this first!
  saveAnnotations();
});
function saveAnnotations() {
  const dataURL = annotationCanvas.toDataURL("image/png");
  localStorage.setItem(`pdf-annotations-page-${currentPage}`, dataURL);
  alert("Annotations saved.");
}

function loadAnnotations() {
  const dataURL = localStorage.getItem(`pdf-annotations-page-${currentPage}`);
  if (dataURL) {
    const img = new Image();
    img.onload = () => {
      annotationCtx.clearRect(0, 0, annotationCanvas.width, annotationCanvas.height);
      annotationCtx.drawImage(img, 0, 0);
    };
    img.src = dataURL;
  }
}
