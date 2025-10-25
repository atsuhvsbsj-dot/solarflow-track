# Solar Project Tracking System - Implementation Guide

## Overview
This is a fully integrated frontend Solar Project Tracking System built with React, TypeScript, Supabase, and Tailwind CSS. The system manages solar installation projects with comprehensive tracking through all phases.

## Architecture

### 1. API Service Layer (`src/services/api.ts`)
- **Fully Implemented** with all CRUD operations for:
  - Customers
  - Employees
  - Documents (with file upload to Supabase Storage)
  - Checklists
  - Wiring Details
  - Inspections
  - Commissioning
  - Advising
  - Activity Logs
  - Employee Assignments

### 2. API Interceptor (`src/services/apiInterceptor.ts`)
- **Automatic Authentication**: Uses Supabase's built-in session management
- **Error Handling**: Centralized error handling with `ApiError` class
- **Token Management**: Automatic token refresh via Supabase client

### 3. Custom Hooks

#### `useApiCall` (`src/hooks/useApiCall.ts`)
Provides standardized API call handling with:
- Loading states
- Error handling
- Success/error toast notifications
- Data management

Usage:
```typescript
const { loading, execute, data, error } = useApiCall({
  successMessage: "Customer created successfully",
  errorMessage: "Failed to create customer",
});

await execute(() => customersApi.create(customerData));
```

#### `useRealtimeSubscription` (`src/hooks/useRealtimeSubscription.ts`)
Real-time updates for Supabase tables

### 4. Authentication System (`src/contexts/AuthContext.tsx`)

#### Features:
- Email/password authentication via Supabase
- Role-based access (Admin/Employee)
- Session persistence
- Auto-redirect based on role
- Protected routes via `ProtectedRoute` component

#### Login Interface:
```typescript
interface ILogin {
  email: string;
  password: string;
}
```

### 5. Route Guards (`src/components/ProtectedRoute.tsx`)
- Prevents unauthorized access
- Redirects unauthenticated users to login
- Works with AuthContext

### 6. Loading States

#### `LoadingSpinner` Component (`src/components/LoadingSpinner.tsx`)
- Multiple sizes: sm, md, lg, xl
- Full-screen overlay option
- LoadingOverlay wrapper component

Usage:
```typescript
{loading && <LoadingSpinner size="lg" text="Loading data..." />}
```

### 7. Status Calculation (`src/utils/statusCalculator.ts`)

#### Auto-Status Computation:
- **Documents**: Based on uploaded and verified status
- **Checklists**: Based on completed tasks
- **Wiring**: Based on wiring status
- **Inspection**: Based on inspection completion
- **Commissioning**: Based on commissioning status
- **Overall Project**: Weighted average of all sections

#### Functions:
```typescript
calculateDocumentStatus(documents)
calculateChecklistStatus(checklists)
calculateWiringStatus(wiringDetails)
calculateInspectionStatus(inspections)
calculateCommissioningStatus(commissioning)
calculateProjectProgress(allData) // Returns overall progress
```

### 8. Database Schema (Supabase)

#### Tables:
1. **employees** - Employee management
2. **customers** - Customer/project information
3. **documents** - Document tracking with file uploads
4. **checklists** - Task checklists
5. **wiring_details** - Wiring installation details
6. **inspections** - Quality control inspections
7. **commissioning** - Final commissioning data
8. **advising** - Advisory notes and issues
9. **activity_logs** - Audit trail
10. **employee_assignments** - Employee-customer assignments

#### Security:
- Row Level Security (RLS) enabled on all tables
- Authenticated user policies
- Supabase Storage bucket: `solar-documents`

### 9. Page Components

#### Dashboard (`src/pages/Dashboard.tsx`)
- **Features**:
  - Real-time statistics
  - Customer list with search/filter
  - Status charts
  - Recent activity feed
  - Loading states during data fetch
  - Error handling with toast notifications

#### Customer Detail (`src/pages/CustomerDetail.tsx`)
- **Tabs**:
  - Customer Information
  - Documents (with upload)
  - Checklist
  - Wiring Details
  - Inspection QC
  - Commissioning
  - Advising Notes
- **Features**:
  - Progress tracking
  - Employee assignment
  - Export reports
  - Admin-only edit capabilities

### 10. User Roles

#### Admin:
- Full CRUD access to all modules
- Employee management
- Customer assignment
- Document verification
- Status updates
- Activity log access

#### Employee:
- View assigned projects
- Upload documents
- Update progress
- Add remarks
- Read-only access to unassigned projects

