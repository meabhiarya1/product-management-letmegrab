import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../../Comp/Navbar/Navbar";
import SubNavbar from "../../Comp/SubNavbar/SubNavbar";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(5);
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
        }/api/products?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token in Authorization header
          },
        }
      );
      console.log(response.data);
      setProducts(response?.data?.products);
      setTotalPages(Math.ceil(response?.data?.total_count / limit));
    } catch (error) {
      console.error("Error fetching products:", error);
      console.log(error?.response?.status);
      if (error?.response?.status === 403) {
        // Unauthorized
        toast.error("Token Expired. Please login again");
        navigate("/"); // Redirect to login page
      }
      toast.error("Failed to fetch products");
    }
  };

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
      <Navbar handleLogout={handleLogout} />

      {/* Table */}
      <SubNavbar className="mt-4" />
      <div className="w-full mt-6 overflow-x-auto bg-white shadow-md rounded-lg max-h-[580px]">
        <table className="w-full bg-white shadow-md rounded-lg overflow-y-auto">
          <thead className="bg-blue-500 text-white ">
            <tr className="">
              <th className="p-3">Product ID</th>
              <th className="p-3">Product Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Category</th>
              <th className="p-3">Materials</th>
              <th className="p-3">Media_URL</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
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
                <td colSpan="6" className="p-3 text-center text-gray-500">
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
