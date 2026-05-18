import { Edit, Trash2, Search, X } from "lucide-react";
import styles from "./AdminProducts.module.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getProducts, deleteProduct } from "../../services/productService";
const API_URL = "https://shopco-backend-qtvr.onrender.com";

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
  images?: string[];
  variants?: {
    color: string;
    images: string[];
  }[];
};

export default function AdminProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
const [deleteId, setDeleteId] = useState<number | null>(null);
  // 🔥 FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      console.log("PRODUCTS:", res.data);
      setProducts(res.data);
    } catch (err) {
      toast.error("Failed to load products ❌");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔍 FILTER
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All Categories" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  // 🖼 IMAGE FIX
const getProductImage = (product: Product) => {
  const image =
    product.image ||
    product.images?.[0] ||
    product.variants?.[0]?.images?.[0];

  if (!image) return "/placeholder.png";

  return image.startsWith("http") ? image : `${API_URL}${image}`;
};
  // 🗑 DELETE
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteProduct(deleteId);

      setProducts((prev) =>
        prev.filter((product) => product.id !== deleteId)
      );

      toast.success("Product deleted ✅");
      setDeleteId(null);
    } catch (err) {
      toast.error("Delete failed ❌");
    }
  };

  return (
    <div className={styles.page}>
      <ToastContainer position="top-right" autoClose={2500} />

      {/* HEADER */}
      <div className={styles.header}>
        <div>
          <span className={styles.badge}>Inventory</span>
          <h1>Products</h1>
          <p>Manage your product inventory</p>
        </div>

    
      </div>

      {/* SEARCH */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>All Categories</option>
          <option>T-Shirts</option>
          <option>Jeans</option>
          <option>Shirts</option>
          <option>Shoes</option>
        </select>
      </div>

      {/* TABLE */}
      <div className={styles.tableCard}>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className={styles.productInfo}>
                    <img src={getProductImage(product)} alt={product.name} />

                      <div>
                        <strong>{product.name}</strong>
                        <small>ID: #{product.id}</small>
                      </div>
                    </div>
                  </td>

                  <td>{product.category}</td>
                  <td>₹{product.price}</td>
                  <td>{product.stock}</td>

                  <td>
                    <span
                      className={
                        product.stock > 0
                          ? styles.activeStatus
                          : styles.outStatus
                      }
                    >
                      {product.stock > 0 ? "Active" : "Out"}
                    </span>
                  </td>

                  <td>
                    <div className={styles.actions}>
                      <button
                        onClick={() =>
                          navigate(`/admin/edit-product/${product.id}`)
                        }
                      >
                        <Edit size={16} />
                      </button>

                      <button
onClick={() => setDeleteId(product.id)}                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: "center" }}>
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* DELETE MODAL */}
      {deleteId && (
        <div className={styles.modalOverlay}>
          <div className={styles.deleteModal}>
            <button onClick={() => setDeleteId(null)}>
              <X size={18} />
            </button>

            <h2>Delete Product?</h2>

            <div className={styles.modalActions}>
              <button onClick={() => setDeleteId(null)}>
                Cancel
              </button>

              <button onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}