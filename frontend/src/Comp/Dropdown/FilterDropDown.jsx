import React from "react";

const FilterDropDown = ({
  headers,
  filterDropDown,
  setFilterDropDown,
  products,
}) => {
  return (
    <thead className="bg-blue-500 text-white">
      <tr>
        {headers.map((header) => (
          <th
            key={header}
            className="p-3 relative cursor-pointer"
            onClick={() =>
              setFilterDropDown(filterDropDown === header ? null : header)
            }
          >
            <div className="flex items-center justify-between">
              <span>{header}</span>
              <div className="relative cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            {filterDropDown === header && (
              <div
                className="absolute z-10 mt-2 w-56 rounded-md border border-gray-100 bg-white shadow-lg"
                role="menu"
              >
                <div className="p-2 space-y-2">
                  {products?.map((product, index) => (
                    <span
                      key={index}
                      className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 border-2 border-gray-100 cursor-pointer"
                    >
                      {product.product_name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default FilterDropDown;
