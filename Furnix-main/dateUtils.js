/**
 * Furnix Global Date Utility
 * Refactored to utilize high-performance, tree-shakeable date-fns functions.
 */

import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';

/**
 * Formats a date string or object into a standardized string (e.g., "Oct 12, 2025").
 * Replaces: moment(date).format('MMM D, YYYY')
 * 
 * @param {string|Date} date - The date to format
 * @param {string} formatStr - The date-fns format string
 * @returns {string} Formatted date string
 */
export const formatDeliveryDate = (date, formatStr = 'MMM d, yyyy') => {
    if (!date) return '';
    
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(parsedDate)) {
        console.warn('Invalid date provided to formatDeliveryDate:', date);
        return 'TBD';
    }
    
    return format(parsedDate, formatStr);
};

/**
 * Returns a human-readable relative time string (e.g., "2 days ago", "in 3 hours").
 * Replaces: moment(date).fromNow()
 * 
 * @param {string|Date} date - The target date
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date) => {
    if (!date) return '';

    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(parsedDate)) return '';

    return formatDistanceToNow(parsedDate, { addSuffix: true });
};
