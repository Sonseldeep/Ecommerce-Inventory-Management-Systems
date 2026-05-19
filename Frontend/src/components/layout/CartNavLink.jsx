import { NavLink } from "react-router-dom";
import { navLinkClass } from "../../utils/navLinkClass";

export default function CartNavLink({ count }) {
  return (
    <NavLink to="/cart" className={navLinkClass}>
      <span className="relative">
        Cart

        {count > 0 && (
          <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full px-1.5">
            {count}
          </span>
        )}
      </span>
    </NavLink>
  );
}