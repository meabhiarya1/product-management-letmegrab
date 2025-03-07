import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const withAuth = (Component) => (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/", { replace: true });
    } else if (token && location.pathname === "/") {
      navigate("/dashboard", { replace: true });
    }
  }, [token, navigate, location.pathname]);

  return token ? <Component {...props} /> : null;
};

export default withAuth;
