import React, { useState } from "react";

const FilterDropDown = ({
  headers,
  setFilterDropDown,
  products,
  setFilterWithSubHeader,
}) => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const headerKeyMap = {
    "Product Name": "product_name",
    Price: "price",
    Category: "category_name",
    Material: "material_name",
    Media_URL: "media_url",
    SKU_ID: "SKU_VALUE",
  };

  const priceFilter = ["0-500", "501-1000", "1000"];

  const filterFun = (product, header, index) => {
    setFilterWithSubHeader({
      filterSubHeader:
        header === "Media_URL"
          ? "Null"
          : header === "Category"
          ? product.category_id
          : header === "Material"
          ? product.material_id
          : header === "Price"
          ? priceFilter[index]
          : product[headerKeyMap[header]],
      filterHeader: headerKeyMap[header],
    });
    setActiveDropdown(null);  
  };

  return (
    <thead className="bg-blue-500 text-white">
      <tr>
        {headers.map((header) => (
          <th
            key={header}
            className="p-3 relative cursor-pointer"
            onClick={() => {
              if (header !== "Operations" && header !== "Product ID") {
                setFilterDropDown(header);
              }
            }}
          >
            <div className="flex items-center justify-center">
              <span>{header}</span>
              {header !== "Operations" && header !== "Product ID" ? (
                <div
                  className="relative cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();  
                    setActiveDropdown(
                      activeDropdown === header ? null : header
                    );
                  }}
                >
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
              ) : (
                ""
              )}
            </div>

            {activeDropdown === header && (
              <div
                className="absolute z-10 mt-2 w-56 rounded-md border border-gray-100 bg-white shadow-lg"
                role="menu"
              >
                <div className="p-2 space-y-2">
                  {products?.map((product, index) => (
                    <div key={index}>
                      <span
                        key={index}
                        className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 border-2 border-gray-100 cursor-pointer"
                        onClick={() => filterFun(product, header, index)}
                      >
                        {headerKeyMap[header] === "price"
                          ? priceFilter[index]
                          : headerKeyMap[header] === "media_url"
                          ? "Null"
                          : product[headerKeyMap[header]]}
                      </span>
                    </div>
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
