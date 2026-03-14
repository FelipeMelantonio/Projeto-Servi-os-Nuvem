import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Alert, CircularProgress, Card, CardContent } from '@mui/material';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import useAccountStore from '../store/accountStore';

function InternalTransferPage() {
  const { user } = useAuthStore();
  const { fetchAccount } = useAccountStore();
  const navigate = useNavigate();
  const [contaDestinoId, setContaDestinoId] = useState('');
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
      setError('Conta de origem não encontrada.');
      return;
    }
    const amount = parseFloat(valor);
    if (amount <= 0 || isNaN(amount)) {
      setError('O valor da transferência deve ser maior que zero.');
      return;
    }
    if (!contaDestinoId) {
        setError('Por favor, informe a conta de destino.');
        return;
    }
    if (account.saldo < amount) {
        setError('Saldo insuficiente para realizar a transferência.');
        return;
    }

    setSubmitting(true);
    try {
      await api.post('/transacoes/transferencia-interna', {
        contaOrigemId: account.id,
        contaDestinoId: parseInt(contaDestinoId),
        valor: amount,
      });

      if (user?.id) fetchAccount(user.id);

      setSuccess('Transferência interna realizada com sucesso!');
      setContaDestinoId('');
      setValor('');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      console.error('Internal transfer error:', err);
      setError(err.response?.data?.message || 'Erro ao realizar transferência interna.');
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

  if (error && !account) {
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
          Transferência Interna
        </Typography>

        {account && (
            <Card variant="outlined" sx={{ width: '100%', mb: 3 }}>
                <CardContent>
                    <Typography variant="h6">Sua Conta de Origem</Typography>
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
            id="contaDestinoId"
            label="ID da Conta de Destino"
            name="contaDestinoId"
            type="number"
            autoFocus
            value={contaDestinoId}
            onChange={(e) => setContaDestinoId(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="valor"
            label="Valor da Transferência"
            name="valor"
            type="number"
            inputProps={{ step: "0.01" }}
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
            {submitting ? <CircularProgress size={24} color="inherit" /> : 'Confirmar Transferência'}
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

export default InternalTransferPage;
