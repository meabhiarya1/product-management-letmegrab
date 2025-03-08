import React from "react";

const Dropdown = ({ setDropDown, dropDown, setLimit, limit }) => {
  return (
    <div className="relative mt-2">
      <div
        className="inline-flex items-center overflow-hidden rounded-md  bg-white shadow-sm cursor-pointer justify-end" 
        onClick={() => setDropDown(!dropDown)}
      >
        <div className="px-4 py-2 text-sm/none text-gray-600 hover:bg-gray-50 hover:text-gray-700">
          {limit}
        </div>

        <button className="h-full p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-700">
          <span className="sr-only">Menu</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {dropDown && (
        <div
          className="absolute end-0 z-10  w-20 rounded-md border border-gray-100 bg-white shadow-lg"
          role="menu"
        >
          <div className="p-2 space-y-2">
            <span
              className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 border-2 border-gray-100 cursor-pointer"
              onClick={() => {
                setLimit(5);
                setDropDown(!dropDown);
              }}
            >
              5
            </span>
            <span
              className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 border-2 border-gray-100 cursor-pointer"
              onClick={() => {
                setLimit(10);
                setDropDown(!dropDown);
              }}
            >
              10
            </span>

            <span
              className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 border-2 border-gray-100 cursor-pointer"
              onClick={() => {
                setLimit(15);
                setDropDown(!dropDown);
              }}
            >
              15
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
