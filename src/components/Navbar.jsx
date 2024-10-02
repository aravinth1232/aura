import DropMenu from "./DropMenu";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../../firebase";
import {  onAuthStateChanged } from "firebase/auth";
// import { toast } from "react-toastify";
import { doc, getDoc } from "firebase/firestore";


const Navbar = () => {

  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");


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


  return (
    <nav className="flex justify-between items-center py-5 px-4 md:px-14 bg-gray-800 text-white">
      <div>


      <Link to="/" className="text-lg font-bold">    

    {user ?  <h1 className="text-md md:text-2xl font-bold"> {userName}</h1> 
          : <h1 className="text-md md:text-2xl font-bold"> Guest</h1>
          }
      </Link>
      </div>
      <div className="flex items-center gap-7 px-4">
        <Link to="/gallery"
        className="text-lg font-bold"
        >Gallery</Link>
        {/* <Link to="/auth">Login/Signup</Link> */}
        <DropMenu />

      </div>
    </nav>
  );
};

export default Navbar;
