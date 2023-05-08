import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Cookies from "js-cookie";

const useAuthentication = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (token) => {
    Cookies.set("token", token);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    Cookies.remove("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return {
    isLoggedIn,
    handleLogin,
    handleLogout,
  };
};

export default useAuthentication;
