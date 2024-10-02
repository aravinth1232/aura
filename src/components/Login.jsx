import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
        setError("Invalid email or password. Please try again.");
      toast.error(error.message);
      
    }
  };

  return (
    <div className="auth flex flex-col items-center gap-4 p-6  rounded-md">
      <h1 className="text-2xl font-bold">Login</h1>
      {error ? 
      ( <p className="text-red-500">{error}</p> )
      :( <p className="text-transparent select-none">error</p> )
      
      }
      <div className="flex flex-col gap-4">
  <input
    type="email"
    placeholder="Email"
    className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-800 transition"
    autoComplete="on"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
  <div className="relative w-full max-w-xs">
    <input
      type={showPassword ? "text" : "password"}
      placeholder="Password"
      className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-gray-800 transition"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
    <div
      onClick={() => setShowPassword(!showPassword)}
      className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
      title={showPassword ? "Hide password" : "Show password"}
    >
      {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
    </div>
  </div>
</div>

      <button onClick={handleLogin} className="py-2 px-4 bg-gray-800 hover:bg-gray-600 text-white rounded">
        Login
      </button>
      <Link to="/signup" className="mt-4 text-gray-800 ">
        Create new account?
      </Link>
    </div>
  );
};

export default Login;
