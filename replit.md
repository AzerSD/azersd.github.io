# Portfolio Website

## Overview

A modern portfolio website built with TypeScript, featuring a React frontend and Express backend. The application showcases a dynamic timeline of projects, hackathon wins, and speaking events. Timeline data is served from a JSON file for easy content management without database dependencies.

## User Preferences

Preferred communication style: Simple, everyday language.
Content Management: Timeline items served from JSON file instead of database.
Focus: Portfolio-only application without authentication features.

## Recent Changes (July 2025)

- **Removed Authentication System**: Eliminated all login/register functionality and related routes
- **Simplified Data Storage**: Replaced database-driven timeline with JSON file (`data/timeline.json`)
- **Streamlined Routing**: Removed login and dashboard pages, keeping only portfolio view
- **Cleaned Architecture**: Removed auth middleware, session management, and database schemas

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
- **Data Storage**: JSON file-based timeline data serving
- **No Database**: Removed all PostgreSQL/Drizzle dependencies

## Key Components

### Portfolio Timeline System
- **JSON Data Source**: Timeline items stored in `data/timeline.json`
- **Dynamic Loading**: Server reads JSON file and serves via API endpoint
- **Category Support**: Projects, hackathons, and events with different styling
- **Technology Tags**: Each timeline item includes technology arrays

### UI Component System
- **Design System**: Consistent theming with CSS custom properties
- **Component Library**: Comprehensive set of reusable UI components
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: Built on Radix UI primitives for ARIA compliance
- **Animated Experience**: Framer Motion for smooth timeline animations

## Data Flow

1. **Timeline Request**: Client requests `/api/timeline`
2. **JSON File Read**: Server reads `data/timeline.json` from filesystem
3. **Data Serving**: JSON timeline data returned to client
4. **React Query Caching**: TanStack Query manages timeline data caching
5. **Timeline Rendering**: Portfolio page displays timeline with animations

## External Dependencies

### Removed Dependencies
- **No Database**: Removed PostgreSQL, Drizzle ORM, and related packages
- **No Authentication**: Removed JWT, bcryptjs, and session management
- **No OAuth**: Removed Zitadel integration

### Current Dependencies
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography
- **Framer Motion**: Animation library for timeline interactions
- **TanStack Query**: Server state management for API calls

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: esbuild bundles Express server to `dist/index.js`
- **Data**: Timeline JSON file served directly from filesystem

### Environment Configuration
- **Development**: `NODE_ENV=development` with hot reloading
- **Production**: `NODE_ENV=production` with optimized builds
- **No Database**: Removed all database environment variables

### Development Workflow
- **Hot Reloading**: Vite middleware integrated with Express in development
- **Type Safety**: TypeScript compilation checking across all modules
- **Content Updates**: Edit `data/timeline.json` to update portfolio content
- **Code Quality**: ESLint and Prettier integration (configured in components.json)

### Security Considerations
- **Static Content**: JSON file served through API endpoint
- **CORS**: Configured for development with Replit integration
- **No Authentication**: Removed all authentication-related security considerations