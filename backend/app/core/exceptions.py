from typing import Optional, Any, Dict

from fastapi import HTTPException, status


class AppException(Exception):
    def __init__(
        self,
        message: str = "An error occurred",
        detail: Optional[str] = None,
        code: str = "INTERNAL_ERROR",
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
    ):
        self.message = message
        self.detail = detail or message
        self.code = code
        self.status_code = status_code
        super().__init__(self.detail)


class NotFoundException(AppException):
    def __init__(
        self,
        message: str = "Resource not found",
        detail: Optional[str] = None,
        code: str = "NOT_FOUND",
    ):
        super().__init__(
            message=message,
            detail=detail,
            code=code,
            status_code=status.HTTP_404_NOT_FOUND,
        )


class UnauthorizedException(AppException):
    def __init__(
        self,
        message: str = "Not authenticated",
        detail: Optional[str] = None,
        code: str = "UNAUTHORIZED",
    ):
        super().__init__(
            message=message,
            detail=detail,
            code=code,
            status_code=status.HTTP_401_UNAUTHORIZED,
        )


class ForbiddenException(AppException):
    def __init__(
        self,
        message: str = "Forbidden",
        detail: Optional[str] = None,
        code: str = "FORBIDDEN",
    ):
        super().__init__(
            message=message,
            detail=detail,
            code=code,
            status_code=status.HTTP_403_FORBIDDEN,
        )


class ValidationException(AppException):
    def __init__(
        self,
        message: str = "Validation error",
        detail: Optional[str] = None,
        code: str = "VALIDATION_ERROR",
        errors: Optional[list] = None,
    ):
        self.errors = errors or []
        super().__init__(
            message=message,
            detail=detail,
            code=code,
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        )


class RateLimitException(AppException):
    def __init__(
        self,
        message: str = "Rate limit exceeded",
        detail: Optional[str] = None,
        code: str = "RATE_LIMIT_EXCEEDED",
        retry_after: Optional[int] = None,
    ):
        self.retry_after = retry_after
        super().__init__(
            message=message,
            detail=detail,
            code=code,
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
        )


class ToolExecutionException(AppException):
    def __init__(
        self,
        message: str = "Tool execution failed",
        detail: Optional[str] = None,
        code: str = "TOOL_EXECUTION_ERROR",
        tool_name: Optional[str] = None,
        exit_code: Optional[int] = None,
        stderr: Optional[str] = None,
    ):
        self.tool_name = tool_name
        self.exit_code = exit_code
        self.stderr = stderr
        super().__init__(
            message=message,
            detail=detail,
            code=code,
            status_code=status.HTTP_502_BAD_GATEWAY,
        )


class PipelineException(AppException):
    def __init__(
        self,
        message: str = "Pipeline execution failed",
        detail: Optional[str] = None,
        code: str = "PIPELINE_ERROR",
        stage: Optional[str] = None,
        job_id: Optional[str] = None,
    ):
        self.stage = stage
        self.job_id = job_id
        super().__init__(
            message=message,
            detail=detail,
            code=code,
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


class CeleryTimeoutException(AppException):
    def __init__(
        self,
        message: str = "Task timed out",
        detail: Optional[str] = None,
        code: str = "CELERY_TIMEOUT",
        task_id: Optional[str] = None,
    ):
        self.task_id = task_id
        super().__init__(
            message=message,
            detail=detail,
            code=code,
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
        )


class AIException(AppException):
    def __init__(
        self,
        message: str = "AI service error",
        detail: Optional[str] = None,
        code: str = "AI_ERROR",
        model: Optional[str] = None,
    ):
        self.model = model
        super().__init__(
            message=message,
            detail=detail,
            code=code,
            status_code=status.HTTP_502_BAD_GATEWAY,
        )


class StorageException(AppException):
    def __init__(
        self,
        message: str = "Storage limit exceeded",
        detail: Optional[str] = None,
        code: str = "STORAGE_ERROR",
    ):
        super().__init__(
            message=message,
            detail=detail,
            code=code,
            status_code=status.HTTP_507_INSUFFICIENT_STORAGE,
        )


class DomainValidationException(AppException):
    def __init__(
        self,
        message: str = "Domain not allowed",
        detail: Optional[str] = None,
        code: str = "DOMAIN_NOT_ALLOWED",
        domain: Optional[str] = None,
    ):
        self.domain = domain
        super().__init__(
            message=message,
            detail=detail,
            code=code,
            status_code=status.HTTP_400_BAD_REQUEST,
        )


def format_exception_response(
    error: str,
    detail: str,
    code: str = "INTERNAL_ERROR",
    **kwargs: Any,
) -> Dict[str, Any]:
    response = {
        "error": error,
        "detail": detail,
        "code": code,
    }
    response.update(kwargs)
    return response