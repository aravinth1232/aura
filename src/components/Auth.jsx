import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";
import { doc, getDoc } from "firebase/firestore";

const Auth = () => {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch user name from Firestore
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUserName(userDoc.data().name);
        }
      } else {
        setUserName("");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logout successful!");
      navigate("/");
    } catch (error) {
      toast.error("Failed to logout: " + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-gray-100 rounded-md">
      {user ? (
        <>
          <h1 className="text-2xl font-bold">Welcome, {userName}</h1>
          <button onClick={handleLogout} className="p-2 bg-red-500 text-white rounded">
            Logout
          </button>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold">Authentication</h1>
          <Link to="/login" className="p-2 bg-blue-500 text-white rounded">
            Go to Login
          </Link>
          <Link to="/signup" className="p-2 bg-green-500 text-white rounded">
            Go to Sign Up
          </Link>
        </>
      )}
    </div>
  );
};

export default Auth;
