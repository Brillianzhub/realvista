// utils/calculateArea.js

/**
 * Calculate area of a polygon based on its coordinates.
 * Uses the Shoelace formula to compute area from latitude and longitude points.
 * @param {Array} coordinates - Array of points in { lat, lon } format
 * @returns {number} - Calculated area in square units
 */
const calculateArea = (coordinates) => {
    if (coordinates.length < 3) return 0; // At least 3 points required for a polygon

    let area = 0;
    for (let i = 0; i < coordinates.length; i++) {
        const { lat: x1, lon: y1 } = coordinates[i];
        const { lat: x2, lon: y2 } = coordinates[(i + 1) % coordinates.length];
        area += x1 * y2 - y1 * x2;
    }
    return Math.abs(area / 2);
};

export default calculateArea;
