import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button, Alert, CircularProgress } from '@mui/material';
import api from '../services/api';
import useAuthStore from '../store/authStore';

function CreateAccountPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCreateAccount = async () => {
    if (!user || !user.id) {
      setError('User not authenticated or user ID not found.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // Assuming the API endpoint for creating an account takes the userId from the path
      // and the account itself is created based on the authenticated user.
      await api.post(`/contas/usuario/${user.id}`);
      setSuccess('Conta criada com sucesso!');
      setTimeout(() => {
        navigate('/dashboard'); // Redirect to dashboard to see new account details
      }, 2000);
    } catch (err) {
      console.error('Failed to create account:', err);
      setError(err.response?.data?.message || 'Erro ao criar conta.');
    } finally {
      setLoading(false);
    }
  };

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
          Criar Nova Conta Digital
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 3 }}>
          Clique no botão abaixo para criar sua conta digital. Cada usuário pode ter apenas uma conta.
        </Typography>

        {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2, width: '100%' }}>{success}</Alert>}

        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateAccount}
          disabled={loading}
          sx={{ mt: 3, mb: 2 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Criar Conta'}
        </Button>
        <Button
            variant="outlined"
            onClick={() => navigate('/dashboard')}
            sx={{ mt: 1 }}
        >
            Voltar para o Dashboard
        </Button>
      </Box>
    </Container>
  );
}

export default CreateAccountPage;
