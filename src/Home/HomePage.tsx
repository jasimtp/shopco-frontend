import styles from "./HomePage.module.css";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
    variants?: {
    color: string;
    images: string[];
  }[];
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

useEffect(() => {
  getProducts()
    .then((res) => {
      console.log("PRODUCTS:", res.data);
      setProducts(res.data);
    })
    .catch((err) => {
      console.log("Products fetch error:", err);
    });
}, []);
const newArrivals = products.slice(0, 4);

const topSelling = [...products]
  .sort((a, b) => b.price - a.price)
  .slice(0, 4);
const heroImages = ["/avathar.png", "/avathar2.png"];
const [currentImage, setCurrentImage] = useState(0);


useEffect(() => {
  const interval = setInterval(() => {
    setCurrentImage((prev) => (prev + 1) % heroImages.length);
  }, 3000);

  return () => clearInterval(interval);
}, []);

  return (
    <main className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h1>FIND CLOTHES THAT MATCHES YOUR STYLE</h1>
          <p>
            Browse through our diverse range of meticulously crafted garments,
            designed to bring out your individuality.
          </p>
          <button>Shop Now</button>

          <div className={styles.stats}>
            <div>
              <strong>200+</strong>
              <span>International Brands</span>
            </div>
            <div>
              <strong>{products.length}+</strong>
              <span>High-Quality Products</span>
            </div>
            <div>
              <strong>30,000+</strong>
              <span>Happy Customers</span>
            </div>
          </div>
        </div>

    <div className={styles.heroImg}>
  <span className={styles.starLeft}>✦</span>

<img src={heroImages[currentImage]} alt="models" />
  <span className={styles.starRight}>✦</span>
</div>
      </section>

      <section className={styles.brands}>
        <span>VERSACE</span>
        <span>ZARA</span>
        <span>GUCCI</span>
        <span>PRADA</span>
        <span>Calvin Klein</span>
      </section>

      <ProductSection title="NEW ARRIVALS" products={newArrivals} />

      <ProductSection title="TOP SELLING" products={topSelling} />

      <section className={styles.dressStyle}>
        <h2>BROWSE BY DRESS STYLE</h2>

        <div className={styles.styleGrid}>
          <div>
            <span>Casual</span>
            <img src="/casual.png" alt="Casual" />
          </div>
          <div>
            <span>Formal</span>
            <img src="/formal.png" alt="Formal" />
          </div>
          <div>
            <span>Party</span>
<img
  src="/party.png"
  alt="Party"
  className={styles.partyImg}
/>          </div>
          <div>
            <span>Gym</span>
            <img src="/gym.png" alt="Gym" />
          </div>
        </div>
      </section>

      <section className={styles.reviews}>
        <div className={styles.reviewHeader}>
          <h2>OUR HAPPY CUSTOMERS</h2>

          <div className={styles.reviewArrows}>
            <button>
              <ArrowLeft size={20} />
            </button>
            <button>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        <div className={styles.reviewGrid}>
          {[1, 2, 3].map((item) => (
            <div className={styles.reviewCard} key={item}>
              <div className={styles.stars}>★★★★★</div>
              <h4>
                Sarah M. <span>●</span>
              </h4>
              <p>
                I'm blown away by the quality and style of the clothes I received.
                Highly recommended!
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

type ProductSectionProps = {
  title: string;
  products: Product[];
};

function ProductSection({ title, products }: ProductSectionProps) {
  const getProductImage = (product: Product) => {
    const variantImage = product.variants?.[0]?.images?.[0];

    const imagePath = variantImage || product.image;

    if (!imagePath) return "/assets/no-image.png";

    if (imagePath.startsWith("http")) return imagePath;

    return `https://shopco-backend-qtvr.onrender.com${imagePath}`;
  };

  return (
    <section className={styles.products}>
      <h2>{title}</h2>

      {products.length === 0 ? (
        <p className={styles.emptyText}>No products found</p>
      ) : (
        <div className={styles.productGrid}>
          {products.map((product) => (
            <Link
              to={`/product/${product.id}`}
              className={styles.card}
              key={product.id}
            >
              <div className={styles.imageBox}>
                <img src={getProductImage(product)} alt={product.name} />
              </div>

              <h3>{product.name}</h3>
              <p>
                ★★★★☆ <span>4.5</span>
              </p>
              <strong>₹{product.price}</strong>
            </Link>
          ))}
        </div>
      )}

      <button className={styles.viewBtn}>View All</button>
    </section>
  );
}