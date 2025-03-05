import React, { useState, useEffect } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import codeConnect from "../assets/codeConnect.png";
import axios from "axios";
import { useAuthContext } from "../context/AuthContext";

const LogIn = () => {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const { authUser, setAuthUser } = useAuthContext();
    const navigate = useNavigate();

    // ✅ Redirect if already logged in
    useEffect(() => {
        if (authUser !== null) {
            navigate("/");
        }
    }, [authUser, navigate]);

    const loginHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const response = await axios.post(
                "http://localhost:3000/api/login",
                { userName, password },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );

            if (response.data?.token && response.data?.user) {
                // ✅ Store session details
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("userId", response.data.user._id || "");
                localStorage.setItem("username", response.data.user.userName);
                localStorage.setItem("avatar", response.data.user.avatar);

                setAuthUser(response.data.user);

                setMessage("✅ Login successful! Redirecting...");
                setTimeout(() => navigate("/"), 1);
            }
        } catch (error) {
            setLoading(false);
            console.error(error);

            if (error.response) {
                switch (error.response.status) {
                    case 401:
                        setMessage("❌ Invalid username or password. Please try again.");
                        break;
                    case 500:
                        setMessage("⚠️ Server error. Please try again later.");
                        break;
                    default:
                        setMessage(error.response.data?.message || "⚠️ Login failed. Try again.");
                }
            } else if (error.request) {
                setMessage("❌ No response from server. Please check your internet connection.");
            } else {
                setMessage("❌ Error: " + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center w-screen h-screen bg-gray-900 text-white">
            <form onSubmit={loginHandler} className="bg-gray-800 shadow-md p-8 rounded-lg w-[450px] flex flex-col gap-4">
                <div className="text-center">
                    <img src={codeConnect} alt="codeConnect Logo" className="w-[150px] h-[150px] mx-auto rounded-full" />
                    <h2 className="text-center font-semibold text-xl">Login to CodeConnect</h2>
                </div>

                <div>
                    <Label className="text-sm">Username</Label>
                    <Input
                        type="text"
                        name="userName"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                        className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded focus:outline-none"
                    />
                </div>

                <div>
                    <Label className="text-sm">Password</Label>
                    <Input
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded focus:outline-none"
                    />
                    {/* <Link to="/forgot-password" className="text-blue-500 text-sm block mt-1">
                        Forgot password?
                    </Link> */}
                </div>

                <div>
                    {loading ? (
                        <Button disabled className="w-full bg-blue-600 p-2 rounded text-white flex items-center justify-center">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing in...
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full bg-green-600 hover:bg-green-500 p-2 rounded text-white">
                            Login
                        </Button>
                    )}
                </div>

                {message && (
                    <p className={`text-sm mt-2 text-center ${message.includes("❌") ? "text-red-500" : "text-green-500"}`}>
                        {message}
                    </p>
                )}

                <p className="text-center text-sm mt-4">
                    New to CodeConnect?{" "}
                    <Link to="/signup" className="text-blue-500">Create an account.</Link>
                </p>
            </form>
        </div>
    );
};

export default LogIn;
