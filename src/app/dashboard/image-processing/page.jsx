"use client";

import React, { useState } from "react";
import ImageUploader from "@/app/ui/dashboard/image-processing/image-uploader";
import ColorLegend from "@/app/ui/dashboard/image-processing/color-legend";
import ColorGridOverlay from "@/app/ui/dashboard/image-processing/color-grid-overlay";
import useFetchColors from "@/app/utils/hooks/useFetchColors";
import { hexToRgb } from "@/app/utils/functions/hexToRgb";

const IndexPage = () => {
  const [image, setImage] = useState(null);
  const [colorCounts, setColorCounts] = useState({});
  const [circlesList, setCirclesList] = useState([]);
  const { colors } = useFetchColors();

  const handleImageUpload = (imgData) => {
    setImage(imgData);
  };

  return (
    <div className="p-6 mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Image Processing
      </h2>
      <ImageUploader onImageUpload={handleImageUpload} />
      {image && (
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="col-span-2">
            <ColorGridOverlay
              image={image}
              colors={colors.map((color) => hexToRgb(color.value))}
              setColorCounts={setColorCounts}
              colorCounts={colorCounts}
              setCirclesList={setCirclesList}
              circlesList={circlesList}
            />
          </div>
          <div className="col-span-1">
            <ColorLegend colorCounts={colorCounts} circlesList={circlesList} />
          </div>
        </div>
      )}
    </div>
  );
};

export default IndexPage;
