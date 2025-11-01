import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8000/products";

function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    available: true,
  });
  const [loading, setLoading] = useState(false);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const endpoint = showAvailableOnly ? `${API_URL}/available` : API_URL;
      const response = await fetch(endpoint);
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [showAvailableOnly]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return alert("Preencha nome e preço!");

    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          available: Boolean(form.available),
        }),
      });
      setForm({ name: "", description: "", price: "", available: true });
      fetchProducts();
    } catch (err) {
      console.error("Erro ao adicionar produto:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja realmente remover este produto?")) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchProducts();
    } catch (err) {
      console.error("Erro ao deletar produto:", err);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Product Manager</h1>

      <form onSubmit={handleSubmit} className="form">
        <input
          className="input"
          type="text"
          placeholder="Nome do produto"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="input"
          type="text"
          placeholder="Descrição"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          className="input"
          type="number"
          placeholder="Preço"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={form.available}
            onChange={(e) =>
              setForm({ ...form, available: e.target.checked })
            }
          />
          Disponível
        </label>

        <button type="submit" className="btn-primary">
          Adicionar
        </button>
      </form>

      <div className="controls">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={showAvailableOnly}
            onChange={(e) => setShowAvailableOnly(e.target.checked)}
          />
          Mostrar apenas disponíveis
        </label>
      </div>

      <h2 className="subtitle">Produtos</h2>

      {loading ? (
        <p>Carregando...</p>
      ) : products.length === 0 ? (
        <p>Nenhum produto encontrado.</p>
      ) : (
        <ul className="products-list">
          {products.map((prod) => (
            <li key={prod.id} className="product-item">
              <div className="product-info">
                <div className="product-top">
                  <strong className="product-name">{prod.name}</strong>
                  <span className="product-price">R${prod.price}</span>
                </div>
                <small className="product-desc">{prod.description}</small>
                <div>
                  <span
                    className={
                      prod.available ? "badge available" : "badge unavailable"
                    }
                  >
                    {prod.available ? "Disponível" : "Indisponível"}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleDelete(prod.id)}
                className="delete-btn"
                title="Remover produto"
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
