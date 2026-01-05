import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function EditarLivros() { //Erros na branch avaliada.
  const [livros, setLivros] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /*
    |--------------------------------------------------------------------------
    | Validação de imagem (formato e tamanho)
    |--------------------------------------------------------------------------
  */
  const validarImagem = (file) => {
    const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];
    const tamanhoMaximo = 2 * 1024 * 1024; // 2MB

    if (!tiposPermitidos.includes(file.type)) {
      alert("Formato inválido. Use JPG, PNG ou WEBP.");
      return false;
    }

    if (file.size > tamanhoMaximo) {
      alert("Imagem muito grande. Máx. 2MB.");
      return false;
    }

    return true;
  };

  /*
    |--------------------------------------------------------------------------
    | Carregar livros do dono da livraria
    |--------------------------------------------------------------------------
  */
  useEffect(() => {
    const carregarLivros = async () => {
      try {
        const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

        if (!usuarioLogado) {
          alert("É necessário fazer login.");
          navigate("/");
          return;
        }

        const donoId = usuarioLogado.id;
        const resposta = await api.get(`/livros/dono/${donoId}`);

        const livrosTratados = resposta.data.map((livro) => ({
          ...livro,
          imagem: livro.imagem ?? "",
          novaImagem: null,
          previewImagem: null,
          sinopse: livro.sinopse ?? "",
          colecao: livro.colecao ?? "",
          editora: livro.editora ?? "",
          avaliacao: livro.avaliacao ?? 0,
          numeroDePaginas: livro.numeroDePaginas ?? "",
        }));

        setLivros(livrosTratados);
      } catch (erro) {
        console.error("Erro ao carregar livros:", erro);
        alert("Erro ao carregar livros.");
      } finally {
        setLoading(false);
      }
    };

    carregarLivros();
  }, [navigate]);

  /*
    |--------------------------------------------------------------------------
    | Atualizar campo localmente
    |--------------------------------------------------------------------------
  */
  const handleChange = (index, campo, valor) => {
    setLivros((prev) => {
      const copia = [...prev];
      copia[index] = { ...copia[index], [campo]: valor };
      return copia;
    });
  };

  /*
    |--------------------------------------------------------------------------
    | Selecionar nova imagem (validação + preview)
    |--------------------------------------------------------------------------
  */
  const handleImagemChange = (index, file) => {
    if (!file) return;

    if (!validarImagem(file)) return;

    const previewUrl = URL.createObjectURL(file);

    setLivros((prev) => {
      const copia = [...prev];
      copia[index] = {
        ...copia[index],
        novaImagem: file,
        previewImagem: previewUrl,
      };
      return copia;
    });
  };

  /*
    |--------------------------------------------------------------------------
    | Enviar atualização para API (COM IMAGEM)
    |--------------------------------------------------------------------------
  */
  const handleSubmit = async (e, livro) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("titulo", livro.titulo);
    formData.append("autor", livro.autor);
    formData.append("genero", livro.genero);
    formData.append("colecao", livro.colecao || "");
    formData.append("formato", livro.formato);
    formData.append("quantidade", Number(livro.quantidade));
    formData.append(
      "numero_paginas",
      livro.numeroDePaginas ? Number(livro.numeroDePaginas) : ""
    );
    formData.append("editora", livro.editora || "");
    formData.append("sinopse", livro.sinopse || "");
    formData.append("preco", Number(livro.preco));
    formData.append("lancamento", livro.lancamento || "");
    formData.append("avaliacao", Number(livro.avaliacao));

    if (livro.novaImagem) {
      formData.append("imagem", livro.novaImagem);
    }

    try {
      await api.post(`/livros/${livro.id}?_method=PUT`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Livro atualizado com sucesso!");
    } catch (erro) {
      console.error("Erro ao atualizar livro:", erro.response?.data || erro);
      alert("Erro ao atualizar livro.");
    }
  };

  /*
    |--------------------------------------------------------------------------
    | Carregar livros
    |--------------------------------------------------------------------------
  */
  if (loading) {
    return (
      <div className="text-center text-white mt-10 text-xl">
        Carregando livros...
      </div>
    );
  }

  /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
  */
  return (
    <div className="bg-black min-h-screen text-white">
      <div className="max-w-6xl mx-auto p-6 mt-10">
        <h1 className="text-4xl font-bold text-center text-white mb-10">
          Editar Livros Cadastrados
        </h1>

        {livros.length === 0 && (
          <p className="text-center text-white text-xl">
            Nenhum livro encontrado.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {livros.map((livro, index) => (
            <form
              key={livro.id}
              onSubmit={(e) => handleSubmit(e, livro)}
              className="bg-gray-900 text-white p-6 rounded-xl shadow-lg border border-gray-700"
            >
              {/* Capa */}
              <div className="text-center mb-4">
                {livro.previewImagem ? (
                  <img
                    src={livro.previewImagem}
                    alt="Preview da nova capa"
                    className="w-40 mx-auto rounded-lg shadow-md"
                  />
                ) : livro.imagem ? (
                  <img
                    src={`http://localhost:8000${livro.imagem}`}
                    alt="Capa do Livro"
                    className="w-40 mx-auto rounded-lg shadow-md"
                  />
                ) : (
                  <div className="w-40 h-56 mx-auto flex items-center justify-center bg-gray-800 rounded-lg text-gray-400">
                    Sem imagem
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <label className="font-semibold">Nova Imagem:</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700"
                  onChange={(e) =>
                    handleImagemChange(index, e.target.files[0])
                  }
                />

                <label className="font-semibold">Título:</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700"
                  value={livro.titulo}
                  onChange={(e) =>
                    handleChange(index, "titulo", e.target.value)
                  }
                />

                <label className="font-semibold">Autor:</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700"
                  value={livro.autor}
                  onChange={(e) =>
                    handleChange(index, "autor", e.target.value)
                  }
                />

                <label className="font-semibold">Gênero:</label>
                <select
                  className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700"
                  value={livro.genero}
                  onChange={(e) =>
                    handleChange(index, "genero", e.target.value)
                  }
                >
                  <option value="fantasia">Fantasia</option>
                  <option value="ficcao">Ficção</option>
                  <option value="romance">Romance</option>
                  <option value="terror">Terror</option>
                  <option value="esporte">Esporte</option>
                  <option value="academico">Acadêmico</option>
                </select>

                <label className="font-semibold">Preço (R$):</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700"
                  value={livro.preco}
                  onChange={(e) =>
                    handleChange(index, "preco", e.target.value)
                  }
                />

                <label className="font-semibold">Quantidade:</label>
                <input
                  type="number"
                  required
                  className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700"
                  value={livro.quantidade}
                  onChange={(e) =>
                    handleChange(index, "quantidade", e.target.value)
                  }
                />

                <label className="font-semibold">Formato:</label>
                <select
                  className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700"
                  value={livro.formato}
                  onChange={(e) =>
                    handleChange(index, "formato", e.target.value)
                  }
                >
                  <option value="fisico">Físico</option>
                  <option value="digital">Digital</option>
                </select>

                <label className="font-semibold">Sinopse:</label>
                <textarea
                  rows="3"
                  className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700"
                  value={livro.sinopse}
                  onChange={(e) =>
                    handleChange(index, "sinopse", e.target.value)
                  }
                />

                <label className="font-semibold">Editora:</label>
                <input
                  type="text"
                  className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700"
                  value={livro.editora}
                  onChange={(e) =>
                    handleChange(index, "editora", e.target.value)
                  }
                />

                <label className="font-semibold">Coleção:</label>
                <input
                  type="text"
                  className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700"
                  value={livro.colecao}
                  onChange={(e) =>
                    handleChange(index, "colecao", e.target.value)
                  }
                />

                <label className="font-semibold">Nº de Páginas:</label>
                <input
                  type="number"
                  className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700"
                  value={livro.numeroDePaginas}
                  onChange={(e) =>
                    handleChange(index, "numeroDePaginas", e.target.value)
                  }
                />

                <label className="font-semibold">Avaliação:</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700"
                  value={livro.avaliacao}
                  onChange={(e) =>
                    handleChange(index, "avaliacao", e.target.value)
                  }
                />

                <label className="font-semibold">Lançamento:</label>
                <input
                  type="date"
                  className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700"
                  value={livro.lancamento || ""}
                  onChange={(e) =>
                    handleChange(index, "lancamento", e.target.value)
                  }
                />
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold p-3 rounded-lg mt-6 transition"
              >
                Atualizar Livro
              </button>
            </form>
          ))}
        </div>
      </div>
    </div>
  );
}
