A lightweight, secure MVP marketplace for manual transmission (stick shift) car enthusiasts.

<img width="1311" height="959" alt="Screenshot 2026-06-27 at 14 50 58" src="https://github.com/user-attachments/assets/fe6bcfed-ee86-4f2a-89f4-662595114f77" />
<img width="1403" height="892" alt="Screenshot 2026-06-27 at 14 51 08" src="https://github.com/user-attachments/assets/b3889441-f657-412b-88d2-357624419d34" />

----


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

