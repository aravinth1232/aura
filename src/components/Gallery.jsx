// import React from "react";

// const Gallery = () => {
//   return (
//     <div className="gallery">
//       <h1 className="text-2xl font-bold mb-4">Gallery Page</h1>
//       <p>Gallery content will be displayed here.</p>
//     </div>
//   );
// };

// export default Gallery;

// 2

// import React, { useEffect, useState } from "react";
// import { storage, auth, db } from "../../firebase";
// import { ref, deleteObject } from "firebase/storage";
// import { doc, updateDoc, arrayRemove } from "firebase/firestore";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { FaSpinner } from "react-icons/fa";

// const Gallery = ({ uploads, setUploads }) => {
//   const [deleting, setDeleting] = useState(null);

//   const handleDelete = async (upload) => {
//     setDeleting(upload.fileName);
//     const currentUser = auth.currentUser;

//     if (currentUser) {
//       // Delete for logged-in user
//       const storageRef = ref(storage, `uploads/${currentUser.uid}/${upload.fileName}`);
//       try {
//         await deleteObject(storageRef);

//         // Update Firestore to remove file information
//         const userDocRef = doc(db, "users", currentUser.uid);
//         await updateDoc(userDocRef, {
//           uploads: arrayRemove(upload),
//         });

//         setUploads((prevUploads) => prevUploads.filter((item) => item.fileName !== upload.fileName));
//         toast.success("File deleted successfully!");
//       } catch (err) {
//         console.error("Error deleting file:", err);
//         toast.error("Error deleting file!");
//       } finally {
//         setDeleting(null);
//       }
//     } else {
//       // Delete for guest user (local storage)
//       const localUploads = JSON.parse(localStorage.getItem("guestUploads")) || [];
//       const updatedUploads = localUploads.filter((item) => item.fileName !== upload.fileName);
//       localStorage.setItem("guestUploads", JSON.stringify(updatedUploads));
//       setUploads(updatedUploads);
//       toast.success("File deleted successfully!");
//       setDeleting(null);
//     }
//   };

//   return (
//     <div className="gallery mt-8">
//       {/* <h2 className="text-2xl mb-4">Uploaded Files</h2> */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         {uploads.map((upload) => (
//           <div key={upload.fileName} className="border p-4 rounded shadow">
//             <p className="mb-2 font-semibold">{upload.fileName}</p>
//             <img src={upload.url} alt={upload.fileName} className="w-full h-32 object-cover mb-2" />
//             <button
//               onClick={() => handleDelete(upload)}
//               className={`bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center ${
//                 deleting === upload.fileName ? "opacity-50 cursor-not-allowed" : ""
//               }`}
//               disabled={deleting === upload.fileName}
//             >
//               {deleting === upload.fileName ? (
//                 <>
//                   <FaSpinner className="animate-spin mr-2" /> Deleting...
//                 </>
//               ) : (
//                 "Delete"
//               )}
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Gallery;
import React, { useEffect, useState } from "react";
import { db, storage, auth } from "../../firebase";
import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSpinner } from "react-icons/fa";
import { onAuthStateChanged } from "firebase/auth";
import { MdUploadFile } from "react-icons/md";


const Gallery = () => {
  const [uploads, setUploads] = useState([]);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    // Function to fetch uploads
    const fetchUploads = async (user) => {
      if (user) {
        // Fetch uploads from Firestore for logged-in user
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUploads(userData.uploads || []);
          }
        } catch (err) {
          console.error("Error fetching uploads:", err);
          toast.error("Error fetching uploads!");
        }
      } else {
        // Load uploads from local storage for guest user
        const localUploads = JSON.parse(localStorage.getItem("guestUploads")) || [];
        setUploads(localUploads);
      }
    };

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      fetchUploads(user);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (upload) => {
    setDeleting(upload.fileName);
    const currentUser = auth.currentUser;

    if (currentUser) {
      // Delete for logged-in user
      const storageRef = ref(storage, `uploads/${currentUser.uid}/${upload.fileName}`);
      try {
        await deleteObject(storageRef);

        // Update Firestore to remove file information
        const userDocRef = doc(db, "users", currentUser.uid);
        await updateDoc(userDocRef, {
          uploads: arrayRemove(upload),
        });

        setUploads((prevUploads) => prevUploads.filter((item) => item.fileName !== upload.fileName));
        toast.success("File deleted successfully!");
      } catch (err) {
        console.error("Error deleting file:", err);
        toast.error("Error deleting file!");
      } finally {
        setDeleting(null);
      }
    } else {
      // Delete for guest user (local storage)
      const localUploads = JSON.parse(localStorage.getItem("guestUploads")) || [];
      const updatedUploads = localUploads.filter((item) => item.fileName !== upload.fileName);
      localStorage.setItem("guestUploads", JSON.stringify(updatedUploads));
      setUploads(updatedUploads);
      toast.success("File deleted successfully!");
      setDeleting(null);
    }
  };

  return (
    <div className="flex flex-col  min-h-screen">
      {/* <h2 className="text-2xl mb-4">Gallery</h2> */}
    
    {uploads.length > 0  ? (
      <>     
     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 px-4 py-4">
        {uploads.map((upload, index) => (
          <div key={index} className="border flex flex-col p-4 gap-5 shadow-md rounded relative">
            {/* <img src={upload.url} alt={upload.fileName} className="w-full h-32 object-cover mb-2" /> */}

            <a href={upload.url} target="_blank" rel="noopener noreferrer">
            <MdUploadFile size={48}
            className="self-center"
            /></a>
            <p>{upload.fileName}</p>
            <button
              onClick={() => handleDelete(upload)}
              className={`bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 absolute top-2 right-2 ${
                deleting === upload.fileName ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={deleting === upload.fileName}
            >
              {deleting === upload.fileName ? (
                <FaSpinner className="animate-spin" />
              ) : (
                "x"
              )}
            </button>
          </div>
        ))}        
      </div>
      </>
  ) :(
      <div className="flex justify-center items-center h-screen">
      <p className="text-lg " >No files</p>
      </div>
    )}



      <ToastContainer />
    </div>
  );
};

export default Gallery;
