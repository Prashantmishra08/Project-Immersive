import React, { useState, useEffect } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, ChevronDown } from "lucide-react";
import axios from "axios";

const SignUp = () => {
  const [input, setInput] = useState({
    fullName: "",
    userName: "",
    email: "",
    password: "",
    profession: "",
    about: "",
    interests: [],
  });
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [interestsOptions, setInterestsOptions] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/tags");
        setInterestsOptions(response.data);
      } catch (error) {
        toast.error("Failed to load interests.");
      }
    };
    fetchInterests();
  }, []);

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const changeFileHandler = (e) => {
    setFile(e.target.files[0]);
  };

  const handleInterestsChange = (interest) => {
    setInput((prev) => {
      const isSelected = prev.interests.includes(interest);
      return {
        ...prev,
        interests: isSelected
          ? prev.interests.filter((i) => i !== interest)
          : [...prev.interests, interest],
      };
    });
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please upload a profile picture.");
      return;
    }
    
    const data = new FormData();
    Object.keys(input).forEach((key) => {
      if (key === "interests") {
        data.append(key, JSON.stringify(input[key]));
      } else {
        data.append(key, input[key]);
      }
    });
    data.append("avatar", file);
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/api/signup", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        // withCredentials: true,
      });

      toast.success(response.data.message || "Registration successful!");
      setLoading(false);
      navigate("/");
    } catch (error) {
      setLoading(false);
      toast.error(
        error.response?.data?.message || "An error occurred during sign up."
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <form
        onSubmit={signupHandler}
        className="bg-gray-800 shadow-md p-8 rounded-lg w-96 flex flex-col gap-4"
      >
        <h2 className="text-center font-semibold text-xl">Sign up for CodeConnect</h2>
        {Object.keys(input).map((key) =>
          key !== "interests" && (
            <div key={key}>
              <Label className="text-sm capitalize">{key.replace("userName", "Username")}</Label>
              <Input
                type={key === "password" ? "password" : "text"}
                name={key}
                value={input[key]}
                onChange={changeEventHandler}
                required
                className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded focus:outline-none"
              />
            </div>
          )
        )}
        <div>
          <Label className="text-sm">Avatar</Label>
          <Input type="file" onChange={changeFileHandler} className="my-2" />
        </div>
        <div className="relative">
          <Label className="text-sm">Select Interests</Label>
          <div
            className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded cursor-pointer flex justify-between items-center"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {input.interests.length > 0 ? input.interests.join(", ") : "Select interests"}
            <ChevronDown className="h-4 w-4" />
          </div>
          {dropdownOpen && (
            <div className="absolute z-10 w-full bg-gray-800 border border-gray-600 rounded mt-1 p-2 max-h-40 overflow-auto">
              {interestsOptions.map((interest) => (
                <div
                  key={interest}
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded cursor-pointer"
                  onClick={() => handleInterestsChange(interest)}
                >
                  <input
                    type="checkbox"
                    checked={input.interests.includes(interest)}
                    readOnly
                  />
                  {interest}
                </div>
              ))}
            </div>
          )}
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-500 p-2 rounded text-white flex items-center justify-center"
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {loading ? "Signing up..." : "Sign up"}
        </Button>
        <p className="text-center text-sm mt-4">
          Already have an account? <Link to="/login" className="text-blue-500">Log in</Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
