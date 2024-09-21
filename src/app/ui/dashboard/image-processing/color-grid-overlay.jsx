"use client";

import React, { useEffect, useRef, useState } from "react";
import { Tooltip } from "react-tooltip";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import Collapsible from "@/app/ui/collapsible";
import EdgesGridOverlay from "./edges-grid-overlay";
import { downloadColorLegend } from "@/app/utils/functions/downloadPDF";
import { getClosestColor, getSafeColorId } from "@/app/utils/functions/colors";
import { convertSvgToPdf } from "@/app/utils/functions/downloadPDF";

const gridWidth = 400;
const gridHeight = 600;
const circleDiameter = 10;
const circleRadius = circleDiameter / 2;
const xCircleSpace = -0.075;
const yCircleSpace = 1.45;

const ColorGridOverlay = ({
  image,
  colors,
  setColorCounts,
  colorCounts,
  setCirclesList,
  circlesList,
}) => {
  const canvasRef = useRef(null);
  const svgRef = useRef(null);
  const svgWithNumbersRef = useRef(null);
  const [circles, setCircles] = useState([]);
  const [colorMap, setColorMap] = useState([]);

  const handleDownloadPdf = (color) => {
    if (color === "all") {
      if (svgRef.current) {
        convertSvgToPdf({ svgElement: svgRef.current });
      }
    }
    if (color === "withNumbers") {
      if (svgWithNumbersRef.current) {
        convertSvgToPdf({ svgElement: svgWithNumbersRef.current, colorMap });
      }
    } else {
      const safeColorId = getSafeColorId(color);
      const svgElement = document.querySelector(`#svg-${safeColorId}`);
      if (svgElement) {
        convertSvgToPdf({ svgElement, safeColorId: `-${safeColorId}` });
      }
    }
  };

  useEffect(() => {
    if (!image) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = image;

    img.onload = () => {
      canvas.width = gridWidth;
      canvas.height = gridHeight;

      ctx.clearRect(0, 0, gridWidth, gridHeight);
      ctx.drawImage(img, 0, 0, gridWidth, gridHeight);

      const data = ctx.getImageData(0, 0, gridWidth, gridHeight);
      const colorCount = {};

      let newCircles = [];
      let newCirclesList = [];
      let uniqueColors = new Set();

      for (let x = 0; x < 40; x++) {
        const circleYstartPosition =
          x % 2 === 0 ? circleDiameter : circleRadius;
        const centerX =
          (gridWidth - 40 * circleDiameter - 40 * xCircleSpace) / 2;

        for (let y = 0; y < 52; y++) {
          const startX =
            circleRadius + centerX + x * circleDiameter + x * xCircleSpace;
          const startY =
            circleYstartPosition + circleDiameter * y + yCircleSpace * y;

          let rSum = 0,
            gSum = 0,
            bSum = 0,
            count = 0;

          for (let i = -circleRadius; i <= circleRadius; i++) {
            for (let j = -circleRadius; j <= circleRadius; j++) {
              if (i * i + j * j <= circleRadius * circleRadius) {
                const xPos = Math.round(startX + i);
                const yPos = Math.round(startY + j);
                if (
                  xPos >= 0 &&
                  xPos < gridWidth &&
                  yPos >= 0 &&
                  yPos < gridHeight
                ) {
                  const pixelIndex = (yPos * gridWidth + xPos) * 4;
                  rSum += data.data[pixelIndex];
                  gSum += data.data[pixelIndex + 1];
                  bSum += data.data[pixelIndex + 2];
                  count++;
                }
              }
            }
          }

          const avgColor = [
            Math.round(rSum / count),
            Math.round(gSum / count),
            Math.round(bSum / count),
          ];
          const closestColor = getClosestColor(avgColor, colors);
          const colorKey = `rgb(${closestColor.join(",")})`;

          colorCount[colorKey] = (colorCount[colorKey] || 0) + 1;
          uniqueColors.add(colorKey);

          const colorMap = {};
          Array.from(uniqueColors).forEach((color, index) => {
            colorMap[color] = index + 1;
          });
          const num = colorMap[colorKey];
          setColorMap(colorMap);

          newCircles.push({
            circle: (
              <circle
                key={`x${x + 1}-y${y + 1}`}
                cx={startX}
                cy={startY}
                r={circleRadius}
                fill={colorKey}
                data-tooltip-id="circle-tooltip"
                data-tooltip-content={`X${x + 1}, Y${y + 1} - ${colorKey}`}
              />
            ),
            withNumbers: (
              <g key={`circle-withNumbers-x${x + 1}-y${y + 1}`}>
                <circle
                  key={`x${x + 1}-y${y + 1}`}
                  cx={startX}
                  cy={startY}
                  r={circleRadius}
                  stroke="black"
                  strokeWidth={0.1}
                  fill="white"
                  data-tooltip-id="circle-tooltip"
                  data-tooltip-content={`X${x + 1}, Y${
                    y + 1
                  } - ${colorKey} = ${num}`}
                />
                <text
                  x={startX}
                  y={startY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  alignmentBaseline="central"
                  fill="black"
                  fontSize="5px"
                >
                  {num}
                </text>
              </g>
            ),
          });

          newCirclesList.push({
            coords: `X${x + 1}Y${y + 1}`,
            color: colorKey,
          });
        }
      }

      setCircles(newCircles);
      setColorCounts(colorCount);
      setCirclesList(newCirclesList);
    };
  }, [image]);

  return (
    <div className="flex flex-wrap items-start justify-around px-6 pb-6 bg-white p-4 rounded-lg shadow-md">
      <div className="flex flex-col items-center w-full max-w-sm h-full">
        <canvas
          ref={canvasRef}
          className="mx-auto my-8"
          width={gridWidth}
          height={gridHeight}
        />
      </div>
      <div className="flex flex-col items-center w-full max-w-sm h-full">
        <EdgesGridOverlay image={image} originalCanvasRef={canvasRef} />
      </div>
      <div className="flex flex-col items-center w-full max-w-sm h-full">
        <svg
          ref={svgWithNumbersRef}
          width={gridWidth}
          height={gridHeight}
          className="mx-auto my-8"
          // style={{ background: "black" }}
        >
          {circles.map(({ withNumbers }) => withNumbers)}
        </svg>
        <div className="mt-0">
          <button
            onClick={() => handleDownloadPdf("withNumbers")}
            className="block w-full px-4 text-center text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg cursor-pointer py-2 font-semibold"
          >
            Download PDF
          </button>
        </div>
      </div>
      <div className="flex flex-col items-center w-full max-w-sm h-full">
        <svg
          ref={svgRef}
          width={gridWidth}
          height={gridHeight}
          className="mx-auto my-8"
          style={{ background: "black" }}
        >
          {circles.map(({ circle }) => circle)}
        </svg>
        <div className="mt-0">
          <button
            onClick={() => handleDownloadPdf("all")}
            className="block w-full px-4 text-center text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg cursor-pointer py-2 font-semibold"
          >
            Download PDF (All)
          </button>
        </div>
      </div>

      {Object.entries(colorCounts).map(([color]) => (
        <div
          key={color}
          className="flex flex-col items-center w-full max-w-sm h-full"
        >
          <svg
            id={`svg-${getSafeColorId(color)}`}
            width={gridWidth}
            height={gridHeight}
            className="mx-auto my-8"
          >
            {circles
              .filter(({ circle }) => circle.props.fill === color)
              .map(({ circle: { props } }, index) => (
                <circle
                  key={index}
                  {...props}
                  fill="white"
                  stroke="black"
                  strokeWidth={0.1}
                />
              ))}
          </svg>
          <div className="mt-0">
            <button
              onClick={() => handleDownloadPdf(color)}
              className="block w-full px-4 text-center text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg cursor-pointer py-2 font-semibold"
            >
              Download PDF {color}
            </button>
          </div>
          <Collapsible
            title={
              <div className="bg-white p-4 flex items-center">
                <span
                  style={{ backgroundColor: color }}
                  className="inline-block w-6 h-6 rounded-full mr-3 border border-gray-300 text-sm font-medium"
                />
                <span className="text-sm font-medium">
                  {color}
                  <span className="font-bold">{`: ${
                    circles.filter(({ circle }) => circle.props.fill === color)
                      .length
                  }`}</span>
                </span>
              </div>
            }
          >
            <div className="space-y-">
              <div className="flex justify-end">
                <button
                  onClick={() => downloadColorLegend(circlesList, color, true)}
                  className="flex items-center justify-center w-7 h-7 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition duration-150 ease-in-out"
                >
                  <ArrowDownTrayIcon className="h-4 w-4" />
                </button>
              </div>
              <ul className="space-y-2">
                {circlesList
                  .filter((circle) => circle.color === color)
                  .map(({ coords, color }, index) => (
                    <li key={index} className="flex items-center">
                      <div
                        className="w-5 h-5 mr-2 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-sm font-medium">
                        <span className="font-bold">{coords}</span>
                        {` = ${color}`}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          </Collapsible>
        </div>
      ))}
      <Tooltip id="circle-tooltip" place="bottom" type="dark" effect="solid" />
    </div>
  );
};

export default ColorGridOverlay;
