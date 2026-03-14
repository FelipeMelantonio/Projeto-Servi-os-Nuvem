import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Alert, CircularProgress } from '@mui/material';
import api from '../../services/api';
import useAuthStore from '../../store/authStore';

function CreateAdminPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    cpf: '',
    role: 'ADMIN', // Hardcoded for this admin creation page
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    setLoading(true);

    // Basic client-side validation
    if (!formData.nome || !formData.email || !formData.senha || !formData.cpf) {
        setError('Por favor, preencha todos os campos.');
        setLoading(false);
        return;
    }
    // More robust validation (email format, CPF format) would be added here

    try {
      await api.post('/auth/registrar', formData);
      setSuccess('Novo administrador registrado com sucesso!');
      setFormData({
        nome: '',
        email: '',
        senha: '',
        cpf: '',
        role: 'ADMIN',
      }); // Clear form
      // Optionally redirect or provide more options
    } catch (err) {
      console.error('Admin registration error:', err);
      setError(err.response?.data?.message || 'Erro ao registrar novo administrador.');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'ADMIN') {
    return (
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Alert severity="error">Acesso negado. Apenas administradores podem acessar esta página.</Alert>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/dashboard')}>
            Voltar para o Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5" gutterBottom>
          Registrar Novo Administrador
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
            label="Email"
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
            label="Senha"
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
            label="CPF"
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
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Registrar Admin'}
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

export default CreateAdminPage;
