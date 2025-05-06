import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useGetCartItemsQuery } from "../Redux/APIService";
import { Link } from "react-router-dom";
import { useGetBookByIdQuery } from "../Redux/APIService";
import { usePlaceOrderMutation } from "../Redux/APIService";
import toast from "react-hot-toast";

const OrderBook = ({ bookId, quantity, onIncrease, onDecrease }) => {
  const { data: book, isLoading, isError } = useGetBookByIdQuery(bookId);
  if (isLoading) {
    return (
      <div className="card bg-base-100 shadow-md flex flex-row items-center p-4 gap-6">
        <span className="loading loading-spinner loading-sm"></span>
        <span>Loading book details...</span>
      </div>
    );
  }
  if (isError || !book) {
    return (
      <div className="card bg-base-100 shadow-md flex flex-row items-center p-4 gap-6 text-error">
        Failed to load book details.
      </div>
    );
  }
  return (
    <div key={book.id} className="card bg-base-100 shadow-md flex flex-row items-center p-4 gap-6">
      <img
        src={`https://localhost:7018/${book.image}`}
        alt={book.title}
        className="h-24 w-16 object-cover rounded"
      />
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{book.title}</h3>
        <p className="text-gray-600">by {book.author}</p>
        <p className="text-success font-bold">${book.price}</p>
        <div className="flex items-center gap-2 mt-2">
          <button className="btn btn-sm btn-outline" onClick={onDecrease} disabled={quantity <= 1}>-</button>
          <span className="font-semibold">{quantity}</span>
          <button className="btn btn-sm btn-outline" onClick={onIncrease}>+</button>
        </div>
      </div>
    </div>
  );
};

const Order = () => {
  const user = useSelector((state) => state.auth.user);
  const userId = user?.id;
  console.log(userId);
  const { data, isLoading, isError } = useGetCartItemsQuery(userId, { skip: !userId });

  const items = Array.isArray(data) ? data : Array.isArray(data?.Items) ? data.Items : [];

  // Local state for quantities
  const [quantities, setQuantities] = useState(() => {
    const initial = {};
    items.forEach((item) => {
      initial[item.bookId] = 1;
    });
    return initial;
  });
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const handleIncrease = (bookId) => {
    setQuantities((prev) => ({ ...prev, [bookId]: prev[bookId] + 1 }));
  };

  const handleDecrease = (bookId) => {
    setQuantities((prev) => ({ ...prev, [bookId]: Math.max(1, prev[bookId] - 1) }));
  };

  const [placeOrder, { isLoading: isPlacingOrder }] = usePlaceOrderMutation();

  const handlePlaceOrder = async () => {
    if (!userId || !items.length || !shippingAddress || !paymentMethod) return;
    const orderPayload = {
      items: items.map((item) => ({
        bookId: item.bookId,
        quantity: quantities[item.bookId] || 1,
      })),
      shippingAddress,
      paymentMethod,
    };
    try {
      await placeOrder(orderPayload).unwrap();
      toast.success("Order placed successfully!");
    } catch (err) {
      toast.error("Failed to place order");
    }
  };
  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-lg mb-4">Please <Link to="/login" className="link link-primary">login</Link> to view your order.</p>
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
        Failed to load order items.
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="p-8 max-w-3xl mx-auto text-center text-gray-500">Your cart is empty.</div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Shipping Address</label>
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Enter your shipping address"
          value={shippingAddress}
          onChange={e => setShippingAddress(e.target.value)}
        />
      </div>
      <div className="mb-6">
        <label className="block font-semibold mb-1">Payment Method</label>
        <select
          className="select select-bordered w-full"
          value={paymentMethod}
          onChange={e => setPaymentMethod(e.target.value)}
        >
          <option value="">Select payment method</option>
          <option value="Cash">Cash</option>
          <option value="Card">Card</option>
          <option value="UPI">UPI</option>
        </select>
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <OrderBook
            key={item.bookId}
            bookId={item.bookId}
            quantity={quantities[item.bookId] || 1}
            onIncrease={() => handleIncrease(item.bookId)}
            onDecrease={() => handleDecrease(item.bookId)}
          />
        ))}
      </div>
      <button
        className="btn btn-primary btn-block mt-6"
        onClick={handlePlaceOrder}
        disabled={isPlacingOrder || !items.length || !shippingAddress || !paymentMethod}
      >
        {isPlacingOrder ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
};

export default Order;