import axios from "axios";

// Cria uma instância do axios com a URL base configurada
const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
});

// Interceptor de requisições para adicionar o token de autenticação no cabeçalho
api.interceptors.request.use((config) => {
  const usuario = localStorage.getItem("usuarioLogado");

  if (usuario) {
    const token = JSON.parse(usuario).token;

    // Verifica se o token existe e adiciona no cabeçalho da requisição
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Token enviado:", token);
    } else {
      console.error("Token não encontrado, o usuário pode não estar logado.");
    }
  } else {
    console.warn("Usuário não encontrado no localStorage. Token não será enviado.");
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor de respostas para tratar erros de autenticação
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Erro 401 - Não autorizado. Token pode estar expirado.");
      localStorage.removeItem("usuarioLogado");
      localStorage.removeItem("token");
      // window.location.href = "/"; //Não redirecione para mostrar o erro no formulário de login
    }

    return Promise.reject(error);
  }
);

export default api;
