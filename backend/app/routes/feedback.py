from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
import json
import os
from datetime import datetime

router = APIRouter()
FEEDBACK_FILE = "uploads/feedbacks.json"

class FeedbackItem(BaseModel):
    name: str = Field(..., min_length=1)
    email: str = Field(..., min_length=1)
    rating: int = Field(..., ge=1, le=5)
    comments: str = Field(..., min_length=1)

@router.post("/feedback")
async def submit_feedback(feedback: FeedbackItem):
    """Save a new feedback entry cleanly to a JSON file."""
    os.makedirs("uploads", exist_ok=True)
    
    entries = []
    if os.path.exists(FEEDBACK_FILE):
        try:
            with open(FEEDBACK_FILE, "r", encoding="utf-8") as f:
                entries = json.load(f)
        except Exception:
            entries = []
            
    # Add new entry
    new_entry = feedback.dict()
    new_entry["timestamp"] = datetime.utcnow().isoformat()
    entries.append(new_entry)
    
    # Save back
    with open(FEEDBACK_FILE, "w", encoding="utf-8") as f:
        json.dump(entries, f, indent=2)
        
    return {"success": True, "message": "Feedback saved successfully!"}

@router.get("/feedback")
async def get_feedback():
    """Retrieve all feedback entries, latest first."""
    if not os.path.exists(FEEDBACK_FILE):
        return {"success": True, "feedbacks": []}
        
    try:
        with open(FEEDBACK_FILE, "r", encoding="utf-8") as f:
            entries = json.load(f)
        # Return reversed so newest are at the top
        return {"success": True, "feedbacks": list(reversed(entries))}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read feedback: {str(e)}")
