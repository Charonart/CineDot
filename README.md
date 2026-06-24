# CineDot - Movie Management System

**CineDot** is a production-level movie management and booking system. This repository contains the Frontend portion of the application.

## 🌟 Project Overview

- **Frontend/Backend Separation**: The frontend (Next.js) is completely decoupled from the backend (Laravel).
- **TMDB Integration**: The backend acts as a proxy/adapter to TMDB. The frontend never calls TMDB APIs directly.
- **Mock-First Architecture**: Features are developed using a robust mock API system before connecting to the real backend.

## 🚀 Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS, Headless UI, Lucide Icons
- **State Management**:
  - **Server State**: Tanstack Query (Data caching, refetching)
  - **Client State**: Zustand (UI themes, sidebars, modals)
- **Data Validation**: Zod
- **HTTP Client**: Axios (with centralized error normalization)

## 🏗️ Folder Architecture

The project strictly follows a **Modular Feature-First** architecture:

```text
src/
 ├── app/        # Next.js Routing, Layouts, Server Components
 ├── modules/    # Feature domains (e.g., auth, movies, search)
 │   ├── api/        # Axios API calls
 │   ├── dto/        # Data Transfer Objects from Backend
 │   ├── schemas/    # Zod validation schemas
 │   ├── types/      # Clean Domain Models for UI
 │   ├── mappers/    # Transform DTOs to Domain Models
 │   ├── services/   # Business logic & Safe parsing
 │   ├── hooks/      # Tanstack Query integrations
 │   └── components/ # UI components specific to the module
 ├── shared/     # Reusable UI components, utilities, visual elements
 ├── lib/        # 3rd party configurations (Axios, Env, QueryClient)
 ├── configs/    # Static app configurations
 ├── mocks/      # Mock data for offline development
 └── store/      # Global client state (Zustand)
```

## ⚙️ Development Workflow

Every new feature **MUST** follow this strict workflow:

1. **DTO Definition**: Define the raw data structure from the backend API.
2. **Zod Schema**: Create a validation schema for the DTO.
3. **Domain Types**: Define the clean, UI-friendly data types.
4. **Mapper**: Write a function to transform the validated DTO into the Domain Type.
5. **API Client**: Add the HTTP request method.
6. **Service**: Combine API call, validation (`safeParse`), and mapping.
7. **Query Hook**: Create a custom Tanstack Query hook.
8. **Mock Data**: Create JSON files in `public/mocks` and register them.
9. **UI Implementation**: Build the UI components and connect them to the hook.

*Never use raw API data directly in UI components.*

## 🛠️ Getting Started

1. **Clone the repository & Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
   Ensure `NEXT_PUBLIC_USE_MOCK=true` is set if you want to develop without a running backend.

3. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📚 Documentation

For more in-depth technical documentation:
- [Backend Handover & API Contract](docs/BACKEND-HANDOVER.md): API contract expectations for backend engineers.
- [Architecture Decision Records (ADRs)](docs/architecture/decisions): Historical architecture choices.
- `AGENTS.md`: Full coding rules and architectural constraints.
