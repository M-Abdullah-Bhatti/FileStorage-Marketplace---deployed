import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Users/Login";
import SignUp from "./pages/Users/SignUp";
import Navbar from "./components/Navbar/Navbar";
import AllUploadedFiles from "./pages/Dashboard/AllUploadedFiles";
import AllSharedFiles from "./pages/Dashboard/AllSharedFiles";
import AllUnsharedFiles from "./pages/Dashboard/AllUnsharedFiles";
import AllReceivedFiles from "./pages/Dashboard/AllReceivedFiles";
import IFrame from "./pages/Dashboard/IFrame";

import Home from "./pages/Home/Home";
import FilesForSale from "./pages/FilesForSale/FilesForSale";
import Footer from "./components/Footer/Footer";
import UploadFile from "./pages/UploadFile/UploadFile";
import Profile from "./pages/Users/Profile";
import useAuthentication from "./customHooks/useAuthentication";

function App() {
  const { isLoggedIn, handleLogin, handleLogout } = useAuthentication();
  return (
    <div className="App">
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <ToastContainer position="top-center" autoClose={3000} />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/filesforsale" element={<FilesForSale />} />
        <Route path="/uploadfile" element={<UploadFile />} />
        {/* Dashboard Routes */}
        <Route path="/myalluploadedfiles" element={<AllUploadedFiles />} />
        <Route path="/myallsharedfiles" element={<AllSharedFiles />} />
        <Route path="/myallunsharedfiles" element={<AllUnsharedFiles />} />
        <Route path="/myallreceivedfiles" element={<AllReceivedFiles />} />
        <Route exact path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login handleLogin={handleLogin} />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/see/:decrypted" element={<IFrame />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;

// 9012393383baacbaae91b9c349f47c1850c9b5d2745051f10f8202a4c8be033d

// Ibrahim
// mongodb+srv://Ibrahim:<Ibrahim>@cluster0.b0htjfc.mongodb.net/test

// Ibrahim Almutairi
// Naif Alanazi
