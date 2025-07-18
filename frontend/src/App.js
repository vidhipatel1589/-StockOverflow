// src/App.js
import './App.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Public pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import TermsPage from './pages/TermsPage';

// Client components and pages
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import CreateOrder from './pages/CreateOrder';
import OrderSummary from './pages/OrderSummary';
import CostBreakdown from './pages/CostBreakdown';
import Settings from './pages/Settings';

// Employee components and pages
import EmployeeSidebar from './components/EmployeeSidebar';
import EmployeeDashboard from './pages/EmployeeDashboard';
import UpcomingOrders from './pages/UpcomingOrders';
import Visualizer from './pages/Visualizer';
import EmployeeSettings from './pages/EmployeeSettings';

// Auth
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/terms" element={<TermsPage />} />

        {/* Client routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['CLIENT']}>
              <>
                <Sidebar />
                <Dashboard />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/createorder"
          element={
            <ProtectedRoute allowedRoles={['CLIENT']}>
              <CreateOrder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ordersummary"
          element={
            <ProtectedRoute allowedRoles={['CLIENT']}>
              <OrderSummary />
            </ProtectedRoute>
          }
        />
        <Route
          path="/costbreakdown"
          element={
            <ProtectedRoute allowedRoles={['CLIENT']}>
              <CostBreakdown />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRoles={['CLIENT']}>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* Employee routes */}
        <Route
          path="/employeedashboard"
          element={
            <ProtectedRoute allowedRoles={['EMPLOYEE']}>
              <>
                <EmployeeSidebar />
                <EmployeeDashboard />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/upcomingorders"
          element={
            <ProtectedRoute allowedRoles={['EMPLOYEE']}>
              <UpcomingOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/visualizer"
          element={
            <ProtectedRoute allowedRoles={['EMPLOYEE']}>
              <Visualizer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employeesettings"
          element={
            <ProtectedRoute allowedRoles={['EMPLOYEE']}>
              <EmployeeSettings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
