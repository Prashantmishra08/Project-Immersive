import { useAuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const { setAuthUser } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    console.log("Attempting logout...");
  
    try {
        const response = await axios.post(
            "http://localhost:3000/api/logout",
            {},
            { withCredentials: true }
        );

        console.log("Logout successful:", response.data);

        // 🔴 Remove token from local storage
        localStorage.removeItem("token");

        // Clear auth state
        setAuthUser(null);

        // Redirect to login
        navigate("/login");
        
    } catch (error) {
        console.error("Logout failed:", error.response?.data?.message || error.message);
        alert("Logout failed! Please try again.");
    }
};


  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
