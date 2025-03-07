import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const withAuth = (Component) => (props) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/");
  }, [navigate]);

  return localStorage.getItem("token") ? <Component {...props} /> : null;
};

export default withAuth;
