import Card from "../components/card/Card";
import livros from "../data/livrosMock";
import "../App.css";

export default function Home() {
  return (
    <div className="app-container">
      <section id="banner">
        <div className="banner-conteudo">
          <br />
          <br />
          <hr />
          <br />
          <h1 id="descricao">Bem-vindo à nossa Livraria Digital</h1>
          <p>Compre e explore novos livros online!</p>
          <p>
            Aqui você encontra uma vasta coleção de livros para todos os gostos,
            desde clássicos atemporais até os mais recentes lançamentos.
            Explore, descubra novas histórias e adquira suas próximas leituras
            com facilidade. Nossa livraria digital oferece uma ampla variedade
            de gêneros para todos os leitores!
          </p>
          <br />
          <hr />
        </div>
      </section>

      <section id="catalogo">
        <br />
        <h2 id="titulo" style={{ textAlign: "center" }}>
          Nosso Catálogo de Livros
        </h2>
        <br />

        <div id="filtros">
          <div className="campo-filtro">
            <input type="text" id="filtro-titulo" placeholder="Buscar por título" />
          </div>

          <div className="campo-filtro">
            <select id="filtro-genero">
              <option value="">Todos os Gêneros</option>
              <option value="fantasia">Fantasia</option>
              <option value="ficcao">Ficção</option>
              <option value="romance">Romance</option>
              <option value="terror">Terror</option>
              <option value="esporte">Esporte</option>
              <option value="academico">Acadêmico</option>
            </select>
          </div>

          <div className="campo-filtro">
            <select id="filtro">
              <option value="">Sem ordenação</option>
              <option value="ordem-alfabetica">A-Z</option>
              <option value="ordem-alfabetica-decrescente">Z-A</option>
              <option value="mais-vendidos">Mais Vendidos</option>
              <option value="menos-vendidos">Menos Vendidos</option>
              <option value="lancamentos">Lançamentos</option>
              <option value="melhor-avaliados">Mais Bem Avaliados</option>
            </select>
          </div>

          <div className="campo-filtro">
            <input type="text" id="filtro-colecao" placeholder="Buscar por coleção" />
          </div>

          <div className="campo-filtro">
            <input type="text" id="filtro-editora" placeholder="Buscar por editora" />
          </div>

          <div className="campo-filtro">
            <select id="formato" name="formato">
              <option value="">Todos os formatos</option>
              <option value="fisico">Físico</option>
              <option value="digital">Digital (PDF/ePub)</option>
            </select>
          </div>

          <button id="btn-filtrar">Pesquisar</button>
        </div>

        <div id="livros-container" className="cards-container">
          {livros.map((livro) => (
            <Card
              key={livro.id}
              id={livro.id}
              titulo={livro.titulo}
              autor={livro.autor}
              preco={livro.preco}
              imagem={livro.imagem}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
