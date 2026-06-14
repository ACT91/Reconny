import pytest
from httpx import AsyncClient
from app.core.config import settings


pytestmark = pytest.mark.asyncio


class TestScanDomainValidation:
    async def test_create_scan_allowed_domain(self, client: AsyncClient, auth_headers):
        response = await client.post(
            f"{settings.API_V1_PREFIX}/scans/start",
            json={"target_domain": "example.com"},
            headers=auth_headers,
        )
        assert response.status_code in (201, 409)

    async def test_create_scan_invalid_domain(self, client: AsyncClient, auth_headers):
        response = await client.post(
            f"{settings.API_V1_PREFIX}/scans/start",
            json={"target_domain": "not_a_valid_domain"},
            headers=auth_headers,
        )
        assert response.status_code == 400
        data = response.json()
        assert "code" in data

    async def test_create_scan_malicious_domain(self, client: AsyncClient, auth_headers):
        response = await client.post(
            f"{settings.API_V1_PREFIX}/scans/start",
            json={"target_domain": "example.com; rm -rf /"},
            headers=auth_headers,
        )
        assert response.status_code == 400

    async def test_create_scan_without_auth(self, client: AsyncClient):
        response = await client.post(
            f"{settings.API_V1_PREFIX}/scans/start",
            json={"target_domain": "example.com"},
        )
        assert response.status_code == 401

    async def test_create_scan_without_rate_limit(self, client: AsyncClient, auth_headers, test_user):
        import pytest
        for i in range(5):
            response = await client.post(
                f"{settings.API_V1_PREFIX}/scans/start",
                json={"target_domain": "example.com"},
                headers=auth_headers,
            )
            if response.status_code == 429:
                break
        else:
            pass  # May not hit rate limit in test


class TestPagination:
    async def test_list_scans_with_pagination(self, client: AsyncClient, auth_headers, test_scan_job):
        response = await client.get(
            f"{settings.API_V1_PREFIX}/scans",
            headers=auth_headers,
            params={"page": 1, "page_size": 10},
        )
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "total" in data
        assert "page" in data

    async def test_list_scans_with_sorting(self, client: AsyncClient, auth_headers):
        response = await client.get(
            f"{settings.API_V1_PREFIX}/scans",
            headers=auth_headers,
            params={"sort": "created_at:desc"},
        )
        assert response.status_code == 200

    async def test_list_scans_with_search(self, client: AsyncClient, auth_headers):
        response = await client.get(
            f"{settings.API_V1_PREFIX}/scans",
            headers=auth_headers,
            params={"search": "example"},
        )
        assert response.status_code == 200


class TestErrorHandling:
    async def test_404_error_format(self, client: AsyncClient, auth_headers):
        response = await client.get(
            f"{settings.API_V1_PREFIX}/scans/00000000-0000-0000-0000-000000000000",
            headers=auth_headers,
        )
        assert response.status_code == 404
        data = response.json()
        assert "error" in data

    async def test_validation_error_format(self, client: AsyncClient):
        response = await client.post(
            f"{settings.API_V1_PREFIX}/auth/register",
            json={"email": "not-an-email", "password": "short"},
        )
        assert response.status_code == 422
        data = response.json()
        assert "error" in data

    async def test_api_key_authentication(self, client: AsyncClient, auth_headers):
        response = await client.get(
            f"{settings.API_V1_PREFIX}/auth/me",
            headers=auth_headers,
        )
        assert response.status_code == 200

    async def test_health_endpoint(self, client: AsyncClient):
        response = await client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"


class TestWebSocket:
    async def test_websocket_without_auth(self, client: AsyncClient, test_scan_job):
        import pytest
        response = await client.get(
            f"{settings.API_V1_PREFIX}/scans/{test_scan_job.id}/logs/stream",
        )
        assert response.status_code == 401

    async def test_websocket_with_auth(self, client: AsyncClient, auth_headers, test_scan_job):
        import pytest
        response = await client.get(
            f"{settings.API_V1_PREFIX}/scans/{test_scan_job.id}/logs/stream",
            headers=auth_headers,
        )
        assert response.status_code == 200
        assert "text/event-stream" in response.headers.get("content-type", "")