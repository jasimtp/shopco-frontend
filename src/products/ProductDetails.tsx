import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./ProductDetails.module.css";
import { getProductById } from "../services/productService";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../redux/store";
import { addToCartBackend } from "../redux/cartSlice";
const API_URL = "https://shopco-backend-qtvr.onrender.com";

const COLOR_MAP: Record<string, string> = {
  Olive: "#555735",
  Navy: "#1d2a8a",
  Black: "#000000",
  White: "#ffffff",
  Gray: "#808080",
  Red: "#ff0000",
  Blue: "#0000ff",
};

type Variant = {
  color: string;
  colorCode?: string;
  images: string[];
};

type Product = {
  id: number;
  name: string;
  description?: string;
  price: number;
  discount?: number;
  stock: number;
  category?: string;
  brand?: string;
  image?: string;
  images?: string[];
  sizes?: string[];
  variants?: Variant[];
};

export default function ProductDetails() {
  const { id } = useParams();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!id) return;

    getProductById(id)
      .then((res) => {
        const data: Product = res.data;
        setProduct(data);

        const firstImage =
          data.image ||
          data.images?.[0] ||
          data.variants?.[0]?.images?.[0] ||
          "";

        setSelectedImage(firstImage);
        setSelectedColor(data.variants?.[0]?.color || "");
        setSelectedSize(data.sizes?.[0] || "");
      })
      .catch((err) => console.log("Product detail error:", err));
  }, [id]);

  const makeImageUrl = (image?: string) => {
    if (!image) return "/assets/no-image.png";
    return image.startsWith("http") ? image : `${API_URL}${image}`;
  };

  const getColorCode = (variant: Variant) => {
    return (
      variant.colorCode ||
      COLOR_MAP[variant.color] ||
      COLOR_MAP[variant.color?.trim()] ||
      "#f0f0f0"
    );
  };

  const allImages = useMemo(() => {
    if (!product) return [];

    const imgs = [
      ...(product.image ? [product.image] : []),
      ...(product.images || []),
      ...(product.variants || []).flatMap((variant) => variant.images || []),
    ];

    return [...new Set(imgs)].filter(Boolean);
  }, [product]);

  const selectedVariant = useMemo(() => {
    if (!product?.variants?.length) return null;

    return (
      product.variants.find((variant) => variant.color === selectedColor) ||
      product.variants[0]
    );
  }, [product, selectedColor]);

const handleAddToCart = () => {
  if (!product) return;

  dispatch(
    addToCartBackend({
      productId: product.id,
      name: product.name,
      price: finalPrice,
      size: selectedSize,
      color: selectedColor,
      img: selectedImage || product.image || product.images?.[0] || "",
      qty,
    })
  );
};

  const visibleImages =
    selectedVariant?.images && selectedVariant.images.length > 0
      ? selectedVariant.images
      : allImages;

  const handleColorClick = (variant: Variant) => {
    setSelectedColor(variant.color);

    if (variant.images?.[0]) {
      setSelectedImage(variant.images[0]);
    }
  };

  if (!product) {
    return <p className={styles.loading}>Loading product...</p>;
  }

  const finalPrice =
    product.discount && product.discount > 0
      ? Math.round(product.price - (product.price * product.discount) / 100)
      : product.price;

  return (
    <main className={styles.page}>
      <div className={styles.breadcrumb}>
  <Link to="/">Home</Link>
  <span>&gt;</span>

  <Link to="/shop">Shop</Link>
  <span>&gt;</span>

  {product.category && (
    <>
      <Link to={`/shop?category=${encodeURIComponent(product.category)}`}>
        {product.category}
      </Link>
      <span>&gt;</span>
    </>
  )}

  <span>{product.name}</span>
</div>

      <section className={styles.details}>
        <div className={styles.gallery}>
          <div className={styles.thumbs}>
            {visibleImages.length > 0 ? (
              visibleImages.map((image, index) => (
                <img
                  key={`${image}-${index}`}
                  src={makeImageUrl(image)}
                  alt={product.name}
                  onClick={() => setSelectedImage(image)}
                  className={selectedImage === image ? styles.activeThumb : ""}
                />
              ))
            ) : (
              <img src="/assets/no-image.png" alt="No product" />
            )}
          </div>

          <div className={styles.mainImage}>
            <img src={makeImageUrl(selectedImage)} alt={product.name} />
          </div>
        </div>

        <div className={styles.info}>
          <h1>{product.name}</h1>

          <div className={styles.rating}>
            ★★★★☆ <span>4.5/5</span>
          </div>

          <div className={styles.price}>
            <strong>₹{finalPrice}</strong>

            {product.discount && product.discount > 0 && (
              <>
                <del>₹{product.price}</del>
                <span className={styles.discount}>-{product.discount}%</span>
              </>
            )}
          </div>

          <p className={styles.desc}>
            {product.description || "No description available."}
          </p>

          <hr />

          {product.variants && product.variants.length > 0 && (
            <>
              <p className={styles.label}>Select Color</p>

              <div className={styles.colors}>
                {product.variants.map((variant) => (
                  <button
                    key={variant.color}
                    title={variant.color}
                    type="button"
                    onClick={() => handleColorClick(variant)}
                    className={
                      selectedColor === variant.color ? styles.activeColor : ""
                    }
                    style={{ backgroundColor: getColorCode(variant) }}
                  >
                  
                  </button>
                ))}
              </div>

              <p className={styles.selectedColorText}>
                Selected Color: <strong>{selectedColor}</strong>
              </p>

              <hr />
            </>
          )}

          {product.sizes && product.sizes.length > 0 && (
            <>
              <p className={styles.label}>Choose Size</p>

              <div className={styles.sizes}>
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={selectedSize === size ? styles.active : ""}
                  >
                    {size}
                  </button>
                ))}
              </div>

              <hr />
            </>
          )}

          <p className={styles.stock}>
            {product.stock > 0
              ? `${product.stock} items available`
              : "Out of stock"}
          </p>

          <div className={styles.cartRow}>
            <div className={styles.qty}>
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                -
              </button>

              <span>{qty}</span>

              <button
                type="button"
                onClick={() =>
                  setQty((q) => Math.min(product.stock || 1, q + 1))
                }
              >
                +
              </button>
            </div>

            <button
              className={styles.addCart}
              disabled={product.stock <= 0}
            onClick={handleAddToCart}
            >
              {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>
        </div>
      </section>

      <section className={styles.tabs}>
        <span className={styles.tabActive}>Product Details</span>
        <span>Rating & Reviews</span>
        <span>FAQs</span>
      </section>

      <section className={styles.productText}>
        <h3>Product Details</h3>
        <p>{product.description || "No product details available."}</p>
      </section>
    </main>
  );
}