import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Alert, Paper, Link } from '@mui/material';
import api from '../services/api';

function RegisterPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    cpf: '',
    role: 'USER', // Default to USER fixed
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    
    // Basic validation
    if (!formData.nome || !formData.email || !formData.senha || !formData.cpf) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      await api.post('/auth/registrar', formData);
      setSuccess('Registro realizado com sucesso! Redirecionando para o login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Erro ao registrar usuário.');
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
        py: 4
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
          <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: '#1976d2' }}>
            Criar Conta
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Cadastre-se para começar a usar seu banco digital.
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="nome"
              label="Nome Completo"
              name="nome"
              autoComplete="name"
              autoFocus
              value={formData.nome}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Endereço de E-mail"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="senha"
              label="Senha de Acesso"
              type="password"
              id="senha"
              autoComplete="new-password"
              value={formData.senha}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="cpf"
              label="CPF (apenas números)"
              name="cpf"
              autoComplete="off"
              value={formData.cpf}
              onChange={handleChange}
              inputProps={{ maxLength: 11 }}
            />

            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 4, mb: 2, py: 1.5, fontWeight: 'bold' }}
            >
              Finalizar Cadastro
            </Button>
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2">
                Já tem uma conta?{' '}
                <Link 
                  component="button" 
                  variant="body2" 
                  onClick={() => navigate('/login')}
                  sx={{ fontWeight: 'bold', textDecoration: 'none' }}
                >
                  Entrar agora
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default RegisterPage;
