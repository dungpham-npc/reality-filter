# Reality Filter

A system that provides an honest clarifying experience for aspiring software engineers.

## Structure

```
backend/   — Spring Boot 4 (Java 21), H2 database
frontend/  — React 19, TypeScript, Vite
```

## Run locally

**Backend:**
```bash
cd backend
./mvnw spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Frontend proxies API requests to `localhost:8080`.
