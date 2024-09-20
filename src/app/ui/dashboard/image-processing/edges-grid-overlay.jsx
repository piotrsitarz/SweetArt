"use client";

import React, { useRef, useState, useCallback } from "react";
import jsPDF from "jspdf";

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

      const value = magnitude > threshold ? 0 : 255;
      output[index] = output[index + 1] = output[index + 2] = value;
      output[index + 3] = 255;
    }
  }

  return new ImageData(output, width, height);
};

const EdgesGridOverlay = ({ image, originalCanvasRef }) => {
  const [threshold, setThreshold] = useState(128);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  const applyEdgeDetection = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const imageData = imageRef.current;

    const sobelXData = applyKernel(imageData, sobelX, threshold);
    const sobelYData = applyKernel(imageData, sobelY, threshold);

    const output = new Uint8ClampedArray(imageData.data.length);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const mag = Math.sqrt(
        Math.pow(sobelXData.data[i] - sobelYData.data[i], 2) +
          Math.pow(sobelXData.data[i + 1] - sobelYData.data[i + 1], 2) +
          Math.pow(sobelXData.data[i + 2] - sobelYData.data[i + 2], 2)
      );

      const value = mag > threshold ? 0 : 255;
      output[i] = output[i + 1] = output[i + 2] = value;
      output[i + 3] = 255;
    }

    ctx.putImageData(new ImageData(output, canvas.width, canvas.height), 0, 0);
  }, [threshold]);

  React.useEffect(() => {
    if (!image) return;

    const canvas = canvasRef.current;
    const originalCanvas = originalCanvasRef.current;
    const ctx = canvas.getContext("2d");
    const originalCtx = originalCanvas.getContext("2d");
    const img = new Image();
    img.src = image;

    img.onload = () => {
      canvas.width = originalCanvas.width = 400;
      canvas.height = originalCanvas.height = 600;

      originalCtx.drawImage(img, 0, 0, 400, 600);
      ctx.drawImage(img, 0, 0, 400, 600);
      imageRef.current = ctx.getImageData(0, 0, 400, 600);
      applyEdgeDetection();
    };
  }, [image, applyEdgeDetection, originalCanvasRef]);

  const downloadAsPDF = () => {
    const canvas = canvasRef.current;
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const pdfWidth = 594;
    const pdfHeight = 841;
    const rectWidth = 500;
    const rectHeight = 700;
    // const rectIntWidth = 401;
    // const rectIntHeight = 601;

    const recXOffset = (pdfWidth - rectWidth) / 2;
    const recYOffset = (pdfHeight - rectHeight) / 2;
    // const recIntXOffset = (pdfWidth - rectIntWidth) / 2;
    // const recIntYOffset = (pdfHeight - rectIntHeight) / 2;
    const xOffset = (pdfWidth - imgWidth) / 2;
    const yOffset = (pdfHeight - imgHeight) / 2;

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      unit: "mm",
      format: [pdfWidth, pdfHeight],
    });

    pdf.rect(recXOffset, recYOffset, rectWidth, rectHeight);
    pdf.addImage(imgData, "PNG", xOffset, yOffset, imgWidth, imgHeight);
    pdf.save("edges.pdf");
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        width={400}
        height={600}
        className="mx-auto my-8"
      ></canvas>
      <input
        type="range"
        min="0"
        max="255"
        value={threshold}
        onChange={(e) => {
          setThreshold(e.target.value);
          applyEdgeDetection();
        }}
        className="my-2"
      />
      <label>Threshold: {threshold}</label>
      <button
        onClick={downloadAsPDF}
        className="block  px-4 text-center text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg cursor-pointer py-2 font-semibold"
      >
        Download PDF
      </button>
    </>
  );
};

export default EdgesGridOverlay;
