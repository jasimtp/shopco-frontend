import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  CreditCard,
  MapPin,
  Truck,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";

import styles from "./CheckoutPage.module.css";
import { fetchCart } from "../redux/cartSlice";
import type { AppDispatch, RootState } from "../redux/store";

export default function CheckoutPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const cartItems = useSelector((state: RootState) => state.cart.items);

  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [payment, setPayment] = useState("card");
  const [delivery, setDelivery] = useState("standard");

  useEffect(() => {
    dispatch(fetchCart());

    axios
      .get("https://shopco-backend-qtvr.onrender.com/api/address")
      .then((res) => {
        setAddresses(res.data);

        const defaultAddress = res.data.find((addr: any) => addr.isDefault);

        if (defaultAddress) {
          setSelectedAddress(defaultAddress.id);
        } else if (res.data.length > 0) {
          setSelectedAddress(res.data[0].id);
        }
      })
      .catch((err) => console.error("Address fetch error:", err));
  }, [dispatch]);

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (sum: number, item: any) => sum + Number(item.price) * Number(item.qty),
      0
    );
  }, [cartItems]);

  const discount = Math.round(subtotal * 0.2);

  const deliveryFee =
    cartItems.length === 0 ? 0 : delivery === "express" ? 25 : 15;

  const total = subtotal - discount + deliveryFee;

const getImageUrl = (img: string) => {
  if (!img) return "";
  if (img.startsWith("http")) return img;
  if (img.startsWith("/")) return `https://shopco-backend-qtvr.onrender.com${img}`;
  return `https://shopco-backend-qtvr.onrender.com/${img}`;
};

 const placeOrder = async () => {
  try {
    if (!selectedAddress) {
      alert("Please select address");
      return;
    }

    if (cartItems.length === 0) {
      alert("Cart empty");
      return;
    }

    await axios.post("https://shopco-backend-qtvr.onrender.com/api/order", {
      addressId: selectedAddress,
      items: cartItems,
      subtotal,
      discount,
      deliveryFee,
      total,
      paymentMethod: payment,
      deliveryMethod: delivery,
    });

    if (payment === "upi") {
navigate("/upi-payment", { state: { amount: total } });
} else {
  alert("Order placed successfully!");
  navigate("/orders");
}

  } catch (err) {
    console.error("Order error:", err);
  }
};

  return (
    <main className={styles.page}>
      <div className={styles.top}>
        <Link to="/cart">
          <ArrowLeft size={18} /> Back to Cart
        </Link>

       
      </div>

      <section className={styles.layout}>
        <div className={styles.left}>
          <div className={styles.card}>
            <h2>
              <MapPin size={22} /> Delivery Address
            </h2>

            {addresses.length === 0 ? (
              <div className={styles.noAddress}>
                <p>Please fill your address in your profile.</p>
                <Link to="/profile">Go to Profile</Link>
              </div>
            ) : (
              <div className={styles.addressList}>
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`${styles.addressBox} ${
                      selectedAddress === addr.id
                        ? styles.selectedAddress
                        : ""
                    }`}
                    onClick={() => setSelectedAddress(addr.id)}
                  >
                    <input
                      type="radio"
                      checked={selectedAddress === addr.id}
                      onChange={() => setSelectedAddress(addr.id)}
                    />

                    <div>
                      <div className={styles.addressTop}>
                        <strong>{addr.fullName}</strong>
                        <span>{addr.label || "Home"}</span>
                        {addr.isDefault && <em>Default</em>}
                      </div>

                      <p>
                        {addr.house}, {addr.city}, {addr.state} -{" "}
                        {addr.pincode}
                      </p>

                      <p>Phone: {addr.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.card}>
            <h2>
              <Truck size={22} /> Delivery Method
            </h2>

            <div className={styles.options}>
              <button
                type="button"
                className={delivery === "standard" ? styles.active : ""}
                onClick={() => setDelivery("standard")}
              >
                <strong>Standard Delivery</strong>
                <span>3-5 days • $15</span>
              </button>

              <button
                type="button"
                className={delivery === "express" ? styles.active : ""}
                onClick={() => setDelivery("express")}
              >
                <strong>Express Delivery</strong>
                <span>1-2 days • $25</span>
              </button>
            </div>
          </div>

          <div className={styles.card}>
            <h2>
              <CreditCard size={22} /> Payment Method
            </h2>

            <div className={styles.options}>
              <button
                type="button"
                className={payment === "card" ? styles.active : ""}
                onClick={() => setPayment("card")}
              >
                <strong>Card Payment</strong>
                <span>Visa, MasterCard, RuPay</span>
              </button>

              <button
                type="button"
                className={payment === "cod" ? styles.active : ""}
                onClick={() => setPayment("cod")}
              >
                <strong>Cash on Delivery</strong>
                <span>Pay when order arrives</span>
              </button>
              <button
  type="button"
  className={payment === "upi" ? styles.active : ""}
onClick={() => setPayment("upi")}
>
  <strong>UPI Payment</strong>
  <span>Google Pay, PhonePe, Paytm, BHIM</span>
</button>
            </div>

            {payment === "card" && (
              <div className={styles.grid}>
                <input
                  className={styles.full}
                  placeholder="Card number"
                  type="text"
                />
                <input placeholder="MM / YY" type="text" />
                <input placeholder="CVV" type="text" />
              </div>
            )}
          </div>
        </div>

        <aside className={styles.summary}>
          <h2>Order Summary</h2>

          {cartItems.length === 0 ? (
            <div className={styles.noAddress}>
              <p>Your cart is empty.</p>
              <Link to="/cart">Go back to cart</Link>
            </div>
          ) : (
            
            <div className={styles.items}>
              
              {cartItems.map((item: any) => (
                <div
                  className={styles.item}
                  key={`${item.id}-${item.size || ""}-${item.color || ""}`}
                >
               <img src={getImageUrl(item.img)} alt={item.name} />
                  <div>
                    <h3>{item.name || item.title}</h3>

                    <p>
                      {item.size && `${item.size} • `}
                      {item.color && `${item.color} • `}
                      Qty {item.qty}
                    </p>

                    <strong>${Number(item.price) * Number(item.qty)}</strong>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className={styles.priceRow}>
            <span>Subtotal</span>
            <strong>${subtotal}</strong>
          </div>

          <div className={styles.priceRow}>
            <span>Discount</span>
            <strong className={styles.discount}>-${discount}</strong>
          </div>

          <div className={styles.priceRow}>
            <span>Delivery</span>
            <strong>${deliveryFee}</strong>
          </div>

          <hr />

          <div className={styles.total}>
            <span>Total</span>
            <strong>${total}</strong>
          </div>

          <button className={styles.placeOrder} onClick={placeOrder}>
            Place Order
          </button>

          <p className={styles.secure}>
            <ShieldCheck size={16} /> Secure checkout guaranteed
          </p>
        </aside>
      </section>
    </main>
  );
}