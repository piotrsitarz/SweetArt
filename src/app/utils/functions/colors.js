export const getClosestColor = (color, palette) => {
  const [r1, g1, b1] = color;
  let closestColor = palette[0];
  let minDist = Infinity;

  palette.forEach(([r2, g2, b2]) => {
    const dist = Math.sqrt(
      Math.pow(r2 - r1, 2) + Math.pow(g2 - g1, 2) + Math.pow(b2 - b1, 2)
    );
    if (dist < minDist) {
      minDist = dist;
      closestColor = [r2, g2, b2];
    }
  });

  return closestColor;
};

export const getSafeColorId = (color) => color.replace(/[^a-zA-Z0-9]/g, "_");
