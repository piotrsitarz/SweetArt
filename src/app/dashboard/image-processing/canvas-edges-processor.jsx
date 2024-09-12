"use client";

import { useRef, useState, useCallback } from "react";
// import jsPDF from "jspdf";

const sobelX = [
  [-1, 0, 1],
  [-2, 0, 2],
  [-1, 0, 1],
];

const sobelY = [
  [1, 2, 1],
  [0, 0, 0],
  [-1, -2, -1],
];

const applyKernel = (imageData, kernel, threshold) => {
  const { data, width, height } = imageData;
  const output = new Uint8ClampedArray(data.length);

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let rX = 0,
        gX = 0,
        bX = 0;
      let rY = 0,
        gY = 0,
        bY = 0;

      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const pixel = ((y + ky) * width + (x + kx)) * 4;
          const weight = kernel[ky + 1][kx + 1];

          rX += data[pixel] * weight;
          gX += data[pixel + 1] * weight;
          bX += data[pixel + 2] * weight;

          rY += data[pixel] * weight;
          gY += data[pixel + 1] * weight;
          bY += data[pixel + 2] * weight;
        }
      }

      const magnitude = Math.sqrt(
        rX * rX + gX * gX + bX * bX + rY * rY + gY * gY + bY * bY
      );
      const index = (y * width + x) * 4;

      // Adjust the color values: Black (0) for edges, White (255) for background
      const value = magnitude > threshold ? 0 : 255;
      output[index] = output[index + 1] = output[index + 2] = value; // Color for edges
      output[index + 3] = 255; // Alpha
    }
  }

  return new ImageData(output, width, height);
};

export default function CanvasImageProcessor() {
  const [threshold, setThreshold] = useState(128);
  const canvasRef = useRef(null);
  const originalCanvasRef = useRef(null);
  const imageRef = useRef(null);

  // Use useCallback to ensure that applyEdgeDetection doesn't recreate on every render
  const applyEdgeDetection = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const imageData = imageRef.current;

    // Apply Sobel X and Y filters
    const sobelXData = applyKernel(imageData, sobelX, threshold);
    const sobelYData = applyKernel(imageData, sobelY, threshold);

    // Combine results
    const output = new Uint8ClampedArray(imageData.data.length);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const mag = Math.sqrt(
        Math.pow(sobelXData.data[i] - sobelYData.data[i], 2) +
          Math.pow(sobelXData.data[i + 1] - sobelYData.data[i + 1], 2) +
          Math.pow(sobelXData.data[i + 2] - sobelYData.data[i + 2], 2)
      );

      const value = mag > threshold ? 0 : 255; // Black for edges, White for background
      output[i] = output[i + 1] = output[i + 2] = value;
      output[i + 3] = 255; // Alpha
    }

    ctx.putImageData(new ImageData(output, canvas.width, canvas.height), 0, 0);
  }, [threshold]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        const canvas = canvasRef.current;
        const originalCanvas = originalCanvasRef.current;
        const ctx = canvas.getContext("2d");
        const originalCtx = originalCanvas.getContext("2d");

        canvas.width = originalCanvas.width = img.width;
        canvas.height = originalCanvas.height = img.height;

        originalCtx.drawImage(img, 0, 0);
        ctx.drawImage(img, 0, 0);
        imageRef.current = ctx.getImageData(0, 0, img.width, img.height);
        applyEdgeDetection();
      };
      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "outline.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const downloadAsPDF = () => {
    const canvas = canvasRef.current;
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("outline.pdf");
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <br />
      <input
        type="range"
        min="0"
        max="255"
        value={threshold}
        onChange={(e) => {
          setThreshold(e.target.value);
          applyEdgeDetection();
        }}
      />
      <label>Threshold: {threshold}</label>
      <br />
      <div style={{ display: "flex", gap: "20px" }}>
        <canvas ref={originalCanvasRef}></canvas>
        <canvas ref={canvasRef}></canvas>
      </div>
      <br />
      <button onClick={downloadImage}>Download PNG</button>
      <button onClick={downloadAsPDF}>Download PDF</button>
    </div>
  );
}
