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

  // 🔥 CHECK LOGIN
  const isLogin = !!localStorage.getItem("access_token");

  // FETCH FILTER DATA
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

  //GET PROFILE
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

  // SEARCH DEBOUNCE
  useEffect(() => {
    const delay = setTimeout(() => {
      onSearch(keyword);
    }, 500);

    return () => clearTimeout(delay);
  }, [keyword]);

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setProfileMenuOpen(false);
    navigate("/login");
  };

  return (
    <div className="w-full bg-gray-100 px-6 py-3 flex items-center justify-between">
      {/* LOGO */}
      <div
        onClick={() => {
          setKeyword("");
          onReset();
          navigate("/");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="flex items-center gap-2 cursor-pointer"
      >
        <div className="bg-orange-500 text-white p-2 rounded-full">⚡</div>
        <h1 className="text-lg font-semibold">
          <span className="text-orange-500">Zap</span>
          <span className="text-pink-500">Shop</span>
        </h1>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex items-center bg-white rounded-full border px-3 py-2 gap-2 relative">
        <FaSearch className="text-gray-400" />

        <input
          type="text"
          placeholder="Search products..."
          className="outline-none text-sm w-60"
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

      {/* 🔥 RIGHT ICONS (CONDITIONAL) */}
      <div className="flex items-center gap-6 text-gray-600 text-lg">
        {/* 🌙 THEME BUTTON */}
        <FaMoon className="cursor-pointer hover:text-orange-500 transition" />

        {/* ❌ NOT LOGIN */}
        {!isLogin && (
          <FaSignInAlt
            className="cursor-pointer hover:text-orange-500 transition"
            onClick={() => navigate("/login")}
          />
        )}

        {/* ✅ LOGIN */}
        {isLogin && (
          <>
            <FaShoppingCart onClick={() => navigate("/cart")} />
            <FaReceipt onClick={() => navigate("/orders")} />

            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full border border-orange-100 bg-white/90 px-2 py-1 shadow-sm transition hover:border-orange-300 hover:shadow-md"
              >
                <img
                  src={user?.imageUrl || defaultProfileImage}
                  className="w-8 h-8 rounded-full object-cover"
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
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
                    >
                      <FaUserEdit className="text-orange-500" />
                      Edit Profile
                    </button>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50"
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

//////////////////////////////////////////////////////
// DROPDOWN (UNCHANGED)
//////////////////////////////////////////////////////

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
        className="text-sm px-3 py-1 border-l flex items-center gap-1 hover:text-orange-500"
      >
        {selected || `All ${label}`}
        <span className="text-xs">▾</span>
      </button>

      {open && (
        <div className="absolute top-10 left-0 w-52 bg-white border rounded-xl shadow-lg max-h-60 overflow-y-auto z-50">
          <div
            onClick={() => {
              setSelected("");
              onChange("");
              setOpen(false);
            }}
            className="px-3 py-2 hover:bg-orange-50 cursor-pointer text-sm font-medium"
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
              className="px-3 py-2 hover:bg-orange-50 cursor-pointer text-sm"
            >
              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
