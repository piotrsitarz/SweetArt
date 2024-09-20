import React, { useState } from "react";

const Collapsible = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative w-full max-w-md mx-auto mb-4 cursor-pointer"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm mt-4">
        <span className="font-semibold text-gray-800">{title}</span>
        <svg
          className={`w-6 h-6 transition-transform duration-200 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <div
        className={`transition-max-height duration-500 ease-in-out overflow-auto mt-2 ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
        style={{ scrollbarWidth: "thin", scrollbarColor: "#4a4a4a #e5e5e5" }} // For Firefox
      >
        <div className="px-4 py-2 bg-white rounded-lg shadow-md border-2">
          {children}
        </div>
      </div>
      <style jsx>{`
        .collapsible-content::-webkit-scrollbar {
          width: 8px;
        }
        .collapsible-content::-webkit-scrollbar-track {
          background: #e5e5e5;
        }
        .collapsible-content::-webkit-scrollbar-thumb {
          background: #4a4a4a;
          border-radius: 10px;
        }
        .collapsible-content::-webkit-scrollbar-thumb:hover {
          background: #333;
        }
      `}</style>
    </div>
  );
};

export default Collapsible;
