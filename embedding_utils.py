import os
import re
import time
import threading
import numpy as np
import google.generativeai as genai
from google.api_core.exceptions import NotFound, ResourceExhausted

DEFAULT_EMBEDDING_MODEL = "models/embedding-001"
PREFERRED_EMBEDDING_MODELS = [
    "models/text-embedding-004",
    "models/text-embedding-003",
    "models/text-embedding-002",
    "models/embedding-001",
]
_FALLBACK_USED = False
_AVAILABLE_EMBED_MODELS = None
_SELECTED_MODEL = None
_MODEL_LOGGED = False
_THROTTLE_LOCK = threading.Lock()
_LAST_EMBED_TS = 0.0


def _get_api_key():
    return os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")


def ensure_genai_configured():
    key = _get_api_key()
    if key:
        genai.configure(api_key=key)


def get_embedding_model():
    return os.getenv("GEMINI_EMBEDDING_MODEL") or os.getenv("EMBEDDING_MODEL")


def _get_requests_per_minute():
    try:
        return max(1, int(os.getenv("EMBED_REQUESTS_PER_MINUTE", "90")))
    except ValueError:
        return 90


def _throttle():
    global _LAST_EMBED_TS
    min_interval = 60.0 / _get_requests_per_minute()
    if min_interval <= 0:
        return
    with _THROTTLE_LOCK:
        now = time.monotonic()
        elapsed = now - _LAST_EMBED_TS
        if elapsed < min_interval:
            time.sleep(min_interval - elapsed)
        _LAST_EMBED_TS = time.monotonic()


def _parse_retry_delay_seconds(err: Exception):
    retry_delay = getattr(err, "retry_delay", None)
    if retry_delay is not None:
        seconds = getattr(retry_delay, "seconds", None)
        if seconds is not None:
            return float(seconds)

    msg = str(err)
    match = re.search(r"retry in ([0-9.]+)s", msg, re.IGNORECASE)
    if match:
        try:
            return float(match.group(1))
        except ValueError:
            pass

    match = re.search(r"retry_delay\s*\{\s*seconds:\s*(\d+)", msg)
    if match:
        try:
            return float(match.group(1))
        except ValueError:
            pass

    return None


def _get_max_retries():
    try:
        return max(0, int(os.getenv("EMBED_MAX_RETRIES", "5")))
    except ValueError:
        return 5


def _get_retry_base_seconds():
    try:
        return max(0.1, float(os.getenv("EMBED_RETRY_BASE_SECONDS", "2")))
    except ValueError:
        return 2.0


def _embed_with_retries(model_name: str, text: str) -> np.ndarray:
    max_retries = _get_max_retries()
    base_delay = _get_retry_base_seconds()
    last_exc = None

    for attempt in range(max_retries + 1):
        _throttle()
        try:
            res = genai.embed_content(model=model_name, content=text)
            return np.array(res["embedding"], dtype=np.float32)
        except ResourceExhausted as exc:
            last_exc = exc
            if attempt >= max_retries:
                break
            delay = _parse_retry_delay_seconds(exc)
            if delay is None:
                delay = min(60.0, base_delay * (2 ** attempt))
            time.sleep(delay)

    if last_exc is not None:
        raise last_exc
    raise RuntimeError("Embedding failed without a retryable error")


def _get_supported_methods(model_obj):
    methods = getattr(model_obj, "supported_generation_methods", None)
    if methods is None:
        methods = getattr(model_obj, "supported_methods", None)
    if methods is None:
        return []
    if isinstance(methods, str):
        return [methods]
    return list(methods)


def _list_embedding_models():
    ensure_genai_configured()
    try:
        models = genai.list_models()
    except Exception:
        return []

    embed_models = []
    for model_obj in models:
        methods = _get_supported_methods(model_obj)
        if any(m.lower() == "embedcontent" for m in methods):
            name = getattr(model_obj, "name", None)
            if name:
                embed_models.append(name)
    return embed_models


def _select_embedding_model():
    global _AVAILABLE_EMBED_MODELS, _SELECTED_MODEL, _MODEL_LOGGED
    if _SELECTED_MODEL:
        return _SELECTED_MODEL

    if _AVAILABLE_EMBED_MODELS is None:
        _AVAILABLE_EMBED_MODELS = _list_embedding_models()
    available = _AVAILABLE_EMBED_MODELS or []
    if not available:
        return None

    for preferred in PREFERRED_EMBEDDING_MODELS:
        if preferred in available:
            _SELECTED_MODEL = preferred
            break

    if _SELECTED_MODEL is None:
        for name in available:
            if "text-embedding" in name:
                _SELECTED_MODEL = name
                break

    if _SELECTED_MODEL is None:
        for name in available:
            if "embedding" in name:
                _SELECTED_MODEL = name
                break

    if _SELECTED_MODEL is None:
        _SELECTED_MODEL = available[0]

    if _SELECTED_MODEL and not _MODEL_LOGGED:
        print(f">>> Using embedding model {_SELECTED_MODEL}")
        _MODEL_LOGGED = True

    return _SELECTED_MODEL


def embed_text(text: str, model: str = None) -> np.ndarray:
    ensure_genai_configured()
    global _FALLBACK_USED
    model_name = model or get_embedding_model()
    tried = []

    if model_name:
        try:
            return _embed_with_retries(model_name, text)
        except NotFound:
            tried.append(model_name)

    selected = _select_embedding_model()
    if selected and selected not in tried:
        try:
            if tried and not _FALLBACK_USED:
                print(
                    f">>> Embedding model {tried[0]} unavailable; "
                    f"falling back to {selected}"
                )
                _FALLBACK_USED = True
            return _embed_with_retries(selected, text)
        except NotFound:
            tried.append(selected)

    if DEFAULT_EMBEDDING_MODEL and DEFAULT_EMBEDDING_MODEL not in tried:
        try:
            if tried and not _FALLBACK_USED:
                print(
                    f">>> Embedding model {tried[0]} unavailable; "
                    f"falling back to {DEFAULT_EMBEDDING_MODEL}"
                )
                _FALLBACK_USED = True
            return _embed_with_retries(DEFAULT_EMBEDDING_MODEL, text)
        except NotFound:
            tried.append(DEFAULT_EMBEDDING_MODEL)

    raise RuntimeError(
        "No embedding model available that supports embedContent. "
        "Set GEMINI_EMBEDDING_MODEL to a supported model from genai.list_models()."
    )
