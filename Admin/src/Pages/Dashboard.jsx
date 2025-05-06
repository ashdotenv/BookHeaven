import React from "react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-title">Total Books</div>
            <div className="stat-value">120</div>
            <div className="stat-desc">+10 this month</div>
          </div>
        </div>
        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-title">Total Users</div>
            <div className="stat-value">350</div>
            <div className="stat-desc">+25 this month</div>
          </div>
        </div>
        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-title">Orders</div>
            <div className="stat-value">87</div>
            <div className="stat-desc">+5 this week</div>
          </div>
        </div>
      </div>
      <div className="mt-12 w-full max-w-4xl">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Welcome, Admin!</h2>
            <p>This is your dashboard. Here you can manage books, users, and orders. Use the navigation to access different sections of the admin panel.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;