import { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import codeConnect from "../../assets/codeConnect.png";
import axios from "axios";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { authUser, setAuthUser } = useAuthContext();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  // 🔴 Agar admin already logged-in hai, to direct "/admin" par bhejo
  if (authUser?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/admin/login", {
        email,
        password,
      });
  
      localStorage.setItem("token", res.data.token); // Save token in localStorage
      setAuthUser(res.data.admin); // Update auth state
      navigate("/admin/dashboard"); // Redirect to admin dashboard
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
    }
  };
  
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <form onSubmit={handleLogin} className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="text-center">
            <img src={codeConnect} alt="codeConnect Logo" className="w-[150px] h-[150px] mx-auto rounded-full" />
            <h2 className="text-center font-bold text-xl mb-4">Admin Login</h2>
      </div>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-3 bg-gray-700 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-3 bg-gray-700 rounded"
          required
        />
        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 p-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
