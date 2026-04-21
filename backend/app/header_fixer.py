"""
Header-specific post-processing for PDF-to-Word conversions.
Fixes common header formatting issues without touching layout.
"""
from docx import Document
import re


def is_likely_name(text):
    """
    Detect if text looks like a person's name.
    """
    if not text or len(text) > 50:
        return False
    
    # Names are usually 2-4 words
    words = text.split()
    if len(words) < 2 or len(words) > 5:
        return False
    
    # Should not contain common non-name words
    non_name_words = ['the', 'and', 'career', 'objective', 'resume', 'cv', 'education']
    if any(word.lower() in non_name_words for word in words):
        return False
    
    return True


def title_case_name(name):
    """
    Apply proper title case to names, handling special cases.
    """
    words = name.split()
    result = []
    
    for word in words:
        # Handle initials like "V.M" or "J."
        if '.' in word and len(word) <= 4:
            result.append(word.upper())
        # Handle hyphenated names
        elif '-' in word:
            parts = word.split('-')
            result.append('-'.join(p.capitalize() for p in parts))
        # Regular words
        else:
            result.append(word.capitalize())
    
    return ' '.join(result)


def fix_header_formatting(doc):
    """
    Fix header formatting in the first few paragraphs.
    Only modifies name and basic header text.
    """
    # Only check first 5 paragraphs (header area)
    for i, paragraph in enumerate(doc.paragraphs[:5]):
        if not paragraph.text.strip():
            continue
        
        text = paragraph.text.strip()
        
        # Check if this looks like a name (first significant paragraph)
        if is_likely_name(text):
            corrected_name = title_case_name(text)
            
            if corrected_name != text:
                # Preserve all formatting, just update text
                for run in paragraph.runs:
                    if run.text.strip():
                        run.text = title_case_name(run.text)
                
                print(f"[DEBUG] Fixed name capitalization: '{text}' → '{corrected_name}'")
                break  # Only fix first name found
    
    return doc
