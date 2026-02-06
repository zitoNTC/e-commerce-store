"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { createProduct, deleteProduct, listProducts, me, updateProduct } from "@/lib/api";
import { Product } from "@/lib/types";

type EditState = {
  name: string;
  description: string;
  price: string;
  image: File | null;
};

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [editState, setEditState] = useState<Record<number, EditState>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState<EditState>({
    name: "",
    description: "",
    price: "",
    image: null,
  });

  const loadProducts = async () => {
    const data = await listProducts();
    setProducts(data);
    const nextEdit: Record<number, EditState> = {};
    data.forEach((product) => {
      nextEdit[product.id] = {
        name: product.name,
        description: product.description,
        price: product.price,
        image: null,
      };
    });
    setEditState(nextEdit);
  };

  useEffect(() => {
    const init = async () => {
      try {
        const user = await me();
        if (!user.is_staff) {
          router.push("/");
          return;
        }
        await loadProducts();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar.");
        router.push("/login");
      }
    };
    init();
  }, [router]);

  const handleCreate = async () => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("description", newProduct.description);
      formData.append("price", newProduct.price);
      if (newProduct.image) {
        formData.append("image", newProduct.image);
      }
      await createProduct(formData);
      setNewProduct({ name: "", description: "", price: "", image: null });
      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar produto.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (productId: number) => {
    setLoading(true);
    setError(null);
    try {
      const values = editState[productId];
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("price", values.price);
      if (values.image) {
        formData.append("image", values.image);
      }
      await updateProduct(productId, formData);
      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteProduct(productId);
      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao remover.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="stack">
      <h1>Admin - Produtos</h1>
      {error ? <p>{error}</p> : null}
      <div className="card stack">
        <strong>Novo produto</strong>
        <input
          className="input"
          placeholder="Nome"
          value={newProduct.name}
          onChange={(event) =>
            setNewProduct((prev) => ({ ...prev, name: event.target.value }))
          }
        />
        <textarea
          className="input"
          placeholder="Descrição"
          value={newProduct.description}
          onChange={(event) =>
            setNewProduct((prev) => ({
              ...prev,
              description: event.target.value,
            }))
          }
        />
        <input
          className="input"
          placeholder="Preço"
          value={newProduct.price}
          onChange={(event) =>
            setNewProduct((prev) => ({ ...prev, price: event.target.value }))
          }
        />
        <input
          className="input"
          type="file"
          onChange={(event) =>
            setNewProduct((prev) => ({
              ...prev,
              image: event.target.files?.[0] || null,
            }))
          }
        />
        <button className="button" onClick={handleCreate} disabled={loading}>
          Criar produto
        </button>
      </div>
      <div className="stack">
        {products.map((product) => {
          const edit = editState[product.id];
          if (!edit) return null;
          return (
            <div key={product.id} className="card stack">
              <strong>Produto #{product.id}</strong>
              <input
                className="input"
                value={edit.name}
                onChange={(event) =>
                  setEditState((prev) => ({
                    ...prev,
                    [product.id]: { ...edit, name: event.target.value },
                  }))
                }
              />
              <textarea
                className="input"
                value={edit.description}
                onChange={(event) =>
                  setEditState((prev) => ({
                    ...prev,
                    [product.id]: {
                      ...edit,
                      description: event.target.value,
                    },
                  }))
                }
              />
              <input
                className="input"
                value={edit.price}
                onChange={(event) =>
                  setEditState((prev) => ({
                    ...prev,
                    [product.id]: { ...edit, price: event.target.value },
                  }))
                }
              />
              <input
                className="input"
                type="file"
                onChange={(event) =>
                  setEditState((prev) => ({
                    ...prev,
                    [product.id]: {
                      ...edit,
                      image: event.target.files?.[0] || null,
                    },
                  }))
                }
              />
              <div className="stack">
                <button
                  className="button"
                  onClick={() => handleUpdate(product.id)}
                  disabled={loading}
                >
                  Salvar
                </button>
                <button
                  className="button danger"
                  onClick={() => handleDelete(product.id)}
                  disabled={loading}
                >
                  Remover
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
