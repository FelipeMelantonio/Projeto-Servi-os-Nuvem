import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Alert, CircularProgress, Card, CardContent } from '@mui/material';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import useAccountStore from '../store/accountStore';

function DepositPage() {
  const { user } = useAuthStore();
  const { fetchAccount } = useAccountStore();
  const navigate = useNavigate();
  const [valor, setValor] = useState('');
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchAccountDetails = async () => {
      if (!user || !user.id) {
        setError('User ID not found.');
        setLoading(false);
        return;
      }
      try {
        const response = await api.get(`/contas/usuario/${user.id}`); 
        setAccount(response.data);
      } catch (err) {
        console.error('Failed to fetch account details:', err);
        setError(err.response?.data?.message || 'Failed to load account details.');
      } finally {
        setLoading(false);
      }
    };

    fetchAccountDetails();
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    if (!account?.id) {
      setError('Conta não encontrada para realizar o depósito.');
      return;
    }
    if (parseFloat(valor) <= 0 || isNaN(parseFloat(valor))) {
      setError('O valor do depósito deve ser maior que zero.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/transacoes/deposito', {
        contaId: account.id,
        valor: parseFloat(valor),
      });
      
      if (user?.id) fetchAccount(user.id);
      
      setSuccess('Depósito realizado com sucesso!');
      setValor('');
      // Optionally refresh account balance on dashboard or here
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      console.error('Deposit error:', err);
      setError(err.response?.data?.message || 'Erro ao realizar depósito.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error && !account) { // Only show error if account loading failed
    return (
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Alert severity="error">{error}</Alert>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/dashboard')}>
            Voltar para o Dashboard
        </Button>
      </Container>
    );
  }


  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5" gutterBottom>
          Realizar Depósito
        </Typography>

        {account && (
            <Card variant="outlined" sx={{ width: '100%', mb: 3 }}>
                <CardContent>
                    <Typography variant="h6">Sua Conta</Typography>
                    <Typography>Número: {account.id}</Typography>
                    <Typography>Saldo Atual: R$ {account.saldo?.toFixed(2)}</Typography>
                </CardContent>
            </Card>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="valor"
            label="Valor do Depósito"
            name="valor"
            type="number"
            inputProps={{ step: "0.01" }}
            autoFocus
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
          
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={24} color="inherit" /> : 'Confirmar Depósito'}
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => navigate('/dashboard')}
          >
            Voltar
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default DepositPage;
