import React, { useState } from "react";
import Loader from "../Loader/Loader";

const Modal = ({
  setOpenModal,
  operation,
  selectedProduct,
  handleSaveProduct,
  loader,
}) => {
  const [createdProduct, setCreatedProduct] = useState({
    SKU: "",
    product_name: "",
    category_name: "",
    material_name: "",
    price: "",
    media_url: "",
  });
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-blur bg-opacity-50"
      style={{ zIndex: 100 }}
    >
      <div className="max-w-lg w-full mx-auto bg-gray-600 rounded-xl overflow-hidden">
        <div className="max-w-md mx-auto pt-12 pb-14 px-5 text-center">
          <h4 className="text-md text-gray-100 font-semibold mb-5">
            {operation} Product
          </h4>

          {/* SKU */}
          <div className="flex flex-col mb-4 text-left">
            <label className="text-gray-100 mb-1">SKU:</label>
            <input
              className="bg-[#222630] px-4 py-3 outline-none w-full text-white rounded-lg border-2 transition-colors duration-100 border-solid focus:border-[#596A95] border-[#2B3040]"
              placeholder="Enter SKU"
              type="text"
              value={selectedProduct?.SKU_VALUE}
              required
              onChange={(e) => {
                setCreatedProduct({ ...createdProduct, SKU: e.target.value });
              }}
            />
          </div>

          {/* Product Name */}
          <div className="flex flex-col mb-4 text-left">
            <label className="text-gray-100 mb-1">Product Name:</label>
            <input
              className="bg-[#222630] px-4 py-3 outline-none w-full text-white rounded-lg border-2 transition-colors duration-100 border-solid focus:border-[#596A95] border-[#2B3040]"
              placeholder="Enter Product Name"
              type="text"
              value={selectedProduct?.product_name}
              required
              onChange={(e) => {
                setCreatedProduct({
                  ...createdProduct,
                  product_name: e.target.value,
                });
              }}
            />
          </div>

          {/* Category Name */}
          <div className="flex flex-col mb-4 text-left">
            <label className="text-gray-100 mb-1">Category Name:</label>
            <input
              className="bg-[#222630] px-4 py-3 outline-none w-full text-white rounded-lg border-2 transition-colors duration-100 border-solid focus:border-[#596A95] border-[#2B3040]"
              placeholder="Enter Category Name"
              type="text"
              value={selectedProduct?.category_name}
              required
              onChange={(e) => {
                setCreatedProduct({
                  ...createdProduct,
                  category_name: e.target.value,
                });
              }}
            />
          </div>

          {/* Material Names */}
          <div className="flex flex-col mb-4 text-left">
            <label className="text-gray-100 mb-1">Material Name:</label>
            <input
              className="bg-[#222630] px-4 py-3 outline-none w-full text-white rounded-lg border-2 transition-colors duration-100 border-solid focus:border-[#596A95] border-[#2B3040]"
              placeholder="Enter Material Name"
              type="text"
              value={selectedProduct?.material_name}
              required
              onChange={(e) => {
                setCreatedProduct({
                  ...createdProduct,
                  material_name: e.target.value,
                });
              }}
            />
          </div>

          {/* Price */}
          <div className="flex flex-col mb-4 text-left">
            <label className="text-gray-100 mb-1">Price:</label>
            <input
              className="bg-[#222630] px-4 py-3 outline-none w-full text-white rounded-lg border-2 transition-colors duration-100 border-solid focus:border-[#596A95] border-[#2B3040]"
              placeholder="Enter Price"
              type="text"
              value={selectedProduct?.price}
              required
              onChange={(e) => {
                setCreatedProduct({ ...createdProduct, price: e.target.value });
              }}
            />
          </div>

          {/* Media URL */}
          <div className="flex flex-col mb-4 text-left">
            <label className="text-gray-100 mb-1">Media URL:</label>
            <input
              className="bg-[#222630] px-4 py-3 outline-none w-full text-white rounded-lg border-2 transition-colors duration-100 border-solid focus:border-[#596A95] border-[#2B3040]"
              placeholder="Enter Media URL"
              type="text"
              value={selectedProduct?.media_url}
              required
              onChange={(e) => {
                setCreatedProduct({
                  ...createdProduct,
                  media_url: e.target.value,
                });
              }}
            />
          </div>
        </div>

        <div className="pt-5 pb-6 px-6 text-right bg-gray-600 -mb-2">
          <button
            onClick={() => setOpenModal(false)}
            className="inline-block w-full sm:w-auto py-3 px-5 mb-2 mr-4 text-center font-semibold leading-6 text-gray-200 bg-gray-500 hover:bg-gray-400 rounded-lg transition duration-200"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              operation === "Add"
                ? handleSaveProduct(createdProduct)
                : handleSaveProduct(createdProduct)
            }
            className="inline-block w-full sm:w-auto py-3 px-5 mb-2 text-center font-semibold leading-6 text-blue-50 bg-green-500 hover:bg-green-600 rounded-lg transition duration-200"
          >
            {loader ? <Loader className="animate-spin size-5" /> : operation}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
