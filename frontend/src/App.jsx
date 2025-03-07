import { Routes, Route } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Dashboard from "./Pages/Dashboard/Dashboard";
import NotFound from "./Pages/NotFound/NotFound";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles
// import withAuth from "./HOC/withAuth"; // HOC for authentication

// const ProtectedDashboard = withAuth(Dashboard);

const App = () => {
  return (
    <>
      {/* ✅ ToastContainer should be placed outside Routes */}
      <ToastContainer autoClose={3000} position="top-right" />

      <Routes>
        <Route path="/" element={<Login />} />
        {/* <Route path="/dashboard" element={<ProtectedDashboard />} /> */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
