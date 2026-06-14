import time
from typing import Optional
from fastapi import Request, HTTPException, status
from fastapi.concurrency import run_in_threadpool
import redis.asyncio as redis
from app.core.config import settings
from app.core.logger import get_logger

logger = get_logger(__name__)


class RateLimiter:
    def __init__(
        self,
        redis_client: redis.Redis,
        prefix: str = "rate_limit",
    ):
        self.redis = redis_client
        self.prefix = prefix

    def _make_key(self, key_parts: list[str]) -> str:
        return f"{self.prefix}:{':'.join(key_parts)}"

    async def is_allowed(
        self,
        key: str,
        max_requests: int,
        window_seconds: int,
    ) -> tuple[bool, int]:
        now = int(time.time())
        window_start = now - window_seconds
        
        pipe = self.redis.pipeline()
        pipe.add(key, 1, ex=window_seconds)
        pipe.zremrangebyscore(key, 0, window_start)
        pipe.zcard(key)
        pipe.zscore(key, 1)
        results = await pipe.execute()
        
        current_count = results[2]
        is_allowed = current_count <= max_requests
        
        return is_allowed, max_requests - current_count

    async def acquire_slot(
        self,
        key: str,
        max_concurrent: int,
    ) -> tuple[bool, int]:
        now = int(time.time())
        score = now + 3600
        
        pipe = self.redis.pipeline()
        pipe.zadd(key, {str(now): now})
        pipe.zremrangebyscore(key, 0, now - 3600)
        pipe.zcard(key)
        results = await pipe.execute()
        
        current_count = results[1]
        if current_count > max_concurrent:
            pipe2 = self.redis.pipeline()
            pipe2.zrem(key, str(now))
            await pipe2.execute()
            return False, max_concurrent
        
        return True, max_concurrent - current_count + 1


class RateLimitMiddleware:
    def __init__(
        self,
        app,
        global_requests: int = 100,
        global_window: int = 60,
    ):
        self.app = app
        self.global_requests = global_requests
        self.global_window = global_window
        self.limiter: Optional[RateLimiter] = None

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        request = Request(scope, receive)
        
        if self.limiter is None:
            self.limiter = RateLimiter(
                redis_client=redis.from_url(str(settings.REDIS_URL)),
            )

        client_ip = request.client.host if request.client else "unknown"
        user_key = f"user:{client_ip}"
        
        is_allowed, remaining = await self.limiter.is_allowed(
            user_key,
            self.global_requests,
            self.global_window,
        )
        
        if not is_allowed:
            from fastapi.responses import JSONResponse
            await JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={
                    "error": "rate_limit_exceeded",
                    "detail": f"Rate limit exceeded. Max {self.global_requests} requests per {self.global_window} seconds.",
                    "code": "RATE_LIMIT_EXCEEDED",
                },
                headers={"Retry-After": str(self.global_window)},
            )(scope, receive, send)
            return

        await self.app(scope, receive, send)


def get_rate_limiter() -> RateLimiter:
    return RateLimiter(redis.from_url(str(settings.REDIS_URL)))


async def check_rate_limit(
    user_id: str,
    action: str = "default",
    max_requests: Optional[int] = None,
    window_seconds: Optional[int] = None,
) -> tuple[bool, int]:
    limiter = get_rate_limiter()
    key = f"user:{user_id}:{action}"
    
    max_req = max_requests or settings.RATE_LIMIT_REQUESTS
    window = window_seconds or settings.RATE_LIMIT_WINDOW_SECONDS
    
    return await limiter.is_allowed(key, max_req, window)


async def check_concurrent_scans(user_id: str) -> tuple[bool, int]:
    limiter = get_rate_limiter()
    key = f"concurrent_scans:{user_id}"
    
    return await limiter.acquire_slot(key, settings.MAX_CONCURRENT_SCANS_PER_USER)