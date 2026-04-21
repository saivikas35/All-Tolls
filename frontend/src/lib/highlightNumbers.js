/**
 * Utility to highlight impact numbers in resume text
 * Highlights: percentages (%), dollar amounts ($), multipliers (x), and standalone numbers
 */

export function highlightImpactNumbers(text, color = '#667eea') {
    if (!text || typeof text !== 'string') return text;

    // Regex to match impact numbers: $123K, 50%, 3x, 123M+, etc.
    const numberPattern = /(\$[\d,.]+[KMB]?|\d+%|\d+x|\d+[KMB]\+?|\d{2,})/g;

    const parts = text.split(numberPattern);

    return parts.map((part, index) => {
        if (numberPattern.test(part)) {
            return (
                <span key={index} style={{ fontWeight: '700', color: color }}>
                    {part}
                </span>
            );
        }
        return part;
    });
}

/**
 * Parse text and return JSX with highlighted numbers
 * For use in React components
 */
export function HighlightedText({ children, highlightColor }) {
    if (!children) return null;

    const text = String(children);
    const highlighted = highlightImpactNumbers(text, highlightColor);

    return <>{highlighted}</>;
}
