import React, { useState, useEffect } from 'react';
import { 
  Typography, Box, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, CircularProgress, 
  Alert, TextField, InputAdornment 
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import api from '../../services/api';

function AdminAccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await api.get('/contas');
        setAccounts(response.data);
      } catch (err) {
        setError('Erro ao carregar contas.');
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    
    // Converte para o padrão brasileiro: DD/MM/YYYY HH:mm:ss
    return date.toLocaleString('pt-BR');
  };

  const filteredAccounts = accounts.filter(a => 
    a.numeroConta.includes(searchTerm) ||
    a.usuario?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.usuario?.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>Gerenciamento de Contas</Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TextField
        fullWidth
        placeholder="Buscar por número da conta, nome ou email do titular..."
        variant="outlined"
        sx={{ mb: 3 }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Número Conta</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Titular</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Saldo</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Criado em</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAccounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell sx={{ fontWeight: 'bold' }}>{account.numeroConta}</TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{account.usuario?.nome}</Typography>
                    <Typography variant="caption" color="textSecondary">{account.usuario?.email}</Typography>
                  </Box>
                </TableCell>
                <TableCell>R$ {account.saldo?.toFixed(2)}</TableCell>
                <TableCell>
                  <Chip 
                    label={account.status} 
                    color={account.status === 'ATIVA' ? 'success' : 'error'} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>{formatDate(account.dataCriacao)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default AdminAccountsPage;
