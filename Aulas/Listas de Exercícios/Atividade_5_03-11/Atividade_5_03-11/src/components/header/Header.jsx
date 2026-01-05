import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import carrinhoIcone from "/src/assets/imagens/iconecarrinho.gif";
import estanteIcone from "/src/assets/imagens/iconeestante.png";
import "./Header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const navigate = useNavigate();

  // Verifica se o usuário está logado ao carregar o componente
  useEffect(() => {
    const usuario = localStorage.getItem("usuarioLogado");
    setUsuarioLogado(usuario ? JSON.parse(usuario) : null);
  }, []);

  // Alternar menu mobile
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Verifica login antes de navegar
  const verificarLogin = (acao, destino) => {
    if (!usuarioLogado) {
      alert(`Você precisa estar logado para ${acao}.`);
      navigate("/login");
    } else {
      navigate(destino);
    }
    setMenuOpen(false);
  };

  // Função de logout
  const sair = () => {
    if (window.confirm("Deseja realmente sair da conta?")) {
      localStorage.removeItem("usuarioLogado");
      setUsuarioLogado(null);
      alert("Logout realizado com sucesso!");
      navigate("/");
    }
  };

  return (
    <header className="header">
      <nav className="navbar">
        {/* Logo principal */}
        <a href="/" className="logo">
          <em>
            <u>BookVerse</u>
          </em>
        </a>

        {/* Botão Hamburger */}
        <button
          className={`menu-toggle ${menuOpen ? "open" : ""}`}
          aria-label={menuOpen ? "Fechar Menu" : "Abrir Menu"}
          onClick={toggleMenu}
        >
          &#9776;
        </button>

        {/* Menu principal */}
        <ul className={`menu ${menuOpen ? "menu-open" : ""}`}>
          {/* Perfil ou login */}
          {!usuarioLogado ? (
            <li
              className="menu-item"
              onClick={() => {
                navigate("/login");
                setMenuOpen(false);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && navigate("/login")}
            >
              <span className="auth-icon">👤 - Perfil</span>
            </li>
          ) : (
            <li className="menu-item usuario-logado">
            </li>
          )}

          {/* Carrinho */}
          <li className="menu-item carrinho-container">
            <div
              className="icon-wrapper"
              onClick={() => verificarLogin("acessar o carrinho", "/carrinho")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                verificarLogin("acessar o carrinho", "/carrinho")
              }
            >
              <img src={carrinhoIcone} alt="Carrinho" width="30" />
              <span> - Carrinho</span>
            </div>
          </li>

          {/* Estante */}
          <li className="menu-item estante-container">
            <div
              className="icon-wrapper"
              onClick={() => verificarLogin("acessar a estante", "/estante")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                verificarLogin("acessar a estante", "/estante")
              }
            >
              <img src={estanteIcone} alt="Estante" width="30" />
              <span> - Estante</span>
            </div>
          </li>

          {/* Botão de logout (só aparece se logado) */}
          {usuarioLogado && (
            <li className="menu-item sair-container">
              <div
                className="icon-wrapper"
                onClick={sair}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && sair()}
              >
                🚪 <span> - Sair</span>
              </div>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
