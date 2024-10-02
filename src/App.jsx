
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Home from "./components/Home"
import Navbar from './components/Navbar'
import Gallery from './components/Gallery'
import Auth from './components/Auth'
import Login from "./components/Login"
import Signup from "./components/SignUp";
import DropMenu from "./components/DropMenu";



function App() {


  return (
    <>

    <Router>
    <Navbar />
    <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/drop" element={<DropMenu /> } />
          <Route path="/auth" element={<Auth />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>

    </Router>
     

    
    </>
  )
}

export default App
