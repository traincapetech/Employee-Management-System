# Employee Management System - Frontend

A comprehensive React-based frontend for the Employee Management System, designed to work with the existing Spring Boot backend.

## Features

- **Authentication & Authorization**
  - Secure login with JWT
  - Role-based access control (Admin, HR, Employee)
  - Protected routes based on user roles

- **Employee Management**
  - View all employees (HR/Admin)
  - Add, edit, and view employee details
  - Employee profile management
  - Document management

- **Attendance Tracking**
  - Daily check-in/check-out for employees
  - Attendance reports and statistics
  - Mark attendance for multiple employees (HR/Admin)
  - Monthly attendance overview

- **Leave Management**
  - Apply for leave requests
  - Approve/reject leave requests (HR/Admin)
  - Leave request status tracking
  - Historical leave data

- **Salary Management**
  - Salary slip generation
  - Payment history
  - Deductions and allowances calculation

- **Responsive Design**
  - Mobile-friendly interface
  - Material Design components
  - Consistent user experience across devices

## Tech Stack

- **React** - Frontend library
- **React Router** - For navigation and routing
- **Material UI** - Component library
- **Axios** - HTTP client for API requests
- **JWT** - For authentication
- **Context API** - For state management
- **React Toastify** - For notifications
- **Date-fns** - Date manipulation library

## Project Structure

```
src/
├── components/           # React components
│   ├── attendance/       # Attendance-related components
│   ├── auth/             # Authentication components
│   ├── common/           # Shared/common components
│   ├── employee/         # Employee management components
│   ├── layout/           # Layout components
│   ├── leave/            # Leave management components
│   ├── profile/          # User profile components
│   └── salaryslip/       # Salary slip components
├── context/              # React context providers
├── services/             # API services
├── utils/                # Utility functions
└── assets/               # Static assets
```

## Installation

1. Clone the repository
2. Navigate to the client directory:
   ```
   cd client
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the root directory with the following content:
   ```
   REACT_APP_API_URL=http://localhost:8080/api
   ```
   (Adjust the API URL based on your backend configuration)

## Running the Application

In the project directory, you can run:

```
npm start
```

This runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Building for Production

```
npm run build
```

Builds the app for production to the `build` folder.

## User Roles

- **Admin**: Full system access with additional configuration capabilities
- **HR**: Human Resources personnel with employee management, attendance reports, and leave approval
- **Employee**: Regular employee user with access to personal information, attendance, and leave requests

## API Integration

The frontend integrates with the following backend API endpoints:

- Authentication: `/api/users/login`, `/api/users/signup`
- Employees: `/api/employees`
- Attendance: `/api/attendance`
- Leave: `/api/leave`
- Salary: via the attendance endpoints

## License

This project is licensed under the MIT License.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
