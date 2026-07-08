"""
Minimal Supabase Storage client using raw REST calls (avoids adding the
full supabase-py SDK as a dependency — httpx is already available via openai).
"""

import os
import uuid

import httpx

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
SUPABASE_BUCKET = os.getenv("SUPABASE_BUCKET", "property-images")


def upload_image_bytes(file_bytes: bytes, filename: str, content_type: str) -> str:
    """Upload raw image bytes to Supabase Storage and return the public URL."""
    if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
        raise RuntimeError(
            "Supabase storage is not configured. Set SUPABASE_URL and "
            "SUPABASE_SERVICE_KEY in the backend environment."
        )

    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else "jpg"
    if ext not in {"jpg", "jpeg", "png", "webp", "gif"}:
        ext = "jpg"
    object_path = f"{uuid.uuid4().hex}.{ext}"

    upload_url = f"{SUPABASE_URL}/storage/v1/object/{SUPABASE_BUCKET}/{object_path}"
    headers = {
        "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
        "apikey": SUPABASE_SERVICE_KEY,
        "Content-Type": content_type or "application/octet-stream",
        "x-upsert": "true",
    }

    with httpx.Client(timeout=30) as client:
        resp = client.post(upload_url, headers=headers, content=file_bytes)

    if resp.status_code not in (200, 201):
        raise RuntimeError(f"Supabase upload failed ({resp.status_code}): {resp.text}")

    return f"{SUPABASE_URL}/storage/v1/object/public/{SUPABASE_BUCKET}/{object_path}"