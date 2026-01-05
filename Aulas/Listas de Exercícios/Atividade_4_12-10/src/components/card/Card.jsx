import "./Card.css";
import { useNavigate } from "react-router-dom";

export default function Card({ id, titulo, autor, preco, imagem }) {
  const navigate = useNavigate();

  return (
    <div className="card">
      <img src={imagem} alt={titulo} className="card-img" />

      <div className="card-info">
        <h2 className="card-title">{titulo}</h2>
        <p className="card-author">Autor: {autor}</p>
        <p className="card-price">R$ {preco.toFixed(2)}</p>

        <div className="card-buttons">
          <button
            className="btn comprar"
            onClick={() => navigate(`/livro/${id}`)}
          >
            Comprar Agora
          </button>
          <button className="btn-carrinho">Adicionar ao Carrinho</button>
          <button className="btn-desejo">Adicionar à Lista de Desejos</button>
        </div>
      </div>
    </div>
  );
}
