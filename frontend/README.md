# Reconny Frontend

Modern React + TypeScript frontend for the Reconny attack surface management platform.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling with custom design system
- **TanStack Query** - Server state management
- **Zustand** - Client state management
- **React Router** - Routing
- **React Flow** - Attack Surface Graph visualization
- **ECharts** - Analytics charts
- **React Hook Form + Zod** - Form handling and validation
- **Axios** - HTTP client
- **Lucide React** - Icons

## Design System

### Colors
- **Brand Yellow**: `#FFD966` - Primary accent
- **Brand Dark**: `#2B2B2B` - Text and backgrounds
- **Brand Background**: Gradient from `#F8F5F0` to `#FAF0D9`

### Typography
- **Font**: Hanken Grotesk
- **Weights**: 300 (light), 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Components
- **Cards**: Large rounded corners (`2.5rem`)
- **Shadows**: Subtle, elevation-based
- **Glass Effect**: Backdrop blur with transparency
- **Buttons**: Pill-shaped with smooth transitions

## Project Structure

```
src/
├── app/
│   ├── router/          # React Router configuration
│   ├── providers/       # Context providers
│   └── layouts/         # Layout components
│
├── pages/               # Page components
│   ├── auth/           # Login, register
│   ├── dashboard/      # Main dashboard
│   ├── scans/          # Scan management
│   ├── assets/         # Asset discovery
│   ├── endpoints/      # Endpoint listing
│   ├── findings/       # Vulnerability findings
│   ├── ai/            # AI analysis
│   └── reports/        # Report generation
│
├── features/           # Feature modules
│   ├── auth/
│   ├── scans/
│   ├── assets/
│   └── [feature]/
│       ├── api/        # API calls
│       ├── hooks/      # Custom hooks
│       ├── store/      # State management
│       ├── types/      # TypeScript types
│       └── components/ # Feature components
│
├── components/         # Shared components
│   ├── common/        # Buttons, inputs, etc.
│   ├── layouts/       # Navigation, headers
│   ├── charts/        # Reusable charts
│   └── graphs/        # Graph visualizations
│
├── graphs/            # Attack Surface visualizations
│   └── AttackSurfaceGraph.tsx  # Main graph component
│
├── services/          # API services
├── hooks/            # Global hooks
├── store/            # Global state
├── types/            # TypeScript definitions
├── utils/            # Utility functions
└── styles/           # Global styles
```

## Key Features

### 1. Attack Surface Graph
The centerpiece of the UI - visualizes the relationship between:
- Target Domain → Subdomains → Live Hosts → Technologies → JS Files → Endpoints → Vulnerabilities

**File**: `src/graphs/AttackSurfaceGraph.tsx`

Uses React Flow to create an interactive, navigable graph showing the complete attack surface discovery chain.

### 2. Real-time Scan Monitoring
- Live progress tracking
- WebSocket integration for updates
- Stage-by-stage pipeline visualization

### 3. Dashboard Overview
- Active scans
- Recent findings
- Risk metrics
- Attack surface map

### 4. Data Tables
- Sortable, filterable tables using TanStack Table
- Pagination
- Export functionality

## Development

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

Visit: `http://localhost:3000`

### Build for Production
```bash
npm run build
```

### Type Check
```bash
npm run type-check
```

## API Integration

The frontend connects to the backend API at `http://localhost:8000/api/v1`

Proxy is configured in `vite.config.ts` to handle CORS during development.

### API Services
Located in `src/services/api.ts`:
- `scanApi.startScan()`
- `scanApi.getScanStatus()`
- `scanApi.getScanLogs()`
- `scanApi.getScanResults()`
- `projectApi.createProject()`
- `projectApi.listProjects()`

## State Management

### Server State (TanStack Query)
Used for API data:
```typescript
const { data, isLoading } = useQuery({
  queryKey: ['scan', scanId],
  queryFn: () => scanApi.getScanStatus(scanId),
})
```

### Client State (Zustand)
Used for UI state:
```typescript
import { useAuthStore } from '@/store/authStore'

const { user, setUser } = useAuthStore()
```

## Custom Hooks

- `useAuth()` - Authentication state
- `useScan()` - Scan operations
- `useWebSocket()` - Real-time updates

## Styling Guidelines

### Use Utility Classes
```tsx
<div className="card">  {/* Pre-defined in globals.css */}
  <h2 className="text-2xl font-light">Title</h2>
</div>
```

### Custom Design Tokens
```tsx
<div className="bg-brand-yellow text-brand-dark">
  <button className="btn-primary">Action</button>
</div>
```

### Responsive Design
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Content */}
</div>
```

## Adding New Features

1. Create feature folder in `src/features/[feature]`
2. Add API functions in `[feature]/api/`
3. Create custom hooks in `[feature]/hooks/`
4. Define types in `[feature]/types/`
5. Build components in `[feature]/components/`
6. Add page in `src/pages/[feature]/`
7. Register route in `src/app/router/index.tsx`

## Performance

- Code splitting with React.lazy()
- Memoization with useMemo/useCallback
- Virtual scrolling for large lists
- Optimistic updates
- Query caching with TanStack Query

## Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus management
- Screen reader support

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

**Remember**: The attack surface graph is what makes this different from a standard CRUD dashboard. Focus on visual representations of recon data flow.
