import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem("token"); // Check token existence

    useEffect(() => {
      if (!isAuthenticated) {
        navigate("/login"); // Redirect to login if not authenticated
      }
    }, [isAuthenticated, navigate]);

    return isAuthenticated ? <WrappedComponent {...props} /> : null;
  };
};

export default withAuth;
