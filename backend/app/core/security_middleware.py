import re
import json
from typing import List, Optional
from urllib.parse import urlparse
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from app.core.config import settings
from app.core.logger import get_logger

logger = get_logger(__name__)

# Strict domain validation
DOMAIN_REGEX = re.compile(
    r'^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$'
)

ALLOWED_SCHEMES = {"http", "https"}
BLOCKED_EXTENSIONS = {".exe", ".dll", ".bat", ".sh", ".bin", ".msi"}
BLOCKED_PATHS = {
    "/etc/passwd",
    "/etc/shadow",
    "/proc/self/",
    "/.env",
    "/wp-admin",
    "adminer.php",
    "phpmyadmin",
}


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
        response.headers["Cache-Control"] = "no-store, max-age=0"
        response.headers["X-Powered-By"] = ""
        response.headers["Server"] = "Reconny"
        return response


def validate_domain(domain: str) -> bool:
    if not domain:
        return False
    domain = domain.lower().strip()
    if settings.ALLOWED_DOMAINS == "*":
        return bool(DOMAIN_REGEX.match(domain))
    allowed = [d.strip().lower() for d in settings.ALLOWED_DOMAINS.split(",")]
    return any(
        domain == a or domain.endswith("." + a)
        for a in allowed
    )


def sanitize_domain(domain: str) -> str:
    domain = domain.lower().strip()
    domain = re.sub(r'^https?://', '', domain)
    domain = domain.split('/')[0]
    domain = domain.split(':')[0]
    return domain.strip()


def sanitize_tool_input(input_str: str) -> str:
    result = input_str.strip()
    result = re.sub(r'[;&|`$(){}\[\]<>]', '', result)
    result = result.replace('\\', '')
    result = result.replace("'", "")
    result = result.replace('"', '')
    return result.strip()


def validate_url(url: str) -> bool:
    try:
        parsed = urlparse(url)
        if parsed.scheme not in ALLOWED_SCHEMES:
            return False
        ext = parsed.path.lower()
        if any(ext.endswith(b) for b in BLOCKED_EXTENSIONS):
            return False
        for blocked in BLOCKED_PATHS:
            if blocked in parsed.path.lower():
                return False
        return True
    except Exception:
        return False


def check_storage_limit(job_size_bytes: int) -> bool:
    max_bytes = settings.MAX_STORAGE_PER_JOB_GB * 1024 * 1024 * 1024
    return job_size_bytes <= max_bytes


class ToolInputSanitizer:
    @staticmethod
    def sanitize_target(target: str) -> str:
        return sanitize_domain(target)

    @staticmethod
    def sanitize_command_args(args: List[str]) -> List[str]:
        return [sanitize_tool_input(a) for a in args]

    @staticmethod
    def validate_and_sanitize_domain(domain: str) -> str:
        sanitized = sanitize_domain(domain)
        if not validate_domain(sanitized):
            raise ValueError(f"Domain '{domain}' is not allowed")
        return sanitized