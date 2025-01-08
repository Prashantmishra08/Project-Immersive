import React, { useState } from 'react';
import axios from 'axios';



function App() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [token, setToken] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/login", formData);
            setToken(response.data.token); // Store token for authentication
            alert("Login successful!");
        } catch (error) {
            console.error("Login error:", error);
            alert("Invalid username or password");
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </label>
                <br />
                <label>
                    Password:
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </label>
                <br />
                <button type="submit">Login</button>
            </form>
            {token && <p>Authenticated! Token: {token}</p>}
        </div>
    );
}



export default App
