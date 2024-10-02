// import React, { useState } from "react";
// import { storage } from "../../firebase";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// const FileUploader = () => {
//   const [file, setFile] = useState(null);
//   const [uploadProgress, setUploadProgress] = useState(0);

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (file) {
//       const storageRef = ref(storage, `uploads/${file.name}`);
//       try {
//         const snapshot = await uploadBytes(storageRef, file);
//         const url = await getDownloadURL(snapshot.ref);
//         alert("File uploaded successfully. File URL: " + url);
//       } catch (error) {
//         alert(error.message);
//       }
//     }
//   };

//   return (
//     <div className="flex flex-col items-center gap-4 p-6 bg-gray-100 rounded-md">
//       <input type="file" onChange={handleFileChange} className="p-2" />
//       <button onClick={handleUpload} className="p-2 bg-blue-500 text-white rounded">
//         Upload File
//       </button>
//     </div>
//   );
// };

// export default FileUploader;


// 2

// import React, { useState, useEffect } from "react";
// import { storage, db, auth } from "../../firebase";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { FaSpinner } from "react-icons/fa";
// import Gallery from "./Gallery";

// const FileUploader = () => {
//   const [file, setFile] = useState(null);
//   const [fileType, setFileType] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [uploads, setUploads] = useState([]);

//   useEffect(() => {
//     const fetchUploads = async () => {
//       const currentUser = auth.currentUser;
//       if (currentUser) {
//         // Fetch uploads from Firestore for logged-in user
//         try {
//           const userDocRef = doc(db, "users", currentUser.uid);
//           const userDoc = await getDoc(userDocRef);
//           if (userDoc.exists()) {
//             const userData = userDoc.data();
//             setUploads(userData.uploads || []);
//           }
//         } catch (err) {
//           console.error("Error fetching uploads:", err);
//           toast.error("Error fetching uploads!");
//         }
//       } else {
//         // Load uploads from local storage for guest user
//         const localUploads = JSON.parse(localStorage.getItem("guestUploads")) || [];
//         setUploads(localUploads);
//       }
//     };

//     fetchUploads();
//   }, []);

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       setFile(selectedFile);
//       setFileType(selectedFile.type);
//     }
//   };

//   const handleUpload = async () => {
//     if (!file) return;

//     setIsLoading(true);
//     const currentUser = auth.currentUser;

//     if (currentUser) {
//       // Upload for logged-in user
//       const storageRef = ref(storage, `uploads/${currentUser.uid}/${file.name}`);
//       try {
//         await uploadBytes(storageRef, file);
//         const downloadURL = await getDownloadURL(storageRef);

//         // Update Firestore with file information
//         const userDocRef = doc(db, "users", currentUser.uid);
//         await updateDoc(userDocRef, {
//           uploads: arrayUnion({ fileName: file.name, url: downloadURL, type: fileType }),
//         });

//         setUploads((prevUploads) => [...prevUploads, { fileName: file.name, url: downloadURL, type: fileType }]);
//         setFile(null);
//         setFileType("");
//         toast.success("File uploaded successfully!");
//       } catch (err) {
//         console.error("Error uploading file:", err);
//         toast.error("Error uploading file!");
//       } finally {
//         setIsLoading(false);
//       }
//     } else {
//       // Upload for guest user (local storage)
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         const newUpload = { fileName: file.name, url: reader.result, type: fileType };
//         const localUploads = JSON.parse(localStorage.getItem("guestUploads")) || [];
//         localUploads.push(newUpload);
//         localStorage.setItem("guestUploads", JSON.stringify(localUploads));
//         setUploads(localUploads);
//         setFile(null);
//         setFileType("");
//         toast.success("File uploaded successfully!");
//         setIsLoading(false);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen">
//       <h2 className="text-2xl mb-4">File Uploader</h2>
//       <input type="file" onChange={handleFileChange} className="mb-4" />
//       {file && (
//         <div className="mb-4">
//           <p>File Type: {fileType}</p>
//         </div>
//       )}
//       <button
//         onClick={handleUpload}
//         className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center ${
//           isLoading ? "opacity-50 cursor-not-allowed" : ""
//         }`}
//         disabled={isLoading}
//       >
//         {isLoading ? (
//           <>
//             <FaSpinner className="animate-spin mr-2" /> Uploading...
//           </>
//         ) : (
//           "Upload File"
//         )}
//       </button>

//       {/* Gallery Component */}
//       <Gallery uploads={uploads} setUploads={setUploads} />

//       <ToastContainer />
//     </div>
//   );
// };

// export default FileUploader;




import React, { useState } from "react";
import { storage, db, auth } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSpinner } from "react-icons/fa";
import { MdUploadFile } from "react-icons/md";

const FileUploader = () => {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileType(selectedFile.type);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsLoading(true);
    const currentUser = auth.currentUser;

    if (currentUser) {
      // Upload for logged-in user
      const storageRef = ref(storage, `uploads/${currentUser.uid}/${file.name}`);
      try {
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        // Update Firestore with file information
        const userDocRef = doc(db, "users", currentUser.uid);
        await updateDoc(userDocRef, {
          uploads: arrayUnion({ fileName: file.name, url: downloadURL, type: fileType }),
        });

        setFile(null);
        setFileType("");
        toast.success("File uploaded successfully! View in Gallery");
      } catch (err) {
        console.error("Error uploading file:", err);
        toast.error("Error uploading file!");
      } finally {
        setIsLoading(false);
      }
    } else {
      // Upload for guest user (local storage)
      const reader = new FileReader();
      reader.onloadend = () => {
        const newUpload = { fileName: file.name, url: reader.result, type: fileType };
        const localUploads = JSON.parse(localStorage.getItem("guestUploads")) || [];
        localUploads.push(newUpload);
        localStorage.setItem("guestUploads", JSON.stringify(localUploads));
        toast.success("File uploaded success! View gallery");
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className=" flex flex-col items-center py-4  gap-7 min-h-svh md:min-h-screen">
      {/* <h2 className="text-2xl mb-4">File Uploader</h2> */}
      <label className="flex items-center justify-center w-3/4 h-64 border border-black px-4 py-2  text-white rounded cursor-pointer  ">
        <MdUploadFile color="black" size={64} />
        <input
          type="file"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
      {file ? (
        <div className="mb-2">
          <p className="text-lg">Choosen File Type: {fileType} </p>
        </div>
      )
      :
      (
        <div className="mb-4">
          <p className="text-lg text-transparent select-none">Choosen File Type: {fileType}  </p>
        </div>
      )
    }
      <button
        onClick={handleUpload}
        className={` bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <FaSpinner className="animate-spin mr-2" /> Uploading...
          </>
        ) : (
          "Upload "
        )}
      </button>

      <ToastContainer />
    </div>
  );
};

export default FileUploader;
