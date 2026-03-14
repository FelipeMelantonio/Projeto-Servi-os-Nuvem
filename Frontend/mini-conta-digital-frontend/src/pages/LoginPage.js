import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Alert, Paper, Link } from '@mui/material';
import api from '../services/api';
import useAuthStore from '../store/authStore';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    
    if (!email || !senha) {
      setError('Por favor, informe seu e-mail e senha.');
      return;
    }

    try {
      const response = await api.post('/auth/login', { email, senha });
      const { token, user } = response.data;
      
      console.log('Login successful, user data:', user);
      
      // Salva no store
      login(token, user);
      
      // Verifica o role (garante que funciona se vier como string "ADMIN" ou objeto)
      const userRole = typeof user.role === 'string' ? user.role : user.role?.name;
      
      if (userRole === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login error details:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'E-mail ou senha incorretos.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f7fa',
      }}
    >
      <Container component="main" maxWidth="xs">
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            borderRadius: 3
          }}
        >
          <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography component="h1" variant="h3" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
              MiniBank
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Sua conta digital simplificada
            </Typography>
          </Box>

          <Typography component="h2" variant="h5" sx={{ mb: 3, fontWeight: 'medium' }}>
            Acessar Conta
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="E-mail"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="senha"
              label="Senha"
              type="password"
              id="senha"
              autoComplete="current-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 4, mb: 2, py: 1.5, fontWeight: 'bold' }}
            >
              Entrar
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2">
                Novo por aqui?{' '}
                <Link 
                  component="button" 
                  variant="body2" 
                  onClick={() => navigate('/register')}
                  sx={{ fontWeight: 'bold', textDecoration: 'none' }}
                >
                  Abra sua conta grátis
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default LoginPage;
