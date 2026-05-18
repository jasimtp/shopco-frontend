import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  SlidersHorizontal,
  X,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import styles from "./CategoryPage.module.css";
import { getProducts } from "../services/productService";

const API_URL = "https://shopco-backend-qtvr.onrender.com";

type Variant = {
  color: string;
  colorCode?: string;
  images?: string[];
};

type Product = {
  id: number;
  name: string;
  price: number;
  discount?: number;
  category?: string;
  image?: string;
  images?: string[];
  sizes?: string[];
  variants?: Variant[];
};

const categories = ["All", "T-Shirts", "Shorts", "Shirts", "Hoodie", "Jeans"];

const sizes = [
  "XX-Small",
  "X-Small",
  "Small",
  "Medium",
  "Large",
  "X-Large",
  "XX-Large",
  "3X-Large",
  "4X-Large",
];

const colors = [
  { name: "Green", code: "#00c853" },
  { name: "Red", code: "#ff1744" },
  { name: "Yellow", code: "#ffd600" },
  { name: "Orange", code: "#ff6d00" },
  { name: "Cyan", code: "#00b8d4" },
  { name: "Blue", code: "#2962ff" },
  { name: "Purple", code: "#6200ea" },
  { name: "Pink", code: "#f50057" },
  { name: "White", code: "#fff" },
  { name: "Black", code: "#000" },
];

const dressStyles = ["All", "Casual", "Formal", "Party", "Gym"];

export default function CategoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCategory = searchParams.get("category") || "All";

