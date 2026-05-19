
// import { NavLink } from "react-router-dom";
// import "./AdminNav.css";

import { NavLink } from "react-router-dom";
import { adminLinks } from "../../constants/adminLinks";
import { navLinkClass } from "../../utils/navLinkClass";



export default function AdminNav() {
  return (
    <>
      <span className="text-gray-300 mx-1">|</span>

      {adminLinks.map((link) => (
        <NavLink key={link.to} to={link.to} className={navLinkClass}>
          {link.label}
        </NavLink>
      ))}
    </>
  );
}