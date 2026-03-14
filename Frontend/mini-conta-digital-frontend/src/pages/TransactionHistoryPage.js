import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Container, Box, Typography, Alert, CircularProgress, Button,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper 
} from '@mui/material';
import api from '../services/api';
import useAuthStore from '../store/authStore';

function TransactionHistoryPage() {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [account, setAccount] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTransactionHistory = async () => {
            if (!user || !user.id) {
                setError('User ID not found.');
                setLoading(false);
                return;
            }
            try {
                // First, fetch account details to get contaId using corrected endpoint
                const accountResponse = await api.get(`/contas/usuario/${user.id}`); 
                const userAccount = accountResponse.data;
                setAccount(userAccount);

                if (userAccount?.id) {
                    const transactionResponse = await api.get(`/transacoes/conta/${userAccount.id}`);
                    setTransactions(transactionResponse.data);
                } else {
                    setError('Nenhuma conta encontrada para o usuário.');
                }
            } catch (err) {
                console.error('Failed to fetch transaction history:', err);
                setError(err.response?.data?.message || 'Erro ao carregar histórico de transações.');
            } finally {
                setLoading(false);
            }
        };

        fetchTransactionHistory();
    }, [user]);

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
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
        <Container component="main" maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Typography component="h1" variant="h4" gutterBottom>
                    Histórico de Transações
                </Typography>

                {account && (
                    <Typography variant="h6" gutterBottom>
                        Conta: {account.id} (Saldo Atual: R$ {account.saldo?.toFixed(2)})
                    </Typography>
                )}

                {transactions.length === 0 ? (
                    <Alert severity="info">Nenhuma transação encontrada para esta conta.</Alert>
                ) : (
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="transaction history table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tipo</TableCell>
                                    <TableCell align="right">Valor</TableCell>
                                    <TableCell>Conta Origem</TableCell>
                                    <TableCell>Conta Destino</TableCell>
                                    <TableCell>Timestamp</TableCell>
                                    <TableCell align="right">Saldo Após Op.</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {transactions.map((transaction) => (
                                    <TableRow
                                        key={transaction.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {transaction.tipo}
                                        </TableCell>
                                        <TableCell align="right">R$ {transaction.valor?.toFixed(2)}</TableCell>
                                        <TableCell>
                                            {transaction.tipo === 'DEPOSITO' ? 'DINHEIRO' : (transaction.contaOrigem?.id || '-')}
                                        </TableCell>
                                        <TableCell>
                                            {transaction.tipo === 'DEPOSITO' ? (transaction.contaOrigem?.id || '-') : 
                                             transaction.tipo === 'SAQUE' ? 'DINHEIRO' :
                                             transaction.tipo === 'TRANSFERENCIA_EXTERNA' ? transaction.contaExterna :
                                             (transaction.contaDestino?.id || '-')}
                                        </TableCell>
                                        <TableCell>{new Date(transaction.timestamp).toLocaleString('pt-BR')}</TableCell>
                                        <TableCell align="right">R$ {transaction.saldoAposOperacao?.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
                <Button
                    variant="contained"
                    sx={{ mt: 3 }}
                    onClick={() => navigate('/dashboard')}
                >
                    Voltar para o Dashboard
                </Button>
            </Box>
        </Container>
    );
}

export default TransactionHistoryPage;
