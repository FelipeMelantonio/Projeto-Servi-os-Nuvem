import React, { useState, useEffect } from 'react';
import { 
  Typography, Box, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, CircularProgress, 
  Alert, TextField, InputAdornment
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import api from '../../services/api';

function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get('/transacoes');
        // Sort by timestamp desc
        const sorted = response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setTransactions(sorted);
      } catch (err) {
        setError('Erro ao carregar transações.');
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(t => 
    t.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.contaOrigem?.usuarioEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.contaDestino?.usuarioEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 'DEPOSITO': return 'success';
      case 'SAQUE': return 'error';
      case 'TRANSFERENCIA_INTERNA': return 'info';
      case 'TRANSFERENCIA_EXTERNA': return 'warning';
      default: return 'default';
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>Histórico Geral de Transações</Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TextField
        fullWidth
        placeholder="Buscar por tipo ou email do usuário..."
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
              <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Tipo</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Valor</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Origem</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Destino</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Data</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTransactions.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{t.id}</TableCell>
                <TableCell>
                  <Chip 
                    label={t.tipo.replace('_', ' ')} 
                    color={getTipoColor(t.tipo)} 
                    size="small" 
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>R$ {t.valor?.toFixed(2)}</TableCell>
                <TableCell>
                    {t.contaOrigem ? (
                        <Box>
                            <Typography variant="body2">
                                {t.tipo === 'DEPOSITO' ? 'DINHEIRO' : t.contaOrigem.numeroConta}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">{t.tipo === 'DEPOSITO' ? '-' : t.contaOrigem.usuarioEmail}</Typography>
                        </Box>
                    ) : '-'}
                </TableCell>
                <TableCell>
                    {t.tipo === 'DEPOSITO' && t.contaOrigem ? (
                        <Box>
                            <Typography variant="body2">{t.contaOrigem.numeroConta}</Typography>
                            <Typography variant="caption" color="textSecondary">{t.contaOrigem.usuarioEmail}</Typography>
                        </Box>
                    ) : t.contaDestino ? (
                        <Box>
                            <Typography variant="body2">{t.contaDestino.numeroConta}</Typography>
                            <Typography variant="caption" color="textSecondary">{t.contaDestino.usuarioEmail}</Typography>
                        </Box>
                    ) : t.tipo === 'TRANSFERENCIA_EXTERNA' ? (
                        <Box>
                            <Typography variant="body2">{t.contaExterna}</Typography>
                            <Typography variant="caption" color="textSecondary">CPF: {t.cpfExterno}</Typography>
                        </Box>
                    ) : t.tipo === 'SAQUE' ? 'DINHEIRO' : '-'}
                </TableCell>
                <TableCell>{new Date(t.timestamp).toLocaleString('pt-BR')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default AdminTransactionsPage;
