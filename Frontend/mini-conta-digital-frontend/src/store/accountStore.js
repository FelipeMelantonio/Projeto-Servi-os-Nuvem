import { create } from 'zustand';
import api from '../services/api';

const useAccountStore = create((set, get) => ({
  account: null,
  loading: false,
  error: null,

  fetchAccount: async (userId) => {
    if (!userId) return;
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/contas/usuario/${userId}`);
      set({ account: response.data, loading: false });
    } catch (err) {
      // Se for 404, não é um "erro" de sistema, apenas significa que o usuário não tem conta ainda
      if (err.response?.status === 404) {
        set({ account: null, loading: false });
      } else {
        set({ error: err.response?.data?.message || 'Erro ao carregar conta', loading: false });
      }
    }
  },

  clearAccount: () => set({ account: null, error: null })
}));

export default useAccountStore;
