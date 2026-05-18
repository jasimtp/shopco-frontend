import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Trash2, ArrowRight, Tag, X } from "lucide-react";
import styles from "./CartPage.module.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "../redux/store";
import {
  fetchCart,
  removeFromCartBackend,
  increaseQtyBackend,
  decreaseQtyBackend,
} from "../redux/cartSlice";
import axios from "axios";

export default function CartPage() {
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.cart.items);
const navigate = useNavigate();

const [addresses, setAddresses] = useState<any[]>([]);
const [showAddressError, setShowAddressError] = useState(false);
const [deleteId, setDeleteId] = useState<number | null>(null);

const [checkoutLoading, setCheckoutLoading] = useState(false);

const isLoggedIn = Boolean(localStorage.getItem("token"));

const confirmDelete = () => {
  if (deleteId !== null) {
    dispatch(removeFromCartBackend(deleteId));
    setDeleteId(null);
  }
};
  const subtotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.price * item.qty, 0),
    [cartItems]
  );

useEffect(() => {
  dispatch(fetchCart());

  axios
    .get("https://shopco-backend-qtvr.onrender.com/api/address")
    .then((res) => setAddresses(res.data))
    .catch((err) => console.error("Address fetch error:", err));
}, [dispatch]);


  const discount = Math.round(subtotal * 0.2);
  const deliveryFee = cartItems.length > 0 ? 15 : 0;
  const total = subtotal - discount + deliveryFee;

  const getImageUrl = (img: string) => {
  if (!img) return "";
  if (img.startsWith("http")) return img;
  if (img.startsWith("/")) return `https://shopco-backend-qtvr.onrender.com${img}`;
  return `https://shopco-backend-qtvr.onrender.com/${img}`;
};

const handleCheckout = () => {
  if (!isLoggedIn) {
    navigate("/login");
    return;
  }

  if (addresses.length === 0) {
    setShowAddressError(true);
    return;
  }

  setShowAddressError(false);
  setCheckoutLoading(true);

  setTimeout(() => {
    navigate("/checkout");
  }, 1200);
};

  return (
    <main className={styles.page}>
<p className={styles.breadcrumb}>
  <Link to="/">Home</Link>
  <span>&gt;</span>
  <Link to="/cart">Cart</Link>
</p>
    

      <section className={styles.cartLayout}>
        <div className={styles.cartList}>
          {cartItems.length === 0 ? (
            <div className={styles.emptyCart}>Your cart is empty</div>
          ) : (
            cartItems.map((item) => (
              <div
                className={styles.cartItem}
                key={`${item.id}-${item.size}-${item.color}`}
              >
                <div className={styles.productInfo}>
                  <div className={styles.imageBox}>
<img src={getImageUrl(item.img)} alt={item.name} />                  </div>

                  <div>
                    <h3>{item.name}</h3>
                    <p>
                      Size: <span>{item.size}</span>
                    </p>
                    <p>
                      Color: <span>{item.color}</span>
                    </p>
                    <strong>${item.price}</strong>
                  </div>
                </div>

                <div className={styles.actions}>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => setDeleteId(item.id)}
                  >
                    <Trash2 size={18} />
                  </button>

                  <div className={styles.qty}>
<button onClick={() => dispatch(decreaseQtyBackend(item.id))}>
                      -
                    </button>
                    <span>{item.qty}</span>
<button onClick={() => dispatch(increaseQtyBackend(item.id))}>
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className={styles.summary}>
          <h2>Order Summary</h2>

          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <strong>${subtotal}</strong>
          </div>

          <div className={styles.summaryRow}>
            <span>Discount (-20%)</span>
            <strong className={styles.discount}>-${discount}</strong>
          </div>

          <div className={styles.summaryRow}>
            <span>Delivery Fee</span>
            <strong>${deliveryFee}</strong>
          </div>

          <hr />

          <div className={styles.totalRow}>
            <span>Total</span>
            <strong>${total}</strong>
          </div>

          <div className={styles.promo}>
            <div>
              <Tag size={18} />
              <input type="text" placeholder="Add promo code" />
            </div>
            <button>Apply</button>
          </div>

         <button className={styles.checkout} onClick={handleCheckout}>
  Go to Checkout <ArrowRight size={18} />

</button>
 {showAddressError && (
  <p className={styles.addressError}>
    Please fill your address in{" "}
    <span onClick={() => navigate("/profile")}>
       profile
    </span>
  </p>
)}
        </div>
      </section>

      {deleteId !== null && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button className={styles.modalClose} onClick={() => setDeleteId(null)}>
              <X size={18} />
            </button>

            <h3>Remove item?</h3>
            <p>Are you sure you want to delete this product from your cart?</p>

            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setDeleteId(null)}>
                Cancel
              </button>
              <button className={styles.confirmBtn} onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
 {checkoutLoading && isLoggedIn && (
  <div className={styles.checkoutLoaderOverlay}>
    <div className={styles.premiumCheckoutCard}>
      <div className={styles.checkoutGlow}></div>

      <div className={styles.cartBox}>
        <div className={styles.cartHandle}></div>
        <div className={styles.cartBody}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className={styles.cartWheels}>
          <i></i>
          <i></i>
        </div>
      </div>

      <div className={styles.checkoutText}>
        <h3>Finalizing your order</h3>
        <p>Please wait while we prepare your secure checkout.</p>
      </div>

      <div className={styles.progressTrack}>
        <div className={styles.progressFill}></div>
      </div>

      <div className={styles.checkoutSteps}>
        <span>Cart</span>
        <span>Address</span>
        <span>Payment</span>
      </div>
    </div>
  </div>
)}
    </main>
  );
}