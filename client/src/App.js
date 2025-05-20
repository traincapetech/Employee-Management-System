import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import Login from './components/auth/Login';
import AdminSignup from './components/auth/AdminSignup';
import LandingPage from './components/landing/LandingPage';
import EmployeeDashboard from './components/employee/EmployeeDashboard';
import HrDashboard from './components/hr/HrDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import HrCreationForm from './components/admin/HrCreationForm';
import EmployeeAttendance from './components/attendance/EmployeeAttendance';
import AttendanceManagement from './components/attendance/AttendanceManagement';
import EmployeeLeaves from './components/leave/EmployeeLeaves';
import LeaveManagement from './components/leave/LeaveManagement';
import EmployeeList from './components/employee/EmployeeList';
import EmployeeDetail from './components/employee/EmployeeDetail';
import EmployeeForm from './components/employee/EmployeeForm';
import SalarySlipGenerator from './components/salaryslip/SalarySlipGenerator';
import Profile from './components/profile/Profile';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          
          {/* Employee Routes */}
          <Route 
            path="/employee/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['EMPLOYEE']}>
                <MainLayout title="Employee Dashboard">
                  <EmployeeDashboard />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-attendance" 
            element={
              <ProtectedRoute allowedRoles={['EMPLOYEE']}>
                <MainLayout title="My Attendance">
                  <EmployeeAttendance />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-leaves" 
            element={
              <ProtectedRoute allowedRoles={['EMPLOYEE']}>
                <MainLayout title="My Leave Requests">
                  <EmployeeLeaves />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-salary-slips" 
            element={
              <ProtectedRoute allowedRoles={['EMPLOYEE']}>
                <MainLayout title="My Salary Slips">
                  <SalarySlipGenerator />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          
          {/* HR Routes */}
          <Route 
            path="/hr/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['HR', 'ADMIN']}>
                <MainLayout title="HR Dashboard">
                  <HrDashboard />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/employees" 
            element={
              <ProtectedRoute allowedRoles={['HR', 'ADMIN']}>
                <MainLayout title="Employees">
                  <EmployeeList />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/employees/add" 
            element={
              <ProtectedRoute allowedRoles={['HR', 'ADMIN']}>
                <MainLayout title="Add Employee">
                  <EmployeeForm />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/employees/:id" 
            element={
              <ProtectedRoute allowedRoles={['HR', 'ADMIN']}>
                <MainLayout title="Employee Details">
                  <EmployeeDetail />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/employees/edit/:id" 
            element={
              <ProtectedRoute allowedRoles={['HR', 'ADMIN']}>
                <MainLayout title="Edit Employee">
                  <EmployeeForm />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/attendance" 
            element={
              <ProtectedRoute allowedRoles={['HR', 'ADMIN']}>
                <MainLayout title="Attendance Records">
                  <AttendanceManagement />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/leave-requests" 
            element={
              <ProtectedRoute allowedRoles={['HR', 'ADMIN']}>
                <MainLayout title="Leave Requests">
                  <LeaveManagement />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/salary-slips" 
            element={
              <ProtectedRoute allowedRoles={['HR', 'ADMIN']}>
                <MainLayout title="Salary Slips">
                  <SalarySlipGenerator />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <MainLayout title="Admin Dashboard">
                  <AdminDashboard />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/create-hr" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <MainLayout title="Create HR Personnel">
                  <HrCreationForm />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          
          {/* Profile Route - accessible to all authenticated users */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <MainLayout title="My Profile">
                  <Profile />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          
          {/* Fallback for unmatched routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
