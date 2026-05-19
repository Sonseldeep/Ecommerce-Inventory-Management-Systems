export const navLinkClass = ({ isActive }) =>
  `px-3 py-1.5 rounded-md transition text-sm font-medium ${
    isActive
      ? "bg-black text-white"
      : "text-gray-700 hover:bg-gray-100"
  }`;