import React from "react";
import { Link, Outlet } from "react-router-dom";

const SidebarLayout = () => {
  return (
    <div className="drawer lg:drawer-open min-h-screen">
      <input id="admin-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <div className="w-full navbar bg-base-100 shadow mb-4">
          <label htmlFor="admin-drawer" className="btn btn-square btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </label>
          <span className="ml-2 font-bold text-xl">Admin Panel</span>
        </div>
        <div className="p-4 flex-1">
          <Outlet />
        </div>
      </div>
      <div className="drawer-side">
        <label htmlFor="admin-drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 w-64 min-h-full bg-base-200 text-base-content">
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/dashboard/books">Books</Link></li>
          <li><Link to="/dashboard/users">Users</Link></li>
          <li><Link to="/dashboard/orders">Orders</Link></li>
          <li><Link to="/dashboard/logout">Logout</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default SidebarLayout;