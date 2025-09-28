import axios from 'axios';

// Lê o endereço da API do nosso "cofre" .env.local
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Cria uma instância do Axios já configurada com o endereço base
const api = axios.create({
  baseURL: apiUrl,
});

// Exporta a instância para ser usada em outras partes do projeto
export default api;