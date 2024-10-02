import React, { useState } from "react";
import FileUploader from "./FileUploader";

const Home = () => {
  
  return (
    <div className="home">
      {/* <h1 className="text-2xl font-bold mb-4">Home Page</h1> */}
      <FileUploader />
    </div>
  );
};

export default Home;
