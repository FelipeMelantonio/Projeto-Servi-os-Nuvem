import React, { useState, useEffect } from 'react';
import { 
  Typography, Grid, Card, CardContent, Box, Avatar, 
  Paper, Stack, CircularProgress
} from '@mui/material';
import {
  People as PeopleIcon,
  AccountBalance as AccountIcon,
  History as TransactionIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

function AdminDashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    accounts: 0,
    transactions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, accountsRes, transRes] = await Promise.all([
          api.get('/usuarios'),
          api.get('/contas'),
          api.get('/transacoes')
        ]);
        setStats({
          users: usersRes.data.length,
          accounts: accountsRes.data.length,
          transactions: transRes.data.length
        });
      } catch (err) {
        console.error('Failed to fetch admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const cards = [
    { title: 'Usuários', value: stats.users, icon: <PeopleIcon fontSize="large" />, color: '#1976d2', path: '/admin/users' },
    { title: 'Contas', value: stats.accounts, icon: <AccountIcon fontSize="large" />, color: '#2e7d32', path: '/admin/accounts' },
    { title: 'Transações', value: stats.transactions, icon: <TransactionIcon fontSize="large" />, color: '#ed6c02', path: '/admin/transactions' },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
          Painel do Administrador
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Visão geral do sistema e gestão de recursos.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid item xs={12} md={4} key={card.title}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                transition: '0.3s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
              }}
              onClick={() => navigate(card.path)}
            >
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: card.color, width: 56, height: 56 }}>
                    {card.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" color="textSecondary">
                      {card.title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {card.value}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Ações Rápidas
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper 
                sx={{ 
                  p: 2, 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#f5f5f5' }
                }}
                onClick={() => navigate('/admin/create-admin')}
              >
                <Avatar sx={{ bgcolor: '#9c27b0', mr: 2 }}><AdminIcon /></Avatar>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Novo Admin</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AdminDashboardPage;