## API Integration Examples

### Login
```typescript
const { login } = useAuth();
const result = await login(email, password);
if (result.success) {
  // Redirected based on role
}
```

### Fetch Customers
```typescript
const { loading, execute } = useApiCall({
  errorMessage: "Failed to load customers"
});

const customers = await execute(() => customersApi.getAll());
```

### Upload Document
```typescript
// 1. Upload file to storage
const { filePath, fileUrl } = await documentsApi.uploadFile(
  customerId,
  documentName,
  file
);

// 2. Create document record
await documentsApi.create({
  customer_id: customerId,
  name: documentName,
  file_url: fileUrl,
  file_path: filePath,
  uploaded: true,
  upload_date: new Date().toISOString()
});
```

### Update Checklist
```typescript
await checklistsApi.update(checklistId, {
  status: "completed",
  done_by: userName,
  completed_date: new Date().toISOString()
});
```

### Assign Employee
```typescript
await employeeAssignmentsApi.assign(employeeId, customerId);
// This also updates customers.assigned_to field
```

## Exception Handling

### All API calls use try-catch with toast notifications:
```typescript
const { execute } = useApiCall({
  successMessage: "Operation successful",
  errorMessage: "Operation failed",
  showErrorToast: true,
  showSuccessToast: true,
});

try {
  await execute(() => someApiCall());
} catch (error) {
  // Error is automatically handled and displayed
}
```

## Button & Section Interconnections

### Document Upload Flow:
1. User clicks "Upload" button
2. File picker opens
3. File uploads to Supabase Storage
4. Document record created in database
5. Document appears in "Uploaded" tab
6. Progress recalculated
7. Activity logged
8. Toast notification shown

### Checklist Update Flow:
1. Admin clicks "Edit" on checklist item
2. Modal opens with current data
3. Admin updates status/remarks
4. API call to update database
5. Checklist UI updates
6. Overall progress recalculates
7. Activity logged
8. Toast confirmation

### Employee Assignment Flow:
1. Admin opens assignment modal
2. Selects employee from dropdown
3. API creates assignment record
4. Customer's assigned_to field updates
5. Employee can now see project in "My Projects"
6. Activity logged
7. Toast confirmation

## Environment Variables

```env
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

## Running the Application

### Development:
```bash
npm install
npm run dev
```

### Production Build:
```bash
npm run build
npm run preview
```

## Features Implemented

### Core Functionality:
- ✅ Complete API service layer with all operations
- ✅ HTTP interceptor with automatic auth
- ✅ Route guards for protected pages
- ✅ Loading spinners for all API calls
- ✅ Comprehensive error handling with toast notifications
- ✅ Auto-status calculation based on data
- ✅ Real-time progress tracking
- ✅ Role-based access control
- ✅ Document upload with Supabase Storage
- ✅ Employee assignment system
- ✅ Activity logging
- ✅ Responsive UI with Tailwind CSS

### Admin Features:
- ✅ Dashboard with statistics
- ✅ Customer management (CRUD)
- ✅ Employee management (CRUD)
- ✅ Document verification
- ✅ Checklist management
- ✅ Wiring details editing
- ✅ Inspection management
- ✅ Commissioning tracking
- ✅ Advisory notes
- ✅ Activity log viewing
- ✅ Excel export

### Employee Features:
- ✅ View assigned projects
- ✅ Upload documents
- ✅ View progress
- ✅ Add remarks
- ✅ Limited access to unassigned projects

## Testing Recommendations

1. **Authentication Testing**:
   - Test login with valid/invalid credentials
   - Test role-based redirects
   - Test session persistence

2. **API Testing**:
   - Test all CRUD operations
   - Test error scenarios
   - Test file uploads

3. **Status Calculation Testing**:
   - Test with empty data
   - Test partial completion
   - Test full completion

4. **Route Guard Testing**:
   - Test unauthorized access attempts
   - Test role-based restrictions

## Security Notes

1. All API requests automatically include authentication via Supabase
2. RLS policies enforce data access control at database level
3. File uploads restricted to authenticated users
4. Sensitive operations logged to activity_logs table
5. No client-side storage of sensitive data

## Performance Optimizations

1. React Query for data caching
2. Lazy loading of components
3. Optimized bundle size with Vite
4. Database indexes on frequently queried columns
5. Efficient RLS policies

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Mobile Responsive

The application is fully responsive and works on:
- Desktop (1920x1080 and above)
- Tablet (768x1024)
- Mobile (375x667 and above)