const searchQuery = searchParams.get("search") || "";

  const [filterOpen, setFilterOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("All");
  const [sortBy, setSortBy] = useState("Most Popular");
  const [page, setPage] = useState(1);

  const perPage = 9;

  useEffect(() => {
    getProducts()
      .then((res) => setProducts(res.data))
      .catch((err) => console.log("Products fetch error:", err));
  }, []);

  const getImage = (product: Product) => {
    const image =
      product.image ||
      product.images?.[0] ||
      product.variants?.[0]?.images?.[0];

    if (!image) return "/assets/no-image.png";

    return image.startsWith("http") ? image : `${API_URL}${image}`;
  };

  const finalPrice = (product: Product) => {
    if (!product.discount || product.discount <= 0) return product.price;

    return Math.round(product.price - (product.price * product.discount) / 100);
  };

  const handleCategory = (category: string) => {
    setSelectedCategory(category);
    setPage(1);

    if (category === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }

    setFilterOpen(false);
  };

  const filteredProducts = useMemo(() => {
    let data = [...products];

    if (selectedCategory !== "All") {
      data = data.filter(
        (product) =>
          product.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

if (searchQuery) {
  const query = searchQuery.toLowerCase();

  data = data.filter((product) =>
    product.name?.toLowerCase().includes(query) ||
    product.category?.toLowerCase().includes(query)
  );
}


    if (selectedColor) {
      data = data.filter((product) =>
        product.variants?.some(
          (variant) =>
            variant.color.toLowerCase() === selectedColor.toLowerCase()
        )
      );
    }

    if (selectedSize) {
      data = data.filter((product) =>
        product.sizes?.some(
          (size) => size.toLowerCase() === selectedSize.toLowerCase()
        )
      );
    }

    if (sortBy === "Low to High") {
      data.sort((a, b) => finalPrice(a) - finalPrice(b));
    }

    if (sortBy === "High to Low") {
      data.sort((a, b) => finalPrice(b) - finalPrice(a));
    }

    if (sortBy === "Newest") {
      data.sort((a, b) => b.id - a.id);
    }

    return data;
 }, [products, selectedCategory, selectedColor, selectedSize, sortBy, searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / perPage) || 1;

  const currentProducts = filteredProducts.slice(
    (page - 1) * perPage,
    page * perPage
  );

  return (
    <main className={styles.page}>
      <p className={styles.breadcrumb}>
        Home &gt; Shop &gt; {selectedCategory}
      </p>

      <div className={styles.layout}>
        <aside className={`${styles.sidebar} ${filterOpen ? styles.show : ""}`}>
          <div className={styles.filterHead}>
            <h3>Filters</h3>
            <X
              className={styles.closeBtn}
              size={20}
              onClick={() => setFilterOpen(false)}
            />
          </div>

          <div className={styles.filterList}>
            {categories.map((item) => (
              <div
                key={item}
                onClick={() => handleCategory(item)}
                className={
                  selectedCategory === item ? styles.activeCategory : ""
                }
              >
                <span>{item}</span>
                <ChevronRight size={16} />
              </div>
            ))}
          </div>

          <div className={styles.filterBlock}>
            <h4>
              Price <ChevronDown size={16} />
            </h4>

            <div className={styles.range}>
              <div></div>
            </div>

            <div className={styles.priceText}>
              <span>₹50</span>
              <span>₹2000</span>
            </div>
          </div>

          <div className={styles.filterBlock}>
            <h4>
              Colors <ChevronDown size={16} />
            </h4>

            <div className={styles.colorGrid}>
              {colors.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  title={color.name}
                  style={{ background: color.code }}
                  onClick={() =>
                    setSelectedColor(
                      selectedColor === color.name ? "" : color.name
                    )
                  }
                  className={
                    selectedColor === color.name ? styles.selectedColor : ""
                  }
                />
              ))}
            </div>
          </div>

          <div className={styles.filterBlock}>
            <h4>
              Size <ChevronDown size={16} />
            </h4>

            <div className={styles.sizeGrid}>
              {sizes.map((size) => (
                <button
                  type="button"
                  key={size}
                  onClick={() =>
                    setSelectedSize(selectedSize === size ? "" : size)
                  }
                  className={selectedSize === size ? styles.activeSize : ""}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filterBlock}>
            <h4>
              Dress Style <ChevronDown size={16} />
            </h4>

            <div className={styles.filterList}>
              {dressStyles.map((item) => (
                <div
                  key={item}
                  onClick={() => setSelectedStyle(item)}
                  className={selectedStyle === item ? styles.activeCategory : ""}
                >
                  <span>{item}</span>
                  <ChevronRight size={16} />
                </div>
              ))}
            </div>
          </div>

          <button
            className={styles.applyBtn}
            onClick={() => setFilterOpen(false)}
          >
            Apply Filter
          </button>
        </aside>

        {filterOpen && (
          <div
            className={styles.overlay}
            onClick={() => setFilterOpen(false)}
          />
        )}

        <section className={styles.content}>
          <div className={styles.topRow}>
            <div>
<h3>{searchQuery ? `Search: ${searchQuery}` : selectedCategory}</h3>                       <hr>
 </hr>
              <p>
                Showing {currentProducts.length} of {filteredProducts.length}{" "}
                Products
              </p>
            </div>

            <div className={styles.sort}>
              <span>
                Sort by:{" "}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option>Most Popular</option>
                  <option>Newest</option>
                  <option>Low to High</option>
                  <option>High to Low</option>
                </select>
                <hr></hr>

              </span>
              <button onClick={() => setFilterOpen(true)}>
                <SlidersHorizontal size={18} />
              </button>
            </div>
          </div>

          <div className={styles.grid}>
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => {
                const price = finalPrice(product);

                return (
                  <Link
                    to={`/product/${product.id}`}
                    className={styles.card}
                    key={product.id}
                  >
                    <div className={styles.imageBox}>
                      <img src={getImage(product)} alt={product.name} />
                    </div>

                    <h3>{product.name}</h3>

                    <p className={styles.rating}>
                      ★★★★★ <span>4.5/5</span>
                    </p>

                    <div className={styles.price}>
                      <strong>₹{price}</strong>

                      {product.discount && product.discount > 0 && (
                        <>
                          <del>₹{product.price}</del>
                          <span>-{product.discount}%</span>
                        </>
                      )}
                    </div>
                  </Link>
                );
              })
            ) : (
              <p>No products found</p>
            )}
          </div>

          <div className={styles.pagination}>
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              ← Previous
            </button>

            <div>
              {Array.from({ length: totalPages }).map((_, index) => (
                <span
                  key={index + 1}
                  onClick={() => setPage(index + 1)}
                  className={page === index + 1 ? styles.pageActive : ""}
                >
                  {index + 1}
                </span>
              ))}
            </div>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next →
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}