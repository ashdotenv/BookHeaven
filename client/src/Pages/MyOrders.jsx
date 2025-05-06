import React from "react";
import { useGetMyOrdersQuery, useCancelOrderMutation } from "../Redux/APIService";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const MyOrders = () => {
  const user = useSelector((state) => state.auth.user);
  const { data: orders, isLoading, isError, refetch } = useGetMyOrdersQuery(undefined, { skip: !user });
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  const handleCancel = async (orderId) => {
    if (window.confirm("Do you want to cancel this order?")) {
      try {
        await cancelOrder(orderId).unwrap();
        toast.success("Order cancelled successfully!");
        refetch();
      } catch (err) {
        toast.error("Failed to cancel order");
      }
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-lg mb-4">Please <Link to="/login" className="link link-primary">login</Link> to view your orders.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-96 text-error">
        Failed to load orders.
      </div>
    );
  }

  if (!orders || !orders.length) {
    return (
      <div className="p-8 max-w-3xl mx-auto text-center text-gray-500">You have no orders yet.</div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="card bg-base-100 shadow-md p-6">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Order ID: {order.id}</span>
              <span className={
                order.status === "Cancelled"
                  ? "badge bg-red-500 text-white"
                  : order.status === "Pending"
                  ? "badge bg-yellow-400 text-black"
                  : order.status === "Completed"
                  ? "badge bg-green-500 text-white"
                  : "badge badge-info"
              }>{order.status}</span>
            </div>
            <div className="mb-2 text-sm text-gray-500">Placed on: {new Date(order.createdAt).toLocaleString()}</div>
            <div className="mb-2">Shipping Address: {order.shippingAddress}</div>
            <div className="mb-2">Payment Method: {order.paymentMethod}</div>
            <div className="mb-2">Claim Code: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{order.claimCode}</span></div>
            <div className="mb-2">Total Amount: <span className="font-bold text-success">${order.totalAmount}</span></div>
            <div className="mt-2">
              <span className="font-semibold">Items:</span>
              <ul className="list-disc ml-6">
                {order.items && order.items.map((item, idx) => (
                  <li key={idx}>Book ID: {item.bookId}, Quantity: {item.quantity}</li>
                ))}
              </ul>
            </div>
            {order.status !== "Cancelled" && order.status !== "Completed" && (
              <button
                className="btn btn-error btn-sm mt-4"
                onClick={() => handleCancel(order.id)}
                disabled={isCancelling}
              >
                {isCancelling ? "Cancelling..." : "Cancel Order"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;