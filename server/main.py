from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional
import requests
import os

app = FastAPI()

SYSTEM_PROMPT_1_PATH = os.path.join(os.path.dirname(__file__), "../system-prompt-1.txt")
SYSTEM_PROMPT_2_PATH = os.path.join(os.path.dirname(__file__), "../system-prompt-2.txt")

DEFAULT_MODELS = [
    "google/gemma-4-31b-it:free",
    "moonshotai/kimi-k2.6:free",
]


class Message(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: List[Message]
    model: str
    api_key: Optional[str] = None
    system_prompt_mode: int = 0


def get_api_key(request_key: Optional[str]) -> str:
    key = request_key or os.environ.get("OPENROUTER_API_KEY", "")
    if not key:
        raise HTTPException(status_code=401, detail="API key not configured.")
    return key


def load_system_prompt(mode: int) -> Optional[str]:
    if mode == 0:
        return None
    path = SYSTEM_PROMPT_1_PATH if mode == 1 else SYSTEM_PROMPT_2_PATH
    try:
        with open(path, "r", encoding="utf-8") as f:
            content = f.read().strip()
            return content if content else None
    except Exception:
        return None


@app.get("/api/models")
def get_models():
    return {"models": DEFAULT_MODELS}


@app.get("/api/server-key-status")
def server_key_status():
    has_key = bool(os.environ.get("OPENROUTER_API_KEY", "").strip())
    return {"configured": has_key}


@app.get("/api/system-prompt/{mode}")
def get_system_prompt(mode: int):
    content = load_system_prompt(mode)
    return {"content": content or ""}


@app.post("/api/chat")
def chat(req: ChatRequest):
    api_key = get_api_key(req.api_key)
    system_prompt = load_system_prompt(req.system_prompt_mode)

    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    messages += [m.model_dump() for m in req.messages]

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://wns-wormgpt.replit.app",
        "X-Title": "WNS WormGPT",
    }
    payload = {
        "model": req.model,
        "messages": messages,
        "max_tokens": 4096,
    }

    try:
        resp = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=60,
        )
        resp.raise_for_status()
        data = resp.json()
        content = data["choices"][0]["message"]["content"]
        return {"reply": content, "model": req.model}
    except requests.exceptions.HTTPError as e:
        raise HTTPException(status_code=502, detail=f"OpenRouter error: {e.response.text}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


static_path = os.path.join(os.path.dirname(__file__), "../client/dist")
if os.path.exists(static_path):
    app.mount("/assets", StaticFiles(directory=os.path.join(static_path, "assets")), name="assets")

    @app.get("/{full_path:path}")
    def serve_spa(full_path: str):
        index = os.path.join(static_path, "index.html")
        return FileResponse(index)
