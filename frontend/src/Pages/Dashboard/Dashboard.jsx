import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../../Comp/Navbar/Navbar";
import Dropdown from "../../Comp/Dropdown/Dropdown";
import FilterDropDown from "../../Comp/Dropdown/FilterDropDown";
import Modal from "../../Comp/Modal/Modal";
import { FaEdit } from "react-icons/fa";
import { MdAutoDelete } from "react-icons/md";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(5);
  const [dropDown, setDropDown] = useState(false);
  const [filterDropDown, setFilterDropDown] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [operation, setOperation] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loader, setLoader] = useState(false);
  const [filterWithSubHeader, setFilterWithSubHeader] = useState({
    filterHeader: "",
    filterSubHeader: "",
  });
  const headers = [
    "Product ID",
    "Product Name",
    "Price",
    "Category",
    "Material",
    "Media_URL",
    "SKU_ID",
    "Operations",
  ];
  const navigate = useNavigate();
  // Retrieve token from localStorage
  const token = localStorage.getItem("token");
  // Fetch products from API
  useEffect(() => {
    fetchedProductsWithFilter(currentPage);
  }, [currentPage, limit, totalPages, filterWithSubHeader]);

  // Reset current page to 1 when dropdown is closed
  useEffect(() => {
    if (!dropDown) {
      setCurrentPage(1);
    }
  }, [dropDown]);

  const fetchedProductsWithFilter = async (page) => {
    try {
      if (filterWithSubHeader.filterHeader === "product_name") {
        const response = await axios.get(
          `${
            import.meta.env.VITE_REACT_APP_BACKEND_URL
          }/api/products?page=${page}&limit=${limit}&${
            filterWithSubHeader.filterHeader
          }=${filterWithSubHeader.filterSubHeader}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Attach token in Authorization header
            },
          }
        );
        console.log(response.data);
        setProducts(response?.data?.products);
        setTotalPages(Math.ceil(response?.data?.total_count / limit));
      } else if (filterWithSubHeader.filterHeader === "") {
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
        // console.log(response?.data);
        setProducts(response?.data?.products);
        setTotalPages(Math.ceil(response?.data?.total_count / limit));
      } else if (filterWithSubHeader.filterHeader === "SKU_VALUE") {
        const response = await axios.get(
          `${
            import.meta.env.VITE_REACT_APP_BACKEND_URL
          }/api/products?page=${page}&limit=${limit}&SKU=${
            filterWithSubHeader.filterSubHeader
          }`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Attach token in Authorization header
            },
          }
        );
        // console.log(response?.data);
        setProducts(response?.data?.products);
        setTotalPages(Math.ceil(response?.data?.total_count / limit));
      } else if (filterWithSubHeader.filterHeader === "category_name") {
        const response = await axios.get(
          `${
            import.meta.env.VITE_REACT_APP_BACKEND_URL
          }/api/products?page=${page}&limit=${limit}&category_id=${
            filterWithSubHeader.filterSubHeader
          }`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Attach token in Authorization header
            },
          }
        );
        // console.log(response?.data);
        setProducts(response?.data?.products);
        setTotalPages(Math.ceil(response?.data?.total_count / limit));
      } else if (filterWithSubHeader.filterHeader === "material_name") {
        const response = await axios.get(
          `${
            import.meta.env.VITE_REACT_APP_BACKEND_URL
          }/api/products?page=${page}&limit=${limit}&material_id=${
            filterWithSubHeader.filterSubHeader
          }`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Attach token in Authorization header
            },
          }
        );
        // console.log(response?.data);
        setProducts(response?.data?.products);
        setTotalPages(Math.ceil(response?.data?.total_count / limit));
      } else if (filterWithSubHeader.filterHeader === "price") {
        const response = await axios.get(
          `${
            import.meta.env.VITE_REACT_APP_BACKEND_URL
          }/api/products/price-range?page=${page}&limit=${limit}&range=${
            filterWithSubHeader.filterSubHeader
          }`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Attach token in Authorization header
            },
          }
        );
        // console.log(response?.data);
        setProducts(response?.data?.products);
        setTotalPages(Math.ceil(response?.data?.total_count / limit));
      } else if (filterWithSubHeader.filterHeader === "media_url") {
        const response = await axios.get(
          `${
            import.meta.env.VITE_REACT_APP_BACKEND_URL
          }/api/products/without-media?page=${page}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Attach token in Authorization header
            },
          }
        );
        // console.log(response?.data);
        setProducts(response?.data);
        setTotalPages(Math.ceil(response?.data?.total_count / limit));
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      console.log(error?.response?.status);
      if (error?.response?.status === 403) {
        // Unauthorized
        localStorage.removeItem("token");
        toast.error("Token Expired. Please login again");
        navigate("/"); // Redirect to login page
      }
      toast.error("Failed to fetch products");
    }
  };

  console.log(filterWithSubHeader);

  // Handle Add/Update
  const handleSaveProduct = async (product) => {
    setLoader(true);
    if (selectedProduct && operation === "Update") {
      // Update existing product in the list
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/products/${
            product.product_id
          }`,
          product,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Attach token in Authorization header
            },
          }
        );
        // console.log(response);
        setProducts(
          products.map((p) =>
            p.product_id === product.product_id ? { ...p, ...product } : p
          )
        );
        toast.success("Product Updated successfully");
        setOpenModal(false); // Close modal
        setSelectedProduct(null); // Reset selected product
        setOperation("");
      } catch (error) {
        console.error("Error saving product:", error);
        toast.error(error.response.data.error || "Failed to update product");
      } finally {
        setLoader(false);
      }
    } else if (product && operation === "Add") {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/products`,
          product,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Attach token in Authorization header
            },
          }
        );
        // console.log(response);
        setProducts([...products, response?.data?.product]);
        toast.success("Product saved successfully");
        setOpenModal(false); // Close modal
        setSelectedProduct(null); // Reset selected product
        setOperation("");
      } catch (error) {
        console.error("Error saving product:", error);
        toast.error(error.response.data.error || "Failed to save product");
      } finally {
        setLoader(false);
      }
    }
  };

  const handleDelete = async (product) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/products/${
          product.product_id
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remove deleted product from the list
      setProducts((prevProducts) =>
        prevProducts.filter((p) => p.product_id !== product.product_id)
      );

      // Recalculate total pages after deletion
      setTotalPages((prevTotalPages) =>
        Math.ceil((totalPages * limit - 1) / limit)
      );
    } catch (error) {
      console.error("Error deleting product:", error);
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
    <div className="min-h-screen flex flex-col items-end p-6 bg-gray-100 ">
      {/* Navbar */}
      <Navbar handleLogout={handleLogout} />

      {/* Add Product */}
      <div className="w-[400px] flex justify-between items-end mt-3">
        <div
          class="flex justify-center items-center gap-12 h-full"
          onClick={() => {
            setOperation("Add");
            setOpenModal(!openModal);
          }}
        >
          <div class="bg-gradient-to-b from-gray-600 to-gray-700 rounded-[8px] px-3 py-2 cursor-pointer">
            <div class="flex gap-2 items-center">
              <span class="font-semibold text-white">Add Product</span>
            </div>
          </div>
        </div>

        {/* Clear Filters */}
        <div
          class="flex justify-center items-center gap-12 h-full"
          onClick={() =>
            setFilterWithSubHeader({
              filterHeader: "",
              filterSubHeader: "",
            })
          }
        >
          <div class="bg-gradient-to-b from-blue-600 to-gray-700 rounded-[8px] px-3 py-2 cursor-pointer">
            <div class="flex gap-2 items-center">
              <span class="font-semibold text-white">Clear Filters</span>
            </div>
          </div>
        </div>

        <Dropdown
          setDropDown={setDropDown}
          dropDown={dropDown}
          setLimit={setLimit}
          limit={limit}
        />
      </div>
      {/* Modal */}
      {openModal && (
        <Modal
          setOpenModal={setOpenModal}
          operation={operation}
          selectedProduct={selectedProduct}
          handleSaveProduct={handleSaveProduct}
          loader={loader}
          setSelectedProduct={setSelectedProduct}
        />
      )}
      {/* Table */}
      <div className="w-full mt-2 overflow-x-auto bg-white shadow-md rounded-lg max-h-[580px] min-h-[200px]">
        <table className="w-full bg-white shadow-md rounded-lg overflow-y-auto">
          <FilterDropDown
            headers={headers}
            filterDropDown={filterDropDown}
            setFilterDropDown={setFilterDropDown}
            products={products}
            setFilterWithSubHeader={setFilterWithSubHeader}
          />

          <tbody className="text-gray-700">
            {products?.length > 0 ? (
              products?.map((product) => (
                <tr key={product?.product_id} className="border-b">
                  <td className="p-3 text-center">{product?.product_id}</td>
                  <td className="p-3 text-center">{product?.product_name}</td>
                  <td className="p-3 text-center">${product?.price}</td>
                  <td className="p-3 text-center">{product?.category_name}</td>
                  <td className="p-3 text-center">{product?.material_name}</td>
                  <td className="p-3 text-center">{product?.media_url}</td>
                  <td className="p-3 text-center">{product?.SKU_VALUE}</td>

                  <td className="p-3 text-center flex ">
                    <FaEdit
                      className="cursor-pointer mx-auto"
                      size={23}
                      onClick={() => {
                        setOperation("Update");
                        setSelectedProduct(product);
                        setOpenModal(!openModal);
                      }}
                    />
                    <MdAutoDelete
                      className="cursor-pointer mx-auto"
                      size={23}
                      onClick={() => {
                        handleDelete(product);
                      }}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-3 text-center text-gray-500">
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
