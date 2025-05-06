import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, setUser } from "../Redux/authSlice";

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = () => {
      const localUser = localStorage.getItem("user");
      const localToken = localStorage.getItem("token");
      if (localUser && localToken) dispatch(setUser(JSON.parse(localUser)));
      else dispatch(setUser(null));
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };
  const dashboardItems = [
    { name: "Dashboard", link: "/dashboard" },
    { name: "My Orders", link: "/orders" },
    { name: "Bookmarks", link: "/bookmarks" },
    { name: "Reviews", link: "/reviews" },
    { name: "Logout", link: "/logout" },
  ];

  const browseCategories = [
    { name: "All Books", link: "/books" },
    { name: "Bestsellers", link: "/bestsellers" },
    { name: "Award Winners", link: "/awards" },
    { name: "New Releases", link: "/new-releases" },
    { name: "New Arrivals", link: "/new-arrivals" },
    { name: "Coming Soon", link: "/coming-soon" },
    { name: "Deals", link: "/deals" },
  ];

  return (
    <div className="navbar bg-base-100 shadow-sm px-4 sticky top-0 z-50">
      <div className="flex-1">
        <Link to="/" className="text-xl font-bold text-primary">
          Book Library
        </Link>
      </div>

      <div className="flex-none gap-4">
        {/* Categories Dropdown */}
        <div className="dropdown dropdown-hover">
          <label tabIndex={0} className="btn btn-ghost">
            Browse
          </label>
          <ul
            tabIndex={0}
            className="menu dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-56 z-[1]"
          >
            {browseCategories.map((item) => (
              <li key={item.name}>
                <Link to={item.link}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Cart Link (if user logged in) */}
        {user && (
          <Link to="/cart" className="btn btn-ghost">
            Cart
          </Link>
        )}

        {/* User Auth Buttons */}
        {!user ? (
          <>
            <Link to="/login" className="btn btn-outline btn-sm btn-primary">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Register
            </Link>
          </>
        ) : (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-8 rounded-full bg-primary text-white flex items-center justify-center">
                {user.fullName?.[0]?.toUpperCase() || "U"}
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              {dashboardItems.map((item) => (
                <li key={item.name}>
                  {item.name === 'Logout' ? (
                    <Link to="/login" onClick={handleLogout}>{item.name}</Link>
                  ) : (
                    <Link to={item.link}>{item.name}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
