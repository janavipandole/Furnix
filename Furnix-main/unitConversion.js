/**
 * Furnix Unit Conversion Utility
 * Provides strict mathematical conversions to ensure frontend/backend dimension parity.
 */

const CM_PER_INCH = 2.54;

/**
 * Converts a Metric value (Centimeters) to an Imperial value (Inches)
 * @param {number} cmValue - The dimension in centimeters
 * @returns {number} The converted dimension in inches (rounded to 2 decimal places)
 */
export const convertMetricToImperial = (cmValue) => {
    if (typeof cmValue !== 'number' || isNaN(cmValue)) return 0;
    return parseFloat((cmValue / CM_PER_INCH).toFixed(2));
};

/**
 * Converts an Imperial value (Inches) to a Metric value (Centimeters)
 * @param {number} inchValue - The dimension in inches
 * @returns {number} The converted dimension in centimeters (rounded to 2 decimal places)
 */
export const convertImperialToMetric = (inchValue) => {
    if (typeof inchValue !== 'number' || isNaN(inchValue)) return 0;
    return parseFloat((inchValue * CM_PER_INCH).toFixed(2));
};
