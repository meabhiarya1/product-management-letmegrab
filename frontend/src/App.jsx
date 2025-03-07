import { Routes, Route } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Dashboard from "./Pages/Dashboard/Dashboard";
import NotFound from "./Pages/NotFound/NotFound";
// import withAuth from "./HOC/withAuth"; // HOC for authentication

// const ProtectedDashboard = withAuth(Dashboard);

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      {/* <Route path="/dashboard" element={<ProtectedDashboard />} /> */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
