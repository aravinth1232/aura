import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";
import { doc, getDoc } from "firebase/firestore";
import { FaRegUser } from "react-icons/fa";






const DropMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();


  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const closeMenu = () => {
    setIsOpen(false);
  };

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
    <div className="relative">
      <button
        onClick={toggleMenu}
        className=" text-white rounded"
      >
        <FaRegUser size={20} />
      </button>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0.5, x: 20 }}
          className="absolute top-full mt-4 -left-16 bg-white shadow-md rounded"
        >
          {user ? (
        <>
          {/* <h1 className="text-2xl font-bold">Welcome, {userName}</h1> */}
          <button onClick={()=>
          {
             handleLogout()
            closeMenu()
          }}  className=" text-black  w-24 py-4 px-3 rounded">
            Logout
          </button>
        </>
      ) :(          
          <ul className="flex flex-col gap-3 w-24 py-4 px-3 ">
            
            <Link 
            onClick={closeMenu}
            to="/login" className=" text-black rounded">
             Login
                </Link>
           
            <Link 
            onClick={closeMenu}
            to="/signup" className=" text-black rounded">
            Sign Up
          </Link>
           
          </ul>

      )}
        </motion.div>
      )}
    </div>
  );
};

export default DropMenu;
