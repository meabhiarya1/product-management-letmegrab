import Login from "./Pages/Login/Login";
import Dashboard from "./Pages/Dashboard/Dashboard";
import NotFound from "./Pages/NotFound/NotFound";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles
import withAuth from "./HOC/withAuth.jsx"; // HOC for authentication
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  const ProtectedDashboard = withAuth(Dashboard);

  return (
    <Router>
      {" "}
      {/* ✅ Router should wrap everything */}
      <ToastContainer autoClose={3000} position="top-right" />{" "}
      {/* ✅ ToastContainer inside Router */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
