import React from "react";

const CategoryWiseHighestPriceModal = ({
  setCategoryWiseHighestPrice,
  categoryWiseHighestPrice,
  highestData,
}) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-blur bg-opacity-50 p-4"
      style={{ zIndex: 100 }}
    >
      <div className="w-full max-w-sm sm:max-w-lg bg-gray-600 rounded-xl overflow-hidden">
        {/* Modal Header */}
        <div className="pt-5 pb-3 px-6 text-center bg-gray-700 text-white font-bold text-lg">
          Category Wise Highest Prices
        </div>

        {/* Table */}
        <div className="p-4 overflow-x-auto">
          {highestData && highestData.length > 0 ? (
            <table className="w-full border-collapse text-white">
              <thead>
                <tr className="bg-gray-800">
                  <th className="py-2 px-3 border border-gray-700">Category</th>
                  <th className="py-2 px-3 border border-gray-700">Price</th>
                </tr>
              </thead>
              <tbody>
                {highestData.map((item, index) => (
                  <tr key={index} className="text-center bg-gray-700">
                    <td className="py-2 px-3 border border-gray-600">
                      {item.category_name}
                    </td>
                    <td className="py-2 px-3 border border-gray-600">
                      ${item.highest_price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-300">No data available</p>
          )}
        </div>

        {/* Buttons */}
        <div className="pt-3 pb-5 px-6 text-right bg-gray-600 flex justify-end">
          <button
            className="py-2 px-5 font-semibold text-gray-200 bg-gray-500 hover:bg-gray-400 rounded-lg transition duration-200"
            onClick={() =>
              setCategoryWiseHighestPrice(!categoryWiseHighestPrice)
            }
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryWiseHighestPriceModal;
