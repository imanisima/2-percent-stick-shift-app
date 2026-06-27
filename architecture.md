StickShift Marketplace — Architecture & Sequence Diagrams

This document expands the MVP design with detailed architecture diagrams, sequence diagrams, and component interactions using Mermaid. It is structured for engineering clarity and can be used directly by GitHub Copilot CLI or IDE to scaffold the system.

1. High-Level Architecture Diagram

flowchart TD
    subgraph Client[User Devices]
        A1[Astro Frontend (Vercel)]
        A2[Mobile App (Capacitor)]
    end

    subgraph Vercel[Vercel Deployment]
        V1[Serverless API Routes]
    end

    subgraph Azure[Azure Backend]
        B1[Fastify Backend API]
        B2[Azure Postgres]
        B3[Azure Blob Storage]
        B4[Azure Functions (Background Jobs)]
    end

    subgraph LocalDev[Local Docker Dev]
        D1[Fastify Backend]
        D2[Postgres]
        D3[MinIO Storage]
        D4[Worker Cron]
    end

    A1 --> V1
    A2 --> V1

    V1 --> B1
    B1 --> B2
    B1 --> B3
    B4 --> B1

    D1 --> D2
    D1 --> D3
    D4 --> D1

2. Detailed Component Architecture

flowchart LR
    subgraph Frontend
        FE1[Astro UI]
        FE2[Video-first Listing Cards]
        FE3[ZIP + Radius Search]
        FE4[Create Listing Form]
    end

    subgraph API[Backend API]
        API1[REST Endpoints]
        API2[GraphQL Read Layer]
        API3[Auth (JWT)]
        API4[Validation (Zod)]
    end

    subgraph Storage
        ST1[Azure Blob Storage]
        ST2[MinIO (Local Dev)]
    end

    subgraph DB
        DB1[Azure Postgres]
        DB2[Local Postgres]
    end

    subgraph Worker
        WK1[Saved Search Matcher]
        WK2[Notification Dispatcher]
    end

    FE1 --> API1
    FE1 --> API2
    API1 --> DB1
    API2 --> DB1
    API1 --> ST1
    API2 --> ST1
    WK1 --> DB1
    WK2 --> API1

3. Sequence Diagram — User Creates a Listing

sequenceDiagram
    participant U as User
    participant FE as Astro Frontend
    participant API as Fastify Backend
    participant ST as Blob Storage / MinIO
    participant DB as Postgres

    U->>FE: Open Create Listing Page
    FE->>API: POST /auth/verify (JWT)
    API-->>FE: 200 OK

    U->>FE: Upload Photos/Videos
    FE->>API: Request Signed Upload URL
    API->>ST: Generate Signed URL
    ST-->>API: Signed URL
    API-->>FE: Signed URL

    FE->>ST: Upload Media
    ST-->>FE: 200 OK

    U->>FE: Submit Listing Form
    FE->>API: POST /listings
    API->>DB: Insert Listing Record
    DB-->>API: Success
    API-->>FE: Listing Created

4. Sequence Diagram — User Searches Listings by ZIP + Radius

sequenceDiagram
    participant U as User
    participant FE as Astro Frontend
    participant API as GraphQL Query
    participant DB as Postgres

    U->>FE: Enter ZIP + Radius
    FE->>API: GraphQL Query listings(zip, radius)
    API->>DB: Haversine Radius Query
    DB-->>API: Matching Listings
    API-->>FE: Listings with Distance
    FE-->>U: Render Listing Cards

5. Sequence Diagram — Saved Search Notification

sequenceDiagram
    participant WK as Worker (Azure Functions)
    participant DB as Postgres
    participant API as Backend API
    participant U as User

    loop Every 5 Minutes
        WK->>DB: Fetch Saved Searches
        DB-->>WK: Saved Search Records

        WK->>DB: Query New Listings Matching Filters
        DB-->>WK: Matching Listings

        alt Matches Found
            WK->>API: Trigger Notification
            API->>U: Email / Push Notification
        end
    end

6. Deployment Architecture Diagram

flowchart TD
    subgraph Vercel
        F1[Astro Frontend]
        F2[Vercel Serverless API]
    end

    subgraph Azure
        B1[Fastify Backend API]
        B2[Azure Postgres]
        B3[Azure Blob Storage]
        B4[Azure Functions]
        B5[Azure Container Registry]
    end

    F1 --> F2
    F2 --> B1
    B1 --> B2
    B1 --> B3
    B4 --> B1
    B1 --> B5

7. Notes for GitHub Copilot CLI

Suggested Commands

Scaffold backend:

copilot generate backend fastify typescript jwt zod graphql

Scaffold frontend:

copilot generate astro project listing marketplace

Scaffold docker-compose:

copilot generate docker compose postgres minio fastify worker

8. Next Steps

Implement backend scaffolding

Build listing creation flow

Build listing feed + GraphQL query

Build saved-search matching worker

Build Astro UI with video-first cards

This document now includes detailed architecture, sequence diagrams, and Mermaid diagrams suitable for engineering, planning, and Copilot-assisted development.
