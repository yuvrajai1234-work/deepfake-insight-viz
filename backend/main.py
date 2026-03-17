from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import shutil
import uuid
import os
import tempfile
from detector import analyze_video
from explainer import explain_with_gemini

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins in production
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/analyze")
async def analyze(video: UploadFile = File(...)):
    tmp_dir = tempfile.gettempdir()
    tmp_path = os.path.join(tmp_dir, f"{uuid.uuid4()}_{video.filename}")

    with open(tmp_path, "wb") as f:
        shutil.copyfileobj(video.file, f)

    try:
        detection = analyze_video(tmp_path)
        explanation = explain_with_gemini(
            detection["confidence"],
            detection["frame_paths"]
        )
        return {
            "verdict": detection["verdict"],
            "confidence": detection["confidence"],
            "face_box": detection["face_box"],
            "frame_scores": detection["frame_scores"],
            "explanation": explanation,
        }
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)