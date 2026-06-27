StickShift Marketplace — MVP Design Document

## 1. Overview

A lightweight, secure MVP marketplace for manual transmission (stick shift) car enthusiasts. The application supports:

Listing stick-shift cars by ZIP and adjustable radius

User-posted listings with photos, videos, and detailed metadata

Saved searches with notifications

Modern, minimal UI inspired by BoxRaw (https://boxraw.com)

Local-first development using Docker

Deployment: Frontend → Vercel, Backend + DB + Storage → Azure

## 2. Architecture Summary

Local Development (Docker-first)

Backend: Fastify API (REST + GraphQL)

Database: Local Postgres

Storage: MinIO (S3-compatible)

Worker: Background jobs

Frontend: Astro

Production

Frontend: Vercel

Serverless API routes: Vercel

Backend API: Azure App Service

Database: Azure Postgres Flexible Server

Storage: Azure Blob Storage

Background Jobs: Azure Functions

### Folder Structure

stickshift-marketplace/
│
├── frontend/               # Astro app (deploys to Vercel)
│   ├── src/
│   ├── public/
│   └── vercel.json
│
├── backend/                # Fastify API
│   ├── src/
│   ├── package.json
│   └── Dockerfile
│
├── worker/                 # Background jobs
│   ├── src/
│   └── Dockerfile
│
├── infra/
│   ├── docker-compose.yml
│   ├── env.example
│   └── README.md
│
├── docs/
│   ├── architecture.md
│   ├── mvp.md # this file
│
└── README.md

### Local Docker Setup

docker-compose.yml (conceptual)

version: "3.9"
services:
  backend:
    build: ../backend
    ports:
      - "3001:3001"
    env_file:
      - ./env.local
    depends_on:
      - postgres
      - minio

  worker:
    build: ../worker
    env_file:
      - ./env.local
    depends_on:
      - postgres

  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: stickshift
      POSTGRES_PASSWORD: stickshift
      POSTGRES_DB: stickshift
    ports:
      - "5432:5432"

  minio:
    image: minio/minio
    command: server /data
    environment:
      MINIO_ROOT_USER: minio
      MINIO_ROOT_PASSWORD: minio123
    ports:
      - "9000:9000"

Run locally

cd infra
docker-compose up --build

### Environment Variables

DATABASE_URL=postgres://stickshift:stickshift@postgres:5432/stickshift
STORAGE_ENDPOINT=http://minio:9000
STORAGE_ACCESS_KEY=minio
STORAGE_SECRET_KEY=minio123
JWT_SECRET=local-dev-secret
MAPBOX_KEY=your_mapbox_key

### Backend Architecture

Fastify

REST for mutations

GraphQL for reads

Zod validation

JWT auth

MinIO SDK locally → Azure Blob Storage in production

Postgres + ORM

#### GraphQL Schema (read-only)

type Listing {
  id: ID!
  title: String!
  make: String!
  model: String!
  year: Int!
  price: Int!
  mileage: Int!
  color: String
  engine: String
  gears: Int
  drivetrain: String
  fuel: String
  condition: String
  description: String
  media: [Media!]!
  seller: User!
  distanceMiles: Float!
}

type Media {
  url: String!
  thumbnailUrl: String!
  type: String!
}

type Query {
  listings(zip: String!, radius: Int!): [Listing!]!
  savedSearches: [SavedSearch!]!
}

#### REST Endpoints

Auth

POST /auth/signup
POST /auth/login

Listings

POST /listings
PATCH /listings/:id
DELETE /listings/:id

Media Upload

POST /listings/:id/media

Saved Searches

POST /saved-searches
DELETE /saved-searches/:id

#### Database Schema

listings table

CREATE TABLE listings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title TEXT,
  make TEXT,
  model TEXT,
  year INTEGER,
  price INTEGER,
  mileage INTEGER,
  color TEXT,
  engine TEXT,
  gears INTEGER,
  drivetrain TEXT,
  fuel TEXT,
  condition TEXT,
  description TEXT,
  zip TEXT,
  lat DOUBLE PRECISION,
  lon DOUBLE PRECISION,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

#### Radius Search (Haversine)

SELECT
  id, title, make, model, year, price, mileage,
  (3959 * acos(
     cos(radians(:lat)) * cos(radians(lat)) *
     cos(radians(lon) - radians(:lon)) +
     sin(radians(:lat)) * sin(radians(lat))
  )) AS distance_miles
FROM listings
HAVING distance_miles <= :radius
ORDER BY distance_miles ASC;

#### Frontend (Astro)

Run locally

cd frontend
npm install
npm run dev

### Deployment Plan

Frontend → Vercel

vercel deploy

Backend → Azure App Service

Build Docker image

Push to Azure Container Registry

Deploy to App Service

Database → Azure Postgres

Create Flexible Server

Run migrations

Storage → Azure Blob Storage

Replace MinIO endpoint

Use SAS tokens // no SAS tokens, use MSI or SP

Background Jobs → Azure Functions

Convert cron logic to timer-triggered function

### Security Checklist

JWT auth

Rate limiting

Zod validation

Signed upload URLs

HTTPS-only cookies

CORS restrictions

Secrets in Azure Key Vault // no secrets, use MSI, SP

### Running the Entire MVP Locally

cd infra
docker-compose up --build

cd frontend
npm run dev

### Migration Checklist for POST-MVP

Swap MinIO → Azure Blob Storage

Swap local Postgres → Azure Postgres

Deploy backend to Azure App Service

Deploy frontend to Vercel

Move cron → Azure Functions

Add Key Vault

Add VNet for DB isolation

### Next Steps

Implement backend scaffolding

Build listing creation flow

Build listing feed + GraphQL query

Build saved-search matching worker

Build Astro UI with video-first cards
