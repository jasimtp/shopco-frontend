import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import styles from "./CreateProduct.module.css";
import {
  createProduct,
  getProductById,
  updateProduct,
} from "../../services/productService";

const API_URL = "https://shopco-backend-qtvr.onrender.com";

type ColorOption = {
  name: string;
  code: string;
};

const COLOR_OPTIONS: ColorOption[] = [
  { name: "Olive", code: "#555735" },
  { name: "Navy", code: "#1d2a8a" },
  { name: "Black", code: "#000000" },
  { name: "White", code: "#ffffff" },
  { name: "Gray", code: "#808080" },
  { name: "Red", code: "#ff0000" },
  { name: "Blue", code: "#0000ff" },
];

type Variant = {
  color: string;
  colorCode: string;
  images: string[];
  newFiles: File[];
  previews: string[];
};

export default function CreateProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeVariantIndex, setActiveVariantIndex] = useState<number | null>(
    null
  );

  const [variants, setVariants] = useState<Variant[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [sizeInput, setSizeInput] = useState("");

  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    discount: "",
    stock: "",
  });

  useEffect(() => {
    if (!isEditMode || !id) return;

    getProductById(id)
      .then((res) => {
        const product = res.data;

        setFormValues({
          name: product.name || "",
          description: product.description || "",
          category: product.category || "",
          brand: product.brand || "",
          price: String(product.price || ""),
          discount: String(product.discount || ""),
          stock: String(product.stock || ""),
        });

        setSizes(product.sizes || []);

        const loadedVariants: Variant[] =
          product.variants?.map((variant: any) => ({
            color: variant.color,
            colorCode:
              variant.colorCode ||
              COLOR_OPTIONS.find(
                (c) => c.name.toLowerCase() === variant.color.toLowerCase()
              )?.code ||
              "#000000",
            images: variant.images || [],
            newFiles: [],
            previews: [],
          })) || [];

        setVariants(loadedVariants);
      })
      .catch(() => toast.error("Product load failed ❌"));
  }, [id, isEditMode]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const addSize = () => {
    const value = sizeInput.trim();
    if (!value) return;

    if (sizes.includes(value)) {
      toast.warning("Size already added");
      return;
    }

    setSizes((prev) => [...prev, value]);
    setSizeInput("");
  };

  const removeSize = (index: number) => {
    setSizes((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleColorVariant = (color: ColorOption) => {
    const exists = variants.some((v) => v.color === color.name);

    if (exists) {
      setVariants((prev) => prev.filter((v) => v.color !== color.name));
      return;
    }

    setVariants((prev) => [
      ...prev,
      {
        color: color.name,
        colorCode: color.code,
        images: [],
        newFiles: [],
        previews: [],
      },
    ]);
  };

  const removeVariant = (index: number) => {
    setVariants((prev) => {
      const variant = prev[index];
      variant.previews.forEach((url) => URL.revokeObjectURL(url));
      return prev.filter((_, i) => i !== index);
    });
  };

  const openImagePicker = (index: number) => {
    setActiveVariantIndex(index);
    fileInputRef.current?.click();
  };

  const handleVariantImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    if (activeVariantIndex === null || files.length === 0) return;

    setVariants((prev) =>
      prev.map((variant, index) => {
        if (index !== activeVariantIndex) return variant;

        const newPreviews = files.map((file) => URL.createObjectURL(file));

        return {
          ...variant,
          newFiles: [...variant.newFiles, ...files],
          previews: [...variant.previews, ...newPreviews],
        };
      })
    );

    e.target.value = "";
  };

  const removeOldVariantImage = (variantIndex: number, imageIndex: number) => {
    setVariants((prev) =>
      prev.map((variant, index) => {
        if (index !== variantIndex) return variant;

        return {
          ...variant,
          images: variant.images.filter((_, i) => i !== imageIndex),
        };
      })
    );
  };

  const removeNewVariantImage = (variantIndex: number, imageIndex: number) => {
    setVariants((prev) =>
      prev.map((variant, index) => {
        if (index !== variantIndex) return variant;

        URL.revokeObjectURL(variant.previews[imageIndex]);

        return {
          ...variant,
          newFiles: variant.newFiles.filter((_, i) => i !== imageIndex),
          previews: variant.previews.filter((_, i) => i !== imageIndex),
        };
      })
    );
  };

  const resetForm = () => {
    setFormValues({
      name: "",
      description: "",
      category: "",
      brand: "",
      price: "",
      discount: "",
      stock: "",
    });

    variants.forEach((variant) =>
      variant.previews.forEach((url) => URL.revokeObjectURL(url))
    );

    setSizes([]);
    setVariants([]);
    setSizeInput("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (variants.length === 0) {
      toast.error("Please select at least one color ❌");
      return;
    }

    const hasImagesForEveryColor = variants.every(
      (variant) => variant.images.length > 0 || variant.newFiles.length > 0
    );

    if (!hasImagesForEveryColor) {
      toast.error("Please add images for every color ❌");
      return;
    }

    const formData = new FormData();

    formData.append("name", formValues.name);
    formData.append("description", formValues.description);
    formData.append("category", formValues.category);
    formData.append("brand", formValues.brand);
    formData.append("price", formValues.price);
    formData.append("discount", formValues.discount || "0");
    formData.append("stock", formValues.stock);
    formData.append("sizes", JSON.stringify(sizes));

    const variantsPayload = variants.map((variant) => ({
      color: variant.color,
      colorCode: variant.colorCode,
      images: variant.images,
    }));

    formData.append("variants", JSON.stringify(variantsPayload));

    variants.forEach((variant, index) => {
      variant.newFiles.forEach((file) => {
        formData.append(`variantImages_${index}`, file);
      });
    });

    try {
      if (isEditMode && id) {
        await updateProduct(id, formData);
        toast.success("Product updated successfully ✅");
        navigate(-1);
      } else {
        await createProduct(formData);
        toast.success("Product created successfully ✅");
        resetForm();
      }
    } catch (err) {
      toast.error(isEditMode ? "Update failed ❌" : "Create failed ❌");
    }
  };

  return (
    <div className={styles.page}>
      <ToastContainer position="top-right" autoClose={2500} />

      <div className={styles.header}>
        <div>
          <span className={styles.badge}>Admin Panel</span>
          <h1>{isEditMode ? "Edit Product" : "Create Product"}</h1>
          <p>Add product details, sizes, colors and color-wise images.</p>
        </div>
      </div>

      <form className={styles.layout} onSubmit={handleSubmit}>
        <section className={styles.mainCard}>
          <h2>Product Information</h2>

          <div className={styles.formGroup}>
            <label>Product Name</label>
            <input
              type="text"
              name="name"
              value={formValues.name}
              onChange={handleChange}
              placeholder="One Life Graphic T-shirt"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              name="description"
              value={formValues.description}
              onChange={handleChange}
              placeholder="Write product description..."
              required
            />
          </div>

          <div className={styles.grid2}>
            <div className={styles.formGroup}>
              <label>Category</label>
              <select
                name="category"
                value={formValues.category}
                onChange={handleChange}
                required
              >
                <option value="">Select category</option>
                <option value="T-Shirts">T-Shirts</option>
                <option value="Jeans">Jeans</option>
                <option value="Shirts">Shirts</option>
                <option value="Shoes">Shoes</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Brand</label>
              <input
                type="text"
                name="brand"
                value={formValues.brand}
                onChange={handleChange}
                placeholder="Nike"
              />
            </div>
          </div>

          <div className={styles.grid3}>
            <div className={styles.formGroup}>
              <label>Price</label>
              <input
                type="number"
                name="price"
                value={formValues.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Discount %</label>
              <input
                type="number"
                name="discount"
                value={formValues.discount}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Stock</label>
              <input
                type="number"
                name="stock"
                value={formValues.stock}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Sizes</label>

            <div className={styles.sizeInputRow}>
              <input
                type="text"
                value={sizeInput}
                onChange={(e) => setSizeInput(e.target.value)}
                placeholder="Small, Medium, Large"
              />

              <button type="button" onClick={addSize}>
                Add
              </button>
            </div>

            <div className={styles.sizeList}>
              {sizes.map((size, index) => (
                <span key={size}>
                  {size}
                  <button type="button" onClick={() => removeSize(index)}>
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className={styles.colorSection}>
            <h2>Product Colors</h2>

            <div className={styles.colorGrid}>
              {COLOR_OPTIONS.map((color) => {
                const selected = variants.some((v) => v.color === color.name);

                return (
                  <button
                    type="button"
                    key={color.name}
                    className={`${styles.colorCard} ${
                      selected ? styles.selectedColorCard : ""
                    }`}
                    onClick={() => toggleColorVariant(color)}
                  >
                    <span
                      className={styles.colorCircle}
                      style={{ backgroundColor: color.code }}
                    />
                    <strong>{color.name}</strong>
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.gallerySection}>
            <h2>Color Specific Images</h2>

            {variants.length === 0 ? (
              <p className={styles.noColorText}>
                Please select product colors first.
              </p>
            ) : (
              variants.map((variant, variantIndex) => (
                <div className={styles.galleryCard} key={variant.color}>
                  <div className={styles.galleryTitle}>
                    <span
                      className={styles.smallDot}
                      style={{ backgroundColor: variant.colorCode }}
                    />
                    <h3>{variant.color.toUpperCase()} GALLERY</h3>

                    <button
                      type="button"
                      className={styles.removeColorBtn}
                      onClick={() => removeVariant(variantIndex)}
                    >
                      Remove
                    </button>
                  </div>

                  <button
                    type="button"
                    className={styles.uploadGalleryBtn}
                    onClick={() => openImagePicker(variantIndex)}
                  >
                    Upload {variant.color} Images
                  </button>

                  <div className={styles.previewGrid}>
                    {variant.images.map((image, imageIndex) => (
                      <div className={styles.previewItem} key={image}>
                        <img src={`${API_URL}${image}`} alt={variant.color} />

                        <button
                          type="button"
                          onClick={() =>
                            removeOldVariantImage(variantIndex, imageIndex)
                          }
                        >
                          ×
                        </button>
                      </div>
                    ))}

                    {variant.previews.map((image, imageIndex) => (
                      <div className={styles.previewItem} key={image}>
                        <img src={image} alt={variant.color} />

                        <button
                          type="button"
                          onClick={() =>
                            removeNewVariantImage(variantIndex, imageIndex)
                          }
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handleVariantImageChange}
          />
        </section>

        <aside className={styles.sideCard}>
          <h2>Summary</h2>

          <div className={styles.summaryBox}>
            <p>Total Colors: {variants.length}</p>
            <p>Total Sizes: {sizes.length}</p>
            <p>
              Total Images:{" "}
              {variants.reduce(
                (total, variant) =>
                  total + variant.images.length + variant.newFiles.length,
                0
              )}
            </p>
          </div>

          <button type="submit" className={styles.submitBtn}>
            {isEditMode ? "Update Product" : "Create Product"}
          </button>

          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </aside>
      </form>
    </div>
  );
}