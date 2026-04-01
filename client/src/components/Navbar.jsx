import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import api from "../api/api";
import defaultProfileImage from "../assets/profile-default.png";
import {
  FaSearch,
  FaShoppingCart,
  FaReceipt,
  FaSignOutAlt,
  FaMoon,
  FaSignInAlt,
  FaUserEdit,
} from "react-icons/fa";

const withImageVersion = (imageUrl) => {
  if (!imageUrl) return defaultProfileImage;
  const separator = imageUrl.includes("?") ? "&" : "?";
  return `${imageUrl}${separator}t=${Date.now()}`;
};

const navIconButtonClass =
  "flex h-10 w-10 items-center justify-center rounded-full border border-transparent bg-white/70 text-gray-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-500 hover:shadow-md active:scale-95 active:bg-orange-100";

export default function Navbar({
  onSearch,
  onCategory,
  onBrand,
  onSort,
  onReset,
}) {
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [user, setUser] = useState(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const isLogin = !!localStorage.getItem("access_token");

  useEffect(() => {
    fetchFilters();
  }, []);

  const fetchFilters = async () => {
    try {
      const [catRes, brandRes] = await Promise.all([
        api.get("/products/categories"),
        api.get("/products/brands"),
      ]);

      setCategories(catRes.data.data || catRes.data);
      setBrands(brandRes.data.data || brandRes.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      setUser({
        ...res.data.data,
        imageUrl: withImageVersion(res.data.data.imageUrl),
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isLogin) {
      fetchProfile();
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!profileMenuRef.current?.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleProfileUpdated = (event) => {
      if (event.detail) {
        setUser(event.detail);
        return;
      }

      fetchProfile();
    };

    window.addEventListener("profile-updated", handleProfileUpdated);
    return () =>
      window.removeEventListener("profile-updated", handleProfileUpdated);
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      onSearch(keyword);
    }, 500);

    return () => clearTimeout(delay);
  }, [keyword]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setProfileMenuOpen(false);
    navigate("/login");
  };

  return (
    <div className="flex w-full items-center justify-between bg-gray-100 px-6 py-3">
      <div
        onClick={() => {
          setKeyword("");
          onReset();
          navigate("/");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="flex cursor-pointer items-center gap-2 rounded-full px-2 py-1 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/70 hover:shadow-sm active:scale-95"
      >
        <div className="rounded-full bg-orange-500 p-2 text-white">⚡</div>
        <h1 className="text-lg font-semibold">
          <span className="text-orange-500">Zap</span>
          <span className="text-pink-500">Shop</span>
        </h1>
      </div>

      <div className="relative flex items-center gap-2 rounded-full border bg-white px-3 py-2">
        <FaSearch className="text-gray-400" />

        <input
          type="text"
          placeholder="Search products..."
          className="w-60 text-sm outline-none"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <Dropdown label="Category" options={categories} onChange={onCategory} />
        <Dropdown label="Brand" options={brands} onChange={onBrand} />

        <Dropdown
          label="Sort"
          options={[
            { id: "price", name: "Price ↑" },
            { id: "-price", name: "Price ↓" },
            { id: "name", name: "Name A-Z" },
            { id: "-name", name: "Name Z-A" },
            { id: "-createdAt", name: "Newest" },
          ]}
          onChange={onSort}
        />
      </div>

      <div className="flex items-center gap-3 text-lg text-gray-600">
        {/* <button type="button" className={navIconButtonClass}>
          <FaMoon />
        </button> */}

        {!isLogin && (
          <button
            type="button"
            className={navIconButtonClass}
            onClick={() => navigate("/login")}
          >
            <FaSignInAlt />
          </button>
        )}

        {isLogin && (
          <>
            <button
              type="button"
              className={navIconButtonClass}
              onClick={() => navigate("/cart")}
            >
              <FaShoppingCart />
            </button>

            <button
              type="button"
              className={navIconButtonClass}
              onClick={() => navigate("/orders")}
            >
              <FaReceipt />
            </button>

            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                className={`flex items-center gap-2 rounded-full border bg-white/90 px-2 py-1 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-95 ${
                  profileMenuOpen
                    ? "border-orange-300 bg-orange-50 shadow-md"
                    : "border-orange-100 hover:border-orange-300"
                }`}
              >
                <img
                  src={user?.imageUrl || defaultProfileImage}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <div className="hidden text-left md:block">
                  <p className="max-w-28 truncate text-xs font-semibold text-gray-800">
                    {user?.username || "My Account"}
                  </p>
                  <p className="text-[11px] text-orange-500">Manage Account</p>
                </div>
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 top-14 z-50 w-64 overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-xl">
                  <div className="bg-gradient-to-r from-orange-500 via-orange-400 to-amber-300 p-4 text-white">
                    <p className="text-sm opacity-90">Signed in as</p>
                    <p className="truncate text-base font-semibold">
                      {user?.username || "User"}
                    </p>
                    <p className="truncate text-xs opacity-90">
                      {user?.email || "Welcome back to ZapShop"}
                    </p>
                  </div>

                  <div className="p-3">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        navigate("/edit-profile");
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-orange-50 hover:text-orange-600 active:scale-[0.99]"
                    >
                      <FaUserEdit className="text-orange-500" />
                      Edit Profile
                    </button>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50 active:scale-[0.99]"
                    >
                      <FaSignOutAlt />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Dropdown({ label, options, onChange }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!ref.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 rounded-full border-l px-3 py-1 text-sm transition-all duration-200 hover:bg-orange-50 hover:text-orange-500 active:scale-95 ${
          open ? "text-orange-500" : ""
        }`}
      >
        {selected || `All ${label}`}
        <span className="text-xs">▾</span>
      </button>

      {open && (
        <div className="absolute left-0 top-10 z-50 max-h-60 w-52 overflow-y-auto rounded-xl border bg-white shadow-lg">
          <div
            onClick={() => {
              setSelected("");
              onChange("");
              setOpen(false);
            }}
            className="cursor-pointer px-3 py-2 text-sm font-medium transition hover:bg-orange-50"
          >
            All {label}
          </div>

          {options.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setSelected(item.name);
                onChange(item.id);
                setOpen(false);
              }}
              className="cursor-pointer px-3 py-2 text-sm transition hover:bg-orange-50"
            >
              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
