
// import React, { useState } from "react";
// import { Label } from "./ui/label";
// import { Input } from "./ui/input";
// import { Button } from "./ui/button";
// import { toast } from "sonner";
// import { Link, useNavigate } from "react-router-dom";
// import { Loader2 } from "lucide-react";
// import { useSelector } from "react-redux";

// const SignUp = () => {
//   const [input, setInput] = useState({
//     fullname: "",
//     username: "",
//     email: "",
//     password: "",
//     profession: "",
//     aboutYou: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const {user} = useSelector(store=>store.auth);
//   const navigate=useNavigate();

//   const changeEventHandler = (e) => {
//     setInput({ ...input, [e.target.name]: e.target.value });
//   };
//   const signupHandler = (e) => {
//     e.preventDefault();
//     setLoading(true);
//     toast.success("sign Up successful");
//     console.log(input);
//     setLoading(false);
//     navigate("/")

//     setInput({
//       fullname: "",
//       username: "",
//       email: "",
//       password: "",
//       profession: "",
//       aboutYou: "",
//     });

//   };

// //   useEffect(()=>{
// //     if(user){
// //         navigate("/");
// //     }
// // },[])
//   return (
//     <div className="flex items-center w-screen h-screen justify-center">
//       <form
//         onSubmit={signupHandler}
//         className="shadow-lg flex flex-col gap-5 p-12 w-[36rem] "
//       >
//         <div className="my-4">
//           <h1 className="text-center font-bold text-xl my-2">LOGO</h1>
//           <p className="text-sm text-center">
//             Welcome to our website Sign Up for More Information
//           </p>
//         </div>
//         <div>
//           <Label className="text-base">Full Name</Label>
//           <Input
//             type="text"
//             name="fullname"
//             value={input.fullname}
//             onChange={changeEventHandler}
//             className="focus-visible:ring-transparent my-2"
//           />
//         </div>
//         <div>
//           <Label className="text-base">username</Label>
//           <Input
//             type="text"
//             name="username"
//             value={input.username}
//             onChange={changeEventHandler}
//             className="focus-visible:ring-transparent my-2"
//           />
//         </div>
//         <div>
//           <Label className="text-base">Email</Label>
//           <Input
//             type="email"
//             name="email"
//             value={input.email}
//             onChange={changeEventHandler}
//             className="focus-visible:ring-transparent my-2"
//           />
//         </div>
//         <div>
//           <Label className="text-base">Password</Label>
//           <Input
//             type="password"
//             name="password"
//             value={input.password}
//             onChange={changeEventHandler}
//             className="focus-visible:ring-transparent my-2"
//           />
//         </div>
//         <div>
//           <Label className="text-base">profession</Label>
//           <Input
//             type="text"
//             name="profession"
//             value={input.profession}
//             onChange={changeEventHandler}
//             className="focus-visible:ring-transparent my-2"
//           />
//         </div>
//         <div>
//           <Label className="text-base">About you</Label>
//           <Input
//             type="text"
//             name="aboutYou"
//             value={input.aboutYou}
//             onChange={changeEventHandler}
//             className="focus-visible:ring-transparent my-2"
//           />
//         </div>
//         {
//           loading?(<Button>
//             <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
//             Please wait
//         </Button>):(<Button
//           type="submit"
//           className="bg-blue-950 focus-visible:ring-transparent text-white hover:bg-blue-900"
//         >
//           SignUp
//         </Button>)
//         }

//         <span className="text-center text-xl">
//           {" "}
//           already have an account?{" "}
//           <Link to="/login" className="text-blue-600 no-underline">
//             LogIn
//           </Link>
//         </span>
//       </form>
//     </div>
//   );
// };

// export default SignUp;

import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import axios from "axios";

const SignUp = () => {
  const [input, setInput] = useState({
    fullName: "",
    userName: "",
    email: "",
    password: "",
    profession: "",
    about: "",
  });
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const changeFileHandler = (e) => {
    setFile(e.target.files[0]);
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please upload a profile picture.");
      return;
    }
    
    const data = new FormData();
    Object.keys(input).forEach((key) => data.append(key, input[key]));
    data.append("avatar", file);
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/api/signup", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
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
        {Object.keys(input).map((key) => (
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
        ))}
        <div>
          <Label className="text-sm">Avatar</Label>
          <Input type="file" onChange={changeFileHandler} className="my-2" />
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