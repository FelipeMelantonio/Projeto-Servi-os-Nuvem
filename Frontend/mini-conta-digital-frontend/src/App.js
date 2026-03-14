import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, CssBaseline, Typography } from '@mui/material';
import useAuthStore from './store/authStore';
import MainLayout from './components/MainLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CreateAccountPage from './pages/CreateAccountPage';
import CreateAdminPage from './pages/admin/CreateAdminPage'; 
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminAccountsPage from './pages/admin/AdminAccountsPage';
import AdminTransactionsPage from './pages/admin/AdminTransactionsPage';
import TransactionHistoryPage from './pages/TransactionHistoryPage';
import DepositPage from './pages/DepositPage';
import WithdrawPage from './pages/WithdrawPage';
import InternalTransferPage from './pages/InternalTransferPage';
import ExternalTransferPage from './pages/ExternalTransferPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f8f9fa'
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
});

function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (adminOnly && user?.role !== 'ADMIN') {
      navigate('/dashboard'); 
    }
  }, [isAuthenticated, adminOnly, user, navigate]);

  if (!isAuthenticated || (adminOnly && user?.role !== 'ADMIN')) {
    return null; 
  }

  return <MainLayout>{children}</MainLayout>;
}

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth(); 
  }, [checkAuth]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<LoginPage />} /> {/* Redirect home to login */}

        {/* Protected Routes - All wrapped in MainLayout via ProtectedRoute */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/create-account" element={<ProtectedRoute><CreateAccountPage /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><TransactionHistoryPage /></ProtectedRoute>} />
        <Route path="/deposit" element={<ProtectedRoute><DepositPage /></ProtectedRoute>} />
        <Route path="/withdraw" element={<ProtectedRoute><WithdrawPage /></ProtectedRoute>} />
        <Route path="/transfer/internal" element={<ProtectedRoute><InternalTransferPage /></ProtectedRoute>} />
        <Route path="/transfer/external" element={<ProtectedRoute><ExternalTransferPage /></ProtectedRoute>} />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly={true}><AdminDashboardPage /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute adminOnly={true}><AdminUsersPage /></ProtectedRoute>} />
        <Route path="/admin/accounts" element={<ProtectedRoute adminOnly={true}><AdminAccountsPage /></ProtectedRoute>} />
        <Route path="/admin/transactions" element={<ProtectedRoute adminOnly={true}><AdminTransactionsPage /></ProtectedRoute>} />
        <Route path="/admin/create-admin" element={<ProtectedRoute adminOnly={true}><CreateAdminPage /></ProtectedRoute>} />

        <Route path="*" element={<Box sx={{ p: 4 }}><Typography variant="h4">404 - Page Not Found</Typography></Box>} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
