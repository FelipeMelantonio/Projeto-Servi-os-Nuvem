import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Typography, Grid, Card, CardContent, Button, 
  Box, Avatar, Divider, List, ListItem, ListItemText, ListItemIcon,
  Paper, Stack
} from '@mui/material';
import {
  AccountBalance as AccountIcon,
  TrendingUp as TrendingUpIcon,
  AddCard as AddCardIcon,
  ArrowForward as ArrowIcon,
  CheckCircleOutline as ActiveIcon
} from '@mui/icons-material';
import useAuthStore from '../store/authStore';
import useAccountStore from '../store/accountStore';
import api from '../services/api';

function DashboardPage() {
  const { user } = useAuthStore();
  const { account, loading: accountLoading } = useAccountStore();
  const navigate = useNavigate();
  const [incomes, setIncomes] = useState(0);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  useEffect(() => {
    const fetchIncomes = async () => {
      if (!account?.id) return;
      
      setLoadingTransactions(true);
      try {
        const response = await api.get(`/transacoes/conta/${account.id}`);
        const transactions = response.data;
        
        // Calculate incomes (Entradas) for current month
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        const totalIncomes = transactions.reduce((acc, t) => {
          const tDate = new Date(t.timestamp);
          const isCurrentMonth = tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
          
          if (!isCurrentMonth) return acc;
          
          // Income if:
          // 1. It's a DEPOSITO into this account
          // 2. It's a TRANSFERENCIA_INTERNA where this account is the DESTINATION
          const isDeposit = t.tipo === 'DEPOSITO' && t.contaOrigem?.id === account.id;
          const isIncomingTransfer = t.contaDestino?.id === account.id;
          
          if (isDeposit || isIncomingTransfer) {
            return acc + t.valor;
          }
          return acc;
        }, 0);
        
        setIncomes(totalIncomes);
      } catch (err) {
        console.error('Failed to fetch transactions for stats:', err);
      } finally {
        setLoadingTransactions(false);
      }
    };

    fetchIncomes();
  }, [account]);

  if (accountLoading) return null; // MainLayout handles loading spinner via fetchAccount

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
          Olá, {user?.nome}!
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Bem-vindo ao seu painel financeiro.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Account Summary Card */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)', color: 'white' }}>
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="h6" sx={{ opacity: 0.8, mb: 1 }}>
                    Saldo Disponível
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
                    {account ? `R$ ${account.saldo?.toFixed(2)}` : 'R$ 0,00'}
                  </Typography>
                  {account && (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <ActiveIcon fontSize="small" />
                      <Typography variant="body2">Conta Ativa: {account.id}</Typography>
                    </Stack>
                  )}
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <AccountIcon fontSize="large" />
                </Avatar>
              </Stack>
              
              {!account && (
                <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    Você ainda não possui uma conta digital ativa.
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    startIcon={<AddCardIcon />}
                    onClick={() => navigate('/create-account')}
                    sx={{ bgcolor: 'white', color: '#1976d2', '&:hover': { bgcolor: '#f5f5f5' } }}
                  >
                    Criar Minha Conta Agora
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Stats/Info */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Resumo Mensal
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List disablePadding>
                <ListItem disablePadding sx={{ mb: 2 }}>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: '#e8f5e9', color: '#2e7d32' }}>
                      <TrendingUpIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText 
                    primary="Entradas" 
                    secondary={loadingTransactions ? "Carregando..." : `R$ ${incomes.toFixed(2)} este mês`} 
                    primaryTypographyProps={{ fontWeight: 'bold' }}
                  />
                </ListItem>
                <ListItem disablePadding>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    endIcon={<ArrowIcon />}
                    onClick={() => navigate('/transactions')}
                  >
                    Ver Extrato Completo
                  </Button>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Operations Grid */}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Acesso Rápido
          </Typography>
          <Grid container spacing={2}>
            {[
              { title: 'Depositar', icon: <TrendingUpIcon />, path: '/deposit', color: '#4caf50' },
              { title: 'Sacar', icon: <AccountIcon />, path: '/withdraw', color: '#f44336' },
              { title: 'Transferência', icon: <ArrowIcon />, path: '/transfer/internal', color: '#2196f3' },
            ].map((op) => (
              <Grid item xs={12} sm={4} key={op.title}>
                <Paper 
                  sx={{ 
                    p: 2, 
                    display: 'flex', 
                    alignItems: 'center', 
                    cursor: 'pointer',
                    transition: '0.3s',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
                  }}
                  onClick={() => navigate(op.path)}
                >
                  <Avatar sx={{ bgcolor: op.color, mr: 2 }}>{op.icon}</Avatar>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{op.title}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DashboardPage;
