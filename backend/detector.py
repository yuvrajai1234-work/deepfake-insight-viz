import cv2
import tempfile
import os
import uuid
from PIL import Image
from transformers import pipeline
import numpy as np

print("Loading improved deepfake detection model...")
# Using Falconsai model - more accurate for deepfakes
try:
    deepfake_detector = pipeline(
        "image-classification",
        model="Falconsai/deepfake_image_detection"
    )
    print("Falconsai deepfake model loaded successfully!")
except Exception as e:
    print(f"Falconsai model error: {e}")
    print("Falling back to alternative model...")
    deepfake_detector = pipeline(
        "image-classification",
        model="dima806/deepfake_vs_real_image_detection"
    )

face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
)

def extract_frames(video_path: str, num_frames: int = 16):
    """Extract evenly spaced frames from video"""
    cap = cv2.VideoCapture(video_path)
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    step = max(total // num_frames, 1)
    frames = []
    for i in range(0, total, step):
        cap.set(cv2.CAP_PROP_POS_FRAMES, i)
        ret, frame = cap.read()
        if ret:
            frames.append(frame)
    cap.release()
    return frames[:num_frames]

def detect_face_box(frame):
    """Detect face location in frame and return bounding box"""
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)
    h, w = frame.shape[:2]
    if len(faces) > 0:
        x, y, fw, fh = faces[0]
        pad_x = int(fw * 0.1)
        pad_y = int(fh * 0.1)
        x = max(0, x - pad_x)
        y = max(0, y - pad_y)
        fw = min(w - x, fw + pad_x * 2)
        fh = min(h - y, fh + pad_y * 2)
        return {
            "left": round(x / w * 100, 1),
            "top": round(y / h * 100, 1),
            "width": round(fw / w * 100, 1),
            "height": round(fh / h * 100, 1),
        }
    return {"left": 32.0, "top": 10.0, "width": 25.0, "height": 45.0}

def analyze_video(video_path: str):
    """Analyze video for deepfakes using frame-by-frame detection"""
    frames = extract_frames(video_path, num_frames=16)
    if not frames:
        return {
            "verdict": "UNKNOWN",
            "confidence": 50.0,
            "frame_scores": [],
            "face_box": None,
            "frame_paths": []
        }

    scores = []
    frame_paths = []
    face_box = None
    tmp_dir = tempfile.gettempdir()

    print(f"Analyzing {len(frames)} frames...")
    
    for i, frame in enumerate(frames):
        if i == 0:
            face_box = detect_face_box(frame)

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        pil_img = Image.fromarray(rgb)

        try:
            result = deepfake_detector(pil_img)
            print(f"\nFrame {i}:")
            print(f"  Raw result: {result}")
            
            # Parse results - look for deepfake/fake confidence
            fake_score = 0.0
            
            # Parse all results
            for r in result:
                label = r["label"].lower()
                score = r["score"]
                print(f"  Label: '{label}', Score: {score:.4f}")
                
                # Check for FAKE label (Falconsai format)
                if label in ["fake", "deepfake", "ai generated", "manipulated", "forged"]:
                    fake_score = score
                    print(f"  ✓ Deepfake detected with score {fake_score:.4f}")
                    break
                # If we see "REAL", invert to get fake score
                elif label == "real":
                    fake_score = 1.0 - score
                    print(f"  ✓ Real face confidence: {score:.4f}, inverted fake score: {fake_score:.4f}")
                    break
            
            scores.append(round(fake_score * 100, 1))
            print(f"  → Final deepfake score for frame {i}: {fake_score * 100:.1f}%")
            
        except Exception as e:
            print(f"Frame {i} error: {e}")
            scores.append(50.0)

        # Save first 3 frames for explanation
        if i < 3:
            path = os.path.join(tmp_dir, f"frame_{uuid.uuid4()}.jpg")
            cv2.imwrite(path, frame)
            frame_paths.append(path)

    # Determine verdict with stricter logic for deepfakes
    if not scores:
        scores = [50.0]
    
    max_fake_score = max(scores)
    avg_confidence = round(sum(scores) / len(scores), 1)
    
    print(f"\n{'='*50}")
    print(f"ANALYSIS COMPLETE")
    print(f"{'='*50}")
    print(f"Frame scores: {scores}")
    print(f"Maximum fake score: {max_fake_score}%")
    print(f"Average confidence: {avg_confidence}%")
    
    # Detection logic: stricter for catching deepfakes
    # If any frame is >65% fake OR average is >50%, mark as FAKE
    if max_fake_score > 65 or avg_confidence > 50:
        verdict = "FAKE"
        final_confidence = round(max(max_fake_score, avg_confidence), 1)
        print(f"Verdict: 🚨 DEEPFAKE DETECTED")
    else:
        verdict = "AUTHENTIC"
        final_confidence = avg_confidence
        print(f"Verdict: ✓ AUTHENTIC")
    
    print(f"Final confidence: {final_confidence}%")
    print(f"{'='*50}\n")

    return {
        "verdict": verdict,
        "confidence": final_confidence,
        "frame_scores": scores,
        "face_box": face_box,
        "frame_paths": frame_paths,
    }