# PROJECTOR - Procurement Management System

A comprehensive procurement management system built with React, TypeScript, and Node.js.

## Architecture

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Node.js + Express + TypeScript + Prisma + Supabase PostgreSQL
- **Authentication**: JWT with access/refresh tokens
- **State Management**: React Query for server state, React Context for auth
- **Styling**: Tailwind CSS with RTL support

## Prerequisites

- Node.js 18+ and npm
- Backend server running (see backend repository)

## Environment Setup

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Configure your environment variables in `.env`:
```bash
# Backend API URL - Replace with your actual backend URL
VITE_API_BASE_URL=http://localhost:3000

# Development settings
NODE_ENV=development
```

## Installation & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

## Build & Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── common/         # Common components (loading, error states)
│   ├── dashboard/      # Dashboard-specific components
│   ├── layout/         # Layout components
│   ├── program/        # Program/task management components
│   ├── stations/       # Station assignment components
│   ├── system/         # System management components
│   └── ui/             # shadcn/ui components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── pages/              # Page components
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Key Features

### Authentication
- JWT-based authentication with access/refresh tokens
- Role-based access control (8 different user roles)
- Secure token storage using HTTP-only cookies
- Automatic token refresh

### Dashboard
- Role-based task filtering
- Real-time status updates
- Advanced filtering and search
- Responsive design with RTL support

### Task Management
- Complete task lifecycle management
- Station-based workflow system
- Real-time collaboration
- File upload support

### System Administration
- User management
- Organizational structure management
- System configuration
- Infrastructure maintenance

## API Integration

The frontend integrates with the backend API using:

- **API Client**: Axios-based client with interceptors
- **React Query**: For caching, background updates, and optimistic updates
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Loading States**: Skeleton screens and loading indicators

## User Roles

1. **System Administrator (0)** - Full system access
2. **Procurement Manager (1)** - Complete procurement oversight
3. **Team Leader (2)** - Team management and task oversight
4. **Procurement Officer (3)** - Task execution and reporting
5. **Requester (4)** - Request submission and tracking
6. **Unit Manager (5)** - Unit-level oversight
7. **Executive/Staff (6)** - High-level reporting access
8. **Technical Maintainer (9)** - System maintenance

## Development Guidelines

### Code Organization
- Components are organized by feature/domain
- Shared components in `components/common/`
- Custom hooks for API integration
- TypeScript for type safety

### State Management
- React Query for server state
- React Context for authentication
- Local state for UI interactions

### Styling
- Tailwind CSS with custom design system
- RTL (Right-to-Left) support for Hebrew
- Responsive design patterns
- Consistent spacing and typography

## Testing

```bash
# Run tests (when implemented)
npm test

# Run integration tests
npm run test:integration
```

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Verify `VITE_API_BASE_URL` in `.env`
   - Ensure backend server is running
   - Check CORS configuration

2. **Authentication Issues**
   - Clear browser cookies and localStorage
   - Verify user credentials with backend
   - Check JWT token expiration

3. **Build Issues**
   - Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
   - Verify Node.js version compatibility

### Development Tips

- Use browser dev tools to monitor API calls
- Check React Query DevTools for cache state
- Monitor console for TypeScript errors
- Use the network tab to debug API issues

## Contributing

1. Follow the existing code structure and patterns
2. Use TypeScript for all new code
3. Add proper error handling and loading states
4. Test with different user roles
5. Ensure RTL compatibility

## Deployment

The application can be deployed to any static hosting service:

1. Build the application: `npm run build`
2. Deploy the `dist/` folder to your hosting service
3. Configure environment variables on the hosting platform
4. Ensure the backend API is accessible from the deployed frontend

## Security Considerations

- No sensitive data stored in frontend
- JWT tokens stored in secure HTTP-only cookies
- CORS properly configured for production
- Input validation on both client and server
- Role-based access control enforced

## Performance

- Code splitting for optimal bundle size
- React Query for efficient data fetching
- Lazy loading for non-critical components
- Optimized images and assets
- Proper caching strategies