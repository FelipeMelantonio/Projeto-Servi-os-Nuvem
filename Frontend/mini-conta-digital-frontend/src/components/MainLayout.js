import React, { useState, useEffect } from 'react';
import { 
  Box, Drawer, AppBar, Toolbar, List, Typography, Divider, 
  IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, 
  Avatar, Chip, Tooltip, CircularProgress, Button
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  History as HistoryIcon,
  AccountBalanceWallet as DepositIcon,
  MoneyOff as WithdrawIcon,
  SwapHoriz as InternalIcon,
  Public as ExternalIcon,
  Logout as LogoutIcon,
  AccountCircle as ProfileIcon,
  AddCard as CreateAccountIcon,
  People as PeopleIcon,
  AccountBalance as AccountIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useAccountStore from '../store/accountStore';

const drawerWidth = 260;

function MainLayout({ children }) {
  const { user, logout } = useAuthStore();
  const { account, fetchAccount, loading } = useAccountStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user?.id && user?.role === 'USER') {
      fetchAccount(user.id);
    }
  }, [user, fetchAccount]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Extrato', icon: <HistoryIcon />, path: '/transactions' },
    { text: 'Depósito', icon: <DepositIcon />, path: '/deposit' },
    { text: 'Saque', icon: <WithdrawIcon />, path: '/withdraw' },
    { text: 'Transf. Interna', icon: <InternalIcon />, path: '/transfer/internal' },
    { text: 'Transf. Externa', icon: <ExternalIcon />, path: '/transfer/external' },
  ];

  const adminMenuItems = [
    { text: 'Dashboard Admin', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'Usuários', icon: <PeopleIcon />, path: '/admin/users' },
    { text: 'Contas', icon: <AccountIcon />, path: '/admin/accounts' },
    { text: 'Transações', icon: <HistoryIcon />, path: '/admin/transactions' },
    { text: 'Novo Admin', icon: <AdminIcon />, path: '/admin/create-admin' },
  ];

  const menuItems = user?.role === 'ADMIN' ? adminMenuItems : userMenuItems;

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#f4f6f8' }}>
      <Toolbar sx={{ backgroundColor: user?.role === 'ADMIN' ? '#d32f2f' : '#1976d2', color: 'white', display: 'flex', justifyContent: 'center' }}>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
          {user?.role === 'ADMIN' ? 'ADMIN PANEL' : 'MINI CONTA'}
        </Typography>
      </Toolbar>
      <Divider />
      
      {/* User Info Section in Drawer */}
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar 
          sx={{ width: 64, height: 64, mb: 1, bgcolor: user?.role === 'ADMIN' ? '#d32f2f' : '#1976d2' }}
        >
          {user?.nome?.charAt(0) || 'U'}
        </Avatar>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          {user?.nome || 'Usuário'}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {user?.role}
        </Typography>
      </Box>
      <Divider />

      <List sx={{ flexGrow: 1, px: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton 
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              sx={{ 
                borderRadius: '8px',
                '&.Mui-selected': { 
                  backgroundColor: user?.role === 'ADMIN' ? '#ffebee' : '#e3f2fd', 
                  color: user?.role === 'ADMIN' ? '#d32f2f' : '#1976d2',
                  '& .MuiListItemIcon-root': { color: user?.role === 'ADMIN' ? '#d32f2f' : '#1976d2' }
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Divider />
      <List sx={{ px: 1 }}>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout} sx={{ borderRadius: '8px', color: '#d32f2f' }}>
            <ListItemIcon sx={{ minWidth: 40, color: '#d32f2f' }}><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Sair" primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          boxShadow: 'none',
          backgroundColor: 'white',
          borderBottom: '1px solid #e0e0e0',
          color: 'text.primary'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
             {/* Dynamic Account Info in Toolbar */}
             {user?.role === 'USER' && (
               loading ? (
                  <CircularProgress size={20} sx={{ mr: 1 }} />
               ) : account ? (
                  <Tooltip title="Seu Saldo Atual">
                    <Chip 
                      label={`Saldo: R$ ${account.saldo?.toFixed(2)}`} 
                      color="primary" 
                      variant="outlined"
                      sx={{ fontWeight: 'bold', px: 1 }}
                    />
                  </Tooltip>
               ) : (
                  <Button 
                    startIcon={<CreateAccountIcon />} 
                    variant="contained" 
                    size="small"
                    onClick={() => navigate('/create-account')}
                  >
                    Criar Minha Conta
                  </Button>
               )
             )}
             {user?.role === 'ADMIN' && (
                <Chip 
                  label="Modo Administrador" 
                  color="secondary" 
                  variant="filled"
                  sx={{ fontWeight: 'bold', px: 1 }}
                />
             )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit">
              <ProfileIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid #e0e0e0' },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '64px'
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default MainLayout;
