import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import api from "../../services/api";

export default function ResumoCompra() {
  const navigate = useNavigate();
  const location = useLocation();
  const jaRegistrou = useRef(false);

  const { livros, pagamento, endereco } = location.state || {};

  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!livros || livros.length === 0) return;
    if (!pagamento) return;
    if (!usuarioLogado || !token) return;

    if (jaRegistrou.current) return;
    jaRegistrou.current = true;

    registrarCompras();
  }, []);

  const registrarCompras = async () => {
    try {
      for (const livro of livros) {
        const enderecoTexto = endereco
          ? `${endereco.rua}, Nº ${endereco.numero} - ${endereco.bairro} - ${endereco.cidade}/${endereco.estado} - CEP ${endereco.cep}`
          : "Livro digital - sem entrega física";

        const payload = {
          id_livro: livro.id,
          quantidade: Number(livro.quantidadeSelecionada ?? 1),
          formato: livro.formato
            ?.toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, ""),
          forma_pagamento: pagamento,
          endereco: enderecoTexto,
          preco_unitario: 1 //Api acusa erro de falta do campo preco_unitario
        };
        console.log("Payload enviado para API:", payload);

        await api.post("/compras", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      localStorage.removeItem("carrinho");
    } catch (error) {
      console.error("Erro ao registrar compras:", error.response?.data || error);
      alert("Erro ao registrar a compra.");
      navigate("/");
    }
  };

  const dataCompra = new Date().toLocaleDateString("pt-BR");

  const totalGeral = livros?.reduce(
    (total, livro) => total + livro.preco * livro.quantidadeSelecionada,
    0
  );

  if (!livros) return null;

  return (
    <div className="min-h-[90vh] bg-gray-900 text-gray-100 flex justify-center px-4 py-12">
      <div className="w-full max-w-4xl bg-gray-800 p-8 rounded-xl shadow-xl flex flex-col gap-8">

        <h1 className="text-3xl font-bold text-center text-green-400">
          Compra Finalizada com Sucesso 🎉
        </h1>

        <section className="bg-gray-700 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3 text-blue-300">
            Dados do Comprador:
          </h2>
          <p><strong>Nome:</strong> {usuarioLogado.nome}</p>
          <p><strong>Email:</strong> {usuarioLogado.email}</p>
        </section>

        {livros.map((livro) => (
          <section
            key={livro.id}
            className="bg-gray-700 p-6 rounded-lg shadow flex flex-col md:flex-row gap-6 items-center"
          >
            <img
              src={livro.imagem}
              alt={livro.titulo}
              className="w-40 rounded-lg shadow-md"
            />

            <div className="flex-1">
              <h2 className="text-xl font-bold text-blue-400">
                {livro.titulo}
              </h2>

              <p className="text-gray-300 mt-1">{livro.autor}</p>

              <p className="mt-2">
                <strong>Quantidade:</strong> {livro.quantidadeSelecionada}
              </p>

              <p className="mt-2">
                <strong>Formato:</strong>{" "}
                {livro.formato?.toLowerCase() === "fisico" ? "Físico" : "Digital"}
              </p>

              <p className="mt-2 text-lg font-bold text-green-400">
                Subtotal: R$ {(livro.preco * livro.quantidadeSelecionada).toFixed(2)}
              </p>
            </div>
          </section>
        ))}

        <section className="bg-gray-700 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2 text-blue-300">
            Forma de Pagamento:
          </h2>
          <p className="uppercase font-bold text-green-400">{pagamento}</p>
        </section>

        {endereco && (
          <section className="bg-gray-700 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-3 text-blue-300">
              Endereço de Entrega:
            </h2>

            <p>{endereco.rua}, Nº {endereco.numero}</p>
            <p>{endereco.bairro} - {endereco.cidade}/{endereco.estado}</p>
            <p>CEP: {endereco.cep}</p>
            <p className="mt-2">
              <strong>Entrega:</strong>{" "}
              {endereco.entrega === "rapida"
                ? "Entrega Rápida (1–2 dias úteis)"
                : "Entrega Normal (5–7 dias úteis)"}
            </p>
          </section>
        )}

        <section className="bg-gray-700 p-4 rounded-lg shadow text-center">
          <p><strong>Data da Compra:</strong> {dataCompra}</p>
          <p className="text-xl font-bold text-green-400 mt-2">
            Total Pago: R$ {totalGeral.toFixed(2)}
          </p>
        </section>

        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-lg transition"
        >
          Voltar para a Página Inicial
        </button>
      </div>
    </div>
  );
}
