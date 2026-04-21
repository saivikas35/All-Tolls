"""
PDF Text Post-Processing Module
Cleans up common issues from PDF extraction
"""
import re


def fix_merged_words(text):
    """
    Add spaces where missing between words.
    Detects patterns like: ofEthambutол, afteroraladministration
    """
    # Add space before uppercase letters following lowercase
    text = re.sub(r'([a-z])([A-Z])', r'\1 \2', text)
    
    # Add space after common word endings before next word
    # Example: "25mg/kg/dayorally" → "25mg/kg/day orally"
    text = re.sub(r'(day|week|month|year|hour)([a-z])', r'\1 \2', text, flags=re.IGNORECASE)
    
    # Add space after percentage/units before next word
    # Example: "80%afteroral" → "80% afteroral"
    text = re.sub(r'(%|mg|kg|ml|cm)([a-z])', r'\1 \2', text, flags=re.IGNORECASE)
    
    return text


def remove_page_artifacts(text):
    """
    Remove page number artifacts like: '1 | P a g e', '2|Page', etc.
    """
    # Pattern: number followed by | followed by variations of "page"
    text = re.sub(r'\d+\s*\|\s*[Pp]\s*a\s*g\s*e', '', text)
    text = re.sub(r'\d+\s*\|\s*[Pp]age', '', text)
    
    # Also remove standalone variations
    text = re.sub(r'^[Pp]\s*a\s*g\s*e\s*\d+$', '', text, flags=re.MULTILINE)
    
    return text


def fix_special_characters(text):
    """
    Fix corrupted special characters.
    C → &
    Various dashes → consistent –
    """
    # Fix common OCR/conversion errors
    replacements = {
        ' C ': ' & ',  # Space-C-Space likely means &
        '- ': '– ',    # Normalize dashes
        ' -': ' –',
        'Stevens- Johnson': 'Stevens-Johnson',  # Fix hyphenated names
    }
    
    for old, new in replacements.items():
        text = text.replace(old, new)
    
    # Fix C at start of lines or after punctuation (likely &)
    text = re.sub(r'([.,:;])\s+C\s+', r'\1 & ', text)
    
    return text


def normalize_spacing(text):
    """
    Fix excessive line breaks and normalize spacing.
    """
    # Remove multiple consecutive blank lines (keep maximum 2)
    text = re.sub(r'\n{4,}', '\n\n\n', text)
    
    # Fix random mid-word line breaks (heuristic: lowercase-newline-lowercase)
    text = re.sub(r'([a-z])\n([a-z])', r'\1\2', text)
    
    # Remove trailing/leading whitespace from lines
    lines = text.split('\n')
    lines = [line.strip() for line in lines]
    text = '\n'.join(lines)
    
    # Normalize multiple spaces to single space
    text = re.sub(r' {2,}', ' ', text)
    
    return text


def fix_list_formatting(text):
    """
    Normalize bullet points and list formatting.
    """
    # Standardize bullet markers
    text = text.replace('•', '-')
    text = text.replace('→', '-')
    text = text.replace('◦', '-')
    
    # Fix common list patterns
    # "a.Tuberculosis" → "a. Tuberculosis"
    text = re.sub(r'([a-z])\.([\w])', r'\1. \2', text)
    
    # "2)Extrapulmonary" → "2) Extrapulmonary"
    text = re.sub(r'(\d)\)([\w])', r'\1) \2', text)
    
    return text


def clean_pdf_text(text):
    """
    Apply CONSERVATIVE cleanup - only fix critical text issues.
    Does NOT touch spacing, line breaks, or formatting that might affect layout.
    """
    # Only apply the most critical fixes
    text = remove_page_artifacts(text)
    text = fix_merged_words(text)
    text = fix_special_characters(text)
    
    # Skip normalize_spacing and fix_list_formatting to preserve layout
    
    return text


# CONSERVATIVE: Only clean paragraph text, don't touch structure
def clean_docx_paragraphs(doc):
    """
    Clean up paragraphs in a python-docx Document object.
    CONSERVATIVE: Only fixes text content, preserves all formatting and structure.
    """
    for paragraph in doc.paragraphs:
        if not paragraph.text.strip():
            continue
            
        original_text = paragraph.text
        cleaned_text = clean_pdf_text(original_text)
        
        # Only update if text actually changed
        if cleaned_text != original_text:
            # Preserve all runs and formatting, just update text
            for run in paragraph.runs:
                if run.text:
                    run.text = clean_pdf_text(run.text)
    
    return doc
