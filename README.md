# Food Ordering System

A full-stack web application that simulates food ordering with real-time order tracking, role-based permissions, and scheduling capabilities. Built with modern technologies following enterprise-grade architectural patterns.

## Features

### Core Functionality
- **User Authentication & Authorization** - JWT-based stateless authentication with role-based permissions
- **Order Management** - Complete CRUD operations for food orders with status tracking
- **Real-time Order Status Updates** - Automated order progression (Ordered → Preparing → In Delivery → Delivered)
- **Order Scheduling** - Schedule orders for future delivery times
- **Dish Management** - Full menu management with categories and availability tracking
- **Permission-based Access Control** - Granular permissions for different user roles

### Order Workflow
- **Status Transitions**: `ORDERED` → `PREPARING` → `IN_DELIVERY` → `DELIVERED` / `CANCELED`
- **Automatic Status Progression** - Background service handles timed status updates
- **Order Cancellation** - Users can cancel orders (with business rules)
- **Order History** - Complete tracking of order lifecycle

### Security Features
- **JWT Authentication** - Stateless token-based security
- **Password Hashing** - BCrypt encryption for password storage
- **Role-based Permissions** - Fine-grained access control
- **CORS Configuration** - Secure cross-origin resource sharing
- **Method-level Security** - `@PreAuthorize` annotations for endpoint protection

##  Architecture

### Backend (Spring Boot)
- **Architecture Pattern**: Controller → Service → Repository
- **Database**: PostgreSQL with JPA/Hibernate ORM
- **Security**: Spring Security + JWT
- **Validation**: Jakarta Validation with custom business rules
- **Scheduling**: Spring's `@Scheduled` for automated order processing
- **Error Handling**: Centralized exception handling with `@ControllerAdvice`

### Frontend (Next.js + TypeScript)
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript for type safety
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Forms**: React Hook Form + Zod validation
- **UI Components**: Custom components with Tailwind CSS
- **Authentication**: JWT stored in localStorage with automatic token refresh
- **Routing**: Protected routes with permission-based guards

