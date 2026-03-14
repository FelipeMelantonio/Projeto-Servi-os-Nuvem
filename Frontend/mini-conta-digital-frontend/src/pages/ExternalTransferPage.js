import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Container, Box, Typography, TextField, Button, Alert, 
    CircularProgress, Card, CardContent, Autocomplete
} from '@mui/material';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import useAccountStore from '../store/accountStore';

function ExternalTransferPage() {
    const { user } = useAuthStore();
    const { fetchAccount } = useAccountStore();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        contaOrigemId: '', // Will be set from user's account
        valor: '',
        banco: null, // This will hold the bank object
        agencia: '',
        conta: '',
        cpfDestino: ''
    });
    const [account, setAccount] = useState(null);
    const [banks, setBanks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (!user || !user.id) {
                setError('User ID not found.');
                setLoading(false);
                return;
            }
            try {
                // Fetch user account details
                const accountResponse = await api.get(`/contas/usuario/${user.id}`); 
                setAccount(accountResponse.data);
                setFormData(prev => ({ ...prev, contaOrigemId: accountResponse.data.id }));

                // Fetch banks
                const banksResponse = await api.get('/bancos');
                setBanks(banksResponse.data);

            } catch (err) {
                console.error('Failed to fetch data:', err);
                setError(err.response?.data?.message || 'Failed to load account or bank details.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

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

        if (!account?.id) {
            setError('Conta de origem não encontrada.');
            return;
        }
        const amount = parseFloat(formData.valor);
        if (amount <= 0 || isNaN(amount)) {
            setError('O valor da transferência deve ser maior que zero.');
            return;
        }
        if (account.saldo < amount) {
            setError('Saldo insuficiente para realizar a transferência.');
            return;
        }
        if (!formData.banco || !formData.agencia || !formData.conta || !formData.cpfDestino) {
            setError('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        setSubmitting(true);
        try {
            await api.post('/transacoes/transferencia-externa', {
                contaOrigemId: formData.contaOrigemId,
                valor: amount,
                banco: parseInt(formData.banco.code),
                agencia: formData.agencia,
                conta: formData.conta,
                cpfDestino: formData.cpfDestino
            });

            if (user?.id) fetchAccount(user.id);

            setSuccess('Transferência externa realizada com sucesso!');
            setFormData(prev => ({
                ...prev,
                valor: '',
                banco: null,
                agencia: '',
                conta: '',
                cpfDestino: ''
            }));
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) {
            console.error('External transfer error:', err);
            setError(err.response?.data?.message || 'Erro ao realizar transferência externa.');
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
                <Typography component="h1" variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                    Transferência Externa
                </Typography>

                {account && (
                    <Card variant="outlined" sx={{ width: '100%', mb: 3, bgcolor: '#white' }}>
                        <CardContent>
                            <Typography variant="h6" color="primary">Sua Conta de Origem</Typography>
                            <Typography variant="body1"><strong>Número da Conta:</strong> {account.numeroConta}</Typography>
                            <Typography variant="body1"><strong>Saldo Disponível:</strong> R$ {account.saldo?.toFixed(2)}</Typography>
                        </CardContent>
                    </Card>
                )}

                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="valor"
                        label="Valor da Transferência"
                        name="valor"
                        type="number"
                        inputProps={{ step: "0.01" }}
                        value={formData.valor}
                        onChange={handleChange}
                        autoFocus
                    />
                    
                    <Autocomplete
                        id="banco-select"
                        options={banks}
                        getOptionLabel={(option) => `${option.code} - ${option.name}`}
                        value={formData.banco}
                        onChange={(event, newValue) => {
                            setFormData({ ...formData, banco: newValue });
                        }}
                        renderInput={(params) => (
                            <TextField 
                                {...params} 
                                label="Consultar Bancos" 
                                margin="normal" 
                                required 
                                placeholder="Digite o nome ou código do banco..."
                            />
                        )}
                        noOptionsText="Nenhum banco encontrado"
                    />

                    {formData.banco && (
                        <Alert severity="info" sx={{ mt: 1, mb: 1 }}>
                            <strong>Banco Selecionado:</strong> {formData.banco.name} ({formData.banco.fullName || formData.banco.name})<br/>
                            <strong>ISPB:</strong> {formData.banco.ispb}
                        </Alert>
                    )}

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="agencia"
                        label="Agência Destino"
                        name="agencia"
                        value={formData.agencia}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="conta"
                        label="Conta Destino"
                        name="conta"
                        value={formData.conta}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="cpfDestino"
                        label="CPF do Favorecido"
                        name="cpfDestino"
                        value={formData.cpfDestino}
                        onChange={handleChange}
                        inputProps={{ maxLength: 11 }}
                        placeholder="Somente números"
                    />
                    
                    {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, height: 50, fontWeight: 'bold' }}
                        disabled={submitting}
                    >
                        {submitting ? <CircularProgress size={24} color="inherit" /> : 'Confirmar Transferência'}
                    </Button>
                    <Button
                        fullWidth
                        variant="text"
                        onClick={() => navigate('/dashboard')}
                    >
                        Cancelar e Voltar
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default ExternalTransferPage;
