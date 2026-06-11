# Reconny

> **AI-Powered Attack Surface Management Platform**

Reconny is a production-grade, scalable reconnaissance automation system that replicates and enhances the manual bug bounty workflow using a modular pipeline architecture with AI-driven analysis.

## What is Reconny?

Reconny transforms the traditional recon workflow into an automated, intelligent pipeline:

**Traditional Manual Recon** → Run tools → Parse output → Analyze → Find bugs

**Reconny** → Job-based pipeline → Distributed workers → AI analysis → Attack surface graph

## Features

- **13-Stage Pipeline**: Subdomain enum → Live probing → Crawling → JS analysis → Vuln scanning → AI insights
- **Job-Based Architecture**: Queue-driven, stateful, resumable scans
- **Horizontal Scaling**: Add workers on-demand for massive scans
- **AI Analysis Layer**: GPT-powered attack surface prioritization
- **Attack Surface Graph**: Visual navigation of domain → subdomains → endpoints → vulnerabilities
- **RESTful API**: Full programmatic control
- **Modern Dashboard**: React + TypeScript with real-time updates
- **Multi-Project Support**: Organize scans by bug bounty programs

## Architecture

```
User → API → Job Queue → Workers → Pipeline Stages → AI Analysis → Reports
                ↓
         PostgreSQL + Redis + File Storage
```

### Pipeline Stages
1. Subfinder (subdomain enumeration)
2. Httpx (live host probing)
3. Technology detection
4. Katana (web crawling)
5. JavaScript extraction
6. Endpoint extraction from crawl
7. JavaScript downloading
8. Static JS analysis for hidden endpoints
9. Endpoint aggregation & deduplication
10. Full URL reconstruction
11. Httpx endpoint probing
12. Nuclei vulnerability scanning
13. AI-based prioritization & reporting

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Python 3.11+
- Node.js 18+ (for frontend)
- Recon tools: subfinder, httpx, katana, nuclei

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/Reconny.git
cd Reconny

# Copy environment template
cp .env.example .env
# Edit .env with your configuration

# Start infrastructure
docker-compose up -d

# Run backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# Run worker (separate terminal)
celery -A app.tasks.celery_app worker --loglevel=info

# Run frontend (separate terminal)
cd frontend
npm install
npm run dev
```

### First Scan

```bash
# Via API
curl -X POST http://localhost:8000/api/v1/scan/start \
  -H "Content-Type: application/json" \
  -d '{"target_domain": "example.com", "user_id": "user123"}'

# Via Dashboard
# Open http://localhost:3000 and create a new scan
```

## Project Structure

```
Reconny/
├── backend/          # FastAPI backend
│   ├── app/
│   │   ├── api/      # REST endpoints
│   │   ├── pipeline/ # 13 pipeline stages
│   │   ├── workers/  # Celery workers
│   │   ├── ai/       # AI analysis engine
│   │   ├── models/   # Database models
│   │   └── integrations/ # Tool wrappers
├── frontend/         # React + TypeScript dashboard
│   ├── src/
│   │   ├── features/ # Feature modules
│   │   ├── components/ # UI components
│   │   ├── pages/    # Page components
│   │   ├── graphs/   # Attack surface visualization
│   │   └── charts/   # Analytics charts
├── storage/          # Scan results & artifacts
├── infrastructure/   # Docker, K8s configs
└── docs/            # Architecture & API docs
```

## Configuration

Key environment variables:

```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost/reconny

# Redis Queue
REDIS_URL=redis://localhost:6379/0

# AI
OPENAI_API_KEY=sk-...
AI_MODEL=gpt-4

# Tools
SUBFINDER_PATH=/usr/local/bin/subfinder
HTTPX_PATH=/usr/local/bin/httpx
KATANA_PATH=/usr/local/bin/katana
NUCLEI_PATH=/usr/local/bin/nuclei
```

## API Overview

```bash
POST   /api/v1/scan/start          # Start new scan
GET    /api/v1/scan/{job_id}       # Get scan status
GET    /api/v1/scan/{job_id}/logs  # Stream logs
GET    /api/v1/scan/{job_id}/results # Get results
POST   /api/v1/projects            # Create project
GET    /api/v1/projects            # List projects
```

Full API documentation: http://localhost:8000/docs

## Development

```bash
# Run tests
pytest

# Format code
black backend/
isort backend/

# Type checking
mypy backend/

# Run single pipeline stage (testing)
python -m backend.app.pipeline.stages.01_subfinder --domain example.com
```

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Key Rules:**
- Limit PRs to 5 files or less
- All code must be reviewed before merge
- Vibe coding is encouraged, but quality is required
- Tests are mandatory

## License

MIT License - See [LICENSE](LICENSE) for details

## Disclaimer

Reconny is designed for authorized security testing only. Users are responsible for ensuring they have permission to scan target domains. Unauthorized scanning may be illegal.

## Acknowledgments

Built with:
- [ProjectDiscovery](https://projectdiscovery.io/) tools (subfinder, httpx, katana, nuclei)
- FastAPI, Celery, PostgreSQL, Redis
- OpenAI GPT models
- React, TypeScript, TailwindCSS

## Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/Reconny/issues)
- **Docs**: [Documentation](docs/)
- **Security**: Report vulnerabilities privately to security@reconny.io

---

**Star this repo if Reconny helps your security research!**
