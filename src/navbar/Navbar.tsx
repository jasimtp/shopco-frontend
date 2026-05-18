import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import {
  Search,
  ShoppingCart,
  CircleUserRound,
  X,
  Menu,
  Settings,
  Info,
  HelpCircle,
  LogOut,
  Package,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import { logout } from "../redux/authSlice";
import { getProducts } from "../services/productService";

type Product = {
  id: number;
  name: string;
  price: number;
  image?: string;
  images?: string[];
  category?: string;
};


export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showTopBar, setShowTopBar] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
const [searchTerm, setSearchTerm] = useState("");
const [products, setProducts] = useState<Product[]>([]);
const [showSuggestions, setShowSuggestions] = useState(false);


  const profileRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = localStorage.getItem("token");
  const isLoggedIn = Boolean(token);

  const cartItems = useSelector((state: RootState) => state.cart.items);

  const totalQty = cartItems.reduce((total, item) => total + item.qty, 0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

useEffect(() => {
  getProducts()
    .then((res) => setProducts(res.data))
    .catch((err) => console.log("Search products fetch error:", err));
}, []);


  const handleCloseTopBar = () => {
    setShowTopBar(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    setShowProfileMenu(false);
    setShowTopBar(true);
    navigate("/login");
  };

const getImageUrl = (product: Product) => {
  const img = product.image || product.images?.[0];

  if (!img) return "/assets/no-image.png";

  if (img.startsWith("http")) return img;

  return `https://shopco-backend-qtvr.onrender.com${img}`;
};


const searchResults = products
  .filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .slice(0, 5);

const handleSuggestionClick = (id: number) => {
  setSearchTerm("");
  setShowSuggestions(false);
  setShowSearch(false);
  navigate(`/product/${id}`);
};



  return (
    <>
      <header className={styles.header}>
        {showTopBar && !isLoggedIn && (
          <div className={styles.topBar}>
            <span>
              Sign up and get 20% off to your first order.{" "}
              <Link to="/register">Sign Up Now</Link>
            </span>

            <X
              size={18}
              className={styles.closeIcon}
              onClick={handleCloseTopBar}
            />
          </div>
        )}

        <nav className={styles.navbar}>
          <button className={styles.menuBtn} onClick={() => setOpen(true)}>
            <Menu size={22} />
          </button>

          <Link to="/home" className={styles.logo}>
            SHOP.CO
          </Link>

          <ul className={styles.menu}>
            <li>
              <Link to="/category">Shop</Link>
            </li>
            <li>On Sale</li>
            <li>New Arrivals</li>
            <li>Brands</li>
          </ul>

      <div className={styles.searchWrapper}>
  <div className={styles.searchBox}>
    <Search size={20} />
    <input
      type="text"
      placeholder="Search for products..."
      value={searchTerm}
      onChange={(e) => {
        setSearchTerm(e.target.value);
        setShowSuggestions(true);
      }}
      onFocus={() => setShowSuggestions(true)}
    />
  </div>

  {showSuggestions && searchTerm && (
    <div className={styles.searchDropdown}>
      {searchResults.length > 0 ? (
        searchResults.map((product) => (
          <div
            key={product.id}
            className={styles.searchItem}
            onMouseDown={() => handleSuggestionClick(product.id)}
          >
            <img
              src={getImageUrl(product)}
              alt={product.name}
            />

            <div>
              <h4>{product.name}</h4>
              <p>{product.category}</p>
            </div>
          </div>
        ))
      ) : (
        <p className={styles.noResult}>No products found</p>
      )}
    </div>
  )}
</div>
          <div className={styles.icons}>
            <Search
              size={20}
              className={styles.mobileSearch}
              onClick={() => setShowSearch(!showSearch)}
            />

            <div className={styles.cartWrapper}>
              <Link to="/cart">
                <ShoppingCart size={22} />
              </Link>

              {totalQty > 0 && (
                <span key={totalQty} className={styles.cartCount}>
                  {totalQty}
                </span>
              )}
            </div>

            {isLoggedIn ? (
              <div className={styles.profileWrapper} ref={profileRef}>
                <CircleUserRound
                  size={22}
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                />

                {showProfileMenu && (
                  <div className={styles.profileMenu}>
                    <Link
                      to="/profile"
                      className={styles.profileItem}
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <CircleUserRound size={18} />
                      <span>Profile</span>
                    </Link>

                    <div className={styles.profileItem}>
                      <Settings size={18} />
                      <Link to="/settings">Settings</Link>

                    </div>

                    <div className={styles.profileItem}>
                      <Info size={18} />
                      <Link to="/about">About</Link>
                    </div>

                    <Link
                      to="/orders"
                      className={styles.profileItem}
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <Package size={18} />
                      <span>My Orders</span>
                    </Link>

                    <div className={styles.profileItem}>
                      <HelpCircle size={18} />
                      <Link to="/help-contact">Help & Contact</Link>
                    </div>

                    <button className={styles.logoutBtn} onClick={handleLogout}>
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <CircleUserRound size={22} />
              </Link>
            )}
          </div>
        </nav>
{showSearch && (
<div className={styles.mobileSearchWrap}>
  <div className={styles.mobileSearchBox}>
    <Search size={18} />
    <input
      type="text"
      placeholder="Search products..."
      value={searchTerm}
      onChange={(e) => {
        setSearchTerm(e.target.value);
        setShowSuggestions(true);
      }}
      autoFocus
    />
  </div>

  {showSuggestions && searchTerm && (
    <div className={styles.searchDropdown}>
      {searchResults.length > 0 ? (
        searchResults.map((product) => (
          <div
            key={product.id}
            className={styles.searchItem}
            onMouseDown={() => handleSuggestionClick(product.id)}
          >
            <img
             src={
  product.image
    ? product.image.startsWith("http")
      ? product.image
      : `https://shopco-backend-qtvr.onrender.com${product.image}`
    : product.images?.[0]
    ? product.images[0].startsWith("http")
      ? product.images[0]
      : `https://shopco-backend-qtvr.onrender.com${product.images[0]}`
    : "/assets/no-image.png"
}
              alt={product.name}
            />

            <div>
              <h4>{product.name}</h4>
              <p>{product.category}</p>
            </div>
          </div>
        ))
      ) : (
        <p className={styles.noResult}>No products found</p>
      )}
    </div>
  )}
</div>
)}
      </header>

   

      {open && (
        <div className={styles.overlay} onClick={() => setOpen(false)} />
      )}

      <aside className={`${styles.mobileMenu} ${open ? styles.show : ""}`}>
        <div className={styles.mobileMenuHead}>
          <h2>SHOP.CO</h2>
          <X size={22} onClick={() => setOpen(false)} />
        </div>

        <ul>
          <li>
            <Link to="/category" onClick={() => setOpen(false)}>
              Shop
            </Link>
          </li>

          {isLoggedIn && (
            <li>
              <Link to="/profile" onClick={() => setOpen(false)}>
                Profile
              </Link>
            </li>
          )}

          <li>On Sale</li>
          <li>New Arrivals</li>
          <li>Brands</li>
        </ul>
      </aside>
    </>
  );
}