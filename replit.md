# Overview

This is a modern full-stack web application for an AI assistant company offering four products: Chatbot, Voicebot, Avatar, and Wissensbot (Knowledge Bot). The application is built as a professional marketing website with product showcases, comparison tools, implementation timelines, and contact forms. It features a German-language interface optimized for accessibility and SEO, targeting businesses looking for AI-powered customer service solutions.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **UI Components**: Radix UI primitives for accessible, unstyled components
- **State Management**: TanStack Query for server state and caching
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Accessibility**: WCAG 2.1 AA compliance with semantic HTML, proper ARIA labels, and keyboard navigation

## Backend Architecture
- **Runtime**: Node.js with Express server
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints for contact forms, consultation booking, and product data
- **Validation**: Zod schemas for runtime type checking and validation
- **Storage**: In-memory storage implementation (MemStorage) with interface for future database integration
- **Development**: Vite middleware integration for hot reloading in development

## Build System
- **Bundler**: Vite for frontend, esbuild for backend production builds
- **Development**: TSX for TypeScript execution in development
- **Production**: Compiled JavaScript modules for deployment

## Database Integration
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema**: Defined tables for users, contacts, consultations, and products
- **Database**: Neon Database (serverless PostgreSQL) specified in configuration
- **Migrations**: Drizzle Kit for schema management and migrations

## SEO and Performance
- **Meta Tags**: Dynamic SEO metadata with Open Graph and Twitter Card support
- **Structured Data**: Schema.org markup for organization, products, and FAQs
- **Accessibility**: Screen reader support, semantic HTML structure
- **Internationalization**: German language optimization with proper lang attributes
- **Core Web Vitals**: Image optimization, lazy loading, and performance monitoring

## Content Management
- **Products**: Static product data with detailed specifications, use cases, and pricing
- **Contact Forms**: Multiple form types for different engagement levels (contact, consultation)
- **Comparison Tools**: Interactive product comparison tables
- **Demo Integration**: Voice demo functionality with Web Speech API

# External Dependencies

## UI and Styling
- **Tailwind CSS**: Utility-first CSS framework for consistent styling
- **Radix UI**: Accessible component primitives for complex UI interactions
- **Lucide React**: Icon library for consistent iconography
- **shadcn/ui**: Pre-built component library built on Radix UI and Tailwind

## Data Management
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form state management and validation
- **Zod**: Runtime type validation and schema definition

## Database and ORM
- **Drizzle ORM**: Type-safe SQL ORM for PostgreSQL
- **Neon Database**: Serverless PostgreSQL database platform
- **Drizzle Kit**: Database migration and introspection toolkit

## Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Static type checking
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Autoprefixer

## Fonts and Assets
- **Google Fonts**: Inter font family for modern typography
- **Font Awesome**: Icon library for social media and UI icons
- **Unsplash**: Stock photography for product imagery

## Runtime and Platform
- **Node.js**: JavaScript runtime environment
- **Express**: Web application framework
- **Replit**: Development and hosting platform integration