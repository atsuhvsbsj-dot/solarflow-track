# Solar Project Tracking System - Setup Guide

This guide will help you set up and run the Solar Project Tracking & Management System.

## Prerequisites

- Node.js 18+ installed
- A Supabase account
- Basic knowledge of React and TypeScript

## Database Setup

The database has already been configured with the following:

### Tables Created
- `employees` - Employee management
- `customers` - Customer and project information
- `documents` - Document tracking and file management
- `checklists` - Task checklist items
- `wiring_details` - Wiring installation details
- `inspections` - Inspection records
- `commissioning` - Commissioning information
- `advising` - Advisory notes
- `activity_logs` - System activity tracking
- `employee_assignments` - Employee-customer assignments

### Storage
- `solar-documents` bucket created for file uploads

### Edge Functions Deployed
- `employee-scan` - Smart employee performance scanning
- `progress-report` - Automated progress report generation

## Authentication Setup

The system uses Supabase Authentication with email/password.

### Creating User Accounts

1. Admin Account:
```typescript
// Sign up using the signup method in AuthContext
await signup("admin@yourdomain.com", "securePassword123", "admin");
```

2. Employee Accounts:
```typescript
await signup("employee@yourdomain.com", "securePassword123", "employee");
```

### User Roles

Users are assigned roles through the `user_metadata.role` field:
- `admin` - Full access to all features
- `employee` - Access to assigned projects only

## Running the Application

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

The `.env` file is already configured with your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

## Initializing Sample Data

To populate the database with sample data:

1. Log in as an admin user
2. Open browser console
3. Import and run the initialization function:

```typescript
import { initializeDatabase } from './utils/initializeData';
await initializeDatabase();
```

This will create:
- 3 sample employees
- 3 sample customers
- Documents, checklists, and other related data

## Features Overview

### Admin Features
- **Dashboard**: Overview of all projects and statistics
- **Customer Management**: Add, edit, and manage customer projects
- **Employee Management**: Manage employee accounts and assignments
- **Document Management**: Upload, verify, and track documents
- **Checklist Management**: Track project milestones
- **Wiring Details**: Record installation specifications
- **Inspection Tracking**: Monitor inspection progress
- **Commissioning**: Finalize project commissioning
- **Activity Logs**: View all system activities
- **Smart Employee Scan**: AI-powered employee performance analysis
- **Progress Reports**: Auto-generated project progress summaries

### Employee Features
- **My Projects**: View assigned customer projects
- **Document Upload**: Upload required documents
- **Progress Updates**: Update task status
- **Activity Tracking**: Log work activities

### Real-Time Features
- Live updates when data changes
- Instant notifications for document uploads
- Real-time status changes across all connected clients

## API Endpoints

### Edge Functions

#### Employee Scan
```
GET /functions/v1/employee-scan?employeeId={id}
```

Returns employee performance metrics and recommendations.

#### Progress Report
```
GET /functions/v1/progress-report?customerId={id}
```

Returns detailed project progress report.

## File Upload

Files are stored in Supabase Storage with the following structure:
```
solar-documents/
  {customer_id}/
    {document_name}-{timestamp}.{extension}
```

Supported file types:
- PDF
- JPEG/JPG
- PNG
- Word Documents (DOCX)

Maximum file size: 10MB

## Security

### Row Level Security (RLS)

All tables have RLS enabled with policies that:
- Require authentication for all operations
- Allow read/write access to authenticated users
- Restrict data access based on user role

### File Storage Security

Storage policies ensure:
- Only authenticated users can upload files
- Files are publicly readable via URL
- Users can delete their own uploads

## Troubleshooting

### Authentication Issues

If you're having trouble logging in:
1. Ensure email confirmation is disabled in Supabase settings
2. Check that user metadata includes the role field
3. Verify credentials are correct

### File Upload Issues

If file uploads fail:
1. Check file size (must be under 10MB)
2. Verify file type is supported
3. Ensure storage bucket policies are active

### Real-Time Updates Not Working

If real-time features aren't working:
1. Check Supabase Realtime is enabled in your project
2. Verify table replication is enabled
3. Check browser console for connection errors

## Development Notes

### Tech Stack
- **Frontend**: React 18, TypeScript, Vite
- **UI**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **State Management**: React Context API
- **Routing**: React Router v6

### Code Structure
```
src/
  components/     - Reusable UI components
  contexts/       - React context providers
  hooks/          - Custom React hooks
  lib/            - Third-party library configurations
  pages/          - Page components
  services/       - API service layer
  utils/          - Utility functions
```

## Support

For issues or questions:
1. Check the Supabase dashboard for errors
2. Review browser console logs
3. Verify network requests in DevTools
4. Check activity logs in the application
