"use client";

import React from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { downloadColorLegend } from "@/app/utils/functions/downloadPDF";

const ColorLegend = ({ colorCounts, circlesList }) => {
  const colors = Object.entries(colorCounts).map(([color, count]) => ({
    color,
    count,
  }));

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Color Legend</h2>
        <button
          onClick={() =>
            downloadColorLegend(
              circlesList,
              Object.entries(colorCounts).map(([color, count]) => ({
                color,
                count,
              }))
            )
          }
          className="flex items-center justify-center w-7 h-7 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition duration-150 ease-in-out"
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Lista kolorów */}
      <ul className="space-y-2 mb-4">
        {colors.map(({ color, count }) => (
          <li key={color} className="flex items-center">
            <span
              style={{ backgroundColor: color }}
              className="inline-block w-6 h-6 rounded-full mr-3 border border-gray-300"
            />
            <span className="text-sm font-medium">
              {color}
              <span className="font-bold">{`: ${count}`}</span>
            </span>
          </li>
        ))}
      </ul>

      <hr className="my-4 border-gray-300" />

      {/* Przewijalna lista circlesList */}
      <ul
        className="space-y-2 overflow-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-200"
        style={{ maxHeight: "40rem" }}
      >
        {circlesList.map(({ coords, color }, index) => (
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

      {/* Style scrollbar dla przeglądarki Chrome */}
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 8px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #e5e5e5;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: #4a4a4a;
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background-color: #333;
        }
      `}</style>
    </div>
  );
};

export default ColorLegend;
