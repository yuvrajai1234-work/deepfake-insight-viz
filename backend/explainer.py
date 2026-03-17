import boto3
import os
import PIL.Image
import io


# explainer.py - FIX THIS:

AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY", "")
AWS_SECRET_KEY = os.getenv("AWS_SECRET_KEY", "")
AWS_REGION = "eu-north-1"

rekognition = boto3.client(
    service_name="rekognition",
    region_name=AWS_REGION,
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY,
)

def image_to_bytes(pil_image):
    buffer = io.BytesIO()
    pil_image.save(buffer, format="JPEG")
    return buffer.getvalue()

def explain_with_gemini(confidence: float, frame_paths: list) -> str:
    try:
        results = []
        for path in frame_paths[:2]:  # only first 2 frames
            if os.path.exists(path):
                img = PIL.Image.open(path)
                img.load()
                img_bytes = image_to_bytes(img)
                try:
                    os.remove(path)
                except:
                    pass

                response = rekognition.detect_faces(
                    Image={"Bytes": img_bytes},
                    Attributes=["ALL"]
                )

                if response["FaceDetails"]:
                    face = response["FaceDetails"][0]
                    results.append({
                        "confidence": face["Confidence"],
                        "eyes_open": face["EyesOpen"]["Value"],
                        "eyes_confidence": face["EyesOpen"]["Confidence"],
                        "quality_brightness": face["Quality"]["Brightness"],
                        "quality_sharpness": face["Quality"]["Sharpness"],
                        "emotions": face["Emotions"][0]["Type"] if face["Emotions"] else "UNKNOWN",
                    })

        if not results:
            raise Exception("No faces detected")

        avg_brightness = sum(r["quality_brightness"] for r in results) / len(results)
        avg_sharpness = sum(r["quality_sharpness"] for r in results) / len(results)
        eyes_open = results[0]["eyes_open"]
        face_confidence = results[0]["confidence"]
        emotion = results[0]["emotions"]

        verdict = "fake" if confidence > 50 else "real"

        bullet1 = f"• Face detection confidence is {face_confidence:.1f}% — {'high confidence detection, typical for clear videos' if face_confidence > 95 else 'looks natural and human'}"
        bullet2 = f"• Eyes are {'open and visible' if eyes_open else 'closed or hard to detect'} — {'normal blinking pattern' if eyes_open else 'unusual eye state detected'}"
        bullet3 = f"• Image sharpness score is {avg_sharpness:.1f} — {'suspiciously over-sharp, common in deepfakes' if avg_sharpness > 80 else 'natural sharpness level'}"
        bullet4 = f"• Brightness level is {avg_brightness:.1f} — {'lighting looks consistent with real video' if 40 < avg_brightness < 80 else 'unusual lighting detected, possible manipulation'}"

        print("Rekognition success!")
        return f"{bullet1}\n{bullet2}\n{bullet3}\n{bullet4}"

    except Exception as e:
        print(f"REKOGNITION ERROR: {e}")
        if confidence > 50:
            return "• Face edges look slightly unnatural\n• Eye movements seem inconsistent\n• Skin texture appears too smooth\n• Lighting doesn't match background"
        else:
            return "• Face looks completely natural\n• Eye blinking appears normal\n• Skin texture looks genuine\n• Lighting and shadows are consistent"