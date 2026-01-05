import "./Card.css";
import { useNavigate } from "react-router-dom";

export default function Card({ livro }) {
  const navigate = useNavigate();
  const { id, titulo, autor, preco, imagem } = livro;

  const adicionarAoCarrinho = () => {
    const usuarioLogado = localStorage.getItem("usuarioLogado");
    if (!usuarioLogado) {
      alert("Você precisa estar logado para adicionar ao carrinho.");
      navigate("/login");
      return;
    }

    const carrinhoAtual = JSON.parse(localStorage.getItem("carrinho")) || [];
    const jaExiste = carrinhoAtual.find((item) => item.id === id);

    if (jaExiste) {
      alert("Este livro já está no carrinho!");
    } else {
      carrinhoAtual.push({ ...livro, quantidadeSelecionada: 1 });
      localStorage.setItem("carrinho", JSON.stringify(carrinhoAtual));
      alert("Livro adicionado ao carrinho!");
    }
  };

  return (
    <div className="card">
      <img src={imagem} alt={titulo} className="card-img" />

      <div className="card-info">
        <h2 className="card-title">{titulo}</h2>
        <p className="card-author">Autor: {autor}</p>
        <p className="card-price">R$ {preco.toFixed(2)}</p>

        <div className="card-buttons">
          <button className="btn detalhes" onClick={() => navigate(`/livro/${id}`)}>
            Ver Detalhes
          </button>
        </div>
      </div>
    </div>
  );
}
