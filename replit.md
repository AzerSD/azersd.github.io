# AceCloud - Secure Cloud Platform

## Overview

AceCloud is a modern full-stack web application built with TypeScript, featuring a React frontend and Express backend. The application provides a secure cloud platform with authentication capabilities, supporting both traditional login credentials and OAuth integration (Zitadel). The system uses a PostgreSQL database with Drizzle ORM for data persistence and includes a comprehensive UI component library built with Radix UI and Tailwind CSS.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **UI Components**: Radix UI primitives with custom shadcn/ui components
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Authentication**: JWT-based authentication with HTTP-only cookies
- **Password Hashing**: bcryptjs for secure password storage
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Session Management**: Database-backed sessions with connect-pg-simple

## Key Components

### Authentication System
- **JWT Tokens**: Secure token-based authentication with 7-day expiration
- **Session Management**: Database-backed sessions for enhanced security
- **Password Security**: bcrypt hashing with salt rounds
- **Dual Authentication**: Support for traditional login and OAuth (Zitadel)
- **HTTP-Only Cookies**: Secure token storage to prevent XSS attacks

### Database Schema
- **Users Table**: Stores user credentials, profile information, and OAuth data
- **Sessions Table**: Manages active user sessions with token validation
- **Flexible Authentication**: Supports both password-based and OAuth-only users

### UI Component System
- **Design System**: Consistent theming with CSS custom properties
- **Component Library**: Comprehensive set of reusable UI components
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: Built on Radix UI primitives for ARIA compliance
- **Brand Identity**: Custom AceCloud branding with gradient design elements

## Data Flow

1. **User Authentication**: Client sends credentials to `/api/auth/login`
2. **Token Generation**: Server validates credentials and generates JWT token
3. **Session Creation**: Server creates database session record
4. **Cookie Setting**: HTTP-only cookie set for secure token storage
5. **Protected Routes**: Client includes cookies in requests for authentication
6. **Token Validation**: Server validates JWT and checks session validity
7. **Data Fetching**: TanStack Query manages server state and caching

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL database
- **Drizzle ORM**: Type-safe database operations and migrations
- **Connection**: Environment-based DATABASE_URL configuration

### Authentication
- **JWT**: JSON Web Token for stateless authentication
- **bcryptjs**: Password hashing and validation
- **Zitadel**: OAuth provider integration (configured but not fully implemented)

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography

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
- **Database Migrations**: `npm run db:push` for schema updates
- **Code Quality**: ESLint and Prettier integration (configured in components.json)

### Security Considerations
- **Cookie Security**: Secure flag in production, SameSite strict policy
- **CORS**: Configured for development with Replit integration
- **Environment Variables**: Sensitive data stored in environment variables
- **Password Security**: Salted bcrypt hashing with 10 rounds
- **Session Management**: Database-backed sessions with expiration handling