A lightweight, secure MVP marketplace for manual transmission (stick shift) car enthusiasts.

## Local development

The frontend is implemented in `frontend/` using Astro with a local mocked backend API.

### Run locally

```bash
cd frontend
npm install
npm run dev
```

### Build locally

```bash
cd frontend
npm run build
```

### Mock API routes

The Astro app exposes local backend mocks under `/api`:

- `GET /api/listings`
- `POST /api/listings`
- `GET /api/saved-searches`
- `POST /api/saved-searches`
- `DELETE /api/saved-searches/:id`
- `POST /api/auth/login`

These mocks allow the Astro frontend to exercise listing and saved search flows without an external backend.

