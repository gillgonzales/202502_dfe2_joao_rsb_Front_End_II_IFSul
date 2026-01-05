import { useState, useEffect } from "react";
import api from "../../services/api";

export default function Formulario() {
  const [formData, setFormData] = useState({
    titulo: "",
    autor: "",
    genero: "",
    colecao: "",
    formato: "",
    quantidade: 0,
    numeroDePaginas: "",
    editora: "",
    sinopse: "",
    preco: "",
    lancamento: "",
    avaliacao: "",
    criado_por: "",
  });

  const [imagemFile, setImagemFile] = useState(null);
  const [preview, setPreview] = useState("");

  const validarImagem = (file) => {
    const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];
    const tamanhoMaximo = 2 * 1024 * 1024;

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

  // Carrega ID do usuário logado
  useEffect(() => {
    const usuario = localStorage.getItem("usuarioLogado");
    if (usuario) {
      const dados = JSON.parse(usuario);
      const id =
        dados.id ??
        dados.usuario?.id ??
        dados.user?.id ??
        null;

      if (id) {
        setFormData((prev) => ({ ...prev, criado_por: id }));
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const dados = new FormData();

      dados.append("titulo", formData.titulo);
      dados.append("autor", formData.autor);
      dados.append("genero", formData.genero);
      dados.append("colecao", formData.colecao || "");
      dados.append("formato", formData.formato);
      dados.append("quantidade", Number(formData.quantidade));
      dados.append(
        "numeroDePaginas", //Na api este campo esta com o nome numeroDePaginas (último commit)
        formData.numeroDePaginas
          ? Number(formData.numeroDePaginas)
          : ""
      );
      dados.append("editora", formData.editora || "");
      dados.append("sinopse", formData.sinopse || "");
      dados.append("preco", Number(formData.preco));
      dados.append("lancamento", formData.lancamento || "");
      dados.append("avaliacao", Number(formData.avaliacao) || 0);
      dados.append("criado_por", Number(formData.criado_por));

      if (imagemFile) {
        dados.append("imagem", imagemFile);
      }

      const resposta = await api.post("/livros", dados, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Livro cadastrado:", resposta.data);

      alert("Livro cadastrado com sucesso!");

      setFormData({
        titulo: "",
        autor: "",
        genero: "",
        colecao: "",
        formato: "",
        quantidade: 0,
        numeroDePaginas: "",
        editora: "",
        sinopse: "",
        preco: "",
        lancamento: "",
        avaliacao: "",
        criado_por: formData.criado_por,
      });

      setImagemFile(null);
      setPreview("");
      //TODO: Após cadastrar o livro redirecione para o painel com o novo livro adicionado.
    } catch (erro) {
      console.error(
        "Erro ao cadastrar livro:",
        erro.response?.data || erro
      );
      alert("Erro ao cadastrar o livro. Verifique os dados!");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] p-8 flex justify-center items-center">
      <div className="bg-[#1f2937] w-full max-w-3xl p-8 rounded-xl shadow-xl border border-[#1f2937] text-white">
        <h1 className="text-3xl font-bold text-[#3b82f6] text-center mb-6">
          Cadastrar Novo Livro no Catálogo
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* TÍTULO */}
          <div>
            <label className="font-semibold">Título:</label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              required
              className="w-full bg-[#0f172a] text-white border border-[#4A5A7C] rounded-lg p-2"
            />
          </div>

          {/* AUTOR */}
          <div>
            <label className="font-semibold">Autor(a):</label>
            <input
              type="text"
              name="autor"
              value={formData.autor}
              onChange={handleChange}
              required
              className="w-full bg-[#0f172a] text-white border border-[#4A5A7C] rounded-lg p-2"
            />
          </div>

          {/* GÊNERO */}
          <div>
            <label className="font-semibold">Gênero:</label>
            <select
              name="genero"
              value={formData.genero}
              onChange={handleChange}
              required
              className="w-full bg-[#0f172a] text-white border border-[#4A5A7C] rounded-lg p-2"
            >
              <option value=""></option>
              <option value="ficcao">Ficção</option>
              <option value="romance">Romance</option>
              <option value="fantasia">Fantasia</option>
              <option value="terror">Terror</option>
              <option value="esporte">Esporte</option>
              <option value="economia">Acadêmico</option>
            </select>
          </div>

          {/* COLEÇÃO */}
          <div>
            <label className="font-semibold">Coleção:</label>
            <input
              type="text"
              name="colecao"
              value={formData.colecao}
              onChange={handleChange}
              className="w-full bg-[#0f172a] text-white border border-[#4A5A7C] rounded-lg p-2"
            />
          </div>

          {/* FORMATO */}
          <div>
            <label className="font-semibold">Formato:</label>
            <select
              name="formato"
              value={formData.formato}
              onChange={handleChange}
              required
              className="w-full bg-[#0f172a] text-white border border-[#4A5A7C] rounded-lg p-2"
            >
              <option value="">Selecione</option>
              <option value="fisico">Físico</option>
              <option value="digital">Digital</option>
            </select>
          </div>

          {/* QUANTIDADE */}
          <div>
            <label className="font-semibold">Quantidade em Estoque:</label>
            <input
              type="number"
              name="quantidade"
              value={formData.quantidade}
              min="0"
              onChange={handleChange}
              required
              className="w-full bg-[#0f172a] text-white border border-[#4A5A7C] rounded-lg p-2"
            />
          </div>

          {/* PÁGINAS */}
          <div>
            <label className="font-semibold">Número de Páginas:</label>
            <input
              type="number"
              name="numeroDePaginas"
              value={formData.numeroDePaginas}
              onChange={handleChange}
              className="w-full bg-[#0f172a] text-white border border-[#4A5A7C] rounded-lg p-2"
            />
          </div>

          {/* EDITORA */}
          <div>
            <label className="font-semibold">Editora:</label>
            <input
              type="text"
              name="editora"
              value={formData.editora}
              onChange={handleChange}
              className="w-full bg-[#0f172a] text-white border border-[#4A5A7C] rounded-lg p-2"
            />
          </div>

          {/* IMAGEM */}
          <div>
            <label className="font-semibold">Imagem (capa do livro):</label>
            <input
              type="file"
              accept="image/*"
              className="w-full bg-[#0f172a] border rounded-lg p-2"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file || !validarImagem(file)) return;

                setImagemFile(file);
                setPreview(URL.createObjectURL(file));
              }}
            />
            {preview && (
              <img src={preview} className="w-32 mt-2 rounded-lg" />
            )}
          </div>

          {/* SINOPSE */}
          <div>
            <label className="font-semibold">Sinopse:</label>
            <textarea
              name="sinopse"
              rows="4"
              value={formData.sinopse}
              onChange={handleChange}
              className="w-full bg-[#0f172a] text-white border border-[#4A5A7C] rounded-lg p-2"
            />
          </div>

          {/* PREÇO */}
          <div>
            <label className="font-semibold">Preço (R$):</label>
            <input
              type="number"
              name="preco"
              step="0.01"
              value={formData.preco}
              onChange={handleChange}
              required
              className="w-full bg-[#0f172a] text-white border border-[#4A5A7C] rounded-lg p-2"
            />
          </div>

          {/* LANÇAMENTO */}
          <div>
            <label className="font-semibold">Data de Lançamento:</label>
            <input
              type="date"
              name="lancamento"
              value={formData.lancamento}
              onChange={handleChange}
              className="w-full bg-[#0f172a] text-white border border-[#4A5A7C] rounded-lg p-2"
            />
          </div>

          {/* AVALIAÇÃO */}
          <div>
            <label className="font-semibold">Avaliação (0 a 5):</label>
            <input
              type="number"
              name="avaliacao"
              min="0"
              max="5"
              step="0.1"
              value={formData.avaliacao}
              onChange={handleChange}
              className="w-full bg-[#0f172a] text-white border border-[#4A5A7C] rounded-lg p-2"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#2563eb] text-white p-3 rounded-lg font-semibold mt-4"
          >
            Cadastrar Livro
          </button>
        </form>
      </div>
    </div>
  );
}
