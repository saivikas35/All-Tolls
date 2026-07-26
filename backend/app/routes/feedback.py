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

from fastapi import Request

@router.post("/feedback")
async def submit_feedback(request: Request):
    """Save a new feedback entry cleanly to a JSON file (supports JSON or Form)."""
    os.makedirs("uploads", exist_ok=True)
    
    content_type = request.headers.get("content-type", "")
    entry_data = {}
    if "application/json" in content_type:
        try:
            entry_data = await request.json()
        except Exception:
            pass
    else:
        try:
            form = await request.form()
            entry_data = {
                "name": form.get("name") or "Anonymous",
                "email": form.get("email") or "feedback@alltools.com",
                "rating": int(form.get("rating", 5)),
                "comments": form.get("comments") or form.get("message") or "Feedback submitted",
            }
        except Exception:
            pass

    name = entry_data.get("name", "Anonymous")
    email = entry_data.get("email", "feedback@alltools.com")
    rating = int(entry_data.get("rating", 5))
    comments = entry_data.get("comments") or entry_data.get("message") or "No comments"

    entries = []
    if os.path.exists(FEEDBACK_FILE):
        try:
            with open(FEEDBACK_FILE, "r", encoding="utf-8") as f:
                entries = json.load(f)
        except Exception:
            entries = []
            
    new_entry = {
        "name": name,
        "email": email,
        "rating": rating,
        "comments": comments,
        "timestamp": datetime.utcnow().isoformat()
    }
    entries.append(new_entry)
    
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
