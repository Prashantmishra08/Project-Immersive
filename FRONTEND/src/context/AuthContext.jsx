import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(() => {
    // ✅ Load token from localStorage on initial render
    const storedUser = localStorage.getItem("authUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("⚠️ No token found, redirecting to login.");
          setLoading(false);
          return;
        }

        const res = await axios.get("http://localhost:3000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAuthUser(res.data);
        localStorage.setItem("authUser", JSON.stringify(res.data)); // ✅ Save user in localStorage
      } catch (error) {
        console.error("❌ Error fetching user:", error.response?.data || error.message);
        logout(); // ✅ Clear storage if token is invalid
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = (userData, token) => {
    console.log("✅ User logged in, storing token...");
    localStorage.setItem("token", token);
    localStorage.setItem("authUser", JSON.stringify(userData));
    setAuthUser(userData);
  };

  const logout = () => {
    console.warn("🚨 Logging out user, clearing localStorage...");
    localStorage.removeItem("token");
    localStorage.removeItem("authUser");
    setAuthUser(null);
    window.location.href = "/login"; // ✅ Redirect after logout
  };

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
