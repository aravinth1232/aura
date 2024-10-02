import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase"; // Import Firestore
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { setDoc, doc } from "firebase/firestore"; // Firestore functions
import { FiEye, FiEyeOff } from "react-icons/fi";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user details in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        password: password,
      });

      toast.success("Sign-up successful!");
      navigate("/");
    } catch (error) {
      setError("Failed to sign up. Please check your details and try again.");
      toast.error(error.message);
    }
  };

  return (
    <div className="auth flex flex-col items-center gap-4 p-6  rounded-md">
      <h1 className="text-2xl font-bold">Sign Up</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex flex-col gap-4" >
      <input
        type="text"
        placeholder="Name"
        className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-800 transition"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-800 transition"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div className="relative w-full  max-w-xs">
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-800 transition"
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
      <button onClick={handleSignUp} className="py-2 px-4 bg-gray-800 hover:bg-gray-600 text-white rounded">
        Sign Up
      </button>
    </div>
  );
};

export default Signup;
