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
    material_names: [],
    price: "",
    media_url: "",
  });
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-blur bg-opacity-50"
      style={{ zIndex: 100 }}
    >
      <div className="max-w-xl w-full mx-auto bg-gray-600 rounded-xl overflow-hidden">
        <div className="max-w-md mx-auto pt-12 pb-14 px-5 text-center">
          <h4 className="text-xl text-gray-100 font-semibold mb-5">
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
            />
          </div>

          {/* Material Names */}
          <div className="flex flex-col mb-4 text-left">
            <label className="text-gray-100 mb-1">Material Names:</label>
            <input
              className="bg-[#222630] px-4 py-3 outline-none w-full text-white rounded-lg border-2 transition-colors duration-100 border-solid focus:border-[#596A95] border-[#2B3040]"
              placeholder="Enter Material Names"
              type="text"
              value={selectedProduct?.material_names}
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
            {loader ? <Loader /> : operation}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
