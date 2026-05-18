import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./ProfilePage.module.css";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

const API_URL = "https://shopco-backend-qtvr.onrender.com/api/address";

const emptyForm = {
  fullName: "",
  phone: "",
  house: "",
  city: "",
  state: "",
  pincode: "",
  label: "Home",
};

const ProfilePage = () => {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
const [showOrders, setShowOrders] = useState(false);

const user = useSelector((state: RootState) => state.auth.user);

  const fetchAddresses = async () => {
    try {
      const res = await axios.get(API_URL);
      setAddresses(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setEditingAddress(null);
    setFormData(emptyForm);
    setShowForm(false);
  };

  const handleSave = async () => {
    try {
      if (editingAddress) {
        await axios.put(`${API_URL}/${editingAddress.id}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }

      resetForm();
      fetchAddresses();
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleEdit = (addr: any) => {
    setEditingAddress(addr);
    setFormData({
      fullName: addr.fullName || "",
      phone: addr.phone || "",
      house: addr.house || "",
      city: addr.city || "",
      state: addr.state || "",
      pincode: addr.pincode || "",
      label: addr.label || "Home",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchAddresses();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setFormData(emptyForm);
    setShowForm(true);
  };

  const handleSetDefault = async (id: number) => {
    try {
      await axios.patch(`${API_URL}/default/${id}`);
      fetchAddresses();
    } catch (err) {
      console.error("Default error:", err);
    }
  };

  const fetchOrders = async () => {
  try {
    const res = await axios.get("https://shopco-backend-qtvr.onrender.com/api/order/my-orders");
    setOrders(res.data);
  } catch (err) {
    console.error("Order fetch error:", err);
  }
};

const getImageUrl = (img: string) => {
  if (!img) return "/placeholder.png";

  // already full url
  if (img.startsWith("http")) return img;

  // correct handling
  if (img.startsWith("/")) {
    return `https://shopco-backend-qtvr.onrender.com${img}`;
  }

  return `https://shopco-backend-qtvr.onrender.com/${img}`;
};

  return (
    <div className={styles.profilePage}>
      <div className={styles.container}>
        <div className={styles.hero}>
          <div className={styles.userBox}>
            <div className={styles.avatar}>👤</div>
            <div>
<h1>{user?.name || "My Profile"}</h1>
              <p>Manage your delivery addresses</p>
              <div className={styles.badges}>
<p>{user?.email || "No Email"}</p>
                <span>✓ Verified Customer</span>
              </div>
            </div>
          </div>

          <button className={styles.addBtn} onClick={handleAddNew}>
            + Add New Address
          </button>
        </div>

        <div className={styles.grid}>
          <aside className={styles.sidebar}>
            <div className={styles.card}>
              <h3>Account Menu</h3>
             <div
  className={showOrders ? styles.menuItem : styles.menuActive}
  onClick={() => setShowOrders(false)}
>
  My Addresses
</div>

<div
  className={showOrders ? styles.menuActive : styles.menuItem}
  onClick={() => {
    setShowOrders(true);
    fetchOrders();
  }}
>
  My Orders
</div>            <div className={styles.menuItem}>Wishlist</div>
              <div className={styles.menuItem}>Payments</div>
            </div>

            <div className={styles.card}>
              <h3>Address Summary</h3>
              <p>Total saved addresses</p>
              <strong className={styles.count}>{addresses.length}</strong>
            </div>
          </aside>

          <main className={styles.main}>
            {showForm && (
              <div className={styles.formCard}>
                <div className={styles.formHeader}>
                  <h2>{editingAddress ? "Edit Address" : "Add New Address"}</h2>
                  <button className={styles.closeBtn} onClick={resetForm}>
                    ×
                  </button>
                </div>

                <div className={styles.formGrid}>
                  <input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} />
                  <input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />
                  <input className={styles.fullWidth} name="house" placeholder="House / Area / Street" value={formData.house} onChange={handleChange} />
                  <input name="city" placeholder="City" value={formData.city} onChange={handleChange} />
                  <input name="state" placeholder="State" value={formData.state} onChange={handleChange} />
                  <input name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} />

                 <div className={styles.labelButtons}>
  {["Home", "Work"].map((label) => (
    <button
      type="button"
      key={label}
      className={formData.label === label ? styles.activeLabel : styles.labelBtn}
      onClick={() => setFormData({ ...formData, label })}
    >
      {label}
    </button>
  ))}
</div>
                </div>

                <div className={styles.actions}>
                  <button className={styles.saveBtn} onClick={handleSave}>
                    {editingAddress ? "Update Address" : "Save Address"}
                  </button>
                  <button className={styles.cancelBtn} onClick={resetForm}>
                    Cancel
                  </button>
                </div>
              </div>
            )} 
             {showOrders ? (
    <div className={styles.ordersPreview}>
      <h3>My Orders</h3>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        <>
          {orders.slice(0, 2).map((order) => (
            <div key={order.id} className={styles.orderMini}>
              <div className={styles.orderTop}>
                <span>Order #{order.id}</span>
                <span className={styles.status}>{order.status}</span>
              </div>

              <div className={styles.orderItems}>
                {(typeof order.items === "string"
                  ? JSON.parse(order.items)
                  : order.items
                )
                  .slice(0, 2)
                  .map((item: any, i: number) => (
                    <img
                      key={i}
                      src={getImageUrl(item.img)}

                      alt=""
                    />
                  ))}
              </div>

              <div className={styles.orderBottom}>
                <span>Total: ${order.total}</span>
              </div>
            </div>
          ))}

          <button
            className={styles.seeMore}
            onClick={() => (window.location.href = "/orders")}
          >
            See More →
          </button>
        </>
      )}
    </div>
    ) : (

            <div className={styles.addressCard}>
              <div className={styles.sectionHeader}>
                <div>
                  <h2>Saved Addresses</h2>
                  <p>Choose default address for checkout</p>
                </div>
              </div>

              {addresses.length === 0 ? (
                <div className={styles.emptyBox}>
                  <div className={styles.emptyIcon}>📍</div>
                  <h3>No address added yet</h3>
                  <p>Add your first delivery address.</p>
                  <button onClick={handleAddNew}>Add Address</button>
                </div>
              ) : (
                <div className={styles.addressList}>
                  {addresses.map((addr) => (
                    <div key={addr.id} className={styles.addressItem}>
                      <div className={styles.addressInfo}>
                        <div className={styles.labelRow}>
                          <span className={styles.labelBadge}>
                            {addr.label === "Work" ? "💼" : "🏠"} {addr.label || "Home"}
                          </span>

                          {addr.isDefault && (
                            <span className={styles.defaultBadge}>Default</span>
                          )}
                        </div>

                        <h3>{addr.fullName}</h3>
                        <p>📍 {addr.house}, {addr.city}, {addr.state} - {addr.pincode}</p>
                        <p>📞 {addr.phone}</p>
                      </div>

                      <div className={styles.addressActions}>
                        {!addr.isDefault && (
                          <button
                            className={styles.defaultBtn}
                            onClick={() => handleSetDefault(addr.id)}
                          >
                            Set Default
                          </button>
                        )}

                        <button className={styles.editBtn} onClick={() => handleEdit(addr)}>
                          Edit
                        </button>

                        <button className={styles.deleteBtn} onClick={() => handleDelete(addr.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
             )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;