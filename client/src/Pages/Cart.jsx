import React from "react";
import { useSelector } from "react-redux";
import { useGetCartItemsQuery, useRemoveFromCartMutation } from "../Redux/APIService";
import toast from "react-hot-toast";
import { Link, Links } from "react-router-dom";
import { useGetBookByIdQuery } from "../Redux/APIService";

const CartBook = ({ bookId, onRemove, isRemoving }) => {
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
      </div>
      <button
        className="btn btn-error btn-sm"
        onClick={() => onRemove(book.id)}
        disabled={isRemoving}
      >
        Remove
      </button>
    </div>
  );
};

const Cart = () => {
  const user = useSelector((state) => state.auth.user);
  const userId = user?.id;
  const { data, isLoading, isError, refetch } = useGetCartItemsQuery(userId, { skip: !userId });
  const [removeFromCart, { isLoading: isRemoving }] = useRemoveFromCartMutation();

  const items = Array.isArray(data) ? data : Array.isArray(data?.Items) ? data.Items : [];

  const handleRemove = async (bookId) => {
    if (!userId || !bookId) return;
    try {
      await removeFromCart({ userId, bookId }).unwrap();
      toast.success("Removed from cart");
      refetch();
    } catch (err) {
      toast.error("Failed to remove from cart");
    }
  };

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-lg mb-4">Please <Link to="/login" className="link link-primary">login</Link> to view your cart.</p>
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
        Failed to load cart items.
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
      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <CartBook key={item.bookId} bookId={item.bookId} onRemove={handleRemove} isRemoving={isRemoving} />
        ))}
      </div>
      <Link to={"/order"} className="btn btn-primary btn-block mt-6">
        Checkout
      </Link>
    </div>
  );
};

export default Cart;