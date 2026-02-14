"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  createProduct,
  createTag,
  deleteProduct,
  deleteTag,
  listProducts,
  listTags,
  me,
  updateProduct,
} from "@/lib/api";
import { Product, Tag } from "@/lib/types";

type EditState = {
  name: string;
  description: string;
  price: string;
  tag_ids: number[];
  image: File | null;
};

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [editState, setEditState] = useState<Record<number, EditState>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState("");
  const [newTagToAdd, setNewTagToAdd] = useState("");
  const [editTagToAdd, setEditTagToAdd] = useState<Record<number, string>>({});
  const [newProduct, setNewProduct] = useState<EditState>({
    name: "",
    description: "",
    price: "",
    tag_ids: [],
    image: null,
  });

  const loadData = async () => {
    const [productsData, tagsData] = await Promise.all([listProducts(), listTags()]);
    setProducts(productsData);
    setTags(tagsData);
    const nextEdit: Record<number, EditState> = {};
    productsData.forEach((product) => {
      nextEdit[product.id] = {
        name: product.name,
        description: product.description,
        price: product.price,
        tag_ids: product.tags.map((tag) => tag.id),
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
        await loadData();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar.");
        router.push("/auth");
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
      newProduct.tag_ids.forEach((tagId) => formData.append("tag_ids", String(tagId)));
      if (newProduct.image) {
        formData.append("image", newProduct.image);
      }
      await createProduct(formData);
      setNewProduct({
        name: "",
        description: "",
        price: "",
        tag_ids: [],
        image: null,
      });
      setNewTagToAdd("");
      await loadData();
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
      values.tag_ids.forEach((tagId) => formData.append("tag_ids", String(tagId)));
      if (values.image) {
        formData.append("image", values.image);
      }
      await updateProduct(productId, formData);
      await loadData();
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
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao remover.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await createTag(newTagName.trim());
      setNewTagName("");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar tag.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTag = async (tagId: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteTag(tagId);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao remover tag.");
    } finally {
      setLoading(false);
    }
  };

  const addTagToNewProduct = () => {
    const id = Number(newTagToAdd);
    if (!id || newProduct.tag_ids.includes(id)) return;
    setNewProduct((prev) => ({ ...prev, tag_ids: [...prev.tag_ids, id] }));
    setNewTagToAdd("");
  };

  const removeTagFromNewProduct = (tagId: number) => {
    setNewProduct((prev) => ({
      ...prev,
      tag_ids: prev.tag_ids.filter((id) => id !== tagId),
    }));
  };

  const addTagToEditProduct = (productId: number) => {
    const id = Number(editTagToAdd[productId]);
    if (!id) return;
    setEditState((prev) => {
      const current = prev[productId];
      if (!current || current.tag_ids.includes(id)) return prev;
      return {
        ...prev,
        [productId]: { ...current, tag_ids: [...current.tag_ids, id] },
      };
    });
    setEditTagToAdd((prev) => ({ ...prev, [productId]: "" }));
  };

  const removeTagFromEditProduct = (productId: number, tagId: number) => {
    setEditState((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        tag_ids: prev[productId].tag_ids.filter((id) => id !== tagId),
      },
    }));
  };

  return (
    <section className="stack">
      <h1>Admin - Produtos</h1>
      {error ? <p>{error}</p> : null}
      <div className="card stack">
        <strong>Tags</strong>
        <div className="button-row">
          <input
            className="input"
            placeholder="Nome da tag"
            value={newTagName}
            onChange={(event) => setNewTagName(event.target.value)}
          />
          <button className="button" onClick={handleCreateTag} disabled={loading}>
            Criar tag
          </button>
        </div>
        <div className="tag-list">
          {tags.map((tag) => (
            <div key={tag.id} className="tag-pill">
              <span>{tag.name}</span>
              <button
                className="tag-pill-remove"
                onClick={() => handleDeleteTag(tag.id)}
                disabled={loading}
                aria-label={`Remover tag ${tag.name}`}
              >
                ×
              </button>              
            </div>
          ))}
        </div>
      </div>
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
        <div className="button-row">
          <select
            className="input"
            value={newTagToAdd}
            onChange={(event) => setNewTagToAdd(event.target.value)}
          >
            <option value="">Selecione uma tag</option>
            {tags
              .filter((tag) => !newProduct.tag_ids.includes(tag.id))
              .map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
          </select>
          <button className="button secondary" onClick={addTagToNewProduct} type="button">
            Adicionar tag
          </button>
        </div>
        <div className="tag-list">
          {newProduct.tag_ids.map((tagId) => {
            const tag = tags.find((item) => item.id === tagId);
            if (!tag) return null;
            return (
              <div key={tag.id} className="tag-pill">
                <span>{tag.name}</span>
                <button
                  className="tag-pill-remove"
                  onClick={() => removeTagFromNewProduct(tag.id)}
                  type="button"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
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
              <div className="button-row">
                <select
                  className="input"
                  value={editTagToAdd[product.id] ?? ""}
                  onChange={(event) =>
                    setEditTagToAdd((prev) => ({
                      ...prev,
                      [product.id]: event.target.value,
                    }))
                  }
                >
                  <option value="">Selecione uma tag</option>
                  {tags
                    .filter((tag) => !edit.tag_ids.includes(tag.id))
                    .map((tag) => (
                      <option key={tag.id} value={tag.id}>
                        {tag.name}
                      </option>
                    ))}
                </select>
                <button
                  className="button secondary"
                  onClick={() => addTagToEditProduct(product.id)}
                  type="button"
                >
                  Adicionar tag
                </button>
              </div>
              <div className="tag-list">
                {edit.tag_ids.map((tagId) => {
                  const tag = tags.find((item) => item.id === tagId);
                  if (!tag) return null;
                  return (
                    <div key={tag.id} className="tag-pill">
                      <span>{tag.name}</span>
                      <button
                        className="tag-pill-remove"
                        onClick={() => removeTagFromEditProduct(product.id, tag.id)}
                        type="button"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
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
