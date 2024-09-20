import { jsPDF } from "jspdf";
import "svg2pdf.js";

const handlePagination = (
  pdfDoc,
  x,
  y,
  columnWidth,
  pdfWidth,
  pdfHeight,
  margin,
  lineHeight
) => {
  if (y + lineHeight > pdfHeight - margin) {
    x += columnWidth;
    y = margin;

    if (x + columnWidth > pdfWidth - margin) {
      pdfDoc.addPage();
      x = margin;
      y = margin;
    }
  }
  return { x, y };
};

const drawColorHeader = (pdfDoc, x, y, color, count, headerFontSize) => {
  pdfDoc.setFillColor(color);
  pdfDoc.circle(x + 10, y + headerFontSize / 2, 5, "F");
  pdfDoc.setFontSize(headerFontSize);
  pdfDoc.setFont("helvetica", "bold");
  pdfDoc.text(`${color} - ${count}`, x + 20, y + headerFontSize / 2 + 1.5);
};

const drawCoordinates = (
  pdfDoc,
  x,
  y,
  coords,
  color,
  fontSize,
  lineHeight,
  singleColor
) => {
  pdfDoc.setFillColor(color);
  !singleColor && pdfDoc.circle(x + 10, y + lineHeight / 2, 3, "F");
  pdfDoc.setFontSize(fontSize);
  pdfDoc.setFont("helvetica", "bold");
  pdfDoc.text(
    `${singleColor ? coords : `${coords} = ${color}`}`,
    x + 20,
    y + lineHeight / 2 + 1.5
  );
};

export const downloadColorLegend = (
  circlesList,
  colors,
  singleColor = false
) => {
  const pdfWidth = 594;
  const pdfHeight = 841;
  const pdfDoc = new jsPDF({
    unit: "mm",
    format: [pdfWidth, pdfHeight],
  });

  const fontSize = 12;
  const lineHeight = fontSize * 1.2;
  const margin = 10;
  const columnWidth = (pdfWidth - 2 * margin) / (singleColor ? 8 : 6);
  let x = margin;
  let y = margin;

  const headerFontSize = 16;
  const headerHeight = headerFontSize + 10;

  if (singleColor) {
    const color = colors;
    const filteredList = circlesList.filter((circle) => circle.color === color);
    const colorOccurrences = filteredList.length;

    drawColorHeader(pdfDoc, x, y, color, colorOccurrences, headerFontSize);
    y += headerHeight;

    pdfDoc.setFontSize(fontSize);
    pdfDoc.setFont("helvetica", "normal");

    filteredList.forEach(({ coords }) => {
      ({ x, y } = handlePagination(
        pdfDoc,
        x,
        y,
        columnWidth,
        pdfWidth,
        pdfHeight,
        margin,
        headerHeight,
        lineHeight
      ));
      drawCoordinates(
        pdfDoc,
        x,
        y,
        coords,
        color,
        fontSize,
        lineHeight,
        singleColor
      );
      y += lineHeight;
    });
  } else {
    colors.forEach(({ color, count }) => {
      drawColorHeader(pdfDoc, x, y, color, count, headerFontSize);
      y += headerHeight;
    });

    y += fontSize;

    pdfDoc.setFontSize(fontSize);
    pdfDoc.setFont("helvetica", "normal");

    circlesList.forEach(({ coords, color }) => {
      ({ x, y } = handlePagination(
        pdfDoc,
        x,
        y,
        columnWidth,
        pdfWidth,
        pdfHeight,
        margin,
        headerHeight,
        lineHeight
      ));
      drawCoordinates(pdfDoc, x, y, coords, color, fontSize, lineHeight);
      y += lineHeight;
    });
  }

  pdfDoc.save(
    singleColor ? `color_legend_${colors}.pdf` : "color_legend_full.pdf"
  );
};

export const convertSvgToPdf = async (svgElement, safeColorId) => {
  const pdfWidth = 594;
  const pdfHeight = 841;
  const rectWidth = 500;
  const rectHeight = 700;
  // const rectIntWidth = 400;
  // const rectIntHeight = 600;
  const svgWidth = svgElement.clientWidth;
  const svgHeight = svgElement.clientHeight;

  const xOffset = (pdfWidth - svgWidth) / 2;
  const yOffset = (pdfHeight - svgHeight) / 2;
  const recXOffset = (pdfWidth - rectWidth) / 2;
  const recYOffset = (pdfHeight - rectHeight) / 2;
  // const recIntXOffset = (pdfWidth - rectIntWidth) / 2;
  // const recIntYOffset = (pdfHeight - rectIntHeight) / 2;

  const pdfDoc = new jsPDF({
    unit: "mm",
    format: [pdfWidth, pdfHeight],
  });

  await pdfDoc.svg(svgElement, {
    x: xOffset,
    y: yOffset,
    width: svgWidth,
    height: svgHeight,
  });

  pdfDoc.rect(recXOffset, recYOffset, rectWidth, rectHeight);
  pdfDoc.save(`${safeColorId ? "color" + safeColorId : "all"}.pdf`);
};
