import { useEffect, useState } from "react";
import axios from "axios";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  PlusCircle,
  LogOut,
  Menu,
  X,
  IndianRupee,
  Box,
  ArrowUpRight,
} from "lucide-react";

import AdminProducts from "./AdminProducts";
import CreateProduct from "./CreateProduct";
import AdminOrders from "./AdminOrders";
import AdminUsers from "./AdminUsers";
import styles from "./Admin.module.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [productsCount, setProductsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  const closeSidebar = () => setSidebarOpen(false);

  const fetchDashboardData = async () => {
    try {
      const productsRes = await axios.get("https://shopco-backend-qtvr.onrender.com/api/products");
      const ordersRes = await axios.get("https://shopco-backend-qtvr.onrender.com/api/order");

      const products = productsRes.data || [];
      const orders = ordersRes.data || [];

      setProductsCount(products.length);
      setOrdersCount(orders.length);

      const totalRevenue = orders
        .filter((order: any) => order.status !== "Cancelled")
        .reduce((sum: number, order: any) => sum + Number(order.total || 0), 0);

      setRevenue(totalRevenue);
      setRecentOrders(orders.slice(0, 5));

      try {
        const usersRes = await axios.get("https://shopco-backend-qtvr.onrender.com/api/users");
        setUsersCount(usersRes.data?.length || 0);
      } catch {
        setUsersCount(0);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  };

  useEffect(() => {
    if (activePage === "dashboard") {
      fetchDashboardData();
    }
  }, [activePage]);

const downloadReport = async () => {
  await fetchDashboardData();

  setTimeout(async () => {
    const input = document.getElementById("dashboard-report");
    if (!input) return;

    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      windowWidth: input.scrollWidth,
      windowHeight: input.scrollHeight,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("admin-report.pdf");
  }, 800);
};

  const renderPage = () => {
    if (activePage === "products") return <AdminProducts />;
    if (activePage === "create") return <CreateProduct />;
    if (activePage === "orders") return <AdminOrders />;
    if (activePage === "users") return <AdminUsers />;

    return (
  <div id="dashboard-report">
      <>
        <div  className={styles.topHeader}>
          <div>
            <span className={styles.badge}>Admin Dashboard</span>
            <h1>Welcome Back 👋</h1>
            <p>Manage products, orders, users and monitor store performance.</p>
          </div>

          <button className={styles.reportBtn} onClick={downloadReport}>
            Download Report
          </button>
        </div>

        <div className={styles.cards}>
          <div className={styles.card}>
            <div className={styles.cardIcon}>
              <ShoppingBag size={24} />
            </div>
            <h3>Total Products</h3>
            <p>{productsCount}</p>
            <span>Live data</span>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>
              <Box size={24} />
            </div>
            <h3>Total Orders</h3>
            <p>{ordersCount}</p>
            <span>Live data</span>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>
              <Users size={24} />
            </div>
            <h3>Total Users</h3>
            <p>{usersCount}</p>
            <span>Live data</span>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>
              <IndianRupee size={24} />
            </div>
            <h3>Total Revenue</h3>
            <p>₹{revenue}</p>
            <span>Cancelled orders excluded</span>
          </div>
        </div>

        <div className={styles.dashboardGrid}>
          <div className={styles.chartCard}>
            <div className={styles.sectionTitle}>
              <h2>Recent Orders</h2>

              <button
                className={styles.viewAllBtn}
                onClick={() => setActivePage("orders")}
              >
                View All <ArrowUpRight size={16} />
              </button>
            </div>

            <div className={styles.ordersTable}>
              <table>
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Total</th>
                  </tr>
                </thead>

                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className={styles.emptyTd}>
                        No recent orders
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <strong>#{order.id}</strong>
                        </td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>{order.items?.length || 0}</td>
                        <td>{order.paymentMethod}</td>
                        <td>
                          <span
                            className={
                              order.status === "Delivered"
                                ? styles.delivered
                                : order.status === "Shipped"
                                ? styles.shipped
                                : order.status === "Cancelled"
                                ? styles.cancelled
                                : styles.pending
                            }
                          >
                            {order.status}
                          </span>
                        </td>
                        <td>₹{order.total}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className={styles.activityCard}>
            <div className={styles.sectionTitle}>
              <h2>Activity</h2>
            </div>

            {recentOrders.length === 0 ? (
              <p className={styles.noActivity}>No activity found</p>
            ) : (
              recentOrders.slice(0, 4).map((order) => (
                <div className={styles.activityItem} key={order.id}>
                  <span></span>
                  <div>
                    <strong>Order #{order.id}</strong>
                    <p>
                      ₹{order.total} - {order.status}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </>
      </div>
    );
  };

  return (
    <div className={styles.adminLayout}>
      <button
        className={styles.mobileMenuBtn}
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={22} />
      </button>

      {sidebarOpen && (
        <div className={styles.overlay} onClick={closeSidebar}></div>
      )}

      <aside
        className={`${styles.sidebar} ${
          sidebarOpen ? styles.sidebarShow : ""
        }`}
      >
        <div>
          <div className={styles.sidebarHeader}>
            <h2 className={styles.logo}>SHOP.CO</h2>

            <X
              className={styles.closeBtn}
              size={24}
              onClick={closeSidebar}
            />
          </div>

          <nav className={styles.navLinks}>
            <button
              className={activePage === "dashboard" ? styles.active : ""}
              onClick={() => {
                setActivePage("dashboard");
                closeSidebar();
              }}
            >
              <LayoutDashboard size={19} />
              Dashboard
            </button>

            <button
              className={activePage === "products" ? styles.active : ""}
              onClick={() => {
                setActivePage("products");
                closeSidebar();
              }}
            >
              <Package size={19} />
              Products
            </button>

            <button
              className={activePage === "create" ? styles.active : ""}
              onClick={() => {
                setActivePage("create");
                closeSidebar();
              }}
            >
              <PlusCircle size={19} />
              Create Product
            </button>

            <button
              className={activePage === "orders" ? styles.active : ""}
              onClick={() => {
                setActivePage("orders");
                closeSidebar();
              }}
            >
              <ShoppingBag size={19} />
              Orders
            </button>

            <button
              className={activePage === "users" ? styles.active : ""}
              onClick={() => {
                setActivePage("users");
                closeSidebar();
              }}
            >
              <Users size={19} />
              Users
            </button>
          </nav>
        </div>

        <div className={styles.bottomLinks}>
          <button>
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>

      <main className={styles.content}>{renderPage()}</main>
    </div>
  );
}