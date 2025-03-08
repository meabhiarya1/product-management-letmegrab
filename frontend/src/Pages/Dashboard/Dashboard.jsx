import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  // Fetch products from API
  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const fetchProducts = async (page) => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage

      const response = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_BACKEND_URL
        }/api/products?page=${page}&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token in Authorization header
          },
        }
      );
      setProducts(response?.data);
      // setTotalPages(response?.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      console.log(error?.response?.status)
      if (error?.response?.status === 403) {
        // Unauthorized
        toast.error("Token Expired. Please login again");
        navigate("/"); // Redirect to login page
      }
      toast.error("Failed to fetch products");
    }
  };

  console.log(products);

  // Logout Functionality
  const handleLogout = () => {
    // Remove the token directly from localStorage
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    // Redirect the user to the login page
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gray-100">
      {/* Navbar */}
      <div className="w-full flex justify-between items-center bg-blue-600 p-4 text-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      {/* Table */}
      <div className="w-full max-w-4xl mt-6 overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="p-3">Product ID</th>
              <th className="p-3">Product Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Category</th>
              <th className="p-3">Materials</th>
              <th className="p-3">Media_URL</th>
            </tr>
          </thead>
          <tbody>
            {products?.length > 0 ? (
              products?.map((product) => (
                <tr key={product.id} className="border-b">
                  <td className="p-3 text-center">{product.product_id}</td>
                  <td className="p-3 text-center">{product.product_name}</td>
                  <td className="p-3 text-center">${product.price}</td>
                  <td className="p-3 text-center">{product.category_name}</td>
                  <td className="p-3 text-center">{product.material_names}</td>
                  <td className="p-3 text-center">{product.media_url}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-3 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-gray-300 px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-4 py-2 bg-white border rounded-lg">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="bg-gray-300 px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
