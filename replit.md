# Portfolio Website

## Overview

A modern portfolio website built with TypeScript, featuring a React frontend and Express backend. The application showcases a dynamic timeline of projects, hackathon wins, and speaking events. Timeline data is served from a PostgreSQL database for easy content management and dynamic updates.

## User Preferences

Preferred communication style: Simple, everyday language.
Content Management: Timeline items stored in database for easy updates.
Focus: Portfolio-only application without authentication features.

## Recent Changes (July 2025)

- **Removed Authentication System**: Eliminated all login/register functionality and related routes
- **Added Database Integration**: Implemented PostgreSQL database with Drizzle ORM for timeline storage
- **Simplified Routing**: Removed login and dashboard pages, keeping only portfolio view
- **Database-driven Content**: Timeline items now stored in database instead of JSON file
- **Cleaned Architecture**: Removed auth middleware, session management, and user schemas

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing (simplified to portfolio-only)
- **State Management**: TanStack Query (React Query) for server state management
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **UI Components**: Radix UI primitives with custom shadcn/ui components
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Data Storage**: PostgreSQL database with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)

## Key Components

### Portfolio Timeline System
- **Database Storage**: Timeline items stored in PostgreSQL with Drizzle ORM
- **Dynamic Loading**: Server queries database and serves via API endpoint
- **Category Support**: Projects, hackathons, and events with different styling
- **Technology Tags**: Each timeline item includes technology arrays
- **Date Sorting**: Timeline items ordered by date for chronological display

### UI Component System
- **Design System**: Consistent theming with CSS custom properties
- **Component Library**: Comprehensive set of reusable UI components
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: Built on Radix UI primitives for ARIA compliance
- **Animated Experience**: Framer Motion for smooth timeline animations

## Data Flow

1. **Timeline Request**: Client requests `/api/timeline`
2. **Database Query**: Server queries PostgreSQL database via Drizzle ORM
3. **Data Serving**: Timeline data returned to client
4. **React Query Caching**: TanStack Query manages timeline data caching
5. **Timeline Rendering**: Portfolio page displays timeline with animations

## External Dependencies

### Database
- **PostgreSQL**: Production database for timeline storage
- **Drizzle ORM**: Type-safe database operations and migrations
- **Neon Database**: Serverless PostgreSQL provider

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography
- **Framer Motion**: Animation library for timeline interactions
- **TanStack Query**: Server state management for API calls

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: esbuild bundles Express server to `dist/index.js`
- **Database**: Drizzle migrations managed through `drizzle-kit`

### Environment Configuration
- **Development**: `NODE_ENV=development` with hot reloading
- **Production**: `NODE_ENV=production` with optimized builds
- **Database**: `DATABASE_URL` environment variable required

### Development Workflow
- **Hot Reloading**: Vite middleware integrated with Express in development
- **Type Safety**: TypeScript compilation checking across all modules
- **Database Operations**: `npm run db:push` for schema updates
- **Code Quality**: ESLint and Prettier integration (configured in components.json)

### Security Considerations
- **Database Security**: Environment-based connection string configuration
- **CORS**: Configured for development with Replit integration
- **No Authentication**: Removed all authentication-related security considerations